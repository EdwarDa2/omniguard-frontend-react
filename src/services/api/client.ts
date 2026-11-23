import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

/**
 * Cliente HTTP principal configurado para OmniGuard SOC.
 *
 * Directivas de seguridad:
 * - withCredentials: true es mandatorio para que el navegador adjunte y reciba
 *   las cookies HttpOnly de PASETO (at = access token, rt = refresh token).
 * - Cero almacenamiento de tokens en localStorage o sessionStorage.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Variables para controlar la cola de peticiones durante la renovación silenciosa
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve()
    }
  })
  failedQueue = []
}

/**
 * Interceptor de respuestas para manejo de sesiones y códigos de error.
 * Captura 401 Unauthorized y llama silenciosamente a /auth/refresh con la cookie rt.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Ignorar si el endpoint con error es precisamente login o refresh para evitar bucles infinitos
    const requestUrl = originalRequest?.url || ''
    const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh')

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Encolar peticiones paralelas mientras se renueva el token
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Solicitar renovación silenciosa (el navegador envía automáticamente la cookie HttpOnly rt)
        await apiClient.post('/auth/refresh')
        processQueue(null)
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as AxiosError)
        // Si el refresh token caducó o fue revocado, emitir evento para redirigir a login
        window.dispatchEvent(new CustomEvent('omniguard:session-expired'))
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
