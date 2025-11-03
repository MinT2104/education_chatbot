import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

// Lazy load components for code splitting
const LandingPage = lazy(() => import('../../features/landing/pages/LandingPage'))
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'))
const SignupPage = lazy(() => import('../../features/auth/pages/SignupPage'))
const HomePage = lazy(() => import('../../features/home/pages/HomePage'))
const ChatPage = lazy(() => import('../../features/chat/pages/ChatPage'))
const CommunityPage = lazy(() => import('../../features/community/pages/CommunityPage'))
const CourseListPage = lazy(() => import('../../features/courses/pages/CourseListPage'))
const CoursePlayerPage = lazy(() => import('../../features/courses/pages/CoursePlayerPage'))
const AdminPage = lazy(() => import('../../features/admin/pages/AdminPage'))
const UpgradePage = lazy(() => import('../../features/auth/pages/UpgradePage'))
const ProfilePage = lazy(() => import('../../features/auth/pages/ProfilePage'))

export interface AppRoute extends RouteObject {
  path: string
  component: React.ComponentType
  protected?: boolean
  adminOnly?: boolean
}

export const routes: AppRoute[] = [
  {
    path: '/',
    component: ChatPage,
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/signup',
    component: SignupPage,
  },
  {
    path: '/home',
    component: HomePage,
    protected: true,
  },
  {
    path: '/home/app',
    component: ChatPage,
    protected: true,
  },
  {
    path: '/home/app/:historyId',
    component: ChatPage,
    protected: true,
  },
  {
    path: '/upgrade',
    component: UpgradePage,
    protected: true,
  },
  {
    path: '/subscription',
    component: UpgradePage,
    protected: true,
  },
  {
    path: '/profile',
    component: ProfilePage,
    protected: true,
  },
  {
    path: '/prayers',
    component: CommunityPage,
  },
  {
    path: '/prayers/:id',
    component: CommunityPage,
  },
  {
    path: '/praise',
    component: CommunityPage,
  },
  {
    path: '/praise/:id',
    component: CommunityPage,
  },
  {
    path: '/courses',
    component: CourseListPage,
    protected: true,
  },
  {
    path: '/courses/:courseId/player',
    component: CoursePlayerPage,
    protected: true,
  },
  {
    path: '/admin/*',
    component: AdminPage,
    protected: true,
    adminOnly: true,
  },
]


