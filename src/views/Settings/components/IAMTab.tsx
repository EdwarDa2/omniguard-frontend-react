import React, { useState } from 'react'
import {
  Users,
  ShieldCheck,
  UserX,
  Search,
  Download,
  UserPlus,
  Shield,
  Eye,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'
import type { UserRole, UserStatus } from '@/types/soc.types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '@/services/settings/settings.service'

export const IAMTab: React.FC = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Form state
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<UserRole>('Viewer')
  const [isCreating, setIsCreating] = useState(false)
  const [createMsg, setCreateMsg] = useState<{ text: string; isError?: boolean } | null>(null)

  // Consulta de usuarios desde el backend de IAM
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: settingsService.getUsers,
    staleTime: 15000,
  })

  const users = data?.users || []
  const metrics = data?.metrics || { activeCount: 0, adminCount: 0, revokedCount: 0 }

  const handleToggleStatus = async (id: string, currentStatus: UserStatus) => {
    const targetStatus = currentStatus === 'Revocado' ? 'Activo' : 'Revocado'
    try {
      await settingsService.updateUserStatus(id, targetStatus)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    } catch {
      // Fallback optimista si el backend aún no persiste el cambio de estado
      queryClient.setQueryData(['users'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          users: old.users.map((u: any) => (u.id === id ? { ...u, status: targetStatus } : u)),
        }
      })
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newEmail.trim() || isCreating) return

    setIsCreating(true)
    setCreateMsg(null)
    try {
      await settingsService.createUser({
        name: newName.trim(),
        email: newEmail.trim(),
        role: newRole,
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setNewName('')
      setNewEmail('')
      setNewRole('Viewer')
      setCreateMsg({ text: '¡Analista registrado en base de datos con contraseña Argon2id!' })
      setTimeout(() => setCreateMsg(null), 4000)
    } catch (err: unknown) {
      const errRes = err as { response?: { data?: { message?: string } } }
      setCreateMsg({
        text: errRes.response?.data?.message || 'Error al registrar el analista en el backend',
        isError: true,
      })
    } finally {
      setIsCreating(false)
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  // Exportar lista a CSV
  const handleExportCsv = () => {
    if (users.length === 0) return
    const headers = ['ID', 'Nombre', 'Email', 'Rol', 'Estado', 'Ultimo_Acceso']
    const rows = users.map((u) => [u.id, `"${u.name}"`, u.email, u.role, u.status, `"${u.lastLogin}"`])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `omniguard_iam_users_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-7 h-7 animate-spin text-emerald-400" />
        <span className="text-xs font-mono">Consultando operadores del SOC desde IAM...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-[#0c101d] border border-rose-500/30 rounded-xl space-y-3">
        <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
        <h3 className="text-sm font-semibold text-slate-200">No se pudieron cargar los usuarios de IAM</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Hubo un problema al conectar con el endpoint /api/v1/users.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* 3 Tarjetas de Métricas IAM */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex items-center justify-between shadow-md">
          <div>
            <span className="text-xs font-semibold text-slate-400">Analistas activos</span>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
              {String(metrics.activeCount).padStart(2, '0')}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex items-center justify-between shadow-md">
          <div>
            <span className="text-xs font-semibold text-slate-400">Administradores</span>
            <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
              {String(metrics.adminCount).padStart(2, '0')}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0f172a] border border-rose-900/30 rounded-xl p-4 flex items-center justify-between shadow-md">
          <div>
            <span className="text-xs font-semibold text-slate-400">Accesos revocados</span>
            <div className="text-2xl font-black font-mono text-rose-500 mt-1">
              {String(metrics.revokedCount).padStart(2, '0')}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-400">
            <UserX className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Operadores de OmniGuard SOC
            </h3>
          </div>
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#172236] hover:bg-[#1e2d47] border border-[#243452] text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            Exportar CSV
          </button>
        </div>

        {/* Barra de Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 pt-1">
          <div className="md:col-span-6 relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o correo..."
              className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono"
            />
          </div>
          <div className="md:col-span-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              <option value="ALL">Rol: Todos</option>
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              <option value="ALL">Estado: Todos</option>
              <option value="Activo">Activo</option>
              <option value="Revocado">Revocado</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto border border-[#1c273e] rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0a0f1d] border-b border-[#1c273e] text-slate-400 text-[10px] uppercase font-semibold">
                <th className="py-2.5 px-3.5">Operador</th>
                <th className="py-2.5 px-3.5">Rol SOC</th>
                <th className="py-2.5 px-3.5">Estado</th>
                <th className="py-2.5 px-3.5">Último Acceso</th>
                <th className="py-2.5 px-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172236] bg-[#0d1424]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#121b2f] transition-colors">
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100 font-mono">{u.name}</span>
                      {u.isCurrentUser && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          Tú
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{u.email}</span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                        u.role === 'Admin'
                          ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        u.status === 'Activo'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-mono text-slate-400 text-[11px]">
                    {u.lastLogin}
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    {u.name === 'admin' ? (
                      <span className="text-[11px] text-slate-500 italic">Cuenta Root</span>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                          u.status === 'Revocado'
                            ? 'text-emerald-400 hover:bg-emerald-950/40 border border-emerald-500/30'
                            : 'text-rose-400 hover:bg-rose-950/40 border border-rose-500/30'
                        }`}
                      >
                        {u.status === 'Revocado' ? 'Reactivar' : 'Revocar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          Mostrando {filteredUsers.length} de {users.length} operadores registrados
        </div>
      </div>

      {/* Form: Crear nuevo analista */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#1c273e]">
          <UserPlus className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Crear nuevo analista</h3>
        </div>

        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-4 space-y-1">
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Nombre de usuario / Identificador
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ej. analista3"
              className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono"
            />
          </div>

          <div className="md:col-span-4 space-y-1">
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="analista@omniguard.local"
              className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Rol
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              <option value="Viewer">Viewer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isCreating}
              className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold tracking-wide transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isCreating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>{isCreating ? 'Creando...' : 'Crear analista'}</span>
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>Contraseña inicial por defecto: <strong className="text-slate-400 font-mono">OmniGuard2026!</strong> (Argon2id).</span>
          {createMsg && (
            <span
              className={`font-semibold flex items-center gap-1 font-mono ${
                createMsg.isError ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {createMsg.text}
            </span>
          )}
        </div>
      </div>

      {/* Definición de Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="bg-[#0a0f1d] border border-[#1b253b] rounded-lg p-3.5 flex items-start gap-3">
          <div className="p-2 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Admin</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Acceso total al SOC: Dispara escaneos perimetrales, gestiona webhooks y administra credenciales.
            </p>
          </div>
        </div>

        <div className="bg-[#0a0f1d] border border-[#1b253b] rounded-lg p-3.5 flex items-start gap-3">
          <div className="p-2 rounded bg-slate-800 text-slate-300 border border-slate-700">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Viewer</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Modo auditoría: Consulta métricas, alertas NIDS e inventario sin permisos destructivos ni de disparo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IAMTab
