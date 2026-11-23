import React, { useState } from 'react'
import { Plus, RefreshCw, AlertTriangle } from 'lucide-react'
import { AssetKpis } from './components/AssetKpis'
import { AssetList } from './components/AssetList'
import { AssetDetail } from './components/AssetDetail'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { assetsService } from '@/services/assets/assets.service'
import styles from './AssetsView.module.css'

export const AssetsView: React.FC = () => {
  const queryClient = useQueryClient()
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null)
  const [scanMessage, setScanMessage] = useState<{ text: string; isError?: boolean } | null>(null)
  const [isScanningAll, setIsScanningAll] = useState(false)

  // Consulta del catálogo de activos
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['assets'],
    queryFn: () => assetsService.getAssets(),
    staleTime: 15000,
  })

  const assets = data?.assets || []
  const kpis = data?.kpis

  // Seleccionar el primer activo por defecto
  const activeAssetId = selectedAssetId ?? (assets.length > 0 ? assets[0].id : null)
  const selectedAsset = assets.find((a) => a.id === activeAssetId) || (assets[0] ?? null)

  const showNotification = (text: string, isError = false) => {
    setScanMessage({ text, isError })
    setTimeout(() => setScanMessage(null), 4500)
  }

  // Escaneo perimetral global
  const handleStartGlobalScan = async () => {
    setIsScanningAll(true)
    showNotification('Emitiendo orden de escaneo masivo hacia microservicio C++...')
    try {
      await assetsService.scanAll()
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      showNotification('¡Orden de escaneo perimetral encolada en Redis Pub/Sub!')
    } catch {
      showNotification(
        'El bus de mensajería (Redis / C++) no está disponible en este momento.',
        true,
      )
    } finally {
      setIsScanningAll(false)
    }
  }

  // Escaneo dirigido a un activo
  const handleRescanAsset = async (id: number) => {
    showNotification(`Emitiendo orden de sondeo dirigido para host ID #${id}...`)
    try {
      await assetsService.scanAsset(id)
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      showNotification(`¡Sondeo para host #${id} completado con éxito!`)
    } catch {
      showNotification(
        `Sensor C++ ocupado o bus Redis desconectado para host #${id}.`,
        true,
      )
    }
  }

  return (
    <div className={styles.assetsContainer}>
      {/* Cabecera y botón de escaneo perimetral */}
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.viewTitle}>Assets</h1>
          <p className={styles.viewSubtitle}>
            SurfaceScan: Inventario de activos y auditoría activa de superficie de ataque
          </p>
        </div>

        <div className="flex items-center gap-3">
          {scanMessage && (
            <span
              className={`text-xs font-medium font-mono px-3 py-1 rounded border animate-pulse ${
                scanMessage.isError
                  ? 'bg-amber-950/50 border-amber-500/40 text-amber-300'
                  : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {scanMessage.text}
            </span>
          )}

          <button
            onClick={handleStartGlobalScan}
            disabled={isScanningAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isScanningAll ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 stroke-[3]" />
            )}
            <span>{isScanningAll ? 'Encolando...' : 'Iniciar escaneo masivo'}</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de KPIs de Superficie */}
      <AssetKpis kpis={kpis} />

      {/* Manejo de estados de carga y error */}
      {isError ? (
        <div className="p-8 text-center bg-[#0c101d] border border-rose-500/30 rounded-xl space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">
            No se pudo consultar el inventario de activos
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Hubo un error al conectar con el endpoint /api/v1/assets. Verifica que tu sesión esté activa.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      ) : isLoading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-7 h-7 animate-spin text-emerald-400" />
          <span className="text-xs font-mono">Cargando inventario de hosts desde el SOC...</span>
        </div>
      ) : (
        /* Vista dividida en dos columnas: Lista e Inspección */
        <div className={styles.splitViewLayout}>
          <AssetList
            assets={assets}
            selectedAssetId={activeAssetId}
            onSelectAsset={(id) => setSelectedAssetId(id)}
          />
          <AssetDetail asset={selectedAsset} onRescan={handleRescanAsset} />
        </div>
      )}
    </div>
  )
}

export default AssetsView
