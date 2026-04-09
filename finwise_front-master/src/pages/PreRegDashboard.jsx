import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinWise } from '../context/FinWiseContext'
import FinWiseScoreDisplay from '../components/dashboard/FinWiseScoreDisplay'
import FinWiseButton       from '../components/ui/FinWiseButton'
import FinWiseCard         from '../components/ui/FinWiseCard'
import PriorityItem        from '../components/diagnosis/PriorityItem'
import { getScoreDescription } from '../utils/scoreEngine'
import { formatMXN } from '../utils/formatters'

export default function PreRegDashboard() {
  const navigate = useNavigate()
  const { score, priorities, financialVars, isRegistered } = useFinWise()
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (score === null) navigate('/diagnostico')
  }, [score, navigate])

  useEffect(() => {
    if (isRegistered) navigate('/dashboard')
  }, [isRegistered, navigate])

  if (score === null || !financialVars) return null

  const { netIncome, savings, totalDebt, hasEmergencyFund } = financialVars
  const savingsRate = Math.round((savings / netIncome) * 100)

  const stats = [
    { label: 'Ingreso mensual est.', value: formatMXN(netIncome),              icon: '💵' },
    { label: 'Tasa de ahorro est.',  value: `${savingsRate}%`,                  icon: '🏦' },
    { label: 'Deuda total est.',     value: formatMXN(totalDebt),              icon: '📋' },
    { label: 'Fondo emergencia',     value: hasEmergencyFund ? 'Sí ✅' : 'No ❌', icon: '🛡️' },
  ]

  return (
    <main className="min-h-screen bg-transparent pb-16">
      <div className="w-full px-[5%] pt-10 space-y-8 relative">
        <div className="text-center animate-fade-in">
          <p className="text-xs font-semibold text-teal-900 dark:text-sky-300 uppercase tracking-widest mb-2">
            Tu diagnóstico listo
          </p>
          <h1 className="text-3xl sm:text-4xl font-black mb-3 text-gray-900 dark:text-gray-100">
            Tu Score de Salud Financiera
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
            Basado en tus respuestas, calculamos tu situación financiera actual.
          </p>
        </div>

        <div className="flex justify-center animate-fade-in-up">
          <FinWiseScoreDisplay score={score} size={240} showDescription />
        </div>

        <FinWiseCard elevation="md" className="text-center animate-fade-in-up delay-100">
          <p className="text-sm text-gray-600 dark:text-gray-400">{getScoreDescription(score)}</p>
        </FinWiseCard>

        <div className="animate-fade-in-up delay-200">
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Tu perfil estimado
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <FinWiseCard key={s.label} elevation="sm" className="text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
              </FinWiseCard>
            ))}
          </div>
        </div>

        {priorities.length > 0 && (
          <div className="animate-fade-in-up delay-300">
            <h2 className="font-bold mb-3 text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Tu acción prioritaria #1
            </h2>
            <PriorityItem priority={priorities[0]} index={0} />
          </div>
        )}

        <div className="animate-fade-in-up delay-400">
          <FinWiseCard elevation="lg" className="text-center bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">Guarda tu diagnóstico</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 max-w-xs mx-auto">
              Regístrate gratis para acceder a tu plan completo, las 3 prioridades y seguir tu progreso mes a mes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <FinWiseButton size="md" onClick={() => navigate('/register')} pulse>
                Guardar mi diagnóstico →
              </FinWiseButton>
              <FinWiseButton size="md" variant="ghost" onClick={() => navigate('/diagnostico')}>
                Repetir diagnóstico
              </FinWiseButton>
            </div>
          </FinWiseCard>
        </div>

        {priorities.length > 1 && (
          <div className="animate-fade-in-up">
            <h2 className="font-bold mb-3 text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Plan completo (requiere registro)
            </h2>
            <div className="space-y-2 relative">
              {priorities.slice(1).map((p, i) => (
                <div key={p.id} className="relative">
                  <div className="blur-sm pointer-events-none select-none">
                    <PriorityItem priority={p} index={i + 1} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 dark:bg-gray-900/90 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      🔒 Regístrate para ver
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md animate-fade-in-up">
            <FinWiseCard elevation="xl" className="text-center bg-white dark:bg-finwise-dark-bg border-gray-200 dark:border-gray-800 p-8 shadow-2xl relative">
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Cerrar"
              >
                ✕
              </button>
              <div className="text-4xl mb-4 text-teal-900 dark:text-sky-300">🔐</div>
              <h3 className="font-black text-2xl mb-2 text-gray-900 dark:text-gray-100">Guarda tu diagnóstico</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Regístrate gratis para no perder tu progreso, acceder a tu plan de acción completo y empezar a mejorar tu situación financiera.
              </p>
              <div className="flex flex-col gap-3 justify-center">
                <FinWiseButton size="lg" onClick={() => navigate('/register')} pulse>
                  Registrarme Gratis →
                </FinWiseButton>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mt-2"
                >
                  Continuar viendo mi score
                </button>
              </div>
            </FinWiseCard>
          </div>
        </div>
      )}
    </main>
  )
}
