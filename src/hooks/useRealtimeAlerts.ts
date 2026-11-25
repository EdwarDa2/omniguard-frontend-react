import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { AlertDto } from '@/types/alert.types'
import type { ScanCompletedEventPayload } from '@/types/asset.types'

export interface RealtimeAlertsOptions {
  enabled?: boolean
  onNewAlert?: (alert: AlertDto) => void
  onAlertUpdate?: (update: { id: string; status: string; updatedAt: string }) => void
  onScanCompleted?: (scanResult: ScanCompletedEventPayload) => void
  onSensorStatusChange?: (status: string) => void
}

// Estado singleton compartido para evitar múltiples conexiones EventSource simultáneas
let sharedEventSource: EventSource | null = null
let reconnectTimeout: number | null = null
let closeTimeout: number | null = null
const activeSubscribers = new Set<RealtimeAlertsOptions>()

/**
 * Hook central para recibir telemetría y eventos en vivo vía Server-Sent Events (SSE).
 *
 * Utiliza una única conexión compartida para todas las vistas (Dashboard, Alerts, Assets).
 *
 * Canales escuchados:
 * - alert:new       -> Nueva amenaza detectada por NIDS / Analyzer
 * - alert:update    -> Cambio de estado en triaje de incidente
 * - scan:completed  -> Finalización de escaneo perimetral TCP y persistencia NVD
 * - :keep-alive     -> Comentario de latido periódico (ignorado automáticamente)
 */
export function useRealtimeAlerts({
  enabled = true,
  onNewAlert,
  onAlertUpdate,
  onScanCompleted,
  onSensorStatusChange,
}: RealtimeAlertsOptions = {}) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled) {
      return
    }

    const subscriber: RealtimeAlertsOptions = {
      enabled,
      onNewAlert,
      onAlertUpdate,
      onScanCompleted,
      onSensorStatusChange,
    }
    activeSubscribers.add(subscriber)

    // Si había un cierre programado por cambio de ruta, cancelarlo
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      closeTimeout = null
    }

    const ensureConnection = () => {
      if (sharedEventSource && (sharedEventSource.readyState === EventSource.OPEN || sharedEventSource.readyState === EventSource.CONNECTING)) {
        return
      }

      const sseUrl = `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/alerts/stream`
      const es = new EventSource(sseUrl, { withCredentials: true })
      sharedEventSource = es

      // 1. Nueva alerta NIDS detectada
      es.addEventListener('alert:new', (event: MessageEvent) => {
        try {
          const alertData: AlertDto = JSON.parse(event.data)
          queryClient.invalidateQueries({ queryKey: ['alerts'] })
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })

          activeSubscribers.forEach((sub) => {
            sub.onNewAlert?.(alertData)
          })
        } catch (e) {
          console.warn('[SSE] Error procesando evento alert:new:', e)
        }
      })

      // 2. Actualización de estado de alerta
      es.addEventListener('alert:update', (event: MessageEvent) => {
        try {
          const updateData = JSON.parse(event.data) as { id: string; status: string; updatedAt: string }
          queryClient.invalidateQueries({ queryKey: ['alerts'] })
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
          if (updateData.id) {
            queryClient.invalidateQueries({ queryKey: ['alert', updateData.id] })
          }

          activeSubscribers.forEach((sub) => {
            sub.onAlertUpdate?.(updateData)
          })
        } catch (e) {
          console.warn('[SSE] Error procesando evento alert:update:', e)
        }
      })

      // 3. Escaneo perimetral finalizado por microservicio y correlacionado en NVD
      es.addEventListener('scan:completed', (event: MessageEvent) => {
        try {
          const scanResult = JSON.parse(event.data) as ScanCompletedEventPayload
          // Invalidar caché de activos y estadísticas del SOC
          queryClient.invalidateQueries({ queryKey: ['assets'] })
          if (scanResult.assetId) {
            queryClient.invalidateQueries({ queryKey: ['asset', scanResult.assetId] })
          }
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })

          // Disparar evento personalizado global en window
          window.dispatchEvent(
            new CustomEvent<ScanCompletedEventPayload>('omniguard:scan-completed', {
              detail: scanResult,
            }),
          )

          activeSubscribers.forEach((sub) => {
            sub.onScanCompleted?.(scanResult)
          })
        } catch (e) {
          console.warn('[SSE] Error procesando evento scan:completed:', e)
        }
      })

      // 4. Cambio de estado operativo del sensor NIDS
      es.addEventListener('sensor:status', (event: MessageEvent) => {
        try {
          const statusPayload = JSON.parse(event.data) as { status: string; timestamp?: string }
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
          queryClient.invalidateQueries({ queryKey: ['sensor-status'] })

          activeSubscribers.forEach((sub) => {
            sub.onSensorStatusChange?.(statusPayload.status)
          })
        } catch (e) {
          console.warn('[SSE] Error procesando evento sensor:status:', e)
        }
      })

      // Mensaje de inicialización o ping
      es.onmessage = (event: MessageEvent) => {
        if (event.data && event.data !== 'ping') {
          try {
            const parsed = JSON.parse(event.data)
            if (parsed.status === 'CONNECTED') {
              console.info('[SSE] Conexión establecida con el monitor NIDS')
            }
          } catch {
            // Ignorar heartbeats
          }
        }
      }

      es.onerror = () => {
        if (sharedEventSource) {
          sharedEventSource.close()
          sharedEventSource = null
        }

        // Reintento de reconexión tras 5 segundos si aún hay observadores activos
        if (activeSubscribers.size > 0 && !reconnectTimeout) {
          reconnectTimeout = window.setTimeout(() => {
            reconnectTimeout = null
            if (activeSubscribers.size > 0) {
              ensureConnection()
            }
          }, 5000)
        }
      }
    }

    ensureConnection()

    return () => {
      activeSubscribers.delete(subscriber)
      // Si no quedan suscriptores activos, programar el cierre ordenado de la conexión
      if (activeSubscribers.size === 0) {
        closeTimeout = window.setTimeout(() => {
          if (activeSubscribers.size === 0 && sharedEventSource) {
            sharedEventSource.close()
            sharedEventSource = null
          }
          closeTimeout = null
        }, 3000)
      }
    }
  }, [enabled, queryClient, onNewAlert, onAlertUpdate, onScanCompleted, onSensorStatusChange])
}

export default useRealtimeAlerts
