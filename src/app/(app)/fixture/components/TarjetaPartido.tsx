import type { DetallePartido } from '@/types/fixture'
import { getBanderaUrl } from '@/lib/utils/banderas'
import HorarioLocal from './HorarioLocal'

type Props = {
  partido: DetallePartido
}

type Estado = 'pendiente' | 'en-curso' | 'finalizado'

function getEstado(partido: DetallePartido): Estado {
  if (partido.resultado_final !== null) return 'finalizado'
  const inicio = new Date(partido.fecha_hora).getTime()
  const ahora = Date.now()
  if (inicio <= ahora && ahora <= inicio + 2 * 60 * 60 * 1000) return 'en-curso'
  return 'pendiente'
}

function getResultadoLabel(partido: DetallePartido): string | null {
  if (partido.resultado_final === null) return null
  const gl = partido.goles_local ?? 0
  const gv = partido.goles_visitante ?? 0
  if (partido.es_eliminatorio && gl === gv) return 'Penales'
  if (gl > gv) return 'Local'
  if (gl < gv) return 'Visitante'
  return 'Empate'
}

function labelClases(label: string): string {
  switch (label) {
    case 'Local':    return 'bg-green-100 text-green-700'
    case 'Visitante': return 'bg-amber-100 text-amber-700'
    case 'Empate':   return 'bg-blue-100 text-blue-700'
    case 'Penales':  return 'bg-purple-100 text-purple-700'
    default:         return 'bg-gray-100 text-gray-500'
  }
}

function formatearFechaCorta(fechaHora: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
    .format(new Date(fechaHora))
    .replace(/\./g, '')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function TarjetaPartido({ partido }: Props) {
  const localNombre = partido.local_nombre ?? partido.placeholder_local
  const visitanteNombre = partido.visitante_nombre ?? partido.placeholder_visitante
  const estado = getEstado(partido)
  const tieneResultado = estado === 'finalizado'
  const label = getResultadoLabel(partido)

  const borderClass =
    estado === 'finalizado'
      ? 'border-green-300'
      : estado === 'en-curso'
        ? 'border-blue-400 animate-pulse'
        : 'border-gray-200'

  return (
    <div className={`flex flex-col overflow-hidden rounded-xl border-2 bg-white shadow-sm ${borderClass}`}>

      {/* Encabezado */}
      <div className="flex items-center justify-between gap-2 bg-gray-50 px-4 py-2">
        <p className="truncate text-xs text-gray-500">
          {partido.grupo && (
            <span className="font-semibold text-gray-700">{partido.grupo} · </span>
          )}
          Partido {partido.numero_partido}
          {partido.estadio_nombre && ` · ${partido.estadio_nombre}`}
          {partido.estadio_ciudad && `, ${partido.estadio_ciudad}`}
        </p>
        {label && (
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${labelClases(label)}`}>
            {label}
          </span>
        )}
      </div>

      {/* Cuerpo — equipos */}
      <div className="flex flex-1 items-center px-4 py-6">

        {/* Local */}
        <div className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex h-12 items-center justify-center">
            {partido.local_codigo && getBanderaUrl(partido.local_codigo) && (
              <img
                src={getBanderaUrl(partido.local_codigo)}
                alt={partido.local_nombre ?? 'Local'}
                className="h-10 w-auto object-contain drop-shadow-sm"
              />
            )}
          </div>
          <span
            className={`text-center text-sm font-semibold leading-snug ${
              !partido.local_nombre ? 'italic text-gray-400' : 'text-gray-900'
            }`}
          >
            {localNombre ?? '—'}
          </span>
        </div>

        {/* Marcador / VS */}
        <div className="shrink-0 px-3 text-center">
          {tieneResultado ? (
            <span className="text-2xl font-bold tabular-nums text-gray-900">
              {partido.goles_local} - {partido.goles_visitante}
            </span>
          ) : (
            <span className="text-lg font-medium text-gray-400">vs</span>
          )}
        </div>

        {/* Visitante */}
        <div className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex h-12 items-center justify-center">
            {partido.visitante_codigo && getBanderaUrl(partido.visitante_codigo) && (
              <img
                src={getBanderaUrl(partido.visitante_codigo)}
                alt={partido.visitante_nombre ?? 'Visitante'}
                className="h-10 w-auto object-contain drop-shadow-sm"
              />
            )}
          </div>
          <span
            className={`text-center text-sm font-semibold leading-snug ${
              !partido.visitante_nombre ? 'italic text-gray-400' : 'text-gray-900'
            }`}
          >
            {visitanteNombre ?? '—'}
          </span>
        </div>

      </div>

      {/* Pie — fecha y hora */}
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
        <span>📅 {formatearFechaCorta(partido.fecha_hora)}</span>
        <span>·</span>
        <span>🕔</span>
        <HorarioLocal
          fechaHora={partido.fecha_hora}
          estadioTimezone={partido.estadio_timezone}
        />
      </div>

    </div>
  )
}
