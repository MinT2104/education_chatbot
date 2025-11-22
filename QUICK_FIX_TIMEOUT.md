# ⚡ Quick Fix Guide - Upload Timeout (30 Minutes)

## 🎯 Vấn Đề
Upload bị timeout khi mạng chậm

## ✅ ĐÃ NỚI TIMEOUT LÊN TỐI ĐA

### Timeout Settings Mới:
- ⏱️ **Upload timeout: 30 phút** (rất rộng rãi cho mạng chậm!)
- ⚠️ **Cảnh báo chậm: 2 phút** không progress (thay vì 45s)
- 🚨 **Cảnh báo stuck: 5 phút** không progress (thay vì 90s)
- ⏰ **Cảnh báo sắp timeout: 25 phút** (còn 5 phút)

## 🚀 Làm Gì Tiếp Theo?

### Bước 1: Pull Code Mới
```bash
cd /Users/minknguyen/Desktop/Working/OwnCompany/education-chat-bot
git pull
```

### Bước 2: Restart & Test
```bash
# Restart frontend
npm run dev
```

### Bước 3: Upload File Lớn
Giờ bạn có thể upload file lớn hơn:
- File 100MB → ~10-15 phút (mạng chậm)
- File 200MB → ~20-25 phút (mạng chậm)
- File 500MB → Có thể cần chia nhỏ

---

## ⚠️ Warnings Mới (Ít Hơn, Kiên Nhẫn Hơn)

### Timeline Mới:
```
0-2 phút:    ✅ Upload bình thường
2-5 phút:    ℹ️  Upload chậm (bình thường với mạng chậm)
5-10 phút:   ⚠️ Upload rất chậm (vẫn OK)
10-25 phút:  📊 Tiếp tục upload (đừng cancel!)
25-30 phút:  ⏰ Sắp hết thời gian
30 phút:     ❌ Timeout (file quá lớn hoặc mạng quá chậm)
```

## 📊 File Size Limits (Updated)

| File Type | Recommended | Max | Thời gian upload (mạng chậm) |
|-----------|-------------|-----|------------------------------|
| PDF | < 50 MB | 200 MB | 5-15 phút |
| Video | < 100 MB | 500 MB | 10-25 phút |
| Images | < 10 MB | 50 MB | 1-5 phút |

**✅ Lưu ý:** Với timeout 30 phút, bạn có thể upload file LỚN HƠN nhiều!

---

## 🔍 Khi Nào Cần Lo Lắng?

### ✅ KHÔNG cần lo:
- Upload chậm nhưng vẫn có progress
- Stuck ở 95-99% (server đang processing)
- Mất 10-20 phút cho file lớn
- Cảnh báo "Upload progressing slowly" (bình thường)

### ⚠️ CẦN check:
- Stuck hoàn toàn >10 phút ở 1 % cố định
- Timeout sau 30 phút
- Upload fail nhiều lần liên tiếp
- Tốc độ upload <10 KB/s

---

## 💡 Tips Cho Mạng Chậm

### 1. Upload Lúc Mạng Tốt Nhất
- Đêm khuya (2-5 giờ sáng)
- Sáng sớm (6-8 giờ)
- Cuối tuần

### 2. Chia File Nếu Cần
- File >500MB → Chia làm 2-3 phần
- Mỗi phần <200MB

### 3. Kiểm Tra Mạng
```bash
# Test tốc độ upload
# Sử dụng: fast.com hoặc speedtest.net
```

### 4. Tắt Các App Khác
- Đóng YouTube, Netflix
- Tắt download/torrent
- Tắt cloud sync (Google Drive, Dropbox)

---

## 🛠️ Technical Details

### Files Changed:
1. **AdminDocuments.tsx:**
   - Timeout monitoring: 10min → 30min
   - Warning triggers: Less frequent, more patient
   - Stuck detection: More tolerant (2min, 5min instead of 45s, 90s)

2. **adminService.ts:**
   - Upload timeout: 600000ms → 1800000ms (30 min)

### Timeout Timeline:
```
Old (10-minute timeout):
- Warning slow: 45s
- Warning stuck: 90s  
- Approaching timeout: 8min
- Final timeout: 10min

New (30-minute timeout):
- Warning slow: 2min (120s)
- Warning stuck: 5min (300s)
- Approaching timeout: 25min
- Final timeout: 30min
```

---

## 📞 Vẫn Bị Timeout?

Nếu upload >30 phút vẫn chưa xong:

1. **File quá lớn** → Chia nhỏ (mỗi phần <200MB)
2. **Mạng quá chậm** → Upload lúc khác hoặc nơi khác
3. **Server issue** → Liên hệ admin kiểm tra server

**Screenshot Upload Activity Log và gửi kèm:**
- File size
- Thời gian đã upload
- Tốc độ upload (KB/s)
- % progress khi timeout

---

**Last Updated:** 2025-11-22  
**Version:** 3.0 (30-Minute Timeout - Slow Network Optimized)
