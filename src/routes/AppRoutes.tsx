import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import DashboardView from '@/views/Dashboard/DashboardView'
import AlertsView from '@/views/Alerts/AlertsView'
import AssetsView from '@/views/Assets/AssetsView'
import SettingsView from '@/views/Settings/SettingsView'
import LoginView from '@/views/Login/LoginView'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import { useAuthStore } from '@/store/useAuthStore'
import { ShieldAlert } from 'lucide-react'

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#070a13] flex flex-col items-center justify-center text-slate-300 select-none">
        <div className="relative mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
          <ShieldAlert className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto" />
        </div>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-mono">
          Verificando sesión segura (PASETO)...
        </p>
      </div>
    )
  }

  return (
    <Routes>
      {/* Ruta pública de acceso */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginView />}
      />

      {/* Rutas protegidas bajo sesión PASETO */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="alerts" element={<AlertsView />} />
          <Route path="assets" element={<AssetsView />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes
