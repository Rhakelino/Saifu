# Vercel Deployment Setup Guide

## ⚠️ Error yang Anda Alami

Jika Anda melihat error **500 Internal Server Error** saat register/login di Vercel:

![Error Screenshot](file:///C:/Users/rhakelino/.gemini/antigravity/brain/0c070a84-79fd-4db7-964d-a331e935fc11/uploaded_image_1765818457013.png)

Error ini terjadi karena **environment variables belum dikonfigurasi** di Vercel.

---

## 🔧 Cara Memperbaiki (Step-by-Step)

### Langkah 1: Buka Vercel Dashboard

1. Masuk ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik project **Saifu** Anda

### Langkah 2: Tambahkan Environment Variables

1. Di halaman project, klik tab **Settings**
2. Di sidebar kiri, klik **Environment Variables**
3. Tambahkan **3 environment variables** berikut:

#### Variable 1: DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: 
  ```
  postgresql://neondb_owner:npg_wi2Qgmbyvs5l@ep-damp-bread-a1t9vm9b-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
  ```
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Klik **Save**

#### Variable 2: BETTER_AUTH_SECRET
- **Key**: `BETTER_AUTH_SECRET`
- **Value**: 
  ```
  saifuAuthSecretKey2024VerySecureRandomString64chars
  ```
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Klik **Save**

#### Variable 3: BETTER_AUTH_URL
- **Key**: `BETTER_AUTH_URL`  
- **Value Production**: `https://saifu-cyan.vercel.app`
- **Value Preview**: `https://saifu-cyan-git-<branch>-<username>.vercel.app` (sesuaikan dengan preview URL Anda)
- **Value Development**: `http://localhost:3001`
- **Environments**: ✅ Production (untuk production URL), ✅ Preview (untuk preview URL), ✅ Development (untuk localhost)
- Klik **Save**

> **💡 Tips**: Anda bisa tambahkan environment variable yang sama dengan nilai berbeda untuk setiap environment (Production/Preview/Development) dengan cara:
> - Tambahkan variable dengan environment Production saja dulu
> - Kemudian tambahkan lagi variable dengan nama yang sama tapi pilih environment Preview/Development dengan nilai yang berbeda

### Langkah 3: Redeploy Aplikasi

Setelah semua environment variables ditambahkan:

1. Kembali ke tab **Deployments**
2. Cari deployment terbaru (yang paling atas)
3. Klik menu **⋮** (titik tiga) di sebelah kanan
4. Pilih **Redeploy**
5. Klik **Redeploy** lagi untuk konfirmasi

### Langkah 4: Test Login

Tunggu hingga deployment selesai (biasanya 1-2 menit), lalu:

1. Buka aplikasi Anda: `https://saifu-cyan.vercel.app`
2. Coba **Register** dengan akun baru
3. Setelah register berhasil, coba **Login**
4. Verifikasi bahwa Anda berhasil masuk ke dashboard

---

## ✅ Hasil yang Diharapkan

Setelah konfigurasi selesai:
- ✅ Register akun baru berhasil tanpa error
- ✅ Login dengan email & password berhasil
- ✅ Session tersimpan dan tetap login setelah refresh
- ✅ Tidak ada error 500 di console

---

## 🔒 Keamanan

File `.env` di folder `server/` sudah ditambahkan ke `.gitignore` untuk mencegah credentials Anda ter-commit ke Git repository.

**PENTING**: Jangan pernah commit file `.env` atau credentials lainnya ke repository public!

---

## 🆘 Troubleshooting

### Error masih muncul setelah redeploy?

1. **Cek di Vercel Dashboard** → Settings → Environment Variables, pastikan ketiga variable sudah tersimpan
2. **Cek nilai BETTER_AUTH_URL** harus sesuai dengan URL production Anda (tanpa trailing slash)
3. **Clear browser cache** atau coba di incognito/private window
4. **Cek Vercel Logs**: Deployments → klik deployment terakhir → klik tab "Logs" untuk melihat error detail

### Database connection error?

- Pastikan `DATABASE_URL` benar-benar sama dengan yang ada di Neon dashboard
- Pastikan database Neon Anda aktif (tidak suspended)
- Cek bahwa connection string menggunakan **pooler connection** (bukan direct connection)

---

## 📚 Referensi

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Neon Database Documentation](https://neon.tech/docs/introduction)
