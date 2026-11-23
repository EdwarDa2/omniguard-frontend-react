import apiClient from '@/services/api/client'
import type { AssetItem, AssetsResponse } from '@/types/asset.types'

/**
 * Servicio para consultar el inventario de activos y disparar escaneos activos (SurfaceScan).
 */
export const assetsService = {
  /**
   * Obtiene la lista completa de activos con sus KPIs perimetrales.
   */
  async getAssets(page = 0, size = 20): Promise<AssetsResponse> {
    const response = await apiClient.get<AssetsResponse>('/assets', {
      params: { page, size },
    })
    return response.data
  },

  /**
   * Obtiene el detalle técnico exhaustivo de un activo por su ID.
   */
  async getAssetById(id: number | string): Promise<AssetItem> {
    const response = await apiClient.get<AssetItem>(`/assets/${id}`)
    return response.data
  },

  /**
   * Dispara una orden de escaneo dirigida hacia un activo específico.
   * Publica la orden en Redis para que el Sensor C++ realice el sondeo.
   */
  async scanAsset(id: number | string): Promise<{ status: string; scanId?: string }> {
    const response = await apiClient.post<{ status: string; scanId?: string }>(
      `/assets/${id}/scan`,
    )
    return response.data
  },

  /**
   * Dispara el barrido perimetral sobre todos los activos de la red.
   */
  async scanAll(): Promise<{ status: string; scanId?: string }> {
    const response = await apiClient.post<{ status: string; scanId?: string }>(
      '/assets/scan-all',
    )
    return response.data
  },
}

export default assetsService
