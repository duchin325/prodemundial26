import { cookies } from 'next/headers'

type Session = { id: string; username: string; is_admin: boolean }

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const value = cookieStore.get('session')?.value
  if (!value) return null
  try {
    return JSON.parse(value) as Session
  } catch {
    return null
  }
}
