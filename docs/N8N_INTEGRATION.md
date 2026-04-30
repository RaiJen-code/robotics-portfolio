# 🔗 Arsitektur Integrasi n8n — Deep Dive

## Kenapa n8n?

Static site (GitHub Pages) tidak bisa menjalankan server-side code. Artinya, semua logika backend (simpan ke database, kirim email, notifikasi) harus dilakukan oleh service eksternal.

n8n adalah **workflow automation platform** yang bisa:
- Menerima HTTP POST dari website kamu via webhook
- Memproses data dan validasi
- Meneruskan ke Telegram, Email, Google Sheets, Notion, dll
- Berjalan 24/7 tanpa kamu harus manage server

```
STATIC WEBSITE                    n8n AUTOMATION
──────────────────────────────────────────────────────────
Browser JS                        Webhook Node
   │                                │
   │  fetch(webhookUrl, {           │
   │    method: 'POST',             │
   │    body: JSON.stringify(data)  │
   │  })                            │
   │──────── HTTPS POST ──────────► Webhook Trigger
                                    │
                                    ├─ Validasi input
                                    ├─ Rate check (opsional)
                                    │
                         ┌──────────┼──────────────┐
                         ▼          ▼               ▼
                    Telegram     Google Sheets    Email SMTP
                    Notifikasi   (Database CRM)   Konfirmasi
                         │
                    Response JSON ◄── Website menunggu
```

## Flow Diagram: Live Chat

```
User ketik pesan di chat widget
    │
    ▼
[Frontend: LiveChat.tsx]
    │ Validasi: trim, max length 500 char
    │ Rate limit: 10 msg/menit per session
    │
    ▼
fetch(N8N_CHAT_WEBHOOK, { 
  method: 'POST',
  headers: { 'X-Source': 'portfolio-website' },
  body: { sessionId, message, timestamp, page }
})
    │
    ▼
[n8n: Webhook Node] — menerima request
    │
    ▼
[n8n: IF Node] — validasi
    ├── message not empty?
    ├── X-Source header = 'portfolio-website'?
    │
    ├── FALSE → Response 400 Bad Request
    │
    └── TRUE
         │
         ├── [Telegram Node] → Kirim notif ke bot kamu
         │       Format: "💬 Pesan baru dari session XXX: ..."
         │
         ├── [Google Sheets] → Append row ke "Chat Logs" sheet
         │       Kolom: Timestamp | SessionID | Pesan | Halaman | Status
         │
         └── [Respond to Webhook] → { success: true }
                  │
                  ▼
         [Frontend menerima response]
         Bot auto-reply dikirim setelah 800ms
```

## Flow Diagram: Service Request

```
User isi form service → Submit
    │
    ▼
[Frontend: ServiceForm.tsx]
    │ Validasi: name, email (format check), description
    │ Rate limit: 3 request/jam per session
    │
    ▼
fetch(N8N_SERVICE_WEBHOOK, { ... })
    │
    ▼
[n8n Webhook] → [Validate] → [3 parallel nodes]
                                │
                   ┌────────────┼────────────────┐
                   ▼            ▼                 ▼
           [Google Sheets]  [Telegram]       [Email SMTP]
           Simpan ke        Notif: "🛠️      Kirim konfirmasi
           "Service         Service Request  ke email user
           Requests" sheet  baru! Detail: .."
           
           Auto generate ID: SRQ-YYMMDDHHMM
           Status: "Pending"
```

## Google Sheets sebagai Database

Struktur sheet yang disarankan:

### Sheet 1: "Chat Logs"
| Timestamp | Session ID | Pesan | Halaman | Status | Reply |
|-----------|-----------|-------|---------|--------|-------|
| 01/02/2024 10:30 | session_xxx | Halo ada yang... | /services | Belum | |

### Sheet 2: "Service Requests"
| ID | Timestamp | Tipe | Nama | Email | Phone | Subjek | Deskripsi | Urgency | Budget | File | Status | Notes |
|----|-----------|------|------|-------|-------|--------|-----------|---------|--------|------|--------|-------|
| SRQ-2402100930 | ... | consultation | John | john@... | ... | ... | ... | normal | ... | - | Pending | |

### Sheet 3: "Analytics" (opsional, auto-populated)
n8n bisa update sheet analytics setiap ada interaction baru.

## Keamanan: Mencegah Spam & Abuse

### 1. Client-Side Rate Limiting (Di Frontend)
```typescript
// lib/n8n.ts — RateLimiter class
class RateLimiter {
  check(key: string, limit: number, windowMs: number): boolean
  // Contoh: max 10 chat msg per menit per sessionId
}
```

### 2. Header Verification (Di n8n)
Tambah IF node di n8n:
```
x-source === 'portfolio-website'
```
Request tanpa header ini akan ditolak.

### 3. Input Sanitization
```typescript
function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')  // Strip HTML
    .trim()
    .slice(0, maxLength)
}
```

### 4. n8n IP Allowlist (Advanced)
Untuk production, bisa whitelist IP range GitHub Actions jika perlu.

### 5. Honeypot Field (Anti-bot)
Tambah input tersembunyi di form. Bot biasanya mengisi semua field:
```html
<input name="_honeypot" style="display:none" tabindex="-1" />
```
Di n8n, reject request jika field honeypot tidak kosong.

## n8n Variables Setup

Di n8n Settings → Variables, tambah:
```
TELEGRAM_CHAT_ID = 123456789    (dapatkan dari @userinfobot)
GOOGLE_SHEET_ID  = 1abc...xyz   (dari URL Google Sheets)
OWNER_EMAIL      = kamu@gmail.com
```

Ini lebih aman daripada hard-code di workflow JSON.

## Monitoring Workflow

n8n menyimpan execution history. Untuk setiap workflow:
1. Buka workflow → klik **Executions** tab
2. Lihat semua run: success/error, timestamp, data
3. Bisa di-filter dan re-run jika ada yang error

## Ekstensi: Menambah Notifikasi Discord

Selain Telegram, kamu bisa tambah Discord webhook:

```
1. Di Discord server → Channel settings → Integrations → Webhooks
2. Create webhook, copy URL
3. Di n8n, tambah node HTTP Request:
   - Method: POST
   - URL: Discord webhook URL
   - Body:
     {
       "content": "💬 Pesan baru!",
       "embeds": [{
         "title": "Chat dari Website",
         "description": "{{ $json.body.message }}",
         "color": 65494
       }]
     }
```

## Ekstensi: Notion CRM

Bisa simpan ke Notion sebagai alternatif Google Sheets:
1. Buat database Notion untuk "Service Requests"
2. Di n8n, gunakan Notion node (built-in)
3. Set credentials Notion API
4. Map field ke Notion properties

Keuntungan Notion vs Sheets:
- Interface lebih bagus untuk manage CRM
- Bisa add views (Kanban, Calendar, Gallery)
- Relation antar database
- Komentar dan kolaborasi
