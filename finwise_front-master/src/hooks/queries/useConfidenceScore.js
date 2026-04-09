import { useSelector } from 'react-redux'

/**
 * useConfidenceScore
 *
 * El score llega dentro del GET /dashboard (campo data.score.confidenceScore).
 * useDashboardData se encarga de sincronizarlo a Redux (state.user.score)
 * y guardar el snapshot histórico.
 *
 * Este hook es un simple selector sobre Redux, sin petición HTTP propia.
 */
export function useConfidenceScore() {
  const score = useSelector((s) => s.user.score)

  return {
    score,
    isLoading:  false,
    isFetching: false,
    error:      null,
  }
}
