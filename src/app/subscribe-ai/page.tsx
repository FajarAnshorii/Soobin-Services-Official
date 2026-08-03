'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion } from 'framer-motion';
import { MarqueeLogoScroller } from '@/components/ui/marquee-logo-scroller';

const aiLogos = [
  {
    src: '/logos/logo-claudecode.png',
    alt: 'Claude Code AI',
    gradient: { from: '#d97706', via: '#b45309', to: '#78350f' },
  },
  {
    src: '/logos/logo-claudepro.png',
    alt: 'Claude Pro AI',
    gradient: { from: '#d97706', via: '#000000', to: '#d97706' },
  },
  {
    src: '/logos/logo-hermes.png',
    alt: 'Hermes Agent AI',
    gradient: { from: '#000000', via: '#333333', to: '#000000' },
  },
  {
    src: '/logos/logo-openclaw.png',
    alt: 'OpenClaw AI',
    gradient: { from: '#dc2626', via: '#991b1b', to: '#000000' },
  },
  {
    src: '/logos/logo-midjourney.png',
    alt: 'Midjourney AI',
    gradient: { from: '#2563eb', via: '#1e40af', to: '#000000' },
  },
  {
    src: '/logos/logo-higgsfield.png',
    alt: 'Higgsfield AI',
    gradient: { from: '#9333ea', via: '#6b21a8', to: '#000000' },
  },
  {
    src: '/logos/logo-kling.png',
    alt: 'Kling AI',
    gradient: { from: '#06b6d4', via: '#3b82f6', to: '#eab308' },
  },
  {
    src: '/logos/logo-gamma.png',
    alt: 'Gamma AI',
    gradient: { from: '#a855f7', via: '#ec4899', to: '#f97316' },
  },
  {
    src: '/logos/logo-jenni.png',
    alt: 'Jenni AI',
    gradient: { from: '#0f172a', via: '#334155', to: '#000000' },
  },
  {
    src: '/logos/logo-scispace.png',
    alt: 'SciSpace AI',
    gradient: { from: '#0284c7', via: '#ea580c', to: '#0284c7' },
  },
  {
    src: '/logos/logo-chatgpt.png',
    alt: 'ChatGPT Plus & Go',
    gradient: { from: '#10a37f', via: '#000000', to: '#10a37f' },
  },
  {
    src: '/logos/logo-gemini.png',
    alt: 'Google Gemini Advanced',
    gradient: { from: '#4285f4', via: '#9b51e0', to: '#ea4335' },
  },
  {
    src: '/logos/logo-perplexity.png',
    alt: 'Perplexity Pro AI',
    gradient: { from: '#20b2aa', via: '#0f172a', to: '#20b2aa' },
  },
  {
    src: '/logos/logo-quillbot.png',
    alt: 'QuillBot Premium',
    gradient: { from: '#4f9e4f', via: '#1b4d1b', to: '#4f9e4f' },
  },
];

// Pricing Calculation Rule (User Profit Margin):
//   < 10k   -> +2.000
//   <= 30k  -> +3.000
//   <= 50k  -> +5.000
//   <= 100k -> +8.000
//   > 100k  -> +15.000
function calculateSellingPrice(supplierPrice: number, customMargin?: number): number {
  if (customMargin !== undefined) {
    return supplierPrice + customMargin;
  }
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
  customMargin?: number;
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
  // 1. CLAUDE CODE (TOP LEFT)
  {
    id: 'claude-code',
    category: 'claude',
    categoryLabel: 'Claude Code',
    title: 'Claude Code AI',
    badge: 'AI CODING & DEV',
    logo: '/logos/logo-claudecode.png',
    description: 'Akses Claude Code agentic AI coding assistant dengan limit request tinggi & garansi penuh.',
    features: [
      'Akses resmi Claude 3.7 Sonnet & Agentic Coding',
      'Pilihan durasi 14 hari & 30 hari',
      'Limit request 250, 500, hingga 750 / 5 jam',
      'Full garansi selama durasi aktif',
    ],
    options: [
      { duration: '14 Hari (250 Req / 5 Jam)', supplierPrice: 43700 },
      { duration: '14 Hari (500 Req / 5 Jam)', supplierPrice: 76000 },
      { duration: '14 Hari (750 Req / 5 Jam)', supplierPrice: 99000 },
      { duration: '30 Hari (250 Req / 5 Jam)', supplierPrice: 76000 },
      { duration: '30 Hari (500 Req / 5 Jam)', supplierPrice: 126000 },
      { duration: '30 Hari (750 Req / 5 Jam)', supplierPrice: 162000 },
    ],
  },

  // 2. CLAUDE PRO
  {
    id: 'claude-pro',
    category: 'claude',
    categoryLabel: 'Claude Pro',
    title: 'Claude Pro AI',
    badge: 'ANTHROPIC AI',
    logo: '/logos/logo-claudepro.png',
    description: 'Akses Claude 3.7 Sonnet & Opus dengan limit request tinggi, Artifacts, & Projects.',
    features: [
      'Akses resmi Claude 3.7 Sonnet & Opus',
      'Fitur Artifacts, Code Generation & Analysis',
      'Akun resmi & legal account',
      'Full garansi selama durasi berlangganan',
    ],
    options: [
      { duration: '1 Bulan', supplierPrice: 410130, customMargin: 50000 },
      { duration: '3 Bulan', supplierPrice: 1220100, customMargin: 50000 },
      { duration: '6 Bulan', supplierPrice: 2429420, customMargin: 50000 },
    ],
  },

  // 3. HERMES AGENT
  {
    id: 'hermes-agent',
    category: 'hermes',
    categoryLabel: 'Hermes Agent',
    title: 'Hermes Agent AI',
    badge: 'AI AGENT',
    logo: '/logos/logo-hermes.png',
    description: 'Akses Hermes Agent AI model canggih dengan kuota token fleksibel & garansi penuh.',
    features: [
      'Model AI Hermes Agent & Autonomous Workflows',
      'Pilihan token 5M, 10M, 20M, hingga 30M Token',
      'Koneksi cepat, stabil, & legal account',
      'Full garansi selama masa aktif',
    ],
    options: [
      { duration: '5M Token', supplierPrice: 37050 },
      { duration: '10M Token', supplierPrice: 65550 },
      { duration: '20M Token', supplierPrice: 121500 },
      { duration: '30M Token', supplierPrice: 179100 },
    ],
  },

  // 4. OPEN CLAW
  {
    id: 'open-claw',
    category: 'openclaw',
    categoryLabel: 'OpenClaw',
    title: 'OpenClaw AI',
    badge: 'AI AGENT & SCRAPING',
    logo: '/logos/logo-openclaw.png',
    description: 'Akses OpenClaw AI model canggih dengan kuota token fleksibel & garansi penuh.',
    features: [
      'Model AI OpenClaw & Web Automation Agent',
      'Pilihan token 5M, 10M, 20M, hingga 30M Token',
      'Koneksi cepat, stabil, & legal account',
      'Full garansi selama masa aktif',
    ],
    options: [
      { duration: '5M Token', supplierPrice: 37050 },
      { duration: '10M Token', supplierPrice: 65550 },
      { duration: '20M Token', supplierPrice: 121500 },
      { duration: '30M Token', supplierPrice: 179100 },
    ],
  },

  // 5. MIDJOURNEY AI
  {
    id: 'midjourney-ai',
    category: 'midjourney',
    categoryLabel: 'Midjourney',
    title: 'Midjourney AI',
    badge: 'AI IMAGE GENERATION',
    logo: '/logos/logo-midjourney.png',
    description: 'Generator gambar AI terbaik di dunia dengan kualitas photorealistic & prompt v6.',
    features: [
      'Akses Discord & Midjourney Web',
      'Pilihan paket Basic, Standard, & Pro',
      'Fast GPU hours & commercial usage rights',
      'Full garansi selama masa aktif',
    ],
    options: [
      { duration: 'Midjourney Basic', supplierPrice: 204232, customMargin: 30000 },
      { duration: 'Midjourney Standard', supplierPrice: 588882, customMargin: 30000 },
      { duration: 'Midjourney Pro', supplierPrice: 1179920, customMargin: 30000 },
    ],
  },

  // 6. HIGGSFIELD AI
  {
    id: 'higgsfield-ai',
    category: 'higgsfield',
    categoryLabel: 'Higgsfield',
    title: 'Higgsfield AI',
    badge: 'AI VIDEO & ANIMATION',
    logo: '/logos/logo-higgsfield.png',
    description: 'Platform AI video generation & animasi sinematik dengan kontrol kamera presisi.',
    features: [
      'Generasi video AI sinematik & gerak kamera',
      'Pilihan paket Basic (5), Basic (9), & Pro',
      'High resolution video rendering',
      'Full garansi selama durasi aktif',
    ],
    options: [
      { duration: 'Higgsfield Basic (5)', supplierPrice: 112308, customMargin: 30000 },
      { duration: 'Higgsfield Basic (9)', supplierPrice: 189042, customMargin: 30000 },
      { duration: 'Higgsfield Pro', supplierPrice: 583198, customMargin: 30000 },
    ],
  },

  // 7. KLING AI
  {
    id: 'kling-ai',
    category: 'kling',
    categoryLabel: 'Kling AI',
    title: 'Kling AI',
    badge: 'AI VIDEO GENERATION',
    logo: '/logos/logo-kling.png',
    description: 'Generator video & animasi AI dengan motion camera control & generasi sinematik 1080p.',
    features: [
      'Model Kling AI Video Generator 1080p',
      'Pilihan paket 660, 1.000, & 5.000 Kredit',
      'High-speed rendering & commercial rights',
      'Full garansi selama durasi aktif',
    ],
    options: [
      { duration: '660 Kredit', supplierPrice: 120000, customMargin: 30000 },
      { duration: '1.000 Kredit', supplierPrice: 195000, customMargin: 30000 },
      { duration: '5.000 Kredit', supplierPrice: 275000, customMargin: 30000 },
    ],
  },

  // 8. GAMMA AI
  {
    id: 'gamma-ai',
    category: 'gamma',
    categoryLabel: 'Gamma AI',
    title: 'Gamma AI Plus / Pro',
    badge: 'AI PRESENTATION & DOCS',
    logo: '/logos/logo-gamma.png',
    description: 'Platform AI pembuat slide presentasi, dokumen, & halaman web interaktif serba instan.',
    features: [
      'AI Generator Presentasi & Webpage instan',
      'Export PDF, PPTX, & custom branding',
      'Unlimited AI credits & premium card template',
      'Full garansi sesuai durasi pilihan',
    ],
    options: [
      { duration: '1 Bulan', supplierPrice: 25000, customMargin: 10000 },
      { duration: '2 Bulan', supplierPrice: 50000, customMargin: 15000 },
      { duration: '3 Bulan', supplierPrice: 75000, customMargin: 20000 },
      { duration: '4 Bulan', supplierPrice: 100000, customMargin: 30000 },
    ],
  },

  // 7. JENNI AI PREMIUM
  {
    id: 'jenni-ai',
    category: 'jenni',
    categoryLabel: 'Jenni AI',
    title: 'Jenni AI Premium',
    badge: 'ACADEMIC WRITING',
    logo: '/logos/logo-jenni.png',
    description: 'Asisten penulis skripsi & karya ilmiah AI dengan sitasi otomatis & autocompletion.',
    features: [
      'AI Autocomplete tulisan akademik & jurnal',
      'Sitasi otomatis APA, MLA, Chicago, Harvard',
      'Fitur AI Outline & Plagiarism Checker',
      'Full garansi sesuai durasi pilihan',
    ],
    options: [
      { duration: '1 Bulan', supplierPrice: 17500, customMargin: 15000 },
      { duration: '3 Bulan+', supplierPrice: 29900, customMargin: 15000 },
      { duration: '6 Bulan+', supplierPrice: 44900, customMargin: 15000 },
      { duration: '12 Bulan+', supplierPrice: 64900, customMargin: 15000 },
    ],
  },

  // 8. SCISPACE PREMIUM
  {
    id: 'scispace-ai',
    category: 'scispace',
    categoryLabel: 'SciSpace',
    title: 'SciSpace Premium',
    badge: 'RESEARCH & LITERATURE',
    logo: '/logos/logo-scispace.png',
    description: 'Platform riset AI untuk analisis PDF jurnal, penjelasan rumus, & literature review.',
    features: [
      'Chat dengan PDF jurnal & artikel ilmiah',
      'Penjelasan rumus matematika & grafik',
      'Literature review generator otomatis',
      'Full garansi selama masa aktif',
    ],
    options: [
      { duration: '1 Bulan', supplierPrice: 15000, customMargin: 20000 },
      { duration: '3 Bulan', supplierPrice: 38900, customMargin: 20000 },
      { duration: '6 Bulan', supplierPrice: 68900, customMargin: 20000 },
    ],
  },

  // 4. CHATGPT PLUS
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
    const finalPrice = calculateSellingPrice(option.supplierPrice, option.customMargin);
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
              { id: 'claude', label: 'Claude AI' },
              { id: 'hermes', label: 'Hermes Agent' },
              { id: 'openclaw', label: 'OpenClaw' },
              { id: 'midjourney', label: 'Midjourney' },
              { id: 'higgsfield', label: 'Higgsfield' },
              { id: 'kling', label: 'Kling AI' },
              { id: 'gamma', label: 'Gamma AI' },
              { id: 'jenni', label: 'Jenni AI' },
              { id: 'scispace', label: 'SciSpace' },
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

      {/* Marquee Logo Scroller AI Partners */}
      <section className="pt-8 pb-2 px-4 container-custom">
        <MarqueeLogoScroller
          title="EKOSISTEM AI TERLENGKAP"
          description="Platform kecerdasan buatan resmi yang tersedia di SOOBIN Services dengan akses instan & garansi penuh."
          logos={aiLogos}
          speed="normal"
        />
      </section>

      {/* Product Cards Grid - B&W Clean */}
      <section className="py-12 sm:py-16 px-4 container-custom flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const selectedIndex = selectedOptions[product.id] || 0;
            const currentOption = product.options[selectedIndex] || product.options[0];
            const finalPrice = calculateSellingPrice(currentOption.supplierPrice, currentOption.customMargin);

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
                            {opt.duration} - {formatRupiah(calculateSellingPrice(opt.supplierPrice, opt.customMargin))}
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
