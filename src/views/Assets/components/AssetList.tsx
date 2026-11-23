import React, { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Server, Shield } from 'lucide-react'
import type { AssetItem } from '@/types/asset.types'

interface AssetListProps {
  assets: AssetItem[]
  selectedAssetId: number | null
  onSelectAsset: (id: number) => void
}

const severityStyleMap: Record<string, string> = {
  CRITICA: 'bg-rose-950/70 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.15)]',
  CRITICAL: 'bg-rose-950/70 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.15)]',
  ALTA: 'bg-orange-950/70 text-orange-300 border-orange-500/40 shadow-[0_0_8px_rgba(249,115,22,0.15)]',
  HIGH: 'bg-orange-950/70 text-orange-300 border-orange-500/40 shadow-[0_0_8px_rgba(249,115,22,0.15)]',
  MEDIA: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
  WARNING: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
  BAJA: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40',
  'SIN CVES': 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
  NORMAL: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
}

export const AssetList: React.FC<AssetListProps> = ({
  assets,
  selectedAssetId,
  onSelectAsset,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'WITH_CVES'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAssets = assets.filter((asset) => {
    const matchesTab = activeTab === 'ALL' || asset.hasCve
    const matchesSearch =
      asset.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.ip.includes(searchQuery)
    return matchesTab && matchesSearch
  })

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 shadow-xl flex flex-col h-full">
      {/* Título de inventario */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1c273e]">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white tracking-wide">Inventario de activos</h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
          {assets.length} hosts descubiertos
        </span>
      </div>

      {/* Buscador de activos */}
      <div className="relative my-3">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar hostname o IP..."
          className="w-full bg-[#0a0e19] border border-[#1e293b] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono"
        />
      </div>

      {/* Pestañas de filtrado rápido */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-[#182338] text-white border border-[#2b3c5e]'
              : 'text-slate-400 hover:text-slate-200 bg-[#0b101c]'
          }`}
        >
          Todos: {assets.length}
        </button>
        <button
          onClick={() => setActiveTab('WITH_CVES')}
          className={`py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            activeTab === 'WITH_CVES'
              ? 'bg-[#182338] text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-rose-400 bg-[#0b101c]'
          }`}
        >
          Con CVEs: {assets.filter((a) => a.hasCve).length}
        </button>
      </div>

      {/* Lista de tarjetas de activo */}
      <div className="space-y-2 flex-1 overflow-y-auto pr-1">
        {filteredAssets.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">
            No se encontraron activos con el criterio de búsqueda.
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const isSelected = asset.id === selectedAssetId
            const label = asset.severityLabel || (asset.hasCve ? 'CON CVES' : 'SIN CVES')
            const badgeClass = severityStyleMap[label] || severityStyleMap['SIN CVES']

            return (
              <div
                key={asset.id}
                onClick={() => onSelectAsset(asset.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#142038] border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40'
                    : 'bg-[#0a0f1d] border-[#1a243a] hover:bg-[#10192e] hover:border-[#273757]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield
                      className={`w-3.5 h-3.5 ${
                        isSelected ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    />
                    <span className="font-semibold text-xs text-white tracking-wide font-mono">
                      {asset.hostname}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <span>{asset.ip}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{asset.portsCount} puertos abiertos</span>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded uppercase border ${badgeClass}`}
                >
                  {label}
                </span>
              </div>
            )
          })
        )}
      </div>

      {/* Paginación */}
      <div className="pt-3 mt-2 border-t border-[#1c273e] flex items-center justify-between text-[11px] text-slate-400">
        <span>{filteredAssets.length} activos visualizados</span>
        <div className="flex items-center gap-1">
          <button
            aria-label="Página anterior"
            disabled
            className="p-1 rounded bg-[#131c2e] border border-slate-800 text-slate-400 disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-slate-300 font-semibold px-1">1 / 1</span>
          <button
            aria-label="Página siguiente"
            disabled
            className="p-1 rounded bg-[#131c2e] border border-slate-800 text-slate-400 disabled:opacity-40"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssetList
