import type { SessionUser, UserProfile } from '@/types/user'

export type { SessionUser, UserProfile }

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginData {
  token: string
  user: SessionUser
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export type RegisterData = UserProfile
