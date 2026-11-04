import React, { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { SeverityCounters } from './components/SeverityCounters'
import { AlertsTable, type AlertItemRow } from './components/AlertsTable'
import { AlertDetailPanel } from './components/AlertDetailPanel'
import styles from './AlertsView.module.css'

const mockAlerts: AlertItemRow[] = [
  {
    id: '1',
    code: '102-1048',
    time: '14:32:00',
    severity: 'CRITICAL',
    threat: 'SSH Brute Force',
    sourceIp: '194.26.29.112',
    destinationIp: '10.0.0.12',
    status: 'EN_INVESTIGACION',
    port: 'TCP / 22 (SSH)',
    sensor: 'nids-01 / eth0',
    heuristic: 'SSH_BRUTE_FORCE',
    description:
      'Se detectaron 120 intentos de autenticación SSH fallidos desde una misma IP en 60 segundos. El patrón supera el umbral de 20 intentos y sugiere un ataque de fuerza bruta.',
    observedAttempts: 120,
    threshold: 20,
    suggestion: 'Bloquear accesos y validar el origen si no es un testeo de red.',
  },
  {
    id: '2',
    code: '102-1047',
    time: '14:28:44',
    severity: 'CRITICAL',
    threat: 'SynFlood Attack',
    sourceIp: '45.154.255.89',
    destinationIp: '10.0.0.20',
    status: 'EN_INVESTIGACION',
    port: 'TCP / 80 (HTTP)',
    sensor: 'nids-01 / eth0',
    heuristic: 'TCP_SYN_FLOOD',
    description:
      'Volumen anormal de paquetes TCP SYN incompletos detectados hacia el servidor web balanceador.',
    observedAttempts: 9850,
    threshold: 1000,
    suggestion: 'Activar SYN cookies en el kernel y verificar reglas de firewall perimetral.',
  },
  {
    id: '3',
    code: '102-1046',
    time: '14:19:16',
    severity: 'HIGH',
    threat: 'Port Scan',
    sourceIp: '198.51.100.24',
    destinationIp: '10.0.0.12',
    status: 'NUEVA',
    port: 'Múltiples puertos',
    sensor: 'nids-02 / eth1',
    heuristic: 'PORT_SCAN_SWEEP',
    description:
      'Escaneo secuencial de puertos TCP 21, 22, 23, 80, 443, 3306 detectado en menos de 10 segundos.',
    observedAttempts: 65,
    threshold: 15,
    suggestion: 'Bloqueo temporal de la IP en tabla iptables del host.',
  },
  {
    id: '4',
    code: '102-1045',
    time: '13:58:11',
    severity: 'WARNING',
    threat: 'DNS Tunneling',
    sourceIp: '10.0.0.48',
    destinationIp: '203.0.113.8',
    status: 'RESUELTA',
    port: 'UDP / 53 (DNS)',
    sensor: 'nids-01 / eth0',
    heuristic: 'DNS_HIGH_ENTROPY',
    description:
      'Consultas TXT recurrentes con alta entropía y longitud excesiva de subdominios, compatible con exfiltración.',
    observedAttempts: 42,
    threshold: 10,
    suggestion: 'Inspeccionar el host interno 10.0.0.48 en busca de malware activo.',
  },
  {
    id: '5',
    code: '102-1044',
    time: '12:42:09',
    severity: 'INFO',
    threat: 'TLS Anomaly',
    sourceIp: '172.16.0.44',
    destinationIp: '10.0.0.20',
    status: 'FALSO_POSITIVO',
    port: 'TCP / 443 (HTTPS)',
    sensor: 'nids-02 / eth1',
    heuristic: 'TLS_UNCOMMON_CIPHER',
    description:
      'Negociación de cifrado TLS con suite legacy iniciada por script interno de monitoreo de uptime.',
    observedAttempts: 3,
    threshold: 2,
    suggestion: 'Marcar como excepción / whitelist para la IP interna del monitor.',
  },
]

export const AlertsView: React.FC = () => {
  const [isLive, setIsLive] = useState(true)
  const [selectedId, setSelectedId] = useState<string>('1')

  const selectedAlert = mockAlerts.find((a) => a.id === selectedId) || mockAlerts[0]

  return (
    <div className={styles.alertsContainer}>
      {/* Top Title Bar with Live indicator */}
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.viewTitle}>Alerts</h1>
          <p className={styles.viewSubtitle}>
            Monitor NIDS: Detección de intrusiones y respuesta a incidentes
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`}
            ></span>
            {isLive ? 'En vivo' : 'En pausa'}
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#151f33] hover:bg-[#1c2a44] border border-[#243452] text-slate-300 text-xs font-medium transition-colors"
          >
            {isLive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Reanudar
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Severity KPI Counters */}
      <SeverityCounters />

      {/* Filterable Table */}
      <AlertsTable
        alerts={mockAlerts}
        selectedAlertId={selectedId}
        onSelectAlert={(id) => setSelectedId(id)}
      />

      {/* Detail Panel */}
      <AlertDetailPanel alert={selectedAlert} />
    </div>
  )
}

export default AlertsView
