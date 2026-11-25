import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/query-keys'
import {
  createWorkspaceRequest,
  deleteWorkspaceRequest,
  getWorkspaceRequest,
  getWorkspacesRequest,
  updateWorkspaceRequest,
} from './workspaces.api'
import type {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from './workspaces.types'

export function useWorkspaces() {
  return useQuery({
    queryKey: queryKeys.workspaces,
    queryFn: getWorkspacesRequest,
    staleTime: 60_000,
  })
}

export function useWorkspace(workspaceId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.workspace(workspaceId ?? ''),
    queryFn: () => {
      if (!workspaceId) {
        throw new Error('Workspace ID is required')
      }

      return getWorkspaceRequest(workspaceId)
    },
    enabled: Boolean(workspaceId),
    retry: false,
    staleTime: 60_000,
  })
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkspaceRequest) =>
      createWorkspaceRequest(payload),
    onSuccess: (workspace) => {
      queryClient.setQueryData(queryKeys.workspace(workspace.id), workspace)
      void queryClient.invalidateQueries({ queryKey: queryKeys.workspaces })
      toast.success('Workspace created successfully')
    },
  })
}

export function useUpdateWorkspace(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateWorkspaceRequest) =>
      updateWorkspaceRequest(workspaceId, payload),
    onSuccess: (workspace) => {
      queryClient.setQueryData(queryKeys.workspace(workspace.id), workspace)
      void queryClient.invalidateQueries({ queryKey: queryKeys.workspaces })
      toast.success('Workspace updated successfully')
    },
  })
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workspaceId: string) => deleteWorkspaceRequest(workspaceId),
    onSuccess: (_data, workspaceId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.workspace(workspaceId),
      })
      void queryClient.invalidateQueries({ queryKey: queryKeys.workspaces })
      toast.success('Workspace deleted successfully')
    },
  })
}
