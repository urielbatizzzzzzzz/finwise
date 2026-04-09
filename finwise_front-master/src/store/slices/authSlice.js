import { createSlice } from '@reduxjs/toolkit'

const storedToken = localStorage.getItem('finwise_token')

const initialState = {
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload
      state.error = null
    },
    setCredentials(state, action) {
      const { token } = action.payload
      state.token = token
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
      localStorage.setItem('finwise_token', token)
    },
    setAuthError(state, action) {
      state.error = action.payload
      state.isLoading = false
    },
    logout(state) {
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
      localStorage.removeItem('finwise_token')
      localStorage.removeItem('finwise_user')
    },
    clearError(state) {
      state.error = null
    },
  },
})

export const { setLoading, setCredentials, setAuthError, logout, clearError } = authSlice.actions
export default authSlice.reducer
