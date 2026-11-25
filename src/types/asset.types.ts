export interface PortVulnBadge {
  count: number
  severity: string // ej. "ALTA", "CRÍTICA", "MEDIA", "BAJA"
}

export interface AssetPort {
  port: number
  proto: string // "TCP" | "UDP"
  service: string // "SSH", "HTTP", etc.
  version: string // "OpenSSH 8.9p1"
  status: 'ABIERTO' | 'FILTRADO' | 'CERRADO' | string
  vulnBadge?: PortVulnBadge | null
}

// Alias canónico backend
export type DiscoveredPort = AssetPort

export interface AssetVulnerability {
  cveId: string // "CVE-2023-38408"
  cvss?: number // 9.8
  cvssScore?: number // retrocompatibilidad con componentes existentes
  severity: string // "CRÍTICA" | "ALTA" | "MEDIA" | "BAJA"
  servicePort?: string
  description: string
  validationNote?: string
}

// Alias canónico backend
export type CorrelatedCve = AssetVulnerability

export interface AssetItem {
  id: number
  hostname: string
  ip: string
  description: string
  os: string
  lastScanned: string // ISO-8601
  status: string // "active" | "inactive" | "unknown"
  portsCount: number
  hasCve: boolean
  cveSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NORMAL' | string
  severityLabel: string
  cvssScore?: number
  ports: AssetPort[]
  vulnerabilities: AssetVulnerability[]
}

// Alias canónico backend
export type AssetDetailResponse = AssetItem

export interface AssetsKpisDto {
  totalAssets: number
  exposedPorts: number
  vulnerableAssets: number
  highestSeverity: 'CRITICAL' | 'HIGH' | 'WARNING' | 'NORMAL' | string
}

export interface AssetsResponse {
  kpis: AssetsKpisDto
  assets: AssetItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

// Alias canónico backend
export type AssetListResponse = AssetsResponse

/**
 * Payload recibido mediante el evento SSE scan:completed
 */
export interface ScanCompletedEventPayload {
  scanId: string
  assetId: number
  targetIp: string
  status: 'COMPLETED'
  openPortsCount: number
  scannedAt: string // ISO-8601
}

/**
 * Respuesta síncrona 202 Accepted al disparar un escaneo
 */
export interface ScanResponse {
  scanId: string
  scan_id?: string
  target: string
  status: 'QUEUED' | string
  message: string
}

export interface TriggerScanRequest {
  ports?: string // Formato rango "1-1024" o lista "22,80,443"
}
