// src/components/layout/Layout.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Github, Linkedin, Twitter, Mail, Zap } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          ? 'bg-dark-900/95 backdrop-blur-sm border-b border-dark-700'
          : 'bg-transparent'
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
          <a
            href="https://wa.me/6288971759690?text=Halo%20Rangga!%20Saya%20tertarik%20untuk%20hire%20kamu."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs py-2 px-4"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-dark-200 hover:text-primary-500 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-700 px-4 py-4">
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
    <footer className="border-t border-dark-700 bg-dark-900 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 border border-primary-500 flex items-center justify-center">
                <Zap size={16} className="text-primary-500" />
              </div>
              <span className="font-display text-sm text-dark-50">
                RaiJen<span className="text-primary-500">.dev</span>
              </span>
            </div>
            <p className="text-dark-300 text-sm font-body leading-relaxed">
              Robotics Engineer & AI Developer. Membangun sistem cerdas dari hardware hingga software.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { href: 'https://github.com/RaiJenCode', icon: Github },
                { href: 'https://linkedin.com', icon: Linkedin },
                { href: 'https://twitter.com', icon: Twitter },
                { href: 'mailto:hello@example.com', icon: Mail },
              ].map(({ href, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 border border-dark-600 flex items-center justify-center text-dark-300 hover:border-primary-500 hover:text-primary-500 transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-dark-50 mb-4 tracking-wider uppercase">
              Navigate
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-dark-300 hover:text-primary-500 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-dark-50 mb-4 tracking-wider uppercase">
              Services
            </h3>
            <ul className="space-y-2 text-sm text-dark-300">
              <li className="hover:text-primary-500 transition-colors cursor-pointer">Konsultasi Teknik</li>
              <li className="hover:text-primary-500 transition-colors cursor-pointer">3D Printing</li>
              <li className="hover:text-primary-500 transition-colors cursor-pointer">Print Dokumen</li>
              <li className="hover:text-primary-500 transition-colors cursor-pointer">Custom Robotics</li>
            </ul>

            <div className="mt-6 flex items-center gap-2">
              <span className="status-online" />
              <span className="text-xs text-dark-300 font-mono">Available for new projects</span>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-dark-400 text-xs font-mono">
            © {new Date().getFullYear()} RaiJen — Built with Next.js + GitHub Pages
          </p>
          <a
            href="https://wa.me/6288971759690"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark-500 text-xs font-mono hover:text-green-500 transition-colors"
          >
            Chat via <span className="text-green-500">WhatsApp</span>
          </a>
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
      <Navbar />
      <main className="pt-16 page-enter">
        {children}
      </main>
      <Footer />
    </div>
  );
}
