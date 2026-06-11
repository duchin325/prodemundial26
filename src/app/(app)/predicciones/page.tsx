import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { supabase } from '@/lib/supabase/server'
import type { DetallePartido } from '@/types/fixture'
import type { Prediccion } from '@/lib/predicciones'
import ListaPredicciones from './components/ListaPredicciones'

export const dynamic = 'force-dynamic'

export default async function PrediccionesPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [{ data: partidos, error: errorPartidos }, { data: predicciones }] =
    await Promise.all([
      supabase
        .from('detalle_partidos')
        .select('*')
        .order('fecha_hora', { ascending: true }),
      supabase
        .from('predicciones')
        .select('*')
        .eq('user_id', session.id),
    ])

  if (errorPartidos) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-sm text-red-500">Error al cargar los partidos. Intentá de nuevo.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis Predicciones</h1>
        <p className="mt-1 text-sm text-gray-500">
          Hola, {session.username}. Elegí el resultado de cada partido.
        </p>
      </div>

      <ListaPredicciones
        partidos={(partidos ?? []) as DetallePartido[]}
        prediccionesPrevias={(predicciones ?? []) as Prediccion[]}
      />
    </div>
  )
}
