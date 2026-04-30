/**
 * n8n.ts — Client-side webhook integration dengan n8n
 * 
 * Semua komunikasi dari frontend static ke n8n dilakukan via HTTP POST
 * ke webhook URL yang di-expose oleh n8n Cloud (atau self-hosted n8n).
 * 
 * PENTING: Webhook URL disimpan di .env.local (tidak di-commit ke git)
 */

// ── Types ──────────────────────────────────────────────────────────────

export interface ChatMessage {
  sessionId: string;      // UUID unik per sesi anonim
  message: string;        // Pesan dari user
  timestamp: string;      // ISO timestamp
  page?: string;          // Halaman asal (untuk konteks)
  userAgent?: string;     // Browser info (opsional)
}

export interface ServiceRequest {
  type: 'consultation' | '3d-printing' | 'document-print';
  name: string;
  email: string;
  phone?: string;
  subject: string;
  description: string;
  urgency: 'normal' | 'urgent' | 'asap';
  fileUrl?: string;       // URL file yang di-upload (via Tally/Uploadcare)
  fileInfo?: {
    name: string;
    size: number;
    type: string;
  };
  budget?: string;
  timestamp: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

// ── Rate Limiter ──────────────────────────────────────────────────────

class RateLimiter {
  private counts: Map<string, { count: number; resetTime: number }> = new Map();
  
  check(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.counts.get(key);
    
    if (!record || now > record.resetTime) {
      this.counts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (record.count >= limit) return false;
    
    record.count++;
    return true;
  }
}

const rateLimiter = new RateLimiter();

// ── Input Validator ──────────────────────────────────────────────────

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function sanitizeText(text: string, maxLength = 500): string {
  return text
    .replace(/<[^>]*>/g, '')           // Strip HTML tags
    .replace(/[<>&'"]/g, (c) => ({     // HTML encode special chars
      '<': '&lt;', '>': '&gt;',
      '&': '&amp;', "'": '&#39;', '"': '&quot;'
    })[c] || c)
    .trim()
    .slice(0, maxLength);
}

// ── Session Manager ──────────────────────────────────────────────────

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let sessionId = sessionStorage.getItem('chat_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('chat_session_id', sessionId);
  }
  return sessionId;
}

// ── Webhook Sender ────────────────────────────────────────────────────

async function sendToWebhook<T>(
  webhookUrl: string,
  data: T,
  rateLimitKey: string,
  rateLimitConfig: { limit: number; windowMs: number }
): Promise<{ success: boolean; message?: string; error?: string }> {
  
  // Rate limiting check
  if (!rateLimiter.check(rateLimitKey, rateLimitConfig.limit, rateLimitConfig.windowMs)) {
    return {
      success: false,
      error: 'Terlalu banyak permintaan. Coba lagi dalam beberapa menit.'
    };
  }

  if (!webhookUrl) {
    console.warn('Webhook URL tidak dikonfigurasi. Set env variable.');
    // Fallback: log ke console saja (development mode)
    console.log('[n8n Webhook] Data yang akan dikirim:', data);
    return { success: true, message: 'Dev mode: data logged to console' };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Tambah custom header untuk verifikasi (set di n8n webhook filter)
        'X-Source': 'portfolio-website',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json().catch(() => ({}));
    return { success: true, message: result.message || 'Berhasil dikirim' };
    
  } catch (error) {
    console.error('[n8n] Webhook error:', error);
    return {
      success: false,
      error: 'Gagal mengirim pesan. Coba beberapa saat lagi.'
    };
  }
}

// ── Public API ────────────────────────────────────────────────────────

/**
 * Kirim pesan chat ke n8n
 * Rate limit: 10 pesan per menit per sesi
 */
export async function sendChatMessage(message: string) {
  const sessionId = getOrCreateSessionId();
  
  const payload: ChatMessage = {
    sessionId,
    message: sanitizeText(message, 500),
    timestamp: new Date().toISOString(),
    page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 100) : undefined,
  };

  return sendToWebhook(
    process.env.N8N_CHAT_WEBHOOK || '',
    payload,
    `chat_${sessionId}`,
    { limit: 10, windowMs: 60_000 }  // 10 msg per menit
  );
}

/**
 * Kirim service request ke n8n
 * Rate limit: 3 request per jam per IP (approximated by session)
 */
export async function sendServiceRequest(data: Omit<ServiceRequest, 'timestamp'>) {
  const sessionId = getOrCreateSessionId();
  
  const payload: ServiceRequest = {
    ...data,
    name: sanitizeText(data.name, 100),
    email: data.email.toLowerCase().trim(),
    subject: sanitizeText(data.subject, 200),
    description: sanitizeText(data.description, 2000),
    timestamp: new Date().toISOString(),
  };

  // Validasi email
  if (!validateEmail(payload.email)) {
    return { success: false, error: 'Format email tidak valid' };
  }

  return sendToWebhook(
    process.env.N8N_SERVICE_WEBHOOK || '',
    payload,
    `service_${sessionId}`,
    { limit: 3, windowMs: 3_600_000 }  // 3 request per jam
  );
}

/**
 * Kirim contact form ke n8n
 * Rate limit: 5 per jam
 */
export async function sendContactForm(data: Omit<ContactForm, 'timestamp'>) {
  const sessionId = getOrCreateSessionId();
  
  const payload: ContactForm = {
    ...data,
    name: sanitizeText(data.name, 100),
    email: data.email.toLowerCase().trim(),
    subject: sanitizeText(data.subject, 200),
    message: sanitizeText(data.message, 2000),
    timestamp: new Date().toISOString(),
  };

  if (!validateEmail(payload.email)) {
    return { success: false, error: 'Format email tidak valid' };
  }

  return sendToWebhook(
    process.env.N8N_CONTACT_WEBHOOK || '',
    payload,
    `contact_${sessionId}`,
    { limit: 5, windowMs: 3_600_000 }
  );
}
