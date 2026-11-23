export interface AuthUser {
  id: number
  username: string
  email: string
  role: 'ROLE_ADMIN' | 'ROLE_VIEWER' | string
  isActive: boolean
  lastLoginAt?: string
  createdAt?: string
}

export interface LoginCredentials {
  username: string
  password: string
}
