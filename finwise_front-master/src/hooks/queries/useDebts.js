import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { debtsService } from '../../services'
import { QUERY_KEYS } from '../../constants/queryKeys'
import { normalizeDebt } from '../usePhase3Data' 

export function useDebtsQuery() {

  const { isAuthenticated, token } = useSelector((s) => s.auth)

  const query = useQuery({
    queryKey: [QUERY_KEYS.DEBTS, token],
    queryFn:  () => debtsService.getDebts({ token }),
    enabled:  isAuthenticated && !!token,
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,

    select: (res) => (Array.isArray(res?.data) ? res.data.map(normalizeDebt) : []),
  })
   
  return {
    debts:      query.data ?? [],
    isLoading:  query.isLoading,
    isFetching: query.isFetching,
    error:      query.error,
    refetch:    query.refetch,
  }
}