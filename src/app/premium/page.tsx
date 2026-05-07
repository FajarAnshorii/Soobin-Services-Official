'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion } from 'framer-motion';

export default function PremiumPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark-800 via-primary-900 to-dark-800 pt-32 pb-16">
        <div className="container-custom">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Premium
            </motion.h1>
            <motion.p
              className="text-gray-300 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Menyediakan Layanan Berlangganan Aplikasi Premium beragam mulai dari aplikasi streaming, aplikasi pembelajaran, dan lainnya
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content - Coming Soon */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center py-20">
            <motion.div
              className="bg-gray-100 rounded-2xl p-12 max-w-lg mx-auto relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            >
              {/* Background Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary-800/5 to-transparent"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Lock Icon with Pulse & Float */}
              <motion.div
                className="w-20 h-20 bg-primary-800/10 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                animate={{
                  y: [0, -10, 0],
                  boxShadow: [
                    "0 0 0 0 rgba(26, 35, 126, 0.4)",
                    "0 0 0 15px rgba(26, 35, 126, 0)",
                  ],
                }}
                transition={{
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  boxShadow: { duration: 1.5, repeat: Infinity },
                }}
              >
                <motion.svg
                  className="w-10 h-10 text-primary-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{
                    rotate: [0, -5, 5, -5, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </motion.svg>
              </motion.div>

              {/* Title with Typing Effect */}
              <motion.h2
                className="text-2xl font-bold text-dark-800 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                🔒 Layanan Terkunci
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-gray-500 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Layanan Premium sedang dalam pengembangan.
              </motion.p>

              {/* Animated dots */}
              <motion.div
                className="flex items-center justify-center gap-1 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 bg-primary-800 rounded-full"
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>

              {/* Secondary Text */}
              <motion.p
                className="text-gray-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                Stay tuned untuk fitur eksklusif!<br />
                Harga dan katalog akan segera diupdate.
              </motion.p>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-primary-800/20 rounded-tl-xl"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 1.2 }}
              />
              <motion.div
                className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-primary-800/20 rounded-br-xl"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 1.3 }}
              />

              {/* Progress Bar Animation */}
              <motion.div
                className="mt-6 w-full h-1 bg-gray-200 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-800 to-primary-600"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.5, duration: 2, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Loading Text */}
              <motion.p
                className="text-xs text-gray-400 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Memuat konten...
              </motion.p>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, type: "spring" }}
            >
              {[
                { emoji: "🎬", label: "Streaming", desc: "Coming Soon" },
                { emoji: "📚", label: "Pembelajaran", desc: "Coming Soon" },
                { emoji: "🎵", label: "Musik", desc: "Coming Soon" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="bg-white p-6 rounded-xl border border-gray-200 relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.9 + index * 0.1 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* Lock Overlay */}
                  <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="text-3xl mb-4">{item.emoji}</div>
                  <h3 className="font-semibold text-dark-800 mb-2">{item.label}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}