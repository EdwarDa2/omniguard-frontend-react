import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { Shield, Lock, User, AlertCircle, ArrowRight, KeyRound } from 'lucide-react'

export const LoginView: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, error, clearError } = useAuthStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password || isSubmitting) return

    setIsSubmitting(true)
    try {
      const success = await login({ username, password })
      if (success) {
        navigate(from, { replace: true })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillTestCredentials = () => {
    clearError()
    setUsername('admin')
    setPassword('OmniGuardAdmin2026!')
  }

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col justify-center items-center px-4 select-none relative overflow-hidden">
      {/* Luces de fondo decorativas */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* Cabecera / Identidad */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0c101d] border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.2)] mb-4">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-slate-100 uppercase">
            OmniGuard <span className="text-emerald-400">SOC</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono tracking-wide">
            Blue Team Defense & Threat Intelligence Platform
          </p>
        </div>

        {/* Tarjeta de Formulario */}
        <div className="bg-[#0c101d] border border-[#1c2438] rounded-xl p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1c2438]">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest font-mono">
              Acceso Restringido
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              PASETO v4
            </span>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-lg bg-rose-950/40 border border-rose-500/40 flex items-start gap-3 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Usuario / Identificador SOC
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    clearError()
                    setUsername(e.target.value)
                  }}
                  required
                  placeholder="analista"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#070a13] border border-[#24324f] rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Contraseña de Acceso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    clearError()
                    setPassword(e.target.value)
                  }}
                  required
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#070a13] border border-[#24324f] rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                  <span>Autenticando...</span>
                </div>
              ) : (
                <>
                  <span>Ingresar a la Consola</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Botón de ayuda para rellenar credenciales en pruebas */}
          <div className="mt-6 pt-5 border-t border-[#1c2438] flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] text-slate-500">¿Entorno de desarrollo?</span>
            <button
              type="button"
              onClick={fillTestCredentials}
              className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 font-mono transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Usar cuenta Admin</span>
            </button>
          </div>
        </div>

        {/* Footer legal */}
        <p className="text-center text-[11px] text-slate-600 mt-6 font-mono">
          OmniGuard SOC • Sesión protegida mediante tokens PASETO v4 HttpOnly
        </p>
      </div>
    </div>
  )
}

export default LoginView
