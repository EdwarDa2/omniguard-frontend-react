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
} from 'lucide-react'
import type { PlatformUser, UserRole, UserStatus } from '@/types/soc.types'

const initialUsers: PlatformUser[] = [
  {
    id: '1',
    name: 'Ana Torres',
    email: 'ana@empresa.com',
    role: 'Admin',
    status: 'Activo',
    lastLogin: 'Hoy, 14:28',
    isCurrentUser: true,
  },
  {
    id: '2',
    name: 'Marco Ruiz',
    email: 'marco@empresa.com',
    role: 'Admin',
    status: 'Activo',
    lastLogin: 'Ayer, 18:12',
  },
  {
    id: '3',
    name: 'Lucía Vega',
    email: 'lucia@empresa.com',
    role: 'Viewer',
    status: 'Activo',
    lastLogin: 'Hoy, 11:04',
  },
  {
    id: '4',
    name: 'Diego Santos',
    email: 'diego.santos@empresa.com',
    role: 'Viewer',
    status: 'Pendiente',
    lastLogin: 'Ayer, 16:30',
  },
  {
    id: '5',
    name: 'Eva Ríos',
    email: 'eva@empresa.com',
    role: 'Viewer',
    status: 'Revocado',
    lastLogin: '02 Nov, 09:31',
  },
]

export const IAMTab: React.FC = () => {
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Form state
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<UserRole>('Viewer')
  const [createMsg, setCreateMsg] = useState('')

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus: UserStatus = u.status === 'Revocado' ? 'Activo' : 'Revocado'
          return { ...u, status: newStatus }
        }
        return u
      })
    )
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newEmail.trim()) return

    const newUser: PlatformUser = {
      id: Date.now().toString(),
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      status: 'Activo',
      lastLogin: 'Nunca',
    }

    setUsers((prev) => [...prev, newUser])
    setNewName('')
    setNewEmail('')
    setNewRole('Viewer')
    setCreateMsg('¡Analista creado e invitación enviada!')
    setTimeout(() => setCreateMsg(''), 3000)
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const activeCount = users.filter((u) => u.status === 'Activo').length
  const adminCount = users.filter((u) => u.role === 'Admin').length
  const revokedCount = users.filter((u) => u.status === 'Revocado').length

  return (
    <div className="space-y-5">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex items-center justify-between shadow-md">
          <div>
            <span className="text-xs font-semibold text-slate-400">Analistas activos</span>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
              {String(activeCount).padStart(2, '0')}
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
              {String(adminCount).padStart(2, '0')}
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
              {String(revokedCount).padStart(2, '0')}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-400">
            <UserX className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Usuarios de la plataforma
            </h3>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#172236] hover:bg-[#1e2d47] border border-[#243452] text-slate-200 text-xs font-medium transition-colors">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            Exportar CSV
          </button>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 pt-1">
          <div className="md:col-span-6 relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar nombre o correo"
              className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="md:col-span-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
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
              className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="ALL">Estado: Todos</option>
              <option value="Activo">Activo</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Revocado">Revocado</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#1c273e] rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0a0f1d] border-b border-[#1c273e] text-slate-400 text-[10px] uppercase font-semibold">
                <th className="py-2.5 px-3.5">Usuario</th>
                <th className="py-2.5 px-3.5">Rol</th>
                <th className="py-2.5 px-3.5">Estado</th>
                <th className="py-2.5 px-3.5">Último acceso</th>
                <th className="py-2.5 px-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172236] bg-[#0d1424]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#121b2f] transition-colors">
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100">{u.name}</span>
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
                          : u.status === 'Pendiente'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
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
                    {u.isCurrentUser ? (
                      <span className="text-[11px] text-slate-500 italic">Tu cuenta</span>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
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

        <div className="text-[11px] text-slate-500">
          Mostrando 1-{filteredUsers.length} de {users.length} usuarios
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
              Nombre y apellidos
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ej. Roberto Méndez"
              className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
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
              placeholder="analista@empresa.com"
              className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Rol
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="Viewer">Viewer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold tracking-wide transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] active:scale-95"
            >
              Crear analista
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>Asigna el mínimo privilegio necesario. Los permisos se definen por rol.</span>
          {createMsg && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              {createMsg}
            </span>
          )}
        </div>
      </div>

      {/* Role definition cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="bg-[#0a0f1d] border border-[#1b253b] rounded-lg p-3.5 flex items-start gap-3">
          <div className="p-2 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Admin</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Administra usuarios, configuraciones y reglas de notificación externas del SOC.
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
              Consulta paneles, inventario y eventos NIDS en modo lectura, sin realizar cambios.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

