export default function PremioCard() {
  return (
    <div className="mb-6 rounded-xl border-2 border-amber-300 bg-amber-50 p-5">
      <div className="flex items-start gap-4">
        <span className="text-4xl">🏆</span>
        <div>
          <h2 className="text-lg font-bold text-amber-900">Premio al ganador</h2>
          <p className="mt-1 text-sm text-amber-800">
            El usuario con más puntos al finalizar el torneo ganará:
          </p>
          <ul className="mt-2 space-y-0.5 text-sm text-amber-800">
            <li>• Un álbum de figuritas del Mundial 2026</li>
            <li>• 50 paquetes de figuritas</li>
          </ul>
          <p className="mt-3 text-xs text-amber-700">
            Las predicciones cierran el{' '}
            <span className="font-semibold">11 de junio de 2026 a las 08:00 hs (hora Argentina)</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
