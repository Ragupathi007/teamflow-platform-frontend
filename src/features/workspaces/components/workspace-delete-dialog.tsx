import { toast } from 'sonner'
import { ConfirmDeleteDialog } from '@/components/common/confirm-delete-dialog'
import { toApiError } from '@/lib/api-error'
import { useDeleteWorkspace } from '../workspaces.hooks'
import type { Workspace } from '../workspaces.types'

interface WorkspaceDeleteDialogProps {
  workspace: Workspace | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}

export function WorkspaceDeleteDialog({
  workspace,
  open,
  onOpenChange,
  onDeleted,
}: WorkspaceDeleteDialogProps) {
  const deleteMutation = useDeleteWorkspace()

  const handleConfirm = () => {
    if (!workspace) {
      return
    }

    deleteMutation.mutate(workspace.id, {
      onSuccess: () => {
        onOpenChange(false)
        onDeleted?.()
      },
      onError: (error) => {
        toast.error(toApiError(error).message)
      },
    })
  }

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!deleteMutation.isPending) {
          onOpenChange(nextOpen)
        }
      }}
      title={`Delete ${workspace?.name ?? 'workspace'}?`}
      description={
        <>
          This permanently deletes the workspace, including its projects and
          members. This action cannot be undone.
        </>
      }
      confirmLabel="Delete workspace"
      isPending={deleteMutation.isPending}
      onConfirm={handleConfirm}
    />
  )
}
