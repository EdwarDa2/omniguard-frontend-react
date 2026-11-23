import React from 'react'
import { KpiCard } from './components/KpiCard'
import { TrafficChart } from './components/TrafficChart'
import { RecentAlertsTable } from './components/RecentAlertsTable'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import styles from './DashboardView.module.css'

export const DashboardView: React.FC = () => {
  const { data, isLoading, isError, refetch, isFetching } = useDashboardStats()

  if (isLoading) {
    return (
      <div className={styles.dashboardContainer}>
        {/* Esqueleto de carga */}
        <section className={styles.kpiSection}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#0f172a]/50 border border-[#1e293b] rounded-xl p-5 h-24 animate-pulse flex items-center justify-between"
            >
              <div className="space-y-2">
                <div className="h-3 w-20 bg-slate-800 rounded"></div>
                <div className="h-6 w-12 bg-slate-700 rounded"></div>
              </div>
              <div className="h-5 w-14 bg-slate-800 rounded"></div>
            </div>
          ))}
        </section>

        <section className={`${styles.cardPanel} h-72 animate-pulse bg-[#0f172a]/40 border-[#1e293b]`}></section>
        <section className={`${styles.cardPanel} h-60 animate-pulse bg-[#0f172a]/40 border-[#1e293b]`}></section>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-[#0c101d] border border-[#1e293b] rounded-xl">
        <AlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
        <h3 className="text-base font-semibold text-slate-200">No se pudieron cargar las estadísticas del SOC</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md">
          Hubo un problema al consultar la telemetría del backend. Comprueba que el servicio de Spring Boot esté en ejecución.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reintentar Conexión</span>
        </button>
      </div>
    )
  }

  const { kpis, trafficActivity, recentAlerts } = data

  return (
    <div className={styles.dashboardContainer}>
      {/* 4 KPI Cards conectados al Backend */}
      <section className={styles.kpiSection}>
        <KpiCard
          title={kpis.openPorts.title}
          value={kpis.openPorts.value}
          level={kpis.openPorts.level}
        />
        <KpiCard
          title={kpis.activeThreats.title}
          value={kpis.activeThreats.value}
          level={kpis.activeThreats.level}
        />
        <KpiCard
          title={kpis.vulnerableAssets.title}
          value={kpis.vulnerableAssets.value}
          level={kpis.vulnerableAssets.level}
        />
        <KpiCard
          title={kpis.alerts24h.title}
          value={kpis.alerts24h.value}
          level={kpis.alerts24h.level}
        />
      </section>

      {/* Gráfica de Tráfico de Red en Vivo */}
      <section className={styles.cardPanel}>
        <div className={styles.cardHeader}>
          <div className="flex items-center gap-2">
            <h2 className={styles.cardTitle}>Network Traffic Activity</h2>
            {isFetching && (
              <RefreshCw className="w-3 h-3 text-slate-500 animate-spin" />
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Sondeo dinámico cada 15s
          </span>
        </div>
        <TrafficChart traffic={trafficActivity} />
      </section>

      {/* Tabla de Alertas Recientes */}
      <section className={styles.cardPanel}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recent Alerts</h2>
          <span className="text-[11px] text-slate-500 font-mono">
            {recentAlerts.length} incidentes detectados
          </span>
        </div>
        <RecentAlertsTable alerts={recentAlerts} />
      </section>
    </div>
  )
}

export default DashboardView
