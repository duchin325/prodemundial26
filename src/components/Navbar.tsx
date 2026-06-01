'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'

type Props = {
  username: string
  isAdmin: boolean
}

type NavLink = { href: string; label: string; admin?: boolean }

const BASE_LINKS: NavLink[] = [
  { href: '/fixture', label: 'Fixture' },
  { href: '/reglamento', label: 'Reglamento' },
  { href: '/predicciones', label: 'Predicciones' },
  { href: '/ranking', label: 'Ranking' },
]

export default function Navbar({ username, isAdmin }: Props) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Cerrar menú mobile cuando cambia la ruta
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const links: NavLink[] = isAdmin
    ? [...BASE_LINKS, { href: '/admin', label: 'Admin', admin: true }]
    : BASE_LINKS

  function isActive(href: string): boolean {
    return pathname.startsWith(href)
  }

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4">
        {/* Barra principal */}
        <div className="flex h-14 items-center justify-between">
          {/* Brand */}
          <Link href="/ranking" className="text-sm font-bold text-gray-900 hover:text-blue-600">
            ⚽ Prode Mundial
          </Link>

          {/* Links desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) =>
              link.admin ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`mx-1 rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-4 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Usuario + logout desktop */}
          <div className="hidden items-center gap-3 md:flex">
            <span className="text-sm text-gray-600">👤 {username}</span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Cerrar sesión
              </button>
            </form>
          </div>

          {/* Botón hamburguesa mobile */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Abrir menú"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Menú mobile desplegable */}
        {menuOpen && (
          <div className="border-t border-gray-100 pb-3 pt-2 md:hidden">
            <div className="flex flex-col gap-0.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    link.admin
                      ? isActive(link.href)
                        ? 'bg-purple-600 text-white'
                        : 'text-purple-700 hover:bg-purple-50'
                      : isActive(link.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  {link.admin && !isActive(link.href) && (
                    <span className="ml-1.5 text-xs opacity-70">(Admin)</span>
                  )}
                </Link>
              ))}
            </div>

            {/* Usuario + logout mobile */}
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 px-3 pt-3">
              <span className="text-sm text-gray-600">👤 {username}</span>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
