import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock3,
  Hash,
  Pencil,
  ShieldCheck,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { ErrorState } from '@/components/feedback/error-state'
import { LoadingState } from '@/components/feedback/loading-state'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toApiError } from '@/lib/api-error'
import { WorkspaceDeleteDialog } from '../components/workspace-delete-dialog'
import { WorkspaceFormDialog } from '../components/workspace-form-dialog'
import { WorkspaceRoleBadge } from '../components/workspace-role-badge'
import { useWorkspace, useWorkspaces } from '../workspaces.hooks'

interface DetailRowProps {
  icon: LucideIcon
  label: string
  children: ReactNode
}

function DetailRow({ icon: Icon, label, children }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground flex items-center gap-2">
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        {label}
      </span>
      <span className="text-right font-medium">{children}</span>
    </div>
  )
}

export function WorkspaceDetailPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const workspaceQuery = useWorkspace(workspaceId)
  const workspacesQuery = useWorkspaces()
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const workspace = workspaceQuery.data
  const membership = workspacesQuery.data?.find(
    (item) => item.id === workspaceId,
  )
  const role = membership?.role
  const canEdit = role === 'owner' || role === 'admin'
  const canDelete = role === 'owner'

  const backLink = (
    <Button asChild variant="ghost" size="sm" className="-ml-2 mb-3">
      <Link to="/workspaces">
        <ArrowLeft />
        Workspaces
      </Link>
    </Button>
  )

  if (!workspaceId) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {backLink}
        <ErrorState message="Workspace not found." />
      </main>
    )
  }

  if (workspaceQuery.isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {backLink}
        <LoadingState label="Loading workspace..." />
      </main>
    )
  }

  if (workspaceQuery.isError || !workspace) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {backLink}
        <ErrorState
          message={
            workspaceQuery.isError
              ? toApiError(workspaceQuery.error).message
              : 'Workspace not found.'
          }
          onRetry={() => void workspaceQuery.refetch()}
        />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {backLink}

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-xl">
            <Building2 className="size-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {workspace.name}
              </h1>
              {role ? <WorkspaceRoleBadge role={role} /> : null}
            </div>
            <p className="text-muted-foreground mt-1 font-mono text-xs">
              /{workspace.slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canEdit ? (
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil />
              Edit
            </Button>
          ) : null}
          {canDelete ? (
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 />
              Delete
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader>
            <CardTitle>About this workspace</CardTitle>
            <CardDescription>
              A shared space for your team&apos;s projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p
              className={
                workspace.description
                  ? 'text-sm leading-relaxed whitespace-pre-line'
                  : 'text-muted-foreground text-sm italic'
              }
            >
              {workspace.description || 'No description provided.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Workspace details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <DetailRow icon={Hash} label="Slug">
              <span className="font-mono text-xs">/{workspace.slug}</span>
            </DetailRow>
            <Separator />
            <DetailRow icon={ShieldCheck} label="Your role">
              {role ? (
                <WorkspaceRoleBadge role={role} />
              ) : (
                <span className="text-muted-foreground">Unavailable</span>
              )}
            </DetailRow>
            <Separator />
            <DetailRow icon={CalendarDays} label="Created">
              {format(new Date(workspace.createdAt), 'MMM d, yyyy')}
            </DetailRow>
            <Separator />
            <DetailRow icon={Clock3} label="Last updated">
              {format(new Date(workspace.updatedAt), 'MMM d, yyyy')}
            </DetailRow>
          </CardContent>
        </Card>
      </div>

      <WorkspaceFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        workspace={workspace}
      />

      <WorkspaceDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        workspace={workspace}
        onDeleted={() => navigate('/workspaces', { replace: true })}
      />
    </main>
  )
}
