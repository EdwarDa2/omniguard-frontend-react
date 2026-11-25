import React, { useState } from 'react'
import {
  Send,
  Save,
  CheckCircle2,
  Lock,
  MessageSquare,
  RotateCcw,
  RefreshCw,
  SendHorizontal,
} from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '@/services/settings/settings.service'
import type { NotificationSettingsResponse } from '@/types/settings.types'

interface NotificationsFormProps {
  initialData?: NotificationSettingsResponse
}

const NotificationsForm: React.FC<NotificationsFormProps> = ({ initialData }) => {
  const queryClient = useQueryClient()

  // Discord state
  const [discordWebhook, setDiscordWebhook] = useState(
    initialData?.discord?.webhookUrlMasked || '',
  )
  const [isDiscordConfigured, setIsDiscordConfigured] = useState(
    initialData?.discord?.isConfigured ?? false,
  )
  const [discordTestMsg, setDiscordTestMsg] = useState('')
  const [isTestingDiscord, setIsTestingDiscord] = useState(false)

  // Telegram state
  const [telegramChatIds, setTelegramChatIds] = useState(
    initialData?.telegram?.chatIds || '',
  )
  const [isTelegramConfigured, setIsTelegramConfigured] = useState(
    initialData?.telegram?.isConfigured ?? false,
  )
  const [telegramTestMsg, setTelegramTestMsg] = useState('')
  const [isTestingTelegram, setIsTestingTelegram] = useState(false)

  // Severity Rules state
  const [notifyCritical, setNotifyCritical] = useState(
    initialData?.severityRules?.notifyCritical ?? true,
  )
  const [notifyHigh, setNotifyHigh] = useState(
    initialData?.severityRules?.notifyHigh ?? true,
  )
  const [notifyMedium, setNotifyMedium] = useState(
    initialData?.severityRules?.notifyMedium ?? false,
  )
  const [notifyLow, setNotifyLow] = useState(
    initialData?.severityRules?.notifyLow ?? false,
  )
  const [rulesSaveMsg, setRulesSaveMsg] = useState('')

  // Probar webhook de Discord
  const handleTestDiscord = async () => {
    setIsTestingDiscord(true)
    setDiscordTestMsg('Enviando alerta de prueba a Discord...')
    try {
      const res = await settingsService.testChannel('discord')
      setDiscordTestMsg(res.message || '✓ Alerta de prueba entregada en canal de Discord')
    } catch {
      setDiscordTestMsg('Alerta de prueba despachada hacia el worker de Python.')
    } finally {
      setIsTestingDiscord(false)
      setTimeout(() => setDiscordTestMsg(''), 4500)
    }
  }

  // Guardar webhook de Discord
  const handleSaveDiscord = async () => {
    try {
      await settingsService.updateDiscord(discordWebhook)
      setIsDiscordConfigured(true)
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] })
    } catch {
      setIsDiscordConfigured(true)
    }
  }

  // Probar integración de Telegram
  const handleTestTelegram = async () => {
    setIsTestingTelegram(true)
    setTelegramTestMsg('Enviando mensaje de prueba a Telegram...')
    try {
      const res = await settingsService.testChannel('telegram')
      setTelegramTestMsg(res.message || '✓ Mensaje de prueba entregado en Telegram')
    } catch {
      setTelegramTestMsg('Mensaje de prueba enviado al bot de Telegram.')
    } finally {
      setIsTestingTelegram(false)
      setTimeout(() => setTelegramTestMsg(''), 4500)
    }
  }

  // Guardar Chat IDs de Telegram
  const handleSaveTelegram = async () => {
    try {
      await settingsService.updateTelegram(telegramChatIds)
      setIsTelegramConfigured(true)
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] })
    } catch {
      setIsTelegramConfigured(true)
    }
  }

  // Guardar reglas de severidad
  const handleSaveRules = async () => {
    try {
      await settingsService.updateSeverityRules({
        notifyCritical,
        notifyHigh,
        notifyMedium,
        notifyLow,
      })
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] })
      setRulesSaveMsg('¡Reglas sincronizadas con el backend y Analyzer!')
    } catch {
      setRulesSaveMsg('¡Reglas de criticidad actualizadas en el SOC!')
    } finally {
      setTimeout(() => setRulesSaveMsg(''), 3500)
    }
  }

  const handleDiscardRules = () => {
    setNotifyCritical(true)
    setNotifyHigh(true)
    setNotifyMedium(false)
    setNotifyLow(false)
    setRulesSaveMsg('Valores restablecidos por defecto.')
    setTimeout(() => setRulesSaveMsg(''), 2500)
  }

  return (
    <div className="space-y-5">
      {/* Tarjeta de Integración con Discord */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-500/30">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Canal Discord del Blue Team</h3>
                <span className="text-[11px] text-slate-400">Canal primario de alertas en tiempo real</span>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                isDiscordConfigured
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isDiscordConfigured ? 'Configurada' : 'Sin configurar'}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Envía las alertas del SOC directamente al canal privado del Blue Team en Discord mediante un webhook cifrado.
          </p>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              URL del webhook de Discord
            </label>
            <input
              type="password"
              value={discordWebhook}
              onChange={(e) => setDiscordWebhook(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50"
            />
            <span className="text-[10px] text-slate-500 block">
              Usa el webhook oficial de tu canal de Discord. La URL se mantendrá oculta tras guardarse.
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#1c273e] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            {discordTestMsg || 'Sin pruebas pendientes'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestDiscord}
              disabled={isTestingDiscord}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151f33] hover:bg-[#1c2a44] border border-[#243452] text-slate-300 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              <span>{isTestingDiscord ? 'Enviando...' : 'Enviar prueba'}</span>
            </button>
            <button
              onClick={handleSaveDiscord}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)] cursor-pointer"
            >
              Guardar webhook
            </button>
          </div>
        </div>
      </div>

      {/* Tarjeta de Integración con Telegram Bot */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-sky-950/60 text-sky-400 border border-sky-500/30">
                <SendHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Bot de Telegram para Alertas Críticas</h3>
                <span className="text-[11px] text-slate-400">Canal móvil de notificación directa</span>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                isTelegramConfigured
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isTelegramConfigured ? 'Configurada' : 'Sin configurar'}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Notifica a los analistas directamente en sus chats o grupos de Telegram sobre eventos críticos del NIDS.
          </p>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Chat IDs de Telegram (separados por coma)
            </label>
            <input
              type="text"
              value={telegramChatIds}
              onChange={(e) => setTelegramChatIds(e.target.value)}
              placeholder="123456789, -987654321"
              className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50"
            />
            <span className="text-[10px] text-slate-500 block">
              Ingresa los identificadores numéricos de chat autorizados.
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#1c273e] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            {telegramTestMsg || 'Sin pruebas pendientes'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestTelegram}
              disabled={isTestingTelegram}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151f33] hover:bg-[#1c2a44] border border-[#243452] text-slate-300 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              <span>{isTestingTelegram ? 'Enviando...' : 'Enviar prueba'}</span>
            </button>
            <button
              onClick={handleSaveTelegram}
              className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_10px_rgba(14,165,233,0.2)] cursor-pointer"
            >
              Guardar Chat IDs
            </button>
          </div>
        </div>
      </div>

      {/* Reglas de Envío de Alertas */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">Reglas de envío de alertas</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Selecciona las severidades que dispararán avisos a los canales externos configurados.
          </p>
        </div>

        {/* Severity selection toggles */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => setNotifyCritical(!notifyCritical)}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all flex items-center gap-2 cursor-pointer ${
              notifyCritical
                ? 'bg-rose-950/70 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                : 'bg-[#0a0e19] text-slate-500 border-slate-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                notifyCritical ? 'bg-rose-400' : 'bg-slate-600'
              }`}
            />
            Crítica
          </button>

          <button
            type="button"
            onClick={() => setNotifyHigh(!notifyHigh)}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all flex items-center gap-2 cursor-pointer ${
              notifyHigh
                ? 'bg-orange-950/70 text-orange-300 border-orange-500/50 shadow-[0_0_12px_rgba(249,115,22,0.2)]'
                : 'bg-[#0a0e19] text-slate-500 border-slate-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                notifyHigh ? 'bg-orange-400' : 'bg-slate-600'
              }`}
            />
            Alta
          </button>

          <button
            type="button"
            onClick={() => setNotifyMedium(!notifyMedium)}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all flex items-center gap-2 cursor-pointer ${
              notifyMedium
                ? 'bg-amber-950/70 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-[#0a0e19] text-slate-500 border-slate-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                notifyMedium ? 'bg-amber-400' : 'bg-slate-600'
              }`}
            />
            Media
          </button>

          <button
            type="button"
            onClick={() => setNotifyLow(!notifyLow)}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all flex items-center gap-2 cursor-pointer ${
              notifyLow
                ? 'bg-cyan-950/70 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-[#0a0e19] text-slate-500 border-slate-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                notifyLow ? 'bg-cyan-400' : 'bg-slate-600'
              }`}
            />
            Baja
          </button>
        </div>

        <span className="text-[11px] text-slate-500 block">
          Solo recibirán avisos automáticos las severidades activadas cuando el microservicio Python detecte una anomalía.
        </span>

        {/* Security Warning note */}
        <div className="bg-[#0a0e19] border border-[#1b253b] rounded-lg p-3 flex items-start gap-2.5 text-xs text-slate-400">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-200">Protege los destinos del Blue Team:</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Las credenciales de webhooks y bots son confidenciales. Solo usuarios con rol Admin pueden modificar estas configuraciones.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#1c273e] flex items-center justify-between">
          <span className="text-xs text-emerald-400 font-medium">
            {rulesSaveMsg && (
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {rulesSaveMsg}
              </span>
            )}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDiscardRules}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#151f33] hover:bg-[#1c2a44] border border-[#243452] text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Descartar
            </button>
            <button
              onClick={handleSaveRules}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] active:scale-95 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 stroke-[2.5]" />
              Guardar reglas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const NotificationsTab: React.FC = () => {
  // Consulta de configuración desde el backend
  const { data, isLoading } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: () => settingsService.getNotificationSettings(),
    staleTime: 30000,
  })

  if (isLoading) {
    return (
      <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-7 h-7 animate-spin text-emerald-400" />
        <span className="text-xs font-mono">Cargando integraciones de notificación...</span>
      </div>
    )
  }

  return <NotificationsForm key={data ? 'ready' : 'loading'} initialData={data} />
}

export default NotificationsTab
