'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  Globe, Monitor, ShoppingCart, BookMarked, GraduationCap, Database, Users, RefreshCw, Zap, ShieldCheck,
  Search, Filter, Code, ArrowLeft, Plus, Minus, Trash2, Clock, Check, ExternalLink, ChevronRight
} from 'lucide-react';
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
              <span>Konsultasi Gratis</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

const serviceCategories = [
  { id: 'all', label: 'Semua Layanan', icon: Filter },
  { id: 'web-umum', label: 'Jasa Web Umum', icon: Globe },
  { id: 'web-pendidikan', label: 'Web Pendidikan', icon: GraduationCap },
  { id: 'web-media', label: 'Web Media & Informasi', icon: BookMarked },
  { id: 'e-commerce', label: 'E-Commerce & Bisnis', icon: ShoppingCart },
  { id: 'maintenance', label: 'Optimasi & Pemeliharaan', icon: ShieldCheck }
];

const webServices = [
  // --- JASA WEB UMUM ---
  {
    id: 301,
    category: 'web-umum',
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
    id: 328,
    category: 'web-umum',
    subCategory: 'landing-umkm',
    name: 'Website Landing Page Profil Usaha Dagang (UMKM)',
    price: 'Rp 590.000',
    originalPrice: 'Rp 850.000',
    deliveryTime: '2 - 3 Hari Kerja',
    icon: Globe,
    badge: 'KHUSUS UMKM',
    desc: 'Landing page minimalis namun modern untuk memperkenalkan usaha dagang, toko kelontong, kafe, atau waralaba UMKM Anda agar mudah ditemukan di Google.',
    features: [
      '1 Halaman Utama Informatif & Responsif',
      'Daftar Menu Makanan/Katalog Produk Sederhana',
      'Tombol WhatsApp Hubungi Penjual & Google Maps',
      'Optimasi SEO Lokal (Google My Business Integration Guide)',
      'Integrasi Ulasan / Testimoni Pelanggan',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 307,
    category: 'web-umum',
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
    id: 302,
    category: 'web-umum',
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
    id: 329,
    category: 'web-umum',
    subCategory: 'portfolio-studio',
    name: 'Website Booking Layanan & Portfolio Kreatif (Studio/Agency)',
    price: 'Rp 1.650.000',
    originalPrice: 'Rp 2.400.000',
    deliveryTime: '4 - 7 Hari Kerja',
    icon: Monitor,
    badge: 'STUDIO & AGENCY',
    desc: 'Website elegan khusus untuk studio kreatif, agensi pemasaran, fotografer, atau penyedia jasa profesional dengan galeri karya & booking online.',
    features: [
      'Custom Halaman Portfolio / Hasil Karya Filterable',
      'Sistem Pemilihan Layanan & Pengaturan Slot Booking',
      'Halaman Profil Tim & Keahlian Masing-Masing',
      'Testimoni Slider & Integrasi Sosial Media Feed',
      'Optimasi Mobile & Kecepatan Akses Tinggi',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 318,
    category: 'web-umum',
    subCategory: 'sales-funnel',
    name: 'Website Landing Page Sales Funnel (Multi-Step)',
    price: 'Rp 950.000',
    originalPrice: 'Rp 1.400.000',
    deliveryTime: '3 - 5 Hari Kerja',
    icon: Globe,
    badge: 'FUNNEL SALES',
    desc: 'Sistem landing page multi-step terstruktur (Landing Page -> Checkout Page -> Thank You Page) untuk mengoptimalkan penjualan produk digital/fisik Anda.',
    features: [
      'Multi-Step Pages (Sales, Checkout, Thank You)',
      'Order Bump & Upsell/Downsell Setup',
      'Integrasi Formulir Data Customer & WhatsApp',
      'Pixel Tracking (Facebook, Google, TikTok)',
      'Optimasi Copywriting Menjual',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 308,
    category: 'web-umum',
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
    id: 319,
    category: 'web-umum',
    subCategory: 'job-board',
    name: 'Website Portal Lowongan Kerja (Job Board)',
    price: 'Rp 2.900.000',
    originalPrice: 'Rp 4.000.000',
    deliveryTime: '7 - 12 Hari Kerja',
    icon: Users,
    badge: 'LOWONGAN KERJA',
    desc: 'Portal website lowongan kerja untuk mempertemukan perusahaan yang mencari pekerja dengan para pencari kerja (job seekers).',
    features: [
      'Sistem Registrasi Perusahaan & Pencari Kerja',
      'Dashboard Pasang Lowongan & Unggah CV/Resume',
      'Fitur Filter Pencarian Kerja Berdasarkan Lokasi & Gaji',
      'Sistem Bookmark Lowongan & Kirim Lamaran Instant',
      'Dashboard Admin untuk Kurasi & Approval Postingan',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 306,
    category: 'web-umum',
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

  // --- WEB PENDIDIKAN ---
  {
    id: 305,
    category: 'web-pendidikan',
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
    id: 320,
    category: 'web-pendidikan',
    subCategory: 'pesantren-yayasan',
    name: 'Website Portal Pondok Pesantren / Yayasan',
    price: 'Rp 2.200.000',
    originalPrice: 'Rp 3.200.000',
    deliveryTime: '6 - 10 Hari Kerja',
    icon: GraduationCap,
    badge: 'PORTAL YAYASAN',
    desc: 'Website khusus pondok pesantren, panti asuhan, atau yayasan keagamaan/sosial dengan fitur donasi online dan info kegiatan.',
    features: [
      'Profil Lengkap, Visi-Misi, & Sejarah Yayasan',
      'Formulir Pendaftaran Santri Baru / Donatur',
      'Integrasi Donasi Online (Transfer Bank / Midtrans)',
      'Laporan Transparansi Dana Masuk & Keluar',
      'Galeri Dokumentasi Kegiatan & Pengumuman',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 330,
    category: 'web-pendidikan',
    subCategory: 'pondok-tahfidz',
    name: 'Website Profil Pondok Tahfidz & Donasi Al-Qur\'an',
    price: 'Rp 1.850.000',
    originalPrice: 'Rp 2.600.000',
    deliveryTime: '5 - 8 Hari Kerja',
    icon: GraduationCap,
    badge: 'TAHFIDZ & DONASI',
    desc: 'Website profil pondok tahfidz Qur\'an atau rumah yatim dengan fitur donasi program pembangunan, beras santri, atau sedekah online.',
    features: [
      'Halaman Program Pembinaan & Kegiatan Harian',
      'Fitur Laporan Perkembangan Hafalan Santri',
      'Formulir Pendaftaran Program Tahfidz/Donasi',
      'Integrasi Pembayaran Donasi via Transfer/QRIS',
      'Laporan Penggunaan Dana Donasi Transparan',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 312,
    category: 'web-pendidikan',
    subCategory: 'bimbel',
    name: 'Website Bimbel & Kursus Private',
    price: 'Rp 1.950.000',
    originalPrice: 'Rp 2.800.000',
    deliveryTime: '5 - 10 Hari Kerja',
    icon: GraduationCap,
    badge: 'BIMBEL DIGITAL',
    desc: 'Website promosi lembaga bimbingan belajar atau kursus privat lengkap dengan jadwal kelas dan form pendaftaran.',
    features: [
      'Profil Mentor/Tentor & Pilihan Paket Belajar',
      'Jadwal Kelas & Form Booking Slot Jadwal Belajar',
      'Integrasi Kontak Pengajar Langsung ke WhatsApp',
      'Galeri Testimoni Siswa & Galeri Foto Kegiatan',
      'Optimasi Landing Page Konversi Pendaftaran Tinggi',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 321,
    category: 'web-pendidikan',
    subCategory: 'perpustakaan-digital',
    name: 'Website Perpustakaan Digital (Digital Library)',
    price: 'Rp 2.750.000',
    originalPrice: 'Rp 3.800.000',
    deliveryTime: '7 - 12 Hari Kerja',
    icon: BookMarked,
    badge: 'PERPUSTAKAAN',
    desc: 'Website katalog buku perpustakaan sekolah/lembaga lengkap dengan sistem peminjaman, pencarian buku, dan denda keterlambatan.',
    features: [
      'Katalog Buku Lengkap dengan Kategori & Penulis',
      'Sistem Cari Buku & Cek Ketersediaan Stok Fisik',
      'Sistem Peminjaman & Pengembalian Buku Anggota',
      'Hitung Denda Otomatis Terlambat Pengembalian',
      'Dashboard Statistik Peminjaman Buku Terpopuler',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 311,
    category: 'web-pendidikan',
    subCategory: 'e-learning',
    name: 'Website E-Learning & LMS (Learning System)',
    price: 'Rp 4.950.000',
    originalPrice: 'Rp 7.000.000',
    deliveryTime: '10 - 20 Hari Kerja',
    icon: GraduationCap,
    badge: 'KELAS ONLINE',
    desc: 'Platform pembelajaran online lengkap dengan fitur upload materi video/pdf, kuis interaktif, pengerjaan tugas, dan manajemen nilai siswa.',
    features: [
      'Sistem Manajemen Kelas & Kursus Unlimited',
      'Upload Materi Video, PDF, & File Pendukung',
      'Kuis Pilihan Ganda & Tugas dengan Nilai Otomatis',
      'Dashboard Guru, Siswa, & Administrator',
      'Sertifikat Kelulusan Otomatis setelah Kelas Selesai',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },

  // --- WEB MEDIA & INFORMASI ---
  {
    id: 304,
    category: 'web-media',
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
    id: 322,
    category: 'web-media',
    subCategory: 'blog-personal',
    name: 'Website Blog Personal / Portfolio Penulis',
    price: 'Rp 690.000',
    originalPrice: 'Rp 990.000',
    deliveryTime: '2 - 4 Hari Kerja',
    icon: BookMarked,
    badge: 'BLOG CREATOR',
    desc: 'Website blog personal minimalis modern bagi influencer, penulis, kolumnis, atau pehobi yang ingin membagikan artikel secara profesional.',
    features: [
      'Desain Blog Estetis berfokus pada Keterbacaan Teks',
      'Kategori Artikel, Tagging, & Kolom Pencarian',
      'Integrasi Newsletter (Mailchimp / Substack)',
      'Fitur Share Otomatis ke Sosial Media',
      'SEO Friendly & Adsense Ready Template',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 314,
    category: 'web-media',
    subCategory: 'event',
    name: 'Website Landing Page Event & Registrasi',
    price: 'Rp 850.000',
    originalPrice: 'Rp 1.300.000',
    deliveryTime: '3 - 5 Hari Kerja',
    icon: Globe,
    badge: 'EVENT ONLINE',
    desc: 'Halaman informasi khusus event, webinar, seminar, atau konser lengkap dengan tiket digital dan form registrasi online.',
    features: [
      'Informasi Jadwal, Rundown, & Pembicara/Guest Star',
      'Formulir Pendaftaran & Pengiriman Tiket ke Email/WA',
      'Integrasi Sistem Scan QR Code Tiket Masuk',
      'Hitung Mundur Acara (Countdown Timer) Dinamis',
      'Optimasi Landing Page Konversi Kehadiran',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 331,
    category: 'web-media',
    subCategory: 'komunitas-hobi',
    name: 'Website Portal Komunitas Hobi / Fanspage',
    price: 'Rp 1.350.000',
    originalPrice: 'Rp 1.950.000',
    deliveryTime: '4 - 6 Hari Kerja',
    icon: BookMarked,
    badge: 'HOBI & KOMUNITAS',
    desc: 'Website khusus wadah informasi komunitas hobi seperti otomotif, game, olahraga, fotografi, atau kesenian untuk berbagi tips & artikel.',
    features: [
      'Sistem Artikel Blog dengan Multi-Kategori Hobi',
      'Galeri Foto & Video Hasil Kegiatan Komunitas',
      'Formulir Pendaftaran Anggota Baru',
      'Kalender Jadwal Kumpul/Event Komunitas Mendatang',
      'Integrasi Sosial Media Komunitas (Instagram & YouTube)',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 323,
    category: 'web-media',
    subCategory: 'directory-listing',
    name: 'Website Directory / Yellow Pages Lokal',
    price: 'Rp 2.450.000',
    originalPrice: 'Rp 3.500.000',
    deliveryTime: '6 - 10 Hari Kerja',
    icon: Globe,
    badge: 'DIREKTORI BISNIS',
    desc: 'Website direktori listing bisnis lokal, tempat wisata, kuliner, atau ulasan jasa terdekat di kota Anda.',
    features: [
      'Sistem Pengajuan Listing Tempat / Bisnis Baru',
      'Peta Lokasi Google Maps Terintegrasi',
      'Fitur Rating & Review Pengunjung',
      'Filter Cari Berdasarkan Kategori & Jarak',
      'Form Kontak Owner Tempat via WhatsApp',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 313,
    category: 'web-media',
    subCategory: 'forum',
    name: 'Website Forum Komunitas & Diskusi',
    price: 'Rp 3.200.000',
    originalPrice: 'Rp 4.500.000',
    deliveryTime: '7 - 14 Hari Kerja',
    icon: BookMarked,
    badge: 'KOMUNITAS DIGITAL',
    desc: 'Platform website forum diskusi seperti Kaskus atau Reddit untuk wadah komunikasi anggota komunitas Anda.',
    features: [
      'Sistem Registrasi Anggota & Profil Pengguna Custom',
      'Pembuatan Thread Diskusi, Kategori, & Sistem Tagging',
      'Fitur Upvote/Downvote, Reply, & Komentar Real-time',
      'Sistem Moderasi Anggota & Penalti/Banned',
      'Notifikasi Email / Web Push untuk Diskusi Aktif',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },

  // --- E-COMMERCE & BISNIS ---
  {
    id: 315,
    category: 'e-commerce',
    subCategory: 'landing-produk',
    name: 'Website Landing Page Produk (Sales Page)',
    price: 'Rp 790.000',
    originalPrice: 'Rp 1.200.000',
    deliveryTime: '2 - 4 Hari Kerja',
    icon: ShoppingCart,
    badge: 'KONVERSI TINGGI',
    desc: 'Landing page dengan fokus tinggi pada konversi penjualan satu product unggulan Anda, lengkap dengan checkout WhatsApp.',
    features: [
      'Desain Psikologi Penjualan (AIDA framework)',
      'Section Manfaat Produk, Galeri, & Detail Spesifikasi',
      'Fitur Testimoni Pembeli & F.A.Q Section',
      'Tombol Call-to-Action (CTA) Mengambang',
      'Integrasi WhatsApp Order Form & Pixel Tracking',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 332,
    category: 'e-commerce',
    subCategory: 'digital-product',
    name: 'Website E-Commerce Produk Digital (SaaS / E-Book)',
    price: 'Rp 1.950.000',
    originalPrice: 'Rp 2.800.000',
    deliveryTime: '4 - 7 Hari Kerja',
    icon: ShoppingCart,
    badge: 'PRODUK DIGITAL',
    desc: 'Website toko online khusus menjual produk digital seperti e-book, lisensi software, template desain, atau aset digital dengan download instan.',
    features: [
      'Katalog Downloadable Products dengan Link Unduh Aman',
      'Integrasi Sistem Pembayaran Otomatis (Midtrans/QRIS)',
      'Pengiriman Tautan Download Otomatis via Email setelah Sukses',
      'Sistem Proteksi Link Download dari Pembajakan',
      'Dashboard Riwayat Pembelian & Profil Pembeli',
      'Setup & Deploy ke Cloud (Belum termasuk cloud hosting/domain)'
    ]
  },
  {
    id: 316,
    category: 'e-commerce',
    subCategory: 'booking-system',
    name: 'Website Sistem Booking & Reservasi',
    price: 'Rp 2.200.000',
    originalPrice: 'Rp 3.000.000',
    deliveryTime: '5 - 9 Hari Kerja',
    icon: Monitor,
    badge: 'SYSTEM BOOKING',
    desc: 'Website pemesanan jasa, reservasi meja restoran, klinik kecantikan, hotel, atau penyewaan kendaraan online.',
    features: [
      'Kalender Pemilihan Tanggal & Jam Reservasi',
      'Sistem Manajemen Kuota/Ketersediaan Otomatis',
      'Pembayaran DP atau Full Terintegrasi',
      'Pengiriman Konfirmasi Reservasi Otomatis via WA/Email',
      'Dashboard Kelola Jadwal Booking & Customer',
      'Setup & Deploy ke Hosting (Belum termasuk hosting/domain)'
    ]
  },
  {
    id: 325,
    category: 'e-commerce',
    subCategory: 'realestate-developer',
    name: 'Website Developer / Real Estate Properti',
    price: 'Rp 2.800.000',
    originalPrice: 'Rp 4.000.000',
    deliveryTime: '6 - 10 Hari Kerja',
    icon: Monitor,
    badge: 'PROPERTY PRO',
    desc: 'Website katalog properti, perumahan, atau apartemen untuk developer real estate dan agen properti independen.',
    features: [
      'Listing Properti Aktif dengan Kategori Jual/Sewa',
      'Spesifikasi Properti Lengkap (Kamar Tidur, Luas Tanah, dll)',
      'Galeri Foto/Video Properti & 3D Virtual Tour Link',
      'Form Booking Survei Lokasi Terkoneksi WhatsApp',
      'Filter Pencarian Harga, Tipe, & Lokasi Properti',
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
    id: 324,
    category: 'e-commerce',
    subCategory: 'multivendor',
    name: 'Website E-Commerce Multi-Vendor (Marketplace)',
    price: 'Rp 8.500.000',
    originalPrice: 'Rp 12.000.000',
    deliveryTime: '15 - 25 Hari Kerja',
    icon: ShoppingCart,
    badge: 'MULTI-VENDOR',
    desc: 'Platform marketplace seperti Tokopedia atau Shopee skala mikro, di mana vendor lain dapat mendaftar dan menjual produk mereka.',
    features: [
      'Dashboard Khusus Penjual (Vendor Panel) & Pembeli',
      'Sistem Bagi Hasil & Komisi Platform Otomatis',
      'Hitung Ongkir Otomatis Multi-Alamat Vendor',
      'Sistem Penarikan Dana (Withdrawal) Vendor',
      'Fitur Chat Penjual-Pembeli & Ulasan Produk',
      'Setup & Deploy ke Cloud (Belum termasuk cloud hosting/domain)'
    ]
  },

  // --- OPTIMASI & PEMELIHARAAN ---
  {
    id: 309,
    category: 'maintenance',
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
  },
  {
    id: 317,
    category: 'maintenance',
    subCategory: 'migrasi-vps',
    name: 'Jasa Migrasi Server & Setup VPS',
    price: 'Rp 600.000',
    originalPrice: 'Rp 950.000',
    deliveryTime: '1 - 3 Hari Kerja',
    icon: Database,
    badge: 'MIGRASI AMAN',
    desc: 'Layanan pemindahan data website dari hosting lama ke hosting baru atau setup server VPS dedicated untuk performa tinggi.',
    features: [
      'Migrasi File Website & Database Tanpa Downtime',
      'Setup Server VPS (Ubuntu/CentOS) dengan Panel Kontrol',
      'Optimasi Caching Server & Keamanan Firewalls',
      'Konfigurasi Name Server & DNS Records',
      'Pemasangan SSL Gratis (Let\'s Encrypt)',
      'Pengujian Hasil Migrasi Kompatibilitas Versi PHP'
    ]
  },
  {
    id: 327,
    category: 'maintenance',
    subCategory: 'payment-integration',
    name: 'Jasa Integrasi Payment Gateway',
    price: 'Rp 700.000',
    originalPrice: 'Rp 1.200.000',
    deliveryTime: '2 - 4 Hari Kerja',
    icon: Zap,
    badge: 'PAYMENT GATEWAY',
    desc: 'Integrasi gerbang pembayaran otomatis ke website Anda agar bisa menerima bayaran via e-wallet, QRIS, transfer bank, dan kartu kredit.',
    features: [
      'Pemasangan API Midtrans, Xendit, atau Doku',
      'Konfigurasi Callback / Notification Payment',
      'Pengujian Transaksi Sandbox & Live Mode',
      'Setup Invoice Otomatis Pasca Pembayaran Sukses',
      'Keamanan Enkripsi Transaksi SSL'
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
                            : 'bg-gray-55 hover:bg-gray-100 text-gray-800 border border-gray-200'
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
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-955"
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
