import { useState } from 'react'
import { format } from 'date-fns'
import {
  MoreHorizontal,
  ShieldCheck,
  Trash2,
  UserPlus,
  UserRound,
} from 'lucide-react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { Skeleton } from '@/components/ui/skeleton'
import { toApiError } from '@/lib/api-error'
import { getInitials } from '@/lib/initials'
import { useUpdateWorkspaceMember, useWorkspaceMembers } from '../workspace-members.hooks'
import type { AssignableWorkspaceMemberRole, WorkspaceMember } from '../workspace-members.types'
import type { WorkspaceRole } from '../workspaces.types'
import { WorkspaceMemberAddDialog } from './workspace-member-add-dialog'
import { WorkspaceMemberRemoveDialog } from './workspace-member-remove-dialog'
import { WorkspaceRoleBadge } from './workspace-role-badge'

interface WorkspaceMembersCardProps {
  workspaceId: string
  currentUserRole?: WorkspaceRole
  currentUserId?: string
}

export function WorkspaceMembersCard({
  workspaceId,
  currentUserRole,
  currentUserId,
}: WorkspaceMembersCardProps) {
  const membersQuery = useWorkspaceMembers(workspaceId)
  const updateMutation = useUpdateWorkspaceMember(workspaceId)
  const [addOpen, setAddOpen] = useState(false)
  const [removingMember, setRemovingMember] =
    useState<WorkspaceMember | null>(null)

  const canAdd = currentUserRole === 'owner' || currentUserRole === 'admin'
  const canAssignAdmin = currentUserRole === 'owner'
  const canChangeRole = currentUserRole === 'owner'
  const canRemove = currentUserRole === 'owner' || currentUserRole === 'admin'
  const members = membersQuery.data ?? []

  const handleRoleChange = (
    member: WorkspaceMember,
    role: AssignableWorkspaceMemberRole,
  ) => {
    updateMutation.mutate(
      {
        memberId: member.id,
        payload: { role },
      },
      {
        onError: (error) => toast.error(toApiError(error).message),
      },
    )
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              People who can access this workspace.
            </CardDescription>
          </div>
          {canAdd ? (
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <UserPlus />
              Add member
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {membersQuery.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
              </div>
            ))}
          </div>
        ) : membersQuery.isError ? (
          <ErrorState
            message={toApiError(membersQuery.error).message}
            onRetry={() => void membersQuery.refetch()}
          />
        ) : members.length === 0 ? (
          <EmptyState
            icon={UserRound}
            title="No members yet"
            description="Members will appear here once they are added to this workspace."
          />
        ) : (
          <div className="divide-border divide-y rounded-lg border">
            {members.map((member) => {
              const isSelf = member.userId === currentUserId
              const isOwner = member.role === 'owner'
              const canPromote = canChangeRole && member.role !== 'admin'
              const canDemote = canChangeRole && member.role !== 'member'
              const canRemoveMember =
                canRemove &&
                (currentUserRole === 'owner' || member.role === 'member')
              const hasActions =
                !isSelf &&
                !isOwner &&
                (canPromote || canDemote || canRemoveMember)

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-9 shrink-0">
                      <AvatarFallback>
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {member.name}
                        {isSelf ? (
                          <span className="text-muted-foreground font-normal">
                            {' '}
                            (you)
                          </span>
                        ) : null}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-muted-foreground hidden text-xs lg:inline">
                      Joined {format(new Date(member.joinedAt), 'MMM d, yyyy')}
                    </span>
                    <WorkspaceRoleBadge role={member.role} />

                    {hasActions ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Actions for ${member.name}`}
                          >
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canPromote ? (
                            <DropdownMenuItem
                              disabled={updateMutation.isPending}
                              onSelect={() => handleRoleChange(member, 'admin')}
                            >
                              <ShieldCheck />
                              Make admin
                            </DropdownMenuItem>
                          ) : null}
                          {canDemote ? (
                            <DropdownMenuItem
                              disabled={updateMutation.isPending}
                              onSelect={() => handleRoleChange(member, 'member')}
                            >
                              <UserRound />
                              Make member
                            </DropdownMenuItem>
                          ) : null}
                          {canRemoveMember ? (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => setRemovingMember(member)}
                              >
                                <Trash2 />
                                Remove member
                              </DropdownMenuItem>
                            </>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>

      <WorkspaceMemberAddDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        workspaceId={workspaceId}
        canAssignAdmin={canAssignAdmin}
      />

      <WorkspaceMemberRemoveDialog
        open={removingMember !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRemovingMember(null)
          }
        }}
        workspaceId={workspaceId}
        member={removingMember}
      />
    </Card>
  )
}
