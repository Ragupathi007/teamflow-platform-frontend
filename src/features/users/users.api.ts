import { api } from '@/lib/axios'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  UpdatedUserProfile,
  UpdateUserRequest,
  UserProfile,
} from './users.types'

export async function getUserByIdRequest(
  userId: string,
): Promise<UserProfile> {
  const { data } = await api.get<ApiSuccessResponse<UserProfile>>(
    `/users/${userId}`,
  )

  return data.data
}

export async function updateCurrentUserRequest(
  payload: UpdateUserRequest,
): Promise<UpdatedUserProfile> {
  const { data } = await api.patch<ApiSuccessResponse<UpdatedUserProfile>>(
    '/users/me',
    payload,
  )

  return data.data
}
