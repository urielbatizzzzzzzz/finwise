import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { goalsService } from '../../services'
import { QUERY_KEYS } from '../../constants/queryKeys'
import { normalizeGoal } from '../usePhase3Data' // Asumo que esta función existe y es correcta

/**
 * useGoalsQuery
 */
export function useGoalsQuery() {
  const { isAuthenticated, token } = useSelector((s) => s.auth)

  const query = useQuery({
    queryKey: [QUERY_KEYS.GOALS, token],
    queryFn:  () => goalsService.getGoals({ token }),
    enabled:  isAuthenticated && !!token,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    select: (res) => (Array.isArray(res?.data) ? res.data.map(normalizeGoal) : []),
  })

  return {
    goals:      query.data ?? [],
    isLoading:  query.isLoading,
    isFetching: query.isFetching,
    error:      query.error,
    refetch:    query.refetch,
  }
}


export function useCreateGoal() {
  const queryClient = useQueryClient()
  const { token } = useSelector((s) => s.auth)

  return useMutation({

    mutationFn: (goalData) => goalsService.createGoal({ token, goalData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GOALS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  const { token } = useSelector((s) => s.auth)

  return useMutation({
    mutationFn: (goalId) => goalsService.deleteGoal({ token, goalId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GOALS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] })
    },
  })
}