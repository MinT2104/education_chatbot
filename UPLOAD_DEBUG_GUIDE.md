# Hướng Dẫn Debug Upload File với Activity Log

## 🎯 Tổng Quan

Chúng tôi đã nâng cấp tính năng upload file trong Admin Panel với **Upload Activity Log** - một công cụ giúp bạn theo dõi chi tiết từng bước của quá trình upload để dễ dàng xác định vấn đề khi upload bị stuck.

## ✨ Tính Năng Mới

### 1. **Real-time Activity Log**
- Hiển thị tất cả các bước đang diễn ra trong quá trình upload
- Cập nhật liên tục với timestamp chính xác
- Màu sắc phân biệt theo loại sự kiện:
  - 🔵 **Xanh dương** - Thông tin thông thường
  - 🟢 **Xanh lá** - Hoàn thành thành công
  - 🟡 **Vàng** - Cảnh báo
  - 🔴 **Đỏ** - Lỗi

### 2. **Các Bước Upload Được Tracking**

#### ✅ **Bước 1: Validation (Kiểm tra dữ liệu)**
```
🔍 Bắt đầu kiểm tra dữ liệu form
✓ Tên tài liệu hợp lệ: Grade 8 Mathematics
✓ Trường học hợp lệ: Hanoi International School
✓ Lớp/Khối hợp lệ: Grade 8
✓ Môn học hợp lệ: Mathematics
✓ File hợp lệ: grade8_math.pdf (15.23MB)
```

#### ✅ **Bước 2: Preparation (Chuẩn bị)**
```
📦 Chuẩn bị dữ liệu upload: Đang tạo FormData...
🚀 Bắt đầu upload lên server Python: https://your-python-api.com/upload
```

#### ✅ **Bước 3: Upload Progress (Tiến trình upload)**
```
📊 Đang upload: 10%: 1.52MB / 15.23MB - Thời gian: 2.3s
📊 Đang upload: 20%: 3.05MB / 15.23MB - Thời gian: 4.8s
📊 Đang upload: 30%: 4.57MB / 15.23MB - Thời gian: 7.1s
...
```

#### ✅ **Bước 4: Server Processing (Xử lý trên server)**
```
✅ Upload thành công!: Tổng thời gian: 45.2s
🔄 Server đang xử lý và indexing file...
✅ Hoàn tất toàn bộ quá trình!
```

### 3. **Stuck Detection (Phát hiện bị kẹt)**

Hệ thống tự động phát hiện và cảnh báo khi:

#### ⚠️ **Upload chậm (30 giây không tiến triển)**
```
⚠️ Upload có vẻ bị chậm: Đã 30s không có tiến trình mới
```

#### ⏱️ **Upload stuck (60 giây không tiến triển)**
```
⏱️ Cảnh báo: Upload đang bị stuck: Không có tiến trình trong 60s. Progress: 47%
🔍 Đang kiểm tra kết nối...: Thời gian đã trôi qua: 85s
```

#### ❌ **Timeout (quá 5 phút)**
```
❌ Upload timeout: Upload đã vượt quá 5 phút. Vui lòng hủy và thử lại với file nhỏ hơn.
```

### 4. **Error Detection (Phát hiện lỗi)**

#### 🌐 **Lỗi kết nối**
```
❌ Lỗi khi upload: Thời gian trước khi lỗi: 12.3s
🌐 Lỗi kết nối: Không thể kết nối đến server Python. Kiểm tra network hoặc server status.
```

#### 🔧 **Lỗi server (502)**
```
🔧 Lỗi server (502): Server Python có thể đang quá tải hoặc file bị lỗi
```

#### 📏 **File quá lớn (413)**
```
📏 File quá lớn (413): Vượt quá giới hạn cho phép
```

## 📖 Cách Sử Dụng

### Bước 1: Mở Upload Dialog
1. Vào Admin Panel → Documents tab
2. Click nút "Upload Document"

### Bước 2: Điền thông tin
1. Nhập tên tài liệu
2. Chọn trường học
3. Chọn lớp/khối
4. Chọn môn học
5. Chọn file (kéo thả hoặc click)

### Bước 3: Theo dõi Upload Activity Log
1. Click "Upload & Index"
2. Quan sát **Upload Activity Log** xuất hiện bên dưới
3. Log sẽ hiển thị realtime mọi bước đang diễn ra

### Bước 4: Debug khi có vấn đề

#### ✅ **Nếu upload thành công:**
- Log sẽ hiển thị checkmark xanh ✅
- Dialog tự động đóng sau 2 giây

#### ⚠️ **Nếu upload bị stuck:**

**Trường hợp 1: Stuck ở validation**
```
🔍 Bắt đầu kiểm tra dữ liệu form
❌ Thiếu tên tài liệu
```
→ **Giải pháp:** Kiểm tra lại form, đảm bảo đã điền đầy đủ

**Trường hợp 2: Stuck ở 0-10%**
```
📦 Chuẩn bị dữ liệu upload: Đang tạo FormData...
🚀 Bắt đầu upload lên server Python
⏱️ Cảnh báo: Upload đang bị stuck: Không có tiến trình trong 60s. Progress: 2%
```
→ **Giải pháp:** 
- Kiểm tra kết nối internet
- File có thể quá lớn, thử file nhỏ hơn
- Server Python có thể đang offline

**Trường hợp 3: Stuck ở 50-99%**
```
📊 Đang upload: 50%: 7.61MB / 15.23MB - Thời gian: 15.2s
⏱️ Cảnh báo: Upload đang bị stuck: Không có tiến trình trong 60s. Progress: 50%
```
→ **Giải pháp:**
- Kết nối internet bị gián đoạn
- Server đang xử lý file lớn
- Thử upload lại

**Trường hợp 4: Stuck sau khi upload xong (100%)**
```
✅ Upload thành công!: Tổng thời gian: 45.2s
🔄 Server đang xử lý và indexing file...
⏱️ Cảnh báo: Upload đang bị stuck
```
→ **Giải pháp:**
- Server Python đang indexing file (bình thường với file lớn)
- Chờ thêm hoặc liên hệ admin kiểm tra server Python

## 🔍 Phân Tích Log Để Debug

### Ví dụ 1: Upload thành công
```log
[14:23:45.123] 🔍 Bắt đầu kiểm tra dữ liệu form
[14:23:45.234] ✓ Tên tài liệu hợp lệ: Grade 8 Math
[14:23:45.245] ✓ Trường học hợp lệ: HIS
[14:23:45.256] ✓ Lớp/Khối hợp lệ: Grade 8
[14:23:45.267] ✓ Môn học hợp lệ: Mathematics
[14:23:45.278] ✓ File hợp lệ: math.pdf (15.23MB)
[14:23:45.345] 📦 Chuẩn bị dữ liệu upload
[14:23:45.456] 🚀 Bắt đầu upload lên server Python
[14:23:50.123] 📊 Đang upload: 10%: 1.52MB / 15.23MB
[14:23:55.234] 📊 Đang upload: 20%: 3.05MB / 15.23MB
[14:24:00.345] 📊 Đang upload: 30%: 4.57MB / 15.23MB
[14:24:28.456] ✅ Upload thành công!: Tổng thời gian: 43.1s
[14:24:28.567] 🔄 Server đang xử lý và indexing file...
[14:24:30.678] ✅ Hoàn tất toàn bộ quá trình!
```
✅ **Kết luận:** Upload hoàn hảo, mất 43 giây

### Ví dụ 2: Stuck do kết nối chậm
```log
[14:25:10.123] 🔍 Bắt đầu kiểm tra dữ liệu form
[14:25:10.234] ✓ Tên tài liệu hợp lệ: Grade 8 Math
... (các bước validation OK)
[14:25:10.456] 🚀 Bắt đầu upload lên server Python
[14:25:15.567] 📊 Đang upload: 10%: 1.52MB / 15.23MB
[14:25:47.678] ⚠️ Upload có vẻ bị chậm: Đã 32s không có tiến trình mới
[14:26:20.789] ⏱️ Cảnh báo: Upload đang bị stuck: Không có tiến trình trong 65s. Progress: 10%
```
⚠️ **Kết luận:** Stuck ở 10%, kết nối internet chậm hoặc server không phản hồi

### Ví dụ 3: Lỗi server
```log
[14:27:10.123] 🔍 Bắt đầu kiểm tra dữ liệu form
... (các bước OK)
[14:27:15.456] 🚀 Bắt đầu upload lên server Python
[14:27:20.567] 📊 Đang upload: 10%: 1.52MB / 15.23MB
[14:27:45.678] 📊 Đang upload: 50%: 7.61MB / 15.23MB
[14:28:10.789] ❌ Lỗi khi upload: Thời gian trước khi lỗi: 55.3s
[14:28:10.890] 🔧 Lỗi server (502): Server Python có thể đang quá tải hoặc file bị lỗi
```
❌ **Kết luận:** Server Python gặp lỗi lúc xử lý, cần kiểm tra server logs

## 💡 Tips & Best Practices

### ✅ Upload thành công
1. **Chọn file phù hợp:** PDF < 50MB, Video < 100MB
2. **Kết nối ổn định:** Đảm bảo internet không gián đoạn
3. **Thông tin đầy đủ:** Điền đúng tất cả trường bắt buộc
4. **Quan sát logs:** Theo dõi để phát hiện vấn đề sớm

### ⚠️ Xử lý khi stuck
1. **Đọc log message:** Log cuối cùng cho biết bị stuck ở đâu
2. **Kiểm tra timestamp:** Thời gian giữa các log cho biết nơi bị chậm
3. **Kiểm tra progress:** Nếu stuck ở 0-20%, thường là network issue
4. **Chụp màn hình logs:** Gửi cho support để được hỗ trợ nhanh hơn

### 🔍 Debug với Console Log
Tất cả logs cũng được ghi vào Browser Console:
1. Mở DevTools (F12)
2. Chuyển sang tab Console
3. Tìm `[UPLOAD INFO]`, `[UPLOAD ERROR]`, etc.
4. Export console logs để gửi cho support

## 📞 Liên Hệ Support

Khi gặp vấn đề, hãy cung cấp:
1. **Screenshot của Upload Activity Log**
2. **Thông tin file:** Tên, kích thước, loại file
3. **Thời điểm xảy ra:** Ngày giờ upload
4. **Các bước đã làm:** Mô tả chi tiết

## 🔄 Changelog

### Version 1.0 (Current)
- ✅ Thêm Upload Activity Log với realtime tracking
- ✅ Phát hiện tự động khi upload stuck (30s, 60s warnings)
- ✅ Timeout detection (5 phút)
- ✅ Detailed error logging với nguyên nhân cụ thể
- ✅ Network connection monitoring
- ✅ Progress tracking với timestamp và file size
- ✅ Color-coded log levels (info, success, warning, error)
- ✅ Auto-scroll log viewer
- ✅ Console logging cho advanced debugging

---

**Lưu ý:** Tính năng này được thiết kế để giúp bạn và team support debug nhanh hơn. Nếu thấy upload bị stuck, hãy đọc kỹ logs - chúng sẽ cho biết chính xác vấn đề ở đâu! 🎯
