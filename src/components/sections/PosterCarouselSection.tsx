'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FramerCarousel } from '@/components/ui/framer-carousel';
import { Megaphone, ExternalLink, ChevronDown } from 'lucide-react';

export default function PosterCarouselSection() {
  return (
    <section className="py-6 sm:py-10 bg-gradient-to-b from-gray-50/80 via-white to-gray-50/50 border-b border-gray-100 overflow-hidden relative">
      {/* Ambient decorative blur background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* KOLOM KIRI: Framer Poster Carousel */}
          <div className="lg:col-span-7 w-full order-2 lg:order-1">
            <FramerCarousel autoPlay={true} interval={4500} />
          </div>

          {/* KOLOM KANAN: INFO PENGUMUMAN + Double Arrow Menunjuk ke Kiri */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-2 pl-0 lg:pl-4">
            {/* Judul: INFO PENGUMUMAN */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              INFO PENGUMUMAN
            </h2>

            {/* Subtitle / Penjelasan Singkat */}
            <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-md leading-relaxed">
              Dapatkan informasi promo menarik, klaim <strong>diskon 5% Cek Turnitin & Cek AI</strong> untuk member baru, serta cek ulasan harian di <strong>Channel WhatsApp Resmi</strong> kami.
            </p>

            {/* Double Arrow Animasi Menunjuk ke Carousel: Bawah di Mobile, Kiri di Desktop */}
            {/* Tampilan Desktop (Menunjuk ke Kiri) */}
            <div className="hidden lg:flex items-center gap-3 my-4 sm:my-5">
              <motion.div
                animate={{ x: [0, -8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  ease: "easeInOut"
                }}
                className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 drop-shadow-md"
              >
                <Image
                  src="/images/icons/arrow-left-double.png"
                  alt="Panah menunjuk ke carousel"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
              <span className="text-xs font-semibold text-primary-800 bg-primary-100/70 px-3.5 py-1.5 rounded-xl border border-primary-200/60 shadow-xs">
                Geser / Klik Poster di Samping 👈
              </span>
            </div>

            {/* Tampilan Mobile (Menunjuk ke Bawah dengan Animasi Halus) */}
            <div className="flex lg:hidden items-center justify-center gap-2 my-3.5 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-800 shadow-2xs">
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut"
                }}
                className="flex items-center justify-center text-primary-700"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
              <span className="text-xs font-bold">
                Geser / Ketuk Poster di Bawah 👇
              </span>
            </div>

            {/* Tombol Aksi Langsung ke WhatsApp */}
            <a
              href="https://wa.me/628990415500?text=Halo%20Admin%20Soobin%2C%20mau%20tanya%20info%20promo%20dan%20layanan%20dong"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-800 text-white hover:bg-primary-700 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 mb-1 lg:mb-0"
            >
              <span>Hubungi Admin WhatsApp</span>
              <ExternalLink className="w-4 h-4" />
            </a>

          </div>

        </div>
      </div>
    </section>
  );
}
