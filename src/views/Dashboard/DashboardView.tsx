import React from 'react'
import { KpiCard } from './components/KpiCard'
import { TrafficChart } from './components/TrafficChart'
import { RecentAlertsTable } from './components/RecentAlertsTable'
import styles from './DashboardView.module.css'

export const DashboardView: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      {/* 4 KPI Cards */}
      <section className={styles.kpiSection}>
        <KpiCard title="Open Ports" value="14" level="CRITICAL" />
        <KpiCard title="Active Threats" value="3" level="HIGH" />
        <KpiCard title="Vulnerable Assets" value="8" level="WARNING" />
        <KpiCard title="Alerts (24h)" value="1,204" level="NORMAL" />
      </section>

      {/* Network Traffic Activity Chart */}
      <section className={styles.cardPanel}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Network Traffic Activity</h2>
        </div>
        <TrafficChart />
      </section>

      {/* Recent Alerts Table */}
      <section className={styles.cardPanel}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recent Alerts</h2>
        </div>
        <RecentAlertsTable />
      </section>
    </div>
  )
}

export default DashboardView
