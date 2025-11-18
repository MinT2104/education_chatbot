# Plan Management System

## Tổng quan

Hệ thống quản lý plan động cho phép admin tạo, chỉnh sửa và quản lý các gói subscription mà không cần hardcode trong code.

## Tính năng đã implement

### 1. **Types & Interfaces** (`src/features/payment/types/plan.ts`)
- `Plan`: Interface chính cho plan
- `PlanFeature`: Interface cho các tính năng của plan
- `CreatePlanInput`: Interface cho việc tạo plan mới
- `UpdatePlanInput`: Interface cho việc cập nhật plan

### 2. **API Service Methods** (`src/features/payment/services/paymentService.ts`)
Các method mới được thêm vào:
- `getAllPlans()`: Lấy tất cả plans
- `getPlanById(planId)`: Lấy plan theo ID
- `createPlan(data)`: Tạo plan mới (admin only)
- `updatePlan(data)`: Cập nhật plan (admin only)
- `deletePlan(planId)`: Xóa plan (admin only)

### 3. **Admin Plan Management Component** (`src/features/admin/components/plans/AdminPlanManagement.tsx`)
Component quản lý plans với các tính năng:
- ✅ Hiển thị danh sách plans dạng grid
- ✅ Thêm plan mới
- ✅ Chỉnh sửa plan
- ✅ Xóa plan (với confirmation dialog)
- ✅ Quản lý features của plan (thêm, sửa, xóa)
- ✅ Toggle active/inactive status
- ✅ Thiết lập display order
- ✅ Thiết lập giá khác nhau cho government và private schools
- ✅ Thiết lập limits cho free plans
- ✅ Badge cho plans (NEW, POPULAR, etc.)

### 4. **Dynamic Pricing Page** (`src/features/payment/pages/PricingPage.tsx`)
PricingPage đã được cập nhật để:
- ✅ Fetch plans động từ API
- ✅ Hiển thị tất cả active plans
- ✅ Hiển thị features động từ database
- ✅ Hiển thị giá khác nhau theo school category
- ✅ Loading state khi fetch data
- ✅ Empty state khi không có plans

### 5. **Admin Tab Integration**
- ✅ Thêm tab "Plans" trong admin panel
- ✅ Icon Package cho tab Plans
- ✅ Full responsive design

## Cấu trúc Plan

```typescript
interface Plan {
  id: string;
  code: string; // 'free' | 'go' | custom
  name: string;
  description: string;
  priceGovernment: number; // INR
  pricePrivate: number; // INR
  currency: string; // 'INR'
  billingPeriod: string; // 'month' | 'year'
  features: PlanFeature[];
  badge?: string; // e.g., 'NEW', 'POPULAR'
  isActive: boolean;
  displayOrder: number;
  limitGovernment?: number; // messages/day for free plans
  limitPrivate?: number; // messages/day for free plans
}

interface PlanFeature {
  id: string;
  text: string;
  enabled: boolean;
}
```

## Hướng dẫn sử dụng

### 1. Truy cập Admin Panel
1. Đăng nhập với tài khoản admin
2. Vào `/admin`
3. Click vào tab **"Plans"**

### 2. Tạo Plan mới
1. Click button **"Add Plan"**
2. Điền thông tin:
   - **Plan Code**: Mã định danh unique (ví dụ: free, go, premium)
   - **Plan Name**: Tên hiển thị (ví dụ: Free, Go, Premium)
   - **Description**: Mô tả ngắn về plan
   - **Government Price**: Giá cho trường công lập (INR)
   - **Private Price**: Giá cho trường tư (INR)
   - **Limits**: Giới hạn messages/day (nếu là free plan)
   - **Badge**: Nhãn hiển thị (ví dụ: NEW, POPULAR)
   - **Display Order**: Thứ tự hiển thị (số nhỏ hơn hiển thị trước)
   - **Active**: Toggle để bật/tắt plan
3. Thêm features:
   - Click **"Add Feature"**
   - Nhập nội dung feature
   - Toggle enabled/disabled cho từng feature
4. Click **"Save Plan"**

### 3. Chỉnh sửa Plan
1. Click icon **Pencil** trên plan card
2. Chỉnh sửa thông tin cần thiết
3. Click **"Save Plan"**

### 4. Xóa Plan
1. Click icon **Trash** trên plan card
2. Confirm trong dialog
3. Plan sẽ bị xóa vĩnh viễn

### 5. Quản lý Features
Trong dialog Create/Edit:
- Click **"Add Feature"** để thêm feature mới
- Nhập text description cho feature
- Toggle switch để enable/disable feature
- Click icon **Trash** để xóa feature
- Drag icon **GripVertical** để sắp xếp (future feature)

## API Endpoints (Backend cần implement)

### GET `/payment/plans`
Lấy tất cả plans
```json
Response: Plan[]
```

### GET `/payment/plans/:id`
Lấy plan theo ID
```json
Response: Plan
```

### POST `/payment/plans`
Tạo plan mới (Admin only)
```json
Request: {
  code: string,
  name: string,
  description: string,
  priceGovernment: number,
  pricePrivate: number,
  currency: string,
  billingPeriod: string,
  features: { text: string, enabled: boolean }[],
  badge?: string,
  isActive: boolean,
  displayOrder: number,
  limitGovernment?: number,
  limitPrivate?: number
}
Response: Plan
```

### PUT `/payment/plans/:id`
Cập nhật plan (Admin only)
```json
Request: Same as POST (partial update)
Response: Plan
```

### DELETE `/payment/plans/:id`
Xóa plan (Admin only)
```json
Response: {
  success: boolean,
  message: string
}
```

## Database Schema Example

### Table: plans
```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price_government DECIMAL(10, 2) NOT NULL DEFAULT 0,
  price_private DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'INR',
  billing_period VARCHAR(20) DEFAULT 'month',
  badge VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  limit_government INTEGER,
  limit_private INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: plan_features
```sql
CREATE TABLE plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

### Frontend Testing
1. Truy cập `/pricing` để xem plans được hiển thị động
2. Thay đổi category (Government/Private) để xem giá thay đổi
3. Kiểm tra loading state
4. Kiểm tra empty state (khi không có plans)

### Admin Testing
1. Tạo plan mới với đầy đủ thông tin
2. Thêm features cho plan
3. Toggle active/inactive
4. Chỉnh sửa plan
5. Xóa plan
6. Verify changes xuất hiện ngay lập tức trên `/pricing`

## Notes

### Migration từ hardcoded plans
Nếu bạn có plans hardcoded trước đó, cần:
1. Tạo migration script để import plans vào database
2. Đảm bảo `code` field match với logic hiện tại (free, go, etc.)
3. Test kỹ trước khi deploy

### Security
- Tất cả endpoints admin cần authentication & authorization
- Validate input data ở backend
- Sanitize user input để tránh XSS

### Performance
- Plans được cache ở frontend sau khi fetch
- Consider thêm caching layer ở backend
- Index trên `is_active` và `display_order` fields

## Future Enhancements

- [ ] Drag & drop để sắp xếp features
- [ ] Bulk actions (activate/deactivate multiple plans)
- [ ] Plan templates
- [ ] Copy plan feature
- [ ] Plan analytics (số người subscribe mỗi plan)
- [ ] A/B testing cho plans
- [ ] Multi-currency support
- [ ] Seasonal pricing
- [ ] Discount codes integration

## Development & Testing

### Sử dụng Mock Data
Nếu backend chưa sẵn sàng, bạn có thể sử dụng mock data:

1. Mở file `src/features/payment/data/mockPlans.ts`
2. Thay đổi `USE_MOCK_PLANS = false` thành `USE_MOCK_PLANS = true`
3. Pricing page sẽ hiển thị mock data
4. Khi backend sẵn sàng, set lại `USE_MOCK_PLANS = false`

### Response Format Handling
Service đã được cấu hình để handle nhiều response formats:
- Array trực tiếp: `[{...}, {...}]`
- Object với key `plans`: `{ plans: [{...}] }`
- Object với key `data`: `{ data: [{...}] }`
- 404 Error: Tự động fallback về mock data

## Troubleshooting

### Plans không hiển thị trên Pricing Page
- Kiểm tra plans có `isActive = true` không
- Check API endpoint `/payment/plans` có hoạt động không
- Xem console log cho errors
- Thử enable mock data để test: `USE_MOCK_PLANS = true`

### Lỗi "data.filter is not a function"
- ✅ ĐÃ FIX: Service đã handle multiple response formats
- Nếu vẫn gặp lỗi, kiểm tra backend response structure
- Enable mock data để isolate vấn đề

### Không thể tạo/sửa plan
- Kiểm tra authentication (phải là admin)
- Validate input data
- Check backend logs cho errors

### Features không hiển thị đúng
- Kiểm tra `enabled` field của features
- Verify JSON structure của features array
- Check nếu có lỗi parse JSON

## Support

Nếu có vấn đề, liên hệ dev team hoặc tạo issue trên repository.

