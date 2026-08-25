'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Shield, Zap, ArrowRight } from 'lucide-react';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';
import { WordsPullUp } from '@/components/ui/prisma-hero';

const features = [
  {
    icon: Shield,
    title: 'Anti Plagiarisme',
    desc: 'Dijamin 0% plagiarisme dengan hasil berkualitas',
  },
  {
    icon: Zap,
    title: 'Proses Cepat',
    desc: 'Pengerjaan super ngebut sesuai deadline',
  },
  {
    icon: CheckCircle,
    title: 'Garansi Revisi',
    desc: 'Revisi unlimited hingga puas',
  },
  {
    icon: FileText,
    title: 'File Lengkap',
    desc: 'PDF & Word sesuai kebutuhan Anda',
  },
];

// Animated counter stat
function AnimatedStat({
  value,
  decimals = 0,
  suffix = '+',
  decimalSeparator = ',',
  label,
  className = '',
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  decimalSeparator?: string;
  label: string;
  className?: string;
}) {
  const counter = useCounterAnimation({
    target: value,
    duration: 2000,
    decimals,
    suffix,
    decimalSeparator,
    startOnView: false,
  });

  return (
    <div className={`text-center lg:text-left ${className}`}>
      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white [text-shadow:_0_2px_10px_rgba(0,0,0,0.95)]">
        <span ref={counter.ref}>{counter.display}</span>
      </p>
      <p className="text-white/90 text-xs sm:text-sm font-semibold mt-0.5 [text-shadow:_0_2px_6px_rgba(0,0,0,0.9)]">
        {label}
      </p>
    </div>
  );
}

export default function Hero() {
  const [ratingValue, setRatingValue] = useState<number>(4.8);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch('/api/testimonials', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const sum = data.reduce((acc: number, curr: { rating?: number }) => acc + (curr.rating || 5), 0);
            const avg = Number((sum / data.length).toFixed(1));
            if (!isNaN(avg) && avg > 0) {
              setRatingValue(avg);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch rating for hero:', err);
      }
    };

    fetchRating();
    const interval = setInterval(fetchRating, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-20 flex items-center justify-center bg-black">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
      />

      {/* Noise overlay */}
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.4] mix-blend-overlay" />

      {/* Gradient overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/85" />

      <div className="container-custom relative z-10 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
          {/* Left Column: Text & Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider [text-shadow:_0_2px_8px_rgba(0,0,0,0.9)]">
                Trusted by 20K+ Customers
              </span>
            </motion.div>

            {/* Main Heading - WordsPullUp Animation */}
            <div className="mb-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white tracking-tight [text-shadow:_0_4px_20px_rgba(0,0,0,1),_0_2px_10px_rgba(0,0,0,0.9)]">
                <WordsPullUp text="SOOBIN" />
              </h1>
            </div>

            {/* Subtitle */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-wide [text-shadow:_0_3px_14px_rgba(0,0,0,1),_0_2px_8px_rgba(0,0,0,0.9)]">
                <WordsPullUp text="TURNITIN & PARAFRASE" />
              </h2>
            </div>

            {/* Description */}
            <motion.p
              className="text-base sm:text-lg md:text-xl text-white font-medium leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 [text-shadow:_0_2px_10px_rgba(0,0,0,0.95)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Termurah di Pasaran dan Trusted 20K+ Customer. Solusi Akademik Terpercaya untuk Tugas, Skripsi, & Cek Plagiarisme.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.a
                href="https://wa.me/6287815797525?text=Halo%20Kak%20Mau%20Joki%20Tugas"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-extrabold py-3.5 px-7 rounded-2xl text-center shadow-2xl shadow-green-500/40 text-sm sm:text-base flex items-center justify-center gap-2 [text-shadow:_0_2px_6px_rgba(0,0,0,0.9)]"
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 10px 40px rgba(34, 197, 94, 0.5)',
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <span>Pesan via WhatsApp</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </motion.a>
              <motion.a
                href="/layanan"
                className="w-full sm:w-auto bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 text-white font-bold py-3.5 px-7 rounded-2xl text-center text-sm sm:text-base shadow-xl [text-shadow:_0_2px_6px_rgba(0,0,0,0.9)]"
                whileHover={{
                  scale: 1.03,
                  borderColor: 'rgba(255,255,255,0.6)',
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                Lihat Harga & Layanan
              </motion.a>
            </motion.div>

            {/* Stats - Simple Format */}
            <motion.div
              className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <AnimatedStat value={20000} label="Customer" suffix="+" />
              <AnimatedStat value={30000} label="Tugas Selesai" suffix="+" />
              <AnimatedStat key={ratingValue} value={ratingValue} decimals={1} decimalSeparator="." label="Rating" suffix="★" />
            </motion.div>
          </motion.div>

          {/* Right Column: Feature Cards */}
          <motion.div
            className="flex-1 w-full max-w-md lg:max-w-none"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-black/50 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 shadow-2xl hover:border-white/40 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{
                    scale: 1.03,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]" />
                  <h3 className="text-white font-extrabold text-base sm:text-lg mb-1.5 [text-shadow:_0_2px_8px_rgba(0,0,0,0.95)]">
                    {feature.title}
                  </h3>
                  <p className="text-white/90 text-xs sm:text-sm font-medium leading-relaxed [text-shadow:_0_2px_6px_rgba(0,0,0,0.9)]">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:block z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2 backdrop-blur-xs">
          <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
        </div>
      </motion.div>
    </section>
  );
}