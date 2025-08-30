# Hello Mood - Mood Tracker App

📝 Aplikasi pencatat suasana hati harian (Mood Tracker) untuk technical test Frontend Developer.

## ✨ Fitur Utama
- Tambah entri mood per hari (rating 1–5 + catatan opsional).
- Lihat daftar mood yang sudah disimpan.
- Edit entri mood sebelumnya.
- Hapus entri mood.
- Data **persisten** menggunakan `localStorage` (tanpa backend).
- Responsive design (mobile-first).
- Visual mood dengan emoji & warna.
- Fitur tambahan:
  - Autentikasi sederhana menggunakan **Firebase Auth** (Google & Email/Password) → **hanya untuk login**, **data mood tetap di localStorage**.
  - Statistik mingguan, streak, kalender mood, saran aktivitas.

## 🛠️ Teknologi
- React + Vite + TypeScript
- Zustand (state management + persist ke localStorage)
- Tailwind CSS
- Framer Motion (animasi)
- Firebase Auth (opsional login)

## 🚀 Cara Menjalankan

### 1. Clone & install
```bash
git clone https://github.com/Nizaru-gpt/Hello-Mood.git
cd Hello-Mood
npm install
```

### 2. Jalankan server development
```bash
npm run dev
```
Lalu buka [http://localhost:5173](http://localhost:5173)

## 🔑 Login
- Anda bisa langsung **register/login** dengan Email & Password (tersimpan di Firebase Auth).
- Atau gunakan **Masuk dengan Google**.
- **Catatan:** Autentikasi hanya tambahan. **Semua data mood tetap disimpan di localStorage browser**, sesuai ketentuan tes.

## 📦 Scripts
- `npm run dev` — jalankan app mode development
- `npm run build` — build untuk produksi
- `npm run preview` — preview hasil build lokal
- `npm run lint` — linting

## 📂 Struktur Direktori
```
src/
  components/     # UI reusable components
  pages/          # Halaman Login, Register, AppHome, Profile
  store/          # Zustand store (persist ke localStorage)
  lib/            # firebase.ts (untuk login saja)
  types/          # TypeScript types
```
## Lisensi
Keperluan technical test Nizar Qulubi

---
