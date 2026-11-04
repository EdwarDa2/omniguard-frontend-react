import React, { useState } from 'react'
import { RotateCw, ShieldAlert, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import type { SeverityLevel } from '@/types/soc.types'

export interface AssetFullDetail {
  id: string
  hostname: string
  ip: string
  description: string
  os: string
  lastScanned: string
  overallSeverity: SeverityLevel
  cvssScore: number
  ports: {
    port: number
    proto: string
    service: string
    version: string
    status: 'ABIERTO' | 'FILTRADO'
    vulnBadge?: {
      count: number
      severity: string
    }
  }[]
  vulnerabilities: {
    cveId: string
    cvss: number
    severity: string
    servicePort: string
    description: string
    validationNote?: string
  }[]
}

interface AssetDetailProps {
  asset: AssetFullDetail | null
}

export const AssetDetail: React.FC<AssetDetailProps> = ({ asset }) => {
  const [isRescanning, setIsRescanning] = useState(false)
  const [scanMessage, setScanMessage] = useState('')

  if (!asset) {
    return (
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-8 text-center text-slate-500 text-xs">
        Selecciona un activo de la lista para ver su auditoría de superficie.
      </div>
    )
  }

  const handleRescan = () => {
    setIsRescanning(true)
    setScanMessage('Solicitando escaneo al microservicio C++...')
    setTimeout(() => {
      setIsRescanning(false)
      setScanMessage('¡Escaneo completado! Datos sincronizados.')
      setTimeout(() => setScanMessage(''), 3000)
    }, 1500)
  }

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-5 flex flex-col justify-between">
      <div className="space-y-5">
        {/* Detail Header */}
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
              <span>SO: <strong className="text-slate-300 font-sans">{asset.os}</strong></span>
              <span>·</span>
              <span>Escaneado: <strong className="text-emerald-400">{asset.lastScanned}</strong></span>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1">
            <span className="px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase bg-rose-950/70 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.2)]">
              {asset.overallSeverity} ({asset.cvssScore} CVSS)
            </span>
            <span className="text-[10px] text-slate-400">Riesgo crítico detectado</span>
          </div>
        </div>

        {/* Section: Open Ports */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 tracking-wide uppercase">
              Puertos abiertos ({asset.ports.length} servicios detectados)
            </h3>
          </div>

          <div className="overflow-x-auto border border-[#1c273e] rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0a0f1d] border-b border-[#1c273e] text-slate-400 text-[10px] uppercase font-semibold">
                  <th className="py-2 px-3">Puerto</th>
                  <th className="py-2 px-3">Servicio / Software</th>
                  <th className="py-2 px-3">Estado</th>
                  <th className="py-2 px-3 text-right">Vulnerabilidades</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#172236] bg-[#0d1424]">
                {asset.ports.map((p, idx) => (
                  <tr key={idx} className="hover:bg-[#121b2f] transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-200">
                      {p.port} / {p.proto}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      <span className="font-semibold text-white">{p.service}:</span> {p.version}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle className="w-2.5 h-2.5" />
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {p.vulnBadge ? (
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                            p.vulnBadge.severity === 'CRITICA'
                              ? 'bg-rose-950/70 text-rose-300 border-rose-500/40'
                              : 'bg-orange-950/70 text-orange-300 border-orange-500/40'
                          }`}
                        >
                          {p.vulnBadge.count} {p.vulnBadge.severity}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700">
                          0 vulnerables
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Associated Vulnerabilities */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 tracking-wide uppercase">
              Vulnerabilidades asociadas ({asset.vulnerabilities.length} detectadas)
            </h3>
          </div>

          <div className="space-y-2.5">
            {asset.vulnerabilities.map((v, idx) => (
              <div
                key={idx}
                className="bg-[#0a0f1d] border border-[#1e2a42] rounded-lg p-3.5 space-y-1.5 hover:border-[#283b5e] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert
                      className={`w-4 h-4 ${
                        v.severity === 'CRÍTICA' ? 'text-rose-400' : 'text-orange-400'
                      }`}
                    />
                    <span className="font-mono font-bold text-xs text-white tracking-wide">
                      {v.cveId}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ({v.cvss} {v.severity})
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {v.servicePort}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{v.description}</p>

                {v.validationNote && (
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-300/90 pt-1 border-t border-[#172236]">
                    <Info className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{v.validationNote}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-2 border-t border-[#1c273e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <AlertTriangle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>
            Nota de validación: las coincidencias de CVE se basan en la versión del software detectado.
          </span>
        </div>

        <div className="flex items-center gap-3">
          {scanMessage && (
            <span className="text-xs text-emerald-400 font-medium animate-pulse">
              {scanMessage}
            </span>
          )}
          <button
            onClick={handleRescan}
            disabled={isRescanning}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#15233e] hover:bg-[#1a2d52] border border-[#2b416e] text-slate-100 text-xs font-semibold tracking-wide transition-all active:scale-95 disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRescanning ? 'animate-spin' : ''}`} />
            Reescanear activo
          </button>
        </div>
      </div>
    </div>
  )
}

