# PANDUAN SETUP LENGKAP — Rangga Portfolio Website

Panduan ini akan membawa kamu dari **folder project** sampai **website online** step by step.

---

## BAGIAN 1: PERSIAPAN KOMPUTER

### Install Node.js (wajib untuk Next.js)

1. Buka https://nodejs.org
2. Download versi **LTS** (bukan Current)
3. Install seperti biasa (klik Next-Next-Finish)
4. Verifikasi berhasil:
   ```bash
   node --version    # harus muncul: v20.x.x atau lebih baru
   npm --version     # harus muncul: 10.x.x atau lebih baru
   ```

### Install Git

1. Buka https://git-scm.com/download/win
2. Download dan install (semua default, klik Next saja)
3. Verifikasi:
   ```bash
   git --version     # harus muncul: git version 2.x.x
   ```

---

## BAGIAN 2: SETUP PROJECT LOKAL

### Langkah 1 — Buka Terminal di Folder Project

Di Windows:
- Buka folder `robotics-portfolio` di File Explorer
- Klik kanan di area kosong → "Open in Terminal"
  *(atau cari "cmd" / "PowerShell" di Start Menu lalu navigasi ke folder)*

### Langkah 2 — Install Dependencies

```bash
npm install
```

Tunggu sampai selesai (mungkin 1-3 menit, butuh internet).

### Langkah 3 — Buat File .env.local

```bash
# Di Windows (Command Prompt):
copy .env.example .env.local

# Di Windows (PowerShell):
Copy-Item .env.example .env.local

# Di Git Bash / Terminal:
cp .env.example .env.local
```

Buka `.env.local` dengan Notepad dan isi nilai yang sesuai.
Untuk sekarang, biarkan saja kosong — website tetap bisa jalan.

### Langkah 4 — Jalankan Development Server

```bash
npm run dev
```

Buka browser dan pergi ke: **http://localhost:3000**

Kamu harus melihat website portfolio-mu! 🎉

---

## BAGIAN 3: SETUP GITHUB REPOSITORY

### Langkah 1 — Buat Akun GitHub (jika belum)

1. Buka https://github.com
2. Sign up dengan email kamu
3. Verifikasi email

### Langkah 2 — Buat Repository Baru

1. Setelah login, klik tombol **"+"** di pojok kanan atas → **New repository**
2. Isi:
   - **Repository name:** `robotics-portfolio`
   - **Description:** My personal robotics & AI portfolio
   - **Visibility:** Public *(harus Public untuk GitHub Pages gratis)*
   - Jangan centang apapun di "Initialize this repository"
3. Klik **"Create repository"**

### Langkah 3 — Upload Project ke GitHub

Di terminal (folder project), jalankan:

```bash
# Inisialisasi git di folder project
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial portfolio website"

# Hubungkan ke repository GitHub
# GANTI 'RaiJen-code' dengan username GitHub kamu!
git remote add origin https://github.com/RaiJen-code/robotics-portfolio.git

# Upload ke GitHub
git branch -M main
git push -u origin main
```

> **Catatan:** Saat push pertama kali, akan muncul dialog login GitHub. Masukkan username dan password (atau token).

---

## BAGIAN 4: AKTIFKAN GITHUB PAGES

### Langkah 1 — Buka Settings Repository

1. Buka repository kamu di GitHub
2. Klik tab **Settings** (paling kanan, ada ikon gear)

### Langkah 2 — Aktifkan Pages

1. Di sidebar kiri, klik **Pages**
2. Di bagian "Source", pilih: **GitHub Actions**
3. Klik **Save**

### Langkah 3 — Tunggu Deploy Otomatis

Setiap kali kamu push ke branch `main`, GitHub Actions akan:
1. Install dependencies
2. Build Next.js
3. Deploy ke GitHub Pages

Pantau di tab **Actions** di repository kamu.
Proses pertama biasanya 2-3 menit.

### Langkah 4 — Akses Website

Setelah deploy selesai, website bisa diakses di:
```
https://[username-github-kamu].github.io/robotics-portfolio
```

Contoh: `https://RaiJen-code.github.io/robotics-portfolio`

---

## BAGIAN 5: GANTI NAMA REPO DI CONFIG

> **PENTING:** Kalau nama repo kamu bukan `robotics-portfolio`, kamu perlu mengubah konfigurasi.

Buka file `.github/workflows/deploy.yml`, cari baris:
```yaml
REPO_NAME: /robotics-portfolio
```

Ganti dengan nama repo kamu:
```yaml
REPO_NAME: /nama-repo-kamu
```

---

## BAGIAN 6: TAMBAH FOTO

### Foto Hero (Foto Profil)

1. Siapkan foto portrait kamu (min. 800×1200px)
2. Rename jadi `rangga-hero.jpg`
3. Taruh di folder `images/` (buat folder ini kalau belum ada)
4. Foto sudah otomatis muncul di website

### Foto Project

1. Taruh foto di `images/projects/` dengan nama:
   - `somebody.jpg`
   - `robotic-arm.jpg`
   - `pln-pipeline.jpg`
   - `si-jago-merah.jpg`
   - `filtora.jpg`
   - `dancetron.jpg`
2. Commit dan push ke GitHub

### Tambah CV PDF

1. Export CV kamu ke PDF
2. Rename jadi `rangga_resume.pdf`
3. Taruh di folder root project (sama level dengan `package.json`)
4. Tombol "Download CV" di website akan otomatis berfungsi

---

## BAGIAN 7: SETUP n8n (LIVE CHAT AUTOMATION)

n8n adalah automation tool yang menerima pesan dari website dan meneruskan ke email/Telegram.

### Daftar n8n Cloud (Gratis)

1. Buka https://n8n.io
2. Klik "Get started for free"
3. Daftar dengan email kamu
4. Verifikasi dan login

### Buat Workflow Live Chat

1. Di dashboard n8n, klik **"+ New workflow"**
2. Tambahkan node **Webhook**:
   - Authentication: None (untuk sementara)
   - HTTP Method: POST
   - Path: `portfolio-chat`
3. Tambahkan node **Send Email** atau **Telegram**:
   - Untuk Email: setup dengan Gmail credentials
   - Untuk Telegram: buat bot via @BotFather
4. Hubungkan Webhook → Email/Telegram
5. Klik **Save** dan **Activate**
6. Copy **Webhook URL** yang muncul

### Pasang Webhook di Website

#### Cara 1: HTML Version (rangga-portfolio.html)

Buka `rangga-portfolio.html`, cari:
```javascript
const N8N_WEBHOOK_URL = '';
```

Isi dengan URL webhook n8n kamu:
```javascript
const N8N_WEBHOOK_URL = 'https://your-instance.app.n8n.cloud/webhook/portfolio-chat';
```

#### Cara 2: Next.js Version

1. Buka `.env.local`
2. Isi:
   ```
   N8N_CHAT_WEBHOOK=https://your-instance.app.n8n.cloud/webhook/portfolio-chat
   ```
3. Untuk production: tambah secret di GitHub → Settings → Secrets → `N8N_CHAT_WEBHOOK`

---

## BAGIAN 8: CUSTOM DOMAIN (OPSIONAL)

Jika ingin domain sendiri (misal: raijen.dev) yang lebih profesional:

### Opsi A: Domain Gratis (.is-a.dev atau .netlify.app)

Tidak tersedia untuk GitHub Pages, tapi ada alternatif:
- Deploy ke **Netlify** (drag & drop folder `out/` setelah build)
- Dapat domain gratis: `nama-kamu.netlify.app`

### Opsi B: Beli Domain (murah)

1. Beli domain di Niagahoster, Rumahweb, atau Namecheap (~Rp 100.000/tahun)
2. Di GitHub → Settings → Pages → Custom domain → isi domain kamu
3. Di DNS provider, tambah record:
   - Type: CNAME
   - Name: www
   - Value: `username.github.io`
4. Tunggu propagasi DNS (biasanya 5-60 menit)
5. Centang "Enforce HTTPS"

---

## TROUBLESHOOTING

### Error: "npm: command not found"
→ Node.js belum terinstall. Ulangi Bagian 1.

### Error: "Cannot find module" saat npm run dev
→ Jalankan `npm install` terlebih dahulu

### Build gagal di GitHub Actions
→ Cek tab "Actions" di repo, klik workflow yang gagal, baca error message

### Website muncul tapi CSS/JS tidak load
→ Pastikan `REPO_NAME` di `deploy.yml` sudah benar (sesuai nama repo)

### Chat tidak terkirim ke n8n
→ Pastikan webhook URL sudah diisi dan workflow n8n sudah di-Activate

---

## CARA UPDATE KONTEN

### Update Info Profil (About, Experience, Skills)
→ Edit file `src/pages/about.tsx`

### Tambah Project Baru
→ Buat file baru di `content/projects/nama-project.md` (ikuti format yang ada)

### Tambah Blog Post
→ Buat file baru di `content/posts/judul-post.md` (ikuti format `robot-arm-ros2.md`)

### Update Harga Services
→ Edit file `src/pages/services.tsx`

### Setelah Update — Push ke GitHub
```bash
git add .
git commit -m "Update: [deskripsi perubahan kamu]"
git push
```
Website akan otomatis rebuild dan deploy dalam ~2 menit.

---

*Dibuat untuk Rangga Prasetya Adiwijaya — Electrical Engineer & Robotics Developer*
