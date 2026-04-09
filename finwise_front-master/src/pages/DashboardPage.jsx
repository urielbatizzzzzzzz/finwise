import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useConfidenceScore } from '../hooks/queries/useConfidenceScore'
import NesiSyncButton     from '../components/dashboard/NesiSyncButton'
import ConfidenceGauge    from '../components/dashboard/ConfidenceGauge'
import LiquidityProjection from '../components/dashboard/LiquidityProjection'
import ShadowMarketplace  from '../components/dashboard/ShadowMarketplace'
import FinWiseButton      from '../components/ui/FinWiseButton'
import FinWiseCard        from '../components/ui/FinWiseCard'

function WelcomeHeader() {
  const profile     = useSelector((s) => s.user.profile)
  const displayName = profile ? profile.name : 'userito'

  const hour = new Date().getHours()
  let greeting = 'Buenas noches'
  if (hour >= 5  && hour < 12) greeting = 'Buenos días'
  else if (hour >= 12 && hour < 19) greeting = 'Buenas tardes'

  return (
    <div className="space-y-1">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
        {greeting}, <span className="text-teal-700 dark:text-sky-300">{displayName}</span> 👋
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Tu panel de bienestar financiero. Aquí tienes un resumen de tu salud financiera.
      </p>
    </div>
  )
}

function ScoreSection() {
  const { score, isLoading, error } = useConfidenceScore()
  const [showSyncInfo, setShowSyncInfo] = useState(false)
  // const [vincular, setVincular] = useState(false)

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-8">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-48 h-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-8 relative overflow-hidden">
        <div className="text-center">
          <p className="text-4xl mb-3">📊</p>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">Score no disponible</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sincroniza tus datos NESI para calcular tu score de confianza.
          </p>
          <button
            onClick={() => setShowSyncInfo(true)}
            className="mt-4 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300 hover:underline transition-colors focus:outline-none"
          >
            ¿Por qué es necesario sincronizar con NESI?
          </button>
        </div>

        {showSyncInfo && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm animate-fade-in transition-all">
            <div className="bg-white dark:bg-gray-800 border border-teal-100 dark:border-teal-900/30 rounded-xl shadow-2xl p-6 text-left w-full relative">
              <button
                onClick={() => setShowSyncInfo(false)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ✕
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center text-xl shrink-0 border border-teal-100 dark:border-teal-800/50">
                  🛡️
                </div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight">
                  Tu Seguridad Primero
                </h4>
              </div>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  <strong className="text-gray-800 dark:text-gray-200">¿Por qué es necesario?</strong><br />
                  NESI nos proporciona tus saldos y transacciones al día para poder calcular tu <em>Confidence Score</em> en tiempo real.
                </p>
                <p>
                  <strong className="text-gray-800 dark:text-gray-200">¿Cómo te ayuda?</strong><br />
                  Con datos reales, FinWise puede proyectar tu liquidez, armar estrategias como el método avalancha para tus deudas y darte recomendaciones precisas.
                </p>
                <div className="mt-4 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2.5 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                  <p className="text-emerald-700 dark:text-emerald-400 font-medium text-xs sm:text-sm">
                    🔒 Ninguno de tus datos sensibles se ve expuesto. La conexión funciona en modo de solo lectura y bajo estrictos protocolos de cifrado.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSyncInfo(false)}
                className="mt-5 w-full py-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 text-white rounded-xl font-medium transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 sm:p-8">
      <div className="text-center mb-2">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Confidence Score</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Tu puntaje de confianza financiera</p>
      </div>
      <ConfidenceGauge score={score?.confidenceScore ?? 0} size={280} />
    </div>
  )
}

function Phase3CTA() {
  const navigate = useNavigate()

  return (
    <FinWiseCard elevation="md" className="bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900/20 dark:to-sky-900/20 border-teal-200 dark:border-teal-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-2xl shrink-0">
            📊
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100">Gestión Financiera Avanzada</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Registra transacciones, gestiona deudas con método avalancha y crea metas de ahorro.
            </p>
          </div>
        </div>
        <FinWiseButton onClick={() => navigate('/phase3')} className="shrink-0 w-full sm:w-auto">
          Ir a Gestión →
        </FinWiseButton>
      </div>
    </FinWiseCard>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <WelcomeHeader />
      {/* <NesiSyncButton /> */}
      <Phase3CTA />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreSection />
        <LiquidityProjection />
      </div>

      <ShadowMarketplace />
    </div>
  )
}
