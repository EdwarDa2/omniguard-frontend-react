import React from 'react'
import type { SeverityLevel } from '@/types/soc.types'

interface AlertRow {
  time: string
  sourceIp: string
  threat: string
  severity: SeverityLevel
}

const recentAlerts: AlertRow[] = [
  {
    time: '14:32:00',
    sourceIp: '194.26.29.112',
    threat: 'SSH Brute Force',
    severity: 'CRITICAL',
  },
  {
    time: '14:28:44',
    sourceIp: '45.154.255.89',
    threat: 'SynFlood Attack',
    severity: 'CRITICAL',
  },
  {
    time: '14:15:02',
    sourceIp: '185.220.101.5',
    threat: 'Tor Exit Node',
    severity: 'NORMAL',
  },
  {
    time: '14:02:19',
    sourceIp: '172.16.0.44',
    threat: 'TLS Verification',
    severity: 'NORMAL',
  },
]

const severityBadgeStyles: Record<string, string> = {
  CRITICAL: 'bg-rose-950/60 text-rose-400 border border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.15)]',
  NORMAL: 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.15)]',
  HIGH: 'bg-orange-950/60 text-orange-400 border border-orange-500/40',
  WARNING: 'bg-amber-950/60 text-amber-400 border border-amber-500/40',
}

export const RecentAlertsTable: React.FC = () => {
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
          {recentAlerts.map((row, index) => (
            <tr
              key={index}
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
                  className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
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
