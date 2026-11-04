import React from 'react'
import type { SeverityLevel } from '@/types/soc.types'

interface KpiCardProps {
  title: string
  value: string | number
  level: SeverityLevel
}

const badgeStyles: Record<SeverityLevel, { bg: string; text: string; border: string }> = {
  CRITICAL: {
    bg: 'bg-rose-950/50',
    text: 'text-rose-400',
    border: 'border-rose-500/40',
  },
  HIGH: {
    bg: 'bg-orange-950/50',
    text: 'text-orange-400',
    border: 'border-orange-500/40',
  },
  WARNING: {
    bg: 'bg-amber-950/50',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
  },
  INFO: {
    bg: 'bg-emerald-950/50',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
  },
  NORMAL: {
    bg: 'bg-emerald-950/50',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
  },
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, level }) => {
  const badge = badgeStyles[level] || badgeStyles.NORMAL

  return (
    <div className="bg-[#0f172a]/90 hover:bg-[#111c33] transition-colors border border-[#1e293b] rounded-xl p-5 flex items-center justify-between shadow-lg">
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-400 tracking-wide">{title}</span>
        <span className="text-3xl font-extrabold text-white mt-1 tracking-tight font-mono">{value}</span>
      </div>
      <div
        className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase border ${badge.bg} ${badge.text} ${badge.border}`}
      >
        {level}
      </div>
    </div>
  )
}
