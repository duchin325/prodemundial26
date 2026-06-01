export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Título */}
      <div className="mb-6 h-8 w-56 animate-pulse rounded-lg bg-gray-200" />

      {/* Filtros */}
      <div className="mb-8 flex gap-2">
        {[80, 64, 96].map((w, i) => (
          <div
            key={i}
            style={{ width: w }}
            className="h-8 animate-pulse rounded-full bg-gray-200"
          />
        ))}
      </div>

      {/* Grupos de fase */}
      {[1, 2, 3].map((group) => (
        <div key={group} className="mb-10">
          <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mb-3 h-4 w-48 animate-pulse rounded bg-gray-100" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((card) => (
              <div key={card} className="h-24 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
