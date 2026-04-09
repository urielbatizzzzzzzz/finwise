/* Deterministic scoring engine – Phase 1
   Maps "soft" behavioral answers → hard financial variables → score 0-100 */

import {
  INCOME_RANGES,
  DEBT_OPTIONS,
  DISCRETIONARY_OPTIONS,
  EMERGENCY_OPTIONS,
} from './diagnosticQuestions'

// ─── Step 1: Map answers to financial variables ────────────
export function mapAnswersToFinancialVars(answers) {
  const incomeIdx          = answers.income           ?? 1
  const fixedExpenseRatio  = (answers.fixedExpenseRatio ?? 35) / 100
  const savingsRate        = (answers.savingsRate       ?? 5)  / 100
  const debtIdx            = answers.debtLevel          ?? 0
  const discretionaryIdx   = answers.discretionaryCategory ?? 4
  const emergencyIdx       = answers.emergencyFund      ?? 2

  const netIncome      = INCOME_RANGES[incomeIdx].value
  const fixedExpenses  = netIncome * fixedExpenseRatio
  const savings        = netIncome * savingsRate
  const totalDebt      = netIncome * DEBT_OPTIONS[debtIdx].factor
  const discretionary  = netIncome * DISCRETIONARY_OPTIONS[discretionaryIdx].factor
  const emergencyMonths = EMERGENCY_OPTIONS[emergencyIdx].months
  const hasEmergencyFund = emergencyMonths >= 3

  return {
    netIncome,
    fixedExpenses,
    savings,
    totalDebt,
    discretionary,
    emergencyMonths,
    hasEmergencyFund,
    stressLevel: answers.stress ?? 2,
  }
}

// ─── Step 2: Score 0-100 ──────────────────────────────────
export function calculateScore(vars) {
  const { netIncome, fixedExpenses, savings, totalDebt, discretionary, hasEmergencyFund } = vars

  if (!netIncome) return 50

  const savingsRate   = savings / netIncome
  const expenseRatio  = (fixedExpenses + discretionary) / netIncome
  const debtMonths    = totalDebt / netIncome

  let score = 50

  // Savings component (−15 … +25)
  if      (savingsRate >= 0.20) score += 25
  else if (savingsRate >= 0.10) score += 15
  else if (savingsRate >= 0.05) score += 5
  else if (savingsRate === 0)   score -= 15
  else                          score -= 5

  // Expense ratio component (−20 … +15)
  if      (expenseRatio <= 0.50) score += 15
  else if (expenseRatio <= 0.70) score += 5
  else if (expenseRatio <= 0.85) score -= 5
  else                           score -= 20

  // Debt-to-income component (−25 … +10)
  if      (debtMonths === 0)  score += 10
  else if (debtMonths <= 0.5) score += 5
  else if (debtMonths <= 1.5) score -= 5
  else if (debtMonths <= 3)   score -= 15
  else                        score -= 25

  // Emergency fund bonus/penalty
  if (hasEmergencyFund) score += 5
  else if (vars.emergencyMonths === 0) score -= 5

  return Math.max(5, Math.min(100, Math.round(score)))
}

// ─── Step 3: Derive actionable priorities ─────────────────
export function generatePriorities(vars, score) {
  const { netIncome, savings, totalDebt, hasEmergencyFund, fixedExpenses, discretionary } = vars
  const savingsRate  = savings / netIncome
  const expenseRatio = (fixedExpenses + discretionary) / netIncome
  const debtMonths   = totalDebt / netIncome
  const priorities   = []

  if (!hasEmergencyFund) {
    const target = fmt(netIncome * 3)
    const monthly = fmt(netIncome * 0.05)
    priorities.push({
      id: 'emergency',
      impact: 'high',
      icon: '🛡️',
      title: 'Construye tu Fondo de Emergencia',
      description: `Meta: ${target}. Separa ${monthly}/mes automáticamente el día que cobras.`,
      scoreImpact: '+8 pts',
    })
  }

  if (debtMonths >= 1.5) {
    priorities.push({
      id: 'debt',
      impact: 'high',
      icon: '⚡',
      title: 'Ataca tu Deuda con Bola de Nieve',
      description: 'Paga el mínimo en todas tus deudas y concentra el extra en la más pequeña primero.',
      scoreImpact: '+15 pts',
    })
  }

  if (savingsRate < 0.05) {
    const target = fmt(Math.max(300, netIncome * 0.10))
    priorities.push({
      id: 'savings',
      impact: savingsRate === 0 ? 'high' : 'medium',
      icon: '💰',
      title: 'Inicia tu Hábito de Ahorro',
      description: `Configura ${target}/mes en ahorro automático. Empieza pequeño, lo que no ves no lo gastas.`,
      scoreImpact: '+12 pts',
    })
  }

  if (expenseRatio > 0.85) {
    priorities.push({
      id: 'expenses',
      impact: 'medium',
      icon: '📊',
      title: 'Reduce Gastos Hormiga',
      description: 'Tus gastos consumen más del 85% de tus ingresos. Identifica 2 suscripciones o hábitos que puedas pausar este mes.',
      scoreImpact: '+10 pts',
    })
  }

  if (priorities.length === 0) {
    priorities.push({
      id: 'invest',
      impact: 'low',
      icon: '🚀',
      title: '¡Salud financiera excelente! Invierte',
      description: 'Tu base es sólida. El siguiente paso es hacer que tu dinero trabaje: considera CETES, fondos indexados o SIC.',
      scoreImpact: '+5 pts',
    })
  }

  return priorities.slice(0, 3)
}

// ─── Helpers ──────────────────────────────────────────────
export function getScoreColor(score) {
  if (score < 40) return 'var(--score-critical)'
  if (score < 60) return 'var(--score-warning)'
  if (score < 75) return 'var(--score-fair)'
  return 'var(--score-great)'
}

export function getScoreLabel(score) {
  if (score < 40) return 'Crítico'
  if (score < 60) return 'Regular'
  if (score < 75) return 'Bien'
  return 'Excelente'
}

export function getScoreDescription(score) {
  if (score < 40) return 'Tu salud financiera necesita atención urgente. Pero tranquilo/a — cada punto es recuperable.'
  if (score < 60) return 'Estás en zona de alerta. Con algunos ajustes clave puedes mejorar significativamente.'
  if (score < 75) return 'Vas por buen camino. Pequeñas optimizaciones pueden llevarte al siguiente nivel.'
  return '¡Excelente manejo de tus finanzas! Ahora es momento de hacer crecer tu patrimonio.'
}

function fmt(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', minimumFractionDigits: 0,
  }).format(amount)
}
