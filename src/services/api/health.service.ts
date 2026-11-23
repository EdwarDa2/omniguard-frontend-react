import apiClient from './client'

export interface BackendHealthStatus {
  isOnline: boolean
  statusCode?: number
  message?: string
}

/**
 * Servicio para verificar la conectividad con el backend de Spring Boot.
 * Realiza una petición hacia la API a través del proxy configurado.
 */
export async function checkBackendConnectivity(): Promise<BackendHealthStatus> {
  try {
    // Probamos el endpoint de autenticación actual (/auth/me) o salud
    const response = await apiClient.get('/auth/me', {
      validateStatus: (status) => status < 500, // 401 o 403 significan que el backend responde y está activo
    })

    return {
      isOnline: true,
      statusCode: response.status,
      message: response.status === 200 ? 'Autenticado' : 'Backend online (Sesión no iniciada)',
    }
  } catch (error: unknown) {
    const err = error as { message?: string; response?: { status?: number } }
    return {
      isOnline: false,
      statusCode: err.response?.status,
      message: err.message || 'No se pudo conectar con el backend de OmniGuard SOC',
    }
  }
}
