'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CheckCircle, FileText, Shield, Zap } from 'lucide-react';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';

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

// Typewriter component
function TypewriterText({
  text,
  delay = 0,
  speed = 80,
  onComplete,
}: {
  text: string;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setDone(true);
          setTimeout(() => onComplete?.(), 200);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(startDelay);
  }, [text, delay, speed, onComplete]);

  return (
    <span>
      {displayed}
      {!done && (
        <span className="animate-blink text-primary-400 ml-0.5">|</span>
      )}
    </span>
  );
}

// Animated counter stat
function AnimatedStat({
    value,
    decimals = 0,
    suffix = '+',
    label,
    className = '',
  }: {
    value: number;
    decimals?: number;
    suffix?: string;
    label: string;
    className?: string;
  }) {
    const counter = useCounterAnimation({
      target: value,
      duration: 2000,
      decimals,
      suffix,
    });

    return (
      <div className={`text-center lg:text-left ${className}`}>
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          <span ref={counter.ref}>{counter.display}</span>
        </p>
        <p className="text-gray-400 text-xs sm:text-sm">{label}</p>
      </div>
    );
  }

export default function Hero() {
  const { scrollYProgress } = useScroll();

  // Parallax for background elements
  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, 30]);

  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [typewriterDone, setTypewriterDone] = useState(false);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-dark-800 via-primary-900 to-dark-800 overflow-hidden pt-20">
      {/* Background Pattern - Parallax */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{ y: bgY1 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </motion.div>

      {/* Decorative Elements - Parallax */}
      <motion.div
        className="absolute top-1/4 -left-20 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl"
        style={{ y: bgY2 }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl"
        style={{ y: bgY1 }}
      />

      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center min-h-[calc(100vh-5rem)] py-12 lg:py-20 gap-12">
          {/* Text Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                Trusted by 20K+ Customers
              </span>
            </motion.div>

            {/* Main Heading - Typewriter Effect */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              <TypewriterText
                text="SOOBIN"
                delay={300}
                speed={120}
                onComplete={() => {
                  setSubtitleVisible(true);
                }}
              />
            </h1>

            {/* Subtitle - Fade in after typewriter */}
            <motion.p
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: subtitleVisible ? 1 : 0, y: subtitleVisible ? 0 : 20 }}
              transition={{ duration: 0.4 }}
            >
              <TypewriterText
                text="TURNITIN & PARAFRASE"
                delay={0}
                speed={60}
                onComplete={() => setTypewriterDone(true)}
              />
            </motion.p>

            {/* Description */}
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: typewriterDone ? 1 : 0, y: typewriterDone ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              Termurah di Pasaran dan Trusted 20K+ Customer
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: typewriterDone ? 1 : 0, y: typewriterDone ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.a
                href="https://wa.me/6287815797525?text=Halo%20Kak%20Mau%20Joki%20Tugas"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-green-500 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl text-center shadow-lg shadow-green-500/30 text-sm sm:text-base"
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 10px 40px rgba(34, 197, 94, 0.4)',
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                Pesan via WhatsApp
              </motion.a>
              <motion.a
                href="/layanan"
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-xl text-center text-sm sm:text-base"
                whileHover={{
                  scale: 1.02,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                Lihat Harga
              </motion.a>
            </motion.div>

            {/* Stats - Animated Counters */}
            <motion.div
              className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <AnimatedStat value={10000} suffix="+" label="Customer" className="text-center lg:text-left" />
              <AnimatedStat value={30000} suffix="+" label="Tugas Selesai" className="text-center lg:text-left" />
              <AnimatedStat value={4.9} decimals={1} suffix="★" label="Rating" className="text-center lg:text-left" />
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            className="flex-1 w-full max-w-md lg:max-w-none"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{
                    scale: 1.03,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(61, 122, 181, 0.4)',
                    boxShadow: '0 8px 32px rgba(30, 77, 123, 0.3)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-400 mb-3 sm:mb-4" />
                  <h3 className="text-white font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Hide on small mobile */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}