'use server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

export type AuthState = { error?: string } | undefined

const SESSION_COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7, // 7 días
  sameSite: 'lax' as const,
  path: '/',
}

export async function login(state: AuthState, formData: FormData): Promise<AuthState> {
  const username = (formData.get('username') as string)?.trim()
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Completá todos los campos.' }
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, username, is_admin')
    .eq('username', username)
    .eq('password', password)
    .single()

  if (!user) {
    return { error: 'Usuario o contraseña incorrectos.' }
  }

  const cookieStore = await cookies()
  cookieStore.set(
    'session',
    JSON.stringify({ id: user.id, username: user.username, is_admin: user.is_admin ?? false }),
    SESSION_COOKIE
  )

  redirect('/predicciones')
}

export async function register(state: AuthState, formData: FormData): Promise<AuthState> {
  const username = (formData.get('username') as string)?.trim()
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Completá todos los campos.' }
  }
  if (username.length < 3) {
    return { error: 'El usuario debe tener al menos 3 caracteres.' }
  }
  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.' }
  }

  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle()

  if (existing) {
    return { error: 'Ese nombre de usuario ya está en uso.' }
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .insert({ username, password })
    .select('id, username, is_admin')
    .single()

  if (error || !user) {
    return { error: 'Error al crear la cuenta. Intentá de nuevo.' }
  }

  const cookieStore = await cookies()
  cookieStore.set(
    'session',
    JSON.stringify({ id: user.id, username: user.username, is_admin: user.is_admin ?? false }),
    SESSION_COOKIE
  )

  redirect('/predicciones')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  redirect('/login')
}
