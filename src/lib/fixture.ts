import type { DetallePartido } from '@/types/fixture'

export const ORDEN_FASES = [
  'Grupos',
  'Ronda de 32',
  'Octavos de final',
  'Cuartos de final',
  'Semifinales',
  'Tercer puesto',
  'Final',
] as const

export type GrupoFase = {
  fase: string
  fechas: {
    fecha: string
    partidos: DetallePartido[]
  }[]
}

export function agruparPartidosPorFaseYFecha(partidos: DetallePartido[]): GrupoFase[] {
  const mapaFases = new Map<string, Map<string, DetallePartido[]>>()

  for (const partido of partidos) {
    const fecha = partido.fecha_hora.slice(0, 10)

    if (!mapaFases.has(partido.fase)) {
      mapaFases.set(partido.fase, new Map())
    }
    const mapaFechas = mapaFases.get(partido.fase)!

    if (!mapaFechas.has(fecha)) {
      mapaFechas.set(fecha, [])
    }
    mapaFechas.get(fecha)!.push(partido)
  }

  return ORDEN_FASES
    .filter((fase) => mapaFases.has(fase))
    .map((fase) => ({
      fase,
      fechas: Array.from(mapaFases.get(fase)!.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([fecha, partidos]) => ({ fecha, partidos })),
    }))
}

export function formatearFecha(fecha: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(fecha + 'T00:00:00Z'))
}
