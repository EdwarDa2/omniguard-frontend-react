import React, { useState } from 'react'
import { Pause, Play, RefreshCw, AlertTriangle } from 'lucide-react'
import { SeverityCounters } from './components/SeverityCounters'
import { AlertsTable } from './components/AlertsTable'
import { AlertDetailPanel } from './components/AlertDetailPanel'
import { useQuery } from '@tanstack/react-query'
import { alertsService } from '@/services/alerts/alerts.service'
import { useRealtimeAlerts } from '@/hooks/useRealtimeAlerts'
import { getSessionStartTime, resetSessionStartTime } from '@/utils/sessionTime'
import styles from './AlertsView.module.css'

export const AlertsView: React.FC = () => {
  const [isLive, setIsLive] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // Ámbito de visualización: Sesión actual (por defecto para demo limpia) vs Historial completo
  const [scope, setScope] = useState<'session' | 'all'>('session')
  const [sessionSince, setSessionSince] = useState<string>(() => getSessionStartTime())

  // Filtros y paginación
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('')
  const [status, setStatus] = useState('')

  const handleResetSession = () => {
    const newStart = resetSessionStartTime()
    setSessionSince(newStart)
    setPage(0)
  }

  // Consulta paginada con TanStack Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['alerts', page, severity, status, search, scope, sessionSince],
    queryFn: () =>
      alertsService.getAlerts({
        page,
        size: 10,
        severity: severity || undefined,
        status: status || undefined,
        search: search || undefined,
        from: scope === 'session' ? sessionSince : undefined,
      }),
    staleTime: 5000,
  })

  // Conexión Server-Sent Events (SSE) para recibir alertas en vivo
  useRealtimeAlerts({
    enabled: isLive,
    onNewAlert: (newAlert) => {
      setSelectedId(newAlert.id)
    },
  })

  const alerts = data?.items || []
  const total = data?.total || 0

  // Seleccionar la primera alerta por defecto si no hay ninguna seleccionada
  const activeAlertId = selectedId ?? (alerts.length > 0 ? alerts[0].id : null)
  const selectedAlert = alerts.find((a) => a.id === activeAlertId) || (alerts[0] ?? null)

  // Calcular contadores de severidad
  const counts = {
    critical: alerts.filter((a) => a.severity === 'CRITICAL').length,
    high: alerts.filter((a) => a.severity === 'HIGH').length,
    medium: alerts.filter((a) => a.severity === 'MEDIUM' || a.severity === 'WARNING').length,
    low: alerts.filter((a) => a.severity === 'LOW' || a.severity === 'INFO' || a.severity === 'NORMAL').length,
  }

  // Exportar registros a formato CSV
  const handleExportCsv = () => {
    if (alerts.length === 0) return
    const headers = ['ID', 'Hora', 'Severidad', 'Regla', 'Titulo', 'IP_Origen', 'IP_Destino', 'Puerto', 'Protocolo', 'Estado']
    const rows = alerts.map((a) => [
      a.id,
      a.detectedAt,
      a.severity,
      a.rule,
      `"${a.title.replace(/"/g, '""')}"`,
      a.sourceIp,
      a.destinationIp,
      a.destinationPort,
      a.protocol,
      a.status,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `omniguard_alerts_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={styles.alertsContainer}>
      {/* Top Title Bar con Indicador SSE en Vivo */}
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.viewTitle}>Alerts</h1>
          <p className={styles.viewSubtitle}>
            Monitor NIDS: Detección pasiva de intrusiones en tiempo real (C++ libpcap ➔ Python CVE)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`}
            ></span>
            {isLive ? 'Canal SSE en Vivo' : 'SSE Pausado'}
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#151f33] hover:bg-[#1c2a44] border border-[#243452] text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            {isLive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Pausar Stream
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Reanudar Stream
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Contadores de Severidad */}
      <SeverityCounters counts={counts} />

      {/* Control de error o carga */}
      {isError ? (
        <div className="p-6 bg-rose-950/30 border border-rose-500/30 rounded-xl text-center">
          <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
          <p className="text-xs text-rose-300">No se pudieron cargar los incidentes desde la API.</p>
          <button
            onClick={() => refetch()}
            className="mt-3 px-3 py-1.5 bg-rose-500 text-slate-950 rounded text-xs font-bold"
          >
            Reintentar
          </button>
        </div>
      ) : isLoading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
          <span className="text-xs font-mono">Consultando eventos del sensor NIDS...</span>
        </div>
      ) : (
        <>
          {/* Tabla Paginada de Alertas */}
          <AlertsTable
            alerts={alerts}
            total={total}
            page={page}
            size={10}
            selectedAlertId={activeAlertId}
            onSelectAlert={(id) => setSelectedId(id)}
            onPageChange={(newPage) => setPage(newPage)}
            searchQuery={search}
            onSearchChange={(q) => {
              setSearch(q)
              setPage(0)
            }}
            severityFilter={severity}
            onSeverityChange={(sev) => {
              setSeverity(sev)
              setPage(0)
            }}
            statusFilter={status}
            onStatusChange={(st) => {
              setStatus(st)
              setPage(0)
            }}
            onExportCsv={handleExportCsv}
            scope={scope}
            onScopeChange={(newScope) => {
              setScope(newScope)
              setPage(0)
            }}
            onResetSession={handleResetSession}
          />

          {/* Panel Forense de la Alerta Seleccionada */}
          <AlertDetailPanel key={activeAlertId ?? 'none'} alert={selectedAlert} />
        </>
      )}
    </div>
  )
}

export default AlertsView
