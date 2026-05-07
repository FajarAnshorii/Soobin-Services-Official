'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShieldCheck } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/layanan', label: 'Layanan' },
  { href: '/premium', label: 'Premium' },
  { href: '/testimoni', label: 'Testimoni' },
  { href: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-primary-800/5'
          : 'bg-white'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary-800" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary-800 tracking-tight">
                SOOBIN
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">
                Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-dark-600 hover:text-primary-800 font-medium transition-colors duration-200 text-sm"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/6287815797525"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              Hubungi Kami
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-primary-800"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-gray-100 shadow-lg">
          <div className="container-custom py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-dark-600 hover:text-primary-800 font-medium transition-colors duration-200 py-2"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/6287815797525"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-center text-sm"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}