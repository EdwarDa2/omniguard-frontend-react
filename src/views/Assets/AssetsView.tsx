import React from 'react'
import styles from './AssetsView.module.css'

export const AssetsView: React.FC = () => {
  return (
    <div className={styles.assetsView}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Assets</h2>
          <p className="text-xs text-slate-400">SurfaceScan: Inventario y auditoría de superficie de ataque</p>
        </div>
        <button className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-semibold tracking-wide transition-colors">
          + Iniciar escaneo
        </button>
      </div>

      <div className={styles.kpiBar}>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4">
          <span className="text-xs text-slate-400 font-medium">Activos descubiertos</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">12</div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4">
          <span className="text-xs text-slate-400 font-medium">Activos vulnerables</span>
          <div className="text-2xl font-bold text-rose-500 mt-1">08</div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4">
          <span className="text-xs text-slate-400 font-medium">Puertos abiertos</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">14</div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4">
          <span className="text-xs text-slate-400 font-medium">Último escaneo</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">14:30</div>
        </div>
      </div>

      <div className={styles.splitLayout}>
        <div className={styles.inventoryCol}>
          <h3 className="text-xs font-semibold text-slate-300 uppercase">Inventario de activos</h3>
          <div className="py-12 text-center text-xs text-slate-500">
            (Lista de activos preparada para Etapa 3.3)
          </div>
        </div>

        <div className={styles.detailCol}>
          <h3 className="text-xs font-semibold text-slate-300 uppercase">Detalle del activo</h3>
          <div className="py-12 text-center text-xs text-slate-500">
            (Ficha de servicios y CVEs preparada para Etapa 3.3)
          </div>
        </div>
      </div>
    </div>
  )
}
export default AssetsView

