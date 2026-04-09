import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { nesiService } from '../../services'
import { setNesiSynced } from '../../store/slices/userSlice'
import { QUERY_KEYS } from '../../constants/queryKeys'

/**
 * Hook to trigger NESI bank sync.
 * POST /nesi/sync — on success, invalidates score, liquidity, and marketplace.
 */
export function useNesiSync() {
  const dispatch    = useDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: nesiService.sync,
    onSuccess:  () => {
      dispatch(setNesiSynced(true))
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONFIDENCE_SCORE })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIQUIDITY })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MARKETPLACE })
    },
  })
}
