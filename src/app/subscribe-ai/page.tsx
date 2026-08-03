'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion } from 'framer-motion';
import { Search, Sparkles, CheckCircle2, ShieldCheck, Zap, Bot, BrainCircuit, BookOpenCheck, MessageSquareText } from 'lucide-react';

// Pricing Calculation Rule (User Profit Margin):
//   < 10k   -> +2.000
//   <= 30k  -> +3.000
//   <= 50k  -> +5.000
//   <= 100k -> +8.000
//   > 100k  -> +15.000
function calculateSellingPrice(supplierPrice: number): number {
  if (supplierPrice < 10000) {
    return supplierPrice + 2000;
  } else if (supplierPrice <= 30000) {
    return supplierPrice + 3000;
  } else if (supplierPrice <= 50000) {
    return supplierPrice + 5000;
  } else if (supplierPrice <= 100000) {
    return supplierPrice + 8000;
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
  badge?: string;
}

interface AIProduct {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  badge: string;
  iconName: string;
  gradient: string;
  description: string;
  features: string[];
  options: PriceOption[];
}

const aiProducts: AIProduct[] = [
  // 1. CHATGPT PLUS
  {
    id: 'chatgpt-plus',
    category: 'chatgpt',
    categoryLabel: 'ChatGPT Plus',
    title: 'ChatGPT Plus (GPT-4o & Canvas)',
    badge: 'PALING POPULER',
    iconName: 'bot',
    gradient: 'from-emerald-600 to-teal-800',
    description: 'Akses GPT-4o, DALL-E 3, Browsing, Advanced Data Analysis, Canvas, & garansi penuh.',
    features: [
      'Sharing full garansi backfree & disable',
      'Akun siap pakai dari seller',
      'Pilihan user sharing 8u, 5u, 3u, 2u & Private',
      'Akses fitur terbaru GPT-4o & DALL-E 3',
    ],
    options: [
      // Sharing 8 User
      { duration: 'Sharing 8 User - 1 Hari', supplierPrice: 6000 },
      { duration: 'Sharing 8 User - 3 Hari', supplierPrice: 11000 },
      { duration: 'Sharing 8 User - 7 Hari', supplierPrice: 15000 },
      { duration: 'Sharing 8 User - 1 Bulan', supplierPrice: 32000 },
      // Sharing 5 User
      { duration: 'Sharing 5 User - 1 Hari', supplierPrice: 10000 },
      { duration: 'Sharing 5 User - 3 Hari', supplierPrice: 16000 },
      { duration: 'Sharing 5 User - 7 Hari', supplierPrice: 18000 },
      { duration: 'Sharing 5 User - 1 Bulan', supplierPrice: 38000 },
      // Sharing 3 User
      { duration: 'Sharing 3 User - 1 Hari', supplierPrice: 14000 },
      { duration: 'Sharing 3 User - 3 Hari', supplierPrice: 24000 },
      { duration: 'Sharing 3 User - 7 Hari', supplierPrice: 32000 },
      { duration: 'Sharing 3 User - 1 Bulan', supplierPrice: 85000 },
      // Sharing 2 User
      { duration: 'Sharing 2 User - 1 Hari', supplierPrice: 19000 },
      { duration: 'Sharing 2 User - 3 Hari', supplierPrice: 30000 },
      { duration: 'Sharing 2 User - 7 Hari', supplierPrice: 40000 },
      { duration: 'Sharing 2 User - 1 Bulan', supplierPrice: 90000 },
      // Private Account
      { duration: 'Private 1 Bulan (Full Garansi)', supplierPrice: 215000 },
      { duration: 'Private 1 Bulan (Garansi Deactive 1x)', supplierPrice: 120000 },
      { duration: 'Private 1 Bulan (Garansi Deactive 2x)', supplierPrice: 150000 },
    ],
  },

  // 2. CHATGPT GO
  {
    id: 'chatgpt-go',
    category: 'chatgpt',
    categoryLabel: 'ChatGPT Go',
    title: 'ChatGPT Go',
    badge: 'FAST & STABLE',
    iconName: 'zap',
    gradient: 'from-blue-600 to-cyan-800',
    description: 'Akses ChatGPT cepat, hemat, full garansi, & akun dari seller.',
    features: [
      'Full garansi selama masa aktif',
      'Akun siap pakai dari seller',
      'Tersedia pilihan Sharing 5 User & Private',
      'Koneksi cepat tanpa antrean',
    ],
    options: [
      { duration: '1 Bulan Sharing (5 User)', supplierPrice: 15000 },
      { duration: '1 Bulan Private Account', supplierPrice: 50000 },
    ],
  },

  // 3. GEMINI ADVANCED
  {
    id: 'gemini-advanced',
    category: 'gemini',
    categoryLabel: 'Google Gemini',
    title: 'Google Gemini Advanced / Ultra',
    badge: 'GOOGLE AI 1.5 PRO',
    iconName: 'sparkles',
    gradient: 'from-indigo-600 to-purple-800',
    description: 'Model AI tercanggih Google dengan context window 2M token & Google One 2TB.',
    features: [
      'Full garansi sesuai durasi paket',
      'Bisa invite email seller atau email pribadi cust',
      'Akun private & aman dari kendala',
      'Sistem Invite Famplan & Head (5 email)',
    ],
    options: [
      { duration: 'Invite Famplan 1 Bulan', supplierPrice: 10000 },
      { duration: 'Invite Famplan 3 Bulan', supplierPrice: 15000 },
      { duration: 'Invite Famplan 4 Bulan', supplierPrice: 23000 },
      { duration: 'Head Account 1 Bulan (Invite 5 Email)', supplierPrice: 20000 },
    ],
  },

  // 4. PERPLEXITY PRO
  {
    id: 'perplexity-pro',
    category: 'perplexity',
    categoryLabel: 'Perplexity AI',
    title: 'Perplexity Pro AI',
    badge: 'RESEARCH & ACADEMIC',
    iconName: 'brain',
    gradient: 'from-sky-600 to-blue-900',
    description: 'Mesin pencari AI dengan Pro Search unlimited, Claude 3.5 Sonnet, & GPT-4o.',
    features: [
      'Full garansi selama masa aktif',
      'Legal paid account',
      'Akun siap pakai dari seller',
      'Akses Claude 3.5 Sonnet & GPT-4o bebas ganti',
    ],
    options: [
      { duration: '1 Bulan Sharing Account', supplierPrice: 20000 },
    ],
  },

  // 5. QUILLBOT PREMIUM
  {
    id: 'quillbot-pro',
    category: 'quillbot',
    categoryLabel: 'QuillBot Premium',
    title: 'QuillBot Premium',
    badge: 'PARAFRASE UNLIMITED',
    iconName: 'book',
    gradient: 'from-green-600 to-emerald-900',
    description: 'Buka semua mode parafrase tanpa batas kata, plagiarism checker, & Grammar Check.',
    features: [
      'Mode parafrase unlimited (Standard, Fluency, Academic, Creative)',
      'Fitur Plagiarism Checker & Summarizer',
      'Tersedia akun Sharing & Private',
      'Garansi akun aktif',
    ],
    options: [
      { duration: '1 Bulan Sharing Account', supplierPrice: 9500 },
      { duration: '1 Bulan Private Account', supplierPrice: 34000 },
    ],
  },
];

export default function SubscribeAIPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});

  const filteredProducts = useMemo(() => {
    return aiProducts.filter((product) => {
      const matchCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchQuery =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleOptionChange = (productId: string, optionIndex: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: optionIndex,
    }));
  };

  const getWhatsAppUrl = (product: AIProduct) => {
    const selectedIndex = selectedOptions[product.id] || 0;
    const option = product.options[selectedIndex];
    const finalPrice = calculateSellingPrice(option.supplierPrice);
    const message = `Halo SOOBIN Services, saya ingin memesan *${product.title}*\n\n📌 Paket: *${option.duration}*\n💰 Harga: *${formatRupiah(finalPrice)}*\n\nApakah stok masih tersedia? Terima kasih!`;
    return `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-[#0F1E36] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              SOOBIN SUBSCRIBE AI OFFICIAL
            </span>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Langganan AI Premium <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Resmi, Hemat & Garansi Penuh
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Akses cepat tanpa batas ke **ChatGPT Plus (GPT-4o)**, **ChatGPT Go**, **Google Gemini Advanced**, **Perplexity Pro**, & **QuillBot Premium** dengan harga terjangkau dan jaminan garansi.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari AI (misal: ChatGPT, Gemini, QuillBot)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-xl text-sm sm:text-base"
            />
          </motion.div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <section className="bg-white border-b border-slate-200 sticky top-16 md:top-20 z-30 shadow-xs">
        <div className="container-custom py-4 px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max justify-center">
            {[
              { id: 'all', label: 'Semua AI' },
              { id: 'chatgpt', label: 'ChatGPT' },
              { id: 'gemini', label: 'Google Gemini' },
              { id: 'perplexity', label: 'Perplexity AI' },
              { id: 'quillbot', label: 'QuillBot' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-[#0F1E36] text-white border-[#0F1E36] shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Cards Grid */}
      <section className="py-12 sm:py-16 px-4 container-custom flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const selectedIndex = selectedOptions[product.id] || 0;
            const currentOption = product.options[selectedIndex] || product.options[0];
            const finalPrice = calculateSellingPrice(currentOption.supplierPrice);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl transition-all flex flex-col overflow-hidden relative group"
              >
                {/* Header Card */}
                <div className={`p-6 bg-gradient-to-r ${product.gradient} text-white relative`}>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      {product.iconName === 'bot' && <Bot className="w-7 h-7 text-emerald-300" />}
                      {product.iconName === 'zap' && <Zap className="w-7 h-7 text-cyan-300" />}
                      {product.iconName === 'sparkles' && <Sparkles className="w-7 h-7 text-purple-300" />}
                      {product.iconName === 'brain' && <BrainCircuit className="w-7 h-7 text-blue-300" />}
                      {product.iconName === 'book' && <BookOpenCheck className="w-7 h-7 text-green-300" />}
                    </div>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider text-white border border-white/30">
                      {product.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                    {product.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Body Card */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  {/* Features List */}
                  <div className="space-y-2.5">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Keunggulan & Fitur:</p>
                    {product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Options Dropdown / Selector */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                      PILIH DURASI / PAKET:
                    </label>
                    <select
                      value={selectedIndex}
                      onChange={(e) => handleOptionChange(product.id, Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 px-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {product.options.map((opt, idx) => (
                        <option key={idx} value={idx}>
                          {opt.duration} - {formatRupiah(calculateSellingPrice(opt.supplierPrice))}
                        </option>
                      ))}
                    </select>

                    {/* Pricing Box */}
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Total Harga Resmi:</p>
                        <p className="text-2xl font-black text-emerald-700">
                          {formatRupiah(finalPrice)}
                        </p>
                      </div>
                      <ShieldCheck className="w-8 h-8 text-emerald-500 opacity-80" />
                    </div>

                    {/* WhatsApp Action Button */}
                    <a
                      href={getWhatsAppUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#0F1E36] hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-sm"
                    >
                      <MessageSquareText className="w-4 h-4 text-emerald-400" />
                      <span>Pesan Sekarang Via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trust & Guarantee Section */}
      <section className="bg-white border-t border-slate-200 py-12 px-4">
        <div className="container-custom max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Mengapa Langganan AI di SOOBIN Services?
            </h2>
            <p className="text-sm text-slate-600">
              Proses transaksi transparan, akun berkualitas, & jaminan purna jual terpercaya.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Full Garansi Legal</h3>
              <p className="text-xs text-slate-600">Semua akun dijamin aktif sesuai durasi dengan penggantian cepat jika terjadi kendala.</p>
            </div>
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <Zap className="w-8 h-8 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">Proses Instan</h3>
              <p className="text-xs text-slate-600">Admin siap memproses pesanan dengan cepat setelah pembayaran terverifikasi.</p>
            </div>
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Harga Terbaik</h3>
              <p className="text-xs text-slate-600">Penawaran harga terbaik untuk pelajar, mahasiswa, profesional, & peneliti.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
