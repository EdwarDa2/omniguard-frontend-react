import React from 'react'
import { CheckCircle2, ShieldAlert } from 'lucide-react'
import type { AssetsKpisDto } from '@/types/asset.types'

interface AssetKpisProps {
  kpis?: AssetsKpisDto
}

export const AssetKpis: React.FC<AssetKpisProps> = ({
  kpis = { totalAssets: 0, exposedPorts: 0, vulnerableAssets: 0, highestSeverity: 'NORMAL' },
}) => {
  const isVulnerable = kpis.vulnerableAssets > 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Total de activos */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex items-center justify-between shadow-md">
        <div>
          <span className="text-xs font-semibold text-slate-400">Activos descubiertos</span>
          <div className="text-2xl font-black font-mono text-white mt-1">
            {kpis.totalAssets < 10 ? `0${kpis.totalAssets}` : kpis.totalAssets}
          </div>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
          SURFACE
        </span>
      </div>

      {/* Activos vulnerables */}
      <div
        className={`bg-[#0f172a] border rounded-xl p-4 flex items-center justify-between shadow-md ${
          isVulnerable ? 'border-rose-900/40' : 'border-[#1e293b]'
        }`}
      >
        <div>
          <span className="text-xs font-semibold text-slate-400">Activos vulnerables</span>
          <div
            className={`text-2xl font-black font-mono mt-1 ${
              isVulnerable ? 'text-rose-500' : 'text-emerald-400'
            }`}
          >
            {kpis.vulnerableAssets < 10 ? `0${kpis.vulnerableAssets}` : kpis.vulnerableAssets}
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
            isVulnerable
              ? 'text-rose-400 bg-rose-950/60 border-rose-500/40'
              : 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40'
          }`}
        >
          {isVulnerable ? (
            <>
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              RIESGO
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              SEGURO
            </>
          )}
        </span>
      </div>

      {/* Puertos expuestos */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex items-center justify-between shadow-md">
        <div>
          <span className="text-xs font-semibold text-slate-400">Puertos expuestos</span>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
            {kpis.exposedPorts < 10 ? `0${kpis.exposedPorts}` : kpis.exposedPorts}
          </div>
        </div>
        <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">
          SERVICIOS
        </span>
      </div>

      {/* Nivel de severidad perimetral */}
      <div className="bg-[#0f172a] border border-emerald-900/30 rounded-xl p-4 flex items-center justify-between shadow-md">
        <div>
          <span className="text-xs font-semibold text-slate-400">Severidad Perimetral</span>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1 uppercase">
            {kpis.highestSeverity}
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          MONITOR
        </span>
      </div>
    </div>
  )
}

export default AssetKpis
