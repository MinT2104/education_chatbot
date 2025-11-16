# Fix cho lỗi 502 trong Chat Free

## Vấn đề

Chat Free bị lỗi 502 "Request failed with status code 502" trong khi:
- Backend xử lý request thành công và trả về 200 OK
- Login và test chat hoạt động bình thường
- Chỉ chat free bị lỗi này

## Nguyên nhân

### Timeout Configuration
1. **Vite Proxy Default Timeout**: Mặc định là 30 giây
2. **AI Processing Time**: Khi AI xử lý request mất > 30 giây, Vite proxy timeout
3. **502 Gateway Timeout**: Proxy đóng kết nối và trả về 502
4. **Backend vẫn xử lý**: Backend tiếp tục và trả về 200, nhưng frontend đã ngắt kết nối

### Flow xảy ra lỗi
```
1. Frontend gửi request → Vite Proxy → Backend
2. Backend nhận request và bắt đầu xử lý AI
3. 30 giây trôi qua...
4. Vite Proxy timeout → Trả về 502 cho Frontend
5. Backend vẫn xử lý tiếp → Cuối cùng trả về 200 (nhưng không còn ai lắng nghe)
6. Frontend hiển thị lỗi 502
```

## Giải pháp đã áp dụng

### 1. Tăng Timeout cho Vite Proxy
**File**: `vite.config.ts`

```typescript
server: {
  port: 5173,
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
      secure: false,
      // Tăng timeout lên 120 giây (2 phút)
      proxyTimeout: 120000,
      timeout: 120000,
    },
  },
}
```

### 2. Tăng Timeout cho Axios Client
**File**: `src/core/api/axios.ts`

```typescript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000, // 120 giây - khớp với proxy timeout
});
```

### 3. Cải thiện Error Handling
**File**: `src/features/chat/pages/ChatPage.tsx`

Thêm xử lý cụ thể cho:
- **Timeout errors** (ECONNABORTED, ETIMEDOUT)
- **502 Bad Gateway errors** (proxy timeout)
- Hiển thị message rõ ràng hơn cho user

```typescript
// Handle timeout errors
if (
  error?.code === "ECONNABORTED" ||
  error?.code === "ETIMEDOUT" ||
  error?.message?.includes("timeout")
) {
  // Show timeout message
}

// Handle 502 Bad Gateway errors
if (error?.response?.status === 502) {
  // Show gateway timeout message
}
```

## Cách test sau khi fix

1. **Restart dev server**:
```bash
# Kill running dev server (Ctrl+C)
npm run dev
```

2. **Test chat free**:
   - Truy cập `/app` hoặc `/` (guest mode)
   - Gửi một câu hỏi dài hoặc phức tạp
   - Đợi response (có thể mất > 30 giây)
   - Kiểm tra không còn lỗi 502

3. **Test chat authenticated**:
   - Login vào hệ thống
   - Gửi một câu hỏi
   - Đảm bảo vẫn hoạt động bình thường

4. **Kiểm tra backend logs**:
   - Backend logs nên hiển thị 200 OK
   - Frontend nên nhận được response thành công

## Kiểm tra thêm

### Nếu vẫn còn lỗi 502:

1. **Kiểm tra backend timeout**:
   - Express server timeout
   - AI service timeout
   - Database query timeout

2. **Kiểm tra network**:
   - Proxy configuration
   - Firewall settings
   - Load balancer timeout (nếu có)

3. **Kiểm tra logs**:
```bash
# Terminal 1: Backend logs
cd /srv/education/education-bot-server
tail -f accesslog/api/chat.log

# Terminal 2: Frontend dev server logs
npm run dev
```

### Backend timeout configuration (nếu cần)

Kiểm tra file backend và tăng timeout nếu cần:

```javascript
// Express server
server.timeout = 120000; // 120 seconds

// AI service
const timeout = 120000; // 120 seconds
```

## Giải pháp dài hạn

### 1. Implement Streaming
Thay vì đợi toàn bộ response, implement streaming để:
- Frontend nhận từng phần response
- User thấy progress ngay lập tức
- Tránh timeout

### 2. Backend optimization
- Cache AI responses
- Optimize prompts
- Use faster AI models for simple queries

### 3. Frontend optimization
- Show progress indicator
- Implement request queuing
- Add retry mechanism with exponential backoff

## Kết luận

Fix này giải quyết vấn đề timeout bằng cách:
✅ Tăng timeout cho Vite proxy (120s)
✅ Tăng timeout cho Axios client (120s)
✅ Cải thiện error handling cho timeout và 502 errors
✅ User nhận được thông báo lỗi rõ ràng hơn

**Note**: Đây là giải pháp tạm thời. Giải pháp tốt nhất là implement streaming để tránh timeout hoàn toàn.

