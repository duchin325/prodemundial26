import { getSession } from '@/lib/auth'
import { logout } from '@/app/actions/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50">
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {session.username}
        </h1>
        <p className="mt-2 text-sm text-gray-500">Estás autenticado correctamente.</p>
        <form action={logout} className="mt-6">
          <button
            type="submit"
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  )
}
