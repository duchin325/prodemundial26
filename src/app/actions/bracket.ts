'use server'
import { getSession } from '@/lib/auth'
import { supabase } from '@/lib/supabase/server'

export async function asignarEquiposPartido(
  partidoId: string,
  localId: string | null,
  visitanteId: string | null,
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession()
  if (!session || !session.is_admin) {
    return { ok: false, error: 'No autorizado' }
  }

  const { data: partido } = await supabase
    .from('detalle_partidos')
    .select('id, es_eliminatorio')
    .eq('id', partidoId)
    .single()

  if (!partido) {
    return { ok: false, error: 'Partido no encontrado' }
  }
  if (!partido.es_eliminatorio) {
    return { ok: false, error: 'No se pueden reasignar equipos de partidos de grupos' }
  }

  if (localId) {
    const { data: eqLocal } = await supabase
      .from('equipos')
      .select('id')
      .eq('id', localId)
      .single()
    if (!eqLocal) return { ok: false, error: 'Equipo local no encontrado' }
  }

  if (visitanteId) {
    const { data: eqVisitante } = await supabase
      .from('equipos')
      .select('id')
      .eq('id', visitanteId)
      .single()
    if (!eqVisitante) return { ok: false, error: 'Equipo visitante no encontrado' }
  }

  if (localId && visitanteId && localId === visitanteId) {
    return { ok: false, error: 'El equipo local y visitante no pueden ser el mismo' }
  }

  const { data: resultado } = await supabase
    .from('resultados')
    .select('partido_id')
    .eq('partido_id', partidoId)
    .maybeSingle()

  if (resultado) {
    return { ok: false, error: 'No se puede modificar un partido que ya tiene resultado cargado' }
  }

  const { error: updateError } = await supabase
    .from('partidos')
    .update({ local_id: localId, visitante_id: visitanteId })
    .eq('id', partidoId)

  if (updateError) {
    return { ok: false, error: `Error al guardar: ${updateError.message}` }
  }

  return { ok: true }
}
