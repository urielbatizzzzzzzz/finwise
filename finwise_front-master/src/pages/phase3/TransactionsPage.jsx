import { useState, useMemo, useRef, useEffect } from 'react'
import { useLiquidity } from '../../hooks/queries/useLiquidity'
import FinWiseCard from '../../components/ui/FinWiseCard'
import { formatMXN } from '../../utils/formatters'

function formatDate(isoString) {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(new Date(isoString))
}

const PERIODS = [
  { id: '1w', label: '1 Semana', icon: '📅', days: 7  },
  { id: '1m', label: '1 Mes',    icon: '🗓️', days: 30 },
  { id: '2m', label: '2 Meses',  icon: '📆', days: 60 },
]

// Mapea category del API → etiqueta legible + color
const CATEGORY_CONFIG = {
  fixed:         { label: 'Gasto Fijo',     bg: 'bg-red-100 dark:bg-red-900/30',      text: 'text-red-600 dark:text-red-400',      dot: 'bg-red-500'    },
  variable:      { label: 'Variable',       bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-400' },
  discretionary: { label: 'Discrecional',   bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-500', dot: 'bg-yellow-400' },
  income_source: { label: 'Ingreso',        bg: 'bg-teal-100 dark:bg-teal-900/30',     text: 'text-teal-600 dark:text-teal-400',    dot: 'bg-teal-500'   },
  income:        { label: 'Ingreso',        bg: 'bg-teal-100 dark:bg-teal-900/30',     text: 'text-teal-600 dark:text-teal-400',    dot: 'bg-teal-500'   },
  default:       { label: 'Movimiento',     bg: 'bg-gray-100 dark:bg-gray-800',        text: 'text-gray-500 dark:text-gray-400',    dot: 'bg-gray-400'   },
}

function getCategoryConfig(category, type) {
  if (category && CATEGORY_CONFIG[category]) return CATEGORY_CONFIG[category]
  if (type === 'income') return CATEGORY_CONFIG.income
  return CATEGORY_CONFIG.default
}

function PeriodFilter({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 w-fit">
      {PERIODS.map(p => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
            ${value === p.id
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm shadow-black/10'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          <span className="text-base leading-none">{p.icon}</span>
          <span>{p.label}</span>
        </button>
      ))}
    </div>
  )
}

function MovementRow({ t }) {
  const cfg = getCategoryConfig(t.category, t.type)

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
      <div className="flex items-center gap-3">
        {/* Dot de categoría */}
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
        <div>
          {/* Concepto / merchant */}
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t.merchant || t.desc || '—'}
          </p>
          {/* Solo fecha + categoría, sin hint de dirección */}
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t.txDate || t.date ? formatDate(t.txDate ?? t.date) : '—'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Badge de categoría */}
        <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
          {cfg.label}
        </span>
        {/* Monto neutro — sin + ni - */}
        <p className="text-sm font-bold tabular-nums text-gray-900 dark:text-gray-100 min-w-[80px] text-right">
          {formatMXN(t.amount ?? t.totalAmount ?? 0)}
        </p>
      </div>
    </div>
  )
}

export default function MovementsPage() {
  const { transactions, isLoading } = useLiquidity()

  const [period, setPeriod] = useState('1m')
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = useMemo(() => {
    const days   = PERIODS.find(p => p.id === period)?.days ?? 30
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000

    return transactions
      .filter(t => {
        const date = t.txDate ?? t.date
        if (!date) return true
        return new Date(date).getTime() >= cutoff
      })
      .filter(t => {
        if (activeCategory === 'all') return true
        const cfg = getCategoryConfig(t.category, t.type)
        return cfg.label === activeCategory
      })
      .slice()
      .reverse()
  }, [transactions, period, activeCategory])

  // Categorías únicas presentes en el período
  const categoryTabs = useMemo(() => {
    const days   = PERIODS.find(p => p.id === period)?.days ?? 30
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
    const inPeriod = transactions.filter(t => {
      const date = t.txDate ?? t.date
      if (!date) return true
      return new Date(date).getTime() >= cutoff
    })
    const labels = [...new Set(inPeriod.map(t => getCategoryConfig(t.category, t.type).label))]
    return labels
  }, [transactions, period])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-gray-400 animate-pulse">Cargando movimientos…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Movimientos</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Todos los movimientos de tu cuenta en el período seleccionado.
        </p>
      </div>

      {/* Período */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Período:
        </span>
        <PeriodFilter value={period} onChange={p => { setPeriod(p); setActiveCategory('all') }} />
      </div>

      {/* Filtro por categoría */}
      {categoryTabs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border
              ${activeCategory === 'all'
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-transparent'
                : 'bg-white dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-400'
              }`}
          >
            Todos · {transactions.length}
          </button>
          {categoryTabs.map(label => {
            const cfgEntry = Object.values(CATEGORY_CONFIG).find(c => c.label === label) ?? CATEGORY_CONFIG.default
            const count = filtered.filter(t => getCategoryConfig(t.category, t.type).label === label).length
            return (
              <button
                key={label}
                onClick={() => setActiveCategory(label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border
                  ${activeCategory === label
                    ? `${cfgEntry.bg} ${cfgEntry.text} border-transparent`
                    : 'bg-white dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-400'
                  }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfgEntry.dot}`} />
                {label}
                {activeCategory === label && <span className="ml-0.5 opacity-70">· {count}</span>}
              </button>
            )
          })}
        </div>
      )}

      {/* Lista */}
      {filtered.length === 0 ? (
        <FinWiseCard className="text-center py-12">
          <p className="text-3xl mb-3">🏦</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Sin movimientos</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No hay movimientos para este período o categoría.
          </p>
        </FinWiseCard>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-right">
            {filtered.length} movimiento{filtered.length !== 1 ? 's' : ''}
          </p>
          {filtered.map(t => (
            <MovementRow key={t.txId ?? t.id} t={t} />
          ))}
        </div>
      )}
    </div>
  )
}