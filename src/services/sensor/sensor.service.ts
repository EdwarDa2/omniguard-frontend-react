import { apiClient } from '@/services/api/client'
import type { SensorStatusRequest, SensorStatusResponse } from '@/types/sensor.types'

export const sensorService = {
  getStatus: async (): Promise<SensorStatusResponse> => {
    const response = await apiClient.get<SensorStatusResponse>('/sensor/status')
    return response.data
  },

  changeStatus: async (action: 'START' | 'STOP'): Promise<SensorStatusResponse> => {
    const response = await apiClient.post<SensorStatusResponse>('/sensor/status', {
      action,
    } as SensorStatusRequest)
    return response.data
  },
}

export default sensorService
