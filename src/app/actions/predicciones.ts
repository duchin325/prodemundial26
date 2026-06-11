'use server'
import { getSession } from '@/lib/auth'
import { VALID_PREDICCIONES, type ResultadoPartido } from '@/lib/predicciones'
import { HORAS_HABILITACION_PREVIA } from '@/lib/constants'
import { supabase } from '@/lib/supabase/server'

export async function guardarPrediccion(
  partidoId: string,
  prediccion: ResultadoPartido
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession()
  if (!session) return { ok: false, error: 'No autenticado' }

  if (!VALID_PREDICCIONES.includes(prediccion)) {
    return { ok: false, error: 'Predicción inválida' }
  }

  const { data: partido } = await supabase
    .from('detalle_partidos')
    .select('id, fase, es_eliminatorio, fecha_hora')
    .eq('id', partidoId)
    .single()

  if (!partido) return { ok: false, error: 'Partido no encontrado' }

  const ahora = new Date()
  const inicioPartido = new Date(partido.fecha_hora)
  if (!partido.es_eliminatorio && ahora >= inicioPartido) {
    return { ok: false, error: 'Este partido ya comenzó, no podés modificar tu predicción' }
  }

  if (!partido.es_eliminatorio && (prediccion === 'Penales_L' || prediccion === 'Penales_V')) {
    return { ok: false, error: 'Predicción de penales no válida para partidos de grupos' }
  }

  if (partido.es_eliminatorio) {
    const { data: primerPartidoDeFase } = await supabase
      .from('detalle_partidos')
      .select('fecha_hora')
      .eq('fase', partido.fase)
      .order('fecha_hora', { ascending: true })
      .limit(1)
      .single()

    const primerFecha = primerPartidoDeFase?.fecha_hora
    if (!primerFecha) return { ok: false, error: 'Fase no disponible' }

    const inicio = new Date(new Date(primerFecha).getTime() - HORAS_HABILITACION_PREVIA * 60 * 60 * 1000)
    if (ahora < inicio) return { ok: false, error: 'Esta fase eliminatoria aún no está disponible para predecir' }
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
