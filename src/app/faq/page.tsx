'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, Search, ArrowUp, X } from 'lucide-react';

const faqs = [
  {
    category: 'Umum',
    questions: [
      { q: 'Bagaimana cara memesan layanan di Soobin Services?', a: 'Cukup klik tombol WhatsApp yang tersedia, kemudian chat admin dengan menyebutkan layanan yang diinginkan. Admin akan memberikan informasi harga dan estimasi waktu pengerjaan.' },
      { q: 'Apakah Soobin Services terpercaya?', a: 'Ya! Kami sudah dipercaya oleh 20.000+ customer dengan rating 4,9. Semua pengerjaan dijamin 0% plagiarisme dan support revisi sampai puas.' },
      { q: 'Bagaimana sistem pembayarannya?', a: 'Pembayaran dilakukan via transfer bank atau e-wallet. DP 50% di awal, dan pelunasan setelah pekerjaan selesai. Untuk layanan kecil, pembayaran full di awal.' },
      { q: 'Apakah ada garansi revise?', a: 'Ya! Semua layanan dilengkapi garansi revise unlimited sampai Anda puas. Jika ada kesalahan dari pihak kami, revisi gratis.' },
    ],
  },
  {
    category: 'Cek Turnitin & AI',
    questions: [
      { q: 'Berapa lama proses cek Turnitin?', a: 'Proses cek Turnitin sangat cepat, hanya beberapa menit saja. Anda tinggal kirim file dan terima hasilnya!' },
      { q: 'Apakah hasil cek Turnitin akurat?', a: 'Ya, kami menggunakan tools resmi dan terupdate sehingga hasilnya 100% akurat dan bisa digunakan untuk submission.' },
      { q: 'Apa bedanya Cek Turnitin dan Cek AI?', a: 'Cek Turnitin mendeteksi kemiripan dengan dokumen lain (plagiarisme), sedangkan Cek AI mendeteksi apakah konten ditulis oleh AI seperti ChatGPT.' },
      { q: 'Apakah bisa cek berkali-kali?', a: 'Bisa! Kami tersedia paket 1x, 3x, dan 6x cek dengan harga yang semakin hemat.' },
    ],
  },
  {
    category: 'Parafrase',
    questions: [
      { q: 'Apa itu parafrase?', a: 'Parafrase adalah mengubah kalimat dari sumber lain dengan kata-kata sendiri tanpa mengubah makna. Hasilnya tetap 0% plagiarisme.' },
      { q: 'Berapa lama proses parafrase?', a: 'Depends on panjang dokumen. Rata-rata 1-2 hari untuk dokumen standar. Untuk dokumen besar, bisa diskusi dengan admin.' },
      { q: 'Apakah bisa parafrase dalam bahasa Inggris?', a: 'Ya! Kami bisa parafrase dalam berbagai bahasa, termasuk Bahasa Inggris, Indonesia, dan bahasa lainnya.' },
    ],
  },
  {
    category: 'Joki Tugas & Skripsi',
    questions: [
      { q: 'Semua jurusan bisa ditangani?', a: 'Ya! Kami memiliki tim writer yang berpengalaman di berbagai bidang: Teknik, Sains, Sosial, Hukum, Kedokteran, Ekonomi, dll.' },
      { q: 'Apakah hasil joki tugas original?', a: 'Tentu! Semua pengerjaan dibuatkan dari 0 (bukan copas) sehingga dijamin 0% plagiarisme.' },
      { q: 'Bagaimana jika hasil tidak sesuai ekspektasi?', a: 'Jangan khawatir! Kami memberikan garansi revise unlimited. Silakan communicate dengan admin untuk revisi sesuai kebutuhan.' },
      { q: 'Apakah bisa minta bantuan hanya untuk sebagian tugas?', a: 'Bisa! Kami menerima request untuk bagian tertentu saja, seperti Bab 2 saja, Daftar Pustaka saja, dll.' },
    ],
  },
  {
    category: 'Unlock Dokumen',
    questions: [
      { q: 'Platform apa saja yang bisa di-unlock?', a: 'Kami bisa unlock berbagai platform: Scribd, Chegg, Course Hero, Studocu, dan semua jurnal akademik seperti Elsevier, Springer, IEEE, Emerald, dll.' },
      { q: 'Berapa lama proses unlock?', a: 'Rata-rata hanya 15-30 menit! Proses unlock bisa lebih lama tergantung kesulitan platform.' },
      { q: 'File unlock dikirim dalam format apa?', a: 'File dikirim dalam format PDF atau sesuai format aslinya. Kualitas dokumen dijamin sama dengan versi premium.' },
    ],
  },
];

export default function FaqPage() {
  const [openQuestions, setOpenQuestions] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  const toggleQuestion = (id: string) => {
    setOpenQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter((q) =>
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  const visibleCategories = activeTab === 'all'
    ? filteredFaqs
    : filteredFaqs.filter((cat) => cat.category.toLowerCase().includes(activeTab.toLowerCase()));

  const allCategories = ['all', ...faqs.map((f) => f.category)];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark-800 via-primary-900 to-dark-800 pt-24 sm:pt-32 pb-10 sm:pb-16 px-4">
        <div className="container-custom">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p
              className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Temukan jawaban untuk pertanyaan yang sering ditanyakan
            </motion.p>
            <motion.div
              className="flex items-center justify-center gap-1 mt-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.7 + i * 0.1, type: "spring", stiffness: 200 }}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </motion.div>
              ))}
              <motion.span className="text-white font-bold ml-2 text-sm sm:text-base" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                4,9
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-3 sm:py-4 bg-white border-b sticky top-16 md:top-20 z-40">
        <div className="container-custom px-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
            <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-primary-800 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
              <span className="font-bold text-primary-800">{faqs.reduce((acc, cat) => acc + cat.questions.length, 0)}</span> pertanyaan
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-3 sm:py-4 bg-gray-50">
        <div className="container-custom px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {allCategories.map((cat, index) => (
              <motion.button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeTab === cat ? 'bg-primary-800 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-800 hover:text-primary-800'
                }`}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {cat === 'all' ? 'Semua' : cat}
                {cat !== 'all' && <span className="ml-1 text-xs opacity-70">({faqs.find((f) => f.category === cat)?.questions.length || 0})</span>}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-8 sm:py-12">
        <div className="container-custom px-4">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab + searchQuery} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {visibleCategories.length === 0 ? (
                <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-gray-500 text-base sm:text-lg">Pertanyaan tidak ditemukan</p>
                  <p className="text-gray-400 text-sm mt-2">Coba kata kunci lain</p>
                </motion.div>
              ) : (
                visibleCategories.map((category, catIndex) => (
                  <div key={category.category} className="mb-8 sm:mb-12">
                    <motion.div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: catIndex * 0.1 }}>
                      <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary-800" />
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-dark-800">{category.category}</h2>
                      <span className="bg-primary-800/10 text-primary-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                        {category.questions.length}
                      </span>
                    </motion.div>
                    <div className="space-y-3 sm:space-y-4">
                      {category.questions.map((item, qIndex) => {
                        const questionId = `${category.category}-${qIndex}`;
                        const isOpen = openQuestions[questionId];
                        return (
                          <motion.div key={questionId} className="bg-white rounded-xl border border-gray-200 overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (catIndex * 0.1) + (qIndex * 0.05) }} layout>
                            <button onClick={() => toggleQuestion(questionId)} className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-50 transition-colors">
                              <span className="font-semibold text-dark-800 text-sm sm:text-base pr-4">{item.q}</span>
                              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                              </motion.div>
                            </button>
                            <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                              <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                                <div className="w-8 sm:w-10 h-0.5 bg-primary-800/20 mb-3 rounded-full" />
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.a}</p>
                              </div>
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="bg-primary-800 py-10 sm:py-12">
        <div className="container-custom px-4 text-center">
          <motion.h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Masih Ada Pertanyaan?
          </motion.h2>
          <motion.p className="text-white mb-5 sm:mb-6 text-sm sm:text-base" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Tim kami siap membantu 24 jam via WhatsApp
          </motion.p>
          <motion.a
            href="https://wa.me/6287815797525?text=Halo%20Kak%20Saya%20Mau%20Tanya%20Tentang%20Layanan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-sm sm:text-base transition-all"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-5 h-5" />
            Chat WhatsApp
          </motion.a>
        </div>
      </section>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50">
            <motion.button
              onClick={scrollToTop}
              className="w-11 h-11 sm:w-12 sm:h-12 bg-primary-800 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}