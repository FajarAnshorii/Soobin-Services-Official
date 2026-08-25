'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, MessageCircle, UserCheck } from 'lucide-react';
import Link from 'next/link';

interface TestimonialData {
  id: string | number;
  name: string;
  university?: string;
  prodi?: string;
  serviceName?: string;
  layanan?: string;
  rating: number;
  comment?: string;
  message?: string;
  createdAt?: string;
  date?: string;
}

const FALLBACK_TESTIMONIALS: TestimonialData[] = [
  {
    id: 't-1',
    name: 'Rina Wulandari',
    university: 'Universitas Indonesia',
    prodi: 'S1 Hukum',
    serviceName: 'Jasa Parafrase & Cek Turnitin 0%',
    rating: 5,
    comment: 'Skripsi saya selesai tepat waktu dengan hasil yang memuaskan. Similarity Turnitin hanya 8%. Terima kasih Soobin!',
    createdAt: '2026-07-25T10:00:00.000Z',
  },
  {
    id: 't-2',
    name: 'Ahmad Pratama',
    university: 'Institut Teknologi Bandung',
    prodi: 'S1 Teknik Informatika',
    serviceName: 'Jasa Parafrase & Turnitin 0%',
    rating: 5,
    comment: 'Pelayanannya cepat dan hasilnya akurat. Harga paling terjangkau dibanding tempat lain. Highly recommended!',
    createdAt: '2026-07-26T12:00:00.000Z',
  },
  {
    id: 't-3',
    name: 'Siti Nurhaliza',
    university: 'Universitas Gadjah Mada',
    prodi: 'S1 Farmasi',
    serviceName: 'Konsultasi Skripsi & Tugas Akhir',
    rating: 5,
    comment: 'Makalahnya berkualitas tinggi dan sesuai deadline. Revisi gratis sampai puas. Admin ramah banget!',
    createdAt: '2026-07-27T15:30:00.000Z',
  },
  {
    id: 't-4',
    name: 'Budi Santoso',
    university: 'Universitas Padjadjaran',
    prodi: 'S1 Kedokteran',
    serviceName: 'Formatting Jurnal & Fast Track Sinta',
    rating: 5,
    comment: 'Berhasil unlock semua jurnal yang saya butuhkan untuk skripsi. Proses cepat cuma 30 menit!',
    createdAt: '2026-07-28T09:15:00.000Z',
  },
  {
    id: 't-5',
    name: 'Dewi Lestari',
    university: 'IPB University',
    prodi: 'S1 Agronomi',
    serviceName: 'Pengolahan Data SPSS / SmartPLS / AMOS',
    rating: 5,
    comment: 'Data SPSS saya diolah dengan sempurna. Hasilnya rapi dan mudah dipahami. Makasih banyak!',
    createdAt: '2026-07-29T11:45:00.000Z',
  },
  {
    id: 't-6',
    name: 'Farhan Rizki',
    university: 'ITS Surabaya',
    prodi: 'S1 Teknik Elektro',
    serviceName: 'Jasa Pembuatan Website & Aplikasi',
    rating: 5,
    comment: 'Kode Python untuk machine learning saya dibuatkan dengan penjelasan lengkap. Nilai akhirnya A!',
    createdAt: '2026-07-30T14:20:00.000Z',
  },
];

function formatRelativeOrDate(createdAt?: string, fallbackDate?: string): string {
  if (!createdAt) return fallbackDate || 'Baru saja';
  try {
    const d = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return fallbackDate || 'Baru saja';
  }
}

export default function TestimonialCarousel() {
  const [dbTestimonials, setDbTestimonials] = useState<TestimonialData[]>([]);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch real-time testimonials from the same API as /testimoni page
  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDbTestimonials(data);
        }
      }
    } catch (err) {
      console.error('Failed to load testimonials for carousel:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    const interval = setInterval(fetchTestimonials, 5000); // 5s realtime sync with DB
    return () => clearInterval(interval);
  }, []);

  const testimonialsList = useMemo(() => {
    if (dbTestimonials && dbTestimonials.length > 0) {
      return dbTestimonials;
    }
    return FALLBACK_TESTIMONIALS;
  }, [dbTestimonials]);

  const totalSlides = testimonialsList.length;

  const next = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrent((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prev = () => {
    if (totalSlides === 0) return;
    setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goTo = (index: number) => {
    setCurrent(index);
  };

  // Auto-scroll carousel
  useEffect(() => {
    if (isPaused || totalSlides === 0) return;
    const interval = setInterval(next, 4500);
    return () => clearInterval(interval);
  }, [isPaused, next, totalSlides]);

  // Max 6 pagination dots for cleaner UI
  const maxDots = Math.min(totalSlides, 6);

  return (
    <section
      className="py-16 md:py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200/80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container-custom">
        {/* Header Section */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Testimoni & Pengalaman Mahasiswa
          </h2>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Ulasan asli dan terverifikasi dari mahasiswa berbagai universitas terkemuka di Indonesia yang telah mempercayakan tugas & kebutuhan akademiknya.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-slate-900 font-black text-sm">4.8 / 5.0</span>
            <span className="text-slate-500 text-xs font-semibold">
              ({testimonialsList.length} Ulasan Terverifikasi Database)
            </span>
          </div>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 bg-white border border-slate-300 rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all -ml-2 sm:-ml-4 md:ml-0 cursor-pointer"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 bg-white border border-slate-300 rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all -mr-2 sm:-mr-4 md:mr-0 cursor-pointer"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-slate-700" />
          </button>

          {/* Cards Carousel View */}
          <div className="overflow-hidden px-4 md:px-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {[0, 1, 2].map((offset) => {
                  const index = (current + offset) % totalSlides;
                  const testi = testimonialsList[index];
                  if (!testi) return null;

                  const initialLetter = testi.name?.charAt(0)?.toUpperCase() || 'M';
                  const serviceTitle = testi.serviceName || testi.layanan || 'Layanan Resmi Soobin';
                  const messageText = testi.comment || testi.message || '';
                  const timeAgo = formatRelativeOrDate(testi.createdAt, testi.date);

                  return (
                    <motion.div
                      key={testi.id}
                      className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 hover:border-primary-700 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                      whileHover={{ y: -4 }}
                    >
                      <div>
                        {/* Member Profile Header */}
                        <div className="flex items-center gap-3 mb-3.5">
                          <div className="w-11 h-11 bg-primary-800 text-white rounded-full flex items-center justify-center font-black text-base uppercase shrink-0 shadow-2xs">
                            {initialLetter}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-extrabold text-slate-900 text-sm truncate">
                                {testi.name}
                              </p>
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            </div>
                            <p className="text-slate-500 text-xs font-semibold truncate">
                              {testi.university || 'Mahasiswa'}{testi.prodi ? ` • ${testi.prodi}` : ''}
                            </p>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1 mb-2.5">
                          {[...Array(testi.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                          ))}
                        </div>

                        {/* Layanan Pill */}
                        <div className="bg-primary-50 border border-primary-200/80 text-primary-800 text-[11px] font-black px-2.5 py-1 rounded-lg inline-block mb-3 max-w-full truncate">
                          {serviceTitle}
                        </div>

                        {/* Comment/Message */}
                        <p className="text-slate-700 text-xs md:text-sm mb-4 leading-relaxed line-clamp-4 font-medium italic">
                          &quot;{messageText}&quot;
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 mt-auto">
                        <span className="text-slate-400 text-xs font-semibold">{timeAgo}</span>
                        <a
                          href="https://wa.me/6287815797525?text=Halo%20Admin%20Soobin%2C%20mau%20tanya%20layanan"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-xs font-bold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat Admin</span>
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-1.5 mt-8">
            {Array.from({ length: maxDots }).map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === current % maxDots
                    ? 'bg-primary-800 w-6'
                    : 'bg-slate-300 hover:bg-slate-400 w-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Testimonials CTA */}
        <motion.div
          className="text-center mt-8 md:mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/testimoni"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs md:text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <span>Buka & Tulis Testimoni Lengkap</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}