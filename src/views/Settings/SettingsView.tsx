import React, { useState } from 'react'
import styles from './SettingsView.module.css'

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'IAM' | 'NOTIFICACIONES'>('IAM')

  return (
    <div className={styles.settingsView}>
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Settings</h2>
        <p className="text-xs text-slate-400">Configuración del SOC: Usuarios, permisos e integraciones externas</p>
      </div>

      <div className={styles.tabNavigation}>
        <button
          onClick={() => setActiveTab('IAM')}
          className={`${styles.tabButton} ${activeTab === 'IAM' ? styles.tabButtonActive : ''}`}
        >
          IAM: Gestión de usuarios
        </button>
        <button
          onClick={() => setActiveTab('NOTIFICACIONES')}
          className={`${styles.tabButton} ${activeTab === 'NOTIFICACIONES' ? styles.tabButtonActive : ''}`}
        >
          Notificaciones
        </button>
      </div>

      <div className={styles.settingsCard}>
        {activeTab === 'IAM' ? (
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase">Gestión de Usuarios y Roles</h3>
            <div className="py-12 text-center text-xs text-slate-500">
              (Panel de usuarios IAM preparado para Etapa 3.4)
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase">Integraciones y Reglas de Envío</h3>
            <div className="py-12 text-center text-xs text-slate-500">
              (Panel de Discord/Telegram preparado para Etapa 3.4)
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default SettingsView

