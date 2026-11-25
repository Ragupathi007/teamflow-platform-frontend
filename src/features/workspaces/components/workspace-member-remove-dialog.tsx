import { toast } from 'sonner'
import { ConfirmDeleteDialog } from '@/components/common/confirm-delete-dialog'
import { toApiError } from '@/lib/api-error'
import { useRemoveWorkspaceMember } from '../workspace-members.hooks'
import type { WorkspaceMember } from '../workspace-members.types'

interface WorkspaceMemberRemoveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  member: WorkspaceMember | null
  onRemoved?: () => void
}

export function WorkspaceMemberRemoveDialog({
  open,
  onOpenChange,
  workspaceId,
  member,
  onRemoved,
}: WorkspaceMemberRemoveDialogProps) {
  const removeMutation = useRemoveWorkspaceMember(workspaceId)

  const handleConfirm = () => {
    if (!member) {
      return
    }

    removeMutation.mutate(member.id, {
      onSuccess: () => {
        onOpenChange(false)
        onRemoved?.()
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
        if (!removeMutation.isPending) {
          onOpenChange(nextOpen)
        }
      }}
      title={`Remove ${member?.name ?? 'member'}?`}
      description="They will lose access to this workspace immediately. Their user account is not deleted."
      confirmLabel="Remove member"
      isPending={removeMutation.isPending}
      onConfirm={handleConfirm}
    />
  )
}
