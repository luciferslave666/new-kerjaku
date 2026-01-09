# KerjaKu - Platform Lowongan Kerja Part-time UMKM

**KerjaKu** adalah aplikasi web berbasis Next.js yang menghubungkan pencari kerja part-time (Mahasiswa/Pelajar) dengan UMKM yang membutuhkan karyawan.

Proyek ini disusun untuk memenuhi **Tugas Besar Rekayasa Perangkat Lunak 2**.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Blue)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange)
![Prisma](https://img.shields.io/badge/Prisma-ORM-teal)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-Styling-cyan)

---

## 🚀 Fitur Utama

### 🏢 Untuk Mitra UMKM
- **Registrasi & Verifikasi:** Pendaftaran akun khusus UMKM.
- **Manajemen Profil Usaha:** Upload logo, alamat, dan deskripsi usaha.
- **Posting Lowongan:** Membuat, mengedit, dan menghapus lowongan kerja.
- **Seleksi Pelamar:** Melihat daftar pelamar dan mengubah status lamaran (Terima/Tolak).

### 👨‍🎓 Untuk Pencari Kerja (Pelamar)
- **Pencarian & Filter:** Cari lowongan berdasarkan kata kunci atau tipe (Part-time/Freelance).
- **Lamar Pekerjaan:** Melamar pekerjaan hanya dengan satu klik.
- **Manajemen Profil:** Upload Foto dan CV (file PDF/Gambar).
- **Riwayat Lamaran:** Memantau status lamaran (Menunggu/Diterima/Ditolak) secara real-time.

### 🔐 Fitur Keamanan
- **Multi-role Authentication:** Sistem login terpisah untuk Pelamar dan UMKM.
- **OTP Login (Simulasi):** Login menggunakan kode OTP untuk keamanan tambahan.
- **Password Hashing:** Password dienkripsi menggunakan `bcrypt`.

---

## 🛠️ Persiapan Instalasi

Sebelum memulai, pastikan laptop Anda sudah terinstall:
1.  **Node.js** (Minimal versi 18.17).
2.  **MySQL Server** (Bisa menggunakan XAMPP, MAMP, atau Laragon).
3.  **Git** (Untuk clone repository).

---

## 📦 Cara Instalasi & Menjalankan

Ikuti langkah-langkah ini untuk menjalankan proyek di komputer lokal:

### 1. Clone Repository
Buka terminal dan jalankan perintah:
```bash
git clone https://github.com/username-anda/kerjaku-app.git
cd kerjaku-app
2. Install Dependencies
Install semua library yang dibutuhkan:
code
Bash
npm install
3. Konfigurasi Database (.env)
Buat file baru bernama .env di folder root (sejajar dengan package.json).
Salin isi di bawah ini dan sesuaikan dengan settingan MySQL Anda:
code
Env
# Format: mysql://USER:PASSWORD@HOST:PORT/NAMA_DATABASE

# CONTOH UNTUK XAMPP (Windows/Default):
# DATABASE_URL="mysql://root:@localhost:3306/db_kerjaku"

# CONTOH UNTUK MAMP (Mac):
DATABASE_URL="mysql://root:root@localhost:8889/db_kerjaku?socket=/Applications/MAMP/tmp/mysql/mysql.sock"
Pastikan MySQL (XAMPP/MAMP) sudah di-Start.
4. Setup Database (Migrasi)
Jalankan perintah ini untuk membuat tabel otomatis di database MySQL Anda:
code
Bash
npx prisma generate
npx prisma migrate dev --name init_database
5. Jalankan Aplikasi
Nyalakan server development:
code
Bash
npm run dev
Buka browser dan akses: http://localhost:3000
⚠️ Catatan Penting: Cara Login dengan OTP
Karena aplikasi ini berjalan di local environment (tanpa server email asli), kode OTP akan dikirimkan ke Terminal.
Masuk ke halaman Login.
Masukkan Email & Password yang sudah didaftarkan.
Saat diminta kode OTP, cek Terminal VS Code Anda.
Akan muncul log seperti ini:
code
Code
========================================
🔐 KODE OTP UNTUK pelamar@test.com: 123456
========================================
Masukkan kode angka tersebut ke browser untuk masuk.
📂 Struktur Folder
app/actions : Logika backend (Server Actions) untuk Login, Posting, Upload, dll.
app/dashboard : Halaman dashboard untuk Pelamar dan UMKM.
app/api : API Routes (jika ada).
prisma/schema.prisma : Desain struktur database.
public/uploads : Tempat penyimpanan file foto profil dan CV user.
👥 Tim Pengembang (Kelompok Soto Betawi)
Sendi Dwi Putra (10123006)
Irfan Putra Hendari (10123021)
Egy Audiawan Riyadi (10123026)
Zaki Rahmat Nugroho (10123033)
Arif Hardyansyah (10123042)
Dibuat dengan ❤️ menggunakan Next.js & Prisma
code
Code
### Tips Tambahan:
Jika Anda ingin menambahkan screenshot aplikasi ke README agar lebih keren:
1.  Screenshot halaman Dashboard atau Landing Page.
2.  Simpan gambarnya di folder `public/docs/screenshot.png`.
3.  Tambahkan kode ini di README: `![Screenshot Aplikasi](/docs/screenshot.png)`
