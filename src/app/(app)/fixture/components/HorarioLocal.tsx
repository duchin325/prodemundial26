'use client'
import { useState, useEffect } from 'react'

type Props = {
  fechaHora: string
  estadioTimezone: string | null
}

export default function HorarioLocal({ fechaHora, estadioTimezone }: Props) {
  const [horaEstadio, setHoraEstadio] = useState('')
  const [horaUsuario, setHoraUsuario] = useState('')
  const [mismaTz, setMismaTz] = useState(true)

  useEffect(() => {
    const date = new Date(fechaHora)
    const tzUsuario = Intl.DateTimeFormat().resolvedOptions().timeZone

    const fmt = (tz: string) =>
      new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: tz,
        hour12: false,
      }).format(date)

    setHoraUsuario(fmt(tzUsuario))

    if (estadioTimezone) {
      setHoraEstadio(fmt(estadioTimezone))
      setMismaTz(estadioTimezone === tzUsuario)
    } else {
      setMismaTz(true)
    }
  }, [fechaHora, estadioTimezone])

  if (!horaUsuario) return null

  if (!estadioTimezone || mismaTz) {
    return <span className="text-sm font-medium text-gray-700">{horaUsuario}</span>
  }

  return (
    <div className="flex flex-col items-end gap-0.5 text-xs">
      <span className="text-gray-700 font-medium">
        {horaEstadio}{' '}
        <span className="text-gray-400 font-normal">(estadio)</span>
      </span>
      <span className="text-gray-500">
        {horaUsuario}{' '}
        <span className="text-gray-400">(tu hora)</span>
      </span>
    </div>
  )
}
