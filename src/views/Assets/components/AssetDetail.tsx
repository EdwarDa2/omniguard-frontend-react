import React, { useState } from 'react'
import { RotateCw, ShieldAlert, CheckCircle, Info, ShieldCheck } from 'lucide-react'
import type { AssetItem } from '@/types/asset.types'

interface AssetDetailProps {
  asset: AssetItem | null
  onRescan: (id: number) => Promise<void>
}

export const AssetDetail: React.FC<AssetDetailProps> = ({ asset, onRescan }) => {
  const [isRescanning, setIsRescanning] = useState(false)

  if (!asset) {
    return (
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-8 text-center text-slate-500 text-xs">
        Selecciona un activo de la lista para inspeccionar sus puertos abiertos y vulnerabilidades CVE.
      </div>
    )
  }

  const handleRescanClick = async () => {
    setIsRescanning(true)
    try {
      await onRescan(asset.id)
    } finally {
      setIsRescanning(false)
    }
  }

  const lastScannedDate = asset.lastScanned
    ? new Date(asset.lastScanned).toLocaleString('es-ES', {
        dateStyle: 'short',
        timeStyle: 'medium',
      })
    : 'No escaneado'

  const severityBadgeClass = asset.hasCve
    ? 'bg-rose-950/70 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
    : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-5 flex flex-col justify-between">
      <div className="space-y-5">
        {/* Cabecera del Activo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1c273e] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight font-mono">
                {asset.hostname}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              <span className="font-mono text-slate-300">{asset.ip}</span> · {asset.description}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-mono">
              <span>
                SO: <strong className="text-slate-300 font-sans">{asset.os}</strong>
              </span>
              <span>·</span>
              <span>
                Última auditoría:{' '}
                <strong className="text-emerald-400">{lastScannedDate}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1">
            <span
              className={`px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase border ${severityBadgeClass}`}
            >
              {asset.severityLabel || (asset.hasCve ? 'VULNERABLE' : 'SEGURO')}
            </span>
            <span className="text-[10px] text-slate-400">
              {asset.hasCve ? 'Riesgo perimetral identificado' : 'Sin vulnerabilidades detectadas'}
            </span>
          </div>
        </div>

        {/* Puertos Abiertos Detectados por el Sensor C++ */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 tracking-wide uppercase">
              Puertos Abiertos ({asset.ports.length} servicios detectados por libpcap)
            </h3>
          </div>

          <div className="overflow-x-auto border border-[#1c273e] rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0a0f1d] border-b border-[#1c273e] text-slate-400 text-[10px] uppercase font-semibold">
                  <th className="py-2 px-3">Puerto / Proto</th>
                  <th className="py-2 px-3">Servicio / Banner</th>
                  <th className="py-2 px-3">Estado</th>
                  <th className="py-2 px-3 text-right">Diagnóstico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#172236] bg-[#0d1424]">
                {asset.ports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500 text-xs font-mono">
                      No se detectaron puertos abiertos en este activo.
                    </td>
                  </tr>
                ) : (
                  asset.ports.map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#121b2f] transition-colors">
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-200">
                        {p.port} / {p.proto}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-mono">
                        <span className="font-semibold text-white">{p.service}</span>
                        {p.version && p.version !== '-' ? ` (${p.version})` : ''}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          <CheckCircle className="w-2.5 h-2.5" />
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700">
                          Monitorizado
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vulnerabilidades Correlacionadas (CVEs) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 tracking-wide uppercase">
              Vulnerabilidades CVEs ({asset.vulnerabilities.length} identificadas)
            </h3>
          </div>

          <div className="space-y-2.5">
            {asset.vulnerabilities.length === 0 ? (
              <div className="p-4 bg-[#0a0f1d] border border-[#1e2a42] rounded-lg text-center flex items-center justify-center gap-2 text-slate-400 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Excelente: Este activo no presenta CVEs críticos asociados.</span>
              </div>
            ) : (
              asset.vulnerabilities.map((v, idx) => (
                <div
                  key={idx}
                  className="bg-[#0a0f1d] border border-[#1e2a42] rounded-lg p-3.5 space-y-1.5 hover:border-[#283b5e] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span className="font-mono font-bold text-xs text-white tracking-wide">
                        {v.cveId}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        ({v.cvss || v.cvssScore || 7.5} {v.severity})
                      </span>
                    </div>
                    {v.servicePort && (
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {v.servicePort}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{v.description}</p>

                  {v.validationNote && (
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-300/90 pt-1 border-t border-[#172236]">
                      <Info className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{v.validationNote}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pie de acción con botón de reescaneo activo */}
      <div className="pt-4 mt-2 border-t border-[#1c273e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>
            SurfaceScan emite órdenes por Redis Pub/Sub hacia el binario nativo en C++.
          </span>
        </div>

        <button
          onClick={handleRescanClick}
          disabled={isRescanning}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#15233e] hover:bg-[#1a2d52] border border-[#2b416e] text-slate-100 text-xs font-semibold tracking-wide transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRescanning ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{isRescanning ? 'Enviando orden a C++...' : 'Escanear Activo'}</span>
        </button>
      </div>
    </div>
  )
}

export default AssetDetail
