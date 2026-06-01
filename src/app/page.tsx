import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function HomePage() {
  const session = await getSession()
  if (session) redirect('/ranking')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* Navbar público */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="text-sm font-bold text-gray-900">⚽ Prode FIFA 2026</span>
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Iniciar sesión
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center px-4 py-28 text-center">
        <div className="max-w-2xl">
          <div className="mb-6 text-7xl">⚽</div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Bienvenido al<br />
            <span className="text-blue-600">Prode FIFA 2026</span>
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-gray-500">
            Predecí los partidos del Mundial, competí con tus amigos<br className="hidden sm:block" />
            y seguí el ranking en tiempo real.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-colors hover:bg-blue-700"
          >
            Comenzar →
          </Link>
        </div>

        {/* Cards de features */}
        <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {[
            { icon: '📋', title: 'Fixture completo', desc: 'Seguí todos los partidos del torneo con horarios y resultados.' },
            { icon: '🎯', title: 'Hacé tus predicciones', desc: 'Elegí el ganador de cada partido antes de que empiece.' },
            { icon: '🏆', title: 'Ranking en vivo', desc: 'Mirá cómo quedás contra los demás jugadores del prode.' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-200 bg-white/70 px-6 py-5 text-left shadow-sm backdrop-blur-sm">
              <div className="mb-2 text-2xl">{f.icon}</div>
              <h3 className="mb-1 text-sm font-semibold text-gray-900">{f.title}</h3>
              <p className="text-xs leading-relaxed text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
