export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'WARNING' | 'INFO' | 'NORMAL'

export type IncidentStatus = 'NUEVA' | 'EN_INVESTIGACION' | 'RESUELTA' | 'FALSO_POSITIVO'

export type UserRole = 'Admin' | 'Viewer'

export type UserStatus = 'Activo' | 'Pendiente' | 'Revocado'

export interface KpiCardData {
  title: string
  value: string | number
  levelText?: string
  level?: SeverityLevel
  trend?: string
}

export interface RecentAlertItem {
  id: string
  time: string
  sourceIp: string
  threat: string
  severity: SeverityLevel
}

export interface DetailedAlert {
  id: string
  timestamp: string
  threatName: string
  severity: SeverityLevel
  status: IncidentStatus
  sourceIp: string
  destinationIp: string
  protocol: string
  port: number
  service: string
  sensor: string
  interface: string
  heuristicRule: string
  observedAttempts: number
  threshold: number
  mitigationSuggestion: string
  notifiedChannels?: string[]
}

export interface Vulnerability {
  cveId: string
  cvssScore: number
  severity: SeverityLevel
  affectedService: string
  port: number
  protocol: string
  description: string
  recommendation?: string
}

export interface OpenPort {
  port: number
  protocol: string
  service: string
  version: string
  status: 'ABIERTO' | 'FILTRADO' | 'CERRADO'
  vulnerabilitiesCount: number
  highestSeverity?: SeverityLevel
}

export interface NetworkAsset {
  id: string
  hostname: string
  ip: string
  description: string
  os: string
  lastScanned: string
  openPortsCount: number
  vulnerabilitiesCount: number
  highestSeverity?: SeverityLevel
  ports: OpenPort[]
  vulnerabilities: Vulnerability[]
}

export interface PlatformUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  lastLogin: string
  isCurrentUser?: boolean
}

export interface NotificationSettings {
  discordWebhookUrl: string
  isDiscordConfigured: boolean
  telegramChatIds: string
  isTelegramConfigured: boolean
  notifyOnCritical: boolean
  notifyOnHigh: boolean
  notifyOnMedium: boolean
  notifyOnLow: boolean
}

