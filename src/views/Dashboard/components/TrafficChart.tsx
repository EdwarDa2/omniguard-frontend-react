import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'

const data = [
  { time: '13:40', packets: 420 },
  { time: '13:45', packets: 450 },
  { time: '13:50', packets: 430 },
  { time: '13:55', packets: 480 },
  { time: '14:00', packets: 510 },
  { time: '14:05', packets: 490 },
  { time: '14:10', packets: 530 },
  { time: '14:15', packets: 620 },
  { time: '14:20', packets: 890 },
  { time: '14:25', packets: 3200 },
  { time: '14:28', packets: 8400 },
  { time: '14:30', packets: 9850 },
  { time: '14:32', packets: 7200 },
  { time: '14:35', packets: 2100 },
  { time: '14:40', packets: 780 },
  { time: '14:45', packets: 560 },
  { time: '14:50', packets: 510 },
  { time: '14:55', packets: 480 },
  { time: '15:00', packets: 460 },
]

export const TrafficChart: React.FC = () => {
  return (
    <div className="relative w-full h-[260px]">
      {/* Pink Callout Box over the peak at 14:30 */}
      <div className="absolute top-2 left-1/2 -translate-x-[15%] z-10 flex flex-col items-center pointer-events-none">
        <div className="bg-[#4c0519]/90 border border-[#f43f5e] rounded px-3 py-1.5 shadow-[0_0_15px_rgba(244,63,94,0.35)] text-center">
          <div className="text-[10px] font-extrabold tracking-wider text-[#fda4af] uppercase">
            SYN FLOOD ATTACK
          </div>
          <div className="text-[9px] font-mono text-slate-300">
            9,850 pkts/sec · 14:30
          </div>
        </div>
        <div className="w-0.5 h-3 bg-[#f43f5e]"></div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 35, right: 20, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            stroke="#475569"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
          />
          <YAxis hide domain={[0, 11000]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#f8fafc',
            }}
            formatter={(value: any) => [`${value} pkts/s`, 'Tráfico']}
          />
          <Area
            type="monotone"
            dataKey="packets"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#trafficGradient)"
          />
          <ReferenceDot
            x="14:30"
            y={9850}
            r={5}
            fill="#f43f5e"
            stroke="#ffffff"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

