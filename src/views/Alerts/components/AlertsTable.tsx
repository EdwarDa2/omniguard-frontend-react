import React from 'react'
import { Search, Download, ChevronLeft, ChevronRight, ChevronRight as RowChevron } from 'lucide-react'
import type { SeverityLevel, IncidentStatus } from '@/types/soc.types'

export interface AlertItemRow {
  id: string
  code: string
  time: string
  severity: SeverityLevel
  threat: string
  sourceIp: string
  destinationIp: string
  status: IncidentStatus
  port: string
  sensor: string
  heuristic: string
  description: string
  observedAttempts: number
  threshold: number
  suggestion: string
}

interface AlertsTableProps {
  alerts: AlertItemRow[]
  selectedAlertId: string
  onSelectAlert: (id: string) => void
}

const severityBadgeMap: Record<SeverityLevel, { text: string; label: string; badge: string }> = {
  CRITICAL: {
    text: 'text-rose-400',
    label: 'CRÍTICA',
    badge: 'bg-rose-950/70 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.15)]',
  },
  HIGH: {
    text: 'text-orange-400',
    label: 'ALTA',
    badge: 'bg-orange-950/70 text-orange-300 border-orange-500/40 shadow-[0_0_8px_rgba(249,115,22,0.15)]',
  },
  WARNING: {
    text: 'text-amber-400',
    label: 'MEDIA',
    badge: 'bg-amber-950/70 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.15)]',
  },
  INFO: {
    text: 'text-cyan-400',
    label: 'BAJA',
    badge: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.15)]',
  },
  NORMAL: {
    text: 'text-emerald-400',
    label: 'NORMAL',
    badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
  },
}

const statusBadgeMap: Record<IncidentStatus, { label: string; badge: string }> = {
  NUEVA: {
    label: 'Nueva',
    badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
  },
  EN_INVESTIGACION: {
    label: 'En investigación',
    badge: 'bg-sky-950/60 text-sky-300 border-sky-500/40',
  },
  RESUELTA: {
    label: 'Resuelta',
    badge: 'bg-slate-800/80 text-slate-300 border-slate-700',
  },
  FALSO_POSITIVO: {
    label: 'Falso positivo',
    badge: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
  },
}

export const AlertsTable: React.FC<AlertsTableProps> = ({
  alerts,
  selectedAlertId,
  onSelectAlert,
}) => {
  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4">
      {/* Table Header: Title + Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-bold text-white tracking-wide">Registro de alertas</h2>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium">
            24 eventos
          </span>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#172236] hover:bg-[#1e2d47] border border-[#243452] text-slate-200 text-xs font-medium transition-colors">
          <Download className="w-3.5 h-3.5 text-slate-400" />
          Exportar CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 pt-1">
        <div className="md:col-span-5 relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por IP o ID de alerta"
            className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="md:col-span-2">
          <select className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50">
            <option>Severidad: Todas</option>
            <option>Crítica</option>
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <select className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50">
            <option>Últimas 24 h</option>
            <option>Últimas 12 h</option>
            <option>Últimas 7 días</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <select className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50">
            <option>Tipo de ataque: Todos</option>
            <option>SSH Brute Force</option>
            <option>SynFlood Attack</option>
            <option>Port Scan</option>
            <option>DNS Tunneling</option>
            <option>TLS Anomaly</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="overflow-x-auto border border-[#1c273e] rounded-lg">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0b101c] border-b border-[#1c273e] text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3.5">Hora</th>
              <th className="py-2.5 px-3.5">Severidad</th>
              <th className="py-2.5 px-3.5">Tipo de ataque</th>
              <th className="py-2.5 px-3.5">IP Origen</th>
              <th className="py-2.5 px-3.5">IP Destino</th>
              <th className="py-2.5 px-3.5">Estado</th>
              <th className="py-2.5 px-3.5 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#172236] bg-[#0d1424]">
            {alerts.map((row) => {
              const isSelected = row.id === selectedAlertId
              const sev = severityBadgeMap[row.severity] || severityBadgeMap.NORMAL
              const st = statusBadgeMap[row.status] || statusBadgeMap.NUEVA

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
                  <td className="py-2.5 px-3.5 font-mono text-slate-400">{row.time}</td>
                  <td className="py-2.5 px-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${sev.badge}`}
                    >
                      {sev.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 font-medium text-slate-100">{row.threat}</td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-300">{row.sourceIp}</td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-300">{row.destinationIp}</td>
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
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2 pt-1">
        <span>1-5 de 24 eventos · Orden: más recientes</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span>7 por página</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              aria-label="Página anterior"
              className="p-1 rounded bg-[#131c2e] border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40"
              disabled
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-slate-300 font-semibold">1 / 4</span>
            <button
              aria-label="Página siguiente"
              className="p-1 rounded bg-[#131c2e] border border-slate-800 text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

