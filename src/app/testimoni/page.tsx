'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Star, MessageCircle, CheckCircle, Filter, X } from 'lucide-react';

const testimonials = [
  { id: 1, name: 'Rina Wulandari', university: 'Universitas Indonesia', rating: 5, layanan: 'Joki Skripsi + Cek Turnitin', message: 'Skripsi saya selesai tepat waktu dengan hasil yang memuaskan. Similarity Turnitin hanya 8%. Terima kasih Soobin!', date: '2 minggu lalu' },
  { id: 2, name: 'Ahmad Pratama', university: 'ITB', rating: 5, layanan: 'Cek Turnitin 6x + Parafrase', message: 'Pelayanannya cepat dan hasilnya akurat. Harga paling murah dibanding tempat lain. Highly recommended!', date: '3 minggu lalu' },
  { id: 3, name: 'Siti Nurhaliza', university: 'UGM', rating: 5, layanan: 'Joki Makalah + Daftar Pustaka', message: 'Makalahnya berkualitas tinggi dan sesuai deadline. Revisi gratis sampai puas. Admin ramah banget!', date: '1 bulan lalu' },
  { id: 4, name: 'Budi Santoso', university: 'Unpad', rating: 5, layanan: 'Unlock Jurnal Elsevier + Springer', message: 'Berhasil unlock semua jurnal yang saya butuhkan untuk skripsi. Proses cepat cuma 30 menit!', date: '1 bulan lalu' },
  { id: 5, name: 'Dewi Lestari', university: 'IPB', rating: 5, layanan: 'Olah Data SPSS + Joki Tugas', message: 'Data SPSS saya diolah dengan sempurna. Hasilnya rapi dan mudah dipahami. Makasih banyak!', date: '2 bulan lalu' },
  { id: 6, name: 'Farhan Rizki', university: 'ITS', rating: 5, layanan: 'Joki Coding + Google Colab', message: 'Kode Python untuk machine learning saya dibuatkan dengan penjelasan lengkap. Nilai akhirnya A!', date: '2 bulan lalu' },
  { id: 7, name: 'Maya Putri', university: 'Unhas', rating: 5, layanan: 'Joki Essay + Translate Grammar', message: 'Essay bahasa Inggris saya hasilnya sangat natural, tidak terlihat di-translate. Worth it banget!', date: '3 bulan lalu' },
  { id: 8, name: 'Hendra Wijaya', university: 'Undip', rating: 5, layanan: 'Joki Skripsi Paket Lengkap', message: 'Skripsi dari awal sampai akhir dikerjakan dengan profesional. Semua jurusan bisa ditangani. Mantap!', date: '3 bulan lalu' },
  { id: 9, name: 'Anisa Rahman', university: 'UNAIR', rating: 5, layanan: 'Cek AI + Parafrase', message: 'Hasil cek AI sangat detail dan parafrasenya berkualitas. Sangat membantu sekali!', date: '4 bulan lalu' },
  { id: 10, name: 'Rizky Ramadhan', university: 'Telkom University', rating: 5, layanan: 'Joki Tugas Coding + Olah Data Python', message: 'Tugas algoritma dan data science saya dikerjakan dengan bagus. Kode nya clean dan ada komentar. Recommended!', date: '1 minggu lalu' },
  { id: 11, name: 'Putri Ayu Lestari', university: 'UPI Bandung', rating: 5, layanan: 'Joki Makalah + PPT', message: 'Makalah dan PPT nya bagus banget! Dosen langsung acc tanpa revisi. Makasih ya!', date: '2 minggu lalu' },
  { id: 12, name: 'Andi Saputra', university: 'UNHAS', rating: 5, layanan: 'Unlock Chegg + Course Hero', message: 'Berhasil unlock semua dokumen yang saya butuhkan untuk tugas akhir. Proses cepat dan harga terjangkau!', date: '1 bulan lalu' },
];

const categories = [
  { id: 'all', label: 'Semua' },
  { id: 'joki-skripsi', label: 'Joki Skripsi' },
  { id: 'joki-makalah', label: 'Joki Makalah' },
  { id: 'turnitin', label: 'Cek Turnitin' },
  { id: 'parafrase', label: 'Parafrase' },
  { id: 'unlock', label: 'Unlock' },
  { id: 'coding', label: 'Coding' },
];

export default function TestimoniPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const filteredTestimonials = selectedCategory === 'all'
    ? testimonials
    : testimonials.filter((testi) => {
        const cat = testi.layanan.toLowerCase();
        switch (selectedCategory) {
          case 'joki-skripsi': return cat.includes('skripsi');
          case 'joki-makalah': return cat.includes('makalah');
          case 'turnitin': return cat.includes('turnitin');
          case 'parafrase': return cat.includes('parafrase');
          case 'unlock': return cat.includes('unlock');
          case 'coding': return cat.includes('coding');
          default: return true;
        }
      });

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev >= 5 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark-800 via-primary-900 to-dark-800 pt-24 sm:pt-32 pb-10 sm:pb-16 px-4">
        <div className="container-custom">
          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <motion.h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              Testimoni Customer
            </motion.h1>
            <motion.p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              Apa kata mereka yang sudah menggunakan layanan Soobin Services
            </motion.p>
            <motion.div className="flex items-center justify-center gap-2 mt-4" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: "spring" }}>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.1 }}>
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                ))}
              </div>
              <span className="text-yellow-400 font-bold text-lg sm:text-xl">4,9</span>
              <span className="text-gray-400 text-sm sm:text-base">Rating</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-6 sm:py-8 border-b">
        <div className="container-custom px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            {[
              { value: testimonials.length, label: "Testimonial" },
              { value: "4.9", label: "Rating" },
              { value: testimonials.filter(t => t.rating === 5).length, label: "5 Bintang" },
              { value: "20K+", label: "Customer" }
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}>
                <p className={`text-2xl sm:text-3xl font-black ${i === 1 ? 'text-yellow-500' : 'text-primary-800'}`}>{stat.value}</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-8 sm:py-12">
        <div className="container-custom px-4">
          {/* Filter */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary-800" />
              <h2 className="text-base sm:text-lg font-bold text-dark-800">Filter Kategori</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    selectedCategory === cat.id ? 'bg-primary-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Menampilkan <span className="font-bold text-primary-800">{filteredTestimonials.length}</span> testimonial
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-6">
            {filteredTestimonials.map((testi, index) => (
              <motion.div
                key={testi.id}
                className="group bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-primary-800 hover:shadow-lg transition-all duration-500"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testi.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-dark-800 text-sm sm:text-base">{testi.name}</p>
                    <p className="text-gray-500 text-xs sm:text-sm">{testi.university}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <div className="bg-primary-800/10 text-primary-800 text-xs font-medium px-2 sm:px-3 py-1 rounded-full inline-block mb-2">
                  {testi.layanan}
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-3">&quot;{testi.message}&quot;</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-gray-400 text-xs">{testi.date}</span>
                  <a href="https://wa.me/6287815797525" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-500 hover:text-green-600 text-xs sm:text-sm font-medium">
                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    Chat
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Auto-play Slider */}
      <section className="py-8 sm:py-12 bg-white border-t">
        <div className="container-custom px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-dark-800 mb-6 text-center">Testimoni Populer</h2>
          <div
            className="relative overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-dark-800/80 backdrop-blur-sm px-2 py-1 rounded-full">
              <div className={`w-2 h-2 rounded-full ${isAutoPlay ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-white text-xs">{isAutoPlay ? 'Auto' : 'Paused'}</span>
            </div>

            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {filteredTestimonials.slice(0, 6).map((testi) => (
                <div key={testi.id} className="w-full flex-shrink-0 px-2 sm:px-4">
                  <div className="bg-gradient-to-br from-primary-800 to-dark-800 rounded-2xl p-6 sm:p-8 text-white text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mx-auto mb-4">
                      {testi.name.charAt(0)}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-3">
                      {[...Array(testi.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm font-medium px-3 py-1 bg-white/20 rounded-full inline-block mb-3">{testi.layanan}</p>
                    <p className="text-base sm:text-lg italic mb-4 max-w-xl mx-auto leading-relaxed px-2">&quot;{testi.message}&quot;</p>
                    <p className="font-semibold text-sm sm:text-base">{testi.name}</p>
                    <p className="text-white/70 text-xs sm:text-sm">{testi.university}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setCurrentSlide((prev) => (prev === 0 ? 5 : prev - 1))} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => setCurrentSlide((prev) => (prev >= 5 ? 0 : prev + 1))} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-6 sm:w-8 bg-primary-800' : 'w-2 bg-gray-300'}`}
              />
            ))}
          </div>
          <p className="text-center text-xs sm:text-sm text-gray-500 mt-2">{currentSlide + 1} / {Math.min(filteredTestimonials.length, 6)}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-800 py-10 sm:py-12">
        <div className="container-custom px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Puas dengan Layanan Kami?</h2>
          <p className="text-gray-400 mb-5 sm:mb-6 text-sm sm:text-base">Yuk jadi customer berikutnya yang puas!</p>
          <a href="https://wa.me/6287815797525" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-sm sm:text-base transition-all">
            <MessageCircle className="w-5 h-5" />
            Pesan Sekarang
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}