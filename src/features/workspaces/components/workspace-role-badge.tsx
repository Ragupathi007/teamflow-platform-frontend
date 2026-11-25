import { Badge } from '@/components/ui/badge'
import type { WorkspaceRole } from '../workspaces.types'

const roleConfig = {
  owner: { label: 'Owner', variant: 'default' },
  admin: { label: 'Admin', variant: 'warning' },
  member: { label: 'Member', variant: 'secondary' },
} as const

interface WorkspaceRoleBadgeProps {
  role: WorkspaceRole
}

export function WorkspaceRoleBadge({ role }: WorkspaceRoleBadgeProps) {
  const config = roleConfig[role]

  return <Badge variant={config.variant}>{config.label}</Badge>
}
