import React from 'react'
import { CheckCircle2, ShieldAlert } from 'lucide-react'

export const AssetKpis: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex items-center justify-between shadow-md">
        <div>
          <span className="text-xs font-semibold text-slate-400">Activos descubiertos</span>
          <div className="text-2xl font-black font-mono text-white mt-1">12</div>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
          SURFACE
        </span>
      </div>

      <div className="bg-[#0f172a] border border-rose-900/30 rounded-xl p-4 flex items-center justify-between shadow-md">
        <div>
          <span className="text-xs font-semibold text-slate-400">Activos vulnerables</span>
          <div className="text-2xl font-black font-mono text-rose-500 mt-1">08</div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40">
          <ShieldAlert className="w-3 h-3 text-rose-400" />
          CRÍTICA
        </span>
      </div>

      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex items-center justify-between shadow-md">
        <div>
          <span className="text-xs font-semibold text-slate-400">Puertos abiertos</span>
          <div className="text-2xl font-black font-mono text-white mt-1">14</div>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
          SERVICIOS
        </span>
      </div>

      <div className="bg-[#0f172a] border border-emerald-900/30 rounded-xl p-4 flex items-center justify-between shadow-md">
        <div>
          <span className="text-xs font-semibold text-slate-400">Último escaneo</span>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">14:30</div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          COMPLETO
        </span>
      </div>
    </div>
  )
}

