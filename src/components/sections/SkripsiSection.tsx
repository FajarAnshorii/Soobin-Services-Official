'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, BookOpen, FileSearch, Archive,
  Target, BookMarked, Lightbulb, BarChart3,
  FlaskConical, Users, Route, Map, Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react';

const categories = [
  {
    id: 'persiapan',
    label: 'Persiapan Penelitian',
    icon: Target,
    services: [
      { num: '01', title: 'Konsultasi Judul Penelitian', price: '15k–35k' },
      { num: '02', title: 'Rekomendasi Judul Penelitian', price: '25k–75k' },
      { num: '03', title: 'Bantu Susun Rumusan Masalah', price: '20k–50k' },
      { num: '04', title: 'Bantu Susun Tujuan Penelitian', price: '20k–50k' },
    ],
  },
  {
    id: 'landasan',
    label: 'Manfaat & Landasan',
    icon: BookMarked,
    services: [
      { num: '05', title: 'Bantu Susun Manfaat Penelitian', price: '20k–50k' },
      { num: '06', title: 'Bantu Susun Kerangka Berpikir', price: '40k–100k' },
      { num: '07', title: 'Bantu Susun Kerangka Konsep', price: '40k–100k' },
      { num: '08', title: 'Bantu Susun Hipotesis', price: '25k–75k' },
    ],
  },
  {
    id: 'variabel',
    label: 'Variabel & Metode',
    icon: FlaskConical,
    services: [
      { num: '09', title: 'Bantu Tentukan Variabel Penelitian', price: '25k–75k' },
      { num: '10', title: 'Bantu Cari Gap Penelitian', price: '50k–150k' },
      { num: '11', title: 'Bantu Tentukan Metode Penelitian', price: '50k–150k' },
      { num: '12', title: 'Bantu Tentukan Populasi & Sampel', price: '40k–100k' },
    ],
  },
  {
    id: 'teknik',
    label: 'Teknik & Roadmap',
    icon: Route,
    services: [
      { num: '13', title: 'Bantu Teknik Sampling', price: '35k–100k' },
      { num: '14', title: 'Bantu Susun Alur Penelitian', price: '50k–150k' },
      { num: '15', title: 'Bantu Susun Roadmap Penelitian', price: '75k–200k' },
      { num: '16', title: 'Bantu Novelty Penelitian', price: '75k–250k' },
    ],
  },
];

const paketCards = [
  {
    icon: GraduationCap,
    title: 'Paket Sempro',
    description: 'Persiapan seminar proposal lengkap',
    badge: null,
  },
  {
    icon: BookOpen,
    title: 'Bab 1 / 2 / 3',
    description: 'Penulisan bab dengan kualitas tinggi',
    badge: 'Best Seller',
  },
  {
    icon: FileSearch,
    title: 'Cari Referensi',
    description: 'Pencarian referensi jurnal terakreditasi',
    badge: null,
  },
  {
    icon: Archive,
    title: 'Paket Lengkap',
    description: 'Semua jurusan, terima jadi',
    badge: 'Termurah',
  },
];

export default function SkripsiSection() {
  const [activeTab, setActiveTab] = useState('persiapan');
  const [currentPage, setCurrentPage] = useState(0);

  const activeCategory = categories.find((c) => c.id === activeTab) || categories[0];
  const itemsPerPage = 4;
  const totalPages = Math.ceil(activeCategory.services.length / itemsPerPage);
  const visibleServices = activeCategory.services.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handleTabChange = (catId: string) => {
    setActiveTab(catId);
    setCurrentPage(0);
  };

  return (
    <section id="joki-skripsi" className="bg-gradient-to-br from-gray-50 to-gray-100 section-padding">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-primary-800/10 text-primary-800 font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full mb-3 sm:mb-4">
            Skripsi & Thesis
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-800 mb-3 sm:mb-4">
            JOKI SKRIPSI
          </h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <span className="bg-dark-800 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full">
              Semua Jurusan
            </span>
            <span className="bg-green-500 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full">
              Harga Termurah
            </span>
            <span className="bg-primary-800 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full">
              Terima Jadi
            </span>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleTabChange(cat.id)}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border-2 ${
                activeTab === cat.id
                  ? 'bg-primary-800 text-white border-primary-800 shadow-lg shadow-primary-800/30'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-800 hover:text-primary-800'
              }`}
            >
              <cat.icon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Services List with Pagination */}
        <motion.div
          key={activeTab}
          className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Table Header - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-[60px_1fr_120px] gap-4 px-6 py-4 bg-primary-800 text-white text-sm font-semibold">
            <span>No</span>
            <span>Layanan</span>
            <span className="text-right">Harga</span>
          </div>

          {/* Service Rows */}
          <div className="divide-y divide-gray-100">
            {visibleServices.map((service, index) => (
              <motion.div
                key={service.num}
                className="grid grid-cols-[45px_1fr] md:grid-cols-[60px_1fr_120px] gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors duration-200 items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Number Badge */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-800/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary-800 font-bold text-xs sm:text-sm">{service.num}</span>
                </div>

                {/* Title */}
                <div className="flex flex-col">
                  <span className="font-semibold text-dark-800 text-xs sm:text-sm md:text-base">
                    {service.title}
                  </span>
                  <span className="md:hidden text-primary-800 font-bold text-xs sm:text-sm mt-1">
                    Rp {service.price}
                  </span>
                </div>

                {/* Price - desktop */}
                <div className="hidden md:flex justify-end">
                  <span className="text-primary-800 font-bold whitespace-nowrap">
                    Rp {service.price}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50">
              <span className="text-xs sm:text-sm text-gray-500">
                Halaman {currentPage + 1} dari {totalPages}
              </span>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-primary-800 hover:text-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                      currentPage === i
                        ? 'bg-primary-800 text-white'
                        : 'border border-gray-300 text-gray-500 hover:border-primary-800 hover:text-primary-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-primary-800 hover:text-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Paket Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {paketCards.map((card, index) => (
            <motion.div
              key={card.title}
              className={`relative bg-white rounded-2xl p-4 sm:p-6 lg:p-8 text-center border-2 ${
                card.badge
                  ? 'border-primary-800 shadow-lg shadow-primary-800/10'
                  : 'border-gray-200'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.03,
                boxShadow: '0 12px 32px rgba(15, 39, 68, 0.15)',
                borderColor: 'rgb(15, 39, 68)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              {card.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {card.badge}
                </span>
              )}
              <div className="bg-primary-800/10 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <card.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-800" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-dark-800 mb-1 sm:mb-2">
                {card.title}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm">{card.description}</p>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                <span className="text-primary-800 font-bold text-sm sm:text-base">Chat Admin</span>
                <span className="text-gray-400 text-xs sm:text-sm"> untuk harga</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          className="bg-dark-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-primary-400 mb-1 sm:mb-2">200+</p>
              <p className="text-gray-400 text-xs sm:text-sm">Skripsi Selesai</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-primary-400 mb-1 sm:mb-2">300+</p>
              <p className="text-gray-400 text-xs sm:text-sm">Jurusan Ditangani</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-primary-400 mb-1 sm:mb-2">50+</p>
              <p className="text-gray-400 text-xs sm:text-sm">Support Konsultasi</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-8 sm:mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.a
            href="https://wa.me/6287815797525?text=Halo%20Kak%20Mau%20Joki%20Skripsi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary-800 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl shadow-lg shadow-primary-800/30 text-sm sm:text-base"
            whileHover={{
              scale: 1.02,
              boxShadow: '0 10px 40px rgba(15, 39, 68, 0.5)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            Konsultasi Skripsi Gratis
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}