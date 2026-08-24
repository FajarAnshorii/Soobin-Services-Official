'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ZoomIn, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface PosterItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

const posters: PosterItem[] = [
  {
    id: 'poster-wa',
    title: 'Testimoni di Channel WhatsApp',
    subtitle: 'Scan QR atau gabung channel WA resmi kami untuk update ulasan harian!',
    image: '/images/posters/poster-wa-channel.png',
    link: 'https://wa.me/628990415500?text=Halo%20Admin%20Soobin%2C%20mau%20gabung%20Channel%20WhatsApp%20resmi%20dong'
  },
  {
    id: 'poster-diskon',
    title: 'Diskon 5% Member Baru',
    subtitle: 'Klaim kupon potongan harga 5% untuk semua jenis layanan akademik!',
    image: '/images/posters/poster-diskon-member.png',
    link: 'https://wa.me/628990415500?text=Halo%20Admin%20Soobin%2C%20saya%20member%20baru%20mau%20klaim%20diskon%205%25'
  },
  {
    id: 'poster-sosmed',
    title: 'Media Sosial Resmi Soobin',
    subtitle: 'Pastikan hanya follow Instagram, TikTok, dan Website resmi kami!',
    image: '/images/posters/poster-sosmed-resmi.png',
    link: 'https://www.instagram.com/soobinservices.id/'
  }
];

// Multiplied to create a seamless infinite circular loop
const repeatedPosters = [
  ...posters,
  ...posters,
  ...posters,
  ...posters,
  ...posters,
  ...posters,
  ...posters,
  ...posters
];

export default function PosterCarouselSection() {
  const [selectedPoster, setSelectedPoster] = useState<PosterItem | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Smooth slow auto-scrolling to the right
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId: number;

    const step = () => {
      if (!isPaused && container) {
        // Slow continuous movement to the right (scrolling right / moving content left-to-right)
        container.scrollLeft += 0.6;

        // Reset seamlessly when reaching halfway
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused]);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth > 640 ? 460 : 310;
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth > 640 ? 460 : 310;
      scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-gray-50/80 via-white to-gray-50/50 border-b border-gray-100 overflow-hidden relative group/section">
      {/* Background subtle accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container-custom mb-5 sm:mb-7">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100/80 text-primary-800 border border-primary-200/60 shadow-xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
            <span>INFO & PROMO EKSKLUSIF</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Update Resmi & Penawaran Spesial
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto mt-1 px-4">
            Klik poster untuk memperbesar dan melihat info promo lebih jelas
          </p>
        </motion.div>
      </div>

      {/* Carousel Track with Left & Right Manual Control Arrows */}
      <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4">
        {/* Left Arrow Button */}
        <button
          onClick={handleScrollLeft}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-label="Geser ke kiri"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 text-gray-800 shadow-xl border border-gray-200/90 hover:bg-primary-800 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleScrollRight}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-label="Geser ke kanan"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 text-gray-800 shadow-xl border border-gray-200/90 hover:bg-primary-800 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Scrollable Container with Smooth Continuous Slow Motion */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2 px-8 sm:px-12 scroll-smooth cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {repeatedPosters.map((poster, index) => (
            <div
              key={`${poster.id}-${index}`}
              onClick={() => setSelectedPoster(poster)}
              className="group relative cursor-pointer flex-shrink-0 w-[290px] sm:w-[380px] md:w-[460px] lg:w-[500px] aspect-[16/9] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-primary-900/15 border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-1"
            >
              {/* Poster 1280x720 Image without any grey badge over text */}
              <Image
                src={poster.image}
                alt={poster.title}
                fill
                sizes="(max-width: 640px) 290px, (max-width: 768px) 380px, (max-width: 1024px) 460px, 500px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={index < 3}
              />

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-primary-900/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                <div className="px-3.5 py-1.5 rounded-xl bg-white/95 text-primary-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <ZoomIn className="w-4 h-4 text-primary-600" />
                  <span>Lihat Detail</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Preview Modal for Poster */}
      <AnimatePresence>
        {selectedPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPoster(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-100 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPoster(null)}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-gray-900/70 text-white hover:bg-gray-900 flex items-center justify-center transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>

              {/* 16:9 Image container (1280x720 ratio) */}
              <div className="relative w-full aspect-[16/9] bg-gray-900">
                <Image
                  src={selectedPoster.image}
                  alt={selectedPoster.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Info & Action button footer */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50 border-t border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                    {selectedPoster.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedPoster.subtitle}
                  </p>
                </div>
                {selectedPoster.link && (
                  <a
                    href={selectedPoster.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-800 text-white hover:bg-primary-700 text-xs sm:text-sm font-semibold transition-all shadow-md shrink-0 w-full sm:w-auto justify-center"
                  >
                    <span>Kunjungi Link Resmi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
