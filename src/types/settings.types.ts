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

export interface UpdateDiscordRequest {
  webhookUrl: string
}

export interface UpdateTelegramRequest {
  chatIds: string
}

export interface UpdateSeverityRulesRequest {
  notifyCritical: boolean
  notifyHigh: boolean
  notifyMedium: boolean
  notifyLow: boolean
}

export interface NotificationTestResponse {
  channel: 'discord' | 'telegram'
  delivered: boolean
  message: string
}

export interface UserMetricsDto {
  activeCount: number
  adminCount: number
  revokedCount: number
}

export interface PlatformUserDto {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Viewer'
  status: 'Activo' | 'Revocado'
  lastLogin: string
  isCurrentUser: boolean
}

export interface UserListResponseDto {
  metrics: UserMetricsDto
  users: PlatformUserDto[]
}

export interface CreateUserRequestDto {
  name: string
  email: string
  role?: 'Admin' | 'Viewer'
}

export interface UpdateUserStatusRequestDto {
  status: 'Activo' | 'Revocado'
}

// Aliases retrocompatibles
export type UserMetrics = UserMetricsDto
export type UsersResponse = UserListResponseDto
export type CreateUserInput = CreateUserRequestDto
