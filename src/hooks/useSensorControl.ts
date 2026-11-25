import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sensorService } from '@/services/sensor/sensor.service'
import type { SensorStatusResponse } from '@/types/sensor.types'
import type { DashboardStatsResponse } from '@/types/dashboard.types'

/**
 * Hook de mutación para controlar el sensor de red NIDS desde el Frontend.
 * Incluye actualización optimista en la caché de React Query para respuesta visual inmediata.
 */
export function useSensorControl() {
  const queryClient = useQueryClient()

  return useMutation<SensorStatusResponse, Error, 'START' | 'STOP'>({
    mutationFn: (action) => sensorService.changeStatus(action),
    onMutate: async (action) => {
      await queryClient.cancelQueries({ queryKey: ['dashboard-stats'] })

      const previousStats = queryClient.getQueryData<DashboardStatsResponse>(['dashboard-stats'])

      if (previousStats) {
        const targetStatus = action === 'START' ? 'ACTIVE' : 'PAUSED'
        const isStopping = action === 'STOP'

        queryClient.setQueryData<DashboardStatsResponse>(['dashboard-stats'], {
          ...previousStats,
          trafficActivity: {
            ...previousStats.trafficActivity,
            currentPacketsPerSec: isStopping ? 0 : previousStats.trafficActivity.currentPacketsPerSec,
            bandwidthMbps: isStopping ? 0.0 : previousStats.trafficActivity.bandwidthMbps,
            sensorStatus: targetStatus,
          },
        })
      }

      return { previousStats }
    },
    onError: (_err, _action, context: any) => {
      if (context?.previousStats) {
        queryClient.setQueryData(['dashboard-stats'], context.previousStats)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['sensor-status'] })
    },
  })
}

export default useSensorControl
