export const queryKeys = {
  currentUser: ['currentUser'] as const,
  users: ['users'] as const,
  user: (userId: string) => ['user', userId] as const,
  workspaces: ['workspaces'] as const,
  workspace: (workspaceId: string) => ['workspace', workspaceId] as const,
} as const
