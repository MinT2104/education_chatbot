import { useEffect, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAppDispatch, useAppSelector } from './core/store/hooks'
import { initializeAuth } from './features/auth/store/authSlice'
import { setDarkMode } from './features/ui/store/uiSlice'
import { settingsService } from './features/auth/services/settingsService'
import { routes } from './core/router'
import './App.css'

function App() {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth?.isAuthenticated ?? false)
  const user = useAppSelector((state) => state.auth?.user)

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  // Initialize theme from settings
  useEffect(() => {
    const userId = user?.email || user?.id || null
    const settings = settingsService.getSettings(userId)
    
    // Apply theme
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      dispatch(setDarkMode(prefersDark))
    } else {
      dispatch(setDarkMode(settings.theme === 'dark'))
    }

    // Apply fontSize
    const root = document.documentElement
    if (settings.fontSize === 'small') {
      root.style.fontSize = '14px'
    } else if (settings.fontSize === 'medium') {
      root.style.fontSize = '16px'
    } else if (settings.fontSize === 'large') {
      root.style.fontSize = '18px'
    }

    // Listen for system theme changes
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        dispatch(setDarkMode(e.matches))
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [dispatch, user])

  return (
    <div className="App">
      <Suspense fallback={<div className="p-6 text-text">Loading...</div>}>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.protected && !isAuthenticated ? (
                  <Navigate to="/login" replace />
                ) : (
                  <route.component />
                )
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="auto"
      />
    </div>
  )
}

export default App


