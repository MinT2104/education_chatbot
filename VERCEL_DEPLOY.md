# Hướng dẫn Deploy lên Vercel

## 🚀 Cách Deploy

### Option 1: Deploy qua Git (Recommended)

1. **Commit và push code lên GitHub:**
```bash
git add .
git commit -m "Update: Add Vercel configuration and starter suggestions"
git push origin main
```

2. **Import project vào Vercel:**
   - Truy cập [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import repository từ GitHub
   - Vercel sẽ tự động detect là Vite project

3. **Build Settings (Vercel tự động nhận diện):**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Click "Deploy"**

### Option 2: Deploy qua CLI

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login:**
```bash
vercel login
```

3. **Deploy:**
```bash
# Deploy preview
vercel

# Deploy production
vercel --prod
```

## 📋 Files đã cấu hình

- ✅ `vercel.json` - Cấu hình build và routing
- ✅ `.vercelignore` - Ignore các thư mục không cần thiết
- ✅ `vite.config.ts` - Build configuration

## 🔧 Troubleshooting

### Lỗi 404 khi truy cập routes
- ✅ Đã fix: `vercel.json` có rewrites cho SPA routing

### Build failed
- Kiểm tra `npm run build` chạy thành công ở local
- Kiểm tra tất cả dependencies trong package.json
- Xem build logs trên Vercel dashboard

### Hiển thị sai trang
- ✅ Đã fix: Thêm `.vercelignore` để ignore thư mục `server/` và `client/`
- Đảm bảo `outputDirectory` là `dist`
- Kiểm tra `index.html` ở root có đúng không

## 🌐 Environment Variables (Nếu cần)

Trên Vercel Dashboard:
1. Settings → Environment Variables
2. Thêm các biến:
   - `VITE_API_URL` (nếu có)
   - `VITE_APP_ENV=production`

## ✅ Checklist trước khi deploy

- [ ] `npm run build` chạy thành công ở local
- [ ] Test `npm run preview` để xem production build
- [ ] Đã commit tất cả thay đổi
- [ ] vercel.json đã được tạo
- [ ] .vercelignore đã được tạo

