import { useEffect, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAppDispatch, useAppSelector } from './core/store/hooks'
import { initializeAuth } from './features/auth/store/authSlice'
import { routes } from './core/router'
import './App.css'

function App() {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth?.isAuthenticated ?? false)

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

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


