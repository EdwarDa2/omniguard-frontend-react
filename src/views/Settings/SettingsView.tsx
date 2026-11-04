import React, { useState } from 'react'
import { IAMTab } from './components/IAMTab'
import { NotificationsTab } from './components/NotificationsTab'
import styles from './SettingsView.module.css'

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'IAM' | 'NOTIFICACIONES'>('IAM')

  return (
    <div className={styles.settingsContainer}>
      {/* Top Header */}
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.viewTitle}>Settings</h1>
          <p className={styles.viewSubtitle}>
            Configuración del SOC: Usuarios, permisos e integraciones externas
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabNavigation}>
        <button
          onClick={() => setActiveTab('IAM')}
          className={`${styles.tabButton} ${
            activeTab === 'IAM' ? styles.tabButtonActive : ''
          }`}
        >
          IAM: Gestión de usuarios
        </button>
        <button
          onClick={() => setActiveTab('NOTIFICACIONES')}
          className={`${styles.tabButton} ${
            activeTab === 'NOTIFICACIONES' ? styles.tabButtonActive : ''
          }`}
        >
          Notificaciones
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'IAM' ? <IAMTab /> : <NotificationsTab />}
    </div>
  )
}

export default SettingsView
