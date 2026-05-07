'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

// Carousel testimonials (first 6 from the main list)
const carouselTestimonials = [
  {
    id: 1,
    name: 'Rina Wulandari',
    university: 'Universitas Indonesia',
    rating: 5,
    layanan: 'Joki Skripsi + Cek Turnitin',
    message: 'Skripsi saya selesai tepat waktu dengan hasil yang memuaskan. Similarity Turnitin hanya 8%. Terima kasih Soobin!',
    date: '2 minggu lalu',
  },
  {
    id: 2,
    name: 'Ahmad Pratama',
    university: 'ITB',
    rating: 5,
    layanan: 'Cek Turnitin 6x + Parafrase',
    message: 'Pelayanannya cepat dan hasilnya akurat. Harga paling murah dibanding tempat lain. Highly recommended!',
    date: '3 minggu lalu',
  },
  {
    id: 3,
    name: 'Siti Nurhaliza',
    university: 'UGM',
    rating: 5,
    layanan: 'Joki Makalah + Daftar Pustaka',
    message: 'Makalahnya berkualitas tinggi dan sesuai deadline. Revisi gratis sampai puas. Admin ramah banget!',
    date: '1 bulan lalu',
  },
  {
    id: 4,
    name: 'Budi Santoso',
    university: 'Unpad',
    rating: 5,
    layanan: 'Unlock Jurnal Elsevier + Springer',
    message: 'Berhasil unlock semua jurnal yang saya butuhkan untuk skripsi. Proses cepat cuma 30 menit!',
    date: '1 bulan lalu',
  },
  {
    id: 5,
    name: 'Dewi Lestari',
    university: 'IPB',
    rating: 5,
    layanan: 'Olah Data SPSS + Joki Tugas',
    message: 'Data SPSS saya diolah dengan sempurna. Hasilnya rapi dan mudah dipahami. Makasih banyak!',
    date: '2 bulan lalu',
  },
  {
    id: 6,
    name: 'Farhan Rizki',
    university: 'ITS',
    rating: 5,
    layanan: 'Joki Coding + Google Colab',
    message: 'Kode Python untuk machine learning saya dibuatkan dengan penjelasan lengkap. Nilai akhirnya A!',
    date: '2 bulan lalu',
  },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = carouselTestimonials.length;
  const visibleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goTo = (index: number) => {
    setCurrent(index);
  };

  // Auto-scroll
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  return (
    <section
      className="py-16 md:py-24 bg-gray-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark-800 mb-4">
            Testimoni Customer
          </h2>
          <p className="text-gray-600 text-lg">
            Apa kata mereka yang sudah menggunakan layanan kami
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-yellow-500 font-bold">4,9</span>
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-gray-500">Rating</span>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 hover:scale-110 transition-all -ml-4 md:ml-0"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 hover:scale-110 transition-all -mr-4 md:mr-0"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Cards */}
          <div className="overflow-hidden px-4 md:px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                {[0, 1, 2].map((offset) => {
                  const index = (current + offset) % totalSlides;
                  const testi = carouselTestimonials[index];
                  return (
                    <motion.div
                      key={testi.id}
                      className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary-800 hover:shadow-lg transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: offset * 0.1 }}
                      whileHover={{
                        y: -4,
                        boxShadow: '0 12px 24px rgba(15, 39, 68, 0.15)',
                      }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary-800 rounded-full flex items-center justify-center text-white font-bold">
                            {testi.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-dark-800">{testi.name}</p>
                            <p className="text-gray-500 text-sm">{testi.university}</p>
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(testi.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>

                      {/* Layanan */}
                      <div className="bg-primary-800/10 text-primary-800 text-xs font-medium px-3 py-1 rounded-full inline-block mb-3">
                        {testi.layanan}
                      </div>

                      {/* Message */}
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-4">
                        &quot;{testi.message}&quot;
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-gray-400 text-xs">{testi.date}</span>
                        <a
                          href="https://wa.me/6287815797525"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-green-500 hover:text-green-600 text-sm font-medium"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Chat Admin
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {carouselTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === current
                    ? 'bg-primary-800 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All CTA */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a
            href="/testimoni"
            className="inline-flex items-center text-primary-800 font-semibold hover:text-primary-600 transition-colors"
          >
            Lihat semua testimoni
            <ChevronRight className="w-5 h-5 ml-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}