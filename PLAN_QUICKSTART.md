# Plan Management - Quick Start Guide

## ✅ FIXED: Backend Integration

### Backend Response Format (Đã hỗ trợ)
Backend hiện trả về:
```json
{
  "success": true,
  "plans": {
    "free": ["feature1", "feature2", ...],
    "premium": ["feature1", "feature2", ...]
  }
}
```

✅ **Frontend đã tự động transform** sang Plan[] format!

⚠️ **Note:** Giá (pricing) hiện đang hardcoded trong frontend vì backend chưa cung cấp. Xem `BACKEND_INTEGRATION.md` để nâng cấp.

---

## 🚀 Bắt đầu nhanh

### Để test với backend thực:

1. **Enable Mock Data**
   ```typescript
   // File: src/features/payment/data/mockPlans.ts
   export const USE_MOCK_PLANS = true; // Đổi thành true
   ```

2. **Xem Pricing Page**
   - Truy cập: `http://localhost:5173/pricing`
   - Sẽ thấy 2 plans: Free và Go
   - Switch giữa Government/Private để xem giá khác nhau

3. **Quản lý Plans (Admin)**
   - Truy cập: `http://localhost:5173/admin`
   - Click tab "Plans"
   - Tạo, sửa, xóa plans

### Khi backend đã sẵn sàng:

1. **Disable Mock Data**
   ```typescript
   // File: src/features/payment/data/mockPlans.ts
   export const USE_MOCK_PLANS = false; // Đổi thành false
   ```

2. **Backend cần implement các endpoints:**
   ```
   GET    /payment/plans          → Trả về Plan[]
   GET    /payment/plans/:id      → Trả về Plan
   POST   /payment/plans          → Tạo plan mới (admin)
   PUT    /payment/plans/:id      → Update plan (admin)
   DELETE /payment/plans/:id      → Xóa plan (admin)
   ```

3. **Response format** (chọn 1 trong 3):
   ```typescript
   // Option 1: Array trực tiếp (recommended)
   [{ id: "1", code: "free", ... }, ...]
   
   // Option 2: Object với key "plans"
   { plans: [{ id: "1", ... }], total: 2 }
   
   // Option 3: Object với key "data"
   { data: [{ id: "1", ... }], success: true }
   ```

## ✅ Đã fix

### Lỗi: "data.filter is not a function"
**Nguyên nhân:** Backend trả về object thay vì array

**Giải pháp đã implement:**
- ✅ Service tự động detect response format
- ✅ Handle cả 3 format phổ biến
- ✅ Fallback về mock data khi endpoint 404
- ✅ Error handling tốt hơn

**Code đã sửa:**
```typescript
// PricingPage.tsx và AdminPlanManagement.tsx
let data: Plan[] = [];
if (Array.isArray(response)) {
  data = response;
} else if (response && typeof response === 'object') {
  data = (response as any).plans || (response as any).data || [];
}
```

## 📁 Files quan trọng

```
src/features/payment/
├── types/plan.ts                    # Type definitions
├── data/mockPlans.ts               # Mock data (toggle here!)
├── services/paymentService.ts      # API calls
└── pages/PricingPage.tsx           # Public pricing page

src/features/admin/
├── components/
│   ├── plans/AdminPlanManagement.tsx  # Admin UI
│   └── AdminTabs.tsx                  # Tab navigation
└── pages/AdminPage.tsx               # Admin main page
```

## 🎯 Workflow thông thường

### Tạo plan mới:
1. Vào Admin → Plans
2. Click "Add Plan"
3. Điền form:
   - Code: `premium`
   - Name: `Premium`
   - Giá Government: `599`
   - Giá Private: `799`
   - Badge: `POPULAR`
4. Add features
5. Toggle Active ON
6. Save

### Plan sẽ hiển thị ngay trên Pricing Page!

## 🔍 Debug Tips

### Check console logs:
```javascript
// Sẽ thấy logs:
"Using mock plans data"              // Nếu USE_MOCK_PLANS = true
"Plans endpoint not implemented yet" // Nếu backend chưa có
```

### Test response format:
```javascript
// Trong browser console:
fetch('/api/payment/plans')
  .then(r => r.json())
  .then(console.log)
```

### Enable mock data tạm:
```typescript
// Trong paymentService.ts, dòng 166
if (true) { // Force mock data
  return Promise.resolve(mockPlans);
}
```

## 💡 Pro Tips

1. **Development mode:** Luôn enable mock data
2. **Test UI changes:** Sửa trực tiếp trong `mockPlans.ts`
3. **Backend integration:** Test từng endpoint một
4. **Production:** Đảm bảo `USE_MOCK_PLANS = false`

## 🆘 Cần giúp?

Xem chi tiết trong `PLAN_MANAGEMENT.md`

---
**Status:** ✅ Frontend hoàn thành, đang chờ backend implement endpoints

