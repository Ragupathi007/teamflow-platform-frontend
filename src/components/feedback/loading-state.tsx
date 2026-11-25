import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  label?: string
  className?: string
}

export function LoadingState({
  label = 'Loading...',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'text-muted-foreground flex flex-col items-center justify-center gap-3 py-10 text-sm',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="text-primary size-5 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
