'use server'
import { getSession } from '@/lib/auth'
import { supabase } from '@/lib/supabase/server'
import type { ResultadoPartido } from '@/lib/predicciones'
import { VALID_PREDICCIONES } from '@/lib/predicciones'

export async function cargarResultado(
  partidoId: string,
  resultado: ResultadoPartido,
  golesLocal: number,
  golesVisitante: number
): Promise<{ ok: boolean; error?: string }> {
  // 1. Autenticación y autorización
  const session = await getSession()
  if (!session || !session.is_admin) {
    return { ok: false, error: 'No autorizado' }
  }

  // 2. Validar enum
  if (!VALID_PREDICCIONES.includes(resultado)) {
    return { ok: false, error: 'Resultado inválido' }
  }

  // 3. Verificar que el partido existe y obtener es_eliminatorio
  const { data: partido } = await supabase
    .from('detalle_partidos')
    .select('id, es_eliminatorio')
    .eq('id', partidoId)
    .single()

  if (!partido) {
    return { ok: false, error: 'Partido no encontrado' }
  }

  // 4. Verificar que no existe resultado previo
  const { data: resultadoExistente } = await supabase
    .from('resultados')
    .select('partido_id')
    .eq('partido_id', partidoId)
    .maybeSingle()

  if (resultadoExistente) {
    return { ok: false, error: 'Este partido ya tiene resultado cargado' }
  }

  // 5. Validar consistencia resultado/marcador
  if (resultado === 'Local' && golesLocal <= golesVisitante) {
    return { ok: false, error: "'Local' requiere más goles del equipo local" }
  }
  if (resultado === 'Visitante' && golesVisitante <= golesLocal) {
    return { ok: false, error: "'Visitante' requiere más goles del equipo visitante" }
  }
  if (resultado === 'Empate') {
    if (partido.es_eliminatorio) {
      return { ok: false, error: "'Empate' no es válido en partidos eliminatorios" }
    }
    if (golesLocal !== golesVisitante) {
      return { ok: false, error: "'Empate' requiere la misma cantidad de goles" }
    }
  }
  if (resultado === 'Penales_L' || resultado === 'Penales_V') {
    if (!partido.es_eliminatorio) {
      return { ok: false, error: "Penales no son válidos en partidos de grupos" }
    }
    if (golesLocal !== golesVisitante) {
      return { ok: false, error: "En definición por penales los goles deben ser iguales" }
    }
  }

  // 6. INSERT — el trigger trg_calcular_puntos se ejecuta automáticamente
  const { error: insertError } = await supabase.from('resultados').insert({
    partido_id: partidoId,
    resultado,
    goles_local: golesLocal,
    goles_visitante: golesVisitante,
    cargado_por: session.id,
  })

  if (insertError) {
    return { ok: false, error: `Error al guardar: ${insertError.message}` }
  }

  return { ok: true }
}
