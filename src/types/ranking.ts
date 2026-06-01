export type FilaRanking = {
  id: string
  username: string
  puntos: number
  aciertos: number
  predicciones_evaluadas: number
  predicciones_totales: number
  posicion: number
}

export type EstadoConexion =
  | 'SUBSCRIBED'
  | 'CHANNEL_ERROR'
  | 'TIMED_OUT'
  | 'CLOSED'
  | 'connecting'
