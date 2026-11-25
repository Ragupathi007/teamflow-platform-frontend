import type { UpdatedUserProfile, UserProfile } from '@/types/user'

export type { UpdatedUserProfile, UserProfile }

export interface UpdateUserRequest {
  name?: string
  email?: string
}
