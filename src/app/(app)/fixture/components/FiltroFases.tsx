'use client'
import { useSearchParams, useRouter } from 'next/navigation'

const OPCIONES = [
  { label: 'Todos', value: 'todos' },
  { label: 'Grupos', value: 'grupos' },
  { label: 'Eliminatorias', value: 'eliminatorias' },
] as const

export default function FiltroFases() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const faseActual = searchParams.get('fase') ?? 'todos'

  function handleClick(value: string) {
    if (value === 'todos') {
      router.push('/fixture')
    } else {
      router.push(`/fixture?fase=${value}`)
    }
  }

  return (
    <div className="flex gap-2">
      {OPCIONES.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => handleClick(value)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            faseActual === value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
