// src/pages/services.tsx
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  Cpu, Printer, FileText, Check, Clock, 
  Upload, Send, AlertCircle, CheckCircle, ChevronDown
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { sendServiceRequest, validateEmail } from '../lib/n8n';

// ── Services Data ──────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 'consultation',
    icon: Cpu,
    title: 'Konsultasi Teknik',
    subtitle: 'Technical Consulting',
    description: 'Sesi konsultasi 1-on-1 untuk robotics, embedded systems, AI integration, sistem kontrol, atau arsitektur teknikal project kamu.',
    features: [
      'Analisis arsitektur sistem',
      'Review kode & debugging',
      'Desain hardware/firmware',
      'Stack recommendation',
      'Follow-up via chat',
    ],
    pricing: [
      { label: 'Sesi 1 Jam', price: 'Rp 150.000', note: 'Video call + dokumentasi' },
      { label: 'Paket 3 Sesi', price: 'Rp 400.000', note: 'Hemat 11%' },
      { label: 'Bulanan (8 sesi)', price: 'Rp 950.000', note: 'Hemat 21%' },
    ],
    badge: 'Paling Populer',
    color: 'primary',
  },
  {
    id: '3d-printing',
    icon: Printer,
    title: '3D Printing',
    subtitle: '3D Printing Service',
    description: 'Cetak prototipe, spare part, enclosure elektronik, atau model 3D custom. FDM printing dengan berbagai material.',
    features: [
      'Material: PLA, PETG, TPU',
      'Resolusi 0.1mm - 0.3mm',
      'Build volume 220x220x250mm',
      'Post processing dasar',
      'Konsultasi desain gratis',
    ],
    pricing: [
      { label: 'Per Gram', price: 'Rp 1.500/g', note: 'Harga material PLA' },
      { label: 'Setup Fee', price: 'Rp 10.000', note: 'Per file/item' },
      { label: 'Custom Project', price: 'Hubungi kami', note: 'Mulai Rp 50.000' },
    ],
    badge: 'Terima STL/STEP',
    color: 'blue',
  },
  {
    id: 'document-print',
    icon: FileText,
    title: 'Print Dokumen',
    subtitle: 'Document Printing',
    description: 'Cetak dokumen, laporan, skripsi, presentasi, atau materi dengan kualitas tinggi. Hitam-putih dan berwarna tersedia.',
    features: [
      'HVS 70/80gsm, Art Paper',
      'Format A4, A3',
      'Hitam putih & berwarna',
      'Jilid ring/soft cover',
      'Pengiriman area tertentu',
    ],
    pricing: [
      { label: 'HVS B&W', price: 'Rp 300/lembar', note: 'A4, 80gsm' },
      { label: 'HVS Color', price: 'Rp 1.000/lembar', note: 'A4, 80gsm' },
      { label: 'Art Paper Color', price: 'Rp 2.500/lembar', note: 'A4, 150gsm' },
    ],
    badge: 'Terima PDF/DOCX',
    color: 'green',
  },
];

// ── Service Form ──────────────────────────────────────────────────────

type ServiceType = 'consultation' | '3d-printing' | 'document-print';

interface FormData {
  type: ServiceType;
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
  urgency: 'normal' | 'urgent' | 'asap';
  budget: string;
}

const INITIAL_FORM: FormData = {
  type: 'consultation',
  name: '',
  email: '',
  phone: '',
  subject: '',
  description: '',
  urgency: 'normal',
  budget: '',
};

function ServiceForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Max 10MB
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('File terlalu besar. Maksimal 10MB.');
        return;
      }
      setFileInfo({ name: file.name, size: file.size, type: file.type });
      setErrorMsg('');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Client validation
    if (!form.name.trim() || !form.email.trim() || !form.description.trim()) {
      setErrorMsg('Mohon isi semua field yang diperlukan.');
      return;
    }

    if (!validateEmail(form.email)) {
      setErrorMsg('Format email tidak valid.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    const result = await sendServiceRequest({
      type: form.type,
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject || `${form.type} request`,
      description: form.description,
      urgency: form.urgency,
      budget: form.budget,
      fileInfo: fileInfo || undefined,
    });

    if (result.success) {
      setStatus('success');
      setForm(INITIAL_FORM);
      setFileInfo(null);
    } else {
      setStatus('error');
      setErrorMsg(result.error || 'Terjadi kesalahan. Coba lagi.');
    }
  }

  if (status === 'success') {
    return (
      <div className="card text-center py-12">
        <CheckCircle size={48} className="text-primary-500 mx-auto mb-4" />
        <h3 className="font-heading text-2xl font-bold text-dark-50 mb-3">Request Terkirim!</h3>
        <p className="text-dark-200 mb-6">
          Terima kasih! Saya akan menghubungi kamu via email dalam 1x24 jam.
          Untuk respon lebih cepat, hubungi via Telegram @RaiJenDev.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="btn-outline"
        >
          Kirim Request Lain
        </button>
      </div>
    );
  }

  return (
    <div id="booking" className="card">
      <h3 className="font-heading text-xl font-bold text-dark-50 mb-6">
        Request Service
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Service type */}
        <div>
          <label className="block font-mono text-xs text-dark-300 mb-2 tracking-wider uppercase">
            Jenis Service *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SERVICES.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, type: s.id as ServiceType }))}
                className={`p-3 border text-xs font-mono transition-all text-center ${
                  form.type === s.id
                    ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                    : 'border-dark-600 text-dark-300 hover:border-dark-400'
                }`}
              >
                <s.icon size={16} className="mx-auto mb-1" />
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Nama Lengkap *"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
          <FormField
            label="Email *"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
        </div>

        {/* Phone & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="No. WhatsApp"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
          />
          <FormField
            label="Estimasi Budget"
            name="budget"
            type="text"
            value={form.budget}
            onChange={handleChange}
            placeholder="Rp 500.000"
          />
        </div>

        {/* Subject */}
        <FormField
          label="Subjek / Judul Project"
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
          placeholder="Robot Arm 6-DOF untuk FYP"
        />

        {/* Description */}
        <div>
          <label className="block font-mono text-xs text-dark-300 mb-2 tracking-wider uppercase">
            Deskripsi Kebutuhan *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Jelaskan kebutuhan kamu secara detail: tujuan, spesifikasi, deadline, kendala yang dihadapi, dll."
            className="w-full bg-dark-700 border border-dark-600 px-4 py-3 text-sm font-body text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary-500/60 transition-colors resize-none"
          />
        </div>

        {/* Urgency */}
        <div>
          <label className="block font-mono text-xs text-dark-300 mb-2 tracking-wider uppercase">
            Urgency
          </label>
          <div className="flex gap-2">
            {([
              { value: 'normal', label: '⏱ Normal (1-3 hari)' },
              { value: 'urgent', label: '🔥 Urgent (< 24 jam)' },
              { value: 'asap', label: '⚡ ASAP' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, urgency: opt.value }))}
                className={`flex-1 py-2 px-3 text-xs font-mono border transition-all ${
                  form.urgency === opt.value
                    ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                    : 'border-dark-600 text-dark-400 hover:border-dark-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* File upload (3D printing & dokumen) */}
        {(form.type === '3d-printing' || form.type === 'document-print') && (
          <div>
            <label className="block font-mono text-xs text-dark-300 mb-2 tracking-wider uppercase">
              Upload File {form.type === '3d-printing' ? '(STL / STEP)' : '(PDF / DOCX)'}
            </label>
            <div className="relative border border-dashed border-dark-600 hover:border-primary-500/50 transition-colors p-4 text-center cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                accept={form.type === '3d-printing' ? '.stl,.step,.obj,.3mf' : '.pdf,.doc,.docx,.pptx'}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {fileInfo ? (
                <div className="flex items-center gap-3 justify-center">
                  <Check size={16} className="text-primary-500" />
                  <span className="text-sm text-dark-100 font-mono">{fileInfo.name}</span>
                  <span className="text-xs text-dark-400">
                    ({(fileInfo.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
              ) : (
                <div>
                  <Upload size={20} className="text-dark-400 mx-auto mb-2" />
                  <p className="text-sm text-dark-400 font-body">
                    Drop file di sini atau klik untuk browse
                  </p>
                  <p className="text-xs text-dark-500 mt-1">Maks. 10MB</p>
                </div>
              )}
            </div>
            <p className="text-xs text-dark-500 mt-2 font-mono">
              * File akan dikirim via email setelah form ini terkirim
            </p>
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertCircle size={14} />
            {errorMsg}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary w-full justify-center"
        >
          {status === 'loading' ? (
            <>
              <span className="w-4 h-4 border-2 border-dark-900/40 border-t-dark-900 rounded-full animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <Send size={16} />
              Kirim Request
            </>
          )}
        </button>

        <p className="text-xs text-dark-500 text-center font-mono">
          Request ini akan masuk ke sistem booking saya secara otomatis ⚡
        </p>
      </form>
    </div>
  );
}

// ── Helper: Form Field ─────────────────────────────────────────────────

function FormField({ label, name, type, value, onChange, placeholder }: {
  label: string; name: string; type: string;
  value: string; onChange: any; placeholder: string;
}) {
  return (
    <div>
      <label className="block font-mono text-xs text-dark-300 mb-2 tracking-wider uppercase">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-dark-700 border border-dark-600 px-4 py-3 text-sm font-body text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary-500/60 transition-colors"
      />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <Layout>
      <Head>
        <title>Services — RaiJen | Konsultasi, 3D Printing, Print Dokumen</title>
        <meta name="description" content="Layanan konsultasi teknik, 3D printing, dan print dokumen profesional oleh RaiJen, Robotics & AI Engineer." />
      </Head>

      <div className="section">
        <div className="section-inner">
          {/* Header */}
          <div className="mb-16 max-w-2xl">
            <p className="section-label">Services</p>
            <h1 className="section-title">
              Ada yang Bisa Saya Bantu?
            </h1>
            <p className="section-subtitle">
              Dari konsultasi teknikal 1-on-1 hingga cetak prototipe 3D — semua bisa dihandle.
              Booking mudah, respon cepat.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {SERVICES.map(service => (
              <div key={service.id} className="card-glow relative group">
                {/* Badge */}
                {service.badge && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-primary-500/10 border border-primary-500/30 text-primary-500 text-xs font-mono">
                    {service.badge}
                  </div>
                )}

                <service.icon size={24} className="text-primary-500 mb-4" />
                <h3 className="font-heading text-xl font-bold text-dark-50 mb-1">
                  {service.title}
                </h3>
                <p className="font-mono text-xs text-dark-400 mb-3 tracking-wider">
                  {service.subtitle}
                </p>
                <p className="font-body text-dark-200 text-sm leading-relaxed mb-5">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-dark-200">
                      <Check size={12} className="text-primary-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Pricing */}
                <div className="border-t border-dark-700 pt-4 space-y-2">
                  {service.pricing.map(p => (
                    <div key={p.label} className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-mono text-dark-300">{p.label}</span>
                        <span className="text-xs text-dark-500 ml-2">{p.note}</span>
                      </div>
                      <span className="font-heading font-semibold text-sm text-primary-500">
                        {p.price}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href="#booking"
                  className="btn-outline w-full text-center mt-4 block text-xs"
                  onClick={(e) => {
                    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Book {service.title}
                </a>
              </div>
            ))}
          </div>

          {/* Payment Info Banner */}
          <div className="border border-primary-500/20 bg-primary-500/5 p-6 mb-20">
            <div className="flex flex-wrap gap-6 items-center justify-between">
              <div>
                <h3 className="font-heading font-semibold text-dark-50 mb-1">
                  💳 Metode Pembayaran
                </h3>
                <p className="text-dark-300 text-sm">
                  Transfer BCA / BRI / Mandiri · GoPay · OVO · QRIS
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-dark-400">Proses order</p>
                <p className="font-heading font-semibold text-dark-50">
                  DP 50% setelah konfirmasi
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="section-label">Booking</p>
              <h2 className="font-heading text-3xl font-bold text-dark-50 mb-4">
                Mulai Project Kamu Sekarang
              </h2>
              <p className="text-dark-200 text-sm leading-relaxed mb-6">
                Isi form di sebelah kanan. Request kamu akan langsung masuk ke sistem saya 
                dan saya akan konfirmasi dalam <strong className="text-primary-500">1×24 jam</strong>.
              </p>
              
              <div className="space-y-4">
                {[
                  { step: '01', title: 'Submit Request', desc: 'Isi form dengan detail kebutuhan kamu' },
                  { step: '02', title: 'Konfirmasi', desc: 'Saya review dan konfirmasi feasibility + harga' },
                  { step: '03', title: 'Pembayaran', desc: 'DP 50% setelah sepakat dengan scope' },
                  { step: '04', title: 'Pengerjaan', desc: 'Project dikerjakan sesuai timeline yang disepakati' },
                  { step: '05', title: 'Selesai & Pelunasan', desc: 'Terima hasil, pelunasan sisa 50%' },
                ].map(item => (
                  <div key={item.step} className="flex gap-4">
                    <span className="font-display text-lg text-primary-500 font-bold w-8 flex-shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <p className="font-heading font-semibold text-dark-50 text-sm">{item.title}</p>
                      <p className="text-dark-400 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ServiceForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}
