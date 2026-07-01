'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();

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
          <Link href="/" className="relative h-10 w-44 sm:h-12 sm:w-52 block">
            <Image
              src="/logo.png"
              alt="SOOBIN Services Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
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
              className="text-dark-600 hover:text-primary-800 font-medium transition-colors duration-200 text-sm"
            >
              Hubungi Kami
            </a>

            {/* Auth Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 text-dark-600 hover:text-primary-800 font-semibold text-sm bg-gray-50 border border-gray-200 rounded-full px-3.5 py-1.5 cursor-pointer transition-all hover:bg-gray-100"
                >
                  <div className="w-5 h-5 rounded-full bg-primary-800 text-white flex items-center justify-center text-[10px] uppercase font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-20 p-4">
                      <div className="flex flex-col gap-1 border-b border-gray-100 pb-3 mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-dark-800 truncate">{user.name}</span>
                          <span className="bg-green-100 text-green-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                            Member
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 truncate">{user.email}</span>
                        <span className="text-[10px] text-gray-500 font-medium truncate mt-1">{user.university}</span>
                        <span className="text-[10px] text-gray-400 truncate">{user.prodi}</span>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-2 w-full text-left text-xs font-semibold text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Keluar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="text-dark-600 hover:text-primary-800 font-semibold text-sm border border-primary-800/20 hover:border-primary-800 rounded-full px-4 py-1.5 transition-all duration-200"
              >
                Masuk / Daftar
              </Link>
            )}
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
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
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
              className="text-dark-600 hover:text-primary-800 font-medium transition-colors duration-200 py-2"
            >
              Hubungi Kami
            </a>

            {user ? (
              <div className="flex flex-col gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100 mt-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-dark-800 truncate">{user.name}</span>
                    <span className="bg-green-100 text-green-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                      Member
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 truncate mt-0.5">{user.university}</span>
                  <span className="text-[10px] text-gray-400 truncate">{user.prodi}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left text-xs font-semibold text-red-600 pt-2 border-t border-gray-200 mt-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Keluar dari Akun
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={() => setIsOpen(false)}
                className="text-center font-bold text-sm bg-primary-800 hover:bg-primary-750 text-white rounded-xl py-2.5 transition-all mt-2"
              >
                Masuk / Daftar Member
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}