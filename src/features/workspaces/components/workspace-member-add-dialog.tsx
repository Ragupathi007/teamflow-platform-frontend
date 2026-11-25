import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { FormField } from '@/components/common/form-field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { applyServerErrors } from '@/lib/form-errors'
import { useAddWorkspaceMember } from '../workspace-members.hooks'
import {
  addWorkspaceMemberSchema,
  type AddWorkspaceMemberFormValues,
} from '../workspace-members.schemas'
import type { WorkspaceMember } from '../workspace-members.types'

interface WorkspaceMemberAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  canAssignAdmin: boolean
  onAdded?: (member: WorkspaceMember) => void
}

export function WorkspaceMemberAddDialog({
  open,
  onOpenChange,
  workspaceId,
  canAssignAdmin,
  onAdded,
}: WorkspaceMemberAddDialogProps) {
  const addMutation = useAddWorkspaceMember(workspaceId)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AddWorkspaceMemberFormValues>({
    resolver: zodResolver(addWorkspaceMemberSchema),
    defaultValues: {
      email: '',
      role: 'member',
    },
  })

  useEffect(() => {
    if (!open) {
      return
    }

    reset({ email: '', role: 'member' })
  }, [open, reset])

  const handleOpenChange = (nextOpen: boolean) => {
    if (addMutation.isPending) {
      return
    }

    if (!nextOpen) {
      setFormError(null)
    }

    onOpenChange(nextOpen)
  }

  const handleError = (error: unknown) => {
    const apiError = applyServerErrors<AddWorkspaceMemberFormValues>(
      error,
      setError,
    )
    const emailRejected = apiError.status === 409 || apiError.status === 404

    if (emailRejected) {
      setError('email', {
        type: 'server',
        message: apiError.message,
      })
    }

    const hasFieldError =
      emailRejected ||
      apiError.fieldErrors.some(
        (fieldError) =>
          fieldError.field === 'email' || fieldError.field === 'role',
      )

    setFormError(hasFieldError ? null : apiError.message)
    toast.error(apiError.message)
  }

  const onSubmit = handleSubmit((values) => {
    setFormError(null)

    addMutation.mutate(values, {
      onSuccess: (member) => {
        onOpenChange(false)
        onAdded?.(member)
      },
      onError: handleError,
    })
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add workspace member</DialogTitle>
          <DialogDescription>
            Add an existing TeamFlow user to this workspace by email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <FormField
            id="member-email"
            label="Email"
            error={errors.email?.message}
            hint="The user must already have a TeamFlow account."
            required
          >
            <Input
              id="member-email"
              type="email"
              autoComplete="off"
              placeholder="grace@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? 'member-email-error' : 'member-email-hint'
              }
              {...register('email')}
            />
          </FormField>

          <FormField
            id="member-role"
            label="Role"
            error={errors.role?.message}
            hint={
              canAssignAdmin
                ? 'Admins can manage workspace settings and members.'
                : 'Only the workspace owner can assign the admin role.'
            }
          >
            <select
              id="member-role"
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              aria-invalid={Boolean(errors.role)}
              {...register('role')}
            >
              <option value="member">Member</option>
              {canAssignAdmin ? (
                <option value="admin">Admin</option>
              ) : null}
            </select>
          </FormField>

          {formError ? (
            <div
              role="alert"
              className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm"
            >
              {formError}
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={addMutation.isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addMutation.isPending}>
              {addMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <UserPlus />
              )}
              Add member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
