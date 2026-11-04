import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/common/Header'
import { Sidebar } from '@/components/common/Sidebar'
import styles from './MainLayout.module.css'

export const MainLayout: React.FC = () => {
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

