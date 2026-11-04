import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { AssetKpis } from './components/AssetKpis'
import { AssetList, type AssetSummary } from './components/AssetList'
import { AssetDetail, type AssetFullDetail } from './components/AssetDetail'
import styles from './AssetsView.module.css'

const mockAssetSummaries: AssetSummary[] = [
  {
    id: 'web-prod-01',
    hostname: 'web-prod-01',
    ip: '10.0.0.12',
    description: 'Servidor de producción',
    portsCount: 3,
    hasCve: true,
    cveSeverity: 'CRITICAL',
    severityLabel: 'CRITICA',
  },
  {
    id: 'db-prod-01',
    hostname: 'db-prod-01',
    ip: '10.0.0.18',
    description: 'Base de datos primaria PostgreSQL',
    portsCount: 2,
    hasCve: true,
    cveSeverity: 'HIGH',
    severityLabel: 'ALTA',
  },
  {
    id: 'edge-router',
    hostname: 'edge-router',
    ip: '10.0.0.1',
    description: 'Gateway perimetral VyOS',
    portsCount: 4,
    hasCve: true,
    cveSeverity: 'WARNING',
    severityLabel: 'MEDIA',
  },
  {
    id: 'workstation-04',
    hostname: 'workstation-04',
    ip: '10.0.0.45',
    description: 'Estación de trabajo analista TI',
    portsCount: 1,
    hasCve: true,
    cveSeverity: 'INFO',
    severityLabel: 'BAJA',
  },
  {
    id: 'fileserver-01',
    hostname: 'fileserver-01',
    ip: '10.0.0.24',
    description: 'Servidor de almacenamiento NFS / Samba',
    portsCount: 2,
    hasCve: true,
    cveSeverity: 'HIGH',
    severityLabel: 'ALTA',
  },
  {
    id: 'core-switch',
    hostname: 'core-switch',
    ip: '10.0.0.2',
    description: 'Switch troncal gestionado',
    portsCount: 2,
    hasCve: false,
    severityLabel: 'SIN CVES',
  },
]

const assetDetailsMap: Record<string, AssetFullDetail> = {
  'web-prod-01': {
    id: 'web-prod-01',
    hostname: 'web-prod-01',
    ip: '10.0.0.12',
    description: 'Servidor de producción',
    os: 'Ubuntu 22.04 LTS',
    lastScanned: '14:30 UTC',
    overallSeverity: 'CRITICAL',
    cvssScore: 8.8,
    ports: [
      {
        port: 22,
        proto: 'TCP',
        service: 'SSH',
        version: 'OpenSSH 8.9p1',
        status: 'ABIERTO',
        vulnBadge: { count: 1, severity: 'ALTA' },
      },
      {
        port: 80,
        proto: 'TCP',
        service: 'HTTP',
        version: 'Apache 2.4.50',
        status: 'ABIERTO',
        vulnBadge: { count: 1, severity: 'CRITICA' },
      },
      {
        port: 443,
        proto: 'TCP',
        service: 'HTTPS',
        version: 'nginx 1.24.0',
        status: 'ABIERTO',
      },
    ],
    vulnerabilities: [
      {
        cveId: 'CVE-2021-42013',
        cvss: 8.8,
        severity: 'CRÍTICA',
        servicePort: '80 / TCP · Apache HTTP Server 2.4.50',
        description:
          'Path traversal y posible ejecución remota de código en configuraciones específicas donde se requiere alias.',
        validationNote:
          'Posibles coincidencias con versión. Validar los parches instalados antes de confirmar la vulnerabilidad.',
      },
      {
        cveId: 'CVE-2024-6387',
        cvss: 8.1,
        severity: 'ALTA',
        servicePort: '22 / TCP · OpenSSH 8.9p1',
        description:
          'Condición de carrera en sshd (regreSSHion). Revisar el parche del proveedor del sistema operativo.',
      },
    ],
  },
}

export const AssetsView: React.FC = () => {
  const [selectedAssetId, setSelectedAssetId] = useState('web-prod-01')
  const [scanGlobalStatus, setScanGlobalStatus] = useState('')

  const selectedDetail =
    assetDetailsMap[selectedAssetId] || assetDetailsMap['web-prod-01']

  const handleStartGlobalScan = () => {
    setScanGlobalStatus('Disparando escaneo masivo hacia microservicio C++...')
    setTimeout(() => {
      setScanGlobalStatus('¡Escaneo de superficie iniciado en la red perimetral!')
      setTimeout(() => setScanGlobalStatus(''), 3500)
    }, 1200)
  }

  return (
    <div className={styles.assetsContainer}>
      {/* Top Header & Action */}
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.viewTitle}>Assets</h1>
          <p className={styles.viewSubtitle}>
            SurfaceScan: Inventario y auditoría de superficie de ataque
          </p>
        </div>

        <div className="flex items-center gap-3">
          {scanGlobalStatus && (
            <span className="text-xs text-emerald-400 font-medium animate-pulse">
              {scanGlobalStatus}
            </span>
          )}
          <button
            onClick={handleStartGlobalScan}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Iniciar escaneo
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <AssetKpis />

      {/* Two Columns Layout */}
      <div className={styles.splitViewLayout}>
        <AssetList
          assets={mockAssetSummaries}
          selectedAssetId={selectedAssetId}
          onSelectAsset={(id) => setSelectedAssetId(id)}
        />
        <AssetDetail asset={selectedDetail} />
      </div>
    </div>
  )
}

export default AssetsView
