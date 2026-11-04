import React, { useState } from 'react'
import {
  Send,
  Save,
  CheckCircle2,
  Lock,
  MessageSquare,
  Bot,
  RotateCcw,
} from 'lucide-react'

export const NotificationsTab: React.FC = () => {
  // Discord state
  const [discordWebhook, setDiscordWebhook] = useState(
    'https://discord.com/api/webhooks/12093849/omnig-soc-alerts-key'
  )
  const [isDiscordConfigured, setIsDiscordConfigured] = useState(true)
  const [discordTestMsg, setDiscordTestMsg] = useState('')

  // Telegram state
  const [telegramChatIds, setTelegramChatIds] = useState('-1001234567890, -1009876543210')
  const [isTelegramConfigured, setIsTelegramConfigured] = useState(true)
  const [telegramTestMsg, setTelegramTestMsg] = useState('')

  // Severity Rules state
  const [notifyCritical, setNotifyCritical] = useState(true)
  const [notifyHigh, setNotifyHigh] = useState(true)
  const [notifyMedium, setNotifyMedium] = useState(false)
  const [notifyLow, setNotifyLow] = useState(false)
  const [rulesSaveMsg, setRulesSaveMsg] = useState('')

  const handleTestDiscord = () => {
    setDiscordTestMsg('Enviando alerta de prueba a Discord...')
    setTimeout(() => {
      setDiscordTestMsg('✓ Alerta de prueba entregada en canal #soc-blue-team')
      setTimeout(() => setDiscordTestMsg(''), 4000)
    }, 1200)
  }

  const handleTestTelegram = () => {
    setTelegramTestMsg('Enviando alerta de prueba al bot de Telegram...')
    setTimeout(() => {
      setTelegramTestMsg('✓ Mensaje recibido por el bot del Blue Team')
      setTimeout(() => setTelegramTestMsg(''), 4000)
    }, 1200)
  }

  const handleSaveRules = () => {
    setRulesSaveMsg('¡Reglas de severidad sincronizadas con microservicio Python!')
    setTimeout(() => setRulesSaveMsg(''), 3500)
  }

  const handleDiscardRules = () => {
    setNotifyCritical(true)
    setNotifyHigh(true)
    setNotifyMedium(false)
    setNotifyLow(false)
    setRulesSaveMsg('Valores reestablecidos por defecto.')
    setTimeout(() => setRulesSaveMsg(''), 2500)
  }

  return (
    <div className="space-y-5">
      {/* 2 Integration Cards (Discord & Telegram) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Discord Card */}
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-500/30">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">Discord</h3>
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
              Envía las alertas del SOC al canal privado del Blue Team mediante un webhook.
            </p>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                URL del webhook
              </label>
              <input
                type="password"
                value={discordWebhook}
                onChange={(e) => setDiscordWebhook(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50"
              />
              <span className="text-[10px] text-slate-500 block">
                Usa el webhook de tu canal de destino. La URL se ocultará tras guardarse.
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151f33] hover:bg-[#1c2a44] border border-[#243452] text-slate-300 text-xs font-medium transition-colors"
              >
                <Send className="w-3 h-3" />
                Enviar prueba
              </button>
              <button
                onClick={() => setIsDiscordConfigured(true)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              >
                Guardar webhook
              </button>
            </div>
          </div>
        </div>

        {/* Telegram Card */}
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-sky-950/60 text-sky-400 border border-sky-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">Telegram</h3>
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
              Recibe las alertas del SOC en los grupos o chats del equipo de respuesta.
            </p>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Chat IDs de destino
              </label>
              <input
                type="text"
                value={telegramChatIds}
                onChange={(e) => setTelegramChatIds(e.target.value)}
                placeholder="Ej: -1001234587890, -1009876543210"
                className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50"
              />
              <span className="text-[10px] text-slate-500 block">
                Separa los IDs con comas. El bot debe tener permiso para enviar mensajes al chat.
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1c273e] flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              {telegramTestMsg || 'Última prueba: entrega confirmada.'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTestTelegram}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151f33] hover:bg-[#1c2a44] border border-[#243452] text-slate-300 text-xs font-medium transition-colors"
              >
                <Send className="w-3 h-3" />
                Enviar prueba
              </button>
              <button
                onClick={() => setIsTelegramConfigured(true)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              >
                Guardar Chat IDs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reglas de envío */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">Reglas de envío</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Selecciona las severidades que se enviarán a los destinos configurados.
          </p>
        </div>

        {/* Severity selection toggles */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => setNotifyCritical(!notifyCritical)}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all flex items-center gap-2 ${
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
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all flex items-center gap-2 ${
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
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all flex items-center gap-2 ${
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
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all flex items-center gap-2 ${
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
          Se aplicarán al guardar las reglas. Solo recibirán avisos los destinos configurados.
        </span>

        {/* Security Warning note */}
        <div className="bg-[#0a0e19] border border-[#1b253b] rounded-lg p-3 flex items-start gap-2.5 text-xs text-slate-400">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-200">Protege los destinos del Blue Team:</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Las URLs y los tokens son confidenciales; no los compartas. Solo los usuarios con rol Admin pueden modificar estas integraciones.
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#151f33] hover:bg-[#1c2a44] border border-[#243452] text-slate-300 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Descartar
            </button>
            <button
              onClick={handleSaveRules}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] active:scale-95"
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

