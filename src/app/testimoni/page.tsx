'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import TestimonialModal from '@/components/modals/TestimonialModal';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Star, MessageCircle, Filter, PlusCircle, UserCheck } from 'lucide-react';
import Link from 'next/link';

interface TestimonialData {
  id: string;
  name: string;
  university?: string;
  prodi?: string;
  serviceName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const DEFAULT_TESTIMONIALS: TestimonialData[] = [
  { id: 't-1', name: 'Rina Wulandari', university: 'Universitas Indonesia', prodi: 'S1 Hukum', serviceName: 'Jasa Parafrase & Cek Turnitin 0%', rating: 5, comment: 'Skripsi saya selesai tepat waktu dengan hasil yang memuaskan. Similarity Turnitin hanya 8%. Terima kasih Soobin!', createdAt: '2026-07-25T10:00:00.000Z' },
  { id: 't-2', name: 'Ahmad Pratama', university: 'Institut Teknologi Bandung', prodi: 'S1 Teknik Informatika', serviceName: 'Jasa Parafrase & Turnitin 0%', rating: 5, comment: 'Pelayanannya cepat dan hasilnya akurat. Harga paling terjangkau dibanding tempat lain. Highly recommended!', createdAt: '2026-07-26T12:00:00.000Z' },
  { id: 't-3', name: 'Siti Nurhaliza', university: 'Universitas Gadjah Mada', prodi: 'S1 Farmasi', serviceName: 'Konsultasi Skripsi & Tugas Akhir', rating: 5, comment: 'Makalahnya berkualitas tinggi dan sesuai deadline. Revisi gratis sampai puas. Admin ramah banget!', createdAt: '2026-07-27T15:30:00.000Z' },
  { id: 't-4', name: 'Budi Santoso', university: 'Universitas Padjadjaran', prodi: 'S1 Kedokteran', serviceName: 'Formatting Jurnal & Fast Track Sinta', rating: 5, comment: 'Berhasil unlock semua jurnal yang saya butuhkan untuk skripsi. Proses cepat cuma 30 menit!', createdAt: '2026-07-28T09:15:00.000Z' },
  { id: 't-5', name: 'Dewi Lestari', university: 'IPB University', prodi: 'S1 Agronomi', serviceName: 'Pengolahan Data SPSS / SmartPLS / AMOS', rating: 5, comment: 'Data SPSS saya diolah dengan sempurna. Hasilnya rapi dan mudah dipahami. Makasih banyak!', createdAt: '2026-07-29T11:45:00.000Z' },
  { id: 't-6', name: 'Farhan Rizki', university: 'ITS Surabaya', prodi: 'S1 Teknik Elektro', serviceName: 'Jasa Pembuatan Website & Aplikasi', rating: 5, comment: 'Kode Python untuk machine learning saya dibuatkan dengan penjelasan lengkap. Nilai akhirnya A!', createdAt: '2026-07-30T14:20:00.000Z' },
];

const categories = [
  { id: 'all', label: 'Semua Ulasan' },
  { id: 'turnitin', label: 'Cek Turnitin & Parafrase' },
  { id: 'ppt', label: 'Desain PPT Sidang' },
  { id: 'olah-data', label: 'Pengolahan Data SPSS/SmartPLS' },
  { id: 'jurnal', label: 'Formatting Jurnal' },
];

export default function TestimoniPage() {
  const { user } = useAuth();
  const [dbTestimonials, setDbTestimonials] = useState<TestimonialData[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Real-time fetching of testimonials from Supabase & Cloud Storage API
  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDbTestimonials(data);
        }
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    const interval = setInterval(fetchTestimonials, 5000); // 5s realtime update
    return () => clearInterval(interval);
  }, []);

  // Merge static initial testimonials with real-time user submitted testimonials
  const allTestimonials = useMemo(() => {
    const map = new Map<string, TestimonialData>();
    dbTestimonials.forEach((t) => map.set(t.id, t));
    DEFAULT_TESTIMONIALS.forEach((t) => {
      if (!map.has(t.id)) map.set(t.id, t);
    });

    const arr = Array.from(map.values());
    arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return arr;
  }, [dbTestimonials]);

  // Filtered Testimonials based on category
  const filteredTestimonials = useMemo(() => {
    if (selectedCategory === 'all') return allTestimonials;
    return allTestimonials.filter((t) => {
      const name = (t.serviceName || '').toLowerCase();
      switch (selectedCategory) {
        case 'turnitin': return name.includes('turnitin') || name.includes('parafrase');
        case 'ppt': return name.includes('ppt') || name.includes('desain');
        case 'olah-data': return name.includes('spss') || name.includes('smartpls') || name.includes('data');
        case 'jurnal': return name.includes('jurnal') || name.includes('sinta');
        default: return true;
      }
    });
  }, [allTestimonials, selectedCategory]);

  // Calculate Rating Statistics
  const averageRating = useMemo(() => {
    if (allTestimonials.length === 0) return '5.0';
    const sum = allTestimonials.reduce((acc, curr) => acc + (curr.rating || 5), 0);
    return (sum / allTestimonials.length).toFixed(1);
  }, [allTestimonials]);

  const fiveStarCount = useMemo(() => {
    return allTestimonials.filter((t) => t.rating === 5).length;
  }, [allTestimonials]);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev >= Math.min(filteredTestimonials.length, 5) - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlay, filteredTestimonials]);

  const handleOpenReviewModal = () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark-800 via-primary-900 to-dark-800 pt-24 sm:pt-32 pb-12 sm:pb-16 px-4">
        <div className="container-custom">
          <motion.div className="text-center flex flex-col items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 flex items-center gap-1.5 backdrop-blur-md">
              Ulasan Realtime Member SOOBIN
            </span>

            <motion.h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              Testimoni & Rating Layanan
            </motion.h1>

            <motion.p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              Apa kata mahasiswa dari berbagai universitas di Indonesia yang telah mempercayakan tugas akademik & skripsi kepada SOOBIN Services.
            </motion.p>

            <motion.div className="flex flex-wrap items-center justify-center gap-4 mt-6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-amber-400 font-extrabold text-lg sm:text-xl">{averageRating}</span>
                <span className="text-gray-300 text-xs sm:text-sm">({allTestimonials.length} Ulasan)</span>
              </div>

              {/* Tulis Testimoni Button */}
              <button
                onClick={handleOpenReviewModal}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tulis Testimoni & Rating</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-6 sm:py-8 border-b border-gray-150 shadow-xs relative">
        <div className="container-custom px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            {[
              { value: allTestimonials.length, label: 'Total Testimoni' },
              { value: `${averageRating} / 5.0`, label: 'Rata-Rata Rating' },
              { value: fiveStarCount, label: 'Bintang 5 Sempurna' },
              { value: '20.000+', label: 'Mahasiswa Puas' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center">
                <p className={`text-2xl sm:text-3xl font-black ${i === 1 ? 'text-slate-900 font-bold' : 'text-primary-800'}`}>
                  {stat.value}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid & Rating Filter */}
      <section className="py-8 sm:py-12">
        <div className="container-custom px-4">
          {/* Header & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-gray-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary-800" />
                <h2 className="text-lg sm:text-xl font-black text-gray-900">Ulasan & Rating Member</h2>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Menampilkan <span className="font-bold text-primary-800">{filteredTestimonials.length}</span> ulasan terverifikasi
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-primary-800 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Testimonials Cards Grid */}
          {loadingTestimonials ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-800"></div>
              <p className="text-xs text-gray-500 font-medium">Memuat ulasan realtime...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTestimonials.map((testi, index) => {
                const dateStr = new Date(testi.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <motion.div
                    key={testi.id}
                    className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-primary-800/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div>
                      {/* Member Info */}
                      <div className="flex items-center gap-3.5 mb-3.5">
                        <div className="w-11 h-11 bg-primary-800 text-white rounded-full flex items-center justify-center font-black text-base uppercase shrink-0 shadow-sm">
                          {testi.name.charAt(0)}
                        </div>
                        <div className="flex flex-col truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900 text-sm truncate">{testi.name}</span>
                            <UserCheck className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          </div>
                          <span className="text-xs text-gray-500 truncate">{testi.university || 'Mahasiswa'}</span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-2.5">
                        {[...Array(testi.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>

                      {/* Service Tag */}
                      <div className="bg-slate-100 text-slate-800 text-[11px] font-bold px-3 py-1 rounded-lg inline-block mb-3 border border-slate-200">
                        {testi.serviceName}
                      </div>

                      {/* Review Comment */}
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-4 italic">
                        &quot;{testi.comment}&quot;
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-400 font-medium">
                      <span>{dateStr}</span>
                      <span className="text-green-600 font-bold flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> Verifikasi SOOBIN
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Popular Testimonial Carousel */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container-custom px-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 text-center">
            Testimoni Pilihan Terbaik
          </h2>
          <div
            className="relative overflow-hidden rounded-3xl"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {filteredTestimonials.slice(0, 5).map((testi) => (
                <div key={testi.id} className="w-full flex-shrink-0 px-2 sm:px-4">
                  <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white text-center shadow-xl">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-black mx-auto mb-4 backdrop-blur-md">
                      {testi.name.charAt(0)}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-3">
                      {[...Array(testi.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm font-bold px-4 py-1.5 bg-white/10 border border-white/20 rounded-full inline-block mb-4">
                      {testi.serviceName}
                    </p>
                    <p className="text-base sm:text-xl italic mb-5 max-w-2xl mx-auto leading-relaxed px-2 font-medium">
                      &quot;{testi.comment}&quot;
                    </p>
                    <p className="font-extrabold text-base sm:text-lg">{testi.name}</p>
                    <p className="text-white/70 text-xs sm:text-sm">{testi.university}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-950 py-12">
        <div className="container-custom px-4 text-center">
          <h2 className="text-xl sm:text-3xl font-extrabold text-white mb-3">Ingin Memberikan Rating & Ulasan?</h2>
          <p className="text-slate-400 mb-6 text-sm sm:text-base max-w-xl mx-auto">
            Berikan ulasan jujur Anda untuk membantu mahasiswa lain menemukan jasa akademik terbaik di SOOBIN Services.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleOpenReviewModal}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black py-3.5 px-8 rounded-2xl text-xs sm:text-sm transition-all shadow-lg cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Tulis Testimoni Sekarang
            </button>

            <a
              href="https://wa.me/6287815797525"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-black py-3.5 px-8 rounded-2xl text-xs sm:text-sm transition-all shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              Konsultasi via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Testimonial Modal */}
      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTestimonials}
      />

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}