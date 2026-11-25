export type WorkspaceMemberRole = 'owner' | 'admin' | 'member'
export type AssignableWorkspaceMemberRole = Exclude<
  WorkspaceMemberRole,
  'owner'
>

export interface WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  name: string
  email: string
  role: WorkspaceMemberRole
  joinedAt: string
}

export interface AddWorkspaceMemberRequest {
  email: string
  role: AssignableWorkspaceMemberRole
}

export interface UpdateWorkspaceMemberRequest {
  role: AssignableWorkspaceMemberRole
}
