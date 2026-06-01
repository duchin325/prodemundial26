import type { FilaRanking } from '@/types/ranking'

type Props = {
  fila: FilaRanking
  esUsuarioActual: boolean
  highlight: boolean
}

const MEDALLAS: Record<number, { clase: string; etiqueta: string }> = {
  1: { clase: 'bg-amber-400 text-white', etiqueta: '🥇' },
  2: { clase: 'bg-gray-300 text-gray-800', etiqueta: '🥈' },
  3: { clase: 'bg-amber-600 text-white', etiqueta: '🥉' },
}

export default function FilaRanking({ fila, esUsuarioActual, highlight }: Props) {
  const posicion = Number(fila.posicion)
  const medalla = MEDALLAS[posicion]
  const evaluadas = Number(fila.predicciones_evaluadas)

  let filaClase = 'transition-colors duration-300 '
  if (highlight) {
    filaClase += 'bg-green-50 '
  } else if (esUsuarioActual) {
    filaClase += 'bg-blue-50 '
  } else {
    filaClase += 'bg-white hover:bg-gray-50 '
  }

  return (
    <tr className={filaClase}>
      {/* Posición */}
      <td className="px-4 py-3 text-center">
        {medalla ? (
          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${medalla.clase}`}
          >
            {posicion}
          </span>
        ) : (
          <span className="text-sm text-gray-500">{posicion}</span>
        )}
      </td>

      {/* Usuario */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm ${esUsuarioActual ? 'font-bold text-blue-700' : 'font-medium text-gray-900'}`}
          >
            {fila.username}
          </span>
          {esUsuarioActual && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
              vos
            </span>
          )}
        </div>
      </td>

      {/* Puntos */}
      <td className="px-4 py-3 text-right">
        <span className="text-lg font-bold tabular-nums text-gray-900">
          {Number(fila.puntos)}
        </span>
      </td>

      {/* Aciertos — oculto en mobile */}
      <td className="hidden px-4 py-3 text-center text-sm text-gray-500 md:table-cell">
        {evaluadas > 0 ? (
          <>
            <span className="font-medium text-gray-700">{Number(fila.aciertos)}</span>
            <span className="text-gray-400"> / {evaluadas}</span>
          </>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </td>

      {/* Predicciones totales — oculto en mobile */}
      <td className="hidden px-4 py-3 text-center text-sm text-gray-500 md:table-cell">
        {Number(fila.predicciones_totales)}
      </td>
    </tr>
  )
}
