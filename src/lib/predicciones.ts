import { HORAS_HABILITACION_PREVIA } from './constants'

export type ResultadoPartido = 'Local' | 'Empate' | 'Visitante' | 'Penales_L' | 'Penales_V'

export const VALID_PREDICCIONES: ResultadoPartido[] = [
  'Local',
  'Empate',
  'Visitante',
  'Penales_L',
  'Penales_V',
]

export interface Prediccion {
  id: string
  user_id: string
  partido_id: string
  prediccion: ResultadoPartido
  puntos_ganados: number | null
  created_at: string
  updated_at: string
}

export function isFaseHabilitada(
  fase: string,
  partidos: { fase: string; fecha_hora: string }[]
): boolean {
  if (fase === 'Grupos') return true

  const partidosDeFase = partidos
    .filter(p => p.fase === fase)
    .sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime())

  if (partidosDeFase.length === 0) return false

  const primerPartido = new Date(partidosDeFase[0].fecha_hora)
  const ahora = new Date()
  return ahora >= new Date(primerPartido.getTime() - HORAS_HABILITACION_PREVIA * 60 * 60 * 1000)
}
