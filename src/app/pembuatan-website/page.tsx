'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code, Monitor, Globe, Sparkles, ArrowRight, ShieldCheck, Zap,
  Check, Play, Users, MessageSquare, Star, ArrowUpRight, LogOut
} from 'lucide-react';
import WhatsAppFloat from '@/components/WhatsAppFloat';

interface LocalNavbarProps {
  onExit: (e: React.MouseEvent) => void;
}

// Local Custom Navbar for the sub-site to make it feel like "shifting to another website"
function LocalNavbar({ onExit }: LocalNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <Link href="/" onClick={onExit} className="flex items-center gap-2">
              <div className="relative w-36 h-12">
                <Image
                  src="/logo-jardev.png"
                  alt="JAR.DEV Logo"
                  fill
                  className="object-contain object-left animate-fade-in"
                  priority
                />
              </div>
            </Link>

            {/* Purple Exit Door Icon - visible on all screens */}
            <Link
              href="/"
              onClick={onExit}
              className="text-purple-600 hover:text-purple-500 transition-colors flex items-center justify-center p-2 rounded-full hover:bg-purple-50"
              title="Kembali ke SOOBIN Services"
            >
              <LogOut className="w-6 h-6" />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-semibold text-gray-600 hover:text-amber-500 transition-colors">
              Layanan
            </a>
            <a href="#features" className="text-sm font-semibold text-gray-600 hover:text-amber-500 transition-colors">
              Keunggulan
            </a>
            <a href="#portfolio" className="text-sm font-semibold text-gray-600 hover:text-amber-500 transition-colors">
              Portofolio
            </a>
          </div>

          <div>
            <a
              href="https://wa.me/6287815797525?text=Halo%20JAR.DEV%2C%20saya%20tertarik%20untuk%20konsultasi%20pembuatan%20website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold bg-amber-400 hover:bg-amber-350 text-black shadow-lg shadow-amber-400/15 hover:shadow-amber-400/30 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Konsultasi Gratis
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function PembuatanWebsitePage() {
  const [activeTab, setActiveTab] = useState('all');
  const [isExitingToSoobin, setIsExitingToSoobin] = useState(false);
  const router = useRouter();

  const handleExit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExitingToSoobin(true);
    setTimeout(() => {
      router.push('/');
      setTimeout(() => {
        setIsExitingToSoobin(false);
      }, 1000);
    }, 1800);
  };

  const services = [
    {
      title: 'Landing Page / Portofolio',
      desc: 'Satu halaman interaktif berkecepatan tinggi untuk portofolio pribadi, rilis produk, atau promosi event Anda.',
      price: 'Rp 450.000',
      features: ['1 Halaman Premium', 'Responsive Mobile-Friendly', 'SEO Optimization Basic', 'Integrasi WhatsApp Chat', 'Gratis Domain .my.id (1 Thn)'],
      popular: false,
      tag: 'Starter'
    },
    {
      title: 'Website Company Profile',
      desc: 'Meningkatkan kredibilitas bisnis Anda dengan website profil profesional multi-halaman berestetika modern.',
      price: 'Rp 950.000',
      features: ['Hingga 5 Halaman Utama', 'Desain Custom Premium', 'Panel Admin Mudah (CMS)', 'SEO Setup Lengkap', 'Gratis Domain .com (1 Thn)', 'Gratis Hosting Server (1 Thn)'],
      popular: true,
      tag: 'Best Seller'
    },
    {
      title: 'Website E-Commerce / Toko Online',
      desc: 'Website penjualan otomatis terintegrasi sistem pembayaran (payment gateway) dan kalkulator ongkir otomatis.',
      price: 'Rp 1.500.000',
      features: ['Halaman Produk & Kategori Unlimited', 'Keranjang Belanja Pintar', 'Integrasi Payment Gateway (Midtrans)', 'Kalkulasi Ongkir Realtime', 'Panel Kelola Pesanan & Stok', 'Gratis Domain & Hosting (1 Thn)'],
      popular: false,
      tag: 'Professional'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 selection:bg-amber-400 selection:text-black pt-20">
      <LocalNavbar onExit={handleExit} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-amber-50/70 via-white to-slate-50 py-20 lg:py-28">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight"
              >
                Wujudkan Website Impian Anda Bersama <span className="underline decoration-amber-400 decoration-8 underline-offset-4">JAR.DEV</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-gray-600 leading-relaxed max-w-2xl"
              >
                Desain elegan, super cepat, responsive di semua peranti, dan dioptimasi SEO. Dapatkan harga termurah di pasaran dengan kualitas visual premium setara agensi internasional.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 mt-2"
              >
                <a
                  href="https://wa.me/6287815797525?text=Halo%20JAR.DEV%2C%20saya%20ingin%20memesan%20jasa%20pembuatan%20website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-xl text-base font-bold bg-amber-400 hover:bg-amber-350 text-black shadow-xl shadow-amber-400/20 hover:shadow-amber-400/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Pesan Sekarang
                </a>
                <a
                  href="#services"
                  className="px-8 py-4 rounded-xl text-base font-bold bg-white hover:bg-gray-50 text-gray-800 border border-gray-250 shadow-sm transition-all duration-300"
                >
                  Lihat Paket Harga
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-3 gap-6 border-t border-gray-200/80 pt-8 mt-4"
              >
                <div>
                  <h4 className="text-3xl font-black text-gray-900">100%</h4>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Kepuasan Desain</p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-gray-900">2-3 Hari</h4>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Rata-rata Pengerjaan</p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-gray-900">24/7</h4>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Dukungan Teknis</p>
                </div>
              </motion.div>
            </div>

            {/* Right Graphics */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="uiverse-parent">
                  <div className="uiverse-card">
                    <div className="uiverse-logo">
                      <span className="uiverse-circle uiverse-circle1"></span>
                      <span className="uiverse-circle uiverse-circle2"></span>
                      <span className="uiverse-circle uiverse-circle3"></span>
                      <span className="uiverse-circle uiverse-circle4"></span>
                      <span className="uiverse-circle uiverse-circle5">
                        <svg viewBox="0 0 24 24" className="uiverse-svg">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                      </span>
                    </div>
                    <div className="uiverse-glass"></div>
                    <div className="uiverse-content">
                      <span className="uiverse-title">Jasa Web Premium</span>
                      <span className="uiverse-text">
                        Desain elegan, responsif, cepat, SEO-friendly, dan bergaransi untuk tingkatkan bisnis Anda.
                      </span>
                    </div>
                    <div className="uiverse-bottom">
                      <div className="uiverse-social-buttons-container">
                        {/* WhatsApp Button */}
                        <a
                          href="https://wa.me/6287815797525?text=Halo%20JAR.DEV%2C%20saya%20tertarik%20untuk%20konsultasi%20pembuatan%20website"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="uiverse-social-button"
                          title="WhatsApp"
                        >
                          <svg viewBox="0 0 24 24" className="uiverse-svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </a>
                        {/* TikTok Button */}
                        <a
                          href="https://tiktok.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="uiverse-social-button"
                          title="TikTok"
                        >
                          <svg viewBox="0 0 24 24" className="uiverse-svg">
                            <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.48-4.14-1.21-.49-.31-.95-.69-1.33-1.12v7.1c0 2.21-.57 4.54-2.28 5.86-1.78 1.34-4.22 1.57-6.28.84-2.54-.91-4.21-3.57-3.95-6.28.23-2.6 2.27-4.91 4.9-5.24.81-.1 1.63-.01 2.42.23V14.1c-.81-.4-1.75-.48-2.58-.2-1.07.35-1.81 1.4-1.79 2.53.02 1.37 1.25 2.52 2.62 2.41 1.26-.09 2.16-1.19 2.14-2.42V0h3.53z" />
                          </svg>
                        </a>
                        {/* Instagram Button */}
                        <a
                          href="https://instagram.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="uiverse-social-button"
                          title="Instagram"
                        >
                          <svg viewBox="0 0 24 24" className="uiverse-svg">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                        </a>
                      </div>
                      <div className="uiverse-view-more">
                        <button
                          className="uiverse-view-more-button"
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById('services');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          Lihat Paket
                        </button>
                        <svg className="uiverse-svg" viewBox="0 0 24 24">
                          <path d="M5 12h14M12 5l7 7-7 7" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Packages Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-12">
          <div className="flex flex-col gap-4 items-center">
            <span className="text-xs font-bold text-amber-600 bg-amber-100 rounded-full px-3.5 py-1 w-fit uppercase tracking-wider">
              Paket Layanan & Harga
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Investasi Hemat Untuk Hasil Maksimal
            </h2>
            <p className="text-gray-500 max-w-2xl text-sm sm:text-base leading-relaxed">
              Pilih paket pengerjaan website yang paling sesuai dengan target pasar dan kebutuhan bisnis Anda. Seluruh paket sudah termasuk konsultasi penuh gratis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {services.map((plan, i) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? 'border-amber-400 shadow-2xl bg-amber-50/20 transform hover:-translate-y-1'
                    : 'border-gray-200 bg-white hover:border-amber-400/60 transform hover:-translate-y-1'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-8 bg-amber-400 text-black text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                    {plan.tag}
                  </span>
                )}
                {!plan.popular && (
                  <span className="absolute -top-3.5 left-8 bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-gray-200">
                    {plan.tag}
                  </span>
                )}

                <div className="flex flex-col gap-5">
                  <h3 className="text-xl font-bold text-gray-900 mt-2">{plan.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{plan.desc}</p>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-3xl sm:text-4xl font-black text-gray-900">{plan.price}</span>
                  </div>

                  <ul className="flex flex-col gap-3.5 border-t border-gray-150 pt-5 mt-2">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 font-medium">
                        <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`https://wa.me/6287815797525?text=Halo%20JAR.DEV%2C%20saya%20tertarik%20dengan%20Jasa%20Website%20paket%20${encodeURIComponent(plan.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 w-full py-3.5 rounded-2xl text-center text-sm font-bold transition-all duration-300 block ${
                    plan.popular
                      ? 'bg-amber-400 hover:bg-amber-350 text-black shadow-lg shadow-amber-400/20'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  Pilih Paket
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Header */}
            <div className="lg:col-span-5 flex flex-col gap-5 text-left">
              <span className="text-xs font-bold text-amber-600 bg-amber-100 rounded-full px-3.5 py-1 w-fit uppercase tracking-wider">
                Kenapa Memilih Kami?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Standar Tertinggi Untuk Website Bisnis Anda
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Kami tidak sekadar membuat baris kode. Kami mendesain platform interaktif yang memikat calon pembeli dan menumbuhkan omzet bisnis Anda.
              </p>
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 shrink-0 flex items-center justify-center text-black">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">Performa Kecepatan Kilat</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Optimasi aset digital dan caching super ketat.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 shrink-0 flex items-center justify-center text-black">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">Proteksi Keamanan SSL</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Seluruh website dilengkapi enkripsi SSL standar perbankan.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Blocks */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6 text-left">
              <div className="bg-white p-6 rounded-2xl border border-amber-150 shadow-sm flex flex-col gap-3">
                <Globe className="w-8 h-8 text-amber-500" />
                <h3 className="font-bold text-gray-900 text-base">Multi-Domain Integration</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Dukungan penuh untuk penamaan domain profesional tingkat atas (.com, .id, .web.id, dll).</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col gap-3">
                <Monitor className="w-8 h-8 text-amber-500" />
                <h3 className="font-bold text-gray-900 text-base">Ultra Responsive UI</h3>
                <p className="text-xs text-gray-500 leading-relaxed">UI yang menyesuaikan secara elastis dari layar ponsel terkecil hingga layar monitor desktop super lebar.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col gap-3">
                <Code className="w-8 h-8 text-amber-500" />
                <h3 className="font-bold text-gray-900 text-base">Clean & Modern Codebase</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Ditulis menggunakan framework mutakhir (Next.js / React) untuk kemudahan integrasi fitur di masa mendatang.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-amber-150 shadow-sm flex flex-col gap-3">
                <Sparkles className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                <h3 className="font-bold text-gray-900 text-base">Free Custom Mockup</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Konsultasi awal gratis dan perancangan mockup UI khusus sebelum proses pemrograman dimulai.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2">
            <div className="relative w-36 h-10">
              <Image
                src="/logo-jardev.png"
                alt="JAR.DEV Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} JAR.DEV. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 font-semibold mt-1">
            <Link
              href="/"
              onClick={handleExit}
              className="text-purple-600 hover:text-purple-500 transition-colors flex items-center justify-center"
              title="Kembali ke SOOBIN Services"
            >
              <LogOut className="w-4 h-4" />
            </Link>
            <span>•</span>
            <Link href="/layanan" className="hover:text-amber-400 transition-colors">Layanan Lengkap</Link>
            <span>•</span>
            <a href="https://wa.me/6287815797525" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Kontak</a>
          </div>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      <WhatsAppFloat />

      {/* Exit Door Transition Overlay */}
      <AnimatePresence>
        {isExitingToSoobin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950"
          >
            {/* Wifi Loader - Purple Version */}
            <div
              id="wifi-loader"
              className="scale-125"
              style={{
                ['--front-color' as any]: '#a855f7',
                ['--back-color' as any]: 'rgba(168, 85, 247, 0.2)'
              }}
            >
              <svg className="circle-outer" viewBox="0 0 86 86">
                <circle className="back" cx="43" cy="43" r="40"></circle>
                <circle className="front" cx="43" cy="43" r="40"></circle>
              </svg>
              <svg className="circle-middle" viewBox="0 0 60 60">
                <circle className="back" cx="30" cy="30" r="27"></circle>
                <circle className="front" cx="30" cy="30" r="27"></circle>
              </svg>
              <svg className="circle-inner" viewBox="0 0 34 34">
                <circle className="back" cx="17" cy="17" r="14"></circle>
                <circle className="front" cx="17" cy="17" r="14"></circle>
              </svg>
              <div className="text" data-text="SOOBIN SERVICES"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
