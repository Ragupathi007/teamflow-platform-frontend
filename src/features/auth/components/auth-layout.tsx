import type { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

function WorkspacePreview() {
  const columns = [
    { label: 'Backlog', bars: ['w-4/5', 'w-2/3', 'w-3/5'] },
    { label: 'In progress', bars: ['w-3/4', 'w-1/2'] },
    { label: 'Done', bars: ['w-2/3', 'w-4/5', 'w-1/2'] },
  ] as const

  return (
    <div
      className="mt-10 grid grid-cols-3 gap-3"
      aria-hidden="true"
    >
      {columns.map((column) => (
        <div
          key={column.label}
          className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
        >
          <div className="mb-3 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-medium tracking-wide text-white/60 uppercase">
              {column.label}
            </span>
          </div>
          <div className="space-y-2">
            {column.bars.map((bar, index) => (
              <div
                key={`${column.label}-${index}`}
                className="rounded-md border border-white/10 bg-white/[0.06] p-2"
              >
                <div className={`h-1.5 rounded-full bg-white/20 ${bar}`} />
                <div className="mt-1.5 h-1.5 w-1/3 rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="bg-background grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#0B1120] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-semibold">
              TF
            </div>
            <span className="text-lg font-semibold tracking-tight">
              TeamFlow
            </span>
          </div>
          <h2 className="max-w-sm text-3xl font-semibold tracking-tight">
            Where great teams plan, track, and ship.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/60">
            Bring workspaces, projects, and issues together in one calm, focused
            place.
          </p>
          <WorkspacePreview />
        </div>
        <div className="relative flex items-center gap-2 text-xs text-white/50">
          <CheckCircle2 className="text-success size-4" aria-hidden="true" />
          Built for modern product teams
        </div>
      </aside>

      <main className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl text-xs font-semibold">
              TF
            </div>
            <span className="text-base font-semibold tracking-tight">
              TeamFlow
            </span>
          </div>

          <div className="mb-6 space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>

          {children}

          {footer ? <div className="mt-6">{footer}</div> : null}
        </div>
      </main>
    </div>
  )
}
