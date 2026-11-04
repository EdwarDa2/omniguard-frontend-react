import React from 'react'
import styles from './DashboardView.module.css'

export const DashboardView: React.FC = () => {
  return (
    <div className={styles.dashboardView}>
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Dashboard</h2>
        <p className="text-xs text-slate-400">Resumen Ejecutivo y Salud General de la Red</p>
      </div>

      <div className={styles.kpiGrid}>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4">
          <span className="text-xs text-slate-400 font-medium">Open Ports</span>
          <div className="text-2xl font-bold text-rose-500 mt-1">14</div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4">
          <span className="text-xs text-slate-400 font-medium">Active Threats</span>
          <div className="text-2xl font-bold text-orange-400 mt-1">3</div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4">
          <span className="text-xs text-slate-400 font-medium">Vulnerable Assets</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">8</div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4">
          <span className="text-xs text-slate-400 font-medium">Alerts (24h)</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">1,204</div>
        </div>
      </div>

      <div className={styles.chartCard}>
        <h3 className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Network Traffic Activity</h3>
        <div className="h-48 flex items-center justify-center text-xs text-slate-500">
          (Gráfica de tráfico preparada para Etapa 3.1)
        </div>
      </div>

      <div className={styles.tableCard}>
        <h3 className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Recent Alerts</h3>
        <div className="py-6 text-center text-xs text-slate-500">
          (Tabla de alertas recientes preparada para Etapa 3.1)
        </div>
      </div>
    </div>
  )
}
export default DashboardView

