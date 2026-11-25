export const queryKeys = {
  currentUser: ['currentUser'] as const,
  users: ['users'] as const,
  user: (userId: string) => ['user', userId] as const,
  workspaces: ['workspaces'] as const,
  workspace: (workspaceId: string) => ['workspace', workspaceId] as const,
  workspaceMembers: (workspaceId: string) =>
    ['workspace-members', workspaceId] as const,
  workspaceMember: (workspaceId: string, memberId: string) =>
    ['workspace-member', workspaceId, memberId] as const,
} as const
