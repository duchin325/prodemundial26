import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <>
      <Navbar username={session.username} isAdmin={session.is_admin} />
      <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
    </>
  )
}
