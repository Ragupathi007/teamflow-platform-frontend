import type { ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  action?: ReactNode
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this content. Please try again.',
  onRetry,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border bg-card px-6 py-10 text-center',
        className,
      )}
      role="alert"
    >
      <div className="bg-destructive/10 text-destructive mb-4 flex size-11 items-center justify-center rounded-full">
        <AlertTriangle className="size-5" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">{message}</p>
      {onRetry || action ? (
        <div className="mt-4 flex items-center gap-2">
          {onRetry ? (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw />
              Try again
            </Button>
          ) : null}
          {action}
        </div>
      ) : null}
    </div>
  )
}
