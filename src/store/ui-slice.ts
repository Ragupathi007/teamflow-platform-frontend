import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Theme = 'light' | 'dark' | 'system'

export interface UiState {
  sidebarOpen: boolean
  mobileSidebarOpen: boolean
  theme: Theme
}

const initialState: UiState = {
  sidebarOpen: true,
  mobileSidebarOpen: false,
  theme: 'system',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    toggleMobileSidebar: (state) => {
      state.mobileSidebarOpen = !state.mobileSidebarOpen
    },
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileSidebarOpen = action.payload
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  setTheme,
} = uiSlice.actions

export const uiReducer = uiSlice.reducer
