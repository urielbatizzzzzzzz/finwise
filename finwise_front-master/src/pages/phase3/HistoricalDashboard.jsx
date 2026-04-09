import { useSelector } from 'react-redux'
import { useLiquidity } from '../../hooks/queries/useLiquidity'
import FinWiseCard from '../../components/ui/FinWiseCard'
import { formatMXN, formatShortDate } from '../../utils/formatters'

/* ─── Score level config ─────────────────────────────── */
const LEVEL_CONFIG = {
  excellent: { label: 'Excelente', color: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500', ring: 'ring-emerald-400' },
  good:      { label: 'Bueno',     color: 'text-teal-600 dark:text-teal-400',       bar: 'bg-teal-500',    ring: 'ring-teal-400' },
  moderate:  { label: 'Moderado',  color: 'text-yellow-600 dark:text-yellow-400',   bar: 'bg-yellow-400',  ring: 'ring-yellow-400' },
  risk:      { label: 'En riesgo', color: 'text-orange-600 dark:text-orange-400',   bar: 'bg-orange-500',  ring: 'ring-orange-400' },
  critical:  { label: 'Crítico',   color: 'text-red-600 dark:text-red-400',         bar: 'bg-red-500',     ring: 'ring-red-400' },
  default:   { label: '—',         color: 'text-gray-500',                           bar: 'bg-gray-300',    ring: 'ring-gray-400' },
}

// Mapea riskTier del API → clave de LEVEL_CONFIG
function riskTierToLevel(riskTier = '') {
  const map = {
    'EXCELLENT': 'excellent',
    'GOOD':      'good',
    'MODERATE':  'moderate',
    'RISK':      'risk',
    'CRITICAL':  'critical',
  }
  return map[riskTier?.toUpperCase()] ?? 'default'
}

function getLevelConfig(level) {
  return LEVEL_CONFIG[level] ?? LEVEL_CONFIG.default
}

/* ─── Score Snapshot Card (1 medición actual) ────────── */
function ScoreSnapshotSection({ score, scoreHistory }) {
  const level  = riskTierToLevel(score?.riskTier)
  const cfg    = getLevelConfig(level)
  const points = Math.round(score?.confidenceScore ?? 0)
  console.log('Score actual:', { score, level, points, scoreHistory })  
  const hasHistory      = scoreHistory.length >= 2
  const previousSnap    = hasHistory ? scoreHistory[scoreHistory.length - 2] : null
  const diff            = hasHistory ? points - previousSnap.score : null
  const improved        = diff > 0
  const unchanged       = diff === 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Puntaje de Confianza Financiera
        </h2>
        {hasHistory && (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border
            ${unchanged
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'
              : improved
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40'
            }`}
          >
            {unchanged ? '→ Sin cambio' : improved ? `▲ +${diff} pts` : `▼ ${diff} pts`}
          </span>
        )}
      </div>

      <div className={`rounded-2xl border p-6 ring-2 ${cfg.ring}/50 ${
        level === 'excellent' || level === 'good'
          ? 'bg-emerald-50/40 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/40'
          : level === 'critical' || level === 'risk'
          ? 'bg-red-50/40 dark:bg-red-900/10 border-red-200 dark:border-red-800/40'
          : 'border-gray-100 dark:border-gray-800'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Medición actual · {formatShortDate(score?.calculatedAt)}
          </p>
          <span className="text-lg">
            {level === 'excellent' || level === 'good' ? '🚀' : level === 'critical' ? '🔴' : '📊'}
          </span>
        </div>

        <div className="flex items-end gap-3 mb-4">
          <p className={`text-6xl font-black tabular-nums ${cfg.color}`}>{points}</p>
          <p className={`text-sm font-bold mb-2 ${cfg.color}`}>{cfg.label}</p>
        </div>

        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 mb-4">
          <div
            className={`${cfg.bar} h-2.5 rounded-full transition-all duration-700`}
            style={{ width: `${Math.min(100, points)}%` }}
          />
        </div>

        {/* Factores del score */}
        <div className="grid grid-cols-3 gap-3 mt-2">
          {[
            { label: 'Liquidez',  value: Math.round((score?.factorLiquidity ?? 0) ),    icon: '💧' },
            { label: 'Ahorro',    value: Math.round((score?.factorSavings   ?? 0)),    icon: '🏦' },
            { label: 'Penalidad', value: Math.round((score?.penaltyNegativeDays ?? 0)), icon: '⚠️' },
          ].map(f => (
            <div key={f.label} className="text-center p-2 rounded-xl bg-white/60 dark:bg-gray-900/40">
              <p className="text-base mb-0.5">{f.icon}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{f.label}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interpretación */}
      <FinWiseCard elevation="sm" className={`border-l-4 ${
        level === 'excellent' || level === 'good'
          ? 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10'
          : level === 'critical' || level === 'risk'
          ? 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10'
          : 'border-l-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10'
      }`}>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {(level === 'excellent' || level === 'good') &&
            '🎉 Tu perfil financiero está en buen estado. Continúa reduciendo deuda y manteniendo tus gastos fijos bajo control.'}
          {level === 'moderate' &&
            '📊 Tu score es moderado. Revisa tus gastos discrecionales y asegúrate de no tener pagos pendientes.'}
          {(level === 'risk' || level === 'critical') &&
            '📉 Tu score indica riesgo. Revisa si aumentaron tus gastos o si tienes pagos vencidos en la sección de Deudas.'}
          {level === 'default' &&
            '➡️ No hay suficiente información para evaluar tu score.'}
        </p>
      </FinWiseCard>

      {/* Historial previo (de Redux si existe) */}
      {scoreHistory.length > 1 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
            Historial ({scoreHistory.length} mediciones)
          </p>
          <div className="flex flex-wrap gap-2">
            {scoreHistory.map((snap, i) => {
              const snapCfg = getLevelConfig(snap.level)
              return (
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-xs">
                  <span className={`w-2 h-2 rounded-full ${snapCfg.bar} inline-block`} />
                  <span className="font-bold text-gray-900 dark:text-gray-100">{snap.score}</span>
                  <span className="text-gray-400">{formatShortDate(snap.date)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────── */
export default function HistoricalDashboard() {
  const {
    data,
    totalIncome,
    fixedExpenses,
    discretionaryExpenses,
    availableBalance,
    isLoading,
  } = useLiquidity()

  const scoreHistory = useSelector((s) => s.user.scoreHistory ?? [])

  const dashboardData = data?.data
  const score         = dashboardData?.score
  const cashflow      = dashboardData?.cashflow

  // Totales del cashflow real (desde el API)
  const totalExpenses  = cashflow?.totalExpenses ?? (fixedExpenses + discretionaryExpenses)
  const freeMargin     = availableBalance  // cashflow.availableBalance = ingreso - egresos

  // Línea base: si hay scoreHistory usamos el primer snapshot como referencia,
  // si no, mostramos ceros (aún no hay diagnóstico previo)
  const baseline       = scoreHistory[0] ?? null
  const baseIncome     = baseline?.netIncome   ?? 0
  const baseExpense    = baseline ? (baseline.fixedExpenses ?? 0) + (baseline.discretionary ?? 0) : 0

  const diffIncome  = totalIncome  - baseIncome
  const diffExpense = totalExpenses - baseExpense

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-gray-400 animate-pulse">Cargando dashboard…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard de Desempeño</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Compara tus hábitos reales del mes frente a tu diagnóstico base.
        </p>
      </div>

      {/* Score actual + historial Redux */}
      {score ? (
        <ScoreSnapshotSection score={score} scoreHistory={scoreHistory} />
      ) : (
        <FinWiseCard className="flex items-center gap-4 py-5">
          <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-xl shrink-0">
            📊
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Score no disponible aún
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Sincroniza tu cuenta con NESI para obtener tu Confidence Score.
            </p>
          </div>
        </FinWiseCard>
      )}

      {/* Línea base vs Realidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FinWiseCard elevation="md" className="border-t-4 border-t-gray-400">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">
            Línea Base (Diagnóstico)
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Ingreso Declarado</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatMXN(baseIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Gasto Estimado</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatMXN(baseExpense)}</span>
            </div>
          </div>
        </FinWiseCard>

        <FinWiseCard elevation="md" className="border-t-4 border-t-teal-500 bg-teal-50/30 dark:bg-teal-900/10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-teal-800 dark:text-teal-400 mb-4">
            Realidad Transaccional
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Ingreso Real Acumulado</span>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 block">{formatMXN(totalIncome)}</span>
                {baseIncome > 0 && diffIncome !== 0 && (
                  <span className={`text-[10px] font-bold ${diffIncome > 0 ? 'text-teal-600' : 'text-red-500'}`}>
                    {diffIncome > 0 ? '+' : ''}{formatMXN(diffIncome)} vs Base
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Gasto Real Acumulado</span>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 block">{formatMXN(totalExpenses)}</span>
                {baseExpense > 0 && diffExpense !== 0 && (
                  <span className={`text-[10px] font-bold ${diffExpense < 0 ? 'text-teal-600' : 'text-red-500'}`}>
                    {diffExpense > 0 ? '+' : ''}{formatMXN(diffExpense)} vs Base
                  </span>
                )}
              </div>
            </div>
            {/* Días con saldo negativo — dato exclusivo del API */}
            {cashflow?.daysNegativeBalance > 0 && (
              <div className="flex justify-between items-center pt-1 border-t border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">Días saldo negativo</span>
                <span className="text-sm font-bold text-red-500">{cashflow.daysNegativeBalance} días</span>
              </div>
            )}
          </div>
        </FinWiseCard>
      </div>

      {/* Margen libre / Liquidez verificada */}
      <FinWiseCard className="text-center pt-8 pb-8">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Liquidez Verificada del Mes</p>
        <p className={`text-4xl font-black ${freeMargin >= 0 ? 'text-teal-700 dark:text-teal-400' : 'text-red-600 dark:text-red-400'}`}>
          {formatMXN(freeMargin)}
        </p>
        {cashflow?.savingsRate > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            Tasa de ahorro: <span className="font-semibold text-teal-600 dark:text-teal-400">{(cashflow.savingsRate * 100).toFixed(1)}%</span>
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Este es el <strong>Margen Libre</strong> auténtico que puedes dirigir a tus{' '}
          <span className="font-semibold text-gray-900 dark:text-gray-100">Metas</span> o a{' '}
          <span className="font-semibold text-gray-900 dark:text-gray-100">Avalancha de Deuda</span>.
        </p>
      </FinWiseCard>

      {/* Checklist del ciclo */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">Checklist del ciclo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FinWiseCard className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${totalIncome > 0 ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}>
            {totalIncome > 0 ? '✓' : '—'}
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Registro de Ingresos</span>
        </FinWiseCard>
        <FinWiseCard className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${totalExpenses > 0 ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}>
            {totalExpenses > 0 ? '✓' : '—'}
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Auditoría de Gastos</span>
        </FinWiseCard>
        <FinWiseCard className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${freeMargin > 0 ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
            {freeMargin > 0 ? '🏆' : '⚠️'}
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Retención de Liquidez</span>
        </FinWiseCard>
      </div>
    </div>
  )
}