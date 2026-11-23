import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, User, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export const Header: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const roleDisplay = user?.role === 'ROLE_ADMIN' ? 'ADMIN' : 'VIEWER'

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

      <div className="flex items-center gap-4">
        {/* Información del analista conectado */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#1c2438]">
          <div className="w-8 h-8 rounded-full bg-[#172033] border border-[#24324f] flex items-center justify-center text-slate-300">
            <User className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-200 leading-tight font-mono">
              {user?.username || 'Analista'}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono tracking-wider font-semibold">
              {roleDisplay}
            </span>
          </div>
        </div>

        {/* Botón de cierre de sesión */}
        <button
          onClick={handleLogout}
          aria-label="Cerrar sesión segura"
          title="Cerrar sesión (Destruir cookies PASETO)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}

export default Header
