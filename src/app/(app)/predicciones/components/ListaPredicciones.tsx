'use client'
import { useState, useCallback, useMemo } from 'react'
import type { DetallePartido } from '@/types/fixture'
import { type Prediccion, type ResultadoPartido, isFaseHabilitada } from '@/lib/predicciones'
import { HORAS_HABILITACION_PREVIA } from '@/lib/constants'
import { agruparPartidosPorFaseYFecha, formatearFecha } from '@/lib/fixture'
import TarjetaPrediccion from './TarjetaPrediccion'

type Props = {
  partidos: DetallePartido[]
  prediccionesPrevias: Prediccion[]
}

export default function ListaPredicciones({ partidos, prediccionesPrevias }: Props) {
  const [prediccionesMap, setPrediccionesMap] = useState<Record<string, Prediccion>>(
    () => Object.fromEntries(prediccionesPrevias.map((p) => [p.partido_id, p]))
  )

  const onOptimisticUpdate = useCallback((partidoId: string, nueva: ResultadoPartido) => {
    setPrediccionesMap((prev) => ({
      ...prev,
      [partidoId]: {
        ...(prev[partidoId] ?? {
          id: 'optimistic',
          user_id: '',
          created_at: '',
          puntos_ganados: null,
        }),
        partido_id: partidoId,
        prediccion: nueva,
        updated_at: new Date().toISOString(),
      } as Prediccion,
    }))
  }, [])

  const onRevert = useCallback((partidoId: string, prev: Prediccion | null) => {
    setPrediccionesMap((cur) => {
      const next = { ...cur }
      if (prev === null) {
        delete next[partidoId]
      } else {
        next[partidoId] = prev
      }
      return next
    })
  }, [])

  const fasesHabilitadas = useMemo(() => {
    const fases = [...new Set(partidos.map(p => p.fase))]
    return Object.fromEntries(
      fases.map(fase => [fase, isFaseHabilitada(fase, partidos)])
    )
  }, [partidos])

  const fasesHabilitadoEn = useMemo(() => {
    const result: Record<string, Date | null> = {}
    const fases = [...new Set(partidos.map(p => p.fase))]
    for (const fase of fases) {
      if (fase === 'Grupos') { result[fase] = null; continue }
      const sorted = partidos
        .filter(p => p.fase === fase)
        .sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime())
      if (sorted.length === 0) { result[fase] = null; continue }
      result[fase] = new Date(new Date(sorted[0].fecha_hora).getTime() - HORAS_HABILITACION_PREVIA * 60 * 60 * 1000)
    }
    return result
  }, [partidos])

  const grupos = agruparPartidosPorFaseYFecha(partidos)

  if (grupos.length === 0) {
    return (
      <p className="text-gray-500">El fixture aún no está disponible para hacer predicciones.</p>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      {grupos.map((grupo) => {
        const faseHabilitada = fasesHabilitadas[grupo.fase] ?? true
        const esEliminatoria = grupo.fase !== 'Grupos'
        return (
          <section key={grupo.fase}>
            <h2 className="mb-4 flex flex-wrap items-center gap-2 text-xl font-bold text-gray-800">
              {grupo.fase}
              {esEliminatoria && (
                <span
                  className={`text-sm font-normal ${
                    faseHabilitada ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {faseHabilitada ? '✅ Abierta para predicciones' : '🔒 No disponible aún'}
                </span>
              )}
            </h2>
            <div className="flex flex-col gap-6">
              {grupo.fechas.map(({ fecha, partidos: ps }) => (
                <div key={fecha}>
                  <h3 className="mb-3 text-sm font-medium capitalize text-gray-500">
                    {formatearFecha(fecha)}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {ps.map((partido) => (
                      <TarjetaPrediccion
                        key={partido.id}
                        partido={partido}
                        prediccionActual={prediccionesMap[partido.id] ?? null}
                        faseHabilitada={fasesHabilitadas[partido.fase] ?? true}
                        habilitadoEn={fasesHabilitadoEn[partido.fase] ?? null}
                        onOptimisticUpdate={onOptimisticUpdate}
                        onRevert={onRevert}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
