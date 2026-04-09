/* LiquidityProjection – 30-day cash flow with fixed vs discretionary split */
import { useLiquidity } from '../../hooks/queries/useLiquidity'
import { formatMXN } from '../../utils/formatters'

function SkeletonBar() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mt-2" />
    </div>
  )
}

export default function LiquidityProjection() {
  const {
    totalIncome,
    fixedExpenses,
    discretionaryExpenses,
    projectedBalance,
    isLoading,
    error,
    transactions,
  } = useLiquidity()

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6">
        <SkeletonBar />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Sincroniza tus datos NESI para ver tu proyección de liquidez.
        </p>
      </div>
    )
  }

  const fixedPct   = totalIncome > 0 ? (fixedExpenses / totalIncome) * 100 : 0
  const discPct    = totalIncome > 0 ? (discretionaryExpenses / totalIncome) * 100 : 0
  const balancePct = totalIncome > 0 ? Math.max(0, (projectedBalance / totalIncome) * 100) : 0
  const isDeficit  = projectedBalance < 0

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Proyección 30 días</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Flujo de caja estimado basado en tus datos bancarios
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">Ingreso mensual</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatMXN(totalIncome)}</p>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="space-y-2">
        <div className="flex h-4 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <div className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-700 ease-out" style={{ width: `${fixedPct}%` }} title={`Fijos: ${formatMXN(fixedExpenses)}`} />
          <div className="h-full bg-amber-400 dark:bg-amber-500 transition-all duration-700 ease-out" style={{ width: `${discPct}%` }} title={`Discrecionales: ${formatMXN(discretionaryExpenses)}`} />
          <div className={`h-full transition-all duration-700 ease-out ${isDeficit ? 'bg-red-400' : 'bg-emerald-400 dark:bg-emerald-500'}`} style={{ width: `${balancePct}%` }} title={`Balance: ${formatMXN(projectedBalance)}`} />
        </div>

        <div className="flex flex-wrap gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 dark:bg-blue-400" />
            <span className="text-gray-600 dark:text-gray-400">Fijos</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 dark:bg-amber-500" />
            <span className="text-gray-600 dark:text-gray-400">Discrecionales</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isDeficit ? 'bg-red-400' : 'bg-emerald-400 dark:bg-emerald-500'}`} />
            <span className="text-gray-600 dark:text-gray-400">Balance</span>
          </span>
        </div>
      </div>

      {/* Split cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-800/40 flex items-center justify-center text-sm">🏠</span>
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Gastos Fijos</span>
          </div>
          <p className="text-xl font-bold text-blue-900 dark:text-blue-200">{formatMXN(fixedExpenses)}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{fixedPct.toFixed(0)}% de tu ingreso</p>
          {transactions?.filter(t => t.category === 'TuCategoria').slice(0, 3).map((item, i) => (
            <div key={i} className="flex justify-between text-xs mt-1.5 text-blue-700/70 dark:text-blue-400/60">
              <span>{item.category}</span>
              <span>{formatMXN(item.amount)}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-800/40 flex items-center justify-center text-sm">☕</span>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Discrecionales</span>
          </div>
          <p className="text-xl font-bold text-amber-900 dark:text-amber-200">{formatMXN(discretionaryExpenses)}</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{discPct.toFixed(0)}% de tu ingreso</p>
          {transactions?.filter(t => t.category === 'OtraCategoria').slice(0, 3).map((item, i) => (
            <div key={i} className="flex justify-between text-xs mt-1.5 text-amber-700/70 dark:text-amber-400/60">
              <span>{item.category}</span>
              <span>{formatMXN(item.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Projected balance */}
      <div className={`rounded-xl p-4 flex items-center justify-between ${
        isDeficit
          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'
          : 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30'
      }`}>
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${
            isDeficit ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            Balance proyectado al día 30
          </p>
          <p className={`text-2xl font-bold mt-0.5 ${
            isDeficit ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'
          }`}>
            {formatMXN(projectedBalance)}
          </p>
        </div>
        {isDeficit && (
          <div className="text-right">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-800/40 text-red-700 dark:text-red-300">
              ⚠️ Déficit
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
