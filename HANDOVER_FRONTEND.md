# 📚 HANDOVER DOCUMENTATION - Frontend (education-chat-bot)

**Project:** Education Bot Frontend  
**Technology:** React + TypeScript + Vite  
**Date:** November 29, 2025  
**Version:** 2.0

---

## 📋 Mục Lục

1. [Tổng Quan Dự Án](#tổng-quan-dự-án)
2. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
3. [Các File Quan Trọng](#các-file-quan-trọng)
4. [Hướng Dẫn Setup Chi Tiết](#hướng-dẫn-setup-chi-tiết)
5. [Cấu Hình Environment](#cấu-hình-environment)
6. [Features & Components](#features--components)
7. [State Management](#state-management)
8. [API Integration](#api-integration)
9. [Routing](#routing)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng Quan Dự Án

Frontend web application cho Education Bot, cung cấp:

- **Modern UI/UX** với React + TypeScript
- **AI Chat Interface** với markdown support
- **Admin Panel** để quản lý users, documents, schools
- **User Dashboard** với profile, subscription management
- **Payment Integration** (PayPal, Razorpay)
- **Authentication** (Email/Password, Google, Apple)
- **Responsive Design** với Tailwind CSS
- **Component Library** với Radix UI

### Technology Stack

- **Framework:** React 18.2.0
- **Language:** TypeScript 5.3.3
- **Build Tool:** Vite 5.0.11
- **State Management:** Redux Toolkit 2.2.1
- **Routing:** React Router 6.22.1
- **Styling:** Tailwind CSS 3.4.6
- **UI Components:** Radix UI
- **HTTP Client:** Axios 1.7.2
- **Form Management:** React Hook Form 7.66.0
- **Validation:** Zod 4.1.12

---

## 📁 Cấu Trúc Thư Mục

```
education-chat-bot/
├── src/
│   ├── features/              # Feature modules (12 features)
│   │   ├── auth/             # Authentication (13 files)
│   │   │   ├── components/   # Login, Register, OAuth buttons
│   │   │   ├── hooks/        # useAuth, useGoogleAuth
│   │   │   ├── pages/        # LoginPage, RegisterPage
│   │   │   └── types/        # Auth types
│   │   │
│   │   ├── chat/             # Chat interface (34 files)
│   │   │   ├── components/   # ChatBox, MessageList, InputBox
│   │   │   ├── hooks/        # useChat, useMessages
│   │   │   ├── pages/        # ChatPage
│   │   │   └── utils/        # Message formatting
│   │   │
│   │   ├── admin/            # Admin panel (26 files)
│   │   │   ├── components/   # UserTable, DocumentManager
│   │   │   ├── pages/        # AdminDashboard, UserManagement
│   │   │   └── hooks/        # useAdminData
│   │   │
│   │   ├── payment/          # Payment (9 files)
│   │   │   ├── components/   # PayPalButton, RazorpayButton
│   │   │   ├── pages/        # PricingPage, CheckoutPage
│   │   │   └── hooks/        # usePayment
│   │   │
│   │   ├── user/             # User profile (1 file)
│   │   ├── home/             # Home page (1 file)
│   │   ├── landing/          # Landing page (1 file)
│   │   ├── community/        # Community features (1 file)
│   │   ├── courses/          # Courses (2 files)
│   │   ├── library/          # Library (1 file)
│   │   ├── misc/             # Misc pages (5 files)
│   │   └── ui/               # Shared UI components (1 file)
│   │
│   ├── core/                 # Core configuration
│   │   ├── api/              # API client setup
│   │   │   └── axios.ts      # Axios instance with interceptors
│   │   ├── router/           # Routing configuration
│   │   │   └── index.tsx     # React Router setup
│   │   ├── store/            # Redux store
│   │   │   ├── index.ts      # Store configuration
│   │   │   └── slices/       # Redux slices
│   │   ├── services/         # API services
│   │   │   └── api.ts        # API endpoints
│   │   └── utils/            # Utility functions
│   │       ├── auth.ts       # Token management
│   │       └── helpers.ts    # Helper functions
│   │
│   ├── components/           # Shared components
│   │   └── ui/               # shadcn/ui components
│   │
│   ├── App.tsx               # Main App component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
│
├── public/                   # Static assets
│   ├── images/
│   └── icons/
│
├── docs/                     # Documentation (5 files)
│   ├── ARCHITECTURE.md
│   ├── BACKEND_INTEGRATION.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── PLAN_MANAGEMENT.md
│   └── UPLOAD_DOCS_INDEX.md
│
├── index.html                # HTML entry point
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
├── components.json           # shadcn/ui config
├── vercel.json               # Vercel deployment
└── .env                      # Environment variables
```

---

## 📄 Các File Quan Trọng

### 1. `src/main.tsx` - Entry Point

**Mục đích:** Khởi tạo React app

**Nội dung:**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { store } from './core/store'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
```

### 2. `src/App.tsx` - Main App Component

**Mục đích:** Setup routing, global providers

**Nội dung:**
- Router setup
- Global error boundary
- Toast notifications
- Theme provider

### 3. `src/core/api/axios.ts` - API Client

**Mục đích:** Axios instance với interceptors

**Features:**
- Base URL configuration
- Request interceptor (attach JWT token)
- Response interceptor (handle 401, refresh token)
- Error handling

**Code:**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 4. `src/core/store/index.ts` - Redux Store

**Mục đích:** Redux store configuration

**Slices:**
- `authSlice` - Authentication state
- `chatSlice` - Chat messages, conversations
- `userSlice` - User profile, preferences
- `adminSlice` - Admin data

### 5. `src/core/router/index.tsx` - Routing

**Mục đích:** React Router configuration

**Routes:**
- `/` - Landing page
- `/login` - Login page
- `/register` - Register page
- `/home` - Home page (after login)
- `/chat` - Chat interface
- `/chat/:conversationId` - Specific conversation
- `/profile` - User profile
- `/pricing` - Pricing page
- `/admin/*` - Admin routes (protected)

**Protected Routes:**
```typescript
<Route element={<ProtectedRoute />}>
  <Route path="/chat" element={<ChatPage />} />
  <Route path="/profile" element={<ProfilePage />} />
</Route>

<Route element={<AdminRoute />}>
  <Route path="/admin/*" element={<AdminLayout />} />
</Route>
```

### 6. `src/features/auth/` - Authentication

**Files:**
- `components/LoginForm.tsx` - Login form
- `components/RegisterForm.tsx` - Register form
- `components/GoogleButton.tsx` - Google OAuth button
- `components/AppleButton.tsx` - Apple Sign In button
- `hooks/useAuth.ts` - Authentication hook
- `pages/LoginPage.tsx` - Login page
- `pages/RegisterPage.tsx` - Register page

**useAuth Hook:**
```typescript
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    dispatch(setUser(response.data.user));
    localStorage.setItem('access_token', response.data.access_token);
  };

  const logout = () => {
    dispatch(clearUser());
    localStorage.removeItem('access_token');
  };

  return { user, isAuthenticated, login, logout };
};
```

### 7. `src/features/chat/` - Chat Interface

**Files:**
- `components/ChatBox.tsx` - Main chat container
- `components/MessageList.tsx` - Message display
- `components/InputBox.tsx` - Message input
- `components/ConversationList.tsx` - Sidebar conversations
- `hooks/useChat.ts` - Chat logic
- `pages/ChatPage.tsx` - Chat page

**useChat Hook:**
```typescript
export const useChat = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message) => {
    setLoading(true);
    const response = await api.post('/chat', {
      question: message,
      session_id: conversationId,
    });
    setMessages([...messages, response.data]);
    setLoading(false);
  };

  return { messages, loading, sendMessage };
};
```

### 8. `src/features/admin/` - Admin Panel

**Files:**
- `pages/AdminDashboard.tsx` - Dashboard overview
- `pages/UserManagement.tsx` - User CRUD
- `pages/DocumentManagement.tsx` - Document upload/delete
- `pages/SchoolManagement.tsx` - School CRUD
- `components/UserTable.tsx` - User list table
- `components/DocumentUpload.tsx` - Upload component

### 9. `src/features/payment/` - Payment

**Files:**
- `components/PayPalButton.tsx` - PayPal integration
- `components/RazorpayButton.tsx` - Razorpay integration
- `pages/PricingPage.tsx` - Pricing plans
- `hooks/usePayment.ts` - Payment logic

**PayPal Integration:**
```typescript
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export const PayPalButton = ({ planId }) => {
  const createOrder = async () => {
    const response = await api.post('/payment/paypal/order', { planId });
    return response.data.orderId;
  };

  const onApprove = async (data) => {
    await api.post('/payment/paypal/capture', { orderId: data.orderID });
  };

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID }}>
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </PayPalScriptProvider>
  );
};
```

### 10. Documentation Files

**ARCHITECTURE.md** - Frontend architecture overview
**BACKEND_INTEGRATION.md** - API integration guide
**IMPLEMENTATION_SUMMARY.md** - Feature implementation status
**PLAN_MANAGEMENT.md** - Subscription management
**UPLOAD_DOCS_INDEX.md** - Document upload guide

---

## 🚀 Hướng Dẫn Setup Chi Tiết

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd education-chat-bot
```

### Bước 2: Install Dependencies

```bash
# Sử dụng pnpm (recommended)
pnpm install

# Hoặc npm
npm install
```

**Dependencies chính:**
- react, react-dom: UI framework
- react-router-dom: Routing
- @reduxjs/toolkit, react-redux: State management
- axios: HTTP client
- @radix-ui/*: UI components
- tailwindcss: Styling
- react-hook-form: Form management
- zod: Validation
- @paypal/react-paypal-js: PayPal integration

### Bước 3: Cấu Hình Environment

Copy `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Bước 4: Start Development Server

```bash
pnpm run dev

# Frontend sẽ chạy tại: http://localhost:5173
```

### Bước 5: Build for Production

```bash
pnpm run build

# Output: dist/ folder
```

### Bước 6: Preview Production Build

```bash
pnpm run preview

# Preview tại: http://localhost:4173
```

---

## ⚙️ Cấu Hình Environment

File `.env`:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Google OAuth (Client ID only, not secret)
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com

# PayPal (optional, can be in backend only)
VITE_PAYPAL_CLIENT_ID=xxxxx
```

**Quan trọng:**
- Tất cả env variables phải có prefix `VITE_`
- Không bao giờ commit secrets vào `.env`
- Backend URL phải có `/api` suffix

---

## 🎨 Features & Components

### Authentication Feature

**Location:** `src/features/auth/`

**Components:**
- `LoginForm` - Email/password login
- `RegisterForm` - User registration
- `GoogleButton` - Google OAuth
- `AppleButton` - Apple Sign In
- `ForgotPassword` - Password reset

**Flow:**
1. User clicks login/register
2. Form validation với Zod
3. API call to backend
4. Store token in localStorage
5. Update Redux state
6. Redirect to home

### Chat Feature

**Location:** `src/features/chat/`

**Components:**
- `ChatBox` - Main container
- `MessageList` - Display messages
- `InputBox` - User input
- `ConversationList` - Sidebar
- `MessageBubble` - Individual message
- `MarkdownRenderer` - Render AI responses

**Features:**
- Real-time chat
- Markdown support
- Code syntax highlighting
- Conversation history
- Rate limit display

### Admin Feature

**Location:** `src/features/admin/`

**Pages:**
- Dashboard - Overview statistics
- User Management - CRUD users
- Document Management - Upload/delete docs
- School Management - CRUD schools
- Subject Management - CRUD subjects
- Settings - System settings

**Access:** Admin role only

### Payment Feature

**Location:** `src/features/payment/`

**Components:**
- `PricingCard` - Plan display
- `PayPalButton` - PayPal checkout
- `RazorpayButton` - Razorpay checkout
- `SubscriptionStatus` - Current plan

**Supported Gateways:**
- PayPal
- Razorpay

---

## 🔄 State Management

### Redux Store Structure

```typescript
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    loading: boolean,
  },
  chat: {
    conversations: Conversation[],
    currentConversation: string | null,
    messages: Message[],
    loading: boolean,
  },
  user: {
    profile: UserProfile | null,
    preferences: Preferences,
  },
  admin: {
    users: User[],
    documents: Document[],
    schools: School[],
  }
}
```

### Redux Slices

**authSlice:**
- `setUser(user)` - Set authenticated user
- `clearUser()` - Logout
- `updateUser(data)` - Update profile

**chatSlice:**
- `setConversations(conversations)` - Set conversation list
- `addMessage(message)` - Add new message
- `setCurrentConversation(id)` - Switch conversation

---

## 📡 API Integration

### API Service

**Location:** `src/core/services/api.ts`

**Methods:**
```typescript
// Auth
api.auth.login(email, password)
api.auth.register(userData)
api.auth.logout()
api.auth.refreshToken()

// Chat
api.chat.send(message, conversationId)
api.chat.getConversations()
api.chat.getRateLimit()

// User
api.user.getProfile()
api.user.updateProfile(data)

// Payment
api.payment.createPayPalOrder(planId)
api.payment.capturePayPalPayment(orderId)
api.payment.createRazorpayOrder(planId)

// Admin
api.admin.getUsers()
api.admin.deleteUser(userId)
api.admin.uploadDocument(file)
```

### Error Handling

```typescript
try {
  const response = await api.chat.send(message);
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
  } else if (error.response?.status === 429) {
    // Rate limit exceeded
  } else {
    // Show error toast
  }
}
```

---

## 🛣️ Routing

### Route Structure

```typescript
<Routes>
  {/* Public routes */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/pricing" element={<PricingPage />} />

  {/* Protected routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/home" element={<HomePage />} />
    <Route path="/chat" element={<ChatPage />} />
    <Route path="/chat/:id" element={<ChatPage />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Route>

  {/* Admin routes */}
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="documents" element={<DocumentManagement />} />
    </Route>
  </Route>
</Routes>
```

### Protected Route Component

```typescript
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};
```

---

## 🚢 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

**vercel.json:**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Build Optimization

**vite.config.ts:**
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

### Production Checklist

- [ ] Update `VITE_API_URL` to production backend
- [ ] Set `VITE_GOOGLE_CLIENT_ID` for production
- [ ] Enable HTTPS
- [ ] Configure CDN for static assets
- [ ] Enable gzip compression
- [ ] Setup error tracking (Sentry)
- [ ] Setup analytics (Google Analytics)
- [ ] Test all features in production
- [ ] Verify OAuth redirects work

---

## 🔧 Troubleshooting

### CORS Errors

**Problem:** API calls blocked by CORS

**Solution:**
- Verify backend CORS configuration
- Check `VITE_API_URL` is correct
- Ensure `withCredentials: true` in axios

### OAuth Redirect Issues

**Problem:** Google/Apple login redirects fail

**Solution:**
- Verify redirect URIs in Google/Apple console
- Check backend `GOOGLE_REDIRECT_URI` matches
- Ensure frontend callback routes exist

### Build Errors

**Problem:** TypeScript errors during build

**Solution:**
```bash
# Type check
pnpm run type-check

# Fix common issues
pnpm run lint --fix
```

### State Not Persisting

**Problem:** Redux state lost on refresh

**Solution:**
- Implement redux-persist
- Store auth token in localStorage
- Restore state on app init

---

## 📞 Support & Documentation

### Important Files

- `ARCHITECTURE.md` - Frontend architecture
- `BACKEND_INTEGRATION.md` - API integration guide
- `IMPLEMENTATION_SUMMARY.md` - Feature status
- `PLAN_MANAGEMENT.md` - Subscription management

### Useful Commands

```bash
# Development
pnpm run dev

# Build
pnpm run build

# Preview build
pnpm run preview

# Type check
pnpm run type-check

# Lint
pnpm run lint

# Format
pnpm run format
```

### Component Library

**shadcn/ui components:**
```bash
# Add new component
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
```

---

**Document Version:** 1.0  
**Last Updated:** November 29, 2025  
**Maintained By:** Frontend Team
