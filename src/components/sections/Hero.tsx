// src/components/sections/Hero.tsx
import { useState, useEffect } from 'react';
import { ArrowRight, Download, MessageCircle, ChevronDown, Cpu, Bot, Wrench } from 'lucide-react';
import { imgSrc } from '../../lib/utils';

const TYPED_ROLES = [
  'Robotics Engineer',
  'AI Developer',
  'Embedded Systems Dev',
  'System Architect',
];

const STATS = [
  { value: '15+', label: 'Projects' },
  { value: '3+', label: 'Years Exp.' },
  { value: '100%', label: 'Satisfaction' },
];

const QUICK_SKILLS = [
  { icon: Cpu, label: 'ROS2 / Arduino / ESP32' },
  { icon: Bot, label: 'Computer Vision / ML' },
  { icon: Wrench, label: '3D CAD / Printing' },
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = TYPED_ROLES[roleIndex];
    const speed = isDeleting ? 40 : 80;
    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, charIndex + 1));
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 1800);
        } else {
          setCharIndex(c => c + 1);
        }
      } else {
        setDisplayed(current.slice(0, charIndex - 1));
        if (charIndex === 0) {
          setIsDeleting(false);
          setRoleIndex(i => (i + 1) % TYPED_ROLES.length);
        } else {
          setCharIndex(c => c - 1);
        }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex]);

  return (
    <section className="relative pb-16">

      {/* ── Cover Banner ─────────────────────────────────────────────── */}
      <div className="relative w-full h-44 md:h-56 overflow-hidden">
        {/* Grid bg fallback */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-radial-glow" />
        {/* Cover photo */}
        <img
          src={imgSrc('/images/profile/cover.jpg')}
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover"
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/10 to-dark-900" />
        {/* Corner accents */}
        <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-primary-500/50" />
        <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-primary-500/50" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-primary-500/30" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-primary-500/30" />
      </div>

      {/* ── Profile Row ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-end gap-4 -mt-12 md:-mt-14 mb-8 relative z-10">

          {/* Circular avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-dark-900 ring-2 ring-primary-500/60 relative bg-dark-700">
              {/* Fallback initials — rendered first, behind the photo */}
              <span className="absolute inset-0 flex items-center justify-center font-display text-primary-500 font-bold text-2xl select-none">
                RJ
              </span>
              {/* Avatar photo on top */}
              <img
                src={imgSrc('/images/profile/avatar.jpg')}
                alt="Rangga Prasetya"
                className="absolute inset-0 w-full h-full object-cover"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            {/* Online dot */}
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-900" />
          </div>

          {/* Name + status */}
          <div className="pb-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-dark-600 bg-dark-800/80 backdrop-blur-sm mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-xs text-dark-300 tracking-widest">Open for Collaboration</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-dark-50 leading-tight">
              Rangga <span className="text-gradient">Prasetya</span>
            </h1>
          </div>
        </div>

        {/* ── Main Content ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left 2/3 */}
          <div className="lg:col-span-2">
            {/* Typewriter */}
            <div className="font-display text-lg md:text-xl text-primary-500 mb-3 h-7 flex items-center">
              <span>{displayed}</span>
              <span className="animate-cursor-blink ml-0.5">█</span>
            </div>

            <p className="text-dark-300 text-sm md:text-base mb-6 max-w-lg leading-relaxed">
              Membangun sistem robotik cerdas, solusi AI embedded, dan automasi modern —
              dari firmware ESP32 hingga cloud ML pipeline, end-to-end.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <a
                href="https://wa.me/6288971759690?text=Halo%20Rangga!%20Saya%20tertarik%20untuk%20hire%20kamu."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm py-2"
              >
                Hire Me <ArrowRight size={14} />
              </a>
              <a
                href="https://wa.me/6288971759690?text=Halo%20Rangga!%20Saya%20ingin%20book%20konsultasi%20teknik%20dengan%20kamu."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-sm py-2"
              >
                Book Consultation
              </a>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openChat'))}
                className="btn-ghost text-sm py-2 border border-dark-600 hover:border-dark-400"
              >
                <MessageCircle size={14} />
                Chat
              </button>
              <a
                href={imgSrc('/rangga_resume.pdf')}
                download="Rangga_Prasetya_CV.pdf"
                className="btn-ghost text-sm py-2"
              >
                <Download size={14} />
                CV
              </a>
            </div>

            {/* Quick skill pills */}
            <div className="flex flex-wrap gap-2">
              {QUICK_SKILLS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 skill-badge text-xs">
                  <Icon size={11} className="text-primary-500" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right 1/3: stats */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="bg-dark-800/50 backdrop-blur-md border border-dark-600/60 p-4 text-center lg:text-left hover:border-primary-500/30 transition-colors"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
              >
                <div className="font-heading text-2xl md:text-3xl font-bold text-gradient">{value}</div>
                <div className="font-mono text-xs text-dark-400 tracking-wider uppercase mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="flex flex-col items-center gap-1.5 text-dark-500 mt-12">
        <span className="font-mono text-xs tracking-widest">SCROLL</span>
        <ChevronDown size={14} className="animate-bounce" />
      </div>
    </section>
  );
}
