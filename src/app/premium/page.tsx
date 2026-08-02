'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion } from 'framer-motion';
import { Search, Film, Tv, Sparkles, MessageCircle, AlertCircle, CheckCircle2, Info, GraduationCap, Video, Music2, Clapperboard, MonitorPlay } from 'lucide-react';

// Pricing Calculation Rule (User Profit Margin):
// If supplierPrice < 5,000 perak:
//   <= 1,000 perak -> +500
//   < 5,000 perak  -> +1,000
// Standard Rule:
//   <= 20k   -> +2,000
//   <= 40k   -> +4,000
//   <= 100k  -> +5,000
//   > 100k   -> +15,000
function calculateSellingPrice(supplierPrice: number): number {
  if (supplierPrice < 5000) {
    if (supplierPrice <= 1000) return supplierPrice + 500;
    return supplierPrice + 1000;
  }

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
  category: string;
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
    snk: ['Lebih dari 1 bulan menggunakan sistem renew.', 'Utamakan baca SNK sebelum order.', 'Estimasi fixing 3-7 hari, no rush!'],
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
    snk: ['Lebih dari 1 bulan menggunakan sistem renew.', 'Utamakan baca SNK sebelum order.', 'Estimasi fixing 3-7 hari, no rush!'],
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
    snk: ['Lebih dari 1 bulan menggunakan sistem renew.', 'Utamakan baca SNK sebelum order.', 'Estimasi fixing 3-7 hari, no rush!'],
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
    snk: ['Lebih dari 1 bulan menggunakan sistem renew.', 'Utamakan baca SNK sebelum order.', 'Estimasi fixing 3-7 hari, no rush!'],
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
    snk: ['Lebih dari 1 bulan menggunakan sistem renew.', 'Utamakan baca SNK sebelum order.', 'Estimasi fixing 3-7 hari, no rush!'],
  },

  // --- YOUTUBE PREMIUM ---
  {
    id: 'youtube-famplan',
    category: 'youtube',
    categoryLabel: 'YouTube Premium',
    title: 'YouTube Premium Famplan',
    badge: 'NO ADS & BACKGROUND 🎵',
    description: 'Bebas iklan, putar latar belakang, & YouTube Music Premium.',
    options: [
      { duration: '1 Bulan', supplierPrice: 4000 },
      { duration: '2 Bulan', supplierPrice: 8000 },
      { duration: '3 Bulan', supplierPrice: 12000 },
    ],
    snk: ['Opsional +2.000 jika menggunakan akun dari seller.'],
  },
  {
    id: 'youtube-indplan',
    category: 'youtube',
    categoryLabel: 'YouTube Premium',
    title: 'YouTube Premium Indplan & Mix',
    badge: 'INDIVIDUAL VIP 🔴',
    description: 'Plan individual atau mixplan perpanjangan tanpa ganti-ganti akun.',
    options: [
      { duration: '1 Bulan (Indplan)', supplierPrice: 11000 },
      { duration: '2 Bulan (Indplan)', supplierPrice: 22000 },
      { duration: '3 Bulan (Indplan NoGar)', supplierPrice: 20000 },
      { duration: '3 Bulan (Indplan Renew)', supplierPrice: 30000 },
      { duration: '3 Bulan (Indplan No Renew)', supplierPrice: 38000 },
      { duration: '3 Bulan (Mixplan)', supplierPrice: 22000 },
      { duration: '5 Bulan (Mixplan)', supplierPrice: 48000 },
      { duration: '1 Bulan (Head/Owner)', supplierPrice: 8000 },
    ],
    snk: ['Opsional +2.000 jika menggunakan akun dari seller.'],
  },

  // --- CANVA PRO ---
  {
    id: 'canva-member',
    category: 'canva',
    categoryLabel: 'Canva Pro',
    title: 'Canva Pro Member Invite',
    badge: 'DESAIN UNLIMITED 🎨',
    description: 'Akses semua elemen premium, hapus background, & font eksklusif Canva Pro.',
    options: [
      { duration: '1 Hari', supplierPrice: 300 },
      { duration: '2 Hari', supplierPrice: 500 },
      { duration: '5 Hari', supplierPrice: 800 },
      { duration: '7 Hari', supplierPrice: 1000 },
      { duration: '1 Bulan', supplierPrice: 2000 },
      { duration: '2 Bulan', supplierPrice: 3000 },
      { duration: '3 Bulan', supplierPrice: 4000 },
      { duration: '6 Bulan (Full Garansi)', supplierPrice: 8000 },
      { duration: '1 Tahun (Garansi 6 Bulan)', supplierPrice: 10000 },
      { duration: '1 Tahun (Full Garansi)', supplierPrice: 14000 },
    ],
    snk: ['Renew tiap bulan (kecuali versi Lifetime).', 'Invite langsung ke email Canva milik Anda sendiri.'],
  },
  {
    id: 'canva-admin-owner',
    category: 'canva',
    categoryLabel: 'Canva Pro',
    title: 'Canva Pro Admin, Owner & Lifetime',
    badge: 'TIM OWNER 💼',
    description: 'Akses tim sendiri, invite anggota tim sesuka hati, atau paket Lifetime.',
    options: [
      { duration: 'Lifetime Edu (Garansi 6 Bulan)', supplierPrice: 11000 },
      { duration: '1 Bulan (Admin)', supplierPrice: 7000 },
      { duration: '1 Bulan (Owner + Include Acc)', supplierPrice: 14000 },
    ],
    snk: ['Bisa pakai akun sendiri atau akun dari seller.', 'Tambah Designer +700.'],
  },

  // --- SPOTIFY PREMIUM ---
  {
    id: 'spotify-famplan',
    category: 'spotify',
    categoryLabel: 'Spotify',
    title: 'Spotify Famplan (Full Warranty)',
    badge: 'MUSIK TANPA IKLAN 🎵',
    description: 'Dengarkan lagu offline tanpa iklan & kualitas suara tertinggi.',
    options: [
      { duration: '7 Hari', supplierPrice: 6500 },
      { duration: '19 Hari', supplierPrice: 10000 },
      { duration: '1 Bulan', supplierPrice: 17000 },
      { duration: '2 Bulan', supplierPrice: 27000 },
      { duration: '3 Bulan', supplierPrice: 38000 },
    ],
    snk: ['Tanyakan stok ke admin terlebih dahulu.', 'Full garansi Backfree (BF).', 'Perpanjangan (PPJ) bulan ke-4 dst +15k.', '+2.000 jika memakai akun dari seller.'],
  },
  {
    id: 'spotify-indplan',
    category: 'spotify',
    categoryLabel: 'Spotify',
    title: 'Spotify Individual Plan',
    badge: 'INDIVIDUAL VIP 🎧',
    description: 'Plan individual resmi tanpa gabung grup keluarga.',
    options: [
      { duration: '1 Bulan (No Warranty)', supplierPrice: 10000 },
      { duration: '2 Bulan (No Warranty)', supplierPrice: 13000 },
      { duration: '3 Bulan (No Warranty)', supplierPrice: 17000 },
      { duration: '4 Bulan (No Warranty)', supplierPrice: 20000 },
      { duration: '1 Bulan (Full Warranty)', supplierPrice: 21000 },
      { duration: '2 Bulan (Full Warranty)', supplierPrice: 35000 },
      { duration: '3 Bulan (Full Warranty)', supplierPrice: 41000 },
    ],
    snk: ['Sistem replace jika akun sudah pernah premium.', 'Estimasi proses max 1x24 jam (No Rush).'],
  },

  // --- GRAMMARLY ---
  {
    id: 'grammarly-pro',
    category: 'grammarly',
    categoryLabel: 'Grammarly',
    title: 'Grammarly Premium',
    badge: 'AKADEMIK & SKRIPSI 📝',
    description: 'Cek tata bahasa Inggris, kejelasan kalimat, & peningkatan kosakata profesional.',
    options: [
      { duration: '1 Bulan (Sharing)', supplierPrice: 9000 },
      { duration: '1 Bulan (Private)', supplierPrice: 29000 },
    ],
    snk: ['Sangat direkomendasikan untuk penyusunan jurnal & skripsi.'],
  },

  // --- QUILLBOT ---
  {
    id: 'quillbot-pro',
    category: 'quillbot',
    categoryLabel: 'QuillBot',
    title: 'QuillBot Premium',
    badge: 'PARAFRASE AKURAT 🔄',
    description: 'Buka mode parafrase unlimited, plagiarism checker, & pengubah nada tulisan.',
    options: [
      { duration: '1 Bulan (Sharing)', supplierPrice: 9500 },
      { duration: '1 Bulan (Private)', supplierPrice: 34000 },
    ],
    snk: ['Garansi aktif penuh selama 1 bulan.'],
  },

  // --- MS 365 & WPS PRO ---
  {
    id: 'office-apps',
    category: 'office',
    categoryLabel: 'Office & Document',
    title: 'Microsoft 365 & WPS Office Pro',
    badge: 'PRODUKTIVITAS 💼',
    description: 'Lisensi Word, Excel, PowerPoint, Cloud Storage 1TB, & WPS Office Pro.',
    options: [
      { duration: '1 Bulan - MS365 Standard', supplierPrice: 8000 },
      { duration: '1 Bulan - MS365 Famhead', supplierPrice: 12000 },
      { duration: '1 Bulan - WPS Pro Sharing', supplierPrice: 9000 },
      { duration: '1 Bulan - WPS Pro Private', supplierPrice: 25000 },
    ],
    snk: ['Akses fitur cloud & template premium.'],
  },

  // --- BRAINLY+ & DUOLINGO ---
  {
    id: 'edu-apps',
    category: 'education',
    categoryLabel: 'Edukasi & Belajar',
    title: 'Brainly+ & Duolingo Super',
    badge: 'EDUKASI 🎓',
    description: 'Jawaban verified tanpa iklan di Brainly & belajar bahasa tanpa batas di Duolingo.',
    options: [
      { duration: '1 Bulan - Duolingo Super', supplierPrice: 9000 },
      { duration: '1 Bulan - Duolingo Famhead', supplierPrice: 15000 },
      { duration: '1 Tahun - Brainly+ (Garansi 6 Bulan)', supplierPrice: 17000 },
    ],
    snk: ['Belajar tanpa gangguan iklan.'],
  },

  // --- ZOOM PRO ---
  {
    id: 'zoom-pro',
    category: 'zoom',
    categoryLabel: 'Zoom Pro',
    title: 'Zoom Pro (100 Participants)',
    badge: 'MEETING UNLIMITED 📹',
    description: 'Meeting tanpa batas durasi 40 menit & fitur co-host penuh.',
    options: [
      { duration: '1 Jam', supplierPrice: 3000 },
      { duration: '1 Hari', supplierPrice: 7000 },
      { duration: '1 Minggu', supplierPrice: 14000 },
      { duration: '2 Minggu', supplierPrice: 20000 },
      { duration: '1 Bulan', supplierPrice: 25000 },
    ],
    snk: ['Kapasitas 100 peserta rapat.'],
  },

  // --- VIU PREMIUM ---
  {
    id: 'viu-premium',
    category: 'viu',
    categoryLabel: 'Viu',
    title: 'Viu Premium (Less Limit & Private Anti Limit)',
    badge: 'DRAMA KOREA 🎬',
    description: 'Nonton drakor terbaru & variety show Asia tanpa batas.',
    options: [
      { duration: '1 Bulan (Less Limit)', supplierPrice: 2000 },
      { duration: '3 Bulan (Less Limit)', supplierPrice: 6000 },
      { duration: '6 Bulan (Less Limit)', supplierPrice: 8000 },
      { duration: '1 Tahun (Less Limit)', supplierPrice: 10000 },
      { duration: '1 Bulan (Private Anti Limit)', supplierPrice: 3000 },
      { duration: '3 Bulan (Private Anti Limit)', supplierPrice: 7000 },
      { duration: '6 Bulan (Private Anti Limit)', supplierPrice: 9000 },
      { duration: '1 Tahun (Private Anti Limit)', supplierPrice: 11000 },
      { duration: 'Lifetime (Garansi 6 Bulan)', supplierPrice: 18000 },
    ],
    snk: ['Tersedia varian anti-limit bebas gangguan.'],
  },

  // --- CAPCUT PRO ---
  {
    id: 'capcut-pro',
    category: 'capcut',
    categoryLabel: 'CapCut Pro',
    title: 'CapCut Pro (PC & Mobile)',
    badge: 'EDIT VIDEO RARE 🎥',
    description: 'Buka efek pro, auto caption, & ekspor 4K tanpa watermark.',
    options: [
      { duration: '1 Minggu (Private)', supplierPrice: 14000 },
      { duration: '1 Bulan (Sharing 3U)', supplierPrice: 22000 },
      { duration: '1 Bulan (Private FullGar)', supplierPrice: 55000 },
    ],
    snk: ['Akun diprovide oleh seller.', 'Resiko sharing sering limit.', 'Garansi backfree only (bukan limit atau incorrect password).'],
  },

  // --- LOKLOK ---
  {
    id: 'loklok-vip',
    category: 'loklok',
    categoryLabel: 'Loklok',
    title: 'Loklok VIP (Sharing & Private)',
    badge: 'ANIME & DRAMA 📺',
    description: 'Streaming film, anime, & serial TV subtitle Indonesia.',
    options: [
      { duration: '1 Bulan (Sharing 3U)', supplierPrice: 17000 },
      { duration: '1 Bulan (Sharing Bisa TV)', supplierPrice: 21000 },
      { duration: '1 Bulan (Private Basic)', supplierPrice: 40000 },
      { duration: '1 Bulan (Private Standard Bisa TV)', supplierPrice: 57000 },
    ],
    snk: ['Tersedia opsi layar Smart TV.'],
  },

  // --- VIDIO ---
  {
    id: 'vidio-daily-mobile',
    category: 'vidio',
    categoryLabel: 'Vidio',
    title: 'Vidio Platinum Sharing Daily (Mobile)',
    badge: 'LIGA INGGRIS ⚽',
    description: 'Akses tayangan Platinum Vidio khusus perangkat HP / Tablet.',
    options: [
      { duration: '1 Hari', supplierPrice: 4500 },
      { duration: '1 Minggu', supplierPrice: 9500 },
    ],
    snk: ['Dilarang tukar plan jika kesalahan bukan dari seller.', 'Login hanya untuk 1 device.', 'Tanya dulu sebelum beli (no refund!).'],
  },
  {
    id: 'vidio-sharing-month',
    category: 'vidio',
    categoryLabel: 'Vidio',
    title: 'Vidio Platinum Sharing & Private',
    badge: 'BEST DEAL!',
    description: 'Pilihan berlangganan bulanan Vidio Platinum sharing & private.',
    options: [
      { duration: '1 Hari (Daily Pay TV)', supplierPrice: 2000 },
      { duration: '1 Minggu (Daily Pay TV)', supplierPrice: 4500 },
      { duration: '1 Bulan (Pay TV Only Sharing)', supplierPrice: 9000 },
      { duration: '1 Bulan (Mobile Sharing)', supplierPrice: 17000 },
      { duration: '1 Bulan (2U All Device Sharing)', supplierPrice: 25000 },
      { duration: '1 Bulan (Pay TV Private)', supplierPrice: 14000 },
      { duration: '1 Tahun (Pay TV Private)', supplierPrice: 20000 },
      { duration: '1 Bulan (Mobile Private)', supplierPrice: 28000 },
      { duration: '1 Bulan (All Device Private)', supplierPrice: 38000 },
    ],
    snk: ['Login per perangkat sesuai tipe langganan.'],
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
    snk: ['Sharing 6 User aktif.', 'Utamakan baca SNK sebelum pemesanan.'],
  },

  // --- HBO MAX ---
  {
    id: 'hbo-max',
    category: 'hbo',
    categoryLabel: 'HBO Max',
    title: 'HBO Max (Sharing & Private)',
    badge: 'HOLLYWOOD BLOCKBUSTER 🎬',
    description: 'Nonton serial eksklusif HBO, House of the Dragon, & film bioskop pilihan.',
    options: [
      { duration: '1 Hari (Sharing)', supplierPrice: 4000 },
      { duration: '1 Minggu (Sharing)', supplierPrice: 10000 },
      { duration: '1 Bulan (Standard Sharing)', supplierPrice: 18000 },
      { duration: '1 Bulan (Ultimate Sharing)', supplierPrice: 25000 },
      { duration: '1 Bulan (Standard Private)', supplierPrice: 61000 },
      { duration: '1 Bulan (Ultimate Private)', supplierPrice: 88000 },
    ],
    snk: ['Garansi penuh sesuai durasi langganan.'],
  },

  // --- CATCHPLAY & CRUNCHYROLL & ALIGHT & AMAZON PRIME ---
  {
    id: 'more-streaming-apps',
    category: 'streaming-others',
    categoryLabel: 'Streaming & Anime',
    title: 'Catchplay+, Crunchyroll, Alight & Amazon Prime',
    badge: 'SERI BERAGAM 🍿',
    description: 'Koleksi lengkap film bioskop, anime premium, Alight Motion, & Amazon Prime Video.',
    options: [
      { duration: 'Catchplay 1 Bulan (Sharing)', supplierPrice: 9000 },
      { duration: 'Catchplay 6 Bulan (Sharing)', supplierPrice: 12000 },
      { duration: 'Catchplay 1 Tahun (Sharing)', supplierPrice: 16000 },
      { duration: 'Crunchyroll 1 Bulan (Sharing)', supplierPrice: 9000 },
      { duration: 'Crunchyroll 1 Tahun (Sharing)', supplierPrice: 15000 },
      { duration: 'Alight Motion 1 Bulan (Sharing)', supplierPrice: 5000 },
      { duration: 'Alight Motion 1 Tahun (Sharing)', supplierPrice: 10000 },
      { duration: 'Alight Motion 1 Bulan (Private)', supplierPrice: 6000 },
      { duration: 'Alight Motion 1 Tahun (Private)', supplierPrice: 12000 },
      { duration: 'Amazon Prime 1 Minggu (Sharing)', supplierPrice: 5000 },
      { duration: 'Amazon Prime 1 Bulan 4U (Sharing)', supplierPrice: 7000 },
      { duration: 'Amazon Prime 1 Bulan 2U (Sharing)', supplierPrice: 10000 },
      { duration: 'Amazon Prime 1 Bulan (Private)', supplierPrice: 18000 },
    ],
    snk: ['Proses kilat & garansi aktif penuh.'],
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

      {/* Hero Section Header */}
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
              Katalog lengkap Netflix, Grammarly, Zoom, YouTube, Canva, Viu, Spotify, & puluhan aplikasi premium resmi termurah
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
                placeholder="Cari aplikasi premium (Netflix, Grammarly, Zoom, YouTube, Canva, Viu)..."
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

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 sm:gap-2 flex-wrap">
            {[
              { id: 'all', label: `Semua (${allProducts.length})` },
              { id: 'netflix', label: 'Netflix' },
              { id: 'youtube', label: 'YouTube' },
              { id: 'canva', label: 'Canva Pro' },
              { id: 'grammarly', label: 'Grammarly' },
              { id: 'quillbot', label: 'QuillBot' },
              { id: 'zoom', label: 'Zoom Pro' },
              { id: 'spotify', label: 'Spotify' },
              { id: 'viu', label: 'Viu' },
              { id: 'vidio', label: 'Vidio' },
              { id: 'disney', label: 'Disney+' },
              { id: 'hbo', label: 'HBO Max' },
              { id: 'loklok', label: 'Loklok' },
              { id: 'capcut', label: 'CapCut' },
              { id: 'office', label: 'MS365 / WPS' },
              { id: 'education', label: 'Edukasi' },
              { id: 'streaming-others', label: 'Lainnya' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-[#0F1E36] text-white border-[#0F1E36] shadow-sm'
                    : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
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
                  transition={{ delay: idx * 0.03, duration: 0.3 }}
                  className="flex flex-col justify-between rounded-2xl bg-white border border-gray-200 hover:border-primary-800/40 transition-all p-6 shadow-sm hover:shadow-md relative overflow-hidden group"
                >
                  {/* Top Badge */}
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
