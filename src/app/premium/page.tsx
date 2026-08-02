'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Film, Tv, Sparkles, MessageCircle, AlertCircle, ShieldCheck, CheckCircle2, Info } from 'lucide-react';

// Pricing Calculation Rule (User Profit Margin):
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
  note?: string;
}

interface ProductVariant {
  id: string;
  category: 'netflix' | 'vidio' | 'disney';
  categoryLabel: string;
  title: string;
  badge?: string;
  description: string;
  options: PriceOption[];
  snk?: string[];
}

const allProducts: ProductVariant[] = [
  // --- NETFLIX ---
  {
    id: 'netflix-1u',
    category: 'netflix',
    categoryLabel: 'Netflix',
    title: 'Netflix 1 Profile 1 User',
    badge: 'Best Seller 🔥',
    description: '1 Profile khusus untuk 1 pengguna, tidak berbagi layar dengan siapapun.',
    options: [
      { duration: '1 Hari', supplierPrice: 2500 },
      { duration: '2 Hari', supplierPrice: 4500 },
      { duration: '3 Hari', supplierPrice: 6000 },
      { duration: '5 Hari', supplierPrice: 7500 },
      { duration: '7 Hari', supplierPrice: 13000 },
      { duration: '1 Bulan', supplierPrice: 33000 },
    ],
    snk: [
      'Lebih dari 1 bulan menggunakan sistem renew.',
      'Utamakan baca SNK sebelum order.',
      'Estimasi fixing 3-7 hari, no rush!',
    ],
  },
  {
    id: 'netflix-2u',
    category: 'netflix',
    categoryLabel: 'Netflix',
    title: 'Netflix 1 Profile 2 User',
    badge: 'Hemat 💡',
    description: '1 Profile digunakan bersama 2 pengguna, pilihan paling ekonomis.',
    options: [
      { duration: '1 Hari', supplierPrice: 2000 },
      { duration: '2 Hari', supplierPrice: 4000 },
      { duration: '3 Hari', supplierPrice: 5000 },
      { duration: '5 Hari', supplierPrice: 5500 },
      { duration: '7 Hari', supplierPrice: 11000 },
      { duration: '1 Bulan', supplierPrice: 20000 },
    ],
    snk: [
      'Lebih dari 1 bulan menggunakan sistem renew.',
      'Utamakan baca SNK sebelum order.',
      'Estimasi fixing 3-7 hari, no rush!',
    ],
  },
  {
    id: 'netflix-semi-private',
    category: 'netflix',
    categoryLabel: 'Netflix',
    title: 'Netflix Semi Private',
    badge: 'Stabil ✨',
    description: 'Jumlah user terbatas dan tidak padat untuk pengalaman streaming lancar.',
    options: [
      { duration: '3 Hari', supplierPrice: 9000 },
      { duration: '7 Hari', supplierPrice: 18000 },
      { duration: '1 Bulan', supplierPrice: 37000 },
    ],
    snk: [
      'Lebih dari 1 bulan menggunakan sistem renew.',
      'Utamakan baca SNK sebelum order.',
      'Estimasi fixing 3-7 hari, no rush!',
    ],
  },
  {
    id: 'netflix-single-screen',
    category: 'netflix',
    categoryLabel: 'Netflix',
    title: 'Netflix Single Screen',
    badge: 'Bebas Antre 🖥️',
    description: 'Layar khusus untuk Anda tanpa terganggu batas screen perangkat lain.',
    options: [
      { duration: '7 Hari', supplierPrice: 19000 },
      { duration: '1 Bulan', supplierPrice: 40000 },
    ],
    snk: [
      'Lebih dari 1 bulan menggunakan sistem renew.',
      'Utamakan baca SNK sebelum order.',
      'Estimasi fixing 3-7 hari, no rush!',
    ],
  },
  {
    id: 'netflix-private',
    category: 'netflix',
    categoryLabel: 'Netflix',
    title: 'Netflix Private Account',
    badge: 'Full Private 👑',
    description: 'Akun utuh milik Anda sendiri! Bebas atur semua profile & PIN.',
    options: [
      { duration: '1 Minggu', supplierPrice: 53000 },
      { duration: '1 Bulan', supplierPrice: 145000 },
    ],
    snk: [
      'Lebih dari 1 bulan menggunakan sistem renew.',
      'Utamakan baca SNK sebelum order.',
      'Estimasi fixing 3-7 hari, no rush!',
    ],
  },

  // --- VIDIO ---
  {
    id: 'vidio-daily-mobile',
    category: 'vidio',
    categoryLabel: 'Vidio',
    title: 'Vidio Platinum Sharing Daily (Mobile)',
    badge: 'Nonton Liga ⚽',
    description: 'Akses tayangan Platinum Vidio khusus perangkat HP / Tablet.',
    options: [
      { duration: '1 Hari', supplierPrice: 4500 },
      { duration: '1 Minggu', supplierPrice: 9500 },
    ],
    snk: [
      'Dilarang tukar plan jika kesalahan bukan dari seller.',
      'Login hanya untuk 1 device.',
      'Tanya dulu sebelum beli soal plan biar nggak salah (no refund!).',
    ],
  },
  {
    id: 'vidio-daily-tv',
    category: 'vidio',
    categoryLabel: 'Vidio',
    title: 'Vidio Platinum Sharing Daily (TV Only)',
    badge: 'Layar Lebar 📺',
    description: 'Akses Platinum Vidio khusus Smart TV / Android TV.',
    options: [
      { duration: '1 Hari', supplierPrice: 2000 },
      { duration: '1 Minggu', supplierPrice: 4500 },
    ],
    snk: [
      'Dilarang tukar plan jika kesalahan bukan dari seller.',
      'Login hanya untuk 1 device (TV Only).',
      'Tanya dulu sebelum beli (no refund!).',
    ],
  },
  {
    id: 'vidio-sharing-month',
    category: 'vidio',
    categoryLabel: 'Vidio',
    title: 'Vidio Platinum Sharing (Bulanan)',
    badge: 'Favorit 🌟',
    description: 'Pilihan berlangganan bulanan Vidio Platinum sharing ekonomis.',
    options: [
      { duration: '1 Bulan (Pay TV Only)', supplierPrice: 9000 },
      { duration: '1 Bulan (Mobile)', supplierPrice: 17000 },
      { duration: '1 Bulan (2U All Device)', supplierPrice: 25000 },
    ],
    snk: [
      'Dilarang tukar plan jika kesalahan bukan dari seller.',
      'Login only 1 device.',
      'Tanya admin via WA jika ragu perihal tipe device.',
    ],
  },
  {
    id: 'vidio-private',
    category: 'vidio',
    categoryLabel: 'Vidio',
    title: 'Vidio Platinum Private Account',
    badge: 'Private VIP 💎',
    description: 'Akun privat utuh tanpa berbagi dengan pengguna lain.',
    options: [
      { duration: '1 Bulan (Pay TV Only)', supplierPrice: 14000 },
      { duration: '1 Tahun (Pay TV Only)', supplierPrice: 20000 },
      { duration: '1 Bulan (Mobile)', supplierPrice: 28000 },
      { duration: '1 Bulan (All Device)', supplierPrice: 38000 },
    ],
    snk: [
      'Login per perangkat sesuai tipe langganan yang dipilih.',
      'Dilarang tukar plan jika salah pilih.',
      'Garansi penuh sesuai durasi langganan.',
    ],
  },

  // --- DISNEY+ ---
  {
    id: 'disney-6u',
    category: 'disney',
    categoryLabel: 'Disney+ Hotstar',
    title: 'Disney+ Hotstar Sharing 6U',
    badge: 'Marvel & Pixar 🦸',
    description: 'Nonton film blockbuster Marvel, Disney, Pixar, & Star Wars terlengkap!',
    options: [
      { duration: '1 Hari', supplierPrice: 3500 },
      { duration: '3 Hari', supplierPrice: 7000 },
      { duration: '7 Hari', supplierPrice: 12000 },
      { duration: '1 Bulan', supplierPrice: 22000 },
    ],
    snk: [
      'Sharing 6 User aktif.',
      'Utamakan baca SNK sebelum pemesanan.',
      'Garansi akun dan pergantian cepat bila terjadi kendala.',
    ],
  },
];

export default function PremiumPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchQuery =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleOrderWhatsApp = (
    productTitle: string,
    duration: string,
    sellingPrice: number
  ) => {
    const message =
      `Halo Kak, saya ingin pesan Akun Premium:\n\n` +
      `📌 *Produk*: ${productTitle}\n` +
      `⏱️ *Durasi*: ${duration}\n` +
      `💰 *Harga*: ${formatRupiah(sellingPrice)}\n\n` +
      `Mohon diproses ya kak, terima kasih!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/6285156550742?text=${encoded}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-red-500 selection:text-white">
      <Navbar />

      {/* Header Banner Section */}
      <section className="pt-28 sm:pt-36 pb-12 px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-xs sm:text-sm mb-4">
              <Sparkles className="w-4 h-4" /> Katalog Lengkap Akun Premium
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Semua Layanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">Aplikasi Premium</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Temukan berbagai pilihan paket akun Netflix, Vidio, Disney+ Hotstar, dan lainnya dengan harga termurah di pasaran & garansi aman.
            </p>
          </motion.div>

          {/* Search Bar Input */}
          <div className="max-w-xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari akun premium (Netflix, Vidio, Disney+)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Semua Layanan ({allProducts.length})
            </button>
            <button
              onClick={() => setSelectedCategory('netflix')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === 'netflix'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Film className="w-4 h-4 text-red-500" />
              Netflix
            </button>
            <button
              onClick={() => setSelectedCategory('vidio')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === 'vidio'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Tv className="w-4 h-4 text-emerald-400" />
              Vidio
            </button>
            <button
              onClick={() => setSelectedCategory('disney')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === 'disney'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              Disney+ Hotstar
            </button>
          </div>
        </div>
      </section>

      {/* Product List Grid Section */}
      <section className="pb-24 px-4 relative z-10">
        <div className="container-custom">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-slate-800 max-w-md mx-auto space-y-3">
              <Info className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-slate-300 font-bold text-base">Tidak ada akun premium ditemukan</p>
              <p className="text-slate-500 text-xs">Coba kata kunci lain atau pilih kategori Semua Layanan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className="flex flex-col justify-between rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-red-500/40 transition-all p-6 shadow-lg hover:shadow-xl hover:shadow-red-950/20 group"
                >
                  <div>
                    {/* Card Top Info */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                          {product.categoryLabel}
                        </span>
                        <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors mt-2">
                          {product.title}
                        </h3>
                      </div>
                      {product.badge && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price List Options */}
                    <div className="space-y-2 mb-6">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Pricelist Durasi:
                      </p>
                      {product.options.map((opt) => {
                        const sellingPrice = calculateSellingPrice(opt.supplierPrice);
                        return (
                          <div
                            key={opt.duration}
                            className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all"
                          >
                            <span className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                              {opt.duration}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-extrabold text-white">
                                {formatRupiah(sellingPrice)}
                              </span>
                              <button
                                onClick={() =>
                                  handleOrderWhatsApp(product.title, opt.duration, sellingPrice)
                                }
                                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow hover:scale-105 active:scale-95 transition-all"
                              >
                                Pesan
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* SNK accordion if available */}
                    {product.snk && product.snk.length > 0 && (
                      <div className="mb-4 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                        <span className="font-bold text-slate-400 flex items-center gap-1.5 mb-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Catatan Layanan:
                        </span>
                        <ul className="list-disc list-inside text-slate-400 space-y-0.5 text-[11px]">
                          {product.snk.map((rule, i) => (
                            <li key={i}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Direct Order Button */}
                  <button
                    onClick={() =>
                      handleOrderWhatsApp(
                        product.title,
                        product.options[0].duration,
                        calculateSellingPrice(product.options[0].supplierPrice)
                      )
                    }
                    className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 hover:border-red-500 transition-all shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    Pesan {product.title}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
