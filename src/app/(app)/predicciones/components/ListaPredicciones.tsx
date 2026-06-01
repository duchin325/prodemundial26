'use client'
import { useState, useCallback } from 'react'
import type { DetallePartido } from '@/types/fixture'
import { type Prediccion, type ResultadoPartido } from '@/lib/predicciones'
import { agruparPartidosPorFaseYFecha, formatearFecha } from '@/lib/fixture'
import TarjetaPrediccion from './TarjetaPrediccion'

type Props = {
  partidos: DetallePartido[]
  prediccionesPrevias: Prediccion[]
  isLocked: boolean
}

export default function ListaPredicciones({ partidos, prediccionesPrevias, isLocked }: Props) {
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

  const grupos = agruparPartidosPorFaseYFecha(partidos)

  if (grupos.length === 0) {
    return (
      <p className="text-gray-500">El fixture aún no está disponible para hacer predicciones.</p>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      {grupos.map((grupo) => (
        <section key={grupo.fase}>
          <h2 className="mb-4 text-xl font-bold text-gray-800">{grupo.fase}</h2>
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
                      isLocked={isLocked}
                      onOptimisticUpdate={onOptimisticUpdate}
                      onRevert={onRevert}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
