export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'WARNING' | 'LOW' | 'INFO' | 'NORMAL'
export type AlertStatus = 'OPEN' | 'NUEVA' | 'EN_INVESTIGACION' | 'INVESTIGATING' | 'RESUELTA' | 'RESOLVED' | 'FALSO_POSITIVO' | 'FALSE_POSITIVE'

export interface AlertDto {
  id: number
  rule: string
  severity: AlertSeverity
  title: string
  description: string
  sourceIp: string
  destinationIp: string
  destinationPort: number
  protocol: string
  appProtocol: string
  status: AlertStatus
  resolutionNotes?: string
  detectedAt: string
}

export interface PaginatedAlertsResponse {
  items: AlertDto[]
  total: number
  page: number
  size: number
}

export interface AlertFilterParams {
  page?: number
  size?: number
  severity?: string
  status?: string
  search?: string
}

export interface UpdateAlertStatusPayload {
  status: string
  resolutionNotes?: string
}
