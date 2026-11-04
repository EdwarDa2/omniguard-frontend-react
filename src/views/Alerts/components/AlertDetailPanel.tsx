import React, { useState } from 'react'
import { CheckCircle2, ShieldAlert } from 'lucide-react'
import type { IncidentStatus } from '@/types/soc.types'
import type { AlertItemRow } from './AlertsTable'

interface AlertDetailPanelProps {
  alert: AlertItemRow | null
}

const statusOptions: { value: IncidentStatus; label: string }[] = [
  { value: 'NUEVA', label: 'Nueva' },
  { value: 'EN_INVESTIGACION', label: 'En investigación' },
  { value: 'RESUELTA', label: 'Resuelta' },
  { value: 'FALSO_POSITIVO', label: 'Falso positivo' },
]

export const AlertDetailPanel: React.FC<AlertDetailPanelProps> = ({ alert }) => {
  const [selectedStatus, setSelectedStatus] = useState<IncidentStatus>(
    alert ? alert.status : 'EN_INVESTIGACION'
  )
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Sync if selected alert changes
  React.useEffect(() => {
    if (alert) {
      setSelectedStatus(alert.status)
      setSavedSuccess(false)
    }
  }, [alert])

  if (!alert) {
    return (
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-8 text-center text-slate-500 text-xs">
        Selecciona una alerta en la tabla superior para ver su desglose técnico.
      </div>
    )
  }

  const handleSave = () => {
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4">
      {/* Detail Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1c273e] gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Detalle de alerta <span className="font-mono text-emerald-400">#{alert.code}</span> /{' '}
            <span>{alert.threat}</span>
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-slate-400 bg-[#0a0e19] px-2.5 py-1 rounded border border-[#1c273e]">
            {alert.time} UTC
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Notificado al Blue Team
          </span>
        </div>
      </div>

      {/* Technical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Source & Destination IPs */}
        <div className="bg-[#090d18] border border-[#192236] rounded-lg p-3 space-y-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              IP ORIGEN
            </span>
            <div className="font-mono text-slate-200 text-sm font-semibold mt-0.5">
              {alert.sourceIp}
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              IP DESTINO
            </span>
            <div className="font-mono text-slate-200 text-sm font-semibold mt-0.5">
              {alert.destinationIp}
            </div>
          </div>
        </div>

        {/* Port & Sensor */}
        <div className="bg-[#090d18] border border-[#192236] rounded-lg p-3 space-y-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              PROTOCOLO / PUERTO
            </span>
            <div className="font-mono text-slate-200 text-sm font-semibold mt-0.5">
              {alert.port}
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              SENSOR DETECTOR
            </span>
            <div className="font-mono text-slate-200 text-sm font-semibold mt-0.5">
              {alert.sensor}
            </div>
          </div>
        </div>

        {/* Heuristic & Threshold */}
        <div className="md:col-span-2 bg-[#090d18] border border-[#192236] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              HEURÍSTICA: <span className="text-emerald-400">{alert.heuristic}</span>
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
              {alert.observedAttempts} intentos en 60 s · Umbral: {alert.threshold} intentos
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-[#192236]/80 flex items-center gap-1.5">
            <span className="font-semibold text-slate-300">Sugerencia:</span>
            <span>{alert.suggestion}</span>
          </div>
        </div>
      </div>

      {/* Status Workflow Action Row */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#1c273e]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            ESTADO:
          </span>
          <div className="inline-flex rounded-lg bg-[#0a0e19] p-1 border border-[#1e293b]">
            {statusOptions.map((opt) => {
              const active = selectedStatus === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    active
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#151f33]'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-medium animate-fade-in">
              ¡Estado actualizado!
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
          >
            Guardar cambios
          </button>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>Nota de seguridad: el monitoreo es pasivo; las acciones no modifican el tráfico de red.</span>
        <span className="font-mono text-emerald-400/80">● Datos en directo</span>
      </div>
    </div>
  )
}

