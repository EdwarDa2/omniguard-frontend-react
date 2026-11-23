import { create } from 'zustand'
import { authService } from '@/services/auth/auth.service'
import type { AuthUser, LoginCredentials } from '@/types/auth.types'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  isCheckingAuth: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,
  error: null,

  /**
   * Intenta autenticar al usuario contra el backend de Spring Boot.
   */
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null })
    try {
      const user = await authService.login(credentials)
      set({ user, isAuthenticated: true, isLoading: false, error: null })
      return true
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } }
      const message =
        errorResponse.response?.data?.message || 'Credenciales incorrectas o servidor no disponible'
      set({ error: message, isAuthenticated: false, user: null, isLoading: false })
      return false
    }
  },

  /**
   * Cierra la sesión activa en el backend y limpia el estado global.
   */
  logout: async () => {
    set({ isLoading: true })
    try {
      await authService.logout()
    } catch {
      // Ignorar si el token ya caducó
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, error: null })
    }
  },

  /**
   * Comprueba si el navegador ya cuenta con cookies de sesión activas (PASETO).
   */
  checkAuth: async () => {
    set({ isCheckingAuth: true })
    try {
      const user = await authService.getMe()
      set({ user, isAuthenticated: true, isCheckingAuth: false, error: null })
      return true
    } catch {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false })
      return false
    }
  },

  clearError: () => set({ error: null }),
}))

// Escuchar evento global cuando la sesión expire por inactividad
if (typeof window !== 'undefined') {
  window.addEventListener('omniguard:session-expired', () => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isCheckingAuth: false })
  })
}
