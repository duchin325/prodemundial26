import Link from 'next/link'
import { supabase } from '@/lib/supabase/server'
import type { DetallePartido } from '@/types/fixture'
import FormularioBracket, { type Equipo } from '@/components/admin/FormularioBracket'

export const dynamic = 'force-dynamic'

export default async function BracketPage() {
  const [{ data: partidos, error }, { data: equipos }] = await Promise.all([
    supabase
      .from('detalle_partidos')
      .select('*')
      .eq('es_eliminatorio', true)
      .order('numero_partido', { ascending: true }),
    supabase
      .from('equipos')
      .select('id, nombre, codigo, bandera_emoji')
      .order('nombre', { ascending: true }),
  ])

  if (error) {
    return (
      <p className="text-sm text-red-500">Error al cargar los partidos. Intentá de nuevo.</p>
    )
  }

  const totalPartidos = partidos?.length ?? 0
  const asignados = (partidos ?? []).filter(
    (p) => p.local_id && p.visitante_id
  ).length

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-blue-600">
            ← Panel
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-2xl font-bold text-gray-900">Bracket eliminatorio</h1>
        </div>
        <div className="flex gap-3 text-sm text-gray-500">
          <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">
            {asignados} asignados
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600">
            {totalPartidos - asignados} pendientes
          </span>
        </div>
      </div>

      <FormularioBracket
        partidos={(partidos ?? []) as DetallePartido[]}
        equipos={(equipos ?? []) as Equipo[]}
      />
    </div>
  )
}
