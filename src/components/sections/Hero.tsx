// src/components/sections/Hero.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Download, MessageCircle, ChevronDown, Cpu, Bot, Wrench } from 'lucide-react';

const TYPED_ROLES = [
  'Robotics Engineer',
  'AI Developer',
  'Embedded Systems Dev',
  'System Architect',
];

const STATS = [
  { value: '15+', label: 'Projects Delivered' },
  { value: '3+', label: 'Years Experience' },
  { value: '100%', label: 'Client Satisfaction' },
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

  // Typewriter effect
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      
      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-glow" />

      {/* Floating circuit elements */}
      <div className="absolute top-1/4 right-10 w-48 h-48 border border-primary-500/10 rounded-full animate-float hidden lg:block" />
      <div className="absolute top-1/3 right-20 w-24 h-24 border border-primary-500/15 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 left-10 w-32 h-32 border border-primary-500/10 rotate-45 animate-float hidden lg:block" style={{ animationDelay: '2s' }} />

      {/* Corner decorations */}
      <div className="absolute top-20 left-4 md:left-10 w-8 h-8 border-l-2 border-t-2 border-primary-500/40" />
      <div className="absolute top-20 right-4 md:right-10 w-8 h-8 border-r-2 border-t-2 border-primary-500/40" />
      <div className="absolute bottom-20 left-4 md:left-10 w-8 h-8 border-l-2 border-b-2 border-primary-500/40" />
      <div className="absolute bottom-20 right-4 md:right-10 w-8 h-8 border-r-2 border-b-2 border-primary-500/40" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 text-center">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-dark-600 bg-dark-800/60 backdrop-blur-sm mb-8 animate-fade-in">
          <span className="status-online" />
          <span className="font-mono text-xs text-dark-200 tracking-widest uppercase">
            Open for Collaboration
          </span>
        </div>

        {/* Name */}
        <h1
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-dark-50 mb-4 animate-fade-up"
          style={{ animationDelay: '0.1s', opacity: 0 }}
        >
          Rai<span className="text-gradient">Jen</span>
        </h1>

        {/* Dynamic role */}
        <div
          className="font-display text-xl md:text-2xl text-primary-500 mb-6 h-8 animate-fade-up"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          <span>{displayed}</span>
          <span className="animate-cursor-blink">█</span>
        </div>

        {/* Tagline */}
        <p
          className="font-body text-dark-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          Saya membangun sistem robotik cerdas, solusi AI embedded, dan automasi modern. 
          Dari hardware ESP32 hingga cloud ML pipeline — end-to-end.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-up"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        >
          <a
            href="https://wa.me/6288971759690?text=Halo%20Rangga!%20Saya%20tertarik%20untuk%20hire%20kamu."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Hire Me
            <ArrowRight size={16} />
          </a>
          <a
            href="https://wa.me/6288971759690?text=Halo%20Rangga!%20Saya%20ingin%20book%20konsultasi%20teknik%20dengan%20kamu."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            Book Consultation
          </a>
          <button
            onClick={() => {
              // Trigger chat widget
              const event = new CustomEvent('openChat');
              window.dispatchEvent(event);
            }}
            className="btn-ghost border border-dark-600 hover:border-dark-400"
          >
            <MessageCircle size={16} />
            Chat Now
          </button>
          <a href="/cv/RaiJen-CV.pdf" download className="btn-ghost">
            <Download size={16} />
            Download CV
          </a>
        </div>

        {/* Quick skills */}
        <div
          className="flex flex-wrap justify-center gap-3 mb-16 animate-fade-up"
          style={{ animationDelay: '0.5s', opacity: 0 }}
        >
          {QUICK_SKILLS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 skill-badge">
              <Icon size={12} className="text-primary-500" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-6 max-w-md mx-auto animate-fade-up"
          style={{ animationDelay: '0.6s', opacity: 0 }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-heading text-2xl md:text-3xl font-bold text-gradient mb-1">
                {value}
              </div>
              <div className="font-mono text-xs text-dark-400 tracking-wider uppercase">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dark-500">
        <span className="font-mono text-xs tracking-widest">SCROLL</span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>
    </section>
  );
}
