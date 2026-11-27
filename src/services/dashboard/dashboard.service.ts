import apiClient from '@/services/api/client'
import type { DashboardStatsResponse } from '@/types/dashboard.types'

/**
 * Servicio para consultar las métricas y telemetría en tiempo real del SOC.
 */
export const dashboardService = {
  /**
   * Obtiene los 4 KPIs principales, telemetría de red y alertas recientes.
   * Permite filtrar las métricas por sensor_id para aislamiento multi-dispositivo
   * y por since (ISO-8601) para ciclo de vida de alertas por sesión activa (Opción C).
   */
  async getStats(sensorId?: string, since?: string): Promise<DashboardStatsResponse> {
    const params: Record<string, string> = {}
    if (sensorId) params.sensor_id = sensorId
    if (since) params.since = since
    const response = await apiClient.get<DashboardStatsResponse>('/dashboard/stats', {
      params: Object.keys(params).length > 0 ? params : undefined,
    })
    return response.data
  },
}

export default dashboardService
