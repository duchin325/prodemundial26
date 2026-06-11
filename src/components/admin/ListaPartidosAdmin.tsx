'use client'
import Link from 'next/link'
import type { PartidoAdmin } from '@/types/admin'
import type { ResultadoPartido } from '@/lib/predicciones'
import { getBanderaUrl } from '@/lib/utils/banderas'
import { formatearFechaHora } from '@/lib/utils/fechas'

const LABEL_RESULTADO: Record<ResultadoPartido, string> = {
  Local: 'Local',
  Visitante: 'Visitante',
  Empate: 'Empate',
  Penales_L: 'Local (pen.)',
  Penales_V: 'Visitante (pen.)',
}

function textoResultado(partido: PartidoAdmin): string {
  const r = partido.resultado_cargado!
  const local = partido.local_codigo ?? partido.local_nombre ?? partido.placeholder_local ?? 'Local'
  const visitante =
    partido.visitante_codigo ?? partido.visitante_nombre ?? partido.placeholder_visitante ?? 'Visitante'
  return `${local} ${r.goles_local}–${r.goles_visitante} ${visitante} · ${LABEL_RESULTADO[r.resultado]}`
}

type Props = { partidos: PartidoAdmin[] }

export default function ListaPartidosAdmin({ partidos }: Props) {
  if (partidos.length === 0) {
    return <p className="text-gray-500">No hay partidos cargados en el fixture aún.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['#', 'Partido', 'Fase', 'Fecha y hora', 'Estado', 'Predicciones', 'Acción'].map(
              (col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {partidos.map((partido) => {
            const tienResultado = partido.resultado_cargado !== null
            const local = partido.local_nombre ?? partido.placeholder_local ?? '?'
            const visitante = partido.visitante_nombre ?? partido.placeholder_visitante ?? '?'
            const fecha = formatearFechaHora(partido.fecha_hora)

            return (
              <tr key={partido.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-gray-500">{partido.numero_partido}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 font-medium text-gray-900">
                    {partido.local_codigo && getBanderaUrl(partido.local_codigo) && (
                      <img src={getBanderaUrl(partido.local_codigo)} alt="" aria-hidden className="h-4 w-auto object-contain" />
                    )}
                    {local}
                  </span>
                  <span className="mx-1.5 text-gray-400">vs</span>
                  <span className="inline-flex items-center gap-1 font-medium text-gray-900">
                    {visitante}
                    {partido.visitante_codigo && getBanderaUrl(partido.visitante_codigo) && (
                      <img src={getBanderaUrl(partido.visitante_codigo)} alt="" aria-hidden className="h-4 w-auto object-contain" />
                    )}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                  {partido.grupo ? `${partido.fase} · ${partido.grupo}` : partido.fase}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-500">{fecha} (ARG)</td>
                <td className="px-4 py-3">
                  {tienResultado ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      ✓ Cargado
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                      Sin resultado
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center tabular-nums text-gray-700">
                  {partido.total_predicciones}
                </td>
                <td className="px-4 py-3">
                  {tienResultado ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-gray-600">{textoResultado(partido)}</span>
                      <button disabled className="mt-1 cursor-not-allowed text-xs text-gray-400">
                        Ver
                      </button>
                    </div>
                  ) : (
                    <Link
                      href={`/admin/resultados/${partido.id}`}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Cargar resultado
                    </Link>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
