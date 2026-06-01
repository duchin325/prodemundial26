import { Suspense } from 'react'
import { supabase } from '@/lib/supabase/server'
import { agruparPartidosPorFaseYFecha, formatearFecha } from '@/lib/fixture'
import type { DetallePartido } from '@/types/fixture'
import FiltroFases from './components/FiltroFases'
import TarjetaPartido from './components/TarjetaPartido'

export const revalidate = 60

const FASES_ELIMINATORIAS = [
  'Ronda de 32',
  'Octavos de final',
  'Cuartos de final',
  'Semifinales',
  'Tercer puesto',
  'Final',
]

export default async function FixturePage({
  searchParams,
}: {
  searchParams: Promise<{ fase?: string }>
}) {
  const { fase } = await searchParams

  const { data, error } = await supabase
    .from('detalle_partidos')
    .select('*')
    .order('fecha_hora', { ascending: true })

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-sm text-red-500">Error al cargar el fixture. Intentá de nuevo.</p>
      </div>
    )
  }

  const partidos = (data ?? []) as DetallePartido[]

  if (partidos.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Fixture</h1>
        <p className="text-gray-500">El fixture aún no está disponible.</p>
      </div>
    )
  }

  // Filtrar por fase según el query param
  let partidosFiltrados = partidos
  if (fase === 'grupos') {
    partidosFiltrados = partidos.filter((p) => p.fase === 'Grupos')
  } else if (fase === 'eliminatorias') {
    partidosFiltrados = partidos.filter((p) => FASES_ELIMINATORIAS.includes(p.fase))
  }

  const grupos = agruparPartidosPorFaseYFecha(partidosFiltrados)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Fixture</h1>
        {/* FiltroFases usa useSearchParams → requiere Suspense */}
        <Suspense
          fallback={
            <div className="flex gap-2">
              {[80, 64, 96].map((w, i) => (
                <div key={i} style={{ width: w }} className="h-8 animate-pulse rounded-full bg-gray-200" />
              ))}
            </div>
          }
        >
          <FiltroFases />
        </Suspense>
      </div>

      {grupos.length === 0 ? (
        <p className="text-gray-500">No hay partidos para la fase seleccionada.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {grupos.map((grupo) => (
            <section key={grupo.fase}>
              <h2 className="mb-4 text-xl font-bold text-gray-800">{grupo.fase}</h2>
              <div className="flex flex-col gap-6">
                {grupo.fechas.map(({ fecha, partidos: ps }) => (
                  <div key={fecha}>
                    <h3 className="mb-3 text-sm font-medium capitalize text-gray-500">
                      {formatearFecha(fecha)}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {ps.map((partido) => (
                        <TarjetaPartido key={partido.id} partido={partido} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
