import { Outlet } from 'react-router-dom'
import { AuthSession } from '@/features/auth/components/auth-session'

export function RootLayout() {
  return (
    <>
      <AuthSession />
      <Outlet />
    </>
  )
}
