const TIMEZONE_APP = 'America/Argentina/Buenos_Aires'

export function formatearFecha(fechaUtc: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: TIMEZONE_APP,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(fechaUtc))
}

export function formatearHora(fechaUtc: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: TIMEZONE_APP,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(fechaUtc))
}

export function formatearFechaHora(fechaUtc: string): string {
  const fecha = formatearFecha(fechaUtc)
  const hora = formatearHora(fechaUtc)
  return `${fecha} · ${hora} hs`
}

// Clave YYYY-MM-DD en zona Argentina — apta para orden lexicográfico
export function fechaClave(fechaUtc: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE_APP,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(fechaUtc))
}
