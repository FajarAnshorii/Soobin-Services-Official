'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion } from 'framer-motion';
import { Search, Film, Tv, Sparkles, MessageCircle, AlertCircle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';

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
    badge: 'BEST SELLER 🔥',
    description: '1 Profile khusus untuk 1 pengguna, tidak berbagi layar dengan pengguna lain.',
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
    badge: 'HEMAT!',
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
    badge: 'STABIL ✨',
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
    badge: 'SINGLE SCREEN 🖥️',
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
    badge: 'FULL PRIVATE 👑',
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
    badge: 'LIGA INGGIS ⚽',
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
    badge: 'SMART TV 📺',
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
    badge: 'BEST DEAL!',
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
    badge: 'FULL PRIVATE VIP 💎',
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
    badge: 'MARVEL & PIXAR 🦸',
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
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      {/* Hero Section Header (Matching Layanan Page Navy Theme) */}
      <section className="bg-[#0B1527] pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 text-center">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
              Layanan Aplikasi Premium
            </h1>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
              Temukan berbagai layanan aplikasi streaming & premium terfavorit dengan harga termurah di pasaran
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Category Navigation Section */}
      <section className="py-8 px-4 border-b border-gray-200 bg-white">
        <div className="container-custom">
          {/* Search Input Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari layanan premium (Netflix, Vidio, Disney+)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0F1E36] focus:ring-2 focus:ring-[#0F1E36]/10 text-sm transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills (Exact matching style from Layanan Page) */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all border ${
                selectedCategory === 'all'
                  ? 'bg-[#0F1E36] text-white border-[#0F1E36] shadow-sm'
                  : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
              }`}
            >
              Semua ({allProducts.length})
            </button>
            <button
              onClick={() => setSelectedCategory('netflix')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all border ${
                selectedCategory === 'netflix'
                  ? 'bg-[#0F1E36] text-white border-[#0F1E36] shadow-sm'
                  : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
              }`}
            >
              <Film className="w-4 h-4 text-red-500" />
              Netflix
            </button>
            <button
              onClick={() => setSelectedCategory('vidio')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all border ${
                selectedCategory === 'vidio'
                  ? 'bg-[#0F1E36] text-white border-[#0F1E36] shadow-sm'
                  : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
              }`}
            >
              <Tv className="w-4 h-4 text-emerald-600" />
              Vidio
            </button>
            <button
              onClick={() => setSelectedCategory('disney')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all border ${
                selectedCategory === 'disney'
                  ? 'bg-[#0F1E36] text-white border-[#0F1E36] shadow-sm'
                  : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              Disney+ Hotstar
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Product Grid */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container-custom">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-200 max-w-md mx-auto space-y-3 shadow-sm">
              <Info className="w-10 h-10 text-gray-400 mx-auto" />
              <p className="text-gray-800 font-bold text-base">Tidak ada akun premium ditemukan</p>
              <p className="text-gray-500 text-xs">Coba kata kunci lain atau pilih kategori Semua.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className="flex flex-col justify-between rounded-2xl bg-white border border-gray-200 hover:border-primary-800/40 transition-all p-6 shadow-sm hover:shadow-md relative overflow-hidden group"
                >
                  {/* Top Badge (Matching Green Pill Badge from Layanan page) */}
                  {product.badge && (
                    <div className="absolute top-0 right-0">
                      <span className="bg-[#00C853] text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Header Info */}
                    <div className="mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 px-2.5 py-0.5 rounded bg-gray-100 border border-gray-200 inline-block mb-2">
                        {product.categoryLabel}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-800 transition-colors">
                        {product.title}
                      </h3>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm mb-6 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price List Options */}
                    <div className="space-y-2 mb-6">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Pricelist Durasi:
                      </p>
                      {product.options.map((opt) => {
                        const sellingPrice = calculateSellingPrice(opt.supplierPrice);
                        return (
                          <div
                            key={opt.duration}
                            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200/80 hover:border-gray-300 transition-all"
                          >
                            <span className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#00C853] shrink-0" />
                              {opt.duration}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-extrabold text-[#0B1527]">
                                {formatRupiah(sellingPrice)}
                              </span>
                              <button
                                onClick={() =>
                                  handleOrderWhatsApp(product.title, opt.duration, sellingPrice)
                                }
                                className="px-3 py-1.5 rounded-lg bg-[#0F1E36] hover:bg-[#162A4A] text-white font-bold text-xs shadow hover:scale-105 active:scale-95 transition-all"
                              >
                                Pesan
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* SNK accordion / notes */}
                    {product.snk && product.snk.length > 0 && (
                      <div className="mb-4 p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs space-y-1">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Catatan Layanan:
                        </span>
                        <ul className="list-disc list-inside text-amber-800 space-y-0.5 text-[11px]">
                          {product.snk.map((rule, i) => (
                            <li key={i}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Primary WhatsApp Button */}
                  <button
                    onClick={() =>
                      handleOrderWhatsApp(
                        product.title,
                        product.options[0].duration,
                        calculateSellingPrice(product.options[0].supplierPrice)
                      )
                    }
                    className="w-full py-3 px-4 rounded-xl bg-[#0F1E36] hover:bg-[#162A4A] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
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
