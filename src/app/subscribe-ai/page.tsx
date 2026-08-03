'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion } from 'framer-motion';

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
}

interface AIProduct {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  badge: string;
  logo: string;
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
    logo: '/logos/logo-chatgpt.png',
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
    logo: '/logos/logo-chatgpt.png',
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
    logo: '/logos/logo-gemini.png',
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
    logo: '/logos/logo-perplexity.png',
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
    logo: '/logos/logo-quillbot.png',
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
    <div className="min-h-screen bg-white font-sans text-neutral-900 flex flex-col">
      <Navbar />

      {/* Hero Header - B&W Minimalist */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-black text-white border-b border-neutral-800">
        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-bold tracking-widest uppercase mb-6">
              SOOBIN SUBSCRIBE AI OFFICIAL
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6 text-white">
              Langganan AI Premium <br />
              <span className="text-neutral-400">
                Resmi, Hemat & Garansi Penuh
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Akses cepat tanpa batas ke ChatGPT Plus (GPT-4o), ChatGPT Go, Google Gemini Advanced, Perplexity Pro, & QuillBot Premium dengan jaminan garansi resmi.
            </p>
          </motion.div>

          {/* Search Bar - B&W */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="max-w-xl mx-auto relative"
          >
            <input
              type="text"
              placeholder="Cari AI (misal: ChatGPT, Gemini, QuillBot)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-2xl py-4 px-6 text-white placeholder-neutral-500 focus:outline-none focus:border-white shadow-lg text-sm sm:text-base"
            />
          </motion.div>
        </div>
      </section>

      {/* Category Pills Filter - B&W */}
      <section className="bg-white border-b border-neutral-200 sticky top-16 md:top-20 z-30 shadow-xs">
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
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-neutral-100 text-neutral-800 border-neutral-300 hover:bg-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Cards Grid - B&W Clean */}
      <section className="py-12 sm:py-16 px-4 container-custom flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const selectedIndex = selectedOptions[product.id] || 0;
            const currentOption = product.options[selectedIndex] || product.options[0];
            const finalPrice = calculateSellingPrice(currentOption.supplierPrice);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-neutral-300 shadow-md hover:shadow-xl transition-all flex flex-col overflow-hidden relative"
              >
                {/* Header Card - Solid Black */}
                <div className="p-6 bg-black text-white border-b border-neutral-800">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="bg-white rounded-xl px-3 py-1.5 h-10 border border-neutral-300 flex items-center justify-center shrink-0">
                      <Image
                        src={product.logo}
                        alt={product.title}
                        width={90}
                        height={28}
                        className="h-6 w-auto object-contain"
                      />
                    </div>
                    <span className="px-3 py-1 bg-neutral-900 border border-neutral-700 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-300">
                      {product.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                    {product.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Body Card */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  {/* Features List */}
                  <div className="space-y-2.5">
                    <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">FITUR & KEUNGGULAN:</p>
                    {product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-800">
                        <span className="text-neutral-900 font-bold">•</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Options Dropdown / Selector */}
                  <div className="space-y-3 pt-4 border-t border-neutral-200">
                    <label className="block text-xs font-black text-neutral-900 uppercase tracking-wider">
                      PILIH DURASI / PAKET:
                    </label>
                    <div className="relative">
                      <select
                        value={selectedIndex}
                        onChange={(e) => handleOptionChange(product.id, Number(e.target.value))}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-3.5 pl-4 pr-10 text-xs sm:text-sm font-bold text-neutral-900 focus:outline-none focus:border-black appearance-none cursor-pointer truncate"
                      >
                        {product.options.map((opt, idx) => (
                          <option key={idx} value={idx}>
                            {opt.duration} - {formatRupiah(calculateSellingPrice(opt.supplierPrice))}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-700">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>

                    {/* Pricing Box - B&W */}
                    <div className="bg-neutral-100 border border-neutral-300 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-wider">HARGA RESMI:</p>
                        <p className="text-2xl font-black text-neutral-900">
                          {formatRupiah(finalPrice)}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 bg-black text-white rounded-md">
                        GARANSI
                      </span>
                    </div>

                    {/* WhatsApp Action Button */}
                    <a
                      href={getWhatsAppUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-all shadow-md text-xs sm:text-sm uppercase tracking-wider text-center"
                    >
                      Pesan via WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trust & Guarantee Section - B&W */}
      <section className="bg-neutral-50 border-t border-neutral-200 py-12 px-4">
        <div className="container-custom max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-2 uppercase tracking-wide">
              MENGAPA LANGGANAN AI DI SOOBIN SERVICES?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Jaminan akun resmi, proses instan, & garansi purna jual terpercaya.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-5 bg-white border border-neutral-300 rounded-2xl space-y-2">
              <h3 className="font-black text-neutral-900 text-sm uppercase tracking-wider">Full Garansi Legal</h3>
              <p className="text-xs text-neutral-600">Semua akun dijamin aktif sesuai durasi paket dengan penggantian cepat jika terjadi kendala.</p>
            </div>
            <div className="p-5 bg-white border border-neutral-300 rounded-2xl space-y-2">
              <h3 className="font-black text-neutral-900 text-sm uppercase tracking-wider">Proses Cepat</h3>
              <p className="text-xs text-neutral-600">Admin siap memproses pesanan langsung setelah konfirmasi pembayaran.</p>
            </div>
            <div className="p-5 bg-white border border-neutral-300 rounded-2xl space-y-2">
              <h3 className="font-black text-neutral-900 text-sm uppercase tracking-wider">Harga Hemat</h3>
              <p className="text-xs text-neutral-600">Penawaran harga terbaik untuk kebutuhan belajar, riset, & pekerjaan profesional.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
