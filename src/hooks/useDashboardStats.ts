import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard/dashboard.service'
import type { DashboardStatsResponse } from '@/types/dashboard.types'

const POLLING_INTERVAL = Number(import.meta.env.VITE_POLLING_INTERVAL_MS) || 15000

/**
 * Hook para consultar y sincronizar las estadísticas del Dashboard en tiempo real.
 */
export function useDashboardStats() {
  return useQuery<DashboardStatsResponse>({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
    refetchInterval: POLLING_INTERVAL,
    staleTime: 10000,
  })
}

export default useDashboardStats
