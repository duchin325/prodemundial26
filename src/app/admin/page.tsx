import Link from 'next/link'
import { supabase } from '@/lib/supabase/server'
import type { DetallePartido } from '@/types/fixture'
import type { ResultadoCargado, PartidoAdmin } from '@/types/admin'
import type { ResultadoPartido } from '@/lib/predicciones'
import ListaPartidosAdmin from '@/components/admin/ListaPartidosAdmin'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [
    { data: partidos, error },
    { data: resultados },
    { data: predicciones },
  ] = await Promise.all([
    supabase
      .from('detalle_partidos')
      .select('*')
      .order('fecha_hora', { ascending: true }),
    supabase
      .from('resultados')
      .select('partido_id, resultado, goles_local, goles_visitante'),
    supabase
      .from('predicciones')
      .select('partido_id'),
  ])

  if (error) {
    return (
      <p className="text-sm text-red-500">Error al cargar los partidos. Intentá de nuevo.</p>
    )
  }

  // Índice de resultados por partido
  const resultadosMap = new Map<string, ResultadoCargado>(
    (resultados ?? []).map((r) => [
      r.partido_id,
      {
        resultado: r.resultado as ResultadoPartido,
        goles_local: r.goles_local,
        goles_visitante: r.goles_visitante,
      },
    ])
  )

  // Conteo de predicciones por partido
  const conteoMap = new Map<string, number>()
  for (const p of predicciones ?? []) {
    conteoMap.set(p.partido_id, (conteoMap.get(p.partido_id) ?? 0) + 1)
  }

  const partidosAdmin: PartidoAdmin[] = (partidos ?? []).map((p) => ({
    ...(p as DetallePartido),
    resultado_cargado: resultadosMap.get(p.id) ?? null,
    total_predicciones: conteoMap.get(p.id) ?? 0,
  }))

  const sinResultado = partidosAdmin.filter((p) => !p.resultado_cargado).length
  const conResultado = partidosAdmin.filter((p) => p.resultado_cargado).length

  const bracketTotal = partidosAdmin.filter((p) => p.es_eliminatorio).length
  const bracketAsignados = partidosAdmin.filter(
    (p) => p.es_eliminatorio && p.local_id && p.visitante_id
  ).length

  return (
    <div>
      {/* Navegación de secciones del panel */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/bracket"
          className="group flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden>🏆</span>
            <span className="font-semibold text-gray-900 group-hover:text-blue-600">
              Gestionar bracket eliminatorio
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {bracketAsignados} / {bracketTotal} partidos asignados
          </p>
        </Link>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Resultados del torneo</h1>
        <div className="flex gap-3 text-sm text-gray-500">
          <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">
            {conResultado} cargados
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600">
            {sinResultado} pendientes
          </span>
        </div>
      </div>
      <ListaPartidosAdmin partidos={partidosAdmin} />
    </div>
  )
}
