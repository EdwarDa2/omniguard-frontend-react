import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, AlertTriangle, Layers, Settings } from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { path: '/assets', label: 'Assets', icon: Layers },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-56 bg-[#0a0e1a] border-r border-[#1c2438] flex flex-col py-4 select-none shrink-0">
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#12192b]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

