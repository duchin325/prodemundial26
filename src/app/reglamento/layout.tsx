import { getSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'

export default async function ReglamentoLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <>
      {session && <Navbar username={session.username} isAdmin={session.is_admin} />}
      <main className={session ? 'min-h-[calc(100vh-3.5rem)]' : 'min-h-screen'}>
        {children}
      </main>
    </>
  )
}
