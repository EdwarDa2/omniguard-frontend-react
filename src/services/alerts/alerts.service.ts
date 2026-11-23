import apiClient from '@/services/api/client'
import type {
  AlertDto,
  PaginatedAlertsResponse,
  AlertFilterParams,
  UpdateAlertStatusPayload,
} from '@/types/alert.types'

/**
 * Servicio para consultar y gestionar el Centro de Alertas NIDS.
 */
export const alertsService = {
  /**
   * Obtiene la lista paginada de alertas con filtros opcionales.
   */
  async getAlerts(params?: AlertFilterParams): Promise<PaginatedAlertsResponse> {
    const response = await apiClient.get<PaginatedAlertsResponse>('/alerts', {
      params,
    })
    return response.data
  },

  /**
   * Obtiene el detalle técnico forense de una alerta específica.
   */
  async getAlertById(id: number | string): Promise<AlertDto> {
    const response = await apiClient.get<AlertDto>(`/alerts/${id}`)
    return response.data
  },

  /**
   * Actualiza el estado de investigación y notas de resolución del incidente.
   */
  async updateStatus(
    id: number | string,
    payload: UpdateAlertStatusPayload,
  ): Promise<AlertDto> {
    const response = await apiClient.patch<AlertDto>(`/alerts/${id}/status`, payload)
    return response.data
  },
}

export default alertsService
