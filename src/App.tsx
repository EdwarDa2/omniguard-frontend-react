import { Shield, Activity, Bell, Server, Settings } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#111827] border border-slate-800 rounded-xl p-8 shadow-2xl text-center space-y-6">
        <div className="inline-flex p-4 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
          <Shield className="w-12 h-12" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">OmniGuard SOC</h1>
          <p className="text-sm text-slate-400 mt-1">Etapa 1: Tecnologías y Entorno Instalado con Éxito</p>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex flex-col items-center p-2 rounded bg-slate-900/50">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] text-slate-400 mt-1">Dashboard</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded bg-slate-900/50">
            <Bell className="w-5 h-5 text-rose-400" />
            <span className="text-[10px] text-slate-400 mt-1">Alerts</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded bg-slate-900/50">
            <Server className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] text-slate-400 mt-1">Assets</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded bg-slate-900/50">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] text-slate-400 mt-1">Settings</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Stack listo: React 19 + TypeScript + Vite + Tailwind CSS
        </div>
      </div>
    </div>
  )
}
