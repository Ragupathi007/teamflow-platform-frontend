import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Save } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { applyServerErrors } from '@/lib/form-errors'
import { useCreateWorkspace, useUpdateWorkspace } from '../workspaces.hooks'
import {
  workspaceFormSchema,
  type WorkspaceFormValues,
} from '../workspaces.schemas'
import type { Workspace } from '../workspaces.types'

interface WorkspaceFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace?: Workspace | null
  onSaved?: (workspace: Workspace) => void
}

export function WorkspaceFormDialog({
  open,
  onOpenChange,
  workspace,
  onSaved,
}: WorkspaceFormDialogProps) {
  const isEdit = Boolean(workspace)
  const createMutation = useCreateWorkspace()
  const updateMutation = useUpdateWorkspace(workspace?.id ?? '')
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const isPending = isEdit
    ? updateMutation.isPending
    : createMutation.isPending

  useEffect(() => {
    if (!open) {
      return
    }

    reset({
      name: workspace?.name ?? '',
      description: workspace?.description ?? '',
    })
  }, [open, workspace, reset])

  const handleOpenChange = (nextOpen: boolean) => {
    if (isPending) {
      return
    }

    if (!nextOpen) {
      setFormError(null)
    }

    onOpenChange(nextOpen)
  }

  const handleError = (error: unknown) => {
    const apiError = applyServerErrors<WorkspaceFormValues>(error, setError)
    const nameConflict = apiError.status === 409

    if (nameConflict) {
      setError('name', {
        type: 'server',
        message: apiError.message,
      })
    }

    const hasFieldError =
      nameConflict ||
      apiError.fieldErrors.some(
        (fieldError) =>
          fieldError.field === 'name' ||
          fieldError.field === 'description',
      )

    setFormError(hasFieldError ? null : apiError.message)
    toast.error(apiError.message)
  }

  const onSubmit = handleSubmit((values) => {
    setFormError(null)

    const name = values.name.trim()
    const description = values.description.trim()

    if (workspace) {
      updateMutation.mutate(
        {
          name,
          description: description || null,
        },
        {
          onSuccess: (updated) => {
            onOpenChange(false)
            onSaved?.(updated)
          },
          onError: handleError,
        },
      )
      return
    }

    createMutation.mutate(
      {
        name,
        description: description || undefined,
      },
      {
        onSuccess: (created) => {
          onOpenChange(false)
          onSaved?.(created)
        },
        onError: handleError,
      },
    )
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit workspace' : 'Create workspace'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the workspace name and description.'
              : 'Set up a shared space for your team and its projects.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <FormField
            id="workspace-name"
            label="Name"
            error={errors.name?.message}
            required
          >
            <Input
              id="workspace-name"
              type="text"
              autoComplete="off"
              placeholder="Engineering Team"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? 'workspace-name-error' : undefined
              }
              {...register('name')}
            />
          </FormField>

          <FormField
            id="workspace-description"
            label="Description"
            error={errors.description?.message}
            hint="Optional. Max 1000 characters."
          >
            <Textarea
              id="workspace-description"
              rows={4}
              placeholder="What is this workspace for?"
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description
                  ? 'workspace-description-error'
                  : 'workspace-description-hint'
              }
              {...register('description')}
            />
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
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || (isEdit && !isDirty)}
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : isEdit ? (
                <Save />
              ) : (
                <Plus />
              )}
              {isEdit ? 'Save changes' : 'Create workspace'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
