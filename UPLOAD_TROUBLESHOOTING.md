# Upload Troubleshooting - Quick Reference

## 🚨 Common Issues & Solutions

### Issue 1: Stuck at 0% - "Bắt đầu upload lên server Python"
```
📦 Chuẩn bị dữ liệu upload
🚀 Bắt đầu upload lên server Python
⏱️ Stuck ở đây > 60s
```

**Nguyên nhân:**
- Server Python offline hoặc không accessible
- Network firewall blocking
- CORS issues

**Giải pháp:**
1. Kiểm tra `VITE_PYTHON_URL` trong `.env`
2. Test Python API endpoint: `curl https://python-api/health`
3. Kiểm tra network/VPN
4. Check browser console cho CORS errors

---

### Issue 2: Stuck at 10-50% - Upload Progress
```
📊 Đang upload: 10%
📊 Đang upload: 20%
⏱️ Stuck ở 47% > 60s
```

**Nguyên nhân:**
- Internet connection unstable
- File quá lớn
- Server receiving slowly

**Giải pháp:**
1. Check internet speed
2. Thử file nhỏ hơn (< 10MB test)
3. Upload từ network khác
4. Check server bandwidth

---

### Issue 3: Stuck at 100% - "Server đang xử lý"
```
✅ Upload thành công!
🔄 Server đang xử lý và indexing file...
⏱️ Stuck ở đây > 2 phút
```

**Nguyên nhân:**
- Python server đang processing file (normal)
- Indexing to vector DB chậm
- Server overloaded

**Giải pháp:**
1. **Nếu < 3 phút:** Chờ thêm (bình thường cho file lớn)
2. **Nếu > 3 phút:** Check Python server logs
3. **Nếu > 5 phút:** Restart Python service
4. File có thể đã upload OK, check document list

---

### Issue 4: Error 502 - Server Error
```
❌ Lỗi khi upload
🔧 Lỗi server (502): Server Python có thể đang quá tải
```

**Nguyên nhân:**
- Python server crashed
- Server timeout
- File corrupted/unsupported

**Giải pháp:**
1. Check Python server status
2. Review Python logs: `tail -f python-server.log`
3. Restart Python service
4. Try different file
5. Check file integrity

---

### Issue 5: Error 413 - File Too Large
```
❌ Lỗi khi upload
📏 File quá lớn (413): Vượt quá giới hạn cho phép
```

**Nguyên nhân:**
- File > 100MB (videos) hoặc > 50MB (others)
- Server upload limit

**Giải pháp:**
1. Compress file
2. Split large videos
3. Use lower quality for videos
4. Contact admin to increase limit

---

### Issue 6: Network Error - "Không thể kết nối"
```
❌ Lỗi khi upload
🌐 Lỗi kết nối: Không thể kết nối đến server Python
```

**Nguyên nhân:**
- Python server down
- Wrong API URL
- Network blocked

**Giải pháp:**
1. Ping Python server
2. Check `VITE_PYTHON_URL` in `.env`
3. Test from Postman/curl
4. Check firewall/VPN

---

### Issue 7: Stuck at Validation - Missing Fields
```
🔍 Bắt đầu kiểm tra dữ liệu form
❌ Chưa chọn trường học
```

**Nguyên nhân:**
- Form incomplete

**Giải pháp:**
1. Điền đầy đủ tất cả trường có dấu *
2. Chọn lại từ dropdown

---

## 🔍 Diagnostic Steps

### Step 1: Identify Stage
Look at the **last log entry**:
- If at validation → Form issue
- If at "Bắt đầu upload" → Connection issue
- If at progress % → Network issue
- If at "Server đang xử lý" → Backend processing

### Step 2: Check Timing
Look at **timestamps**:
- Gap < 5s → Normal
- Gap 5-30s → Slow but OK
- Gap 30-60s → Warning territory
- Gap > 60s → Stuck, need action

### Step 3: Check Progress
Look at **progress percentage**:
- Stuck 0-20% → Network/connection issue
- Stuck 20-80% → Upload bandwidth issue
- Stuck 80-100% → Server receiving issue
- Stuck after 100% → Server processing

### Step 4: Screenshot & Report
1. Take screenshot of **entire log panel**
2. Note the **file size** and **type**
3. Note **exact time** upload started
4. Send to support with info above

---

## 🛠️ Developer Debug Commands

### Check Python API
```bash
# Health check
curl https://your-python-api.com/health

# List documents
curl https://your-python-api.com/list

# Check upload endpoint
curl -X POST https://your-python-api.com/upload \
  -F "file=@test.pdf" \
  -F "document_name=Test" \
  -F "school_name=Test School" \
  -F "standard=Grade 8" \
  -F "subject=Math"
```

### Check Browser Console
```javascript
// Open DevTools (F12) → Console
// Look for:
[UPLOAD INFO] - Normal operations
[UPLOAD ERROR] - Errors
[UPLOAD WARNING] - Warnings

// Network tab:
// Look for /upload request
// Check request headers, body, response
```

### Check Environment
```bash
# Frontend .env
echo $VITE_PYTHON_URL

# Python server
python --version
pip list | grep -i fastapi
systemctl status python-api
```

---

## 📊 Expected Timings

### Small File (< 5MB)
- Validation: < 1s
- Upload: 2-10s
- Processing: 5-30s
- **Total: ~15-40s**

### Medium File (5-20MB)
- Validation: < 1s
- Upload: 10-40s
- Processing: 30-60s
- **Total: ~45-100s**

### Large File (20-50MB)
- Validation: < 1s
- Upload: 40-120s
- Processing: 60-180s
- **Total: ~100-300s (up to 5 min)**

### Video (50-100MB)
- Validation: < 1s
- Upload: 120-300s
- Processing: 180-600s
- **Total: ~300-900s (up to 15 min)**

⚠️ **If exceeding these times significantly, there's an issue**

---

## 💡 Quick Tips

✅ **Before Upload:**
- Check internet connection
- Verify file size (< 50MB recommended)
- Ensure Python server is running
- Test with small file first

✅ **During Upload:**
- Don't close browser tab
- Don't refresh page
- Keep internet connected
- Watch the logs

✅ **If Stuck:**
- Wait 2 minutes first (might be processing)
- Read the last log message
- Screenshot the logs
- Contact support with screenshot

✅ **Prevention:**
- Use smaller files when possible
- Upload during off-peak hours
- Ensure stable internet
- Keep browser updated

---

## 📞 Support Contact

When reporting issues, provide:
1. **Screenshot** of Upload Activity Log
2. **File info**: Name, size, type
3. **Browser**: Chrome/Firefox/Safari + version
4. **Time**: When did upload start/stuck
5. **Network**: Office WiFi, Home, Mobile?

Fast diagnosis = Fast fix! 🚀
