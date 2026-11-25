import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { FormField } from '@/components/common/form-field'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { applyServerErrors } from '@/lib/form-errors'
import { useLogin } from '../auth.hooks'
import { loginSchema, type LoginFormValues } from '../auth.schemas'
import { AuthLayout } from '../components/auth-layout'
import { PasswordInput } from '../components/password-input'

interface LoginLocationState {
  email?: string
  from?: string
}

export function LoginPage() {
  const location = useLocation()
  const locationState = (location.state ?? null) as LoginLocationState | null
  const loginMutation = useLogin()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: locationState?.email ?? '',
      password: '',
      remember: true,
    },
  })

  const onSubmit = handleSubmit((values) => {
    setFormError(null)

    loginMutation.mutate(values, {
      onError: (error) => {
        const apiError = applyServerErrors<LoginFormValues>(error, setError)
        setFormError(apiError.message)
        toast.error(apiError.message)
      },
    })
  })

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue to your TeamFlow workspace."
      footer={
        <p className="text-muted-foreground text-center text-sm">
          New to TeamFlow?{' '}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormField id="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
        </FormField>

        <FormField
          id="password"
          label="Password"
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
        </FormField>

        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="remember"
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            <Controller
              control={control}
              name="remember"
              render={({ field }) => (
                <Checkbox
                  id="remember"
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
              )}
            />
            Remember me
          </label>
          <span
            className="text-muted-foreground text-xs"
            title="Password reset is not available yet"
          >
            Forgot password? Coming soon
          </span>
        </div>

        {formError ? (
          <div
            role="alert"
            className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm"
          >
            {formError}
          </div>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}
