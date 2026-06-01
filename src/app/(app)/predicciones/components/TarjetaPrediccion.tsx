'use client'
import { useTransition, useState } from 'react'
import type { DetallePartido } from '@/types/fixture'
import { type Prediccion, type ResultadoPartido } from '@/lib/predicciones'
import { guardarPrediccion } from '@/app/actions/predicciones'
import { getBanderaUrl } from '@/lib/utils/banderas'

type Props = {
  partido: DetallePartido
  prediccionActual: Prediccion | null
  isLocked: boolean
  onOptimisticUpdate: (partidoId: string, nueva: ResultadoPartido) => void
  onRevert: (partidoId: string, prev: Prediccion | null) => void
}

// ─── helpers ───────────────────────────────────────────────────────────────

function formatHora(iso: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    hour12: false,
  }).format(new Date(iso)) + ' UTC'
}

type Btn = { value: ResultadoPartido; label: string; flagUrl?: string }

function botonesParaPartido(p: DetallePartido): Btn[] {
  const lLocal = p.local_nombre ?? p.placeholder_local ?? 'Local'
  const lVisitante = p.visitante_nombre ?? p.placeholder_visitante ?? 'Visitante'
  const flagLocal = getBanderaUrl(p.local_codigo)
  const flagVisitante = getBanderaUrl(p.visitante_codigo)
  if (!p.es_eliminatorio) {
    return [
      { value: 'Local', label: lLocal, flagUrl: flagLocal || undefined },
      { value: 'Empate', label: 'Empate' },
      { value: 'Visitante', label: lVisitante, flagUrl: flagVisitante || undefined },
    ]
  }
  return [
    { value: 'Local', label: lLocal, flagUrl: flagLocal || undefined },
    { value: 'Visitante', label: lVisitante, flagUrl: flagVisitante || undefined },
    { value: 'Penales_L', label: `${lLocal} (pen.)` },
    { value: 'Penales_V', label: `${lVisitante} (pen.)` },
  ]
}

function clasesBoton(
  value: ResultadoPartido,
  prediccionActual: Prediccion | null,
  partido: DetallePartido,
  isLocked: boolean,
  isPending: boolean
): string {
  const base =
    'rounded-lg border px-3 py-2 text-sm font-medium text-left transition-colors disabled:cursor-not-allowed'
  const estaSeleccionado = prediccionActual?.prediccion === value
  const tieneResultado = partido.resultado_final !== null

  if (isLocked || isPending) {
    return `${base} border-gray-200 bg-gray-50 text-gray-400 opacity-60`
  }
  if (estaSeleccionado && tieneResultado) {
    const pts = prediccionActual?.puntos_ganados ?? 0
    return pts > 0
      ? `${base} border-green-500 bg-green-50 text-green-700`
      : `${base} border-red-300 bg-red-50 text-red-600`
  }
  if (estaSeleccionado) {
    return `${base} border-blue-500 bg-blue-50 text-blue-700`
  }
  return `${base} border-gray-300 bg-white text-gray-700 hover:bg-gray-50`
}

// ─── component ─────────────────────────────────────────────────────────────

export default function TarjetaPrediccion({
  partido,
  prediccionActual,
  isLocked,
  onOptimisticUpdate,
  onRevert,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const botones = botonesParaPartido(partido)
  const tieneResultado = partido.resultado_final !== null
  const pts = prediccionActual?.puntos_ganados

  function handleClick(value: ResultadoPartido) {
    if (isLocked || isPending) return
    if (prediccionActual?.prediccion === value) return

    const prev = prediccionActual
    onOptimisticUpdate(partido.id, value)
    setError(null)

    startTransition(async () => {
      const result = await guardarPrediccion(partido.id, value)
      if (!result.ok) {
        onRevert(partido.id, prev)
        setError(result.error ?? 'Error al guardar')
      }
    })
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Cabecera: equipos y marcador */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          {partido.local_codigo && getBanderaUrl(partido.local_codigo) && (
            <img
              src={getBanderaUrl(partido.local_codigo)}
              alt={partido.local_nombre ?? 'Local'}
              className="h-5 w-auto shrink-0 object-contain"
            />
          )}
          <span
            className={`truncate text-sm font-semibold ${
              !partido.local_nombre ? 'italic text-gray-400' : 'text-gray-900'
            }`}
          >
            {partido.local_nombre ?? partido.placeholder_local ?? '—'}
          </span>
        </div>

        <div className="flex flex-shrink-0 flex-col items-center gap-0.5">
          <span
            className={`rounded-lg px-2.5 py-1 text-xs font-bold tabular-nums ${
              tieneResultado
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {tieneResultado
              ? `${partido.goles_local} — ${partido.goles_visitante}`
              : 'vs'}
          </span>
          {pts !== null && pts !== undefined && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                pts > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {pts > 0 ? `+${pts} pts` : '0 pts'}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5">
          <span
            className={`truncate text-right text-sm font-semibold ${
              !partido.visitante_nombre ? 'italic text-gray-400' : 'text-gray-900'
            }`}
          >
            {partido.visitante_nombre ?? partido.placeholder_visitante ?? '—'}
          </span>
          {partido.visitante_codigo && getBanderaUrl(partido.visitante_codigo) && (
            <img
              src={getBanderaUrl(partido.visitante_codigo)}
              alt={partido.visitante_nombre ?? 'Visitante'}
              className="h-5 w-auto shrink-0 object-contain"
            />
          )}
        </div>
      </div>

      {/* Meta: fase, grupo, horario */}
      <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
        <span>
          {partido.grupo ? `${partido.fase} · ${partido.grupo}` : partido.fase}
        </span>
        <span>{formatHora(partido.fecha_hora)}</span>
      </div>

      {/* Botones de predicción */}
      <div
        className={`grid gap-2 ${
          partido.es_eliminatorio ? 'grid-cols-2' : 'grid-cols-3'
        }`}
      >
        {botones.map(({ value, label, flagUrl }) => (
          <button
            key={value}
            onClick={() => handleClick(value)}
            disabled={isLocked || isPending}
            className={clasesBoton(value, prediccionActual, partido, isLocked, isPending)}
          >
            <span className="flex items-center gap-1.5">
              {flagUrl && (
                <img src={flagUrl} alt="" aria-hidden className="h-4 w-auto shrink-0 object-contain" />
              )}
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Error inline */}
      {error && (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-1.5 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
