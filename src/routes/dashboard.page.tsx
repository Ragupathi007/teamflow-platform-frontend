import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { Building2, ShieldCheck, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCurrentUser } from '@/features/auth/auth.hooks'

export function DashboardPage() {
  const { data: user } = useCurrentUser()
  const firstName = user?.name.split(' ')[0] ?? 'there'

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome, {firstName}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your workspaces or update your personal information.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link to="/workspaces">
              <Building2 />
              Workspaces
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/profile">
              <UserRound />
              Profile
            </Link>
          </Button>
        </div>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <div className="bg-success/10 text-success mb-2 flex size-9 items-center justify-center rounded-lg">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>
          <CardTitle>Authentication is working</CardTitle>
          <CardDescription>
            Your JWT session is active and your profile was loaded from the API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-border divide-y text-sm">
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{user?.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{user?.email}</dd>
            </div>
            {user?.createdAt ? (
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-muted-foreground">Member since</dt>
                <dd className="font-medium">
                  {format(new Date(user.createdAt), 'MMM d, yyyy')}
                </dd>
              </div>
            ) : null}
          </dl>
        </CardContent>
      </Card>
    </main>
  )
}
