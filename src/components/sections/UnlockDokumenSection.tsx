'use client';

import { motion } from 'framer-motion';
import { Unlock, Globe, FileKey, Star } from 'lucide-react';

const freeSites = [
  { name: 'Bartleby', price: '2k' },
  { name: 'Academia', price: '2k' },
  { name: 'Numerade', price: '3k' },
  { name: 'Quizlet', price: '2k' },
  { name: 'Scribd', price: '2k' },
  { name: 'Chegg', price: '2k' },
  { name: 'Studocu', price: '3k' },
  { name: 'Slideshare', price: '3k' },
  { name: 'Coursehero', price: '3k' },
  { name: 'Scribd Book', price: '3k' },
  { name: 'Sage', price: '3k' },
  { name: 'Wiley', price: '3k' },
];

const academicSites = [
  { name: 'ResearchGate', price: '3k' },
  { name: 'ISTOR', price: '3k' },
  { name: 'IEEE', price: '3k' },
  { name: 'Springer', price: '3k' },
  { name: 'ACS', price: '4.5k' },
  { name: 'Elsevier', price: '4.5k' },
  { name: 'Emerald', price: '4.5k' },
  { name: 'Oxford', price: '4.5k' },
  { name: 'Cambridge', price: '4.5k' },
  { name: 'Nature', price: '4.5k' },
  { name: 'APA Psycnet', price: '4.5k' },
  { name: 'Scientific', price: '4.5k' },
];

const SiteCard = ({ name, price, index }: { name: string; price: string; index: number }) => (
  <motion.div
    className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex items-center justify-between"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.03 }}
    whileHover={{
      scale: 1.02,
      borderColor: 'rgb(15, 39, 68)',
      boxShadow: '0 8px 24px rgba(15, 39, 68, 0.1)',
    }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center gap-2 sm:gap-3">
      <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-primary-800" />
      <span className="text-gray-700 font-medium text-xs sm:text-sm">{name}</span>
    </div>
    <span className="text-primary-800 font-bold text-xs sm:text-sm">{price}</span>
  </motion.div>
);

export default function UnlockDokumenSection() {
  return (
    <section id="unlock-dokumen" className="bg-white section-padding">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-primary-800/10 text-primary-800 font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full mb-3 sm:mb-4">
            Unlock Dokumen
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-800 mb-3 sm:mb-4">
            UNLOCK DOKUMEN
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg px-4">
            Unlock Dokumen Termurah untuk Keperluan Kuliah dan Sekolah
          </p>
        </motion.div>

        {/* Free Sites Section */}
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <FileKey className="w-4 h-4 sm:w-5 sm:h-5 text-primary-800" />
            <h3 className="text-lg sm:text-xl font-bold text-dark-800">Platform Umum</h3>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {freeSites.map((site, index) => (
              <SiteCard key={site.name} {...site} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Academic Sites Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary-800" />
            <h3 className="text-lg sm:text-xl font-bold text-dark-800">Platform Akademik</h3>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {academicSites.map((site, index) => (
              <SiteCard key={site.name} {...site} index={index + freeSites.length} />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-8 sm:mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.a
            href="https://wa.me/6287815797525?text=Halo%20Kak%20Mau%20Unlock%20Dokumen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary-800 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl shadow-lg shadow-primary-800/30 text-sm sm:text-base"
            whileHover={{
              scale: 1.02,
              boxShadow: '0 10px 40px rgba(15, 39, 68, 0.5)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Unlock className="w-4 h-4 sm:w-5 sm:h-5" />
            Pesan Unlock Sekarang
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}