import { PREDICCIONES_BLOQUEADAS } from './constants'

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

export function isLocked(): boolean {
  return new Date() >= PREDICCIONES_BLOQUEADAS
}
