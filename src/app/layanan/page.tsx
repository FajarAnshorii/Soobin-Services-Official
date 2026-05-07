'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion, useInView } from 'framer-motion';
import {
  FileCheck, RefreshCw, Pen, Unlock, GraduationCap, Code,
  Calculator, Languages, BookOpen, Presentation, Database,
  FileSpreadsheet, Globe, Star, Filter, Search,
  Target, BookMarked, FlaskConical, Route, ChevronLeft, ChevronRight,
  ClipboardList, BarChart, School, Share2, Image, Monitor, MonitorCheck,
  ArrowUp
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'Semua', icon: Filter },
  { id: 'turnitin', label: 'Cek Turnitin & AI', icon: FileCheck },
  { id: 'parafrase', label: 'Parafrase', icon: RefreshCw },
  { id: 'joki-tugas', label: 'Joki Tugas', icon: Pen },
  { id: 'joki-skripsi', label: 'Joki Skripsi', icon: GraduationCap },
  { id: 'uji-data', label: 'Uji Data', icon: BarChart },
  { id: 'tugas-sekolah', label: 'Tugas Sekolah', icon: School },
  { id: 'unlock', label: 'Unlock', icon: Unlock },
  { id: 'umum', label: 'Umum', icon: Globe },
  { id: 'medsos', label: 'Media Sosial', icon: Share2 },
  { id: 'desain', label: 'Desain Grafis', icon: Image },
  { id: 'digital', label: 'Digital & Online', icon: Monitor },
  { id: 'uiux', label: 'UI/UX Design', icon: MonitorCheck },
];

const services = [
  { id: 1, category: 'turnitin', name: 'Cek Turnitin 1x', price: 'Rp 4.000', icon: FileCheck, badge: null },
  { id: 2, category: 'turnitin', name: 'Cek Turnitin 3x', price: 'Rp 12.000', icon: FileCheck, badge: 'Hemat!' },
  { id: 3, category: 'turnitin', name: 'Cek Turnitin 6x', price: 'Rp 24.000', icon: FileCheck, badge: 'Best Deal!' },
  { id: 4, category: 'turnitin', name: 'Cek AI 1x', price: 'Rp 5.000', icon: FileCheck, badge: null },
  { id: 5, category: 'turnitin', name: 'Cek AI 2x', price: 'Rp 10.000', icon: FileCheck, badge: null },
  { id: 6, category: 'parafrase', name: 'Parafrase Dokumen', price: 'Rp 2.000/Hal', icon: RefreshCw, badge: null },
  { id: 7, category: 'joki-tugas', name: 'Translate Grammar', price: 'Rp 2.000/Hal', icon: Languages, badge: null },
  { id: 8, category: 'joki-tugas', name: 'Daftar Pustaka', price: 'Rp 1.000/Sumber', icon: BookOpen, badge: null },
  { id: 9, category: 'joki-tugas', name: 'Pembuatan PPT', price: 'Rp 3.000/Hal', icon: Presentation, badge: null },
  { id: 10, category: 'joki-tugas', name: 'Daftar Isi Otomatis', price: 'Rp 10.000', icon: Calculator, badge: null },
  { id: 11, category: 'joki-tugas', name: 'Pengetikan File', price: 'Rp 1.000/Hal', icon: Pen, badge: null },
  { id: 12, category: 'joki-tugas', name: 'Olah Data SPSS', price: 'Chat Admin', icon: Database, badge: null },
  { id: 13, category: 'joki-tugas', name: 'Olah Data Eviews', price: 'Chat Admin', icon: FileSpreadsheet, badge: null },
  { id: 14, category: 'joki-tugas', name: 'Olah Data Python', price: 'Chat Admin', icon: Code, badge: null },
  { id: 15, category: 'joki-tugas', name: 'Review Jurnal', price: 'Rp 25.000/Review', icon: BookOpen, badge: null },
  { id: 16, category: 'joki-tugas', name: 'Joki Makalah', price: 'Start Rp 40.000', icon: Pen, badge: null },
  { id: 17, category: 'joki-tugas', name: 'Joki Mendeley', price: 'Rp 1.000/Sumber', icon: BookOpen, badge: null },
  { id: 18, category: 'joki-tugas', name: 'Joki Artikel', price: 'Start Rp 50.000', icon: Pen, badge: null },
  { id: 19, category: 'joki-tugas', name: 'Joki Jurnal', price: 'Start Rp 70.000', icon: BookOpen, badge: null },
  { id: 20, category: 'joki-tugas', name: 'Joki Essay', price: 'Start Rp 40.000', icon: Pen, badge: null },
  { id: 21, category: 'joki-tugas', name: 'Joki Tugas Informatika', price: 'Chat Admin', icon: Code, badge: null },
  { id: 22, category: 'joki-tugas', name: 'Joki Tugas Coding', price: 'Chat Admin', icon: Code, badge: null },
  { id: 23, category: 'joki-tugas', name: 'Joki Pantun Dongeng', price: 'Chat Admin', icon: Pen, badge: null },
  { id: 24, category: 'joki-tugas', name: 'Joki Laporan Praktikum', price: 'Chat Admin', icon: BookOpen, badge: null },
  { id: 25, category: 'joki-tugas', name: 'Tugas Fisika/Kimia/Biologi', price: 'Chat Admin', icon: Calculator, badge: null },
  { id: 26, category: 'joki-tugas', name: 'Tugas MTK/Spatial/Aritmatika', price: 'Chat Admin', icon: Calculator, badge: null },
  { id: 27, category: 'joki-tugas', name: 'Tugas Hukum/Sosio/Psikologi', price: 'Chat Admin', icon: BookOpen, badge: null },
  { id: 28, category: 'joki-tugas', name: 'Tugas Pendidikan/IPS', price: 'Chat Admin', icon: BookOpen, badge: null },
  { id: 29, category: 'joki-tugas', name: 'Joki Google Colab', price: 'Chat Admin', icon: Code, badge: null },
  { id: 30, category: 'joki-tugas', name: 'Joki Resume / Rangkuman', price: 'Chat Admin', icon: FileSpreadsheet, badge: null },
  { id: 31, category: 'joki-tugas', name: 'Tugas SMP,SMA,SMK', price: 'Chat Admin', icon: Calculator, badge: null },
  { id: 32, category: 'joki-tugas', name: 'Buat Lamaran Kerja', price: 'Chat Admin', icon: Pen, badge: null },
  { id: 33, category: 'joki-tugas', name: 'Nomor Halaman', price: 'Chat Admin', icon: BookOpen, badge: null },
  { id: 34, category: 'joki-skripsi', name: 'Paket Sempro', price: 'Chat Admin', icon: GraduationCap, badge: null },
  { id: 35, category: 'joki-skripsi', name: 'Bab 1 / 2 / 3', price: 'Chat Admin', icon: BookOpen, badge: 'Best Seller' },
  { id: 36, category: 'joki-skripsi', name: 'Cari Referensi', price: 'Chat Admin', icon: Star, badge: null },
  { id: 37, category: 'joki-skripsi', name: 'Paket Lengkap Skripsi', price: 'Chat Admin', icon: GraduationCap, badge: 'Termurah' },
  { id: 38, category: 'joki-skripsi', name: 'Konsultasi Judul Penelitian', price: '15k–35k', icon: Target, badge: null },
  { id: 39, category: 'joki-skripsi', name: 'Rekomendasi Judul Penelitian', price: '25k–75k', icon: BookMarked, badge: null },
  { id: 40, category: 'joki-skripsi', name: 'Bantu Susun Rumusan Masalah', price: '20k–50k', icon: Target, badge: null },
  { id: 41, category: 'joki-skripsi', name: 'Bantu Susun Tujuan Penelitian', price: '20k–50k', icon: Target, badge: null },
  { id: 42, category: 'joki-skripsi', name: 'Bantu Susun Manfaat Penelitian', price: '20k–50k', icon: BookMarked, badge: null },
  { id: 43, category: 'joki-skripsi', name: 'Bantu Susun Kerangka Berpikir', price: '40k–100k', icon: FlaskConical, badge: null },
  { id: 44, category: 'joki-skripsi', name: 'Bantu Susun Kerangka Konsep', price: '40k–100k', icon: FlaskConical, badge: null },
  { id: 45, category: 'joki-skripsi', name: 'Bantu Susun Hipotesis', price: '25k–75k', icon: FlaskConical, badge: null },
  { id: 46, category: 'joki-skripsi', name: 'Bantu Tentukan Variabel Penelitian', price: '25k–75k', icon: FlaskConical, badge: null },
  { id: 47, category: 'joki-skripsi', name: 'Bantu Cari Gap Penelitian', price: '50k–150k', icon: Route, badge: null },
  { id: 48, category: 'joki-skripsi', name: 'Bantu Tentukan Metode Penelitian', price: '50k–150k', icon: FlaskConical, badge: null },
  { id: 49, category: 'joki-skripsi', name: 'Bantu Tentukan Populasi & Sampel', price: '40k–100k', icon: FlaskConical, badge: null },
  { id: 50, category: 'joki-skripsi', name: 'Bantu Teknik Sampling', price: '35k–100k', icon: Route, badge: null },
  { id: 51, category: 'joki-skripsi', name: 'Bantu Susun Alur Penelitian', price: '50k–150k', icon: Route, badge: null },
  { id: 52, category: 'joki-skripsi', name: 'Bantu Susun Roadmap Penelitian', price: '75k–200k', icon: Route, badge: null },
  { id: 53, category: 'joki-skripsi', name: 'Bantu Novelty Penelitian', price: '75k–250k', icon: Star, badge: null },
  { id: 54, category: 'unlock', name: 'Unlock Bartleby', price: 'Rp 2.000', icon: Globe, badge: null },
  { id: 55, category: 'unlock', name: 'Unlock Academia', price: 'Rp 2.000', icon: Globe, badge: null },
  { id: 56, category: 'unlock', name: 'Unlock Numerade', price: 'Rp 3.000', icon: Globe, badge: null },
  { id: 57, category: 'unlock', name: 'Unlock Quizlet', price: 'Rp 2.000', icon: Globe, badge: null },
  { id: 58, category: 'unlock', name: 'Unlock Scribd', price: 'Rp 2.000', icon: Globe, badge: null },
  { id: 59, category: 'unlock', name: 'Unlock Chegg', price: 'Rp 2.000', icon: Globe, badge: null },
  { id: 60, category: 'unlock', name: 'Unlock Studocu', price: 'Rp 3.000', icon: Globe, badge: null },
  { id: 61, category: 'unlock', name: 'Unlock Slideshare', price: 'Rp 3.000', icon: Globe, badge: null },
  { id: 62, category: 'unlock', name: 'Unlock Coursehero', price: 'Rp 3.000', icon: Globe, badge: null },
  { id: 63, category: 'unlock', name: 'Unlock Scribd Book', price: 'Rp 3.000', icon: Globe, badge: null },
  { id: 64, category: 'unlock', name: 'Unlock Sage', price: 'Rp 3.000', icon: Globe, badge: null },
  { id: 65, category: 'unlock', name: 'Unlock Wiley', price: 'Rp 3.000', icon: Globe, badge: null },
  { id: 66, category: 'unlock', name: 'Unlock ResearchGate', price: 'Rp 3.000', icon: Star, badge: null },
  { id: 67, category: 'unlock', name: 'Unlock ISTOR', price: 'Rp 3.000', icon: Star, badge: null },
  { id: 68, category: 'unlock', name: 'Unlock IEEE', price: 'Rp 3.000', icon: Star, badge: null },
  { id: 69, category: 'unlock', name: 'Unlock Springer', price: 'Rp 3.000', icon: Star, badge: null },
  { id: 70, category: 'unlock', name: 'Unlock ACS', price: 'Rp 4.500', icon: Star, badge: null },
  { id: 71, category: 'unlock', name: 'Unlock Elsevier', price: 'Rp 4.500', icon: Star, badge: null },
  { id: 72, category: 'unlock', name: 'Unlock Emerald', price: 'Rp 4.500', icon: Star, badge: null },
  { id: 73, category: 'unlock', name: 'Unlock Oxford', price: 'Rp 4.500', icon: Star, badge: null },
  { id: 74, category: 'unlock', name: 'Unlock Cambridge', price: 'Rp 4.500', icon: Star, badge: null },
  { id: 75, category: 'unlock', name: 'Unlock Nature', price: 'Rp 4.500', icon: Star, badge: null },
  { id: 76, category: 'unlock', name: 'Unlock APA Psycnet', price: 'Rp 4.500', icon: Star, badge: null },
  { id: 77, category: 'unlock', name: 'Unlock Scientific', price: 'Rp 4.500', icon: Star, badge: null },
  { id: 78, category: 'joki-skripsi', name: 'Bantu Buat Kuesioner', price: '50k–150k', icon: ClipboardList, badge: null },
  { id: 79, category: 'joki-skripsi', name: 'Bantu Buat Kisi-Kisi Instrumen', price: '40k–120k', icon: ClipboardList, badge: null },
  { id: 80, category: 'joki-skripsi', name: 'Bantu Buat Pedoman Wawancara', price: '40k–120k', icon: ClipboardList, badge: null },
  { id: 88, category: 'uji-data', name: 'Uji Validitas', price: '75k–200k', icon: BarChart, badge: null },
  { id: 89, category: 'uji-data', name: 'Uji Reliabilitas', price: '75k–200k', icon: BarChart, badge: null },
  { id: 90, category: 'uji-data', name: 'Uji Normalitas', price: '75k–200k', icon: BarChart, badge: null },
  { id: 91, category: 'uji-data', name: 'Uji Homogenitas', price: '75k–200k', icon: BarChart, badge: null },
  { id: 92, category: 'uji-data', name: 'Uji Linearitas', price: '75k–200k', icon: BarChart, badge: null },
  { id: 93, category: 'uji-data', name: 'Uji Multikolinearitas', price: '100k–250k', icon: BarChart, badge: null },
  { id: 94, category: 'uji-data', name: 'Uji Heteroskedastisitas', price: '100k–250k', icon: BarChart, badge: null },
  { id: 95, category: 'uji-data', name: 'Uji Autokorelasi', price: '100k–250k', icon: BarChart, badge: null },
  { id: 96, category: 'uji-data', name: 'Uji Korelasi', price: '100k–250k', icon: BarChart, badge: null },
  { id: 97, category: 'uji-data', name: 'Uji Regresi Sederhana', price: '150k–300k', icon: BarChart, badge: null },
  { id: 98, category: 'uji-data', name: 'Uji Regresi Berganda', price: '200k–400k', icon: BarChart, badge: null },
  { id: 99, category: 'uji-data', name: 'Uji T', price: '100k–250k', icon: BarChart, badge: null },
  { id: 100, category: 'uji-data', name: 'Uji F', price: '100k–250k', icon: BarChart, badge: null },
  { id: 171, category: 'tugas-sekolah', name: 'Latihan Soal Harian', price: '10k–50k', icon: School, badge: null },
  { id: 172, category: 'tugas-sekolah', name: 'Pembahasan Soal', price: '15k–75k', icon: School, badge: null },
  { id: 173, category: 'tugas-sekolah', name: 'Bank Soal Mandiri', price: '25k–100k', icon: School, badge: null },
  { id: 268, category: 'umum', name: 'Entry Data', price: '25k–150k', icon: Database, badge: null },
  { id: 269, category: 'umum', name: 'Rekap Data Excel', price: '25k–200k', icon: Database, badge: null },
  { id: 270, category: 'umum', name: 'Input Database', price: '50k–300k', icon: Database, badge: null },
  { id: 341, category: 'medsos', name: 'Caption Instagram', price: '5k–25k/caption', icon: Pen, badge: null },
  { id: 342, category: 'medsos', name: 'Caption TikTok', price: '5k–25k/caption', icon: Pen, badge: null },
  { id: 343, category: 'medsos', name: 'Copywriting Produk', price: '15k–75k/produk', icon: Pen, badge: null },
  { id: 344, category: 'medsos', name: 'Copywriting Iklan', price: '50k–250k', icon: Pen, badge: null },
  { id: 365, category: 'desain', name: 'Desain Logo', price: '75k–500k', icon: Image, badge: null },
  { id: 366, category: 'desain', name: 'Desain Banner', price: '50k–300k', icon: Image, badge: null },
  { id: 367, category: 'desain', name: 'Desain Brosur', price: '50k–300k', icon: Image, badge: null },
  { id: 368, category: 'desain', name: 'Desain Flyer', price: '50k–250k', icon: Image, badge: null },
  { id: 369, category: 'desain', name: 'Desain Menu Makanan', price: '50k–300k', icon: Image, badge: null },
  { id: 385, category: 'desain', name: 'Desain Cover Makalah', price: 'Start 15k', icon: FileSpreadsheet, badge: null },
  { id: 386, category: 'desain', name: 'Desain Cover Laporan', price: 'Start 15k', icon: FileSpreadsheet, badge: null },
  { id: 387, category: 'digital', name: 'Upload Produk Marketplace', price: '3k–15k/produk', icon: Globe, badge: null },
  { id: 480, category: 'uiux', name: 'UI Design Landing Page', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 481, category: 'uiux', name: 'UI Design Website Company Profile', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 482, category: 'uiux', name: 'UI Design Website Portfolio', price: 'Start 250k', icon: MonitorCheck, badge: null },
];

const ITEMS_PER_PAGE = 16;

export default function LayananPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredServices = services.filter((service) => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleServices = filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark-800 via-primary-900 to-dark-800 pt-24 sm:pt-32 pb-10 sm:pb-16 px-4">
        <div className="container-custom">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Semua Layanan
            </motion.h1>
            <motion.p
              className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Temukan berbagai layanan akademik yang tersedia dengan harga termurah di pasaran
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-3 sm:py-4 md:py-5 bg-white border-b sticky top-16 md:top-20 z-40">
        <div className="container-custom px-4">
          <div className="relative w-full mb-3 sm:mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari layanan..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-primary-800 transition-all"
            />
          </div>

          <div className="flex gap-1.5 sm:gap-2 justify-start overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-primary-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <cat.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 sm:py-12">
        <div className="container-custom px-4">
          <motion.div
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {visibleServices.map((service, index) => (
              <motion.div
                key={service.id}
                className={`group relative bg-white rounded-xl p-4 sm:p-5 lg:p-6 border transition-all duration-500 ${
                  service.badge ? 'border-primary-800 shadow-md' : 'border-gray-200 hover:border-primary-800'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(26, 35, 126, 0.15)" }}
              >
                {service.badge && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                    {service.badge}
                  </span>
                )}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="bg-primary-800/10 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center">
                    <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-800" />
                  </div>
                </div>
                <h3 className="font-semibold text-dark-800 text-sm sm:text-base mb-2 group-hover:text-primary-800 transition-colors line-clamp-2">{service.name}</h3>
                <p className="text-primary-800 font-bold text-sm sm:text-base mb-3">{service.price}</p>
                <motion.a
                  href={`https://wa.me/6287815797525?text=Halo%20Kak%20Mau%20${encodeURIComponent(service.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-primary-800 hover:bg-primary-700 text-white font-medium py-2 sm:py-2.5 rounded-lg transition-colors duration-300 text-sm"
                  whileTap={{ scale: 0.98 }}
                >
                  Pesan
                </motion.a>
              </motion.div>
            ))}
          </motion.div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-base sm:text-lg">Layanan tidak ditemukan</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              className="flex items-center justify-center mt-8 sm:mt-10 gap-1 flex-wrap px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:border-primary-800 hover:text-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? 'bg-primary-800 text-white shadow-md'
                      : 'border border-gray-300 text-gray-500 hover:border-primary-800 hover:text-primary-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {totalPages > 5 && <span className="text-gray-400">...</span>}
              {totalPages > 5 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    currentPage === totalPages
                      ? 'bg-primary-800 text-white shadow-md'
                      : 'border border-gray-300 text-gray-500 hover:border-primary-800 hover:text-primary-800'
                  }`}
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:border-primary-800 hover:text-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {totalPages > 1 && (
            <p className="text-center text-xs sm:text-sm text-gray-500 mt-3">
              Halaman {currentPage} dari {totalPages} — {filteredServices.length} layanan
            </p>
          )}
        </div>
      </section>

      {/* Back to Top Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showBackToTop ? 1 : 0, y: showBackToTop ? 0 : 20 }}
        className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50"
      >
        <motion.button
          onClick={scrollToTop}
          className="w-11 h-11 sm:w-12 sm:h-12 bg-primary-800 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
      </motion.div>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
