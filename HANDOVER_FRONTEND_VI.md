# 📚 TÀI LIỆU BÀN GIAO - Frontend (education-chat-bot)

**Dự Án:** Education Bot Frontend  
**Công Nghệ:** React + TypeScript + Vite  
**Ngày:** 29 Tháng 11, 2025  
**Phiên Bản:** 2.0

---

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
3. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
4. [Hướng Dẫn Cài Đặt](#hướng-dẫn-cài-đặt)
5. [Cấu Hình Environment](#cấu-hình-environment)
6. [Các Features Chính](#các-features-chính)
7. [State Management](#state-management)
8. [API Integration](#api-integration)
9. [Routing](#routing)
10. [Triển Khai](#triển-khai)

---

## 🎯 Tổng Quan

Frontend web application cho Education Bot với các tính năng:

- **Giao diện hiện đại** với React + TypeScript
- **Chat Interface** với hỗ trợ markdown
- **Admin Panel** quản lý users, documents, schools
- **User Dashboard** với profile, quản lý subscription
- **Tích hợp thanh toán** (PayPal, Razorpay)
- **Xác thực** (Email/Password, Google, Apple)
- **Responsive Design** với Tailwind CSS

---

## 💻 Công Nghệ Sử Dụng

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
│   ├── features/              # Modules theo tính năng (12 features)
│   │   ├── auth/             # Xác thực (13 files)
│   │   ├── chat/             # Giao diện chat (34 files)
│   │   ├── admin/            # Admin panel (26 files)
│   │   ├── payment/          # Thanh toán (9 files)
│   │   ├── user/             # User profile
│   │   ├── home/             # Trang chủ
│   │   └── ...
│   │
│   ├── core/                 # Cấu hình core
│   │   ├── api/              # API client setup
│   │   ├── router/           # Routing configuration
│   │   ├── store/            # Redux store
│   │   ├── services/         # API services
│   │   └── utils/            # Utility functions
│   │
│   ├── components/           # Shared components
│   ├── App.tsx               # Main App component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
│
├── public/                   # Static assets
├── docs/                     # Documentation
├── package.json              # Dependencies
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind config
└── .env                      # Environment variables
```

---

## 🚀 Hướng Dẫn Cài Đặt

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd education-chat-bot
```

### Bước 2: Cài Đặt Dependencies

```bash
# Sử dụng pnpm (khuyến nghị)
pnpm install

# Hoặc npm
npm install
```

### Bước 3: Cấu Hình Environment

Copy `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Bước 4: Khởi Động Development Server

```bash
pnpm run dev

# Frontend sẽ chạy tại: http://localhost:5173
```

### Bước 5: Build cho Production

```bash
pnpm run build

# Output: thư mục dist/
```

---

## ⚙️ Cấu Hình Environment

File `.env`:

```env
# Cấu hình API
VITE_API_URL=http://localhost:3000/api

# Google OAuth (chỉ Client ID, không phải secret)
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com

# PayPal (tùy chọn, có thể chỉ ở backend)
VITE_PAYPAL_CLIENT_ID=xxxxx
```

**Quan trọng:**
- Tất cả env variables phải có prefix `VITE_`
- Không bao giờ commit secrets vào `.env`
- Backend URL phải có suffix `/api`

---

## 🎨 Các Features Chính

### 1. Authentication Feature

**Vị trí:** `src/features/auth/`

**Components:**
- `LoginForm` - Form đăng nhập email/password
- `RegisterForm` - Form đăng ký user
- `GoogleButton` - Nút Google OAuth
- `AppleButton` - Nút Apple Sign In

**Luồng:**
1. User click login/register
2. Validation form với Zod
3. API call đến backend
4. Lưu token vào localStorage
5. Cập nhật Redux state
6. Redirect đến home

### 2. Chat Feature

**Vị trí:** `src/features/chat/`

**Components:**
- `ChatBox` - Container chính
- `MessageList` - Hiển thị messages
- `InputBox` - Nhập tin nhắn
- `ConversationList` - Sidebar hội thoại
- `MessageBubble` - Tin nhắn đơn lẻ
- `MarkdownRenderer` - Render AI responses

**Tính năng:**
- Chat real-time
- Hỗ trợ markdown
- Syntax highlighting cho code
- Lịch sử hội thoại
- Hiển thị giới hạn tốc độ

### 3. Admin Feature

**Vị trí:** `src/features/admin/`

**Pages:**
- Dashboard - Thống kê tổng quan
- User Management - CRUD users
- Document Management - Upload/xóa docs
- School Management - CRUD schools
- Subject Management - CRUD subjects
- Settings - Cài đặt hệ thống

**Quyền truy cập:** Chỉ admin

### 4. Payment Feature

**Vị trí:** `src/features/payment/`

**Components:**
- `PricingCard` - Hiển thị gói
- `PayPalButton` - Thanh toán PayPal
- `RazorpayButton` - Thanh toán Razorpay
- `SubscriptionStatus` - Gói hiện tại

**Cổng thanh toán hỗ trợ:**
- PayPal
- Razorpay

---

## 🔄 State Management

### Cấu Trúc Redux Store

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
- `setUser(user)` - Đặt user đã xác thực
- `clearUser()` - Đăng xuất
- `updateUser(data)` - Cập nhật profile

**chatSlice:**
- `setConversations(conversations)` - Đặt danh sách hội thoại
- `addMessage(message)` - Thêm tin nhắn mới
- `setCurrentConversation(id)` - Chuyển hội thoại

---

## 📡 API Integration

### API Service

**Vị trí:** `src/core/services/api.ts`

**Methods:**
```typescript
// Auth
api.auth.login(email, password)
api.auth.register(userData)
api.auth.logout()

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

// Admin
api.admin.getUsers()
api.admin.deleteUser(userId)
api.admin.uploadDocument(file)
```

### Xử Lý Lỗi

```typescript
try {
  const response = await api.chat.send(message);
  // Xử lý thành công
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect đến login
  } else if (error.response?.status === 429) {
    // Vượt quá giới hạn tốc độ
  } else {
    // Hiển thị error toast
  }
}
```

---

## 🛣️ Routing

### Cấu Trúc Routes

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

---

## 🚢 Triển Khai

### Triển Khai Vercel

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Đặt biến môi trường trong Vercel dashboard
```

**vercel.json:**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Checklist Production

- [ ] Cập nhật `VITE_API_URL` thành production backend
- [ ] Đặt `VITE_GOOGLE_CLIENT_ID` cho production
- [ ] Bật HTTPS
- [ ] Cấu hình CDN cho static assets
- [ ] Bật gzip compression
- [ ] Thiết lập error tracking (Sentry)
- [ ] Thiết lập analytics (Google Analytics)
- [ ] Test tất cả features trong production
- [ ] Xác minh OAuth redirects hoạt động

---

## 🔧 Xử Lý Sự Cố

### Lỗi CORS

**Vấn đề:** API calls bị chặn bởi CORS

**Giải pháp:**
- Xác minh cấu hình CORS backend
- Kiểm tra `VITE_API_URL` đúng
- Đảm bảo `withCredentials: true` trong axios

### Vấn Đề OAuth Redirect

**Vấn đề:** Google/Apple login redirect thất bại

**Giải pháp:**
- Xác minh redirect URIs trong Google/Apple console
- Kiểm tra backend `GOOGLE_REDIRECT_URI` khớp
- Đảm bảo frontend callback routes tồn tại

### Lỗi Build

**Vấn đề:** Lỗi TypeScript khi build

**Giải pháp:**
```bash
# Type check
pnpm run type-check

# Fix các vấn đề thường gặp
pnpm run lint --fix
```

---

## 📞 Hỗ Trợ & Tài Liệu

### File Quan Trọng

- `ARCHITECTURE.md` - Kiến trúc frontend
- `BACKEND_INTEGRATION.md` - Hướng dẫn tích hợp API
- `IMPLEMENTATION_SUMMARY.md` - Trạng thái features
- `PLAN_MANAGEMENT.md` - Quản lý subscription

### Lệnh Hữu Ích

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
```

---

**Phiên Bản Tài Liệu:** 1.0  
**Cập Nhật Lần Cuối:** 29 Tháng 11, 2025  
**Người Bảo Trì:** Frontend Team
