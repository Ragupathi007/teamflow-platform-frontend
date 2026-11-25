import { Navigate, createBrowserRouter } from 'react-router-dom'
import { LoadingState } from '@/components/feedback/loading-state'
import { AppShell } from '@/layouts/app-shell'
import { RootLayout } from '@/layouts/root-layout'
import { ProtectedRoute } from './protected-route'
import { PublicOnlyRoute } from './public-only-route'
import { RouteErrorPage } from './route-error.page'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    hydrateFallbackElement: (
      <div className="bg-background flex min-h-svh items-center justify-center">
        <LoadingState label="Loading TeamFlow..." />
      </div>
    ),
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: '/login',
            lazy: async () => {
              const { LoginPage } = await import(
                '@/features/auth/pages/login.page'
              )
              return { Component: LoginPage }
            },
          },
          {
            path: '/register',
            lazy: async () => {
              const { RegisterPage } = await import(
                '@/features/auth/pages/register.page'
              )
              return { Component: RegisterPage }
            },
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppShell />,
            children: [
              {
                path: '/dashboard',
                lazy: async () => {
                  const { DashboardPage } = await import('./dashboard.page')
                  return { Component: DashboardPage }
                },
              },
              {
                path: '/profile',
                lazy: async () => {
                  const { ProfilePage } = await import(
                    '@/features/users/pages/profile.page'
                  )
                  return { Component: ProfilePage }
                },
              },
              {
                path: '/workspaces',
                lazy: async () => {
                  const { WorkspacesPage } = await import(
                    '@/features/workspaces/pages/workspaces.page'
                  )
                  return { Component: WorkspacesPage }
                },
              },
              {
                path: '/workspaces/:workspaceId',
                lazy: async () => {
                  const { WorkspaceDetailPage } = await import(
                    '@/features/workspaces/pages/workspace-detail.page'
                  )
                  return { Component: WorkspaceDetailPage }
                },
              },
            ],
          },
        ],
      },
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '*',
        lazy: async () => {
          const { NotFoundPage } = await import('./not-found.page')
          return { Component: NotFoundPage }
        },
      },
    ],
  },
])
