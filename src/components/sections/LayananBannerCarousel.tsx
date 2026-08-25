'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export interface BannerSlide {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
  badge?: string;
}

export const defaultBanners: BannerSlide[] = [
  {
    id: 1,
    image: '/images/posters/poster-diskon-member.png',
    title: 'Diskon 5% Khusus Cek Turnitin & AI',
    subtitle: 'Klaim diskon khusus akun Member untuk setiap pengecekan Turnitin No Repository & Cek AI ZeroGPT.',
    link: '/auth',
    badge: 'PROMO MEMBER',
  },
  {
    id: 2,
    image: '/images/posters/poster-wa-channel.png',
    title: 'Saluran WhatsApp & Testimoni Resmi',
    subtitle: 'Bergabung dengan ribuan mahasiswa lainnya untuk melihat update slot, promo harian, dan testimoni real.',
    link: 'https://wa.me/6287815797525?text=Halo%20Admin%20SOOBIN%2C%20mau%20gabung%20Saluran%20WhatsApp%20resmi%20dong',
    badge: 'UPDATE RESMI',
  },
  {
    id: 3,
    image: '/images/posters/poster-sosmed-resmi.png',
    title: 'Layanan Lengkap & Terpercaya 24 Jam',
    subtitle: 'Pengerjaan tugas akademik, skripsi, parafrase cepat, olah data statistik, dan review jurnal bergaransi.',
    link: 'https://wa.me/6287815797525?text=Halo%20Admin%20SOOBIN%2C%20mau%20konsultasi%20layanan%20akademik%20dong',
    badge: 'LAYANAN TERBAIK',
  },
];

export default function LayananBannerCarousel({
  banners = defaultBanners,
  autoPlayInterval = 4000,
}: {
  banners?: BannerSlide[];
  autoPlayInterval?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Autoplay timer
  useEffect(() => {
    if (isHovered || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isHovered, banners.length, autoPlayInterval]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto mb-6 sm:mb-7 relative group select-none px-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sleek Compact Banner Container (Not too tall, well-proportioned) */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 lg:h-72 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-950">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {banners[currentIndex].link ? (
              <a
                href={banners[currentIndex].link}
                target={banners[currentIndex].link.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="block w-full h-full relative cursor-pointer group/link"
              >
                <img
                  src={banners[currentIndex].image}
                  alt={banners[currentIndex].title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover/link:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </a>
            ) : (
              <div className="w-full h-full relative">
                <img
                  src={banners[currentIndex].image}
                  alt={banners[currentIndex].title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Floating Top Badge (Optional indicator of banner category) */}
        {banners[currentIndex].badge && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white border border-white/20 shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{banners[currentIndex].badge}</span>
            </span>
          </div>
        )}

        {/* Navigation Arrow: Previous */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Banner"
          className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-105 z-20 shadow-lg cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        {/* Navigation Arrow: Next */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Banner"
          className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-105 z-20 shadow-lg cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Carousel Indicators (1deastore style dots/pills) */}
        <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 shadow-lg">
          {banners.map((banner, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={banner.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-6 sm:w-8 bg-white shadow-xs'
                    : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
