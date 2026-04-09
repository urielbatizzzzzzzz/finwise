import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

/**
 * Wraps protected routes. If not authenticated, redirects to /login.
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
