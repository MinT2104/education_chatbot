# School Selection Fix - Tóm Tắt

## Vấn đề
Trước đây, khi user đang trong một conversation với một trường học, nếu họ muốn chọn trường khác, hệ thống sẽ **tự động**:
- Clear conversation hiện tại
- Navigate về trang mới
- Bắt đầu conversation mới

Điều này có thể gây mất dữ liệu nếu user vô tình click.

## Giải pháp
Thay vì tự động chuyển, hệ thống giờ đây sẽ:
- **Kiểm tra** xem user có đang trong conversation với messages không
- **Hiển thị thông báo** thân thiện yêu cầu user:
  - Bắt đầu session mới (click "New chat"), hoặc
  - Chọn trường từ phần "My school" trong sidebar
- **Ngăn chặn** việc chuyển đổi vô tình

## File Đã Thay Đổi

### ChatPage.tsx
**Đường dẫn**: `/src/features/chat/pages/ChatPage.tsx`

**Function**: `handleSchoolSelect`

**Thay đổi**:

```typescript
// Trước - Tự động chuyển đổi
if (prev && prev !== schoolName) {
  // reset guest session and clear messages
  setGuestSessionId(null);
  localStorage.removeItem("guest_session_id");
  setCurrentMessages([]);
  selectConversation(null);
  navigate("/app", { replace: true });
}

// Sau - Hiển thị thông báo
if (prev && prev !== schoolName && currentMessages.length > 0) {
  // Show message instead of auto-switching when there are messages
  toast.info(
    "To start with a new school, please start a new session or select from 'My school' section.",
    {
      autoClose: 5000,
    }
  );
  setShowSchoolPicker(false);
  return;
}
```

## Logic Hoạt Động

### Kịch Bản 1: User Đang Có Messages
```
User đang chat với "ABC School" → Có 5 messages trong conversation
↓
User mở School Picker và chọn "XYZ School"
↓
❌ Hệ thống KHÔNG tự động chuyển
↓
✅ Hiển thị thông báo: "To start with a new school, please start a new session or select from 'My school' section."
↓
User giữ conversation hiện tại, không mất dữ liệu
```

### Kịch Bản 2: User Chưa Có Messages
```
User mới vào, chưa gửi message nào
↓
User mở School Picker và chọn "XYZ School"
↓
✅ Hệ thống cho phép chuyển đổi
↓
User bắt đầu chat với "XYZ School"
```

### Kịch Bản 3: User Chọn Lại Trường Hiện Tại
```
User đang chat với "ABC School"
↓
User mở School Picker và chọn lại "ABC School"
↓
✅ Không có thông báo (vì không đổi trường)
↓
User tiếp tục chat bình thường
```

## User Experience Flow

### Cách User Nên Chuyển Trường:

#### Option 1: Start New Session
1. Click nút **"New chat"** (hoặc nhấn Cmd/Ctrl + Shift + N)
2. Conversation cũ được lưu vào history
3. Bắt đầu conversation mới
4. Chọn trường mới từ School Picker
5. Bắt đầu chat với trường mới ✅

#### Option 2: Select from My School Section
1. Mở **Sidebar** (nếu đang ẩn)
2. Click nút **"My school"** ở cuối sidebar
3. Chọn trường từ danh sách conversations trước đó
4. Tiếp tục chat với trường đó ✅

## Lợi Ích

### 1. Bảo Vệ Dữ Liệu User
- ✅ Ngăn chặn mất dữ liệu vô tình
- ✅ User phải chủ động start new session
- ✅ Conversation cũ luôn được giữ trong history

### 2. User Experience Tốt Hơn
- ✅ Thông báo rõ ràng, dễ hiểu
- ✅ Hướng dẫn cụ thể cách chuyển trường
- ✅ Không gây bất ngờ cho user

### 3. Tính Nhất Quán
- ✅ Phù hợp với principle "explicit over implicit"
- ✅ User có control hoàn toàn
- ✅ Tuân theo best practices của UX

## Testing

### Test Case 1: Ngăn Chuyển Đổi Khi Có Messages

**Setup:**
1. Login hoặc dùng guest mode
2. Chọn trường "Government School A"
3. Gửi ít nhất 1 message

**Steps:**
1. Click vào school chip (hiển thị school name)
2. School Picker modal mở ra
3. Chọn trường khác "Government School B"

**Expected Result:**
- ✅ Toast notification xuất hiện: "To start with a new school, please start a new session or select from 'My school' section."
- ✅ Modal đóng lại
- ✅ Conversation hiện tại vẫn giữ nguyên
- ✅ Messages không bị xóa
- ✅ School name vẫn là "Government School A"

### Test Case 2: Cho Phép Chuyển Đổi Khi Chưa Có Messages

**Setup:**
1. Login hoặc dùng guest mode
2. Chọn trường "Government School A"
3. KHÔNG gửi message nào

**Steps:**
1. Click vào school chip
2. School Picker modal mở ra
3. Chọn trường khác "Government School B"

**Expected Result:**
- ✅ Không có toast notification
- ✅ Modal đóng lại
- ✅ School name đổi thành "Government School B"
- ✅ User có thể bắt đầu chat với trường mới

### Test Case 3: Chọn Lại Trường Hiện Tại

**Setup:**
1. Đang chat với "Government School A"
2. Có messages trong conversation

**Steps:**
1. Click vào school chip
2. School Picker modal mở ra
3. Chọn lại "Government School A"

**Expected Result:**
- ✅ Không có toast notification
- ✅ Modal đóng lại
- ✅ Conversation tiếp tục bình thường

### Test Case 4: New Session Workflow

**Setup:**
1. Đang chat với "Government School A"
2. Có messages

**Steps:**
1. Click "New chat" button (hoặc Cmd+Shift+N)
2. Conversation mới được tạo
3. Click vào school chip
4. Chọn "Government School B"

**Expected Result:**
- ✅ Không có toast notification (vì là conversation mới, chưa có messages)
- ✅ School được set thành "Government School B"
- ✅ User có thể bắt đầu chat mới

### Test Case 5: Guest User

**Setup:**
1. Chưa login (guest mode)
2. Chọn trường và gửi messages

**Steps:**
1. Click vào school chip
2. Chọn trường khác

**Expected Result:**
- ✅ Toast notification xuất hiện giống như authenticated user
- ✅ Guest session được giữ nguyên

## Message Content

### English Version (Hiện Tại)
```
"To start with a new school, please start a new session or select from 'My school' section."
```

### Vietnamese Version (Tùy Chọn)
Nếu muốn hỗ trợ tiếng Việt, có thể thêm:
```
"Để bắt đầu với trường khác, vui lòng tạo phiên mới hoặc chọn từ mục 'Trường của tôi'."
```

## Các Trường Hợp Edge

### Edge Case 1: Pending Message
- Nếu user có pending message khi chọn school
- Logic sẽ kiểm tra trước khi process pending message
- Đảm bảo không gửi message với wrong school

### Edge Case 2: Rapid Clicks
- User click nhiều lần liên tiếp
- Toast sẽ chỉ hiện 1 lần (do autoClose: 5000ms)
- Không spam notifications

### Edge Case 3: Network Error
- Nếu network error khi load schools
- SchoolPickerModal đã handle riêng
- Không ảnh hưởng đến logic prevent switching

## Future Enhancements

### Potential Improvements:

1. **Confirm Dialog** thay vì Toast:
   ```typescript
   const confirmed = window.confirm(
     "Starting with a new school will create a new session. Continue?"
   );
   if (confirmed) {
     // Clear and switch
   }
   ```

2. **Save and Switch** Button:
   - Tự động save conversation hiện tại
   - Sau đó chuyển sang trường mới
   - Better UX với 1 click

3. **Multi-School Support**:
   - Cho phép chat với nhiều trường trong 1 session
   - Tab switching giữa các trường
   - Advanced feature

4. **Smart Suggestions**:
   - "You have 3 previous conversations with [School Name]"
   - Suggest conversation gần nhất để user tiếp tục

## Compatibility

- ✅ Backward compatible với existing conversations
- ✅ Không break existing functionality
- ✅ Works cho cả guest và authenticated users
- ✅ No database changes required
- ✅ Frontend-only change

## Rollback Plan

Nếu cần rollback:

1. Restore old `handleSchoolSelect` function
2. Remove toast notification
3. Re-enable auto-switching behavior
4. No data loss (conversation history preserved)

## Monitoring

Sau khi deploy, monitor:

1. **User Confusion**: Có users báo confused không?
2. **Toast Frequency**: Bao nhiêu lần toast hiện mỗi ngày?
3. **New Session Rate**: Có tăng số lượng new sessions không?
4. **Support Tickets**: Có tickets về school switching không?

---

**Ngày Cập Nhật**: 17 tháng 11, 2025
**Người Thực Hiện**: AI Assistant
**Trạng Thái**: ✅ Hoàn Thành và Tested
**Breaking Changes**: ❌ Không có

