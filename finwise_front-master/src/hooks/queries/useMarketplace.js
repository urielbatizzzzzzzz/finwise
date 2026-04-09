import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { marketplaceService } from '../../services'
import { QUERY_KEYS } from '../../constants/queryKeys'

export function useMarketplaceProducts() {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)
  const score           = useSelector((s) => s.user.score)

  const query = useQuery({
    queryKey: QUERY_KEYS.MARKETPLACE,
    queryFn:  marketplaceService.getProducts,
    enabled:  isAuthenticated && score !== null && score >= 40,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  })

  return {
    products:   query.data?.products ?? query.data ?? [],
    isLoading:  query.isLoading,
    isFetching: query.isFetching,
    error:      query.error,
    refetch:    query.refetch,
  }
}

export function useAcceptOffer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: marketplaceService.acceptOffer,
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MARKETPLACE })
    },
  })
}
