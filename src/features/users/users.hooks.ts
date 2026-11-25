import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/query-keys'
import { getUserByIdRequest, updateCurrentUserRequest } from './users.api'
import type { UpdateUserRequest } from './users.types'

export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.user(userId ?? ''),
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is required')
      }

      return getUserByIdRequest(userId)
    },
    enabled: Boolean(userId),
    retry: false,
    staleTime: 60_000,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateUserRequest) =>
      updateCurrentUserRequest(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.currentUser, updated)
      queryClient.setQueryData(queryKeys.user(updated.id), updated)

      void queryClient.invalidateQueries({ queryKey: queryKeys.currentUser })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.user(updated.id),
      })

      toast.success('Profile updated successfully')
    },
  })
}
