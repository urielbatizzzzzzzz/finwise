import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { liquidityService } from '../../services'
import { QUERY_KEYS } from '../../constants/queryKeys'

export function useLiquidity() {
  const { isAuthenticated, token } = useSelector((s) => s.auth)

  const query = useQuery({
    queryKey: [QUERY_KEYS.LIQUIDITY, token],
    queryFn:  () => liquidityService.getProjection({ token }),
    enabled:  isAuthenticated && !!token,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const dashboardData = query.data?.data
  const cashflow = dashboardData?.cashflow

  return {

    data:                  query.data ?? null, 
    
    totalIncome:           cashflow?.totalIncome ?? 0,
    fixedExpenses:         cashflow?.recurringExpenses ?? 0, // Antes fixedExpenses
    discretionaryExpenses: cashflow?.discretionaryExpenses ?? 0,
    projectedBalance:      cashflow?.projected30d ?? 0,      // Antes projectedBalance

    availableBalance:      cashflow?.availableBalance ?? 0,  
    savingsRate:           cashflow?.savingsRate ?? 0,       

    transactions:          dashboardData?.recentTransactions ?? [],

    isLoading:             query.isLoading,
    isFetching:            query.isFetching,
    error:                 query.error,
    refetch:               query.refetch,
  }
}
