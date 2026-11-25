import apiClient from '@/services/api/client'
import type { AssetItem, AssetsResponse, ScanResponse } from '@/types/asset.types'

/**
 * Servicio para consultar el inventario de activos y disparar escaneos activos (SurfaceScan).
 */
export const assetsService = {
  /**
   * Obtiene la lista completa de activos con sus KPIs perimetrales.
   */
  async getAssets(page = 0, size = 20, status?: string): Promise<AssetsResponse> {
    const response = await apiClient.get<AssetsResponse>('/assets', {
      params: { page, size, ...(status ? { status } : {}) },
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
   * Publica la orden en Redis para que el Worker de escaneo realice el sondeo TCP.
   */
  async scanAsset(id: number | string, ports = '1-1024'): Promise<ScanResponse> {
    const response = await apiClient.post<ScanResponse>(
      `/assets/${id}/scan`,
      ports ? { ports } : undefined,
    )
    return response.data
  },

  /**
   * Dispara el barrido perimetral sobre todos los activos autorizados de la red.
   */
  async scanAll(ports = '1-1024'): Promise<ScanResponse> {
    const response = await apiClient.post<ScanResponse>(
      '/assets/scan-all',
      ports ? { ports } : undefined,
    )
    return response.data
  },
}

export default assetsService
