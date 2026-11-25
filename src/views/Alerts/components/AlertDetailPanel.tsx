import React, { useState } from 'react'
import { CheckCircle2, ShieldAlert, Save } from 'lucide-react'
import type { AlertDto } from '@/types/alert.types'
import { alertsService } from '@/services/alerts/alerts.service'
import { useQueryClient } from '@tanstack/react-query'

interface AlertDetailPanelProps {
  alert: AlertDto | null
}

const statusOptions = [
  { value: 'OPEN', label: 'Nueva' },
  { value: 'EN_INVESTIGACION', label: 'En investigación' },
  { value: 'RESUELTA', label: 'Resuelta' },
  { value: 'FALSO_POSITIVO', label: 'Falso positivo' },
]

export const AlertDetailPanel: React.FC<AlertDetailPanelProps> = ({ alert }) => {
  const queryClient = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState<string>(alert?.status || 'NUEVA')
  const [resolutionNotes, setResolutionNotes] = useState<string>(alert?.resolutionNotes || '')
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  if (!alert) {
    return (
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-8 text-center text-slate-500 text-xs">
        Selecciona una alerta en la tabla superior para inspeccionar su telemetría forense.
      </div>
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await alertsService.updateStatus(alert.id, {
        status: selectedStatus,
        resolutionNotes,
      })
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 2500)
    } catch (e) {
      console.error('Error al actualizar estado de la alerta:', e)
    } finally {
      setIsSaving(false)
    }
  }

  const formattedTime = new Date(alert.detectedAt).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4">
      {/* Cabecera del Panel Forense */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1c273e] gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Incidente Forense <span className="font-mono text-emerald-400">#ALT-{alert.id}</span> •{' '}
            <span>{alert.title}</span>
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-slate-400 bg-[#0a0e19] px-2.5 py-1 rounded border border-[#1c273e]">
            {formattedTime} UTC
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Notificado a Discord/Telegram
          </span>
        </div>
      </div>

      {/* Cuadrícula de Metadatos de Red */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* IPs Origen y Destino */}
        <div className="bg-[#090d18] border border-[#192236] rounded-lg p-3 space-y-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              IP ORIGEN (HOSTILE)
            </span>
            <div className="font-mono text-slate-200 text-sm font-semibold mt-0.5">
              {alert.sourceIp}
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              IP DESTINO (INTERNAL TARGET)
            </span>
            <div className="font-mono text-slate-200 text-sm font-semibold mt-0.5">
              {alert.destinationIp}
            </div>
          </div>
        </div>

        {/* Puerto y Sensor */}
        <div className="bg-[#090d18] border border-[#192236] rounded-lg p-3 space-y-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              PROTOCOLO / PUERTO
            </span>
            <div className="font-mono text-slate-200 text-sm font-semibold mt-0.5">
              {alert.protocol} / {alert.destinationPort} ({alert.appProtocol})
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              SENSOR DETECTOR
            </span>
            <div className="font-mono text-slate-200 text-sm font-semibold mt-0.5">
              nids-cpp / {alert.rule}
            </div>
          </div>
        </div>

        {/* Regla Heurística y Descripción */}
        <div className="md:col-span-2 bg-[#090d18] border border-[#192236] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              REGLA HEURÍSTICA: <span className="text-emerald-400 font-mono">{alert.rule}</span>
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
              SEVERIDAD: {alert.severity}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Notas de Mitigación / Triaje:
            </label>
            <input
              type="text"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Ej: Tráfico bloqueado en firewall perimetral."
              className="w-full bg-[#0a0e19] border border-[#1e293b] rounded px-2.5 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>
      </div>

      {/* Barra de Acciones de Triaje (Cambio de Estado) */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#1c273e]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            ESTADO DEL INCIDENTE:
          </span>
          <div className="inline-flex rounded-lg bg-[#0a0e19] p-1 border border-[#1e293b]">
            {statusOptions.map((opt) => {
              const active = selectedStatus === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
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
            <span className="text-xs text-emerald-400 font-medium animate-pulse">
              ¡Estado persistido en PostgreSQL!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Triaje'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AlertDetailPanel
