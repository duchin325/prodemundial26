'use server'
import { getSession } from '@/lib/auth'
import { isLocked, VALID_PREDICCIONES, type ResultadoPartido } from '@/lib/predicciones'
import { supabase } from '@/lib/supabase/server'

export async function guardarPrediccion(
  partidoId: string,
  prediccion: ResultadoPartido
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession()
  if (!session) return { ok: false, error: 'No autenticado' }

  if (isLocked()) return { ok: false, error: 'Las predicciones están cerradas' }

  if (!VALID_PREDICCIONES.includes(prediccion)) {
    return { ok: false, error: 'Predicción inválida' }
  }

  const { data: partido } = await supabase
    .from('detalle_partidos')
    .select('id, es_eliminatorio')
    .eq('id', partidoId)
    .single()

  if (!partido) return { ok: false, error: 'Partido no encontrado' }

  if (!partido.es_eliminatorio && (prediccion === 'Penales_L' || prediccion === 'Penales_V')) {
    return { ok: false, error: 'Predicción de penales no válida para partidos de grupos' }
  }

  const { id: user_id } = session

  const { error } = await supabase
    .from('predicciones')
    .upsert(
      { user_id, partido_id: partidoId, prediccion, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,partido_id' }
    )

  if (error) return { ok: false, error: 'Error al guardar. Intentá de nuevo.' }

  return { ok: true }
}
