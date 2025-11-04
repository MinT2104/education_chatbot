import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '../../features/auth/store/authSlice'
import { chatReducer } from '../../features/chat/store/chatSlice'
import { uiReducer } from '../../features/ui/store/uiSlice'
import { userReducer } from '../../features/user/store/userSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    ui: uiReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        // Ignore Date objects in subscription fields
        ignoredPaths: ['auth.user.subscription.startDate', 'auth.user.subscription.endDate', 'auth.user.voiceSubscription.startDate', 'auth.user.voiceSubscription.endDate'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export * from './hooks'


