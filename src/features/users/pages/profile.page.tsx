import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import {
  CalendarDays,
  Loader2,
  Mail,
  Save,
  UserRound,
} from 'lucide-react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/common/empty-state'
import { FormField } from '@/components/common/form-field'
import { ErrorState } from '@/components/feedback/error-state'
import { LoadingState } from '@/components/feedback/loading-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useCurrentUser } from '@/features/auth/auth.hooks'
import { toApiError } from '@/lib/api-error'
import { applyServerErrors } from '@/lib/form-errors'
import { getInitials } from '@/lib/initials'
import { useUpdateProfile, useUser } from '../users.hooks'
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from '../users.schemas'

export function ProfilePage() {
  const { data: currentUser } = useCurrentUser()
  const userQuery = useUser(currentUser?.id)
  const profile = userQuery.data
  const updateMutation = useUpdateProfile()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  useEffect(() => {
    if (!profile) {
      return
    }

    reset({
      name: profile.name,
      email: profile.email,
    })
  }, [profile, reset])

  const onSubmit = handleSubmit((values) => {
    setFormError(null)

    updateMutation.mutate(values, {
      onSuccess: (updated) => {
        reset({
          name: updated.name,
          email: updated.email,
        })
      },
      onError: (error) => {
        const apiError = applyServerErrors<UpdateProfileFormValues>(
          error,
          setError,
        )
        const emailConflict = apiError.status === 409

        if (emailConflict) {
          setError('email', {
            type: 'server',
            message: apiError.message,
          })
        }

        const hasFieldError =
          emailConflict ||
          apiError.fieldErrors.some(
            (fieldError) =>
              fieldError.field === 'name' || fieldError.field === 'email',
          )

        setFormError(hasFieldError ? null : apiError.message)
        toast.error(apiError.message)
      },
    })
  })

  if (!currentUser || userQuery.isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <LoadingState label="Loading profile..." />
      </main>
    )
  }

  if (userQuery.isError) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ErrorState
          message={toApiError(userQuery.error).message}
          onRetry={() => void userQuery.refetch()}
        />
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <EmptyState
          icon={UserRound}
          title="Profile unavailable"
          description="We could not find your profile information."
        />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your personal information and account details.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardHeader className="items-center text-center">
            <Avatar className="mx-auto size-16">
              <AvatarFallback className="text-lg">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div className="mt-2 space-y-1">
              <CardTitle className="text-lg">{profile.name}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </div>
            <Badge variant="secondary" className="mx-auto">
              Member
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <Separator />
            <div className="flex items-center gap-2 text-sm">
              <Mail
                className="text-muted-foreground size-4 shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays
                className="text-muted-foreground size-4 shrink-0"
                aria-hidden="true"
              />
              <span>
                Joined {format(new Date(profile.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal information</CardTitle>
            <CardDescription>
              Update your name or email address. Your email is used to sign in.
            </CardDescription>
          </CardHeader>

          <form onSubmit={onSubmit} noValidate>
            <CardContent className="space-y-5">
              <FormField
                id="name"
                label="Full name"
                error={errors.name?.message}
                required
              >
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  {...register('name')}
                />
              </FormField>

              <FormField
                id="email"
                label="Email"
                error={errors.email?.message}
                hint="Changing your email changes how you sign in."
                required
              >
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? 'email-error' : 'email-hint'
                  }
                  {...register('email')}
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
            </CardContent>

            <CardFooter className="mt-6 justify-end gap-2 border-t">
              <Button
                type="button"
                variant="outline"
                disabled={!isDirty || updateMutation.isPending}
                onClick={() =>
                  reset({
                    name: profile.name,
                    email: profile.email,
                  })
                }
              >
                Discard
              </Button>
              <Button
                type="submit"
                disabled={!isDirty || updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save />
                )}
                Save changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}
