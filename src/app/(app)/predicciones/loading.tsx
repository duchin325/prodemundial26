function SkeletonTarjeta() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Teams row */}
      <div className="mb-3 flex items-center gap-3">
        <div className="h-5 flex-1 animate-pulse rounded bg-gray-200" />
        <div className="h-7 w-12 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-5 flex-1 animate-pulse rounded bg-gray-200" />
      </div>
      {/* Meta */}
      <div className="mb-3 flex justify-between">
        <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
      </div>
      {/* Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 h-8 w-56 animate-pulse rounded-lg bg-gray-200" />
      <div className="mb-8 h-4 w-48 animate-pulse rounded bg-gray-100" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonTarjeta key={i} />
        ))}
      </div>
    </div>
  )
}
