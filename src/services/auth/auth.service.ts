import apiClient from '@/services/api/client'
import type { AuthUser, LoginCredentials } from '@/types/auth.types'

/**
 * Servicio de Autenticación para OmniGuard SOC.
 *
 * Comunica con el Core Backend Java en /api/v1/auth.
 * Las cookies PASETO (at, rt) son inyectadas y destruidas automáticamente
 * por el navegador a través de cabeceras Set-Cookie HttpOnly.
 */
export const authService = {
  /**
   * Inicia sesión en la plataforma y establece las cookies de sesión seguras.
   */
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const response = await apiClient.post<AuthUser>('/auth/login', credentials)
    return response.data
  },

  /**
   * Obtiene los datos del analista u operador actualmente autenticado.
   */
  async getMe(): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>('/auth/me')
    return response.data
  },

  /**
   * Renueva silenciosamente el token de acceso usando la cookie rt.
   */
  async refresh(): Promise<void> {
    await apiClient.post('/auth/refresh')
  },

  /**
   * Invalida la sesión activa en backend y destruye las cookies en el cliente.
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },
}

export default authService
