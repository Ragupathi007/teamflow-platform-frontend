import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Plus } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toApiError } from '@/lib/api-error'
import { WorkspaceCard } from '../components/workspace-card'
import { WorkspaceDeleteDialog } from '../components/workspace-delete-dialog'
import { WorkspaceFormDialog } from '../components/workspace-form-dialog'
import { useWorkspaces } from '../workspaces.hooks'
import type { WorkspaceWithRole } from '../workspaces.types'

function WorkspaceGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-xl border p-6 shadow-sm"
        >
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="mt-4 h-5 w-40" />
          <Skeleton className="mt-2 h-4 w-24" />
          <Skeleton className="mt-5 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
        </div>
      ))}
    </div>
  )
}

export function WorkspacesPage() {
  const workspacesQuery = useWorkspaces()
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)
  const [editingWorkspace, setEditingWorkspace] =
    useState<WorkspaceWithRole | null>(null)
  const [deletingWorkspace, setDeletingWorkspace] =
    useState<WorkspaceWithRole | null>(null)

  const workspaces = workspacesQuery.data ?? []

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create and manage the spaces your team works in.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus />
          New workspace
        </Button>
      </div>

      {workspacesQuery.isLoading ? (
        <WorkspaceGridSkeleton />
      ) : workspacesQuery.isError ? (
        <ErrorState
          message={toApiError(workspacesQuery.error).message}
          onRetry={() => void workspacesQuery.refetch()}
        />
      ) : workspaces.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No workspaces yet"
          description="Create your first workspace to start organizing projects and inviting your team."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus />
              Create workspace
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              onEdit={setEditingWorkspace}
              onDelete={setDeletingWorkspace}
            />
          ))}
        </div>
      )}

      <WorkspaceFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={(workspace) => navigate(`/workspaces/${workspace.id}`)}
      />

      <WorkspaceFormDialog
        open={editingWorkspace !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingWorkspace(null)
          }
        }}
        workspace={editingWorkspace}
      />

      <WorkspaceDeleteDialog
        open={deletingWorkspace !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingWorkspace(null)
          }
        }}
        workspace={deletingWorkspace}
      />
    </main>
  )
}
