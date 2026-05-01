// src/pages/about.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Download, Mail, Phone, MapPin, GraduationCap, ExternalLink, ChevronLeft, ChevronRight, Github, Instagram } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { imgSrc } from '../lib/utils';

// ── Photo Slideshow ────────────────────────────────────────────────────

const PHOTOS = [
  { src: '/images/about/photo-1.jpg', alt: 'Rangga Prasetya — photo 1' },
  { src: '/images/about/photo-2.jpg', alt: 'Rangga Prasetya — photo 2' },
  { src: '/images/about/photo-3.jpg', alt: 'Rangga Prasetya — photo 3' },
  { src: '/images/about/photo-4.jpg', alt: 'Rangga Prasetya — photo 4' },
  { src: '/images/about/photo-5.jpg', alt: 'Rangga Prasetya — photo 5' },
];

function PhotoSlideshow() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % PHOTOS.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const prev = () => setCurrent(c => (c - 1 + PHOTOS.length) % PHOTOS.length);
  const next = () => setCurrent(c => (c + 1) % PHOTOS.length);

  return (
    <div
      className="relative overflow-hidden bg-dark-800 border border-dark-600/80 mb-4 group ring-1 ring-primary-500/10"
      style={{ aspectRatio: '16/9' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`@keyframes photoFill{from{width:0}to{width:100%}}`}</style>

      {/* Fallback */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-dark-600 pointer-events-none">
        <span className="text-3xl mb-1">📷</span>
        <span className="text-xs font-mono">Tambahkan foto kamu</span>
      </div>

      {/* Slides — scale+fade transition */}
      {PHOTOS.map((photo, i) => (
        <img
          key={photo.src}
          src={imgSrc(photo.src)}
          alt={photo.alt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === current ? 1 : 0,
            transform: i === current ? 'scale(1)' : 'scale(1.06)',
            transition: 'opacity 1100ms cubic-bezier(0.4,0,0.2,1), transform 1100ms cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/75 via-dark-900/10 to-transparent pointer-events-none z-10" />

      {/* Corner accents */}
      <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 border-primary-500/80 z-20 pointer-events-none" />
      <div className="absolute top-3 right-3 w-5 h-5 border-r-2 border-t-2 border-primary-500/80 z-20 pointer-events-none" />

      {/* Bottom bar: counter + dots */}
      <div className="absolute bottom-3 left-0 right-0 px-3 flex items-center justify-between z-20">
        <span className="font-mono text-[10px] text-dark-400 bg-dark-900/60 backdrop-blur-sm px-1.5 py-0.5">
          {String(current + 1).padStart(2, '0')} / {String(PHOTOS.length).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-1.5">
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Photo ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: i === current ? '16px' : '5px',
                height: '3px',
                background: i === current ? '#00f0e6' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      {!paused && (
        <div
          key={`p-${current}`}
          className="absolute bottom-0 left-0 h-[2px] bg-primary-500/70 z-20"
          style={{ animation: 'photoFill 5s linear forwards' }}
        />
      )}

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-dark-900/60 backdrop-blur-sm border border-dark-600 text-dark-300 hover:text-primary-500 hover:border-primary-500/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20"
        aria-label="Previous"
      >
        <ChevronLeft size={14} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-dark-900/60 backdrop-blur-sm border border-dark-600 text-dark-300 hover:text-primary-500 hover:border-primary-500/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20"
        aria-label="Next"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────

const STATS = [
  { value: '6+', label: 'Major Projects' },
  { value: '3', label: 'Years Active' },
  { value: '5+', label: 'Certifications' },
  { value: '1K+', label: 'Students Managed' },
];

const SKILLS = [
  {
    category: 'Robotics & Embedded',
    items: ['ROS/ROS2', 'Arduino', 'ESP32', 'Wemos', 'Jetson Nano', 'Raspberry Pi', 'Orange Pi', 'CoppeliaSim', 'Servo Control', 'CUDA'],
  },
  {
    category: 'AI & Computer Vision',
    items: ['Python', 'TensorFlow', 'PyTorch', 'Keras', 'OpenCV', 'MediaPipe', 'YOLO', 'TFLite', 'NLP/Sentiment', 'Time-Series ML'],
  },
  {
    category: 'IoT & Big Data',
    items: ['MQTT', 'Blynk API', 'Apache Kafka', 'Apache Spark', 'Docker', 'MySQL', 'SQLite', 'Data Pipeline', 'Modbus', 'Laravel'],
  },
  {
    category: 'Software & Design',
    items: ['C/C++', 'JavaScript', 'SQL', 'Autodesk Inventor', '3D Printing', 'PCB Design', 'Git', 'Web Dashboard', 'Data Annotation'],
  },
];

const EXPERIENCE = [
  {
    period: '2025 — Present',
    title: 'Robotics Instructor',
    org: 'Diginusa — Kompas Gramedia',
    dept: 'Elementary School Education Division',
    bullets: [
      'Taught foundational robotics and computational thinking through project-based learning for elementary students.',
      'Designed modular lesson plans covering electronics, sensors, actuators, and microcontroller programming.',
      'Guided students in building and programming sensor-based robotic systems.',
      'Evaluated student progress and provided structured feedback to support STEM development.',
    ],
    tags: ['Robotics Education', 'Curriculum Design', 'Microcontrollers'],
  },
  {
    period: 'Sep 2024 — Jan 2025',
    title: 'Software Development Intern',
    org: 'PT PLN ICON PLUS',
    dept: 'Sub-bidang Pengembang Aplikasi 1',
    bullets: [
      'Developed a big data pipeline using Docker, Apache Kafka, and Apache Spark with full database integration.',
      'Built a power leakage monitoring tool for ADW310-4G Power Meters using Laravel.',
      'Created data annotation pipelines for ML sentiment analysis on the Pegadaian application.',
      'Designed Modbus communication analysis for real-time power meter monitoring.',
    ],
    tags: ['Docker', 'Kafka', 'Spark', 'Laravel', 'IoT', 'MQTT'],
  },
  {
    period: '2024 — 2025',
    title: 'Microcontroller Laboratory Assistant',
    org: 'Institut Teknologi PLN',
    dept: 'Electrical Engineering Department',
    bullets: [
      'Taught and supervised practical sessions on Arduino, Wemos, and ESP32 for 5th semester students.',
      'Designed IoT systems utilizing Blynk API, MQTT, and web-based dashboards.',
      'Developed teaching modules and experiment guidelines to standardize learning outcomes.',
    ],
    tags: ['Arduino', 'ESP32', 'IoT', 'MQTT', 'Teaching'],
  },
  {
    period: '2024 — 2025',
    title: 'Intelligent Robotic Club Supervisor',
    org: 'IRC — IT-PLN',
    dept: '@irc_itpln',
    bullets: [
      'Mentored members in robotics development covering ROS, electronics, and hardware-software integration.',
      'Delivered hands-on training in 3D modeling, printing, and component prototyping.',
      'Provided expertise in Jetson Nano, Raspberry Pi, and Orange Pi for AI-powered applications.',
    ],
    tags: ['ROS2', 'Jetson Nano', '3D Printing', 'Mentoring'],
  },
  {
    period: '2022 — 2025',
    title: 'Language Development Center Assistant',
    org: 'Institut Teknologi PLN',
    dept: '3 Consecutive Academic Periods',
    bullets: [
      'Managed examinations for over 1,000 students annually across ELT, BEES, and E-MOS programs.',
      'Served as supervising proctor, tutor, and main moderator for the English Conversation program.',
    ],
    tags: ['Administration', 'English Testing', 'Communication'],
  },
];

const CERTIFICATIONS = [
  {
    num: '01',
    title: 'Competency Certificate — Low Voltage Utilization Design',
    issuer: 'PT Sentra Teknologi Terapan · M.71.141.01.KUALIFIKASI.3.MANTER',
  },
  {
    num: '02',
    title: 'Internship Certificate — Application Development Division',
    issuer: 'PLN ICON+ · September 2024 – January 2025',
  },
  {
    num: '03',
    title: 'Team Member Certificate — Indonesian Robot Contest (KRI) 2024',
    issuer: 'Puspresnas / BPTI · Robot Dance Division, Regional Level',
  },
  {
    num: '04',
    title: 'Copyright Registration — Robotic Arm Computer Vision Journal',
    issuer: 'HKI · DOI: 10.62870/setrum.v14i1.30964',
  },
  {
    num: '05',
    title: 'MSIB Certificate — IoT Engineer Camp with Smart Device Project',
    issuer: 'Indobot Academy · Kampus Merdeka Program',
  },
  {
    num: '06',
    title: 'Outstanding Student Award — Mahasiswa Berprestasi',
    issuer: 'Institut Teknologi PLN · September 2025',
  },
];

// ── Page ──────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <Layout>
      <Head>
        <title>About — Rangga Prasetya | Electrical Engineer & Robotics Developer</title>
        <meta
          name="description"
          content="Rangga Prasetya Adiwijaya — Electrical Engineering graduate from IT-PLN, specializing in robotics, embedded systems, AI, and IoT."
        />
      </Head>

      {/* Hero */}
      <section className="section">
        <div className="section-inner">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Bio */}
            <div>
              <p className="section-label">About Me</p>
              <h1 className="section-title">
                Rangga <span className="text-gradient">Prasetya</span>
              </h1>

              <div className="space-y-3 text-dark-200 leading-relaxed mb-5 text-sm">
                <p>
                  I am an <span className="text-dark-50 font-medium">Electrical Engineering graduate</span> from
                  Institut Teknologi PLN, specializing in the intersection of robotics, embedded systems, and machine
                  learning. I build intelligent systems that bridge hardware and software — from low-level firmware
                  to cloud-connected ML pipelines.
                </p>
                <p>
                  My work spans autonomous robotics, IoT infrastructure, computer vision, and big data engineering.
                  I approach each project with a systems-thinking mindset, having led teams in national competitions,
                  industry internships, and funded research programs.
                </p>
                <p>
                  I hold an official government competency certification as{' '}
                  <span className="text-primary-500 font-medium">Team Leader in Low Voltage Utilization Design</span>,
                  alongside recognition as{' '}
                  <span className="text-primary-500 font-medium">Outstanding Student (Mahasiswa Berprestasi)</span> by
                  Institut Teknologi PLN in 2025.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-px bg-dark-700 mb-5">
                {STATS.map(stat => (
                  <div key={stat.label} className="bg-dark-800 p-4">
                    <div className="font-heading text-3xl font-bold text-gradient mb-0.5">{stat.value}</div>
                    <div className="font-mono text-xs text-dark-400 tracking-wider uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CV Download */}
              <a
                href={imgSrc('/rangga_resume.pdf')}
                download="Rangga_Prasetya_CV.pdf"
                className="btn-outline inline-flex"
              >
                <Download size={16} />
                Download Full CV
              </a>
            </div>

            {/* Right: Photo slideshow + Info cards */}
            <div>
              {/* Photo slideshow */}
              <PhotoSlideshow />

              {/* Profile info */}
              <div className="card mb-4">
                <h2 className="font-heading font-semibold text-dark-50 mb-3 text-sm tracking-widest uppercase">
                  Personal Info
                </h2>
                <div className="space-y-2">
                  {[
                    { icon: null, label: 'Full Name', value: 'Rangga Prasetya Adiwijaya' },
                    { icon: MapPin, label: 'Location', value: 'Jakarta, Indonesia' },
                    { icon: Mail, label: 'Email', value: 'razetya100@gmail.com', href: 'mailto:razetya100@gmail.com' },
                    { icon: Phone, label: 'WhatsApp', value: '+62 889 7175 9690', href: 'https://wa.me/6288971759690' },
                    { icon: Instagram, label: 'Instagram', value: '@rangga.vibes', href: 'https://instagram.com/rangga.vibes' },
                    { icon: Github, label: 'GitHub', value: 'github.com/RaiJen-code', href: 'https://github.com/RaiJen-code' },
                    { icon: GraduationCap, label: 'Degree', value: 'B.Eng Electrical Engineering, IT-PLN (2021–2025)' },
                  ].map(({ label, value, href }) => (
                    <div key={label} className="flex gap-3 border-b border-dark-700/60 pb-2 last:border-0 last:pb-0">
                      <span className="font-mono text-[10px] text-dark-500 tracking-widest uppercase w-20 pt-0.5 shrink-0">
                        {label}
                      </span>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="text-sm text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1"
                        >
                          {value}
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-sm text-dark-100">{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability badge */}
              <div className="card border-primary-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="status-online" />
                  <span className="font-mono text-xs text-dark-200 tracking-widest uppercase">
                    Currently Available
                  </span>
                </div>
                <p className="text-dark-300 text-sm">
                  Open to freelance projects, collaboration, full-time roles in robotics, AI, and embedded systems.
                </p>
                <a
                  href="https://wa.me/6288971759690?text=Halo%20Rangga!%20Saya%20ingin%20book%20konsultasi%20teknik%20dengan%20kamu."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-4 text-xs"
                >
                  Book a Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-dark-700" />

      {/* Skills */}
      <section className="section bg-dark-800/30">
        <div className="section-inner">
          <p className="section-label">Technical Stack</p>
          <h2 className="section-title">
            Skills & <span className="text-gradient">Expertise</span>
          </h2>

          <div className="border border-dark-700 divide-y divide-dark-700/60">
            {SKILLS.map(({ category, items }, i) => {
              const color = ['#00f0e6', '#a78bfa', '#60a5fa', '#4ade80'][i];
              return (
                <div key={category} className="flex group hover:bg-dark-800/80 transition-colors">
                  {/* Color accent bar */}
                  <div className="w-[3px] shrink-0" style={{ background: color, opacity: 0.7 }} />
                  {/* Content */}
                  <div className="flex-1 py-4 px-5 flex flex-col sm:flex-row sm:items-start gap-3">
                    <span
                      className="sm:w-44 shrink-0 font-mono text-[10px] uppercase tracking-widest pt-0.5 font-semibold"
                      style={{ color }}
                    >
                      {category}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 text-[11px] font-mono text-dark-300 bg-dark-900/60 border border-dark-700/80 hover:border-dark-500 hover:text-dark-100 transition-colors cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="h-px bg-dark-700" />

      {/* Experience */}
      <section className="section">
        <div className="section-inner">
          <p className="section-label">Work History</p>
          <h2 className="section-title">
            Work <span className="text-gradient">Experience</span>
          </h2>

          {/* Timeline */}
          <div className="relative pl-4">
            {/* Vertical line */}
            <div className="absolute left-0 top-1 bottom-1 w-px bg-dark-700" />

            <div className="space-y-0">
              {EXPERIENCE.map((exp, i) => (
                <div key={i} className="relative pb-6 last:pb-0 group">
                  {/* Timeline dot */}
                  <div className="absolute -left-4 top-1.5 w-2 h-2 border border-primary-500/40 bg-dark-900 group-hover:bg-primary-500/20 group-hover:border-primary-500 transition-all -translate-x-[3px]" />

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-0.5">
                    <h3 className="font-heading font-semibold text-dark-50 text-sm leading-tight">{exp.title}</h3>
                    <span className="font-mono text-[10px] text-primary-500 shrink-0 mt-0.5 whitespace-nowrap">{exp.period}</span>
                  </div>

                  {/* Org · Dept */}
                  <p className="font-mono text-xs text-dark-400 mb-2.5">
                    {exp.org}
                    <span className="text-dark-600 mx-1">·</span>
                    <span className="text-dark-500">{exp.dept}</span>
                  </p>

                  {/* Bullets */}
                  <ul className="space-y-1 mb-2.5">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="text-dark-400 text-xs leading-relaxed flex gap-2">
                        <span className="text-primary-500/40 shrink-0 mt-0.5">▸</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-[10px] font-mono border border-dark-700 text-dark-500 bg-dark-800/40 hover:text-dark-300 hover:border-dark-600 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Separator */}
                  {i < EXPERIENCE.length - 1 && (
                    <div className="mt-6 border-b border-dark-700/40" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-dark-700" />

      {/* Certifications */}
      <section className="section bg-dark-800/30">
        <div className="section-inner">
          <p className="section-label">Recognition</p>
          <h2 className="section-title">
            Certifications & <span className="text-gradient">Awards</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-dark-700">
            {CERTIFICATIONS.map(cert => (
              <div key={cert.num} className="bg-dark-800 p-5 flex gap-4 items-start hover:bg-dark-700 transition-colors">
                <span className="font-mono text-xs text-primary-500 shrink-0 mt-1">{cert.num}</span>
                <div>
                  <h3 className="font-heading font-semibold text-dark-100 text-sm mb-2 leading-snug">
                    {cert.title}
                  </h3>
                  <p className="font-mono text-xs text-dark-400">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-dark-700" />

      {/* CTA */}
      <section className="section">
        <div className="section-inner text-center">
          <p className="section-label">Let's Connect</p>
          <h2 className="font-heading text-4xl font-bold text-dark-50 mb-4">
            Ready to Build Something <span className="text-gradient">Together?</span>
          </h2>
          <p className="text-dark-200 mb-8 max-w-lg mx-auto">
            Whether it's a robotics project, AI integration, or technical consultation — I'm open to new challenges.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/6288971759690?text=Halo%20Rangga!%20Saya%20tertarik%20untuk%20hire%20kamu."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Hire Me
            </a>
            <Link href="/portfolio" className="btn-outline">
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
