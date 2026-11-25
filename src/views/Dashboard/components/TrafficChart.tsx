import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TrafficActivity } from '@/types/dashboard.types'
import { Activity, Radio, Zap } from 'lucide-react'

interface TrafficChartProps {
  traffic?: TrafficActivity
}

export const TrafficChart: React.FC<TrafficChartProps> = ({ traffic }) => {
  const chartData =
    traffic?.timeSeries?.map((pt) => ({
      time: pt.time,
      inbound: pt.inbound,
      outbound: pt.outbound,
      total: (pt.inbound || 0) + (pt.outbound || 0),
    })) || []

  const currentPackets = traffic?.currentPacketsPerSec ?? 0
  const bandwidth = traffic?.bandwidthMbps ?? 0
  const isSensorActive = traffic?.sensorStatus === 'ACTIVE'
  const sensorStatusLabel = traffic?.sensorStatus || 'INACTIVE'

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Barra de telemetría de red en vivo */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 rounded-lg bg-[#0a0e1a] border border-[#1e293b]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Rendimiento:</span>
            <span className="text-emerald-400 font-bold">{currentPackets.toLocaleString()}</span> pkts/s
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Ancho de Banda:</span>
            <span className="text-cyan-400 font-bold">{bandwidth.toFixed(1)}</span> Mbps
          </div>
        </div>

        <div
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider border transition-colors ${
            isSensorActive
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-400'
          }`}
        >
          <Radio className={`w-3 h-3 ${isSensorActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <span>SENSOR {sensorStatusLabel}</span>
        </div>
      </div>

      {/* Gráfica Recharts o contenedor de espera cuando no hay histórico en Redis */}
      {chartData.length === 0 ? (
        <div className="flex h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-[#1e293b] bg-[#0a0f1d]/50 p-6 text-center select-none">
          <div className="w-10 h-10 rounded-full bg-[#111827] border border-[#1f293d] flex items-center justify-center mb-3 text-slate-400">
            <Radio className="w-5 h-5 text-slate-500" />
          </div>
          <p className="text-sm font-semibold text-slate-300">Sensor en espera de tráfico de red</p>
          <span className="mt-1 text-xs text-slate-500 max-w-sm leading-relaxed">
            Los paquetes capturados por la sonda de red se graficarán automáticamente en tiempo real.
          </span>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
            <span
              className={`w-2 h-2 rounded-full ${
                isSensorActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`}
            ></span>
            <span>
              Telemetría Redis: {isSensorActive ? 'Captura en vivo' : '0 pkts/s detectados'}
            </span>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="inboundGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="outboundGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#475569"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={false}
              />
              <YAxis
                stroke="#475569"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c101d',
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#f8fafc',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                }}
                formatter={(value: any, name: any) => [
                  `${value} pkts`,
                  name === 'inbound' ? 'Tráfico Entrante' : 'Tráfico Saliente',
                ]}
              />
              <Area
                type="monotone"
                dataKey="inbound"
                name="inbound"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#inboundGradient)"
              />
              <Area
                type="monotone"
                dataKey="outbound"
                name="outbound"
                stroke="#06b6d4"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#outboundGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default TrafficChart
