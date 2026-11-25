import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { tokenStorage } from '@/lib/token-storage'
import type { SessionUser } from './auth.types'

export interface AuthState {
  token: string | null
  user: SessionUser | null
}

const initialState: AuthState = {
  token: tokenStorage.get(),
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: SessionUser | null }>,
    ) => {
      state.token = action.payload.token
      state.user = action.payload.user
    },
    setUser: (state, action: PayloadAction<SessionUser | null>) => {
      state.user = action.payload
    },
    clearCredentials: (state) => {
      state.token = null
      state.user = null
    },
  },
})

export const { setCredentials, setUser, clearCredentials } = authSlice.actions

export const authReducer = authSlice.reducer
