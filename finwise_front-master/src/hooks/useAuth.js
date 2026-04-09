import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services'
import { setCredentials, setAuthError, setLoading, logout as logoutAction } from '../store/slices/authSlice'
import { setUserProfile, clearUser } from '../store/slices/userSlice'

/* ─── Login ──────────────────────────────────────────── */
export function useLogin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials) => {
      dispatch(setLoading(true))
      return authService.login(credentials)
    },
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.data.token }))

      dispatch(setUserProfile({
        email: data.data.email || '',
        profile: {
          name: data.data.name || '',
          userId: data.data.userId || ''
        }
      }))
      navigate('/dashboard')
    },
    onError: (error) => {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error   ||
        'Credenciales inválidas. Intenta de nuevo.'
      dispatch(setAuthError(msg))
    },
  })
}

/* ─── Register ───────────────────────────────────────── */
export function useRegister() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (payload) => {
      dispatch(setLoading(true))
      return authService.register(payload)
    },
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.data.token }))
      dispatch(setUserProfile({ 
        email: data.data.email || '',
        profile: {
          name: data.data.name || '',
          userId: data.data.userId || ''
        }
      }))
      navigate('/dashboard')
    },
    onError: (error) => {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error   ||
        'Error al registrar. Intenta de nuevo.'
      dispatch(setAuthError(msg))
    },
  })
}

/* ─── Logout ─────────────────────────────────────────── */
export function useLogout() {
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const queryClient = useQueryClient()

  return () => {
    dispatch(logoutAction())
    dispatch(clearUser())
    queryClient.clear()
    navigate('/login')
  }
}
