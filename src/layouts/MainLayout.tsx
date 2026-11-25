import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/common/Header'
import { Sidebar } from '@/components/common/Sidebar'
import { useRealtimeAlerts } from '@/hooks/useRealtimeAlerts'
import styles from './MainLayout.module.css'

export const MainLayout: React.FC = () => {
  // Conexión reactiva continua vía Server-Sent Events (SSE) para toda la consola
  useRealtimeAlerts()

  return (
    <div className={styles.layoutContainer}>
      <Header />
      <div className={styles.mainBody}>
        <Sidebar />
        <main className={styles.contentArea}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

