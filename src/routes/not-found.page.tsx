import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <main className="bg-background text-foreground flex min-h-svh items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="bg-muted text-muted-foreground mb-5 flex size-12 items-center justify-center rounded-full">
          <Compass className="size-6" aria-hidden="true" />
        </div>
        <p className="text-primary text-sm font-medium">404</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">
            <ArrowLeft />
            Back to home
          </Link>
        </Button>
      </div>
    </main>
  )
}
