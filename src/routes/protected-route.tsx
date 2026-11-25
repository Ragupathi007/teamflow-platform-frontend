import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { ErrorState } from '@/components/feedback/error-state'
import { LoadingState } from '@/components/feedback/loading-state'
import { useCurrentUser } from '@/features/auth/auth.hooks'
import { selectIsAuthenticated } from '@/features/auth/auth.selectors'
import { toApiError } from '@/lib/api-error'

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const location = useLocation()
  const { isLoading, isError, error, refetch } = useCurrentUser()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-svh items-center justify-center">
        <LoadingState label="Loading your account..." />
      </div>
    )
  }

  if (isError) {
    const apiError = toApiError(error)

    if (apiError.status === 401) {
      return <Navigate to="/login" replace />
    }

    return (
      <div className="bg-background flex min-h-svh items-center justify-center px-6">
        <div className="w-full max-w-md">
          <ErrorState
            message={apiError.message}
            onRetry={() => void refetch()}
          />
        </div>
      </div>
    )
  }

  return <Outlet />
}
