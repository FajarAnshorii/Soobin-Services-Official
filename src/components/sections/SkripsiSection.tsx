'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, BookOpen, FileSearch, Archive,
  Target, BookMarked, FlaskConical, Route, Award, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRealtimeServices } from '@/hooks/useRealtimeServices';
import { getPriceWithMemberDiscount } from '@/lib/priceUtils';

const DEFAULT_CATEGORIES = [
  {
    id: 'persiapan',
    label: 'Persiapan Penelitian',
    icon: Target,
    services: [
      { num: '01', title: 'Konsultasi Judul Penelitian', price: 'Rp 15.000–35.000' },
      { num: '02', title: 'Rekomendasi Judul Penelitian', price: 'Rp 25.000–75.000' },
      { num: '03', title: 'Bantu Susun Rumusan Masalah', price: 'Rp 20.000–50.000' },
      { num: '04', title: 'Bantu Susun Tujuan Penelitian', price: 'Rp 20.000–50.000' },
    ],
  },
  {
    id: 'landasan',
    label: 'Manfaat & Landasan',
    icon: BookMarked,
    services: [
      { num: '05', title: 'Bantu Susun Manfaat Penelitian', price: 'Rp 20.000–50.000' },
      { num: '06', title: 'Bantu Susun Kerangka Berpikir', price: 'Rp 40.000–100.000' },
      { num: '07', title: 'Bantu Susun Kerangka Konsep', price: 'Rp 40.000–100.000' },
      { num: '08', title: 'Bantu Susun Hipotesis', price: 'Rp 25.000–75.000' },
    ],
  },
  {
    id: 'variabel',
    label: 'Variabel & Metode',
    icon: FlaskConical,
    services: [
      { num: '09', title: 'Bantu Tentukan Variabel Penelitian', price: 'Rp 25.000–75.000' },
      { num: '10', title: 'Bantu Cari Gap Penelitian', price: 'Rp 50.000–150.000' },
      { num: '11', title: 'Bantu Tentukan Metode Penelitian', price: 'Rp 50.000–150.000' },
      { num: '12', title: 'Bantu Tentukan Populasi & Sampel', price: 'Rp 40.000–100.000' },
    ],
  },
  {
    id: 'teknik',
    label: 'Teknik & Roadmap',
    icon: Route,
    services: [
      { num: '13', title: 'Bantu Teknik Sampling', price: 'Rp 35.000–100.000' },
      { num: '14', title: 'Bantu Susun Alur Penelitian', price: 'Rp 50.000–150.000' },
      { num: '15', title: 'Bantu Susun Roadmap Penelitian', price: 'Rp 75.000–200.000' },
      { num: '16', title: 'Bantu Novelty Penelitian', price: 'Rp 75.000–250.000' },
    ],
  },
];

const DEFAULT_PAKET_CARDS = [
  {
    icon: GraduationCap,
    badge: 'Paket Sempro',
    title: 'Paket Sempro Proposal',
    price: 'Chat Admin',
    description: 'Lengkap dari Bab 1, 2, 3 + PPT Presentasi + Kisi-kisi Pertanyaan Dosen Penguji.',
    features: ['Bab 1, 2, 3 Full', 'Free PPT Sidang', 'Revisi Sampai ACC', 'Garansi Lolos Sempro'],
    popular: false,
  },
  {
    icon: Archive,
    badge: 'Best Seller',
    title: 'Paket Full Skripsi Bab 1–5',
    price: 'Chat Admin',
    description: 'Pengerjaan total dari judul hingga penutup, termasuk pengolahan data & analisis.',
    features: ['Bab 1 s/d 5 Lengkap', 'Uji Data Statistik / Kualitatif', 'Free Parafrase Turnitin', 'Bimbingan Materi Sidang'],
    popular: true,
  },
  {
    icon: Award,
    badge: 'Komprehensif',
    title: 'Paket Siap Sidang Skripsi',
    price: 'Chat Admin',
    description: 'Fokus persiapan sidang skripsi: revisi akhir, PPT profesional, dan simulasi tanya-jawab.',
    features: ['Revisi Pasca Sempro/Hasil', 'PPT Sidang Animasi Modern', 'Naskah Publikasi / Jurnal', 'Simulasi Pertanyaan Penguji'],
    popular: false,
  },
];

export default function SkripsiSection() {
  const { placeDirectOrder } = useCart();
  const [activeTab, setActiveTab] = useState('persiapan');
  const [currentPage, setCurrentPage] = useState(0);

  const { services: realtimeDbServices } = useRealtimeServices('joki-skripsi');

  const categoriesList = useMemo(() => {
    if (realtimeDbServices && realtimeDbServices.length > 0) {
      return DEFAULT_CATEGORIES.map((cat) => ({
        ...cat,
        services: cat.services.map((srv) => {
          const matched = realtimeDbServices.find((db: any) =>
            db.name?.toLowerCase().includes(srv.title.toLowerCase()) ||
            srv.title.toLowerCase().includes(db.name?.toLowerCase())
          );
          return matched ? { ...srv, price: matched.price } : srv;
        }),
      }));
    }
    return DEFAULT_CATEGORIES;
  }, [realtimeDbServices]);

  const activeCategory = categoriesList.find((c) => c.id === activeTab) || categoriesList[0];
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

  const { user } = useAuth();
  const isMember = Boolean(user);

  return (
    <section id="joki-skripsi" className="bg-linear-to-br from-gray-50 to-gray-100 section-padding">
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
          transition={{ duration: 0.4 }}
        >
          {categoriesList.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.id === activeTab;
            return (
              <button
                key={cat.id}
                onClick={() => handleTabChange(cat.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-primary-800 text-white shadow-lg shadow-primary-800/25 scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-dark-800 shadow-xs'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary-800'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Active Category Services Table/List */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-12 sm:mb-16"
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[60px_1fr_180px] gap-4 px-6 py-4 bg-primary-800 text-white text-sm font-semibold">
            <span>No</span>
            <span>Layanan</span>
            <span className="text-right">Harga</span>
          </div>

          {/* Service Rows */}
          <div className="divide-y divide-gray-100">
            {visibleServices.map((service, index) => (
              <motion.div
                key={service.num}
                className="grid grid-cols-[45px_1fr] md:grid-cols-[60px_1fr_180px] gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors duration-200 items-center"
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
                    {service.price}
                  </span>
                </div>

                {/* Price - desktop */}
                <div className="hidden md:flex justify-end">
                  <span className="text-primary-800 font-bold whitespace-nowrap">
                    {service.price}
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
          {DEFAULT_PAKET_CARDS.map((card, index) => (
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