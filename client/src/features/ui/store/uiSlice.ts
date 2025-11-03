import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  isDark: boolean
  isSettingsShow: boolean
  isUserDetailsShow: boolean
  isSidebarLong: boolean
  isShowSlide: boolean
  isAdvanceShow: boolean
  isShowCustomVoiceAddon: boolean
}

const initialState: UiState = {
  isDark: false,
  isSettingsShow: false,
  isUserDetailsShow: false,
  isSidebarLong: false,
  isShowSlide: false,
  isAdvanceShow: false,
  isShowCustomVoiceAddon: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDark = !state.isDark
      localStorage.setItem('theme', state.isDark ? 'dark' : 'light')
      document.documentElement.setAttribute('data-theme', state.isDark ? 'dark' : 'light')
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload
      localStorage.setItem('theme', action.payload ? 'dark' : 'light')
      document.documentElement.setAttribute('data-theme', action.payload ? 'dark' : 'light')
    },
    toggleSettings: (state) => {
      state.isSettingsShow = !state.isSettingsShow
    },
    toggleUserDetails: (state) => {
      state.isUserDetailsShow = !state.isUserDetailsShow
    },
    toggleSidebar: (state) => {
      state.isSidebarLong = !state.isSidebarLong
    },
    toggleSlide: (state) => {
      state.isShowSlide = !state.isShowSlide
    },
    toggleAdvanceShow: (state) => {
      state.isAdvanceShow = !state.isAdvanceShow
    },
    toggleCustomVoiceAddon: (state) => {
      state.isShowCustomVoiceAddon = !state.isShowCustomVoiceAddon
    },
  },
})

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSettings,
  toggleUserDetails,
  toggleSidebar,
  toggleSlide,
  toggleAdvanceShow,
  toggleCustomVoiceAddon,
} = uiSlice.actions

export const uiReducer = uiSlice.reducer


