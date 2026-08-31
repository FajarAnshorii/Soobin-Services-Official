'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  ShoppingCart,
  History,
  BookMarked,
  FileText,
  Calculator,
  GraduationCap,
  ExternalLink,
  Gift,
  MessageSquareText,
  Award
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const navLinksBeforeTools = [
  { href: '/', label: 'Beranda' },
  { href: '/layanan', label: 'Layanan' },
  { href: '/kalkulator-order', label: 'Kalkulator Order' },
  { href: '/premium', label: 'Premium' },
  { href: '/subscribe-ai', label: 'Subscribe AI' },
];

const testimoniLinks = [
  {
    href: '/testimoni',
    label: 'Review Customer',
    desc: '3.000+ ulasan riil & rating kepuasan mahasiswa Indonesia',
    icon: MessageSquareText,
    badge: '3000+ Ulasan',
    badgeColor: 'text-primary-850 bg-primary-50 border-primary-200',
  },
  {
    href: '/trusted-by',
    label: 'Trusted By',
    desc: 'Bukti promosi publik, member & content creator',
    icon: Award,
    badge: 'Publik & Creator',
    badgeColor: 'text-primary-850 bg-primary-50 border-primary-200',
  },
];

const navLinksAfterTools = [
  { href: '/faq', label: 'FAQ' },
];

const toolLinks = [
  {
    href: '/tools/daftar-pustaka',
    label: 'Daftar Pustaka Generator',
    desc: 'Format sitasi APA, MLA, IEEE, Harvard & auto lookup DOI',
    icon: BookMarked,
  },
  {
    href: '/tools/kalkulator-sampel',
    label: 'Kalkulator Sampel (Slovin & Lemeshow)',
    desc: 'Hitung sampel minimal & uraian rumus Bab 3 skripsi',
    icon: Calculator,
  },
  {
    href: '/tools/kalkulator-ipk',
    label: 'Kalkulator IPK',
    desc: 'Hitung IPS & IPK sesuai skala dan bobot nilai kampus',
    icon: GraduationCap,
  },
  {
    href: '/tools/word-counter',
    label: 'Hitung Kata & Waktu Baca',
    desc: 'Cek total kata, karakter, dan estimasi waktu membaca',
    icon: FileText,
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showTestimoniDropdown, setShowTestimoniDropdown] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(true);
  const [mobileTestimoniOpen, setMobileTestimoniOpen] = useState(true);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const testimoniDropdownRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setShowToolsDropdown(false);
      }
      if (testimoniDropdownRef.current && !testimoniDropdownRef.current.contains(event.target as Node)) {
        setShowTestimoniDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isToolsActive = pathname.startsWith('/tools');
  const isTestimoniActive = pathname === '/testimoni' || pathname === '/trusted-by';

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

          {/* Desktop Navigation with Animated Lamp Pill & Tools Dropdown */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-slate-50/90 p-1 rounded-full border border-slate-200/80 shadow-2xs backdrop-blur-md">
            {navLinksBeforeTools.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-2.5 xl:px-3 py-1.5 text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-colors duration-200 rounded-full ${
                    isActive
                      ? 'text-primary-850 font-bold'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-lamp"
                      className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/80 z-0"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full bg-primary-700">
                        <div className="absolute w-10 h-5 rounded-full blur-xs -top-2 -left-1 bg-primary-500/30" />
                        <div className="absolute w-6 h-4 rounded-full blur-xs -top-1 left-1 bg-primary-500/30" />
                      </div>
                    </motion.div>
                  )}
                </Link>
              );
            })}

            {/* Tools Dropdown Trigger (Desktop - Next to Subscribe AI) */}
            <div
              className="relative"
              ref={toolsDropdownRef}
              onMouseEnter={() => setShowToolsDropdown(true)}
              onMouseLeave={() => setShowToolsDropdown(false)}
            >
              <button
                type="button"
                onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                className={`relative px-2.5 xl:px-3 py-1.5 text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-colors duration-200 rounded-full flex items-center gap-1 cursor-pointer ${
                  isToolsActive
                    ? 'text-primary-850 font-bold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <span className="relative z-10 flex items-center gap-1">
                  <span>Tools</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showToolsDropdown ? 'rotate-180 text-primary-750' : 'text-slate-400'}`} />
                </span>
                {isToolsActive && (
                  <motion.div
                    layoutId="navbar-lamp"
                    className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/80 z-0"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full bg-primary-700">
                      <div className="absolute w-10 h-5 rounded-full blur-xs -top-2 -left-1 bg-primary-500/30" />
                      <div className="absolute w-6 h-4 rounded-full blur-xs -top-1 left-1 bg-primary-500/30" />
                    </div>
                  </motion.div>
                )}
              </button>

              {/* Pop-up Card for Tools */}
              <AnimatePresence>
                {showToolsDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-88 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2.5 z-50"
                  >
                    <div className="px-3 py-2 mb-1.5 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Academic Mini Tools
                      </span>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        100% Free
                      </span>
                    </div>

                    <div className="space-y-1">
                      {toolLinks.map((tool) => {
                        const Icon = tool.icon;
                        const isCurrent = pathname === tool.href;

                        return (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            onClick={() => setShowToolsDropdown(false)}
                            className={`group flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                              isCurrent
                                ? 'bg-primary-50 text-primary-950 border border-primary-200/80 shadow-2xs'
                                : 'hover:bg-slate-50 text-slate-800 border border-transparent hover:border-slate-200/60'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-primary-100 text-slate-700 group-hover:text-primary-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200 transition-colors">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-primary-800 transition-colors leading-snug block">
                                {tool.label}
                              </span>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-tight">
                                {tool.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Testimoni Dropdown Trigger (Desktop - Review Customer & Trusted By) */}
            <div
              className="relative"
              ref={testimoniDropdownRef}
              onMouseEnter={() => setShowTestimoniDropdown(true)}
              onMouseLeave={() => setShowTestimoniDropdown(false)}
            >
              <button
                type="button"
                onClick={() => setShowTestimoniDropdown(!showTestimoniDropdown)}
                className={`relative px-2.5 xl:px-3 py-1.5 text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-colors duration-200 rounded-full flex items-center gap-1 cursor-pointer ${
                  isTestimoniActive
                    ? 'text-primary-850 font-bold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <span className="relative z-10 flex items-center gap-1">
                  <span>Testimoni</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showTestimoniDropdown ? 'rotate-180 text-primary-750' : 'text-slate-400'}`} />
                </span>
                {isTestimoniActive && (
                  <motion.div
                    layoutId="navbar-lamp"
                    className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/80 z-0"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full bg-primary-700">
                      <div className="absolute w-10 h-5 rounded-full blur-xs -top-2 -left-1 bg-primary-500/30" />
                      <div className="absolute w-6 h-4 rounded-full blur-xs -top-1 left-1 bg-primary-500/30" />
                    </div>
                  </motion.div>
                )}
              </button>

              {/* Pop-up Card for Testimoni */}
              <AnimatePresence>
                {showTestimoniDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 sm:w-88 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2.5 z-50"
                  >
                    <div className="px-3 py-2 mb-1.5 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Reputasi & Ulasan
                      </span>
                      <span className="text-[10px] font-black text-primary-850 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200">
                        Terpercaya
                      </span>
                    </div>

                    <div className="space-y-1">
                      {testimoniLinks.map((item) => {
                        const Icon = item.icon;
                        const isCurrent = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setShowTestimoniDropdown(false)}
                            className={`group flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                              isCurrent
                                ? 'bg-primary-50 text-primary-950 border border-primary-200/80 shadow-2xs'
                                : 'hover:bg-slate-50 text-slate-800 border border-transparent hover:border-slate-200/60'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-primary-100 text-slate-700 group-hover:text-primary-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200 transition-colors">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold text-slate-900 group-hover:text-primary-800 transition-colors leading-snug">
                                  {item.label}
                                </span>
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${item.badgeColor}`}>
                                  {item.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-tight">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinksAfterTools.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-2.5 xl:px-3 py-1.5 text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-colors duration-200 rounded-full ${
                    isActive
                      ? 'text-primary-850 font-bold'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-lamp"
                      className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/80 z-0"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full bg-primary-700">
                        <div className="absolute w-10 h-5 rounded-full blur-xs -top-2 -left-1 bg-primary-500/30" />
                        <div className="absolute w-6 h-4 rounded-full blur-xs -top-1 left-1 bg-primary-500/30" />
                      </div>
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {/* Cart Button */}
            {user && (
              <Link
                href="/member?tab=cart"
                className="relative p-1.5 text-dark-600 hover:text-primary-800 transition-colors flex items-center justify-center"
                title="Keranjang Belanja"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

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
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-20 p-4 flex flex-col gap-1">
                      <div className="flex flex-col gap-1 border-b border-gray-100 pb-3 mb-2">
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

                      {/* Free Turnitin 1x Menu Item */}
                      <Link
                        href="/member?tab=redeem"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center justify-between w-full text-left text-xs font-black text-white bg-primary-900 hover:bg-primary-850 px-2.5 py-2 rounded-xl border border-primary-700/50 shadow-xs cursor-pointer transition-all my-1 group"
                      >
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-blue-300 group-hover:scale-110 transition-transform" />
                          <span className="font-extrabold text-white">Free Turnitin 1x</span>
                        </div>
                        <span className="bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
                          Gratis
                        </span>
                      </Link>

                      <Link
                        href="/member?tab=history"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 w-full text-left text-xs font-semibold text-gray-700 py-1.5 cursor-pointer hover:text-primary-800"
                      >
                        <History className="w-3.5 h-3.5" />
                        Riwayat Pembelian
                      </Link>

                      <Link
                        href="/member?tab=cart"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 w-full text-left text-xs font-semibold text-gray-700 py-1.5 cursor-pointer hover:text-primary-800"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Keranjang Belanja ({cart.length})
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-2 w-full text-left text-xs font-semibold text-red-600 pt-2 border-t border-gray-100 mt-1 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Keluar dari Akun
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="font-bold text-xs bg-primary-800 hover:bg-primary-750 text-white rounded-full px-4 py-2 transition-all shadow-md shadow-primary-900/10 cursor-pointer"
              >
                Masuk Member
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-dark-600 hover:text-primary-800 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ${
          isOpen
            ? 'max-h-[calc(100vh-80px)] opacity-100 overflow-y-auto'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="bg-white border-t border-gray-100 shadow-xl pb-8">
          <div className="container-custom py-4 flex flex-col gap-2">
            {navLinksBeforeTools.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`font-medium transition-colors duration-200 py-2 text-sm ${
                  pathname === link.href ? 'text-primary-800 font-bold' : 'text-slate-700'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Tools Accordion (Between Subscribe AI & Testimoni) */}
            <div className="py-2 border-t border-b border-slate-100 my-1">
              <button
                type="button"
                onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                className="flex items-center justify-between w-full font-bold text-sm text-slate-800 py-1"
              >
                <div className="flex items-center gap-2">
                  <span>Tools Akademik Gratis</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Free
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileToolsOpen && (
                <div className="pt-2 pb-1 space-y-1.5">
                  {toolLinks.map((tool) => {
                    const Icon = tool.icon;
                    const isCurrent = pathname === tool.href;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                          isCurrent ? 'bg-primary-50 text-primary-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-semibold truncate">{tool.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Testimoni Accordion (Review Customer & Trusted By) */}
            <div className="py-2 border-b border-slate-100 my-1">
              <button
                type="button"
                onClick={() => setMobileTestimoniOpen(!mobileTestimoniOpen)}
                className="flex items-center justify-between w-full font-bold text-sm text-slate-800 py-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>Testimoni & Reputasi</span>
                  <span className="text-[10px] font-bold text-primary-850 bg-primary-50 px-1.5 py-0.5 rounded border border-primary-200">
                    Trusted
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileTestimoniOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileTestimoniOpen && (
                <div className="pt-2 pb-1 space-y-1.5">
                  {testimoniLinks.map((item) => {
                    const Icon = item.icon;
                    const isCurrent = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                          isCurrent ? 'bg-primary-50 text-primary-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-semibold truncate block">{item.label}</span>
                            <span className="text-[10px] text-slate-400 truncate block">{item.badge}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {navLinksAfterTools.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`font-medium transition-colors duration-200 py-2 text-sm ${
                  pathname === link.href ? 'text-primary-800 font-bold' : 'text-slate-700'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex flex-col gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100 mt-2">
                <div className="flex flex-col pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-dark-800 truncate">{user.name}</span>
                    <span className="bg-primary-100 text-primary-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                      Member
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 truncate mt-0.5">{user.university}</span>
                  <span className="text-[10px] text-gray-400 truncate">{user.prodi}</span>
                </div>

                {/* Free Turnitin 1x Menu Item */}
                <Link
                  href="/member?tab=redeem"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between w-full text-left text-xs font-black text-white bg-primary-900 hover:bg-primary-850 px-3 py-2.5 rounded-xl border border-primary-700/50 shadow-xs cursor-pointer transition-all my-1 group"
                >
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-blue-300 group-hover:scale-110 transition-transform" />
                    <span className="font-extrabold text-white">Free Turnitin 1x</span>
                  </div>
                  <span className="bg-blue-600 text-white font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
                    Gratis
                  </span>
                </Link>

                <Link
                  href="/member?tab=history"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 w-full text-left text-xs font-semibold text-gray-700 py-1.5 cursor-pointer hover:text-primary-800"
                >
                  <History className="w-3.5 h-3.5" />
                  Riwayat Pembelian
                </Link>

                <Link
                  href="/member?tab=cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 w-full text-left text-xs font-semibold text-gray-700 py-1.5 cursor-pointer hover:text-primary-800"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Keranjang Belanja ({cart.length})
                </Link>

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