'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase as supabaseBrowser } from '@/lib/supabase/client'
import type { FilaRanking, EstadoConexion } from '@/types/ranking'
import FilaRankingRow from './FilaRanking'

// SETUP REQUERIDO EN SUPABASE:
// 1. Ir a Database → Replication en el dashboard de Supabase
// 2. Habilitar replication para la tabla 'users'
// 3. Sin este paso, los eventos de Realtime no llegarán

type Props = {
  rankingInicial: FilaRanking[]
  userIdActual: string | null
}

const BADGE: Record<EstadoConexion, { emoji: string; label: string; clase: string }> = {
  SUBSCRIBED: { emoji: '🟢', label: 'En vivo', clase: 'bg-green-100 text-green-700' },
  CHANNEL_ERROR: { emoji: '🔴', label: 'Sin conexión', clase: 'bg-red-100 text-red-700' },
  TIMED_OUT: { emoji: '🔴', label: 'Sin conexión', clase: 'bg-red-100 text-red-700' },
  CLOSED: { emoji: '🔴', label: 'Sin conexión', clase: 'bg-red-100 text-red-700' },
  connecting: { emoji: '🟡', label: 'Conectando...', clase: 'bg-yellow-100 text-yellow-700' },
}

export default function TablaRanking({ rankingInicial, userIdActual }: Props) {
  const [ranking, setRanking] = useState<FilaRanking[]>(rankingInicial)
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set())
  const [connectionStatus, setConnectionStatus] = useState<EstadoConexion>('connecting')

  // Ref para comparar posiciones sin stale closure en el callback de Realtime
  const rankingRef = useRef<FilaRanking[]>(rankingInicial)

  useEffect(() => {
    const channel = supabaseBrowser
      .channel('ranking-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: 'is_admin=eq.false',
        },
        async (_payload) => {
          // Re-fetch completo — la vista recalcula RANK() de todos los usuarios
          const { data } = await supabaseBrowser
            .from('tabla_posiciones')
            .select('*')

          if (!data) return

          const newRanking = data as FilaRanking[]

          // Detectar usuarios que mejoraron de posición
          const prevMap = new Map(
            rankingRef.current.map((f) => [f.id, Number(f.posicion)])
          )
          const improved = new Set<string>()
          for (const fila of newRanking) {
            const prev = prevMap.get(fila.id)
            if (prev !== undefined && Number(fila.posicion) < prev) {
              improved.add(fila.id)
            }
          }

          // Actualizar ref y estado
          rankingRef.current = newRanking
          setRanking(newRanking)

          if (improved.size > 0) {
            setHighlightedIds(improved)
            setTimeout(() => setHighlightedIds(new Set()), 2000)
          }
        }
      )
      .subscribe((status) => {
        setConnectionStatus(status as EstadoConexion)
      })

    return () => {
      supabaseBrowser.removeChannel(channel)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const badge = BADGE[connectionStatus]

  if (ranking.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">
          El torneo aún no comenzó. ¡Hacé tus predicciones y esperá el inicio!
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header con badge de conexión */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-700">Tabla de posiciones</h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${badge.clase}`}
        >
          {badge.emoji} {badge.label}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 w-16">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Usuario
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Puntos
              </th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 md:table-cell">
                Aciertos
              </th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 md:table-cell">
                Predicciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ranking.map((fila) => (
              <FilaRankingRow
                key={fila.id}
                fila={fila}
                esUsuarioActual={fila.id === userIdActual}
                highlight={highlightedIds.has(fila.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
