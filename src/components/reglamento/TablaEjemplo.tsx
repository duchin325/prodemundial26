const FILAS = [
  {
    situacion: 'Acertaste el resultado exacto (cualquier fase, sin penales)',
    puntos: 3,
  },
  {
    situacion:
      'Acertaste el resultado con penales (ej: predijiste "Penales_L" y efectivamente ganó el local en penales)',
    puntos: 4,
  },
  {
    situacion:
      'Predijiste el ganador pero sin contar los penales (ej: predijiste "Local" pero ganó en penales)',
    puntos: 2,
  },
  {
    situacion: 'Predicción incorrecta',
    puntos: 0,
  },
]

export default function TablaEjemplo() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Situación</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700 w-24">Puntos</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {FILAS.map((fila, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-700">{fila.situacion}</td>
              <td className="px-4 py-3 text-center font-bold text-gray-900 tabular-nums">
                {fila.puntos}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
