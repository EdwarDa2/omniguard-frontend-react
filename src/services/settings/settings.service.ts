import apiClient from '@/services/api/client'
import type {
  NotificationSettingsResponse,
  SeverityRules,
  UsersResponse,
  CreateUserInput,
  PlatformUserDto,
  NotificationTestResponse,
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
  async updateDiscord(webhookUrl: string): Promise<{ status: string; isConfigured: boolean; message: string }> {
    const response = await apiClient.put<{ status: string; isConfigured: boolean; message: string }>(
      '/settings/notifications/discord',
      { webhookUrl },
    )
    return response.data
  },

  /**
   * Actualiza los Chat IDs de destino para Telegram.
   */
  async updateTelegram(chatIds: string): Promise<{ status: string; isConfigured: boolean; message: string }> {
    const response = await apiClient.put<{ status: string; isConfigured: boolean; message: string }>(
      '/settings/notifications/telegram',
      { chatIds },
    )
    return response.data
  },

  /**
   * Guarda los umbrales de severidad que disparan alertas hacia el Blue Team.
   */
  async updateSeverityRules(rules: SeverityRules): Promise<{ status: string; message: string }> {
    const response = await apiClient.put<{ status: string; message: string }>(
      '/settings/notifications/rules',
      rules,
    )
    return response.data
  },

  /**
   * Envía una notificación sintética de prueba a Discord o Telegram.
   */
  async testChannel(channel: 'discord' | 'telegram'): Promise<NotificationTestResponse> {
    const response = await apiClient.post<NotificationTestResponse>(
      `/settings/notifications/test/${channel}`,
    )
    return response.data
  },

  /**
   * Obtiene la lista de operadores y métricas de IAM.
   */
  async getUsers(page = 0, size = 50): Promise<UsersResponse> {
    const response = await apiClient.get<UsersResponse>('/users', {
      params: { page, size },
    })
    return response.data
  },

  /**
   * Crea un nuevo analista registrando su usuario en la base de datos de IAM (contraseña generada por backend).
   */
  async createUser(input: CreateUserInput): Promise<PlatformUserDto> {
    const response = await apiClient.post<PlatformUserDto>('/users', {
      name: input.name,
      email: input.email,
      role: input.role,
    })
    return response.data
  },

  /**
   * Modifica el estado de acceso de un analista (Activo / Revocado).
   */
  async updateUserStatus(id: string, status: 'Activo' | 'Revocado'): Promise<PlatformUserDto> {
    const response = await apiClient.patch<PlatformUserDto>(`/users/${id}/status`, { status })
    return response.data
  },

  /**
   * Elimina un usuario de la plataforma.
   */
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`)
  },
}

export default settingsService
