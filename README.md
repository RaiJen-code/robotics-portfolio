# 🤖 Robotics Engineer Portfolio — Next.js + GitHub Pages + n8n

Website personal branding modern untuk Robotics Engineer / AI Developer. Static site di-host gratis di GitHub Pages, dengan backend automation via n8n.

## ✨ Fitur

| Fitur | Status | Teknologi |
|-------|--------|-----------|
| Landing Page + Hero | ✅ | Next.js, Tailwind |
| About + CV Download | ✅ | Next.js |
| Portfolio + Filter | ✅ | Next.js, Markdown |
| Blog + Search + Pagination | ✅ | Next.js, gray-matter |
| Live Chat Widget | ✅ | n8n Webhook |
| Service Booking Form | ✅ | n8n Webhook |
| Auto Notif Telegram | ✅ | n8n + Telegram Bot |
| Simpan ke Google Sheets | ✅ | n8n + Google Sheets |
| Email Konfirmasi Otomatis | ✅ | n8n + SMTP |
| SEO Optimized | ✅ | Next.js Head + Schema.org |
| GitHub Actions CI/CD | ✅ | GitHub Actions |
| Custom Domain Ready | ✅ | CNAME |

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup env variables
cp .env.example .env.local
# Edit .env.local sesuai kebutuhan

# 3. Development
npm run dev

# 4. Build & test
npm run build
npx serve out
```

## 📁 Struktur

```
robotics-portfolio/
├── .github/workflows/deploy.yml   # CI/CD
├── content/
│   ├── posts/                     # Blog (tambah .md baru = post baru)
│   └── projects/                  # Portfolio case studies
├── src/
│   ├── pages/                     # Next.js pages
│   ├── components/                # React components
│   └── lib/                       # Utilities (n8n, markdown)
├── n8n-workflows/                 # Import ke n8n
└── docs/                          # Dokumentasi lengkap
    ├── ARCHITECTURE.md
    ├── DEPLOYMENT_GUIDE.md
    └── N8N_INTEGRATION.md
```

## 📖 Dokumentasi

- [**Arsitektur Sistem**](docs/ARCHITECTURE.md) — Overview teknikal
- [**Panduan Deployment**](docs/DEPLOYMENT_GUIDE.md) — Step-by-step dari 0 sampai online
- [**Integrasi n8n**](docs/N8N_INTEGRATION.md) — Setup webhook, Telegram, Sheets

## ✍️ Cara Tambah Blog Post

Buat file `.md` baru di `/content/posts/`:

```markdown
---
title: "Judul Post"
date: "2024-03-15"
excerpt: "Ringkasan singkat"
tags: ["ROS2", "Tutorial"]
category: "Robotics"
published: true
---

Konten markdown di sini...
```

Commit & push → GitHub Actions rebuild otomatis!

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (Static Export)
- **Styling:** Tailwind CSS
- **Content:** Markdown + gray-matter
- **Hosting:** GitHub Pages (gratis)
- **Automation:** n8n (webhook/workflow)
- **Database:** Google Sheets via n8n
- **Notifikasi:** Telegram Bot via n8n
- **CI/CD:** GitHub Actions

## 📄 License

MIT — Feel free to fork dan customize untuk portofolio kamu sendiri.
