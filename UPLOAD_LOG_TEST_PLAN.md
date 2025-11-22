# Upload Activity Log - Test Plan

## 🧪 Test Cases

### Test Case 1: Successful Upload (Happy Path)
**Objective:** Verify logs hiển thị đúng cho upload thành công

**Steps:**
1. Login vào Admin Panel
2. Navigate to Documents tab
3. Click "Upload Document"
4. Fill form:
   - Document Name: "Test Math Grade 8"
   - School: Any school
   - Grade: "Grade 8"
   - Subject: "Mathematics"
   - File: Upload small PDF (< 5MB)
5. Click "Upload & Index"
6. Observe Upload Activity Log

**Expected Results:**
```
✅ Log hiển thị các bước:
[HH:MM:SS.mmm] 🔍 Bắt đầu kiểm tra dữ liệu form
[HH:MM:SS.mmm] ✓ Tên tài liệu hợp lệ: Test Math Grade 8
[HH:MM:SS.mmm] ✓ Trường học hợp lệ: [School Name]
[HH:MM:SS.mmm] ✓ Lớp/Khối hợp lệ: Grade 8
[HH:MM:SS.mmm] ✓ Môn học hợp lệ: Mathematics
[HH:MM:SS.mmm] ✓ File hợp lệ: test.pdf (X.XXMB)
[HH:MM:SS.mmm] 📦 Chuẩn bị dữ liệu upload
[HH:MM:SS.mmm] 🚀 Bắt đầu upload lên server Python: [URL]
[HH:MM:SS.mmm] 📊 Đang upload: 10%: ...
[HH:MM:SS.mmm] 📊 Đang upload: 20%: ...
...
[HH:MM:SS.mmm] ✅ Upload thành công!: Tổng thời gian: X.Xs
[HH:MM:SS.mmm] 🔄 Server đang xử lý và indexing file...
[HH:MM:SS.mmm] ✅ Hoàn tất toàn bộ quá trình!
```

✅ Dialog đóng sau 2 giây
✅ Success toast hiển thị
✅ Document xuất hiện trong list

---

### Test Case 2: Validation Errors
**Objective:** Verify validation logs

**Steps:**
1. Open Upload Dialog
2. Leave "Document Name" empty
3. Click "Upload & Index"
4. Observe logs

**Expected Results:**
```
[HH:MM:SS.mmm] 🔍 Bắt đầu kiểm tra dữ liệu form
[HH:MM:SS.mmm] ❌ Thiếu tên tài liệu
```
✅ Red error message
✅ Upload stopped at validation

**Repeat for:**
- Missing School → `❌ Chưa chọn trường học`
- Missing Grade → `❌ Chưa chọn lớp/khối`
- Missing Subject → `❌ Chưa chọn môn học`
- Missing File → `❌ Chưa chọn file`

---

### Test Case 3: Large File Upload
**Objective:** Verify progress tracking cho large file

**Steps:**
1. Open Upload Dialog
2. Fill form with valid data
3. Select large PDF (20-50MB)
4. Click "Upload & Index"
5. Observe logs và progress bar

**Expected Results:**
```
✅ Progress logs mỗi 10% hoặc 5 giây
✅ Hiển thị MB uploaded / total MB
✅ Hiển thị thời gian đã trôi qua
✅ Progress bar sync với % trong logs
✅ No stuck warnings nếu upload smooth
```

Example log:
```
📊 Đang upload: 10%: 2.50MB / 25.00MB - Thời gian: 3.2s
📊 Đang upload: 20%: 5.00MB / 25.00MB - Thời gian: 6.8s
📊 Đang upload: 30%: 7.50MB / 25.00MB - Thời gian: 10.1s
```

---

### Test Case 4: Slow Network (Simulated Stuck)
**Objective:** Verify stuck detection

**Steps:**
1. Open Chrome DevTools → Network tab
2. Throttle to "Slow 3G"
3. Upload medium file (10-20MB)
4. Observe logs

**Expected Results:**
```
After 30s without progress:
⚠️ Upload có vẻ bị chậm: Đã 30s không có tiến trình mới

After 60s without progress:
⏱️ Cảnh báo: Upload đang bị stuck: Không có tiến trình trong 60s. Progress: X%
🔍 Đang kiểm tra kết nối...: Thời gian đã trôi qua: Xs
```

✅ Warnings màu vàng
✅ Không tự động cancel upload
✅ User có thể cancel manually

---

### Test Case 5: Server Error (502)
**Objective:** Verify error logging

**Steps:**
1. Stop Python server (hoặc set wrong URL)
2. Try upload
3. Observe logs

**Expected Results:**
```
[HH:MM:SS] 🔍 Bắt đầu kiểm tra dữ liệu form
[HH:MM:SS] ✓ ... (all validations pass)
[HH:MM:SS] 📦 Chuẩn bị dữ liệu upload
[HH:MM:SS] 🚀 Bắt đầu upload lên server Python: [URL]
[HH:MM:SS] ❌ Lỗi khi upload: Thời gian trước khi lỗi: X.Xs
[HH:MM:SS] 🔧 Lỗi server (502): Server Python có thể đang quá tải hoặc file bị lỗi
```

✅ Error màu đỏ
✅ Error toast hiển thị
✅ Dialog vẫn mở để user retry

---

### Test Case 6: File Too Large (413)
**Objective:** Verify file size error

**Steps:**
1. Try upload file > 50MB (non-video)
2. Or video > 100MB
3. Observe logs

**Expected Results:**
```
[HH:MM:SS] ❌ Lỗi khi upload
[HH:MM:SS] 📏 File quá lớn (413): Vượt quá giới hạn cho phép
```

✅ Error message clear
✅ User can select different file

---

### Test Case 7: Network Disconnection
**Objective:** Verify network error detection

**Steps:**
1. Start upload
2. Disable network during upload (WiFi off)
3. Observe logs

**Expected Results:**
```
[HH:MM:SS] 📊 Đang upload: X%
[HH:MM:SS] ❌ Lỗi khi upload: Thời gian trước khi lỗi: X.Xs
[HH:MM:SS] 🌐 Lỗi kết nối: Không thể kết nối đến server Python. Kiểm tra network hoặc server status.
```

✅ Network error detected
✅ Clear message to user

---

### Test Case 8: Browser Console Logging
**Objective:** Verify console logs for debugging

**Steps:**
1. Open DevTools → Console
2. Upload any file
3. Observe console

**Expected Results:**
```
Console shows:
[UPLOAD INFO] HH:MM:SS.mmm - 🔍 Bắt đầu kiểm tra dữ liệu form
[UPLOAD SUCCESS] HH:MM:SS.mmm - ✓ Tên tài liệu hợp lệ: ...
[UPLOAD INFO] HH:MM:SS.mmm - 🚀 Bắt đầu upload lên server Python: ...
[UPLOAD INFO] HH:MM:SS.mmm - 📊 Đang upload: 10%: ...
```

✅ All logs in console with [UPLOAD TYPE] prefix
✅ Can be exported for support

---

### Test Case 9: Multiple Uploads (Reset State)
**Objective:** Verify logs clear between uploads

**Steps:**
1. Upload file A (success)
2. Wait for dialog to close
3. Open upload dialog again
4. Upload file B
5. Observe logs

**Expected Results:**
```
✅ Logs từ file A không còn
✅ Logs mới chỉ có của file B
✅ Progress reset về 0
✅ No leftover state
```

---

### Test Case 10: Cancel During Upload
**Objective:** Verify cancel behavior

**Steps:**
1. Start upload large file
2. Click "Cancel" button mid-upload
3. Observe logs

**Expected Results:**
```
✅ Upload stops
✅ Logs preserved (có thể screenshot)
✅ Dialog closes
✅ No error thrown
```

---

### Test Case 11: UI Responsiveness
**Objective:** Verify log viewer UI

**Steps:**
1. Upload file
2. Observe log panel behavior

**Expected Results:**
```
✅ Log panel hiển thị khi có logs
✅ Max height 256px, scrollbar khi vượt quá
✅ Auto-scroll to latest log
✅ Logs color-coded đúng:
   - Blue = info
   - Green = success
   - Yellow = warning
   - Red = error
✅ Timestamp format đúng: [HH:MM:SS.mmm]
✅ Monospace font dễ đọc
✅ Mobile responsive
```

---

### Test Case 12: Timeout (5 minutes)
**Objective:** Verify 5-minute timeout

**Steps:**
1. Simulate very slow upload (throttle extreme)
2. Wait for 5+ minutes
3. Observe logs

**Expected Results:**
```
After 5 minutes:
[HH:MM:SS] ❌ Upload timeout: Upload đã vượt quá 5 phút. Vui lòng hủy và thử lại với file nhỏ hơn.
```

✅ Timeout message after 300 seconds
✅ User can cancel
✅ Clear instruction

---

## 🔍 Regression Tests

### RT1: Normal Upload Still Works
**Verify:** Upload vẫn hoạt động bình thường như trước
- ✅ Upload PDF thành công
- ✅ Upload video thành công
- ✅ Upload image thành công
- ✅ Document xuất hiện trong list
- ✅ Indexing vẫn chạy đúng

### RT2: Progress Bar Still Works
**Verify:** Progress bar không bị ảnh hưởng
- ✅ Progress bar hiển thị
- ✅ % chính xác
- ✅ Animation smooth

### RT3: Error Handling Still Works
**Verify:** Error messages vẫn hiển thị
- ✅ Toast errors
- ✅ Inline errors
- ✅ Validation errors

---

## 🌐 Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Verify:**
- ✅ Logs hiển thị đúng
- ✅ Colors render correctly
- ✅ Timestamp format OK
- ✅ Scrolling works
- ✅ Performance OK (no lag)

---

## 📱 Mobile Testing

Test on mobile browsers:
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet

**Verify:**
- ✅ Log panel responsive
- ✅ Text readable (not too small)
- ✅ Scrolling works
- ✅ Upload works on mobile

---

## ⚡ Performance Testing

### P1: Large Number of Logs
**Steps:**
1. Upload very large file (slow network)
2. Let logs accumulate (100+ entries)
3. Check performance

**Expected:**
- ✅ No UI lag
- ✅ Scrolling smooth
- ✅ Memory usage reasonable

### P2: Rapid State Updates
**Steps:**
1. Upload file with fast progress updates
2. Monitor render performance

**Expected:**
- ✅ No dropped frames
- ✅ UI remains responsive
- ✅ Progress bar smooth

---

## 🐛 Edge Cases

### E1: Empty File
- Upload 0 byte file
- Should fail validation or show clear error

### E2: Corrupted File
- Upload corrupted PDF
- Should show server error with details

### E3: Special Characters in Filename
- Upload file with `tên file (1) [test].pdf`
- Should handle gracefully

### E4: Very Long Filename
- Upload file with 200+ character name
- Should truncate or wrap properly in logs

### E5: Same File Multiple Times
- Upload same file twice
- Each upload should have fresh logs

---

## ✅ Acceptance Criteria

### Must Have:
- [x] ✅ Logs hiển thị mọi bước upload
- [x] ✅ Progress updates trong logs
- [x] ✅ Stuck detection (30s, 60s)
- [x] ✅ Error logging với details
- [x] ✅ Color-coded log types
- [x] ✅ Timestamp on all logs
- [x] ✅ Console logging
- [x] ✅ Clear logs on dialog close

### Nice to Have:
- [ ] Export logs to file
- [ ] Copy logs to clipboard
- [ ] Log filtering by type
- [ ] Expand/collapse log details

---

## 📊 Test Results Template

```
Test Date: YYYY-MM-DD
Tester: [Name]
Browser: [Chrome/Firefox/Safari] [Version]
OS: [macOS/Windows/Linux]

Test Case | Status | Notes
----------|--------|-------
TC1: Successful Upload | ✅ PASS | 
TC2: Validation Errors | ✅ PASS |
TC3: Large File Upload | ✅ PASS |
TC4: Slow Network | ⚠️ WARN | Needs slower throttle
TC5: Server Error | ✅ PASS |
TC6: File Too Large | ✅ PASS |
TC7: Network Disconnect | ✅ PASS |
TC8: Console Logging | ✅ PASS |
TC9: Multiple Uploads | ✅ PASS |
TC10: Cancel Upload | ⚠️ WARN | Cancel button not tested
TC11: UI Responsiveness | ✅ PASS |
TC12: Timeout | ⏳ SKIP | Takes too long

Overall: ✅ PASS (10/10 core tests)
```

---

## 🚀 Sign-off Checklist

Before releasing to production:

- [ ] All core test cases pass
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested successful upload
- [ ] Tested error scenarios
- [ ] Tested on mobile (basic)
- [ ] Documentation complete
- [ ] Screenshots captured
- [ ] Demo video recorded (optional)
- [ ] Support team trained
- [ ] Rollback plan ready

---

**Test Plan Version:** 1.0
**Created:** 2024-11-22
**Status:** ✅ Ready for Testing
