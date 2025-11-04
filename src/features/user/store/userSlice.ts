import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../../auth/types'

interface UserState {
  userData: User | null
  isProfileLoading: boolean
}

const initialState: UserState = {
  userData: null,
  isProfileLoading: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      state.userData = action.payload
    },
    updateUserData: (state, action: PayloadAction<Partial<User>>) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload }
      }
    },
    clearUserData: (state) => {
      state.userData = null
    },
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.isProfileLoading = action.payload
    },
  },
})

export const { setUserData, updateUserData, clearUserData, setProfileLoading } = userSlice.actions
export const userReducer = userSlice.reducer


