import SeccionReglamento from '@/components/reglamento/SeccionReglamento'
import TablaEjemplo from '@/components/reglamento/TablaEjemplo'

export const revalidate = false

// ─── helpers de UI ─────────────────────────────────────────────────────────

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
      {children}
    </span>
  )
}

function Divider() {
  return <hr className="border-gray-100" />
}

// ─── página ────────────────────────────────────────────────────────────────

export default function ReglamentoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">

      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">📋 Reglamento</h1>
        <p className="mt-3 text-lg text-gray-500">
          Todo lo que necesitás saber para jugar el Prode del Mundial FIFA 2026
        </p>
      </div>

      <div className="space-y-8">

        {/* Sección 1 */}
        <SeccionReglamento icono="🌎" titulo="¿De qué se trata?">
          <p>
            El Prode del Mundial 2026 es una competencia entre amigos donde cada participante
            predice los resultados de los partidos del Mundial FIFA 2026, que se jugará en
            Estados Unidos, Canadá y México.
          </p>
          <p>
            A medida que los partidos se juegan y los resultados se cargan, el sistema
            asigna puntos automáticamente según qué tan bien predijiste cada partido.
            Al final del torneo, el jugador con más puntos se lleva el premio.
          </p>
        </SeccionReglamento>

        <Divider />

        {/* Sección 2 */}
        <SeccionReglamento icono="🎮" titulo="¿Cómo se juega?">
          <ol className="space-y-3 list-none">
            {[
              'Registrate con un nombre de usuario y contraseña.',
              'Ingresá a "Predicciones" y hacé tu predicción para cada partido del torneo. Podés predecir todos los partidos de una vez o ir haciéndolo de a poco.',
              'Las predicciones cierran 12 horas antes del inicio del torneo (11 de junio de 2026 a las 08:00 hs, hora Argentina). Pasado ese momento no se pueden modificar ni agregar predicciones.',
              'A medida que los partidos se juegan, el administrador carga los resultados y el sistema te asigna los puntos automáticamente.',
              'Seguí tu posición en tiempo real desde la página de Ranking.',
              'Al finalizar el torneo, el jugador con más puntos gana el premio. 🏆',
            ].map((paso, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  {i + 1}
                </span>
                <span>{paso}</span>
              </li>
            ))}
          </ol>
        </SeccionReglamento>

        <Divider />

        {/* Sección 3 */}
        <SeccionReglamento icono="🎯" titulo="¿Qué podés predecir?">
          <div className="space-y-5">
            <div>
              <p className="mb-3 font-semibold text-gray-800">Fase de grupos (48 partidos)</p>
              <p className="mb-3 text-sm">
                En cada partido de la fase de grupos podés elegir una de estas tres opciones:
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge>🏠 Gana el local</Badge>
                <Badge>= Empate</Badge>
                <Badge>✈️ Gana el visitante</Badge>
              </div>
            </div>

            <div>
              <p className="mb-3 font-semibold text-gray-800">
                Fase eliminatoria (desde los deciseisavos de final en adelante)
              </p>
              <p className="mb-3 text-sm">
                En los partidos eliminatorios no hay empate posible. Las opciones son:
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge>🏠 Gana el local</Badge>
                <Badge>✈️ Gana el visitante</Badge>
                <Badge>🥅 Local por penales</Badge>
                <Badge>🥅 Visitante por penales</Badge>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <strong>Nota:</strong> &ldquo;Gana el local&rdquo; y &ldquo;Gana el local por
              penales&rdquo; son opciones distintas. Si predecís que gana el local pero el
              partido termina en penales a favor del local, obtenés puntos parciales (ver sistema
              de puntos abajo).
            </div>
          </div>
        </SeccionReglamento>

        <Divider />

        {/* Sección 4 */}
        <SeccionReglamento icono="⭐" titulo="Sistema de puntos">
          <p>
            Los puntos se asignan automáticamente al cargar cada resultado.
            Cuanto más precisa sea tu predicción, más puntos ganás.
          </p>

          <TablaEjemplo />

          {/* Ejemplo práctico */}
          <div className="rounded-xl border-l-4 border-blue-500 bg-gray-50 p-5">
            <p className="font-semibold text-gray-800">
              Ejemplo práctico — Argentina vs Francia (Final, eliminatorio)
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Resultado real: Argentina ganó por penales (empate 3–3 en tiempo regular)
            </p>

            <div className="mt-4 space-y-2">
              {[
                {
                  prediccion: 'Local por penales',
                  estrellas: '⭐⭐⭐⭐',
                  puntos: 4,
                  estado: '✅ Acierto exacto',
                  color: 'text-green-700',
                },
                {
                  prediccion: 'Local',
                  estrellas: '⭐⭐',
                  puntos: 2,
                  estado: '🟡 Acertaste el ganador',
                  color: 'text-amber-700',
                },
                {
                  prediccion: 'Visitante',
                  estrellas: '',
                  puntos: 0,
                  estado: '❌ Incorrecto',
                  color: 'text-red-600',
                },
                {
                  prediccion: 'Visitante por penales',
                  estrellas: '',
                  puntos: 0,
                  estado: '❌ Incorrecto',
                  color: 'text-red-600',
                },
              ].map(({ prediccion, estrellas, puntos, estado, color }) => (
                <div key={prediccion} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="text-gray-400">→</span>
                  <span className="text-gray-700">
                    Predijiste <strong>&ldquo;{prediccion}&rdquo;</strong>
                  </span>
                  <span className="ml-auto flex items-center gap-2">
                    {estrellas && (
                      <span className="text-yellow-400 tracking-tight">{estrellas}</span>
                    )}
                    <span className="w-14 text-right font-bold tabular-nums text-gray-800">
                      {puntos} pts
                    </span>
                    <span className={`w-44 text-right text-xs font-medium ${color}`}>
                      {estado}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SeccionReglamento>

        <Divider />

        {/* Sección 5 */}
        <SeccionReglamento icono="🔒" titulo="Cierre de predicciones">
          <p>Las predicciones cierran automáticamente el:</p>

          {/* Fecha destacada */}
          <div className="rounded-xl bg-blue-900 py-7 text-center text-white">
            <p className="text-3xl font-extrabold tracking-tight">
              Miércoles 11 de junio de 2026
            </p>
            <p className="mt-2 text-xl font-semibold text-blue-100">
              08:00 hs · hora Argentina
            </p>
            <p className="mt-2 text-sm text-blue-300">
              12 horas antes del primer partido del torneo
            </p>
          </div>

          <p className="font-medium text-gray-800">Pasado ese momento:</p>
          <ul className="space-y-1">
            <li className="flex gap-2">
              <span>•</span>
              <span>No podés hacer nuevas predicciones.</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>No podés modificar predicciones existentes.</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                Los partidos que no hayas predicho quedan sin predicción — no se asignan puntos.
              </span>
            </li>
          </ul>

          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <strong>Consejo:</strong> hacé todas tus predicciones antes de que cierren. Podés
            cambiarlas todas las veces que quieras hasta el momento del cierre.
          </div>
        </SeccionReglamento>

        <Divider />

        {/* Sección 6 */}
        <SeccionReglamento icono="🏆" titulo="El premio">
          <p>El jugador con más puntos al finalizar el torneo ganará:</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-3">
              <span className="text-xl">🎁</span>
              <span className="font-medium">Un álbum de figuritas del Mundial FIFA 2026</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">🎁</span>
              <span className="font-medium">50 paquetes de figuritas</span>
            </li>
          </ul>
          <p className="text-sm text-gray-500">
            En caso de empate en puntos, se desempatará por mayor cantidad de aciertos exactos
            (predicciones que sumaron 3 o 4 puntos). Si persiste el empate, los jugadores
            comparten el primer puesto y el premio se decide entre ellos.
          </p>
        </SeccionReglamento>

        <Divider />

        {/* Sección 7 */}
        <SeccionReglamento icono="❓" titulo="Preguntas frecuentes">
          <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden">
            {[
              {
                pregunta: '¿Puedo cambiar mis predicciones?',
                respuesta:
                  'Sí, podés modificar cualquier predicción todas las veces que quieras hasta el cierre (11 de junio a las 08:00 hs Argentina). Cada vez que clickeás una opción distinta, tu predicción se actualiza automáticamente.',
              },
              {
                pregunta: '¿Qué pasa si no predigo un partido?',
                respuesta:
                  'Los partidos sin predicción no suman puntos, incluso si hubieras acertado. Te recomendamos completar todas las predicciones antes del cierre.',
              },
              {
                pregunta: '¿Cuándo se actualizan los puntos?',
                respuesta:
                  'Los puntos se actualizan automáticamente en cuanto el administrador carga el resultado de cada partido. El ranking en tiempo real refleja los cambios en segundos.',
              },
              {
                pregunta: '¿Los partidos eliminatorios ya están cargados?',
                respuesta:
                  'Los partidos eliminatorios (Ronda de 32, Octavos, Cuartos, etc.) aparecen en el fixture pero los equipos se van completando a medida que avanzan en el torneo. Podés predecirlos una vez que se conozcan los equipos participantes, siempre dentro del período de predicciones abierto.',
              },
              {
                pregunta: '¿Quién carga los resultados?',
                respuesta:
                  'El administrador de la app carga manualmente el resultado de cada partido después de que termina. Si notás que falta un resultado, avisale al admin.',
              },
            ].map(({ pregunta, respuesta }) => (
              <details key={pregunta} className="group bg-white">
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-4 font-medium text-gray-900 hover:bg-gray-50 list-none">
                  {pregunta}
                  <span className="flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200">
                    ▾
                  </span>
                </summary>
                <p className="border-t border-gray-100 px-4 pb-4 pt-3 text-sm text-gray-600">
                  {respuesta}
                </p>
              </details>
            ))}
          </div>
        </SeccionReglamento>

      </div>

      {/* Footer */}
      <div className="mt-12 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
        Prode Mundial 2026 · El Templo
      </div>
    </div>
  )
}
