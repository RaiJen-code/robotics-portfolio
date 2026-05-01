// src/pages/index.tsx
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowRight, Github, ExternalLink, Star,
  MessageSquare, Code, Cpu, Brain, Zap, Printer, FileText
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Hero from '../components/sections/Hero';
import LiveChat from '../components/ui/LiveChat';
import { getAllProjects, type ProjectMeta } from '../lib/markdown';
import { imgSrc } from '../lib/utils';
import { GetStaticProps } from 'next';

// ── Skills + Services Section ──────────────────────────────────────────

const SERVICES_PREVIEW = [
  {
    id: 'consultation',
    icon: Cpu,
    title: 'Konsultasi Teknik',
    tagline: 'Robotics, AI, embedded — online & offline',
    price: 'Harga fleksibel',
    color: '#00f0e6',
  },
  {
    id: '3d-printing',
    icon: Printer,
    title: '3D Printing',
    tagline: 'Prototipe, enclosure, spare part custom',
    price: 'mulai Rp 1.500 / gram',
    color: '#60a5fa',
  },
  {
    id: 'document-print',
    icon: FileText,
    title: 'Print Dokumen',
    tagline: 'Skripsi, laporan, materi berkualitas',
    price: 'mulai Rp 300 / lembar',
    color: '#4ade80',
  },
];

const SKILL_BARS = [
  {
    category: 'Robotics & Embedded',
    icon: Cpu,
    color: '#00f0e6',
    skills: [
      { name: 'Arduino / ESP32 / STM32', level: 95 },
      { name: 'ROS / ROS2', level: 85 },
      { name: 'Jetson Nano / CUDA', level: 80 },
      { name: 'PID Control / Sensor Fusion', level: 78 },
    ],
  },
  {
    category: 'AI & Machine Learning',
    icon: Brain,
    color: '#a78bfa',
    skills: [
      { name: 'Python / TensorFlow / Keras', level: 90 },
      { name: 'OpenCV / MediaPipe', level: 88 },
      { name: 'YOLO / Object Detection', level: 82 },
      { name: 'Edge AI / TFLite', level: 78 },
    ],
  },
  {
    category: 'IoT & Big Data',
    icon: Zap,
    color: '#60a5fa',
    skills: [
      { name: 'MQTT / Blynk API', level: 90 },
      { name: 'Docker / Kafka / Spark', level: 82 },
      { name: 'Laravel / MySQL', level: 78 },
      { name: 'Modbus / RS485', level: 75 },
    ],
  },
  {
    category: 'Software & Design',
    icon: Code,
    color: '#4ade80',
    skills: [
      { name: 'C / C++', level: 88 },
      { name: 'JavaScript / TypeScript', level: 80 },
      { name: '3D CAD / Printing', level: 85 },
      { name: 'PCB Design / KiCad', level: 72 },
    ],
  },
];

function SkillsSection() {
  const [animated, setAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const CX = 150, CY = 150;
  const IR = 54, IW = 30;
  const OR = 92, OW = 24;
  const IC = 2 * Math.PI * IR;
  const OC = 2 * Math.PI * OR;
  const CAT_GAP   = 5;
  const SKILL_GAP = 2.5;
  const CAT_DEG   = 90;
  const SKILL_DEG = (CAT_DEG - CAT_GAP) / 4;
  const catLen    = ((CAT_DEG - CAT_GAP) / 360) * IC;
  const skillLen  = ((SKILL_DEG - SKILL_GAP) / 360) * OC;

  return (
    <section className="section" style={{ paddingTop: '2.5rem' }} ref={sectionRef}>
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* ── Left: Tech Stack ──────────────────────────────────── */}
          <div>
            <p className="section-label">Expertise</p>
            <h2 className="section-title mb-1">
              Technical <span className="text-gradient">Stack</span>
            </h2>
            <p className="text-dark-400 text-sm mb-7">
              Full-stack dari firmware hingga cloud, hardware hingga frontend.
            </p>

            {/* Sunburst chart */}
            <div className="flex justify-center mb-6">
              <div className="w-[230px]">
                <svg viewBox="0 0 300 300" className="w-full">
                  <circle cx={CX} cy={CY} r={IR} fill="none" stroke="#ffffff07" strokeWidth={IW} />
                  <circle cx={CX} cy={CY} r={OR} fill="none" stroke="#ffffff04" strokeWidth={OW} />

                  {SKILL_BARS.map((cat, ci) => {
                    const startDeg = ci * CAT_DEG + CAT_GAP / 2;
                    return (
                      <circle
                        key={`in-${ci}`}
                        cx={CX} cy={CY} r={IR}
                        fill="none" stroke={cat.color} strokeWidth={IW}
                        transform={`rotate(${startDeg - 90}, ${CX}, ${CY})`}
                        style={{
                          strokeDasharray: animated ? `${catLen} ${IC - catLen}` : `0 ${IC}`,
                          transition: `stroke-dasharray 900ms cubic-bezier(0.4,0,0.2,1) ${ci * 160}ms`,
                          filter: `drop-shadow(0 0 6px ${cat.color}90)`,
                        }}
                        opacity={0.9}
                      />
                    );
                  })}

                  {SKILL_BARS.flatMap((cat, ci) =>
                    cat.skills.map((_, si) => {
                      const startDeg = ci * CAT_DEG + CAT_GAP / 2 + si * SKILL_DEG + SKILL_GAP / 2;
                      const opacity  = 0.38 + (si / (cat.skills.length - 1)) * 0.58;
                      return (
                        <circle
                          key={`out-${ci}-${si}`}
                          cx={CX} cy={CY} r={OR}
                          fill="none" stroke={cat.color} strokeWidth={OW}
                          transform={`rotate(${startDeg - 90}, ${CX}, ${CY})`}
                          style={{
                            strokeDasharray: animated ? `${skillLen} ${OC - skillLen}` : `0 ${OC}`,
                            transition: `stroke-dasharray 750ms cubic-bezier(0.4,0,0.2,1) ${350 + ci * 100 + si * 55}ms`,
                            opacity,
                            filter: `drop-shadow(0 0 4px ${cat.color}60)`,
                          }}
                        />
                      );
                    })
                  )}

                  <circle cx={CX} cy={CY} r={24} fill="#0d0d14" stroke="#00f0e615" strokeWidth={1} />
                  <text x={CX} y={CY - 3} textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#00f0e668" letterSpacing="2">TECH</text>
                  <text x={CX} y={CY + 7} textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#00f0e668" letterSpacing="2">STACK</text>
                </svg>
              </div>
            </div>

            {/* Compact 2×2 skill chips */}
            <div className="grid grid-cols-2 gap-2">
              {SKILL_BARS.map(({ category, color, skills }) => (
                <div key={category} className="bg-dark-800/40 backdrop-blur-md border border-dark-600/50 p-3 hover:border-dark-600 transition-colors" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-dark-700/60">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
                    <span className="font-heading font-semibold leading-tight" style={{ color, fontSize: '10px' }}>
                      {category}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {skills.slice(0, 3).map(s => (
                      <li key={s.name} className="font-mono text-dark-500 leading-tight" style={{ fontSize: '9px' }}>
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Services Hook ───────────────────────────────── */}
          <div>
            <p className="section-label">Services</p>
            <h2 className="section-title mb-1">
              Apa yang Saya <span className="text-gradient">Tawarkan</span>
            </h2>
            <p className="text-dark-400 text-sm mb-7">
              Butuh bantuan teknis, prototipe, atau cetak? Saya siap membantu.
            </p>

            <div className="space-y-3 mb-5">
              {SERVICES_PREVIEW.map(({ id, icon: Icon, title, tagline, price, color }) => (
                <Link
                  key={id}
                  href="/services"
                  className="flex items-center gap-4 p-4 bg-dark-800/45 backdrop-blur-md border border-dark-600/50 hover:border-primary-500/30 group transition-all"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
                >
                  <div
                    className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}18`, border: `1px solid ${color}40` }}
                  >
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading font-semibold text-dark-100 text-sm">{title}</span>
                      <ArrowRight size={13} className="text-dark-600 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                    </div>
                    <p className="text-dark-400 text-xs mt-0.5 leading-relaxed">{tagline}</p>
                    <span className="font-mono mt-1.5 block" style={{ color, fontSize: '10px' }}>{price}</span>
                  </div>
                </Link>
              ))}
            </div>

            <Link href="/services" className="btn-primary text-sm w-full flex justify-center items-center gap-2">
              Lihat Semua Service <ArrowRight size={14} />
            </Link>

            <div className="mt-4 flex items-center justify-center gap-3 text-dark-500 font-mono" style={{ fontSize: '10px' }}>
              <span>✦ Konsultasi pertama gratis</span>
              <span className="text-dark-700">·</span>
              <span>Response &lt; 2 jam</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Portfolio Preview ─────────────────────────────────────────────────

function PortfolioSection({ projects }: { projects: ProjectMeta[] }) {
  const featured = projects.filter(p => p.featured).slice(0, 3);
  
  return (
    <section className="section bg-dark-800/30">
      <div className="section-inner">
        <div className="flex flex-wrap justify-between items-end mb-12 gap-4">
          <div>
            <p className="section-label">Portfolio</p>
            <h2 className="section-title mb-0">Featured Work</h2>
          </div>
          <Link href="/portfolio" className="btn-outline text-sm">
            Semua Project <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map(project => (
            <Link
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="card-glow group block"
            >
              {/* Cover image placeholder */}
              <div className="w-full h-40 bg-dark-700 border border-dark-600 mb-4 relative overflow-hidden">
                {project.coverImage ? (
                  <img
                    src={imgSrc(project.coverImage || '')}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Cpu size={32} className="text-dark-600" />
                  </div>
                )}
                <div className="absolute top-2 right-2 px-2 py-1 bg-dark-900/80 border border-primary-500/30 text-primary-500 text-xs font-mono">
                  {project.category}
                </div>
              </div>
              
              <h3 className="font-heading font-semibold text-dark-50 group-hover:text-primary-500 transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-dark-300 text-sm line-clamp-2 mb-4">{project.excerpt}</p>
              
              <div className="flex flex-wrap gap-1">
                {project.tech.slice(0, 3).map(t => (
                  <span key={t} className="skill-badge text-xs py-1">{t}</span>
                ))}
                {project.tech.length > 3 && (
                  <span className="skill-badge text-xs py-1">+{project.tech.length - 3}</span>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                {project.githubUrl && (
                  <span className="text-dark-400 hover:text-primary-500 transition-colors">
                    <Github size={14} />
                  </span>
                )}
                {project.demoUrl && (
                  <span className="text-dark-400 hover:text-primary-500 transition-colors">
                    <ExternalLink size={14} />
                  </span>
                )}
                <span className="ml-auto text-xs text-dark-500 font-mono group-hover:text-primary-500 transition-colors flex items-center gap-1">
                  Case Study <ArrowRight size={10} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: 'Andika Pratama',
    role: 'Founder, TechStartup ID',
    text: 'RaiJen berhasil membangun sistem robotik untuk line-following kami dalam waktu 2 minggu. Kode bersih, dokumentasi lengkap, dan komunikasi responsif.',
    rating: 5,
  },
  {
    name: 'Dr. Sari Kusuma',
    role: 'Dosen Teknik Elektro',
    text: 'Konsultasi sangat membantu. Solusi yang diberikan untuk proyek FYP mahasiswa kami tepat sasaran dan mudah diimplementasikan.',
    rating: 5,
  },
  {
    name: 'Budi Santoso',
    role: 'Researcher, BRIN',
    text: '3D printing prototipe sensor housing selesai tepat waktu dengan kualitas bagus. Konsultasi desain gratis yang sangat membantu.',
    rating: 5,
  },
];

function TestimonialsSection() {
  return (
    <section className="section">
      <div className="section-inner">
        <div className="text-center mb-12">
          <p className="section-label">Testimonials</p>
          <h2 className="section-title">
            Apa Kata <span className="text-gradient">Klien</span>?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="card relative">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-dark-200 text-sm leading-relaxed mb-5 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/30 flex items-center justify-center rounded-none">
                  <span className="font-display text-xs text-primary-500">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-heading font-semibold text-dark-50 text-sm">{t.name}</p>
                  <p className="text-dark-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Section ───────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="section">
      <div className="section-inner">
        <div className="relative border border-primary-500/20 bg-gradient-to-br from-dark-800 to-dark-900 p-12 text-center overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-radial-glow opacity-50" />
          <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary-500/30" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary-500/30" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap size={20} className="text-primary-500" />
              <span className="font-mono text-xs text-primary-500 tracking-widest uppercase">
                Let's Build Something
              </span>
              <Zap size={20} className="text-primary-500" />
            </div>
            <h2 className="font-heading text-4xl font-bold text-dark-50 mb-4 text-balanced">
              Ada Project Robotics atau AI yang Ingin Dibangun?
            </h2>
            <p className="text-dark-200 mb-8 max-w-xl mx-auto">
              Saya terbuka untuk proyek freelance, kolaborasi riset, dan konsultasi teknikal. 
              Mari diskusikan ide kamu!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://wa.me/6288971759690?text=Halo%20Rangga!%20Saya%20ingin%20mulai%20project%20bersama%20kamu."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Mulai Project <ArrowRight size={16} />
              </a>
              <Link href="/about" className="btn-outline">
                Kenali Saya
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────

interface Props {
  featuredProjects: ProjectMeta[];
}

export default function Home({ featuredProjects }: Props) {
  return (
    <Layout>
      <Head>
        <title>RaiJen — Robotics Engineer & AI Developer</title>
        <meta name="description" content="Personal branding website RaiJen, Robotics Engineer & AI Developer. Layanan konsultasi, 3D printing, dan embedded system development." />
        <meta property="og:title" content="RaiJen — Robotics Engineer & AI Developer" />
        <meta property="og:description" content="Personal branding website RaiJen, Robotics Engineer & AI Developer." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      <SkillsSection />
      <PortfolioSection projects={featuredProjects} />
      <TestimonialsSection />
      <CTASection />
      
      {/* Chat widget */}
      <LiveChat />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const featuredProjects = getAllProjects();

  return {
    props: {
      featuredProjects: featuredProjects.slice(0, 6),
    },
  };
};
