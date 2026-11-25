import { api } from '@/lib/axios'
import type {
  ApiMessageResponse,
  ApiSuccessResponse,
} from '@/types/api'
import type {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  Workspace,
  WorkspaceWithRole,
} from './workspaces.types'

export async function getWorkspacesRequest(): Promise<WorkspaceWithRole[]> {
  const { data } = await api.get<ApiSuccessResponse<WorkspaceWithRole[]>>(
    '/workspaces',
  )

  return data.data
}

export async function getWorkspaceRequest(
  workspaceId: string,
): Promise<Workspace> {
  const { data } = await api.get<ApiSuccessResponse<Workspace>>(
    `/workspaces/${workspaceId}`,
  )

  return data.data
}

export async function createWorkspaceRequest(
  payload: CreateWorkspaceRequest,
): Promise<Workspace> {
  const { data } = await api.post<ApiSuccessResponse<Workspace>>(
    '/workspaces',
    payload,
  )

  return data.data
}

export async function updateWorkspaceRequest(
  workspaceId: string,
  payload: UpdateWorkspaceRequest,
): Promise<Workspace> {
  const { data } = await api.patch<ApiSuccessResponse<Workspace>>(
    `/workspaces/${workspaceId}`,
    payload,
  )

  return data.data
}

export async function deleteWorkspaceRequest(
  workspaceId: string,
): Promise<ApiMessageResponse> {
  const { data } = await api.delete<ApiMessageResponse>(
    `/workspaces/${workspaceId}`,
  )

  return data
}
