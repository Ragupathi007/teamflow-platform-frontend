import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { ErrorState } from '@/components/feedback/error-state'

function getErrorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred while rendering this page.'
}

export function RouteErrorPage() {
  const error = useRouteError()

  return (
    <main className="bg-background flex min-h-svh items-center justify-center px-6">
      <div className="w-full max-w-md">
        <ErrorState
          title="This page could not be displayed"
          message={getErrorMessage(error)}
          onRetry={() => window.location.reload()}
        />
      </div>
    </main>
  )
}
