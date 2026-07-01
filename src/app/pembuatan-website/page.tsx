'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Code, Monitor, Globe, Sparkles, ArrowRight, ShieldCheck, Zap,
  Check, Play, Users, MessageSquare, Star, ArrowUpRight
} from 'lucide-react';
import WhatsAppFloat from '@/components/WhatsAppFloat';

// Local Custom Navbar for the sub-site to make it feel like "shifting to another website"
function LocalNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-28 h-10">
              <Image
                src="/logo-jardev.png"
                alt="JAR.DEV Logo"
                fill
                className="object-contain object-left animate-fade-in"
                priority
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-amber-500 transition-colors">
              Kembali ke SOOBIN Services
            </Link>
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
      <LocalNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-amber-50/70 via-white to-slate-50 py-20 lg:py-28">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-amber-100/60 border border-amber-200/80 rounded-full px-4 py-1.5 w-fit"
              >
                <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Jasa Pembuatan Website Premium
                </span>
              </motion.div>

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
                className="relative bg-white rounded-3xl p-6 shadow-2xl border border-amber-100 max-w-md w-full"
              >
                {/* Visual browser frame */}
                <div className="flex gap-1.5 border-b border-gray-150 pb-4 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="w-full bg-gray-50 border border-gray-200/80 rounded-md text-[10px] text-gray-400 text-center py-0.5 ml-2 font-mono">
                    https://jar.dev
                  </div>
                </div>

                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex flex-col gap-4 text-left">
                  <div className="flex justify-between items-center">
                    <div className="bg-amber-400 text-black font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Live Preview
                    </div>
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="w-24 h-3 bg-amber-200/60 rounded"></div>
                  <div className="w-full h-8 bg-gray-900 rounded-lg flex items-center justify-between px-3 text-white">
                    <div className="w-16 h-2 bg-white/30 rounded"></div>
                    <ArrowUpRight className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-full h-16 bg-white rounded-lg border border-amber-100 p-2.5 flex flex-col gap-1.5">
                      <div className="w-10 h-1.5 bg-amber-400 rounded"></div>
                      <div className="w-full h-1 bg-gray-200 rounded"></div>
                      <div className="w-8 h-1 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-full h-16 bg-white rounded-lg border border-amber-100 p-2.5 flex flex-col gap-1.5">
                      <div className="w-10 h-1.5 bg-gray-800 rounded"></div>
                      <div className="w-full h-1 bg-gray-200 rounded"></div>
                      <div className="w-6 h-1 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="w-full h-12 bg-amber-400 rounded-xl flex items-center justify-center font-bold text-xs text-black cursor-pointer hover:bg-amber-350 transition-colors">
                    Mulai Bikin Website Anda
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
            <div className="relative w-28 h-8">
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
            <Link href="/" className="hover:text-amber-400 transition-colors">Utama</Link>
            <span>•</span>
            <Link href="/layanan" className="hover:text-amber-400 transition-colors">Layanan Lengkap</Link>
            <span>•</span>
            <a href="https://wa.me/6287815797525" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Kontak</a>
          </div>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      <WhatsAppFloat />
    </div>
  );
}
