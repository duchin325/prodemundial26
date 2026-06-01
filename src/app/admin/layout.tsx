import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session || !session.is_admin) {
    redirect('/?error=no_autorizado')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar username={session.username} isAdmin={session.is_admin} />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  )
}
