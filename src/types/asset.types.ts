export interface AssetPort {
  port: number
  proto: string
  service: string
  version: string
  status: 'ABIERTO' | 'FILTRADO' | 'CERRADO' | string
}

export interface AssetVulnerability {
  cveId: string
  cvss?: number
  cvssScore?: number
  severity: string
  servicePort?: string
  description: string
  validationNote?: string
}

export interface AssetItem {
  id: number
  hostname: string
  ip: string
  description: string
  os: string
  lastScanned: string
  status: string
  portsCount: number
  hasCve: boolean
  cveSeverity: string
  severityLabel: string
  ports: AssetPort[]
  vulnerabilities: AssetVulnerability[]
}

export interface AssetsKpisDto {
  totalAssets: number
  exposedPorts: number
  vulnerableAssets: number
  highestSeverity: string
}

export interface AssetsResponse {
  kpis: AssetsKpisDto
  assets: AssetItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
