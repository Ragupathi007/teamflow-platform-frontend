export interface SessionUser {
  id: string
  name: string
  email: string
}

export interface UserProfile extends SessionUser {
  createdAt: string
}

export interface UpdatedUserProfile extends UserProfile {
  updatedAt: string
}
