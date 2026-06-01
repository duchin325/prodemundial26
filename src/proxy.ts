import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard']
const authRoutes = ['/login', '/register']
const adminRoutes = ['/admin']

export default function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const sessionRaw = req.cookies.get('session')?.value

  // Admin routes: require session + is_admin
  if (adminRoutes.some((r) => path.startsWith(r))) {
    if (!sessionRaw) {
      return NextResponse.redirect(new URL('/?error=no_autorizado', req.nextUrl))
    }
    try {
      const session = JSON.parse(sessionRaw)
      if (!session.is_admin) {
        return NextResponse.redirect(new URL('/?error=no_autorizado', req.nextUrl))
      }
    } catch {
      return NextResponse.redirect(new URL('/?error=no_autorizado', req.nextUrl))
    }
  }

  // Regular protected routes: require session
  if (protectedRoutes.some((r) => path.startsWith(r)) && !sessionRaw) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Auth routes: redirect authenticated users away
  if (authRoutes.includes(path) && sessionRaw) {
    return NextResponse.redirect(new URL('/ranking', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
