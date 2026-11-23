import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { AlertDto } from '@/types/alert.types'

interface RealtimeAlertsOptions {
  enabled?: boolean
  onNewAlert?: (alert: AlertDto) => void
}

/**
 * Hook para recibir alertas en vivo vía Server-Sent Events (SSE).
 */
export function useRealtimeAlerts({ enabled = true, onNewAlert }: RealtimeAlertsOptions = {}) {
  const queryClient = useQueryClient()
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      return
    }

    const sseUrl = `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/alerts/stream`

    const connectSSE = () => {
      // EventSource nativo enviando cookies HttpOnly de sesión
      const es = new EventSource(sseUrl, { withCredentials: true })
      eventSourceRef.current = es

      const handleAlert = (rawPayload: string) => {
        try {
          const alertData: AlertDto = JSON.parse(rawPayload)
          // Refrescar caché de alertas y estadísticas del Dashboard
          queryClient.invalidateQueries({ queryKey: ['alerts'] })
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
          onNewAlert?.(alertData)
        } catch (e) {
          console.warn('[SSE] Error procesando evento de alerta:', e)
        }
      }

      es.addEventListener('alert:new', (event: MessageEvent) => {
        handleAlert(event.data)
      })

      es.onmessage = (event: MessageEvent) => {
        if (event.data && event.data !== 'ping') {
          handleAlert(event.data)
        }
      }

      es.onerror = () => {
        es.close()
        eventSourceRef.current = null
        // Reintento de reconexión tras 5 segundos
        reconnectTimeoutRef.current = window.setTimeout(() => {
          if (enabled) {
            connectSSE()
          }
        }, 5000)
      }
    }

    connectSSE()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [enabled, queryClient, onNewAlert])
}

export default useRealtimeAlerts
