'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Sparkles, MessageCircle, AlertCircle, Film, Music, Tv, AppWindow } from 'lucide-react';

// Pricing Calculation Rule:
// <= 20k   -> +2,000
// <= 40k   -> +4,000
// <= 100k  -> +5,000
// > 100k   -> +15,000
function calculateSellingPrice(supplierPrice: number): number {
  if (supplierPrice <= 20000) {
    return supplierPrice + 2000;
  } else if (supplierPrice <= 40000) {
    return supplierPrice + 4000;
  } else if (supplierPrice <= 100000) {
    return supplierPrice + 5000;
  } else {
    return supplierPrice + 15000;
  }
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface PriceOption {
  duration: string;
  supplierPrice: number;
}

interface ProductVariant {
  title: string;
  badge?: string;
  description: string;
  options: PriceOption[];
}

const netflixVariants: ProductVariant[] = [
  {
    title: '1 Profile 1 User',
    badge: 'Paling Laris 🔥',
    description: '1 Profile khusus untuk 1 pengguna, tidak berbagi dengan pengguna lain di profile tersebut.',
    options: [
      { duration: '1 Hari', supplierPrice: 2500 },
      { duration: '2 Hari', supplierPrice: 4500 },
      { duration: '3 Hari', supplierPrice: 6000 },
      { duration: '5 Hari', supplierPrice: 7500 },
      { duration: '7 Hari', supplierPrice: 13000 },
      { duration: '1 Bulan', supplierPrice: 33000 },
    ],
  },
  {
    title: '1 Profile 2 User',
    badge: 'Hemat Banget 💡',
    description: '1 Profile digunakan bersama 2 pengguna, harga lebih ekonomis.',
    options: [
      { duration: '1 Hari', supplierPrice: 2000 },
      { duration: '2 Hari', supplierPrice: 4000 },
      { duration: '3 Hari', supplierPrice: 5000 },
      { duration: '5 Hari', supplierPrice: 5500 },
      { duration: '7 Hari', supplierPrice: 11000 },
      { duration: '1 Bulan', supplierPrice: 20000 },
    ],
  },
  {
    title: 'Semi Private',
    badge: 'Nyaman ✨',
    description: 'Profile lebih terbatas dan tidak padat, pengalaman menonton stabil.',
    options: [
      { duration: '3 Hari', supplierPrice: 9000 },
      { duration: '7 Hari', supplierPrice: 18000 },
      { duration: '1 Bulan', supplierPrice: 37000 },
    ],
  },
  {
    title: 'Single Screen',
    badge: 'Eksklusif Screen 🖥️',
    description: 'Khusus untuk 1 layar aktif tanpa gangguan antrean batas layar.',
    options: [
      { duration: '7 Hari', supplierPrice: 19000 },
      { duration: '1 Bulan', supplierPrice: 40000 },
    ],
  },
  {
    title: 'Private Account',
    badge: 'Full Private 👑',
    description: 'Akun utuh penuh milik Anda sendiri! Bebas atur semua profile & PIN.',
    options: [
      { duration: '1 Minggu', supplierPrice: 53000 },
      { duration: '1 Bulan', supplierPrice: 145000 },
    ],
  },
];

export default function PremiumPage() {
  const [activeTab, setActiveTab] = useState<'netflix' | 'upcoming'>('netflix');
  const [selectedOption, setSelectedOption] = useState<{
    variantTitle: string;
    duration: string;
    price: number;
  } | null>(null);

  const handleOrderWhatsApp = (variantTitle: string, duration: string, sellingPrice: number) => {
    const message = `Halo Kak, saya mau beli Akun Premium Netflix:\n\n` +
      `📌 *Jenis*: ${variantTitle}\n` +
      `⏱️ *Durasi*: ${duration}\n` +
      `💰 *Harga*: ${formatRupiah(sellingPrice)}\n\n` +
      `Mohon diproses ya kak, terima kasih!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/6285156550742?text=${encoded}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white selection:bg-red-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-36 pb-16 px-4 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900">
        {/* Ambient Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-xs sm:text-sm mb-4">
              <Sparkles className="w-4 h-4" /> Official Premium Apps Catalogue
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
              Katalog Akun <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-orange-400">Netflix Premium</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Nikmati tayangan film & serial favorit Anda dengan garansi penuh, proses instan, dan harga termurah!
            </p>
          </motion.div>

          {/* Navigation Category Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8 flex-wrap">
            <button
              onClick={() => setActiveTab('netflix')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                activeTab === 'netflix'
                  ? 'bg-red-600 text-white shadow-red-600/30 ring-2 ring-red-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
              }`}
            >
              <Film className="w-4 h-4 text-red-400" />
              Netflix Premium
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-slate-700 text-white ring-2 ring-slate-500'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              <Music className="w-4 h-4 text-emerald-400" />
              Spotify & Apps Lainnya
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="pb-24 px-4 relative z-10">
        <div className="container-custom">
          {activeTab === 'netflix' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              {/* Netflix Header Banner */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border border-red-900/40 shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none" />
                
                <div className="space-y-2 text-center md:text-left z-10">
                  <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center md:justify-start gap-3">
                    <span className="bg-red-600 text-white text-sm font-black px-2.5 py-1 rounded-md">N</span>
                    Pricelist Netflix Premium
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                    Pilih paket durasi harian hingga bulanan sesuai kebutuhan Anda. Garansi penuh selama masa aktif!
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 z-10">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Garansi Anti On-Hold
                  </div>
                </div>
              </div>

              {/* Grid of Product Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {netflixVariants.map((variant, idx) => (
                  <motion.div
                    key={variant.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                    className="flex flex-col justify-between rounded-3xl bg-slate-800/60 border border-slate-700/80 hover:border-red-500/50 transition-all p-6 shadow-lg hover:shadow-2xl hover:shadow-red-950/30 group"
                  >
                    <div>
                      {/* Top badge & title */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                          {variant.title}
                        </h3>
                        {variant.badge && (
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
                            {variant.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                        {variant.description}
                      </p>

                      {/* Options Table / List */}
                      <div className="space-y-2.5 mb-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Pilihan Durasi & Harga:
                        </p>
                        {variant.options.map((opt) => {
                          const sellingPrice = calculateSellingPrice(opt.supplierPrice);
                          return (
                            <div
                              key={opt.duration}
                              className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-700/50 hover:border-slate-600 transition-all"
                            >
                              <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                                {opt.duration}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-base font-extrabold text-white">
                                  {formatRupiah(sellingPrice)}
                                </span>
                                <button
                                  onClick={() => handleOrderWhatsApp(variant.title, opt.duration, sellingPrice)}
                                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow hover:scale-105 active:scale-95 transition-all"
                                >
                                  Beli
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick WhatsApp Order Button */}
                    <button
                      onClick={() => handleOrderWhatsApp(variant.title, variant.options[variant.options.length - 1].duration, calculateSellingPrice(variant.options[variant.options.length - 1].supplierPrice))}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-all hover:scale-[1.02]"
                    >
                      <MessageCircle className="w-4 h-4 fill-white text-red-600" />
                      Pesan {variant.title} Via WA
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Syarat & Ketentuan (SNK) Box */}
              <div className="rounded-3xl bg-slate-800/40 border border-slate-700/60 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3 text-red-400 font-bold text-lg">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  Syarat & Ketentuan (SNK) Layanan Premium
                </div>
                <ul className="space-y-2 text-slate-300 text-sm list-disc list-inside leading-relaxed">
                  <li><strong className="text-white">Sistem Renew:</strong> Pemesanan lebih dari 1 bulan menggunakan sistem renew otomatis/manual sesuai konfirmasi admin.</li>
                  <li><strong className="text-white">Wajib Baca SNK:</strong> Mohon selalu utamakan membaca SNK sebelum memesan layanan.</li>
                  <li><strong className="text-white">Estimasi Fixing:</strong> Garansi perbaikan/penggantian akun membutuhkan waktu 3-7 hari (no rush/bebas antre).</li>
                  <li><strong className="text-white">Dukungan Garansi:</strong> Kami menjamin penggantian akun jika terjadi masalah teknis sesuai durasi langganan Anda.</li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'upcoming' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16 px-4 bg-slate-800/40 rounded-3xl border border-slate-700/60 max-w-2xl mx-auto space-y-4"
            >
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <Music className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Layanan Aplikasi Lain Segera Hadir!</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Kami sedang menyiapkan katalog resmi untuk Spotify Premium, YouTube Premium, Canva Pro, CapCut, dan aplikasi lainnya dengan harga termurah.
              </p>
              <button
                onClick={() => setActiveTab('netflix')}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md transition-all inline-block"
              >
                Lihat Netflix Premium
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
