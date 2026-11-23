import React from 'react'

interface SeverityCountersProps {
  counts?: {
    critical: number
    high: number
    medium: number
    low: number
  }
}

export const SeverityCounters: React.FC<SeverityCountersProps> = ({
  counts = { critical: 0, high: 1, medium: 9, low: 0 },
}) => {
  const formatCount = (n: number) => (n < 10 ? `0${n}` : `${n}`)

  const counters = [
    {
      label: 'Críticas',
      count: formatCount(counts.critical),
      sublabel: 'ÚLTIMAS 24 H',
      textColor: 'text-rose-500',
      borderColor: 'border-rose-900/30',
      badgeBg: 'bg-rose-950/40 text-rose-400',
    },
    {
      label: 'Altas',
      count: formatCount(counts.high),
      sublabel: 'ÚLTIMAS 24 H',
      textColor: 'text-orange-500',
      borderColor: 'border-orange-900/30',
      badgeBg: 'bg-orange-950/40 text-orange-400',
    },
    {
      label: 'Medias',
      count: formatCount(counts.medium),
      sublabel: 'ÚLTIMAS 24 H',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-900/30',
      badgeBg: 'bg-amber-950/40 text-amber-300',
    },
    {
      label: 'Bajas / Normal',
      count: formatCount(counts.low),
      sublabel: 'ÚLTIMAS 24 H',
      textColor: 'text-cyan-400',
      borderColor: 'border-cyan-900/30',
      badgeBg: 'bg-cyan-950/40 text-cyan-300',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {counters.map((item, idx) => (
        <div
          key={idx}
          className={`bg-[#0f172a]/90 border ${item.borderColor} rounded-xl p-4 flex items-center justify-between shadow-md hover:bg-[#111d35] transition-colors`}
        >
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-400 tracking-wide">{item.label}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-black font-mono tracking-tight ${item.textColor}`}>
                {item.count}
              </span>
            </div>
          </div>
          <span
            className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded border border-white/5 ${item.badgeBg}`}
          >
            {item.sublabel}
          </span>
        </div>
      ))}
    </div>
  )
}

export default SeverityCounters
