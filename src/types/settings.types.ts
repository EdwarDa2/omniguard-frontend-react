import type { PlatformUser } from '@/types/soc.types'

export interface DiscordSettings {
  webhookUrlMasked: string
  isConfigured: boolean
}

export interface TelegramSettings {
  chatIds: string
  isConfigured: boolean
}

export interface SeverityRules {
  notifyCritical: boolean
  notifyHigh: boolean
  notifyMedium: boolean
  notifyLow: boolean
}

export interface NotificationSettingsResponse {
  discord: DiscordSettings
  telegram: TelegramSettings
  severityRules: SeverityRules
}

export interface UserMetrics {
  activeCount: number
  adminCount: number
  revokedCount: number
}

export interface UsersResponse {
  metrics: UserMetrics
  users: PlatformUser[]
}

export interface CreateUserInput {
  name: string
  email: string
  role: 'Admin' | 'Viewer'
  password?: string
}
