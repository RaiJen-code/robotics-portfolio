// src/pages/index.tsx
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowRight, Github, ExternalLink, Star,
  MessageSquare, Code, Cpu, Brain, Zap
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Hero from '../components/sections/Hero';
import LiveChat from '../components/ui/LiveChat';
import { getAllProjects, type ProjectMeta } from '../lib/markdown';
import { imgSrc } from '../lib/utils';
import { GetStaticProps } from 'next';

// ── Skills Section ─────────────────────────────────────────────────────

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

  return (
    <section className="section" ref={sectionRef}>
      <div className="section-inner">
        <div className="text-center mb-10">
          <p className="section-label">Expertise</p>
          <h2 className="section-title">
            Technical <span className="text-gradient">Stack</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Full-stack dari firmware hingga cloud, hardware hingga frontend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILL_BARS.map(({ category, icon: Icon, color, skills }) => (
            <div key={category} className="card-glow">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-dark-700">
                <div
                  className="w-8 h-8 flex items-center justify-center border"
                  style={{ borderColor: color + '50', backgroundColor: color + '18' }}
                >
                  <Icon size={15} style={{ color }} />
                </div>
                <h3 className="font-heading font-semibold text-dark-50 text-sm">{category}</h3>
              </div>

              {/* Skill bars */}
              <div className="space-y-4">
                {skills.map((skill, idx) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-mono text-dark-300">{skill.name}</span>
                      <span className="text-xs font-mono font-semibold" style={{ color }}>
                        {skill.level}%
                      </span>
                    </div>
                    {/* Track */}
                    <div className="h-1 bg-dark-700 w-full overflow-hidden">
                      <div
                        className="h-full transition-all ease-out"
                        style={{
                          width: animated ? `${skill.level}%` : '0%',
                          backgroundColor: color,
                          boxShadow: animated ? `0 0 6px ${color}80` : 'none',
                          transitionDuration: '900ms',
                          transitionDelay: `${idx * 120}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
