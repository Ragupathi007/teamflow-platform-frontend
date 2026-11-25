import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/app/hooks'
import { setUnauthorizedHandler } from '@/lib/axios'
import { useCurrentUser } from '../auth.hooks'
import { clearCredentials, setUser } from '../auth.slice'

export function AuthSession() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { data: currentUser } = useCurrentUser()

  useEffect(() => {
    if (!currentUser) {
      return
    }

    dispatch(
      setUser({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
      }),
    )
  }, [currentUser, dispatch])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      dispatch(clearCredentials())
      queryClient.clear()

      if (
        location.pathname !== '/login' &&
        location.pathname !== '/register'
      ) {
        navigate('/login', {
          replace: true,
          state: {
            from: `${location.pathname}${location.search}`,
          },
        })
      }
    })

    return () => setUnauthorizedHandler(null)
  }, [dispatch, navigate, queryClient, location.pathname, location.search])

  return null
}
