import PremioCard from './components/PremioCard'

function SkeletonFila({ ancho }: { ancho: string }) {
  return (
    <tr>
      <td className="px-4 py-3">
        <div className="mx-auto h-8 w-8 animate-pulse rounded-full bg-gray-200" />
      </td>
      <td className="px-4 py-3">
        <div className={`h-4 animate-pulse rounded bg-gray-200 ${ancho}`} />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="ml-auto h-6 w-12 animate-pulse rounded bg-gray-200" />
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <div className="mx-auto h-4 w-16 animate-pulse rounded bg-gray-100" />
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <div className="mx-auto h-4 w-10 animate-pulse rounded bg-gray-100" />
      </td>
    </tr>
  )
}

// Anchos variables para simular nombres reales
const ANCHOS = ['w-24', 'w-32', 'w-20', 'w-28', 'w-36', 'w-22', 'w-30', 'w-26', 'w-40', 'w-28']

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 h-8 w-40 animate-pulse rounded-lg bg-gray-200" />
      <PremioCard />
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
        </div>
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {['w-16', 'flex-1', 'w-20', 'w-20 hidden md:table-cell', 'w-24 hidden md:table-cell'].map(
                (w, i) => (
                  <th key={i} className={`px-4 py-3 ${w}`}>
                    <div className="h-3 animate-pulse rounded bg-gray-200" />
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ANCHOS.map((ancho, i) => (
              <SkeletonFila key={i} ancho={ancho} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
