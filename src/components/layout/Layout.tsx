// src/components/layout/Layout.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Github, Linkedin, Mail, Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

// ── Navbar ─────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Blog' },
  { href: '/services', label: 'Services' },
];

function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [router.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-900/75 backdrop-blur-xl border-b border-dark-700/80'
          : 'bg-dark-900/20 backdrop-blur-md border-b border-dark-700/20'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 border border-primary-500 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors">
            <Zap size={16} className="text-primary-500" />
          </div>
          <span className="font-display text-sm text-dark-50 hidden sm:block">
            RaiJen<span className="text-primary-500">.dev</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-4 py-2 text-sm font-body transition-colors duration-200 relative group ${
                  router.pathname === link.href
                    ? 'text-primary-500'
                    : 'text-dark-200 hover:text-dark-50'
                }`}
              >
                {link.label}
                {router.pathname === link.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 border border-dark-600 flex items-center justify-center text-dark-300 hover:border-primary-500 hover:text-primary-500 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          )}
          <a
            href="https://wa.me/6288971759690?text=Halo%20Rangga!%20Saya%20tertarik%20untuk%20hire%20kamu."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs py-2 px-4"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 border border-dark-600 flex items-center justify-center text-dark-300 hover:border-primary-500 hover:text-primary-500 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          )}
          <button
            className="text-dark-200 hover:text-primary-500 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-900/90 backdrop-blur-xl border-t border-dark-700/60 px-4 py-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-4 py-3 text-sm font-body rounded transition-colors ${
                    router.pathname === link.href
                      ? 'text-primary-500 bg-primary-500/10'
                      : 'text-dark-200 hover:text-dark-50 hover:bg-dark-700'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="https://wa.me/6288971759690?text=Halo%20Rangga!%20Saya%20tertarik%20untuk%20hire%20kamu."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center text-xs block"
              >
                Hire Me
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="border-t border-dark-700/60 mt-16"
      style={{ background: 'rgb(var(--dark-800) / 0.7)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-6xl mx-auto px-4">

        {/* ── Main row ── */}
        <div className="py-5 flex flex-col md:flex-row items-center gap-5 md:gap-0 justify-between">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-7 h-7 border border-primary-500/60 flex items-center justify-center group-hover:border-primary-500 transition-colors">
              <Zap size={13} className="text-primary-500" />
            </div>
            <span className="font-display text-sm text-dark-100">
              RaiJen<span className="text-primary-500">.dev</span>
            </span>
          </Link>

          {/* Nav — center */}
          <nav className="flex items-center gap-0.5 flex-wrap justify-center">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1 font-mono text-[11px] text-dark-400 hover:text-dark-50 transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Socials — right */}
          <div className="flex items-center gap-2 shrink-0">
            {[
              { href: 'https://github.com/RaiJen-code', icon: Github },
              { href: 'https://linkedin.com', icon: Linkedin },
              { href: 'mailto:razetya100@gmail.com', icon: Mail },
            ].map(({ href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 border border-dark-600/70 flex items-center justify-center text-dark-400 hover:border-primary-500 hover:text-primary-500 transition-all"
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-dark-700/40 py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-mono text-[10px] text-dark-500">
            © {new Date().getFullYear()} Rangga Prasetya · Next.js + GitHub Pages
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-[10px] text-dark-500">Available for projects</span>
            </div>
            <span className="text-dark-600 text-xs">·</span>
            <a
              href="https://wa.me/6288971759690"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-dark-500 hover:text-green-500 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

// ── Main Layout ────────────────────────────────────────────────────────

interface LayoutProps {
  children: React.ReactNode;
  showChat?: boolean;
}

export default function Layout({ children, showChat = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-dark-900 noise-overlay">
      {/* Ambient background orbs — colors driven by CSS variables */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--orb-teal) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'orbFloat 32s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '5%', right: '-8%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--orb-purple) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'orbFloat 40s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '30%',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--orb-blue) 0%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'orbFloat 48s ease-in-out infinite',
        }} />
      </div>
      <Navbar />
      <main className="pt-16 page-enter">
        {children}
      </main>
      <Footer />
    </div>
  );
}
