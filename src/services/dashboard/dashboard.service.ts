import apiClient from '@/services/api/client'
import type { DashboardStatsResponse } from '@/types/dashboard.types'

/**
 * Servicio para consultar las métricas y telemetría en tiempo real del SOC.
 */
export const dashboardService = {
  /**
   * Obtiene los 4 KPIs principales, telemetría de red y alertas recientes.
   */
  async getStats(): Promise<DashboardStatsResponse> {
    const response = await apiClient.get<DashboardStatsResponse>('/dashboard/stats')
    return response.data
  },
}

export default dashboardService
