import api from './axios'

export function setupInterceptors() {
  // ─── Request: Attach Bearer token ────────────────────────
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('finwise_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // ─── Response: Handle 401 Unauthorized ───────────────────
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('finwise_token')
        localStorage.removeItem('finwise_user')
        if (
          !window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register')
        ) {
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    }
  )
}
