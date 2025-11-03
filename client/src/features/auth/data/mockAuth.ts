import type { User, AuthResponse } from '../types'

// Mock credentials
export const MOCK_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'demo123',
  // Admin account
  adminEmail: 'admin@example.com',
  adminPassword: 'admin123',
}

// Mock user data
export const MOCK_USER: User = {
  _id: 'mock_user_001',
  id: 'mock_user_001',
  name: 'Demo User',
  nickname: 'Demo',
  email: 'demo@example.com',
  lang: 'vi',
  profileImg: undefined,
  phone: '+84123456789',
  role: 'user',
  isSubscribed: true,
  subscription: {
    planId: 'free',
    planName: 'Free Plan',
    startDate: new Date() as any, // Will be serialized as string in Redux
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) as any, // 1 year
    status: 'active',
  },
}

export const MOCK_ADMIN_USER: User = {
  ...MOCK_USER,
  _id: 'mock_admin_001',
  id: 'mock_admin_001',
  name: 'Admin User',
  nickname: 'Admin',
  email: 'admin@example.com',
  role: 'admin',
}

// Mock authentication function
export const mockLogin = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check credentials
  if (
    (email === MOCK_CREDENTIALS.email &&
      password === MOCK_CREDENTIALS.password) ||
    (email === MOCK_CREDENTIALS.adminEmail &&
      password === MOCK_CREDENTIALS.adminPassword)
  ) {
    const isAdmin = email === MOCK_CREDENTIALS.adminEmail
    const user = isAdmin ? MOCK_ADMIN_USER : MOCK_USER

    return {
      user,
      accessToken: `mock_access_token_${Date.now()}`,
      refreshToken: `mock_refresh_token_${Date.now()}`,
    }
  }

  throw new Error('Invalid email or password')
}

export const mockGetMe = async (): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  
  // Check if token exists in localStorage
  const token = localStorage.getItem('access_token')
  if (!token || !token.startsWith('mock_access_token')) {
    throw new Error('Not authenticated')
  }

  // Return user based on token or default to regular user
  const email = localStorage.getItem('mock_user_email') || MOCK_CREDENTIALS.email
  return email === MOCK_CREDENTIALS.adminEmail ? MOCK_ADMIN_USER : MOCK_USER
}

