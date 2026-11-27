import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard/dashboard.service'
import { getActiveSensorId } from '@/utils/sensorId'
import { getSessionStartTime } from '@/utils/sessionTime'
import type { DashboardStatsResponse } from '@/types/dashboard.types'

const POLLING_INTERVAL = Number(import.meta.env.VITE_POLLING_INTERVAL_MS) || 15000

/**
 * Hook para consultar y sincronizar las estadísticas del Dashboard en tiempo real.
 * Si se detecta un sensor_id activo en la sesión o URL, se solicita la telemetría aislada.
 * Filtra las alertas recientes a partir de la sesión activa para arrancar siempre en limpio (0 alertas).
 */
export function useDashboardStats(customSensorId?: string, customSince?: string) {
  const sensorId = customSensorId || getActiveSensorId() || undefined
  const since = customSince || getSessionStartTime()

  return useQuery<DashboardStatsResponse>({
    queryKey: ['dashboard-stats', sensorId, since],
    queryFn: () => dashboardService.getStats(sensorId, since),
    refetchInterval: POLLING_INTERVAL,
    staleTime: 10000,
  })
}

export default useDashboardStats
