import React from 'react'
import type { RecentAlertDto } from '@/types/dashboard.types'
import { AlertCircle } from 'lucide-react'

interface RecentAlertsTableProps {
  alerts?: RecentAlertDto[]
}

const severityBadgeStyles: Record<string, string> = {
  CRITICAL:
    'bg-rose-950/60 text-rose-400 border border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.15)]',
  HIGH: 'bg-orange-950/60 text-orange-400 border border-orange-500/40',
  WARNING: 'bg-amber-950/60 text-amber-400 border border-amber-500/40',
  INFO: 'bg-blue-950/60 text-blue-400 border border-blue-500/40',
  NORMAL:
    'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.15)]',
}

export const RecentAlertsTable: React.FC<RecentAlertsTableProps> = ({ alerts = [] }) => {
  if (alerts.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
        <AlertCircle className="w-6 h-6 text-slate-600" />
        <span className="text-xs font-mono text-slate-300">No se han registrado incidentes en esta sesión de monitoreo</span>
        <span className="text-[11px] font-mono text-slate-500">
          El motor heurístico y las reglas NIDS están escuchando en vivo el tráfico del sensor
        </span>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#1e293b] text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
            <th className="py-3 px-4">Time</th>
            <th className="py-3 px-4">Source IP</th>
            <th className="py-3 px-4">Threat</th>
            <th className="py-3 px-4 text-right">Severity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#172236]">
          {alerts.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-[#131d33] transition-colors group cursor-default"
            >
              <td className="py-3.5 px-4 font-mono text-slate-400 group-hover:text-slate-200">
                {row.time}
              </td>
              <td className="py-3.5 px-4 font-mono text-slate-300 font-medium">
                {row.sourceIp}
              </td>
              <td className="py-3.5 px-4 text-slate-200 font-medium">
                {row.threat}
              </td>
              <td className="py-3.5 px-4 text-right">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                    severityBadgeStyles[row.severity] || severityBadgeStyles.NORMAL
                  }`}
                >
                  {row.severity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecentAlertsTable
