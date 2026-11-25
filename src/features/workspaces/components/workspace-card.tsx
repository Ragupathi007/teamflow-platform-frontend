import { formatDistanceToNow } from 'date-fns'
import { Building2, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WorkspaceRoleBadge } from './workspace-role-badge'
import type { WorkspaceWithRole } from '../workspaces.types'

interface WorkspaceCardProps {
  workspace: WorkspaceWithRole
  onEdit: (workspace: WorkspaceWithRole) => void
  onDelete: (workspace: WorkspaceWithRole) => void
}

export function WorkspaceCard({
  workspace,
  onEdit,
  onDelete,
}: WorkspaceCardProps) {
  const canEdit = workspace.role === 'owner' || workspace.role === 'admin'
  const canDelete = workspace.role === 'owner'

  return (
    <Card className="group hover:border-primary/30 relative transition-all hover:shadow-md">
      <Link
        to={`/workspaces/${workspace.id}`}
        className="focus-visible:ring-ring absolute inset-0 z-0 rounded-xl focus-visible:ring-2 focus-visible:outline-none"
        aria-label={`Open ${workspace.name}`}
      />

      <CardHeader className="pointer-events-none relative z-10 pr-14">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
            <Building2 className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">
              {workspace.name}
            </CardTitle>
            <CardDescription className="truncate font-mono text-xs">
              /{workspace.slug}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pointer-events-none relative z-10 flex flex-1 flex-col">
        <p className="text-muted-foreground line-clamp-2 min-h-10 text-sm">
          {workspace.description || 'No description provided.'}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <WorkspaceRoleBadge role={workspace.role} />
          <span className="text-muted-foreground truncate text-xs">
            Updated{' '}
            {formatDistanceToNow(new Date(workspace.updatedAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </CardContent>

      {canEdit || canDelete ? (
        <div className="absolute top-4 right-4 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="bg-card/80 backdrop-blur"
                aria-label={`Actions for ${workspace.name}`}
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit ? (
                <DropdownMenuItem onSelect={() => onEdit(workspace)}>
                  <Pencil />
                  Edit workspace
                </DropdownMenuItem>
              ) : null}
              {canDelete ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => onDelete(workspace)}
                  >
                    <Trash2 />
                    Delete workspace
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}
    </Card>
  )
}
