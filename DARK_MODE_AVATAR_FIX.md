# Dark Mode Avatar Fix - Tóm Tắt

## Vấn đề
Avatar của AI đang sử dụng cố định `model_icon_dark.png` cho cả light mode và dark mode, làm cho icon khó nhìn trong dark mode.

## Giải pháp
Cập nhật avatar để tự động chuyển đổi giữa light và dark icon dựa trên theme hiện tại:
- **Light Mode**: Sử dụng `model_icon_dark.png` (icon tối trên nền sáng)
- **Dark Mode**: Sử dụng `model_icon_light.png` (icon sáng trên nền tối)

## Files Đã Thay Đổi

### 1. MessageBubble.tsx
**Đường dẫn**: `/src/features/chat/components/MessageBubble.tsx`

**Thay đổi**:
```typescript
// Trước
import assistantAvatar from "../../../public/model_icon_dark.png";

// Sau
import assistantAvatarDark from "../../../public/model_icon_dark.png";
import assistantAvatarLight from "../../../public/model_icon_light.png";
import { useAppSelector } from "../../../core/store/hooks";

// Trong component
const isDark = useAppSelector((s) => s.ui.isDark);
const assistantAvatar = isDark ? assistantAvatarLight : assistantAvatarDark;
```

**Mục đích**: Avatar trong tin nhắn của AI sẽ tự động đổi theo theme.

### 2. ChatArea.tsx
**Đường dẫn**: `/src/features/chat/components/ChatArea.tsx`

**Thay đổi**:
```typescript
// Trước
import assistantAvatar from "../../../public/model_icon_dark.png";

// Sau
import assistantAvatarDark from "../../../public/model_icon_dark.png";
import assistantAvatarLight from "../../../public/model_icon_light.png";
import { useAppSelector } from "../../../core/store/hooks";

// Trong component
const isDark = useAppSelector((s) => s.ui.isDark);
const assistantAvatar = isDark ? assistantAvatarLight : assistantAvatarDark;
```

**Mục đích**: Avatar trong streaming indicator (khi AI đang trả lời) sẽ tự động đổi theo theme.

## Logic Hoạt Động

```typescript
const isDark = useAppSelector((s) => s.ui.isDark);
const assistantAvatar = isDark ? assistantAvatarLight : assistantAvatarDark;
```

- Lấy trạng thái dark mode từ Redux store
- Nếu `isDark = true` → sử dụng `model_icon_light.png`
- Nếu `isDark = false` → sử dụng `model_icon_dark.png`

## Kiểm Tra

### Cách Test:

1. **Light Mode**:
   - Mở ứng dụng ở light mode
   - Avatar AI sẽ hiển thị màu tối (dễ nhìn trên nền sáng) ✅

2. **Dark Mode**:
   - Chuyển sang dark mode (click icon mặt trời/mặt trăng ở góc phải)
   - Avatar AI sẽ tự động chuyển sang màu sáng (dễ nhìn trên nền tối) ✅

3. **Streaming**:
   - Gửi một tin nhắn và quan sát khi AI đang trả lời
   - Avatar trong streaming indicator cũng sẽ đổi theo theme ✅

### Các Trường Hợp Cần Test:

- [ ] Avatar trong tin nhắn (MessageBubble) - Light mode
- [ ] Avatar trong tin nhắn (MessageBubble) - Dark mode
- [ ] Avatar trong streaming indicator - Light mode
- [ ] Avatar trong streaming indicator - Dark mode
- [ ] Chuyển đổi theme real-time (không cần refresh)

## Tính Nhất Quán

Sau thay đổi này, tất cả các icon trong ứng dụng đều tuân theo cùng một pattern:

| Component | Light Mode | Dark Mode |
|-----------|-----------|-----------|
| Sidebar Logo | `model_icon_dark.png` | `model_icon_light.png` |
| TopBar Icon | `model_icon_dark.png` | `model_icon_light.png` |
| Message Avatar | `model_icon_dark.png` | `model_icon_light.png` ✅ (mới) |
| Streaming Avatar | `model_icon_dark.png` | `model_icon_light.png` ✅ (mới) |

## Kết Quả

✅ Avatar AI giờ đây sẽ luôn dễ nhìn trong cả light mode và dark mode
✅ Tự động chuyển đổi khi user thay đổi theme
✅ Không cần refresh trang
✅ Nhất quán với các component khác trong ứng dụng
✅ Không có lỗi linter
✅ Type-safe với TypeScript

---

**Ngày Cập Nhật**: 17 tháng 11, 2025
**Người Thực Hiện**: AI Assistant
**Trạng Thái**: ✅ Hoàn Thành

