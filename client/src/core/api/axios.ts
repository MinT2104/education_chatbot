import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3030/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add timezone header
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    config.headers['Time-Zone'] = timeZone

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor with refresh token logic
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Try to refresh token using direct API call to avoid circular dependency
        const refreshTokenValue = localStorage.getItem('refresh_token')
        if (refreshTokenValue) {
          const refreshResponse = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3030/api'}/auth/refresh`,
            {},
            { withCredentials: true }
          )
          if (refreshResponse.data?.accessToken) {
            localStorage.setItem('access_token', refreshResponse.data.accessToken)
            processQueue(null, null)
            return apiClient(originalRequest)
          }
        }
        throw new Error('No refresh token')
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null)
        // Redirect to login if refresh fails
        const path = window.location.pathname
        const requiresAuth = path.startsWith('/home') || path.startsWith('/admin')
        if (requiresAuth) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      const path = window.location.pathname
      if (!path.startsWith('/admin')) {
        window.location.href = '/home'
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient


