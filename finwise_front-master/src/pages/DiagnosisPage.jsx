import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinWise } from '../context/FinWiseContext'
import { QUESTIONS, INCOME_RANGES, STRESS_LABELS } from '../utils/diagnosticQuestions'
import StepIndicator from '../components/ui/StepIndicator'
import FinWiseButton from '../components/ui/FinWiseButton'
import FinWiseCard   from '../components/ui/FinWiseCard'

/* ─── Individual question renderers ──────────────────────── */

function SliderEmoji({ value, onChange }) {
  const labels = STRESS_LABELS
  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="text-6xl">
          {['😰', '😟', '😐', '🙂', '😊'][value]}
        </span>
        <p className="mt-3 font-semibold text-gray-900 dark:text-gray-100">
          {labels[value]}
        </p>
      </div>
      <input
        type="range" min={0} max={4} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Muy preocupado/a</span>
        <span>Muy tranquilo/a</span>
      </div>
    </div>
  )
}

function RangePicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {INCOME_RANGES.map((r, i) => (
        <FinWiseCard
          key={r.label}
          selected={value === i}
          onClick={() => onChange(i)}
          className="flex items-center justify-between"
        >
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{r.label}</span>
          {value === i && (
            <span className="w-5 h-5 rounded-full bg-teal-700 dark:bg-teal-200 flex items-center justify-center">
              <svg className="w-3 h-3 text-white dark:text-gray-900" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
        </FinWiseCard>
      ))}
    </div>
  )
}

function SliderPercent({ q, value, onChange }) {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <span className="text-5xl font-black text-teal-900 dark:text-sky-300">{value}%</span>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {q.id === 'fixedExpenseRatio' ? 'de tu ingreso en gastos fijos' : 'de ahorro mensual'}
        </p>
      </div>
      <input
        type="range" min={q.min} max={q.max} step={5} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{q.min}%</span>
        <span>{q.max}%</span>
      </div>
    </div>
  )
}

function ChoiceCards({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {options.map((opt, i) => (
        <FinWiseCard
          key={i}
          selected={value === i}
          onClick={() => onChange(i)}
          className="flex items-center gap-3"
        >
          <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{opt.label}</span>
          {value === i && (
            <span className="ml-auto w-5 h-5 rounded-full bg-teal-700 dark:bg-teal-200 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white dark:text-gray-900" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
        </FinWiseCard>
      ))}
    </div>
  )
}

/* ─── Main DiagnosisPage ─────────────────────────────────── */
export default function DiagnosisPage() {
  const navigate              = useNavigate()
  const { setAnswer, computeScore } = useFinWise()
  const [step, setStep]       = useState(0)

  const [values, setValues] = useState({
    stress:               2,
    income:               1,
    fixedExpenseRatio:    35,
    savingsRate:          5,
    debtLevel:            null,
    discretionaryCategory: null,
    emergencyFund:        null,
  })

  const current  = QUESTIONS[step]
  const total    = QUESTIONS.length
  const getValue = () => values[current.id]
  const setValue = (val) => setValues(prev => ({ ...prev, [current.id]: val }))

  const canAdvance = () => {
    const v = getValue()
    if (current.type === 'choice-cards' || current.type === 'range-picker') {
      return v !== null && v !== undefined
    }
    return true
  }

  const handleNext = () => {
    setAnswer(current.id, getValue())
    if (step < total - 1) {
      setStep(s => s + 1)
    } else {
      QUESTIONS.forEach(q => setAnswer(q.id, values[q.id]))
      computeScore()
      navigate('/resultado')
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1)
    else navigate('/')
  }

  const renderInput = () => {
    switch (current.type) {
      case 'slider-emoji':   return <SliderEmoji value={getValue() ?? 2} onChange={setValue} />
      case 'range-picker':   return <RangePicker value={getValue()} onChange={setValue} />
      case 'slider-percent': return <SliderPercent q={current} value={getValue() ?? current.default} onChange={setValue} />
      case 'choice-cards':   return <ChoiceCards options={current.options} value={getValue()} onChange={setValue} />
      default:               return null
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-transparent">
      <div className="flex-1 w-full px-[5%] py-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-teal-900 dark:hover:text-sky-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M15 19l-7-7 7-7" />
            </svg>
            {step === 0 ? 'Inicio' : 'Anterior'}
          </button>
          <StepIndicator current={step + 1} total={total} />
        </div>

        <div key={step} className="animate-fade-in-up flex-1 flex flex-col gap-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-snug text-gray-900 dark:text-gray-100">
              {current.title}
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{current.subtitle}</p>
          </div>
          <div className="flex-1">{renderInput()}</div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <FinWiseButton size="lg" onClick={handleNext} disabled={!canAdvance()} className="w-full">
            {step === total - 1 ? 'Ver mi Score →' : 'Continuar →'}
          </FinWiseButton>
        </div>
      </div>
    </main>
  )
}
