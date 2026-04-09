import { createContext, useContext, useReducer } from 'react'
import { mapAnswersToFinancialVars, calculateScore, generatePriorities } from '../utils/scoreEngine'

/* ─── Initial state ──────────────────────────────────────── */
const initialState = {
  answers: {},

  financialVars: null,

  score: null,
  priorities: [],
  user: null,        
  isRegistered: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ANSWER':
      return { ...state, answers: { ...state.answers, [action.key]: action.value } }

    case 'COMPUTE_SCORE': {
      const vars       = mapAnswersToFinancialVars(state.answers)
      const score      = calculateScore(vars)
      const priorities = generatePriorities(vars, score)
      return { ...state, financialVars: vars, score, priorities }
    }

    case 'REGISTER': {
      return {
        ...state,
        user: { name: action.name, email: action.email },
        isRegistered: true,
      }
    }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

/* ─── Context ────────────────────────────────────────────── */
const FinWiseContext = createContext(null)

export function FinWiseProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setAnswer    = (key, value) => dispatch({ type: 'SET_ANSWER', key, value })
  const computeScore = ()           => dispatch({ type: 'COMPUTE_SCORE' })
  const register     = (name, email) => dispatch({ type: 'REGISTER', name, email })
  const reset        = ()           => dispatch({ type: 'RESET' })

  return (
    <FinWiseContext.Provider value={{ ...state, setAnswer, computeScore, register, reset }}>
      {children}
    </FinWiseContext.Provider>
  )
}

export function useFinWise() {
  const ctx = useContext(FinWiseContext)
  if (!ctx) throw new Error('useFinWise must be used inside FinWiseProvider')
  return ctx
}
