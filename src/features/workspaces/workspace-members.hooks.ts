import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/query-keys'
import {
  addWorkspaceMemberRequest,
  getWorkspaceMemberRequest,
  getWorkspaceMembersRequest,
  removeWorkspaceMemberRequest,
  updateWorkspaceMemberRequest,
} from './workspace-members.api'
import type {
  AddWorkspaceMemberRequest,
  UpdateWorkspaceMemberRequest,
} from './workspace-members.types'

export function useWorkspaceMembers(workspaceId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.workspaceMembers(workspaceId ?? ''),
    queryFn: () => {
      if (!workspaceId) {
        throw new Error('Workspace ID is required')
      }

      return getWorkspaceMembersRequest(workspaceId)
    },
    enabled: Boolean(workspaceId),
    retry: false,
    staleTime: 60_000,
  })
}

export function useWorkspaceMember(
  workspaceId: string | undefined,
  memberId: string | undefined,
) {
  return useQuery({
    queryKey: queryKeys.workspaceMember(workspaceId ?? '', memberId ?? ''),
    queryFn: () => {
      if (!workspaceId || !memberId) {
        throw new Error('Workspace and member IDs are required')
      }

      return getWorkspaceMemberRequest(workspaceId, memberId)
    },
    enabled: Boolean(workspaceId && memberId),
    retry: false,
    staleTime: 60_000,
  })
}

export function useAddWorkspaceMember(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddWorkspaceMemberRequest) =>
      addWorkspaceMemberRequest(workspaceId, payload),
    onSuccess: (member) => {
      queryClient.setQueryData(
        queryKeys.workspaceMember(workspaceId, member.id),
        member,
      )
      void queryClient.invalidateQueries({
        queryKey: queryKeys.workspaceMembers(workspaceId),
      })
      toast.success('Workspace member added successfully')
    },
  })
}

export function useUpdateWorkspaceMember(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      memberId,
      payload,
    }: {
      memberId: string
      payload: UpdateWorkspaceMemberRequest
    }) => updateWorkspaceMemberRequest(workspaceId, memberId, payload),
    onSuccess: (member) => {
      queryClient.setQueryData(
        queryKeys.workspaceMember(workspaceId, member.id),
        member,
      )
      void queryClient.invalidateQueries({
        queryKey: queryKeys.workspaceMembers(workspaceId),
      })
      toast.success('Workspace member role updated successfully')
    },
  })
}

export function useRemoveWorkspaceMember(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (memberId: string) =>
      removeWorkspaceMemberRequest(workspaceId, memberId),
    onSuccess: (_data, memberId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.workspaceMember(workspaceId, memberId),
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.workspaceMembers(workspaceId),
      })
      toast.success('Workspace member removed successfully')
    },
  })
}
