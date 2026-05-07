'use client';

import { motion } from 'framer-motion';
import { Target, MessageCircle, CreditCard, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: Target,
    title: 'Pilih Layanan',
    desc: 'Pilih layanan yang Anda butuhkan dari berbagai pilihan yang tersedia',
  },
  {
    number: 2,
    icon: MessageCircle,
    title: 'Hubungi via WhatsApp',
    desc: 'Chat admin untuk konsultasi gratis dan konfirmasi pesanan',
  },
  {
    number: 3,
    icon: CreditCard,
    title: 'Konfirmasi & Bayar',
    desc: 'Lakukan pembayaran via transfer bank atau e-wallet',
  },
  {
    number: 4,
    icon: CheckCircle,
    title: 'Terima Hasil',
    desc: 'Dapatkan hasil pengerjaan sesuai deadline yang disepakati',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark-800 mb-4">
            Cara Kerja
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Proses pemesanan sangat mudah dan cepat, hanya dalam 4 langkah
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector Line - Desktop */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200">
            <motion.div
              className="h-full bg-primary-600 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Step Number Badge */}
                <motion.div
                  className="relative z-10 w-16 h-16 mx-auto mb-6 bg-primary-800 rounded-full flex items-center justify-center shadow-lg shadow-primary-800/30"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: index * 0.15,
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-white font-bold text-xl">
                    {step.number}
                  </span>
                </motion.div>

                {/* Icon */}
                <motion.div
                  className="w-14 h-14 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.15 + 0.1,
                    type: 'spring',
                    stiffness: 200,
                  }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: 'rgb(45, 100, 148)',
                  }}
                >
                  <step.icon className="w-7 h-7 text-primary-800" />
                </motion.div>

                {/* Content */}
                <h3 className="text-lg font-bold text-dark-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.a
            href="https://wa.me/6287815797525?text=Halo%20Kak%20Mau%20Tanya%20Layanan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-green-500/30"
            whileHover={{
              scale: 1.02,
              boxShadow: '0 10px 40px rgba(34, 197, 94, 0.4)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <MessageCircle className="w-5 h-5" />
            Mulai Pesan Sekarang
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}