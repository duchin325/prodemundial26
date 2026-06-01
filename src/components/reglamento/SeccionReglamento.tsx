type Props = {
  icono: string
  titulo: string
  children: React.ReactNode
}

export default function SeccionReglamento({ icono, titulo, children }: Props) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl leading-none">{icono}</span>
        <h2 className="text-xl font-bold text-gray-900">{titulo}</h2>
      </div>
      <div className="text-gray-700 leading-relaxed space-y-3">{children}</div>
    </section>
  )
}
