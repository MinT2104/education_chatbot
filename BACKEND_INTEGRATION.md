# Backend Integration Guide - Plan Management

## Backend Response Format (Hiện tại)

Backend đang trả về format:

```json
{
  "success": true,
  "plans": {
    "free": [
      "Access to GPT-5",
      "Limited file uploads",
      "Limited and slower image generation"
    ],
    "premium": [
      "Unlimited Access to GPT-5",
      "Unlimited messaging and uploads",
      "Priority support"
    ]
  }
}
```

## Frontend Transformation

Service layer tự động transform response này thành `Plan[]`:

```typescript
// Input từ backend:
{
  plans: {
    free: ["feature1", "feature2"],
    premium: ["feature1", "feature2"]
  }
}

// Output sau transform:
[
  {
    id: "plan-free-...",
    code: "free",
    name: "Free",
    description: "free plan features",
    priceGovernment: 0,
    pricePrivate: 0,
    currency: "INR",
    billingPeriod: "month",
    isActive: true,
    displayOrder: 0,
    features: [
      { id: "free-f0", text: "feature1", enabled: true },
      { id: "free-f1", text: "feature2", enabled: true }
    ]
  },
  // ... premium plan
]
```

## ⚠️ Limitation của Current Backend Format

Current format **chỉ có features**, thiếu các thông tin quan trọng:
- ❌ Pricing (giá Government vs Private)
- ❌ Description
- ❌ Badge (NEW, POPULAR)
- ❌ Display order
- ❌ Active status
- ❌ Billing period

Frontend đang **hardcode** các giá trị này trong transformation:
```typescript
priceGovernment: planCode === 'free' ? 0 : 299,  // ⚠️ Hardcoded
pricePrivate: planCode === 'free' ? 0 : 399,     // ⚠️ Hardcoded
```

## 🎯 Recommended Backend Format (Future)

Để support full features, backend nên trả về:

```json
{
  "success": true,
  "plans": [
    {
      "id": "plan-free-001",
      "code": "free",
      "name": "Free",
      "description": "Intelligence for everyday tasks",
      "priceGovernment": 0,
      "pricePrivate": 0,
      "currency": "INR",
      "billingPeriod": "month",
      "badge": null,
      "isActive": true,
      "displayOrder": 0,
      "limitGovernment": 50,
      "limitPrivate": 25,
      "features": [
        {
          "id": "f1",
          "text": "Access to GPT-5",
          "enabled": true
        },
        {
          "id": "f2",
          "text": "Limited file uploads",
          "enabled": true
        }
      ]
    },
    {
      "id": "plan-go-001",
      "code": "go",
      "name": "Go",
      "description": "More access to popular features",
      "priceGovernment": 299,
      "pricePrivate": 399,
      "currency": "INR",
      "billingPeriod": "month",
      "badge": "NEW",
      "isActive": true,
      "displayOrder": 1,
      "features": [...]
    }
  ]
}
```

### Benefits:
- ✅ Admin có thể quản lý giá dynamic
- ✅ Support Government vs Private pricing
- ✅ Support badges, display order
- ✅ Support active/inactive plans
- ✅ Flexible billing periods

## Migration Path

### Phase 1: Current (✅ Đã implement)
- Backend: Trả về `{ plans: { free: [], premium: [] } }`
- Frontend: Transform sang Plan[] với hardcoded prices
- Works: Có, nhưng giá bị hardcode

### Phase 2: Enhanced Backend (Recommended)
**Backend changes needed:**

1. **Database schema** (như trong `PLAN_MANAGEMENT.md`)
   ```sql
   CREATE TABLE plans (
     id UUID PRIMARY KEY,
     code VARCHAR(50) UNIQUE,
     name VARCHAR(100),
     description TEXT,
     price_government DECIMAL(10,2),
     price_private DECIMAL(10,2),
     ...
   );
   
   CREATE TABLE plan_features (
     id UUID PRIMARY KEY,
     plan_id UUID REFERENCES plans(id),
     text TEXT,
     enabled BOOLEAN,
     ...
   );
   ```

2. **Update GET /payment/plans endpoint**
   ```javascript
   // Instead of:
   res.json({
     success: true,
     plans: {
       free: features,
       premium: features
     }
   });
   
   // Return:
   res.json({
     success: true,
     plans: [
       { id, code, name, priceGovernment, pricePrivate, features: [...] },
       ...
     ]
   });
   ```

3. **Frontend changes** (minimal)
   - Service layer đã support cả 2 formats
   - Nếu detect array format → dùng trực tiếp
   - Nếu detect object format → transform (như hiện tại)
   - No changes needed trong components!

## Testing Current Integration

### 1. Test với current backend format:
```bash
# Backend trả về:
GET /api/payment/plans
{
  "success": true,
  "plans": {
    "free": ["feature1", "feature2"],
    "go": ["feature1", "feature2"]
  }
}

# Frontend sẽ:
1. Detect object format
2. Transform sang Plan[]
3. Hardcode giá (299/399)
4. Display trên UI
```

### 2. Verify transformation:
```javascript
// Trong browser console:
const plans = await paymentService.getAllPlans();
console.log(plans);
// Should see Plan[] with proper structure
```

### 3. Check PricingPage:
- Vào `/pricing`
- Should see plans hiển thị
- Switch Government/Private → giá thay đổi (299 vs 399)

## Features Backend Response Format

Backend có thể trả về features dạng:

### Format 1: Array of strings (Current)
```json
{
  "plans": {
    "free": [
      "Access to GPT-5",
      "Limited file uploads"
    ]
  }
}
```
✅ Frontend handles: Transform thành `{ text: "...", enabled: true }`

### Format 2: Array of objects (Better)
```json
{
  "plans": {
    "free": [
      { "text": "Access to GPT-5", "enabled": true },
      { "text": "Limited uploads", "enabled": false }
    ]
  }
}
```
✅ Frontend handles: Dùng trực tiếp

### Format 3: Array of objects with more fields
```json
{
  "plans": {
    "free": [
      { 
        "id": "f1",
        "name": "GPT-5 Access",
        "description": "Full access to GPT-5",
        "enabled": true
      }
    ]
  }
}
```
✅ Frontend handles: Extract `text` từ `name` hoặc `description`

## Summary

| Aspect | Current Status | Action Needed |
|--------|---------------|---------------|
| Backend format | `{ plans: { free: [] } }` | ✅ Working |
| Frontend transform | ✅ Implemented | None |
| Pricing | ⚠️ Hardcoded in frontend | Backend should provide |
| Plan metadata | ❌ Missing | Backend should provide |
| Admin CRUD | ⚠️ Frontend ready | Backend endpoints needed |

## Next Steps

1. **Short term (Current working state)**
   - ✅ Frontend transforms current backend format
   - ✅ Displays plans with hardcoded prices
   - ⚠️ Admin can't change prices (hardcoded)

2. **Medium term (Recommended)**
   - [ ] Backend implements Plan table
   - [ ] Backend returns full Plan[] format
   - [ ] Admin can manage plans dynamically
   - [ ] Frontend works automatically (already supports it!)

3. **Long term**
   - [ ] Backend implements all CRUD endpoints
   - [ ] Migration script for existing plans
   - [ ] Analytics and reporting

## Contact

Backend team: Please implement full Plan[] format như documented trong `PLAN_MANAGEMENT.md`

Frontend team: Current code đã sẵn sàng handle cả 2 formats! ✅

