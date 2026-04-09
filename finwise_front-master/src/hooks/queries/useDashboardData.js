import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { dashboardService } from '../../services'
import { setScore, recordScoreSnapshot, setNesiSynced } from '../../store/slices/userSlice'
import { normalizeDebt, normalizeGoal, normalizeTransaction } from '../usePhase3Data'
import { QUERY_KEYS } from '../../constants/queryKeys'
import { usePhase3 } from '../usePhase3Data'


export function useDashboardData() {
  const dispatch        = useDispatch()
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)

  let phase3Actions = null
  try {
    const { actions } = usePhase3()
    phase3Actions = actions
  } catch {
  }

  const query = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn:  ({ signal }) => dashboardService.getDashboard({ token: useSelector((s) => s.auth.token), signal }),
    enabled:  isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 min antes de considerarse stale
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (!query.data?.data) return
    const payload = query.data.data

    // 1. Sincronizar score a Redux
    const scoreObj = payload.score
    if (scoreObj?.confidenceScore !== undefined) {
      const score = scoreObj.confidenceScore
      dispatch(setScore(score))
      dispatch(recordScoreSnapshot({
        score,
        level: scoreObj.riskTier ?? null,
      }))
    }

    // 2. Marcar como sincronizado con NESI si hay cuentas
    if (payload.accounts?.length > 0) {
      dispatch(setNesiSynced(true))
    }   
  }, [query.data, dispatch, phase3Actions])

  return {
    isLoading:  query.isLoading,
    isFetching: query.isFetching,
    error:      query.error,
    refetch:    query.refetch,
    data:       query.data?.data ?? null,
  }
}
