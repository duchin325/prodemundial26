export interface DetallePartido {
  id: string
  numero_partido: number
  fase: string
  grupo: string | null
  fecha_hora: string
  es_eliminatorio: boolean
  placeholder_local: string | null
  placeholder_visitante: string | null
  local_id: string | null
  local_nombre: string | null
  local_codigo: string | null
  local_bandera: string | null
  visitante_id: string | null
  visitante_nombre: string | null
  visitante_codigo: string | null
  visitante_bandera: string | null
  estadio_id: string | null
  estadio_nombre: string | null
  estadio_ciudad: string | null
  estadio_pais: string | null
  estadio_timezone: string | null
  resultado_final: string | null
  goles_local: number | null
  goles_visitante: number | null
}
