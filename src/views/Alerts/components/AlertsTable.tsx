import React from 'react'
import { Search, Download, ChevronLeft, ChevronRight, ChevronRight as RowChevron, AlertCircle } from 'lucide-react'
import type { AlertDto } from '@/types/alert.types'

interface AlertsTableProps {
  alerts: AlertDto[]
  total: number
  page: number
  size: number
  selectedAlertId: number | null
  onSelectAlert: (id: number) => void
  onPageChange: (newPage: number) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  severityFilter: string
  onSeverityChange: (sev: string) => void
  statusFilter: string
  onStatusChange: (st: string) => void
  onExportCsv: () => void
}

const severityBadgeMap: Record<string, { label: string; badge: string }> = {
  CRITICAL: {
    label: 'CRÍTICA',
    badge: 'bg-rose-950/70 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.15)]',
  },
  HIGH: {
    label: 'ALTA',
    badge: 'bg-orange-950/70 text-orange-300 border-orange-500/40 shadow-[0_0_8px_rgba(249,115,22,0.15)]',
  },
  MEDIUM: {
    label: 'MEDIA',
    badge: 'bg-amber-950/70 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.15)]',
  },
  WARNING: {
    label: 'MEDIA',
    badge: 'bg-amber-950/70 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.15)]',
  },
  LOW: {
    label: 'BAJA',
    badge: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.15)]',
  },
  INFO: {
    label: 'BAJA',
    badge: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.15)]',
  },
  NORMAL: {
    label: 'NORMAL',
    badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
  },
}

const statusBadgeMap: Record<string, { label: string; badge: string }> = {
  OPEN: { label: 'Nueva', badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' },
  NUEVA: { label: 'Nueva', badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' },
  EN_INVESTIGACION: { label: 'En investigación', badge: 'bg-sky-950/60 text-sky-300 border-sky-500/40' },
  INVESTIGATING: { label: 'En investigación', badge: 'bg-sky-950/60 text-sky-300 border-sky-500/40' },
  RESUELTA: { label: 'Resuelta', badge: 'bg-slate-800/80 text-slate-300 border-slate-700' },
  RESOLVED: { label: 'Resuelta', badge: 'bg-slate-800/80 text-slate-300 border-slate-700' },
  FALSO_POSITIVO: { label: 'Falso positivo', badge: 'bg-purple-950/60 text-purple-300 border-purple-500/40' },
  FALSE_POSITIVE: { label: 'Falso positivo', badge: 'bg-purple-950/60 text-purple-300 border-purple-500/40' },
}

export const AlertsTable: React.FC<AlertsTableProps> = ({
  alerts,
  total,
  page,
  size,
  selectedAlertId,
  onSelectAlert,
  onPageChange,
  searchQuery,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  statusFilter,
  onStatusChange,
  onExportCsv,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / size))
  const startItem = total === 0 ? 0 : page * size + 1
  const endItem = Math.min((page + 1) * size, total)

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4">
      {/* Cabecera de la tabla */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-bold text-white tracking-wide">Registro de alertas NIDS</h2>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium font-mono">
            {total} incidentes en base de datos
          </span>
        </div>
        <button
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#172236] hover:bg-[#1e2d47] border border-[#243452] text-slate-200 text-xs font-medium transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          Exportar CSV
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 pt-1">
        <div className="md:col-span-6 relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por IP origen/destino o regla..."
            className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono"
          />
        </div>
        <div className="md:col-span-3">
          <select
            value={severityFilter}
            onChange={(e) => onSeverityChange(e.target.value)}
            className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
          >
            <option value="">Severidad: Todas</option>
            <option value="CRITICAL">Crítica</option>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Media</option>
            <option value="LOW">Baja</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
          >
            <option value="">Estado: Todos</option>
            <option value="OPEN">Nueva</option>
            <option value="EN_INVESTIGACION">En investigación</option>
            <option value="RESUELTA">Resuelta</option>
            <option value="FALSO_POSITIVO">Falso positivo</option>
          </select>
        </div>
      </div>

      {/* Tabla con datos reales */}
      <div className="overflow-x-auto border border-[#1c273e] rounded-lg">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0b101c] border-b border-[#1c273e] text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3.5">ID / Hora</th>
              <th className="py-2.5 px-3.5">Severidad</th>
              <th className="py-2.5 px-3.5">Amenaza Detectada</th>
              <th className="py-2.5 px-3.5">IP Origen</th>
              <th className="py-2.5 px-3.5">IP Destino</th>
              <th className="py-2.5 px-3.5">Estado</th>
              <th className="py-2.5 px-3.5 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#172236] bg-[#0d1424]">
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <AlertCircle className="w-5 h-5 text-slate-600" />
                    <span>No se encontraron alertas con los filtros aplicados.</span>
                  </div>
                </td>
              </tr>
            ) : (
              alerts.map((row) => {
                const isSelected = row.id === selectedAlertId
                const sev = severityBadgeMap[row.severity] || severityBadgeMap.NORMAL
                const st = statusBadgeMap[row.status] || statusBadgeMap.OPEN
                const timeStr = new Date(row.detectedAt).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })

                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelectAlert(row.id)}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#15233e] border-l-4 border-l-emerald-400 text-white'
                        : 'hover:bg-[#111a2d] text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 px-3.5 font-mono text-slate-400">
                      <span className="text-emerald-400 font-bold mr-1.5">#{row.id}</span>
                      {timeStr}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${sev.badge}`}
                      >
                        {sev.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 font-medium text-slate-100">{row.title}</td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-300">{row.sourceIp}</td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-300">
                      {row.destinationIp}:{row.destinationPort}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${st.badge}`}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <RowChevron
                        className={`w-4 h-4 transition-transform ${
                          isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-600'
                        }`}
                      />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2 pt-1">
        <span>
          {startItem}-{endItem} de {total} incidentes
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              aria-label="Página anterior"
              className="p-1 rounded bg-[#131c2e] border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-slate-300 font-semibold">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
              aria-label="Página siguiente"
              className="p-1 rounded bg-[#131c2e] border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertsTable
