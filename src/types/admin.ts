import type { DetallePartido } from './fixture'
import type { ResultadoPartido } from '@/lib/predicciones'

export type ResultadoCargado = {
  resultado: ResultadoPartido
  goles_local: number
  goles_visitante: number
}

export type PartidoAdmin = DetallePartido & {
  resultado_cargado: ResultadoCargado | null
  total_predicciones: number
}
