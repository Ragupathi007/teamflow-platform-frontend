import type { RootState } from '@/app/store'

export const selectAuthToken = (state: RootState) => state.auth.token
export const selectSessionUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.token)
