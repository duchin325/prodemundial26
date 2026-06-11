'use client'
import { useState, useTransition } from 'react'
import type { DetallePartido } from '@/types/fixture'
import { asignarEquiposPartido } from '@/app/actions/bracket'
import { formatearFechaHora } from '@/lib/utils/fechas'

export type Equipo = {
  id: string
  nombre: string
  codigo: string
  bandera_emoji: string
}

type Props = {
  partidos: DetallePartido[]
  equipos: Equipo[]
}

const FASES_ORDEN = [
  'Ronda de 32',
  'Octavos de final',
  'Cuartos de final',
  'Semifinales',
  'Tercer puesto',
  'Final',
]

// ─────────────────────────────────────────────────────────────────
// FilaPartido: estado independiente por partido
// ─────────────────────────────────────────────────────────────────
function FilaPartido({ partido, equipos }: { partido: DetallePartido; equipos: Equipo[] }) {
  const initLocal = partido.local_id ?? ''
  const initVisitante = partido.visitante_id ?? ''

  const [localId, setLocalId] = useState(initLocal)
  const [visitanteId, setVisitanteId] = useState(initVisitante)
  // savedXxx refleja el último estado persistido (inicial o tras un Guardar exitoso)
  const [savedLocal, setSavedLocal] = useState(initLocal)
  const [savedVisitante, setSavedVisitante] = useState(initVisitante)

  const [isPending, startTransition] = useTransition()
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasChanged = localId !== savedLocal || visitanteId !== savedVisitante

  const statusDot =
    savedLocal && savedVisitante ? '🟢' : savedLocal || savedVisitante ? '🟡' : '🔴'
  const statusTitle =
    savedLocal && savedVisitante
      ? 'Ambos equipos asignados'
      : savedLocal || savedVisitante
        ? 'Parcialmente asignado'
        : 'Sin asignar'

  const fecha = formatearFechaHora(partido.fecha_hora)

  // Cada dropdown excluye el equipo ya seleccionado en el otro
  const opcionesLocal = equipos.filter((e) => e.id !== visitanteId)
  const opcionesVisitante = equipos.filter((e) => e.id !== localId)

  function handleGuardar() {
    setError(null)
    startTransition(async () => {
      const res = await asignarEquiposPartido(
        partido.id,
        localId || null,
        visitanteId || null,
      )
      if (!res.ok) {
        setError(res.error ?? 'Error al guardar')
      } else {
        setSavedLocal(localId)
        setSavedVisitante(visitanteId)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    })
  }

  return (
    <div className="px-4 py-3">
      <div className="flex flex-wrap items-start gap-x-4 gap-y-2 sm:flex-nowrap">
        {/* Status + número */}
        <div className="flex shrink-0 items-center gap-1.5 pt-1">
          <span title={statusTitle} aria-label={statusTitle} className="text-sm leading-none">
            {statusDot}
          </span>
          <span className="w-10 font-mono text-sm text-gray-500">#{partido.numero_partido}</span>
        </div>

        {/* Dropdowns local / visitante */}
        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Local */}
          <div className="flex items-center gap-2">
            <span className="w-20 shrink-0 truncate text-xs font-medium text-gray-500" title={partido.placeholder_local ?? undefined}>
              {partido.placeholder_local ?? 'Local'}
            </span>
            <span className="shrink-0 text-xs text-gray-400">→</span>
            <select
              value={localId}
              onChange={(e) => { setLocalId(e.target.value); setError(null) }}
              disabled={isPending}
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-2 py-1 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">— Sin asignar —</option>
              {opcionesLocal.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.bandera_emoji} {e.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Visitante */}
          <div className="flex items-center gap-2">
            <span className="w-20 shrink-0 truncate text-xs font-medium text-gray-500" title={partido.placeholder_visitante ?? undefined}>
              {partido.placeholder_visitante ?? 'Visitante'}
            </span>
            <span className="shrink-0 text-xs text-gray-400">→</span>
            <select
              value={visitanteId}
              onChange={(e) => { setVisitanteId(e.target.value); setError(null) }}
              disabled={isPending}
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-2 py-1 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">— Sin asignar —</option>
              {opcionesVisitante.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.bandera_emoji} {e.nombre}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
        </div>

        {/* Fecha */}
        <span className="shrink-0 whitespace-nowrap pt-1 text-xs text-gray-400">
          {fecha} (ARG)
        </span>

        {/* Guardar + badge */}
        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          {hasChanged && (
            <button
              type="button"
              onClick={handleGuardar}
              disabled={isPending}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Guardando...' : 'Guardar'}
            </button>
          )}
          {showSuccess && (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              ✓ Guardado
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// FormularioBracket: agrupa por fase, <details> nativo
// ─────────────────────────────────────────────────────────────────
export default function FormularioBracket({ partidos, equipos }: Props) {
  if (partidos.length === 0) {
    return <p className="text-gray-500">No hay partidos eliminatorios cargados en el fixture.</p>
  }

  // Agrupar respetando el orden de fases definido
  const porFase: Array<[string, DetallePartido[]]> = []
  const fasesVistas = new Set<string>()

  for (const fase of FASES_ORDEN) {
    const ps = partidos.filter((p) => p.fase === fase)
    if (ps.length > 0) {
      porFase.push([fase, ps])
      fasesVistas.add(fase)
    }
  }
  // Fases fuera del orden esperado (por si acaso)
  for (const p of partidos) {
    if (!fasesVistas.has(p.fase)) {
      fasesVistas.add(p.fase)
      porFase.push([p.fase, partidos.filter((x) => x.fase === p.fase)])
    }
  }

  return (
    <div className="space-y-4">
      {porFase.map(([fase, ps]) => (
        <details key={fase} open className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <summary className="flex cursor-pointer select-none items-center justify-between px-4 py-3 hover:bg-gray-50">
            <span className="font-semibold text-gray-800">{fase}</span>
            <span className="text-sm font-normal text-gray-400">{ps.length} partido{ps.length !== 1 ? 's' : ''}</span>
          </summary>
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            {ps.map((p) => (
              <FilaPartido key={p.id} partido={p} equipos={equipos} />
            ))}
          </div>
        </details>
      ))}
    </div>
  )
}
