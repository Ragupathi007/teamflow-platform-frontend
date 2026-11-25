import { api } from '@/lib/axios'
import type { ApiMessageResponse, ApiSuccessResponse } from '@/types/api'
import type {
  LoginData,
  LoginRequest,
  RegisterData,
  RegisterRequest,
  UserProfile,
} from './auth.types'

export async function loginRequest(payload: LoginRequest): Promise<LoginData> {
  const { data } = await api.post<ApiSuccessResponse<LoginData>>(
    '/auth/login',
    payload,
  )

  return data.data
}

export async function registerRequest(
  payload: RegisterRequest,
): Promise<RegisterData> {
  const { data } = await api.post<ApiSuccessResponse<RegisterData>>(
    '/auth/register',
    payload,
  )

  return data.data
}

export async function getCurrentUserRequest(): Promise<UserProfile> {
  const { data } = await api.get<ApiSuccessResponse<UserProfile>>('/auth/me')

  return data.data
}

export async function logoutRequest(): Promise<ApiMessageResponse> {
  const { data } = await api.post<ApiMessageResponse>('/auth/logout')

  return data
}
