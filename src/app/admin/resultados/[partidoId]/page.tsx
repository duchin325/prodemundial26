import Link from 'next/link'
import { supabase } from '@/lib/supabase/server'
import type { DetallePartido } from '@/types/fixture'
import type { ResultadoPartido } from '@/lib/predicciones'
import FormularioResultado from '@/components/admin/FormularioResultado'

export const dynamic = 'force-dynamic'

export default async function CargarResultadoPage({
  params,
}: {
  params: Promise<{ partidoId: string }>
}) {
  const { partidoId } = await params

  const [{ data: partido }, { data: resultadoExistente }] = await Promise.all([
    supabase
      .from('detalle_partidos')
      .select('*')
      .eq('id', partidoId)
      .single(),
    supabase
      .from('resultados')
      .select('resultado, goles_local, goles_visitante')
      .eq('partido_id', partidoId)
      .maybeSingle(),
  ])

  if (!partido) {
    return (
      <div>
        <p className="text-sm text-red-500">Partido no encontrado.</p>
        <Link href="/admin" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          ← Volver al panel
        </Link>
      </div>
    )
  }

  const p = partido as DetallePartido
  const lLocal = p.local_nombre ?? p.placeholder_local ?? '?'
  const lVisitante = p.visitante_nombre ?? p.placeholder_visitante ?? '?'

  return (
    <div className="max-w-lg">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:text-blue-600"
        >
          ← Panel
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-700">
          Cargar resultado — {p.local_bandera} {lLocal} vs {lVisitante} {p.visitante_bandera}
        </span>
      </div>

      {resultadoExistente ? (
        // Resultado ya cargado — solo lectura
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="font-semibold text-gray-800">Resultado ya cargado</p>
          <div className="mt-3 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
            <span className="font-medium">
              {lLocal} {resultadoExistente.goles_local}–{resultadoExistente.goles_visitante}{' '}
              {lVisitante}
            </span>
            <span className="ml-2 text-gray-500">
              · {resultadoExistente.resultado as ResultadoPartido}
            </span>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Para corregir un resultado ya cargado, modificalo directamente en Supabase.
          </p>
          <Link
            href="/admin"
            className="mt-4 inline-block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            ← Volver al panel
          </Link>
        </div>
      ) : (
        <FormularioResultado partido={p} />
      )}
    </div>
  )
}
