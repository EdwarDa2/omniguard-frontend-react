import apiClient from '@/services/api/client'
import type {
  NotificationSettingsResponse,
  SeverityRules,
  UsersResponse,
  CreateUserInput,
} from '@/types/settings.types'

/**
 * Servicio para gestionar la configuración de notificaciones externas e IAM en OmniGuard SOC.
 */
export const settingsService = {
  /**
   * Obtiene la configuración actual de webhooks de Discord, Telegram y reglas de severidad.
   */
  async getNotificationSettings(): Promise<NotificationSettingsResponse> {
    const response = await apiClient.get<NotificationSettingsResponse>(
      '/settings/notifications',
    )
    return response.data
  },

  /**
   * Actualiza la URL de webhook para Discord.
   */
  async updateDiscord(webhookUrl: string): Promise<void> {
    await apiClient.put('/settings/notifications/discord', { webhookUrl })
  },

  /**
   * Actualiza los Chat IDs de destino para Telegram.
   */
  async updateTelegram(chatIds: string): Promise<void> {
    await apiClient.put('/settings/notifications/telegram', { chatIds })
  },

  /**
   * Guarda los umbrales de severidad que disparan alertas hacia el Blue Team.
   */
  async updateSeverityRules(rules: SeverityRules): Promise<void> {
    await apiClient.put('/settings/notifications/rules', rules)
  },

  /**
   * Envía una notificación sintética de prueba a Discord o Telegram.
   */
  async testChannel(channel: 'discord' | 'telegram'): Promise<{ message?: string }> {
    const response = await apiClient.post<{ message?: string }>(
      `/settings/notifications/test/${channel}`,
    )
    return response.data
  },

  /**
   * Obtiene la lista de operadores y métricas de IAM.
   */
  async getUsers(): Promise<UsersResponse> {
    const response = await apiClient.get<UsersResponse>('/users')
    return response.data
  },

  /**
   * Crea un nuevo analista registrando su usuario en la base de datos de IAM.
   */
  async createUser(input: CreateUserInput): Promise<void> {
    const username = input.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const role = input.role === 'Admin' ? 'ROLE_ADMIN' : 'ROLE_VIEWER'
    const password = input.password || 'OmniGuard2026!'

    await apiClient.post('/auth/register', {
      username,
      email: input.email,
      password,
      role,
    })
  },

  /**
   * Modifica el estado de acceso de un analista (Activo / Revocado).
   */
  async updateUserStatus(id: string, status: string): Promise<void> {
    await apiClient.patch(`/users/${id}/status`, { status })
  },
}

export default settingsService
