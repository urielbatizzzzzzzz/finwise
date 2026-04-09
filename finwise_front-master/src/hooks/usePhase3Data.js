import { useContext, useMemo } from 'react'
import { Phase3Context } from '../context/Phase3Context'
import { useDashboardData } from './queries/useDashboardData'
import { useDebtsQuery } from './queries/useDebts'
import { useGoalsQuery } from './queries/useGoals'
/* ─── Normalizers: adaptan los campos del backend al contrato interno del frontend ─── */

// Debt controller: debtId → id, institution → name, outstandingBalance → balance,
//                  interestRate → apr, minimumPayment → minPayment
export function normalizeDebt(d) {
  return {
    id:         d.debtId        ?? d.id         ?? '',
    name:       d.institution   ?? d.name       ?? '—',
    balance:    d.outstandingBalance ?? d.balance ?? 0,
    apr:        d.interestRate  ?? d.apr        ?? 0,
    minPayment: d.minimumPayment ?? d.minPayment ?? 0,
    createdAt:  d.createdAt     ?? null,
  }
}

// Goal controller: goalId → id, title → name, currentAmount → savedAmount
export function normalizeGoal(g) {
  return {
    id:                 g.goalId             ?? g.id           ?? '',
    name:               g.title              ?? g.name         ?? '—',
    description:        g.description        ?? '',
    goalType:           g.goalType           ?? 'SAVINGS',
    targetAmount:       g.targetAmount       ?? 0,
    savedAmount:        g.currentAmount      ?? g.savedAmount  ?? 0,
    deadlineMonths:     g.deadlineMonths     ?? null,
    monthlyRequired:    g.monthlyRequired    ?? null,
    progressPercentage: g.progressPercentage ?? 0,
    status:             g.status             ?? 'ACTIVE',
    createdAt:          g.createdAt          ?? null,
  }
}

// Transaction (recentTransactions from dashboard/NESI):
// txId → id, merchant → desc, txDate → date, category stays,
// amount positive = income if category is income-like, else expense
export function normalizeTransaction(t) {
  const isIncome = ['income', 'INCOME', 'salary', 'SALARY', 'income_source'].includes(t.category)
  return {
    id:       t.txId      ?? t.id       ?? '',
    desc:     t.merchant  ?? t.desc     ?? '—',
    amount:   Math.abs(Number(t.amount ?? 0)),
    type:     isIncome ? 'income' : 'expense',
    category: isIncome ? 'income_source' : (t.category?.toLowerCase() ?? 'variable'),
    date:     t.txDate    ?? t.date     ?? null,
    status:   t.status    ?? null,
  }
}

export function usePhase3() {
  const ctx = useContext(Phase3Context)
  if (!ctx) throw new Error('usePhase3 must be used within Phase3Provider')
  return ctx
}

export function useIdentity() {
  const { state, actions } = usePhase3()
  return {
    profile: state.userProfile,
    isLoading: state.isLoading,
    wipeAccount: actions.wipeAccount,
    setBaseline: actions.setBaseline
  }
}

export function useTransactions() {

  const { 
    transactions: rawTransactions, 
    totalIncome, 
    fixedExpenses, 
    discretionaryExpenses,
    availableBalance,
    isLoading 
  } = useDashboardData()

  const calculations = useMemo(() => {
    const totalExpense = fixedExpenses + discretionaryExpenses
    const totalVariable = 0 
    const freeMargin = availableBalance ?? 0
    const isOverDebt = totalIncome > 0 && totalExpense > (totalIncome * 1.5)

    return { 
      totalIncome, 
      totalExpense, 
      totalFixed: fixedExpenses, 
      totalVariable, 
      totalDiscretionary: discretionaryExpenses, 
      freeMargin, 
      isOverDebt 
    }
  }, [totalIncome, fixedExpenses, discretionaryExpenses, availableBalance])

  // Normaliza las transacciones para la UI
  const transactions = useMemo(() => 
    rawTransactions?.map(normalizeTransaction) ?? [], 
  [rawTransactions])

  return {
    transactions,
    isLoading,
    ...calculations,
    addTransaction: () => console.warn('Usar mutación de React Query'),
    deleteTransaction: () => console.warn('Usar mutación de React Query')
  }
}
export function useDebts() {

  const { debts: rawDebts, isLoading } = useDebtsQuery()

  const debtsAvalanche = useMemo(() => {
    return [...rawDebts].sort((a, b) => Number(b.apr) - Number(a.apr))
  }, [rawDebts])

  const totalDebtBalance = rawDebts.reduce((sum, d) => sum + Number(d.balance), 0)
  const totalMinPayment  = rawDebts.reduce((sum, d) => sum + Number(d.minPayment), 0)

  return {
    debts: debtsAvalanche,
    totalDebtBalance,
    totalMinPayment,
    isLoading,
    addDebt: () => {}, // React Query lo maneja con mutaciones
    updateDebt: () => {},
    deleteDebt: () => {}
  }
}

export function useGoals() {
  const { goals, isLoading } = useGoalsQuery()

  return {
    goals, 
    isLoading,
    addGoal:    () => {}, 
    updateGoal: () => {},
    deleteGoal: () => {}, 
  }
}

export function useHistorical() {
  const { state } = usePhase3()
  const { transactions } = useTransactions()
  const { debts } = useDebts()
  
  return {
    baseline: state.baseline,
    transactions,
    debts
  }
}
