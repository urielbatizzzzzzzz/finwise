import { createContext, useReducer } from 'react'

const initialPhase3State = {

  userProfile:  { names: '', email: '' },
  isLoading:    false,
  baseline:     null,
}

function phase3Reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'UPDATE_PROFILE':
      return { ...state, userProfile: { ...state.userProfile, ...action.payload } }
    case 'SET_BASELINE':
      return { ...state, baseline: action.payload }
    case 'WIPE_ACCOUNT':
      return initialPhase3State
    default:
      return state
  }
}

export const Phase3Context = createContext(null)

export function Phase3Provider({ children }) {
  const [state, dispatch] = useReducer(phase3Reducer, initialPhase3State)

  const actions = {
    updateProfile: (data) => dispatch({ type: 'UPDATE_PROFILE', payload: data }),
    wipeAccount: () => dispatch({ type: 'WIPE_ACCOUNT' }),
    setLoading: (isLoading) => dispatch({ type: 'SET_LOADING', payload: isLoading }),
    setBaseline: (baseline) => dispatch({ type: 'SET_BASELINE', payload: baseline }), 
  }

  return (
    <Phase3Context.Provider value={{ state, actions }}>
      {children}
    </Phase3Context.Provider>
  )
}