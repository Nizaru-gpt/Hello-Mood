# Hello Mood

A simple mood-tracking web app built with **React + Vite + TypeScript**, styled with **Tailwind CSS**, and using **Firebase Authentication**. 
This repository is prepared for a coding assessment so reviewers can clone and run it quickly.

## ✨ Fitur
- Login & Register (Firebase Auth: Google & Email/Password)
- Mood tracking UI with animations (Framer Motion)
- State management (Zustand)
- Responsive layout (mobile-first)

## 🧰 Tech Stack
- React ^19.1.1 with Vite
- TypeScript
- Tailwind CSS
- Firebase Auth
- Framer Motion, Lucide Icons, React Router

---

## 🚀 Getting Started

### Prasyarat
- **Node.js 18+** (direkomendasikan LTS)  
- **npm** (atau pnpm/yarn)

> Catatan: Konfigurasi Firebase **sudah ditanam** di `src/lib/firebase.ts`. Untuk keperluan assessment lokal, tidak perlu membuat project Firebase baru. (Di produksi, sebaiknya pindahkan ke ENV.)

### 1) Clone & Install
```bash
git clone https://github.com/Nizaru-gpt/Hello-Mood.git
cd Hello-Mood
npm install
```

### 2) Jalankan Development Server
```bash
npm run dev
```
Buka alamat yang ditampilkan Vite (mis. `http://localhost:5173`).

### 3) Login / Register
- **Email/Password**: buka halaman **Register** untuk membuat akun lalu login.
- **Google Sign-In** juga tersedia. Jika muncul error OAuth/authorized domain, gunakan **Email/Password**.

---

## 📦 Scripts
Script yang tersedia pada `package.json`:

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

- `npm run dev` — menjalankan app dalam mode development.
- `npm run build` — build produksi ke folder `dist/`.
- `npm run preview` — preview hasil build secara lokal.

---

## 🗂️ Struktur Direktori (ringkas)
```
src/
  components/      # UI components
  pages/           # Halaman (Login, Register, dsb.)
  lib/firebase.ts  # Inisialisasi Firebase (Auth)
  store/           # Zustand store
  ...
```

---

## 🔐 Keamanan & ENV (opsional)
Untuk repository publik/produksi:
1. Pindahkan konfigurasi Firebase ke file ENV (mis. Vite: `VITE_FIREBASE_*`).  
2. Gunakan aturan keamanan (Firestore/Storage rules) yang ketat.
3. Tambahkan `.env`, `.env.local` ke `.gitignore`.

Contoh `.env.example` (jika ingin memigrasikan):
```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
//API_KEY_Firebase dan lain lain sudah ada di file,tinggal di run saja
---

## ❗ Troubleshooting
- **Login Google error (popup/authorized domain)** → gunakan **Email/Password** melalui halaman Register+Login.
- **Halaman blank** → pastikan Node.js versi 18+ dan dependency terinstall (`npm install`).
- **Port bentrok** → jalankan `npm run dev -- --port 5174` atau ubah port sesuai kebutuhan.

---

## 📄 Lisensi
Untuk keperluan technical assessment Nizar Qulubi.
