# 🚀 Panduan Deployment Lengkap

## TAHAP 1: Setup Project Lokal

### 1.1 Clone / Init Repository

```bash
# Buat folder project
mkdir robotics-portfolio && cd robotics-portfolio

# Init git
git init

# Copy semua file dari template ini ke dalam folder
# (atau clone dari repo template jika sudah diupload)

# Install dependencies
npm install
```

### 1.2 Konfigurasi Environment Variables

```bash
# Buat file .env.local (JANGAN di-commit ke git!)
cp .env.example .env.local
```

Isi `.env.local`:
```env
# Nama repo GitHub kamu (misal: /robotics-portfolio)
# Kosongkan jika pakai custom domain: REPO_NAME=
REPO_NAME=/robotics-portfolio

# n8n Webhook URLs (isi setelah setup n8n di bawah)
N8N_CHAT_WEBHOOK=https://your-n8n.cloud/webhook/portfolio-chat
N8N_SERVICE_WEBHOOK=https://your-n8n.cloud/webhook/portfolio-service
N8N_CONTACT_WEBHOOK=https://your-n8n.cloud/webhook/portfolio-contact

# Formspree ID (backup form, daftar di formspree.io)
FORMSPREE_ID=xyzabcde

# URL website kamu
SITE_URL=https://username.github.io/robotics-portfolio
```

### 1.3 Test Development Server

```bash
npm run dev
# Buka http://localhost:3000
```

### 1.4 Test Static Build

```bash
npm run build
# Akan generate folder /out

# Test folder out dengan server lokal
npx serve out
```

---

## TAHAP 2: Setup GitHub Repository

### 2.1 Buat Repository di GitHub

1. Login ke [github.com](https://github.com)
2. Klik **New Repository**
3. Nama repo: `robotics-portfolio` (atau nama apapun)
4. Visibility: **Public** (wajib untuk GitHub Pages gratis)
5. Jangan centang "Initialize with README" (sudah ada di lokal)
6. Klik **Create repository**

### 2.2 Push ke GitHub

```bash
git add .
git commit -m "Initial commit: robotics portfolio website"
git remote add origin https://github.com/USERNAME/robotics-portfolio.git
git branch -M main
git push -u origin main
```

### 2.3 Setup GitHub Secrets

Secrets dibutuhkan agar GitHub Actions bisa build dengan env variables tanpa mengekspos URL webhook ke publik.

1. Di repo GitHub kamu → **Settings** → **Secrets and variables** → **Actions**
2. Klik **New repository secret**
3. Tambah secrets berikut:

| Secret Name | Value |
|-------------|-------|
| `N8N_CHAT_WEBHOOK` | URL webhook n8n chat |
| `N8N_SERVICE_WEBHOOK` | URL webhook n8n service |
| `N8N_CONTACT_WEBHOOK` | URL webhook n8n contact |
| `FORMSPREE_ID` | ID Formspree |
| `SITE_URL` | `https://username.github.io/robotics-portfolio` |

### 2.4 Enable GitHub Pages

1. Di repo → **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Simpan

Setelah ini, setiap kali push ke `main`, GitHub Actions akan auto-build dan deploy!

### 2.5 Cek Deployment

Setelah push pertama:
1. Ke tab **Actions** di repo
2. Lihat workflow **Deploy to GitHub Pages** berjalan
3. Setelah sukses (biasanya 2-3 menit), website live di:
   `https://username.github.io/robotics-portfolio`

---

## TAHAP 3: Setup n8n

### 3.1 Opsi n8n (pilih salah satu):

**A. n8n Cloud (Paling mudah, ada free tier):**
1. Daftar di [n8n.io](https://n8n.io)
2. Buat workspace baru
3. Free tier: 5 workflows + 2500 executions/bulan

**B. Self-hosted di Railway.app (Gratis):**
```bash
# 1. Daftar Railway.app
# 2. New Project → Deploy from Template → Cari "n8n"
# 3. Set env variables:
#    N8N_BASIC_AUTH_ACTIVE=true
#    N8N_BASIC_AUTH_USER=admin
#    N8N_BASIC_AUTH_PASSWORD=rahasia123
#    WEBHOOK_URL=https://your-app.railway.app
```

**C. Self-hosted dengan Docker (jika punya VPS):**
```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=password123 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### 3.2 Import Workflow ke n8n

1. Buka n8n dashboard kamu
2. Klik **+** → **Import from file**
3. Import file dari `/n8n-workflows/live-chat-workflow.json`
4. Import juga `service-request-workflow.json`

### 3.3 Setup Credentials di n8n

**Telegram Bot:**
1. Buka [@BotFather](https://t.me/BotFather) di Telegram
2. Kirim `/newbot` dan ikuti instruksi
3. Copy token bot
4. Di n8n → Credentials → New → Telegram API → paste token
5. Dapatkan Chat ID kamu: kirim pesan ke bot, lalu buka:
   `https://api.telegram.org/botTOKEN/getUpdates`

**Google Sheets:**
1. n8n → Credentials → New → Google Sheets OAuth2
2. Ikuti alur OAuth, authorize akses
3. Buat Google Sheets baru di Drive kamu
4. Buat sheet bernama "Chat Logs" dan "Service Requests"
5. Copy Sheet ID dari URL: `docs.google.com/spreadsheets/d/[SHEET_ID]/edit`

**SMTP (untuk email):**
1. Gunakan Gmail dengan App Password
2. Google Account → Security → 2-Step Verification → App passwords
3. Generate password untuk "Mail" + "Other device"
4. Di n8n → Credentials → New → SMTP:
   - Host: `smtp.gmail.com`
   - Port: `465`
   - User: email kamu
   - Password: app password (bukan password Gmail biasa!)

### 3.4 Aktifkan Workflow

1. Buka workflow di n8n
2. Klik toggle **Inactive** → **Active**
3. Klik node "Webhook Trigger" → Copy webhook URL
4. Paste URL ke GitHub Secrets (`N8N_CHAT_WEBHOOK`)

### 3.5 Test Webhook

```bash
# Test dari terminal
curl -X POST https://your-n8n.cloud/webhook/portfolio-chat \
  -H "Content-Type: application/json" \
  -H "X-Source: portfolio-website" \
  -d '{"sessionId":"test123","message":"Halo test webhook!","timestamp":"2024-01-01T00:00:00Z"}'

# Expected response:
# {"success": true, "message": "Pesan diterima!..."}
```

---

## TAHAP 4: Custom Domain (Opsional, Gratis)

### Opsi A: Subdomain GitHub (default)
Tidak perlu setup, langsung pakai `username.github.io/repo-name`

### Opsi B: Freenom (.tk, .ml, .ga domain gratis)
1. Daftar [freenom.com](https://freenom.com)
2. Cari domain gratis (misal: `raijen.tk`)
3. Di GitHub repo → Settings → Pages → Custom domain → masukkan domain
4. Di Freenom → Manage Domain → Manage Freenom DNS:
   - Add record: Type A, Name @, Target `185.199.108.153`
   - Add record: Type A, Name @, Target `185.199.109.153`
   - Add record: CNAME, Name www, Target `username.github.io`
5. Centang "Enforce HTTPS" di GitHub Pages

### Opsi C: Cloudflare (recommended)
1. Beli domain murah di Namecheap (~$10/tahun) atau gunakan subdomain
2. Add domain ke Cloudflare (gratis)
3. Update nameservers ke Cloudflare
4. Add DNS records seperti di atas
5. Benefit: CDN, DDoS protection, SSL otomatis

---

## TAHAP 5: Tambah Blog Post (Cara Termudah)

### Workflow untuk menulis post baru:

1. **Buat file markdown baru** di `/content/posts/`:
```bash
# Nama file = slug URL
# /content/posts/esp32-tutorial.md → /blog/esp32-tutorial
```

2. **Format frontmatter:**
```markdown
---
title: "Judul Post Kamu"
date: "2024-03-15"
excerpt: "Ringkasan 1-2 kalimat yang akan muncul di listing"
tags: ["ESP32", "Tutorial"]
category: "Embedded"
coverImage: "/images/posts/nama-gambar.jpg"
published: true
---

Konten markdown di sini...
```

3. **Commit dan push:**
```bash
git add content/posts/esp32-tutorial.md
git commit -m "New post: ESP32 Tutorial"
git push
# GitHub Actions otomatis rebuild dan deploy!
```

### Alternatif: Edit langsung di GitHub

Kamu bisa langsung edit file markdown di GitHub.com (tanpa git lokal):
1. Buka repo di GitHub
2. Navigate ke `content/posts/`
3. Klik **Add file** → **Create new file**
4. Tulis konten markdown
5. Commit → otomatis trigger deploy!

---

## TAHAP 6: Checklist Pre-Launch

```
[ ] Ganti nama "RaiJen" dengan nama asli kamu di seluruh file
[ ] Update social media links di Layout.tsx
[ ] Upload foto profil ke /public/images/
[ ] Upload CV ke /public/cv/CV-Kamu.pdf dan update path di About page
[ ] Tambah minimal 2-3 project di /content/projects/
[ ] Tambah minimal 1 blog post di /content/posts/
[ ] Test semua form (chat, service, contact)
[ ] Test n8n webhook menerima data
[ ] Cek Google Sheets menerima data
[ ] Cek Telegram menerima notifikasi
[ ] Test di mobile (Chrome DevTools → Device toolbar)
[ ] Test dengan Lighthouse (target: Performance > 90, SEO > 95)
[ ] Cek semua link tidak broken
[ ] Update og:image di _app.tsx atau meta tags
```

---

## Troubleshooting Umum

### Build gagal di GitHub Actions
```
Error: Cannot find module 'gray-matter'
```
→ Pastikan `package.json` sudah benar dan jalankan `npm ci` bukan `npm install`

### Halaman 404 setelah deploy
→ Pastikan `REPO_NAME` di `next.config.js` sesuai nama repo (misal `/robotics-portfolio`)
→ Cek apakah file `.nojekyll` ada di folder `/out`

### Webhook n8n tidak menerima request
→ Cek CORS: pastikan URL website kamu di-allow di webhook node n8n
→ Cek apakah n8n workflow sudah Active
→ Cek network tab browser apakah fetch gagal

### Font tidak loading
→ Normal di localhost (Google Fonts butuh internet). Coba buka di network asli.

### Image tidak tampil
→ Cek path: harus relative ke `/public`. File di `/public/images/test.jpg` → pakai `/images/test.jpg`
