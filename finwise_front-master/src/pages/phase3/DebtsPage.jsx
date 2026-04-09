import { useState, useMemo } from 'react'
import { useDebts, useTransactions } from '../../hooks/usePhase3Data'
import FinWiseCard from '../../components/ui/FinWiseCard'
import { formatMXN } from '../../utils/formatters'

function AprBadge({ apr }) {
  const isHigh = apr >= 50
  const isMed  = apr >= 20 && apr < 50
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
      isHigh
        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        : isMed
          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    }`}>
      {apr}% TIA
    </span>
  )
}

function DebtSimulator({ debts }) {
  const [selectedId, setSelectedId] = useState(debts[0]?.id ?? '')
  const [days, setDays] = useState(30)

  const debt = useMemo(() => debts.find(d => d.id === selectedId) ?? debts[0], [debts, selectedId])

  const { interest, total, dailyRate } = useMemo(() => {
    if (!debt) return { interest: 0, total: 0, dailyRate: 0 }
    const dailyRate = Number(debt.apr) / 100 / 365
    const total     = Number(debt.balance) * Math.pow(1 + dailyRate, days)
    const interest  = total - Number(debt.balance)
    return { interest, total, dailyRate }
  }, [debt, days])

  const chartPoints = useMemo(() => {
    if (!debt) return []
    const dailyRate = Number(debt.apr) / 100 / 365
    return [0, 15, 30, 45, 60, 90].map(d => ({
      day:   d,
      total: Number(debt.balance) * Math.pow(1 + dailyRate, d),
    }))
  }, [debt])

  const maxTotal = chartPoints.length ? chartPoints[chartPoints.length - 1].total : 1
  const minTotal = Number(debt?.balance ?? 0)
  const range    = maxTotal - minTotal || 1

  if (!debt) return null

  return (
    <FinWiseCard className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-lg">📈</span>
        <div>
          <h2 className="font-bold text-gray-900 dark:text-gray-100">Simulador de Intereses</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">¿Cuánto crece tu deuda si pasas el día de corte?</p>
        </div>
      </div>

      {debts.length > 1 && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Deuda a simular</label>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="w-full text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {debts.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} — {formatMXN(d.balance)} · {d.apr}% TIA
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 px-3 py-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Saldo actual</p>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatMXN(debt.balance)}</p>
        </div>
        <div className="rounded-xl bg-orange-50 dark:bg-orange-900/20 px-3 py-3">
          <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Intereses en {days}d</p>
          <p className="text-sm font-bold text-orange-600 dark:text-orange-400">+{formatMXN(interest)}</p>
        </div>
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 px-3 py-3">
          <p className="text-xs text-red-600 dark:text-red-400 mb-1">Total a pagar</p>
          <p className="text-sm font-bold text-red-600 dark:text-red-400">{formatMXN(total)}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Días transcurridos tras corte</label>
          <span className="text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full">
            {days} días
          </span>
        </div>
        <input
          type="range" min={1} max={90} value={days}
          onChange={e => setDays(Number(e.target.value))}
          className="w-full accent-teal-600"
        />
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-600 mt-1">
          <span>1 día</span>
          <span>30 días</span>
          <span>60 días</span>
          <span>90 días</span>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Crecimiento del saldo</p>
        <div className="flex items-end gap-1 h-16">
          {chartPoints.map((pt, i) => {
            const heightPct = ((pt.total - minTotal) / range) * 100
            const isActive  = pt.day <= days
            return (
              <div key={i} className="flex flex-col items-center flex-1 gap-1">
                <div className="w-full rounded-t-sm flex items-end" style={{ height: '48px' }}>
                  <div
                    className={`w-full rounded-t-sm transition-all duration-300 ${isActive ? 'bg-teal-500 dark:bg-teal-400' : 'bg-gray-200 dark:bg-gray-700'}`}
                    style={{ height: `${Math.max(4, heightPct)}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-600">{pt.day}d</span>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-600 text-right">
        Tasa diaria: {(dailyRate * 100).toFixed(4)}% · Interés compuesto
      </p>
    </FinWiseCard>
  )
}

export default function DebtsPage() {
  const { debts, totalDebtBalance, totalMinPayment } = useDebts()
  const { freeMargin, totalIncome } = useTransactions()

  const highestAprDebt  = debts.length > 0 ? debts[0] : null
  const debtToIncomeRatio = totalIncome > 0 ? (totalDebtBalance / totalIncome) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Instrumentos de Deuda</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tus compromisos de crédito ordenados por mayor tasa de interés (Método Avalancha).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FinWiseCard elevation="sm" className="p-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Deuda Total</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatMXN(totalDebtBalance)}</p>
        </FinWiseCard>
        <FinWiseCard elevation="sm" className="p-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pago Mínimo Mensual</p>
          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{formatMXN(totalMinPayment)}</p>
        </FinWiseCard>
        <FinWiseCard elevation="sm" className="p-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Relación Deuda/Ingreso</p>
          <p className={`text-xl font-bold ${debtToIncomeRatio > 3 ? 'text-red-600 dark:text-red-400' : debtToIncomeRatio > 1.5 ? 'text-orange-600 dark:text-orange-400' : 'text-teal-700 dark:text-sky-300'}`}>
            {debtToIncomeRatio.toFixed(1)}x
          </p>
        </FinWiseCard>
      </div>

      {highestAprDebt && freeMargin > 0 && (
        <FinWiseCard className="border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-900/10">
          <div className="flex gap-3">
            <span className="text-2xl shrink-0">⚡</span>
            <div>
              <p className="text-sm font-bold text-teal-800 dark:text-teal-300">Estrategia Avalancha Activa</p>
              <p className="text-xs text-teal-700 dark:text-teal-400 mt-1 leading-relaxed">
                Tienes un excedente de <strong>{formatMXN(freeMargin)}</strong> este mes.
                Paga el mínimo de todos tus créditos y aplica el sobrante íntegramente a{' '}
                <strong>{highestAprDebt.name}</strong> ({highestAprDebt.apr}% anual) para liquidar
                primero la deuda más cara y maximizar tu ahorro en intereses.
              </p>
            </div>
          </div>
        </FinWiseCard>
      )}

      {highestAprDebt && freeMargin <= 0 && (
        <FinWiseCard className="border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10">
          <div className="flex gap-3">
            <span className="text-2xl shrink-0">🚨</span>
            <div>
              <p className="text-sm font-bold text-red-800 dark:text-red-300">Sin Margen para Avalancha</p>
              <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                Tu margen libre es negativo ({formatMXN(freeMargin)}). Prioriza cubrir los pagos mínimos
                y busca reducir gastos discrecionales para recuperar liquidez.
              </p>
            </div>
          </div>
        </FinWiseCard>
      )}

      {debts.length > 0 && <DebtSimulator debts={debts} />}

      {debts.length === 0 ? (
        <FinWiseCard className="text-center py-12">
          <p className="text-3xl mb-3">🎉</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Sin deudas registradas</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Los créditos sincronizados desde tu banco aparecerán aquí.
          </p>
        </FinWiseCard>
      ) : (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Orden de ataque — Prioridad por tasa
          </h2>
          {debts.map((d, index) => {
            const payoffMonths = freeMargin > 0 ? Math.ceil(d.balance / (d.minPayment + (index === 0 ? freeMargin : 0))) : null
            return (
              <div key={d.id} className="relative flex flex-col p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                      index === 0
                        ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{d.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        🏦 Institución Financiera
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900 dark:text-gray-100">{formatMXN(d.balance)}</p>
                    <AprBadge apr={d.apr} />
                  </div>
                </div>

                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mb-3">
                  <div
                    className={`h-1.5 rounded-full ${index === 0 ? 'bg-teal-500' : 'bg-gray-400 dark:bg-gray-600'}`}
                    style={{ width: `${Math.min(100, 100 - Math.min(90, debtToIncomeRatio * 15))}%` }}
                  />
                </div>

                <div className="flex flex-wrap justify-between gap-2 pt-2 border-t border-gray-50 dark:border-gray-800/60">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Pago mínimo:{' '}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{formatMXN(d.minPayment)}/mes</span>
                  </div>
                  {payoffMonths && index === 0 && (
                    <div className="text-xs text-teal-700 dark:text-teal-400 font-semibold">
                      ≈ {payoffMonths} meses para liquidar (con avalancha)
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}