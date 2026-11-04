import React from 'react'
import styles from './AlertsView.module.css'

export const AlertsView: React.FC = () => {
  return (
    <div className={styles.alertsView}>
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Alerts</h2>
        <p className="text-xs text-slate-400">Monitor NIDS: Detección de intrusiones y respuesta a incidentes</p>
      </div>

      <div className={styles.severityGrid}>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4">
          <span className="text-xs text-slate-400 font-medium">Críticas</span>
          <div className="text-2xl font-bold text-rose-500 mt-1">03</div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4">
          <span className="text-xs text-slate-400 font-medium">Altas</span>
          <div className="text-2xl font-bold text-orange-400 mt-1">07</div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4">
          <span className="text-xs text-slate-400 font-medium">Medias</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">09</div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4">
          <span className="text-xs text-slate-400 font-medium">Bajas</span>
          <div className="text-2xl font-bold text-blue-400 mt-1">05</div>
        </div>
      </div>

      <div className={styles.tableSection}>
        <h3 className="text-xs font-semibold text-slate-300 uppercase">Registro de alertas</h3>
        <div className="py-6 text-center text-xs text-slate-500">
          (Tabla de registros NIDS preparada para Etapa 3.2)
        </div>
      </div>

      <div className={styles.detailSection}>
        <h3 className="text-xs font-semibold text-slate-300 uppercase">Detalle de alerta</h3>
        <div className="py-4 text-center text-xs text-slate-500">
          (Panel técnico de análisis preparado para Etapa 3.2)
        </div>
      </div>
    </div>
  )
}
export default AlertsView

