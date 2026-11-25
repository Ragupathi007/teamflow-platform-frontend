export type WorkspaceRole = 'owner' | 'admin' | 'member'

export interface Workspace {
  id: string
  name: string
  slug: string
  description: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface WorkspaceWithRole extends Workspace {
  role: WorkspaceRole
}

export interface CreateWorkspaceRequest {
  name: string
  description?: string
}

export interface UpdateWorkspaceRequest {
  name?: string
  description?: string | null
}
