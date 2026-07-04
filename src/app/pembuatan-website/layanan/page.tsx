'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Monitor, ShoppingCart, BookMarked, GraduationCap,
  Database, Users, RefreshCw, Zap, ShieldCheck, ArrowRight,
  ArrowLeft, Search, Filter, Check, Clock, Phone, Code
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import WhatsAppFloat from '@/components/WhatsAppFloat';

interface LocalNavbarProps {
  onExit: (e: React.MouseEvent) => void;
}

function LocalNavbar({ onExit }: LocalNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            {/* Standard Yellow Back Button with Divider */}
            <Link
              href="/"
              onClick={onExit}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors mr-2 border-r border-gray-200 pr-4"
              title="Kembali ke SOOBIN Services"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Link>

            <Link href="/pembuatan-website" className="flex items-center gap-2">
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
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/pembuatan-website/layanan" className="text-sm font-bold text-amber-500 transition-colors">
              Layanan
            </Link>
            <Link href="/pembuatan-website#features" className="text-sm font-semibold text-gray-600 hover:text-amber-500 transition-colors">
              Keunggulan
            </Link>
            <Link href="/pembuatan-website/portofolio" className="text-sm font-semibold text-gray-600 hover:text-amber-500 transition-colors">
              Portofolio
            </Link>
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

const serviceCategories = [
  { id: 'all', label: 'Semua Layanan', icon: Filter },
  { id: 'development', label: 'Web Development', icon: Code },
  { id: 'design-profile', label: 'Company Profile & Personal', icon: Users },
  { id: 'e-commerce', label: 'E-Commerce / Toko Online', icon: ShoppingCart },
  { id: 'optimization-seo', label: 'Optimasi & SEO', icon: Zap },
  { id: 'maintenance', label: 'Pemeliharaan / Bug Fix', icon: ShieldCheck }
];

const webServices = [
  {
    id: 301,
    category: 'development',
    subCategory: 'landing-page',
    name: 'Website Landing Page (Single Page)',
    price: 'Rp 650.000',
    originalPrice: 'Rp 950.000',
    deliveryTime: '2 - 3 Hari Kerja',
    icon: Globe,
    badge: 'MOST POPULAR',
    desc: 'Website satu halaman super cepat & konversif tinggi untuk mempromosikan produk, jasa, personal branding, atau event khusus Anda.',
    features: [
      'Desain Premium & Responsive (Mobile Friendly)',
      '1 Halaman Utama Lengkap + Kontak WA',
      'Integrasi Formulir Pemesanan',
      'Integrasi Link Sosial Media & WhatsApp Chat',
      'Optimasi SEO Dasar & Kecepatan Google PageSpeed',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 302,
    category: 'design-profile',
    subCategory: 'company-profile',
    name: 'Website Company Profile Profesional',
    price: 'Rp 1.450.000',
    originalPrice: 'Rp 2.000.000',
    deliveryTime: '4 - 6 Hari Kerja',
    icon: Monitor,
    badge: 'REKOMENDASI BISNIS',
    desc: 'Website representatif dan interaktif untuk mengenalkan profile usaha, visi-misi, keunggulan produk/layanan, portofolio, dan kontak resmi bisnis Anda.',
    features: [
      'Hingga 5 Halaman Dinamis (Home, About, Services, Gallery, Contact)',
      'Custom Layout Mewah & Elegan',
      'Integrasi Google Maps Lokasi & Hubungi WhatsApp',
      'Optimasi Kecepatan & Responsif Mobile',
      'Sistem Artikel Blog / Berita Usaha',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 303,
    category: 'e-commerce',
    subCategory: 'ecommerce',
    name: 'Website Toko Online (E-Commerce)',
    price: 'Rp 2.950.000',
    originalPrice: 'Rp 4.000.000',
    deliveryTime: '7 - 10 Hari Kerja',
    icon: ShoppingCart,
    badge: 'TOKO DIGITAL',
    desc: 'Website toko online profesional lengkap dengan keranjang belanja, integrasi ongkos kirim otomatis, diskon kupon, dan invoice order otomatis.',
    features: [
      'Katalog Produk Tanpa Batas (Unlimited Products)',
      'Keranjang Belanja & Form Checkout Rapi',
      'Hitung Ongkir Otomatis (Integrasi RajaOngkir seluruh kurir)',
      'Integrasi Metode Pembayaran (WhatsApp Pay / Midtrans Gateway)',
      'Dashboard Admin Kelola Orderan & Stok Produk',
      'Setup & Deploy ke Cloud (Belum termasuk cloud hosting/domain)'
    ]
  },
  {
    id: 304,
    category: 'development',
    subCategory: 'portal-berita',
    name: 'Website Portal Berita / Media Informasi',
    price: 'Rp 2.500.000',
    originalPrice: 'Rp 3.500.000',
    deliveryTime: '7 - 12 Hari Kerja',
    icon: BookMarked,
    badge: 'MEDIA INFORMASI',
    desc: 'Website portal informasi berita, opini, artikel, atau majalah digital yang dioptimasi untuk trafik tinggi dan Google Adsense.',
    features: [
      'Sistem Multi-Kategori & Tag Berita Rapi',
      'Fitur Penulis/Kontributor Multi-User',
      'Kolom Penempatan Iklan Strategis (Adsense ready)',
      'Fitur Newsletter & Berlangganan Email',
      'Optimasi SEO AMP Page & Kecepatan Akses',
      'Setup & Deploy ke Cloud (Belum termasuk cloud hosting/domain)'
    ]
  },
  {
    id: 305,
    category: 'development',
    subCategory: 'edukasi',
    name: 'Website Portal Sekolah / Lembaga Pendidikan',
    price: 'Rp 2.500.000',
    originalPrice: 'Rp 3.500.000',
    deliveryTime: '7 - 14 Hari Kerja',
    icon: GraduationCap,
    badge: 'PORTAL PENDIDIKAN',
    desc: 'Website resmi sekolah, universitas, atau yayasan bimbingan belajar dengan fitur pengumuman nilai, data guru/siswa, & pendaftaran siswa baru.',
    features: [
      'Profil Sekolah, Visi-Misi, & Struktur Organisasi',
      'PPDB Online (Penerimaan Peserta Didik Baru)',
      'Galeri Prestasi, Pengumuman, & Kegiatan Sekolah',
      'Optimasi SEO & Kecepatan Website',
      'Data Guru, Staff, & Fasilitas Pendidikan',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 306,
    category: 'development',
    subCategory: 'custom-app',
    name: 'Website Custom Web App (SaaS / Sistem Informasi)',
    price: 'Rp 9.950.000',
    originalPrice: 'Rp 14.500.000',
    deliveryTime: '21 - 30 Hari Kerja',
    icon: Database,
    badge: 'SISTEM KUSTOM',
    desc: 'Sistem aplikasi berbasis web custom untuk kebutuhan spesifik perusahaan Anda seperti Sistem Inventory, ERP, CRM, HRIS, atau Sistem Antrean.',
    features: [
      'Custom Database & Skema Relasional (PostgreSQL/MySQL)',
      'Sistem Multi-User dengan Hak Akses (RBAC)',
      'Fitur Laporan Penjualan/Stok & Export PDF/Excel',
      'Arsitektur Next.js / NestJS Modern & Aman',
      'PWA (Progressive Web App) Bisa Install di HP',
      'Setup & Deploy (Belum termasuk cloud server dedicated)'
    ]
  },
  {
    id: 307,
    category: 'design-profile',
    subCategory: 'personal',
    name: 'Website Portofolio Pribadi (Personal Brand)',
    price: 'Rp 550.000',
    originalPrice: 'Rp 800.000',
    deliveryTime: '2 - 3 Hari Kerja',
    icon: Users,
    badge: 'PERSONAL BRAND',
    desc: 'Website portofolio interaktif untuk memamerkan resume, riwayat kerja, riwayat edukasi, keahlian, dan hasil karya kreatif Anda untuk melamar kerja/freelance.',
    features: [
      'Desain Minimalis Elegan & Kreatif',
      'Interactive Resume & CV Downloadable',
      'Galeri Portofolio Hasil Karya Terstruktur',
      'Form Kontak Langsung Masuk ke Email/WhatsApp',
      'Integrasi Link Sosial Media',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 308,
    category: 'design-profile',
    subCategory: 'redesign',
    name: 'Jasa Redesain / Upgrade Website Lama',
    price: 'Rp 950.000',
    originalPrice: 'Rp 1.400.000',
    deliveryTime: '4 - 7 Hari Kerja',
    icon: RefreshCw,
    badge: 'TAMPILAN BARU',
    desc: 'Ubah tampilan website lama Anda menjadi jauh lebih modern, elegan, responsif, berkecepatan tinggi, dan ramah pengguna (user-friendly).',
    features: [
      'Analisis Komprehensif Desain & Struktur Lama',
      'Redesain UI/UX Modern & Khas Brand Anda',
      'Peningkatan Kecepatan Load Drastis',
      'Migrasi Data & Aset Lama Tanpa Takut Hilang',
      'Optimasi SEO On-Page Ulang',
      'Penyesuaian Skema Warna Premium'
    ]
  },
  {
    id: 309,
    category: 'optimization-seo',
    subCategory: 'seo-optimization',
    name: 'Jasa Optimasi Kecepatan & SEO Website',
    price: 'Rp 750.000',
    originalPrice: 'Rp 1.100.000',
    deliveryTime: '3 - 5 Hari Kerja',
    icon: Zap,
    badge: 'PAGESPEED 90+',
    desc: 'Optimasi performa kecepatan loading website (Core Web Vitals Google) dan pengaturan SEO On-page agar masuk halaman pertama Google.',
    features: [
      'Skor Google PageSpeed 90+ (Mobile & Desktop)',
      'Optimasi Gambar (WebP), Caching, & Minify Code',
      'Riset Kata Kunci Terarah Kompetitor Bisnis Anda',
      'Penyusunan Struktur Meta Title, Description, & Alt Image',
      'Perbaikan Error di Google Search Console',
      'Setup Sitemap XML & Robots.txt Otomatis'
    ]
  },
  {
    id: 310,
    category: 'maintenance',
    subCategory: 'maintenance',
    name: 'Layanan Pemeliharaan Website Bulanan',
    price: 'Rp 290.000/Bulan',
    originalPrice: 'Rp 400.000',
    deliveryTime: 'Pemeliharaan Rutin Bulanan',
    icon: ShieldCheck,
    badge: 'GARANSI AMAN',
    desc: 'Layanan pemeliharaan berkala untuk menjaga website Anda tetap aman dari malware/hacker, backup berkala, dan update konten cepat.',
    features: [
      'Backup Database & File Mingguan',
      'Update Rutin Tema, Plugin, & CMS Core',
      'Security Monitoring & Pencegahan Serangan Hack',
      'Penyelesaian Masalah Bug/Error Secara Cepat',
      'Bantuan Update/Edit Konten Ringan (5x / Bulan)',
      'Laporan Bulanan Performa Website'
    ]
  }
];

export default function LayananPembuatanWebsite() {
  const { addToCart, placeDirectOrder } = useCart();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredServices = webServices.filter(service => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 pt-28 pb-16 font-sans selection:bg-amber-400 selection:text-black">
      
      {/* Local Custom Navbar */}
      <LocalNavbar onExit={handleExit} />

      {/* Hero Header Section */}
      <div className="bg-linear-to-b from-amber-50/70 via-white to-slate-50 text-gray-800 py-16 relative overflow-hidden border-b border-amber-105">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.08),transparent_60%)]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-amber-400 bg-amber-400/10 rounded-full px-3.5 py-1 uppercase tracking-widest border border-amber-400/20"
          >
            Layanan Pembuatan Website & Pengembangan Digital
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black mt-4 tracking-tight leading-tight text-gray-900"
          >
            Pilihan Layanan Web <span className="text-amber-500">JAR.DEV</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-3xl mx-auto mt-4 text-sm sm:text-base leading-relaxed"
          >
            Daftar paket jasa pembuatan website profesional terlengkap di Indonesia. 
            Semua proses dikerjakan langsung menggunakan MacBook Air M2 berkecepatan tinggi dengan jaminan kualitas kode bersih, SEO-friendly, dan gratis konsultasi.
            <span className="block mt-2 font-bold text-amber-600 text-xs sm:text-sm">*Catatan: Semua harga di bawah belum termasuk biaya sewa domain, hosting, atau cloud (disediakan oleh klien).</span>
          </motion.p>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200/80 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Cari jenis website atau optimasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-450 focus:border-transparent transition-all text-sm font-semibold"
            />
          </div>

          {/* Categories Horizontal Scroller */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin scrollbar-thumb-gray-200">
            {serviceCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                      : 'bg-gray-55/80 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Services Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => {
              const ServiceIcon = service.icon;
              const isPopular = service.badge === 'MOST POPULAR';
              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`relative rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 group bg-white ${
                    isPopular 
                      ? 'border-amber-400 shadow-[0_10px_35px_rgba(245,158,11,0.08)] ring-1 ring-amber-400/20'
                      : 'border-gray-200 hover:border-amber-400/50 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Header: Icon & Cart Add Button */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                          <ServiceIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">
                          {service.name.includes('Website') ? service.name.replace('Website ', '') : service.name}
                        </h3>
                      </div>
                      
                      {/* Cart Icon button for logged-in Member */}
                      {user && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart({
                              id: service.id,
                              name: service.name,
                              price: service.price,
                              category: 'pembuatan-website'
                            });
                          }}
                          className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-amber-50 text-gray-500 hover:text-amber-500 transition-all cursor-pointer"
                          title="Tambah ke Keranjang"
                        >
                          <ShoppingCart className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>

                    {/* Badge */}
                    {service.badge && (
                      <span className="inline-block mb-4 text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1 uppercase tracking-wider">
                        {service.badge}
                      </span>
                    )}

                    {/* Price Block */}
                    <div className="mt-2">
                      <span className="text-4xl font-extrabold text-gray-900">{service.price}</span>
                      <p className="text-xs text-gray-500 mt-1.5 font-medium leading-relaxed flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Estimasi: {service.deliveryTime}</span>
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm font-semibold text-gray-700 mt-6 mb-4">
                      {service.desc}
                    </p>

                    {/* Detailed Features List */}
                    <ul className="flex flex-col gap-3.5 border-t border-gray-100 pt-5 mt-4">
                      {service.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 font-medium">
                          <div className="w-5 h-5 rounded-md bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100 shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 text-amber-500" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="mt-8">
                    {/* Action buttons */}
                    <div className="grid grid-cols-1 gap-2">
                      <a
                        href={`https://wa.me/6287815797525?text=Halo%20JAR.DEV%2C%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(service.name)}%20berharga%20${encodeURIComponent(service.price)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => placeDirectOrder(service.name)}
                        className={`w-full py-3.5 rounded-2xl text-center text-sm font-bold transition-all duration-300 block ${
                          isPopular
                            ? 'bg-amber-400 hover:bg-amber-350 text-black shadow-lg shadow-amber-400/20'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
                        }`}
                      >
                        Pesan Sekarang
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-200 mt-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-800 mt-4">Layanan Tidak Ditemukan</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
              Maaf, kata kunci "{searchQuery}" tidak cocok dengan nama atau keterangan layanan kami. Silakan coba pencarian lain.
            </p>
          </div>
        )}
      </div>

      {/* Floating WhatsApp and Scroll to Top */}
      <WhatsAppFloat />

      <AnimatePresence>
        {isExitingToSoobin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950"
          >
            {/* Wifi Loader - Golden Yellow Version */}
            <div
              id="wifi-loader"
              className="scale-125"
              style={{
                ['--front-color' as any]: '#facc15',
                ['--back-color' as any]: 'rgba(250, 204, 21, 0.2)'
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
