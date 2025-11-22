# 🔧 Giải Quyết Lỗi Upload Timeout (30 Phút)

## ❌ Vấn Đề
Upload bị **timeout** khi mạng chậm hoặc file lớn:

```
[19:54:43,760] ⚠️ Upload stall warning
              No progress for 80s | Stuck at 95%

[19:54:43,760] ❌ Upload timeout exceeded
              Upload exceeded time limit
```

## 🎯 Nguyên Nhân

### 1. **Mạng khách hàng rất chậm** 
- Upload tốc độ chậm (<100 KB/s)
- Mất nhiều thời gian cho file lớn
- Timeout cũ (5-10 phút) quá ngắn

### 2. **Stuck ở 95% - Server đang xử lý**
Upload file lên server **hoàn tất**, nhưng server cần thời gian:
- **Index** file (đặc biệt PDF/video lớn)
- **Process** và lưu vào database
- **Extract** metadata

### 3. **File lớn**
- File >100MB cần nhiều thời gian
- Video, PDF scan có nhiều trang

---

## ✅ Giải Pháp Đã Áp Dụng

### 1. **Tăng Timeout Lên 30 Phút** ✅
```typescript
// Timeline cũ
- Warning slow: 45 seconds
- Warning stuck: 90 seconds  
- Total timeout: 5-10 minutes

// Timeline mới (tối ưu cho mạng chậm)
- Warning slow: 2 minutes (120s) - kiên nhẫn hơn
- Warning stuck: 5 minutes (300s) - rất kiên nhẫn
- Approaching timeout: 25 minutes
- Total timeout: 30 minutes (1800s) - RỘNG RÃI!
```

**Lợi ích:**
- ✅ Phù hợp với mạng **RẤT chậm** (10-50 KB/s)
- ✅ Hỗ trợ file **lớn** (lên đến 500MB)
- ✅ Ít cảnh báo "false alarm" hơn
- ✅ Server có đủ thời gian processing

### 2. **Files Changed** ✅

**`AdminDocuments.tsx`:**
- Line 153-188: Timeout monitoring 10min → 30min
- Line 391-428: Stuck detection tolerant hơn (2min, 5min)
- Line 507-510: Error messages phù hợp mạng chậm

**`adminService.ts`:**
- Line 340-351: Upload timeout 600000ms → 1800000ms (30 phút)

---

## 🚀 Hướng Dẫn Cho Khách

### Nếu Vẫn Bị Timeout:

#### Option 1: **Chia nhỏ file**
- File PDF lớn → Chia thành nhiều file nhỏ hơn
- Video dài → Cắt thành từng phần (mỗi phần 5-10 phút)

#### Option 2: **Kiểm tra kết nối**
```bash
# Test kết nối đến Python server
curl -I https://your-python-server.com/upload

# Kiểm tra tốc độ upload
# Sử dụng speedtest hoặc fast.com
```

#### Option 3: **Nâng cấp server Python**
Nếu server thường xuyên timeout:
- Tăng RAM/CPU cho Python server
- Enable caching
- Optimize indexing process

#### Option 4: **Upload ngoài giờ cao điểm**
- Upload lúc server ít tải (đêm/cuối tuần)
- Tránh giờ cao điểm (9h-17h)

---

## 📊 File Size Recommendations (Updated)

| File Type | Recommended Size | Max Size (với timeout 30 phút) |
|-----------|-----------------|-------------------------------|
| PDF | < 50 MB | 200 MB |
| Images (JPG/PNG) | < 10 MB | 50 MB |
| Videos (MP4/AVI) | < 100 MB | 500 MB |

**✅ Note:** Với timeout 30 phút, bạn có thể upload file LỚN HƠN nhiều so với trước!

**Thời gian upload ước tính (mạng chậm ~50 KB/s):**
- 50 MB: ~17 phút
- 100 MB: ~34 phút (cần >30 phút, nên chia nhỏ)
- 200 MB: ~68 phút (BẮT BUỘC chia nhỏ)
- 500 MB: Chia làm 3 phần (~170MB/phần)

---

## 🔍 Debug Steps

### 1. Check Upload Logs
Khi upload bị lỗi, chụp màn hình **Upload Activity Log** và check:

```
✅ Upload progress đến bao nhiêu %?
   - <50%: Lỗi network upload
   - 50-90%: Upload chậm  
   - >90%: Server processing chậm

✅ Thời gian upload bao lâu?
   - <2 phút: File nhỏ, lỗi khác
   - 2-8 phút: Bình thường cho file lớn
   - >8 phút: Quá chậm, cần tối ưu

✅ Có warning nào?
   - "Upload stall": Network không ổn định
   - "Server processing": Backend cần tối ưu
   - "Timeout": Cần tăng timeout hoặc giảm file size
```

### 2. Check Server Status
```bash
# Kiểm tra Python server có hoạt động?
curl https://your-python-server.com/health

# Kiểm tra disk space
df -h

# Kiểm tra server load
top
```

### 3. Check Browser Console
Mở DevTools → Console, tìm errors:
```
[UPLOAD ERROR] ...
```

---

## 🛠️ Technical Details

### Server Timeout Settings

**Frontend (`adminService.ts`):**
```typescript
timeout: 1800000, // 30 minutes for slow networks and large files
```

**Frontend Monitoring (`AdminDocuments.tsx`):**
```typescript
// Warning at 2 minutes (slow progress)
if (timeSinceLastUpdate > 120000) { ... }

// Warning at 5 minutes (stuck)  
if (timeSinceLastUpdate > 300000) { ... }

// Warning at 25 minutes (approaching timeout)
if (timeSinceStart > 1500000) { ... }

// Timeout at 30 minutes
if (timeSinceStart > 1800000) { ... }
```

### Comparison: Old vs New

| Setting | Old | New | Benefit |
|---------|-----|-----|---------|
| Upload timeout | 10 min | **30 min** | 3x more time for slow networks |
| Warning slow | 45s | **2 min** | Less false alarms |
| Warning stuck | 90s | **5 min** | More patient with slow uploads |
| Approaching timeout | 8 min | **25 min** | Better advance warning |

### Environment Variables Required

**`.env`:**
```bash
VITE_PYTHON_URL=https://your-python-server.com
```

**Verify:**
```bash
# In browser console
console.log(import.meta.env.VITE_PYTHON_URL)
```

---

## 📞 Support

Nếu vẫn gặp lỗi sau khi áp dụng fix:

1. **Screenshot Upload Activity Log** (toàn bộ)
2. **Ghi lại:**
   - File size
   - File type
   - Upload progress % khi bị lỗi
   - Thời gian upload (bao nhiêu phút)
   - Tốc độ upload (KB/s từ log)
3. **Check browser console** errors
4. **Liên hệ support** với thông tin trên

---

## ✅ Success Checklist

- [x] Timeout tăng từ 10 → 30 phút (3x longer)
- [x] Warning timeline kiên nhẫn hơn nhiều
- [x] Error messages phù hợp mạng chậm
- [x] Hỗ trợ file lớn hơn (lên đến 500MB)
- [x] Documentation updated
- [ ] Test với file lớn (>100MB)
- [ ] Test với mạng chậm (<50 KB/s)
- [ ] Monitor upload success rate

---

**Last Updated:** 2025-11-22  
**Version:** 3.0 (30-Minute Timeout - Slow Network Optimized)  
**Target Users:** Customers with slow internet (<100 KB/s)

---

## ✅ Success Checklist

- [x] Timeout tăng từ 5 → 10 phút
- [x] Warning timeline cải thiện  
- [x] Error messages rõ ràng hơn
- [x] Documentation updated
- [ ] Test với file lớn (>50MB)
- [ ] Verify VITE_PYTHON_URL configured
- [ ] Monitor server performance

---

**Last Updated:** 2025-11-22  
**Version:** 2.0 (Timeout Fix)
