'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Code, BookOpen, Calculator, Pen, Languages,
  Presentation, ClipboardList, Database, FileSpreadsheet
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRealtimeServices } from '@/hooks/useRealtimeServices';

const DEFAULT_SUPPORTING = [
  { icon: Languages, label: 'Translate Grammar', price: 'Rp 2.000/Hal' },
  { icon: BookOpen, label: 'Daftar Pustaka', price: 'Rp 1.000/Sumber' },
  { icon: Presentation, label: 'Pembuatan PPT', price: 'Rp 3.000/Hal' },
  { icon: ClipboardList, label: 'Daftar Isi Otomatis', price: 'Rp 10.000' },
  { icon: FileText, label: 'Pengetikan File', price: 'Rp 1.000/Hal' },
  { icon: FileText, label: 'Review Jurnal', price: 'Rp 25.000/Review' },
];

const DEFAULT_MAIN = [
  { label: 'Joki Makalah', price: 'Start Rp 40.000' },
  { label: 'Joki Mendeley', price: 'Rp 1.000/Sumber' },
  { label: 'Joki Artikel', price: 'Start Rp 50.000' },
  { label: 'Joki Jurnal', price: 'Start Rp 70.000' },
  { label: 'Joki Essay', price: 'Start Rp 40.000' },
  { label: 'Joki Tugas Informatika', price: 'Chat Admin' },
  { label: 'Joki Tugas Coding', price: 'Chat Admin' },
  { label: 'Joki Pantun Dongeng', price: 'Chat Admin' },
  { label: 'Joki Laporan Praktikum', price: 'Chat Admin' },
  { label: 'Tugas Fisika/Kimia/Biologi', price: 'Chat Admin' },
  { label: 'Tugas MTK/Spatial/Aritmatika', price: 'Chat Admin' },
  { label: 'Tugas Hukum/Sosio/Psikologi', price: 'Chat Admin' },
  { label: 'Tugas Pendidikan/IPS', price: 'Chat Admin' },
  { label: 'Joki Google Colab', price: 'Chat Admin' },
  { label: 'Joki Resume / Rangkuman', price: 'Chat Admin' },
  { label: 'Tugas SMP,SMA,SMK', price: 'Chat Admin' },
  { label: 'Buat Lamaran Kerja', price: 'Chat Admin' },
  { label: 'Nomor Halaman', price: 'Chat Admin' },
];

export default function JokiTugasSection() {
  const { placeDirectOrder } = useCart();
  const { services: realtimeDbServices } = useRealtimeServices('joki-tugas');

  const { supportingServices, mainServicesList } = useMemo(() => {
    if (realtimeDbServices && realtimeDbServices.length > 0) {
      const supp = DEFAULT_SUPPORTING.map((s) => {
        const matched = realtimeDbServices.find((db: any) =>
          db.name?.toLowerCase().includes(s.label.toLowerCase()) ||
          s.label.toLowerCase().includes(db.name?.toLowerCase())
        );
        return matched ? { ...s, price: matched.price } : s;
      });

      const main = DEFAULT_MAIN.map((m) => {
        const matched = realtimeDbServices.find((db: any) =>
          db.name?.toLowerCase().includes(m.label.toLowerCase()) ||
          m.label.toLowerCase().includes(db.name?.toLowerCase())
        );
        return matched ? { ...m, price: matched.price } : m;
      });

      return { supportingServices: supp, mainServicesList: main };
    }
    return { supportingServices: DEFAULT_SUPPORTING, mainServicesList: DEFAULT_MAIN };
  }, [realtimeDbServices]);

  return (
    <section id="joki-tugas" className="bg-white section-padding">
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
            All Rounded Services
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-800 mb-3 sm:mb-4">
            JOKI TUGAS ALL ROUNDED
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Dikerjakan oleh yang berpengalaman, lebih dari <span className="text-primary-800 font-bold">5.000+ Tugas</span> dikerjakan
          </p>
        </motion.div>

        {/* Additional Services Grid */}
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg sm:text-xl font-bold text-dark-800 mb-4 sm:mb-6 flex items-center gap-2">
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-primary-800" />
            Layanan Pendukung
          </h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {supportingServices.map((service, index) => (
              <motion.div
                key={service.label}
                className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 flex items-center justify-between"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  scale: 1.02,
                  borderColor: 'rgb(15, 39, 68)',
                  boxShadow: '0 8px 24px rgba(15, 39, 68, 0.1)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <service.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-800" />
                  <span className="text-gray-700 font-medium text-xs sm:text-sm">{service.label}</span>
                </div>
                <span className="text-primary-800 font-bold text-xs sm:text-sm whitespace-nowrap">{service.price}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Services Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg sm:text-xl font-bold text-dark-800 mb-4 sm:mb-6 flex items-center gap-2">
            <Pen className="w-4 h-4 sm:w-5 sm:h-5 text-primary-800" />
            Layanan Utama
          </h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {mainServicesList.map((service, index) => (
              <motion.div
                key={service.label}
                className="bg-linear-to-br from-dark-800 to-primary-900 border border-primary-700/30 rounded-xl p-3 sm:p-4 lg:p-5 flex items-center justify-between"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 12px 32px rgba(15, 39, 68, 0.4)',
                  borderColor: 'rgba(61, 122, 181, 0.5)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-white font-medium text-xs sm:text-sm">{service.label}</span>
                <span className="text-primary-400 font-bold text-xs whitespace-nowrap ml-2">
                  {service.price}
                </span>
              </motion.div>
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
            href="https://wa.me/6287815797525?text=Halo%20Kak%20Mau%20Joki%20Tugas"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => placeDirectOrder("Joki Tugas")}
            className="inline-flex items-center gap-2 bg-primary-800 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl shadow-lg shadow-primary-800/30 text-sm sm:text-base"
            whileHover={{
              scale: 1.02,
              boxShadow: '0 10px 40px rgba(15, 39, 68, 0.5)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Pen className="w-4 h-4 sm:w-5 sm:h-5" />
            Pesan Joki Tugas Sekarang
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}