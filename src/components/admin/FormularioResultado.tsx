'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { DetallePartido } from '@/types/fixture'
import type { ResultadoPartido } from '@/lib/predicciones'
import { cargarResultado } from '@/app/actions/resultados'
import { getBanderaUrl } from '@/lib/utils/banderas'

type Props = { partido: DetallePartido }

type OpcionResultado = { value: ResultadoPartido; label: string; flagUrl?: string }

function opcionesParaPartido(p: DetallePartido): OpcionResultado[] {
  const lLocal = p.local_nombre ?? p.placeholder_local ?? 'Local'
  const lVisitante = p.visitante_nombre ?? p.placeholder_visitante ?? 'Visitante'
  const flagLocal = getBanderaUrl(p.local_codigo) || undefined
  const flagVisitante = getBanderaUrl(p.visitante_codigo) || undefined
  if (!p.es_eliminatorio) {
    return [
      { value: 'Local', label: lLocal, flagUrl: flagLocal },
      { value: 'Empate', label: 'Empate' },
      { value: 'Visitante', label: lVisitante, flagUrl: flagVisitante },
    ]
  }
  return [
    { value: 'Local', label: lLocal, flagUrl: flagLocal },
    { value: 'Visitante', label: lVisitante, flagUrl: flagVisitante },
    { value: 'Penales_L', label: `${lLocal} (pen.)` },
    { value: 'Penales_V', label: `${lVisitante} (pen.)` },
  ]
}

function validarCliente(
  resultado: ResultadoPartido,
  gl: number,
  gv: number,
  esEliminatorio: boolean
): string | null {
  if (resultado === 'Local' && gl <= gv)
    return `'${resultado}' requiere más goles del equipo local`
  if (resultado === 'Visitante' && gv <= gl)
    return `'${resultado}' requiere más goles del equipo visitante`
  if (resultado === 'Empate') {
    if (esEliminatorio) return "'Empate' no es válido en partidos eliminatorios"
    if (gl !== gv) return "'Empate' requiere la misma cantidad de goles"
  }
  if (resultado === 'Penales_L' || resultado === 'Penales_V') {
    if (!esEliminatorio) return "Penales no son válidos en partidos de grupos"
    if (gl !== gv) return "En penales los goles deben ser iguales"
  }
  return null
}

export default function FormularioResultado({ partido }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [resultado, setResultado] = useState<ResultadoPartido>('Local')
  const [golesLocal, setGolesLocal] = useState('0')
  const [golesVisitante, setGolesVisitante] = useState('0')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const opciones = opcionesParaPartido(partido)
  const lLocal = partido.local_nombre ?? partido.placeholder_local ?? '?'
  const lVisitante = partido.visitante_nombre ?? partido.placeholder_visitante ?? '?'

  // Auto-sugerencia al cambiar resultado
  function handleResultadoChange(nuevo: ResultadoPartido) {
    setResultado(nuevo)
    setError(null)
    const gl = parseInt(golesLocal) || 0
    const gv = parseInt(golesVisitante) || 0

    if (nuevo === 'Empate' || nuevo === 'Penales_L' || nuevo === 'Penales_V') {
      const max = Math.max(gl, gv)
      setGolesLocal(String(max))
      setGolesVisitante(String(max))
    } else if (nuevo === 'Local') {
      if (gl <= gv) setGolesLocal(String(gv + 1))
    } else if (nuevo === 'Visitante') {
      if (gv <= gl) setGolesVisitante(String(gl + 1))
    }
  }

  function handleSubmit() {
    const gl = parseInt(golesLocal) || 0
    const gv = parseInt(golesVisitante) || 0
    const clientError = validarCliente(resultado, gl, gv, partido.es_eliminatorio)
    if (clientError) {
      setError(clientError)
      return
    }

    setError(null)
    startTransition(async () => {
      const res = await cargarResultado(partido.id, resultado, gl, gv)
      if (!res.ok) {
        setError(res.error ?? 'Error al guardar')
      } else {
        setSubmitted(true)
      }
    })
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6">
        <p className="font-semibold text-green-800">✓ Resultado cargado correctamente.</p>
        <p className="mt-1 text-sm text-green-700">
          El sistema calculó los puntos automáticamente.
        </p>
        <button
          onClick={() => router.push('/admin')}
          className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Volver al panel
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Encabezado partido */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {partido.local_codigo && getBanderaUrl(partido.local_codigo) && (
            <img
              src={getBanderaUrl(partido.local_codigo)}
              alt={lLocal}
              className="h-8 w-auto object-contain drop-shadow-sm"
            />
          )}
          <span className="text-lg font-bold text-gray-900">{lLocal}</span>
        </div>
        <span className="text-sm font-medium text-gray-400">vs</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">{lVisitante}</span>
          {partido.visitante_codigo && getBanderaUrl(partido.visitante_codigo) && (
            <img
              src={getBanderaUrl(partido.visitante_codigo)}
              alt={lVisitante}
              className="h-8 w-auto object-contain drop-shadow-sm"
            />
          )}
        </div>
      </div>

      {partido.estadio_nombre && (
        <p className="mb-4 text-xs text-gray-500">
          {partido.estadio_nombre} — {[partido.estadio_ciudad, partido.estadio_pais].filter(Boolean).join(', ')}
        </p>
      )}

      <div className="space-y-5">
        {/* Marcador */}
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Goles {lLocal}
            </label>
            <input
              type="number"
              min={0}
              max={20}
              value={golesLocal}
              onChange={(e) => { setGolesLocal(e.target.value); setError(null) }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-xl font-bold tabular-nums outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <span className="mb-2 text-lg font-bold text-gray-400">—</span>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Goles {lVisitante}
            </label>
            <input
              type="number"
              min={0}
              max={20}
              value={golesVisitante}
              onChange={(e) => { setGolesVisitante(e.target.value); setError(null) }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-xl font-bold tabular-nums outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Resultado */}
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-600">Resultado</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {opciones.map(({ value, label, flagUrl }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleResultadoChange(value)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  resultado === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
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
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Guardando...' : 'Cargar resultado'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
