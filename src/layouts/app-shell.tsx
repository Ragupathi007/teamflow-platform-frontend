import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  Building2,
  LayoutDashboard,
  Loader2,
  LogOut,
  UserRound,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCurrentUser, useLogout } from '@/features/auth/auth.hooks'
import { getInitials } from '@/lib/initials'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workspaces', label: 'Workspaces', icon: Building2 },
  { to: '/profile', label: 'Profile', icon: UserRound },
] as const

export function AppShell() {
  const { data: user } = useCurrentUser()
  const logoutMutation = useLogout()

  return (
    <div className="bg-background min-h-svh">
      <header className="bg-card/95 supports-[backdrop-filter]:bg-card/80 sticky top-0 z-30 border-b backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-5">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-xs font-semibold">
                TF
              </div>
              <span className="hidden text-sm font-semibold tracking-tight sm:inline">
                TeamFlow
              </span>
            </Link>

            <nav className="flex items-center gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  aria-label={label}
                  className={({ isActive }) =>
                    cn(
                      'text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
                      isActive && 'bg-accent text-foreground',
                    )
                  }
                >
                  <Icon className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/profile"
              className="hover:bg-accent hidden items-center gap-2 rounded-md px-1.5 py-1 transition-colors sm:flex"
              aria-label="Open profile"
            >
              <Avatar className="size-8">
                <AvatarFallback>
                  {user ? getInitials(user.name) : '?'}
                </AvatarFallback>
              </Avatar>
              <span className="max-w-40 truncate text-sm font-medium">
                {user?.name ?? 'Account'}
              </span>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <LogOut />
              )}
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  )
}
