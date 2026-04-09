import { useState } from 'react'
import { useTransactions } from '../../hooks/usePhase3Data'
import { useGoalsQuery, useCreateGoal, useDeleteGoal } from '../../hooks/queries/useGoals'
import FinWiseButton from '../../components/ui/FinWiseButton'
import FinWiseCard   from '../../components/ui/FinWiseCard'
import { formatMXN } from '../../utils/formatters'

export default function GoalsPage() {
  const { goals, isLoading }              = useGoalsQuery()
  const createGoal                        = useCreateGoal()
  const deleteGoalMutation                = useDeleteGoal()
  const { freeMargin }                    = useTransactions()

  const [name,           setName]         = useState('')
  const [target,         setTarget]       = useState('')
  const [deadlineMonths, setDeadlineMonths] = useState('')
  const [goalType,       setGoalType]       = useState('SAVINGS')

  const isSubmitting = createGoal.isPending
  const isDeleting   = deleteGoalMutation.isPending

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim() || Number(target) <= 0) return
    await createGoal.mutateAsync({
      goalType,
      title:         name.trim(), // Se envía como title
      description:   '',
      targetAmount:  Number(target),
      deadlineMonths: deadlineMonths ? Number(deadlineMonths) : null,
    })
    setName('')
    setTarget('')
    setDeadlineMonths('')
  }

  const handleDelete = (goalId) => deleteGoalMutation.mutate(goalId)

  const marginPerGoal = goals.length > 0 && freeMargin > 0 ? freeMargin / goals.length : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Metas de Ahorro</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Proyecta cómo utilizar tu margen libre para lograr tus sueños y tu fondo de emergencia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FinWiseCard elevation="sm" className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-700 dark:text-teal-400 text-xl">
            💵
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Excedente Mensual Disponible</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatMXN(freeMargin)}</p>
          </div>
        </FinWiseCard>

        <FinWiseCard elevation="sm" className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-700 dark:text-sky-400 text-xl">
            🎯
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Estimación de alcance medio</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {marginPerGoal > 0 ? formatMXN(marginPerGoal) + '/mes' : 'Sin liquidez'}
            </p>
          </div>
        </FinWiseCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
        <div className="md:col-span-2">
          <FinWiseCard>
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Nueva Meta</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Tipo de meta</label>
                <select
                  value={goalType} onChange={e => setGoalType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500"
                >
                  <option value="SAVINGS">💰 Ahorro</option>
                  <option value="EMERGENCY_FUND">🛡️ Fondo de emergencia</option>
                  <option value="DEBT_PAYOFF">⚡ Pago de deuda</option>
                  <option value="INVESTMENT">📈 Inversión</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Nombre de la meta</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)} required
                  placeholder="Ej. Fondo de emergencia"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Monto objetivo total</label>
                <input
                  type="number" min="1" step="0.01" value={target} onChange={e => setTarget(e.target.value)} required
                  placeholder="Ej. 15000"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Plazo (meses) <span className="text-gray-400">opcional</span></label>
                <input
                  type="number" min="1" max="360" value={deadlineMonths} onChange={e => setDeadlineMonths(e.target.value)}
                  placeholder="Ej. 12"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <FinWiseButton type="submit" loading={isSubmitting} className="w-full">Registrar Meta</FinWiseButton>
            </form>
          </FinWiseCard>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Tus Proyectos</h2>
          {goals.length === 0 ? (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
              No tienes metas de ahorro registradas.
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((g) => {
                const monthsToComplete = marginPerGoal > 0 ? Math.ceil(g.targetAmount / marginPerGoal) : 'Infinitos'
                // Convertimos el 0.1 del backend a porcentaje real (10%)
                const percentageReal = (g.progressPercentage ?? 0) * 100;

                return (
                  // CAMBIO 1: key es ahora g.goalId en lugar de g.id
                  <div key={g.goalId} className="relative p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <button
                      // CAMBIO 2: Pasamos g.goalId al eliminar
                      onClick={() => handleDelete(g.goalId)}
                      disabled={isDeleting}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 disabled:opacity-40 z-10"
                    >×</button>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          {/* CAMBIO 3: Ahora es g.title en lugar de g.name */}
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 pr-6">{g.title}</h3>
                          {g.goalType && (
                            <span className="text-xs text-gray-400">{{
                              SAVINGS: '💰 Ahorro',
                              EMERGENCY_FUND: '🛡️ Fondo de emergencia',
                              DEBT_PAYOFF: '⚡ Pago de deuda',
                              INVESTMENT: '📈 Inversión',
                            }[g.goalType] ?? g.goalType}</span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-teal-700 dark:text-sky-300 whitespace-nowrap">{formatMXN(g.targetAmount)}</p>
                      </div>

                      {/* CAMBIO 4: Usamos percentageReal (multiplicado por 100) */}
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 my-3">
                        <div
                          className="bg-teal-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, percentageReal)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        {/* CAMBIO 5: Ahora es g.currentAmount en lugar de g.savedAmount */}
                        <span>{formatMXN(g.currentAmount)} ahorrado</span>
                        <span>{percentageReal.toFixed(1)}%</span>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-50 dark:border-gray-800/50">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {g.monthlyRequired
                            ? `Aporte sugerido: ${formatMXN(g.monthlyRequired)}/mes`
                            : marginPerGoal > 0 ? `Si aportaras ${formatMXN(marginPerGoal)}/mes...` : 'Sin liquidez disponible'}
                        </span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                          {g.deadlineMonths
                            ? `Plazo: ${g.deadlineMonths} meses`
                            : marginPerGoal > 0
                              ? `~${Math.ceil(g.targetAmount / marginPerGoal)} meses`
                              : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}