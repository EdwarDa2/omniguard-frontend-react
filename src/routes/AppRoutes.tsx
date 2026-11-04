import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import DashboardView from '@/views/Dashboard/DashboardView'
import AlertsView from '@/views/Alerts/AlertsView'
import AssetsView from '@/views/Assets/AssetsView'
import SettingsView from '@/views/Settings/SettingsView'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardView />} />
        <Route path="alerts" element={<AlertsView />} />
        <Route path="assets" element={<AssetsView />} />
        <Route path="settings" element={<SettingsView />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
export default AppRoutes

