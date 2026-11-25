import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { queryKeys } from '@/lib/query-keys'
import { tokenStorage } from '@/lib/token-storage'
import {
  getCurrentUserRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
} from './auth.api'
import {
  clearCredentials,
  setCredentials,
} from './auth.slice'
import { selectAuthToken } from './auth.selectors'
import type { LoginRequest, RegisterRequest } from './auth.types'

interface LoginVariables extends LoginRequest {
  remember: boolean
}

export function useCurrentUser() {
  const token = useAppSelector(selectAuthToken)

  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: getCurrentUserRequest,
    enabled: Boolean(token),
    retry: false,
    staleTime: 5 * 60_000,
  })
}

export function useLogin() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()

  return useMutation({
    mutationFn: ({ email, password }: LoginVariables) =>
      loginRequest({ email, password }),
    onSuccess: (data, variables) => {
      const from = (location.state as { from?: string } | null)?.from

      tokenStorage.set(data.token, variables.remember)
      queryClient.removeQueries({ queryKey: queryKeys.currentUser })
      dispatch(
        setCredentials({
          token: data.token,
          user: data.user,
        }),
      )
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}`)
      navigate(from ?? '/dashboard', { replace: true })
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: RegisterRequest) => registerRequest(payload),
    onSuccess: (_data, variables) => {
      toast.success('Account created. Please sign in.')
      navigate('/login', {
        replace: true,
        state: { email: variables.email },
      })
    },
  })
}

export function useLogout() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      tokenStorage.clear()
      dispatch(clearCredentials())
      queryClient.clear()
      toast.success('Signed out')
      navigate('/login', { replace: true })
    },
  })
}
