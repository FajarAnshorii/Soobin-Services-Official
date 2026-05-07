'use client';

import { motion } from 'framer-motion';
import { FileCheck, Zap, Shield, Clock } from 'lucide-react';

const plans = [
  { amount: '1x', price: 'Rp 4.000', badge: null },
  { amount: '3x', price: 'Rp 12.000', badge: 'Hemat!' },
  { amount: '6x', price: 'Rp 24.000', badge: 'Best Deal!' },
];

const aiPlans = [
  { amount: '1x', price: 'Rp 5.000' },
  { amount: '2x', price: 'Rp 10.000' },
];

export default function TurnitinSection() {
  return (
    <section id="cek-turnitin" className="bg-gray-50 section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-primary-800/10 text-primary-800 font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full mb-4">
            Cek Plagiarisme
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-800 mb-4">
            CEK TURNITIN & CEK A.I
          </h2>
          <p className="text-gray-600 text-base sm:text-lg px-4">
            <span className="text-primary-800 font-bold text-xl sm:text-2xl">Rp 4.000/CEK</span>
            <br />
            Termurah di Pasaran dan Lebih dari 5K+ Files Checked
          </p>
        </motion.div>

        {/* Turnitin Plans */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary-800" />
            <h3 className="text-lg sm:text-xl font-bold text-dark-800">Cek Turnitin</h3>
            <span className="text-xs sm:text-sm text-gray-500 ml-auto hidden sm:inline">Harga Turnitin belum stabil</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.amount}
                className={`relative bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border-2 ${
                  plan.badge
                    ? 'border-primary-800 shadow-lg shadow-primary-800/10'
                    : 'border-gray-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 12px 32px rgba(15, 39, 68, 0.15)',
                  borderColor: 'rgb(15, 39, 68)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-black text-dark-800 mb-2">
                    {plan.price}
                  </p>
                  <p className="text-gray-500 font-medium text-sm sm:text-base">{plan.amount} Cek</p>
                </div>
                <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                  <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    Hasil akurat & detail
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    Proses cepat
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    Tinggal upload & done
                  </li>
                </ul>
                <motion.a
                  href="https://wa.me/6287815797525?text=Halo%20Kak%20Mau%20Cek%20Turnitin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 sm:mt-6 block w-full text-center font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base ${
                    plan.badge
                      ? 'bg-primary-800 text-white'
                      : 'bg-gray-100 text-dark-800'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  Pesan Sekarang
                </motion.a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Checker Plans */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            <h3 className="text-lg sm:text-xl font-bold text-dark-800">Cek AI (Detection)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {aiPlans.map((plan, index) => (
              <motion.div
                key={plan.amount}
                className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-purple-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  borderColor: 'rgb(147, 51, 234)',
                  boxShadow: '0 12px 32px rgba(147, 51, 234, 0.15)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-black text-purple-600 mb-2">
                    {plan.price}
                  </p>
                  <p className="text-gray-500 font-medium text-sm sm:text-base">{plan.amount} Cek AI</p>
                </div>
                <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                  <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                    Deteksi AI-generated content
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                    Hasil instan
                  </li>
                </ul>
                <motion.a
                  href="https://wa.me/6287815797525?text=Halo%20Kak%20Mau%20Cek%20AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 sm:mt-6 block w-full text-center bg-purple-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  Pesan Sekarang
                </motion.a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}