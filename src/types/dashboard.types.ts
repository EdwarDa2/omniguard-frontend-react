import type { SeverityLevel } from '@/types/soc.types'

export interface KpiMetric {
  title: string
  value: number | string
  level: SeverityLevel
}

export interface TrafficDataPoint {
  time: string
  inbound: number
  outbound: number
}

export interface TrafficActivity {
  currentPacketsPerSec: number
  bandwidthMbps: number
  sensorStatus: string
  timeSeries: TrafficDataPoint[]
  sensorId?: string
}

export interface RecentAlertDto {
  id: string
  time: string
  sourceIp: string
  threat: string
  severity: SeverityLevel
  timestamp?: string
}

export interface DashboardStatsResponse {
  kpis: {
    openPorts: KpiMetric
    activeThreats: KpiMetric
    vulnerableAssets: KpiMetric
    alerts24h: KpiMetric
  }
  trafficActivity: TrafficActivity
  recentAlerts: RecentAlertDto[]
}
