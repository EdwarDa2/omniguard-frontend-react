import React from 'react'
import { Shield, User } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <header className="h-14 border-b border-[#1c2438] bg-[#0c101d] px-6 flex items-center justify-between select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-slate-100 text-sm tracking-wide">OmniGuard SOC</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          SYSTEM OPERATIONAL
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          aria-label="Perfil de usuario"
          className="w-8 h-8 rounded-full bg-[#172033] border border-[#24324f] flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}

