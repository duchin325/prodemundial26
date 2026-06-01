export default function BannerLocked() {
  return (
    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="font-medium text-amber-800">⏰ Las predicciones están cerradas</p>
      <p className="mt-1 text-sm text-amber-700">
        No es posible modificar predicciones una vez iniciado el torneo.
      </p>
    </div>
  )
}
