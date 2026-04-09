import { createSlice } from '@reduxjs/toolkit'

const storedUser = (() => {
  try {
    const raw = localStorage.getItem('finwise_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
})()

const initialState = {
  email: storedUser?.email || '',
  score: storedUser?.score ?? null,
  profile: storedUser?.profile || null,
  nesiSynced: storedUser?.nesiSynced ?? false,
  // Historial de snapshots de score: [{ score, level, date }]
  scoreHistory: storedUser?.scoreHistory ?? [],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile(state, action) {
      const { email, profile } = action.payload
      if (email !== undefined) state.email = email
      if (profile !== undefined) state.profile = profile
      persistUser(state)
    },
    setScore(state, action) {
      state.score = action.payload
      persistUser(state)
    },
    recordScoreSnapshot(state, action) {
      const { score, level } = action.payload
      const last = state.scoreHistory[state.scoreHistory.length - 1]
      // Solo registra si el score cambió respecto al último snapshot
      if (!last || last.score !== score) {
        state.scoreHistory = [
          ...state.scoreHistory,
          { score, level: level ?? null, date: new Date().toISOString() },
        ]
      }
      state.score = score
      persistUser(state)
    },
    setNesiSynced(state, action) {
      state.nesiSynced = action.payload
      persistUser(state)
    },
    clearUser() {
      localStorage.removeItem('finwise_user')
      return { email: '', creditIntent: false, score: null, profile: null, nesiSynced: false, scoreHistory: [] }
    },
  },
})

function persistUser(state) {
  localStorage.setItem(
    'finwise_user',
    JSON.stringify({
      email: state.email,
      score: state.score,
      profile: state.profile,
      nesiSynced: state.nesiSynced,
      scoreHistory: state.scoreHistory,
    })
  )
}

export const { setUserProfile, setScore, recordScoreSnapshot, setNesiSynced, clearUser } = userSlice.actions
export default userSlice.reducer
