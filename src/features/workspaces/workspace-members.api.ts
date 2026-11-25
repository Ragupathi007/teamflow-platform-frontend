import { api } from '@/lib/axios'
import type {
  ApiMessageResponse,
  ApiSuccessResponse,
} from '@/types/api'
import type {
  AddWorkspaceMemberRequest,
  UpdateWorkspaceMemberRequest,
  WorkspaceMember,
} from './workspace-members.types'

export async function getWorkspaceMembersRequest(
  workspaceId: string,
): Promise<WorkspaceMember[]> {
  const { data } = await api.get<ApiSuccessResponse<WorkspaceMember[]>>(
    `/workspaces/${workspaceId}/members`,
  )

  return data.data
}

export async function getWorkspaceMemberRequest(
  workspaceId: string,
  memberId: string,
): Promise<WorkspaceMember> {
  const { data } = await api.get<ApiSuccessResponse<WorkspaceMember>>(
    `/workspaces/${workspaceId}/members/${memberId}`,
  )

  return data.data
}

export async function addWorkspaceMemberRequest(
  workspaceId: string,
  payload: AddWorkspaceMemberRequest,
): Promise<WorkspaceMember> {
  const { data } = await api.post<ApiSuccessResponse<WorkspaceMember>>(
    `/workspaces/${workspaceId}/members`,
    payload,
  )

  return data.data
}

export async function updateWorkspaceMemberRequest(
  workspaceId: string,
  memberId: string,
  payload: UpdateWorkspaceMemberRequest,
): Promise<WorkspaceMember> {
  const { data } = await api.patch<ApiSuccessResponse<WorkspaceMember>>(
    `/workspaces/${workspaceId}/members/${memberId}`,
    payload,
  )

  return data.data
}

export async function removeWorkspaceMemberRequest(
  workspaceId: string,
  memberId: string,
): Promise<ApiMessageResponse> {
  const { data } = await api.delete<ApiMessageResponse>(
    `/workspaces/${workspaceId}/members/${memberId}`,
  )

  return data
}
