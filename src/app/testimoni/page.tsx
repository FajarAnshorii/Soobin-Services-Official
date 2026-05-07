'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, MessageCircle, CheckCircle, Filter, X } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Rina Wulandari',
    university: 'Universitas Indonesia',
    rating: 5,
    layanan: 'Joki Skripsi + Cek Turnitin',
    message: 'Skripsi saya selesai tepat waktu dengan hasil yang memuaskan. Similarity Turnitin hanya 8%. Terima kasih Soobin!',
    date: '2 minggu lalu',
  },
  {
    id: 2,
    name: 'Ahmad Pratama',
    university: 'ITB',
    rating: 5,
    layanan: 'Cek Turnitin 6x + Parafrase',
    message: 'Pelayanannya cepat dan hasilnya akurat. Harga paling murah dibanding tempat lain. Highly recommended!',
    date: '3 minggu lalu',
  },
  {
    id: 3,
    name: 'Siti Nurhaliza',
    university: 'UGM',
    rating: 5,
    layanan: 'Joki Makalah + Daftar Pustaka',
    message: 'Makalahnya berkualitas tinggi dan sesuai deadline. Revisi gratis sampai puas. Admin ramah banget!',
    date: '1 bulan lalu',
  },
  {
    id: 4,
    name: 'Budi Santoso',
    university: 'Unpad',
    rating: 5,
    layanan: 'Unlock Jurnal Elsevier + Springer',
    message: 'Berhasil unlock semua jurnal yang saya butuhkan untuk skripsi. Proses cepat cuma 30 menit!',
    date: '1 bulan lalu',
  },
  {
    id: 5,
    name: 'Dewi Lestari',
    university: 'IPB',
    rating: 5,
    layanan: 'Olah Data SPSS + Joki Tugas',
    message: 'Data SPSS saya diolah dengan sempurna. Hasilnya rapi dan mudah dipahami. Makasih banyak!',
    date: '2 bulan lalu',
  },
  {
    id: 6,
    name: 'Farhan Rizki',
    university: 'ITS',
    rating: 5,
    layanan: 'Joki Coding + Google Colab',
    message: 'Kode Python untuk machine learning saya dibuatkan dengan penjelasan lengkap. Nilai akhirnya A!',
    date: '2 bulan lalu',
  },
  {
    id: 7,
    name: 'Maya Putri',
    university: 'Unhas',
    rating: 5,
    layanan: 'Joki Essay + Translate Grammar',
    message: 'Essay bahasa Inggris saya hasilnya sangat natural, tidak terlihat di-translate. Worth it banget!',
    date: '3 bulan lalu',
  },
  {
    id: 8,
    name: 'Hendra Wijaya',
    university: 'Undip',
    rating: 5,
    layanan: 'Joki Skripsi Paket Lengkap',
    message: 'Skripsi dari awal sampai akhir dikerjakan dengan profesional. Semua jurusan bisa ditangani. Mantap!',
    date: '3 bulan lalu',
  },
  {
    id: 9,
    name: 'Anisa Rahman',
    university: 'UNAIR',
    rating: 5,
    layanan: 'Cek AI + Parafrase',
    message: 'Hasil cek AI sangat detail dan parafrasenya berkualitas. Sangat membantu sekali!',
    date: '4 bulan lalu',
  },
  {
    id: 10,
    name: 'Rizky Ramadhan',
    university: 'Telkom University',
    rating: 5,
    layanan: 'Joki Tugas Coding + Olah Data Python',
    message: 'Tugas algoritma dan data science saya dikerjakan dengan bagus. Kode nya clean dan ada komentar. Recommended!',
    date: '1 minggu lalu',
  },
  {
    id: 11,
    name: 'Putri Ayu Lestari',
    university: 'UPI Bandung',
    rating: 5,
    layanan: 'Joki Makalah + PPT',
    message: 'Makalah dan PPT nya bagus banget! Dosen langsung acc tanpa revisi. Makasih ya!',
    date: '2 minggu lalu',
  },
  {
    id: 12,
    name: 'Andi Saputra',
    university: 'UNHAS',
    rating: 5,
    layanan: 'Unlock Chegg + Course Hero',
    message: 'Berhasil unlock semua dokumen yang saya butuhkan untuk tugas akhir. Proses cepat dan harga terjangkau!',
    date: '1 bulan lalu',
  },
  {
    id: 13,
    name: 'Nadia Putri',
    university: 'UIKA Bogor',
    rating: 5,
    layanan: 'Joki Skripsi Bab 1-3',
    message: 'Bab 1-3 skripsi saya selesai 2 minggu. Hasilnya memuaskan dan sesuai standar akademik. Terima kasih!',
    date: '2 bulan lalu',
  },
  {
    id: 14,
    name: 'Bayu Firmansyah',
    university: 'Universitas Brawijaya',
    rating: 5,
    layanan: 'Cek Turnitin 3x + Parafrase',
    message: 'Turnitin awal 45% jadi turun ke 8% setelah parafrase. Mantap banget hasilnya!',
    date: '3 bulan lalu',
  },
  {
    id: 15,
    name: 'Salsa Amalia',
    university: 'Universitas Diponegoro',
    rating: 5,
    layanan: 'Joki Jurnal + Review Jurnal',
    message: 'Jurnal yang saya minta sesuai dengan topik penelitian. Review jurnalnya juga detail dan membantu!',
    date: '3 bulan lalu',
  },
  {
    id: 16,
    name: 'Reza Pahlevi',
    university: 'Politeknik Negeri Bandung',
    rating: 5,
    layanan: 'Joki Laporan Praktikum + Data',
    message: 'Laporan praktikum saya dikerjakan rapi dengan data yang akurat. Nilainya bagus!',
    date: '4 bulan lalu',
  },
  {
    id: 17,
    name: 'Lisa Amelia',
    university: 'Universitas Padjadjaran',
    rating: 5,
    layanan: 'Joki Essay + Daftar Pustaka',
    message: 'Essay dan daftar pustakanya rapi dan sesuai format. Semua referensi valid!',
    date: '4 bulan lalu',
  },
  {
    id: 18,
    name: 'Dimas Prasetyo',
    university: 'Universitas Sebelas Maret',
    rating: 5,
    layanan: 'Unlock Jurnal IEEE + ACM',
    message: 'Berhasil unlock jurnal untuk skripsi. File lengkap dan kualitas bagus. Recommended!',
    date: '5 bulan lalu',
  },
  {
    id: 19,
    name: 'Ratu Zahra',
    university: 'Universitas Andalas',
    rating: 5,
    layanan: 'Joki Makalah Hukum + Cek Turnitin',
    message: 'Makalah hukum saya bagus dan lolos uji turnitin. Terima kasih banyak!',
    date: '5 bulan lalu',
  },
  {
    id: 20,
    name: 'Fajar Nugroho',
    university: 'Universitas Gadjah Mada',
    rating: 5,
    layanan: 'Olah Data SPSS + Eviews',
    message: 'Data penelitian saya diolah dengan sempurna. Hasil regresi dan olah datanya lengkap. Mantap!',
    date: '5 bulan lalu',
  },
  {
    id: 21,
    name: 'Tyas Nurjanah',
    university: 'IKIP Bandung',
    rating: 5,
    layanan: 'Joki Tugas IPS + Sejarah',
    message: 'Tugas IPS dan sejarah dikerjakan dengan cepat dan hasilnya bagus. Makasih!',
    date: '6 bulan lalu',
  },
  {
    id: 22,
    name: 'Galang Akbar',
    university: 'Institut Teknologi Sepuluh Nopember',
    rating: 5,
    layanan: 'Joki Coding Java + Python',
    message: 'Kode aplikasi web saya dikerjakan profesional. Ada dokumentasi lengkap. Nilai A!',
    date: '6 bulan lalu',
  },
  {
    id: 23,
    name: 'Vina Nuraini',
    university: 'Universitas Ahmad Dahlan',
    rating: 5,
    layanan: 'Joki Skripsi + Simulasi',
    message: 'Skripsi dan simulasi dengan MATLAB hasilnya memuaskan. Dosen suka!',
    date: '6 bulan lalu',
  },
  {
    id: 24,
    name: 'Ari Wijaya',
    university: 'Universitas Trisakti',
    rating: 5,
    layanan: 'Unlock Jurnal Emerald + Springer',
    message: 'Berhasil unlock jurnal-jurnal penting untuk literature review. Proses cepat!',
    date: '7 bulan lalu',
  },
  {
    id: 25,
    name: 'Nurul Hidayati',
    university: 'Universitas Negeri Jakarta',
    rating: 5,
    layanan: 'Joki Makalah + Cek Turnitin',
    message: 'Makalah langsung acc tanpa revisi. Turnitin cuma 5%. Puas banget!',
    date: '1 minggu lalu',
  },
  {
    id: 26,
    name: 'Yoga Pratama',
    university: 'Universitas Muhammadiyah Yogyakarta',
    rating: 5,
    layanan: 'Joki Coding React + Web',
    message: 'Website portfolio saya dikerjakan dengan bagus. Desain modern dan responsif!',
    date: '2 minggu lalu',
  },
  {
    id: 27,
    name: 'Sari Wulandari',
    university: 'Universitas Hasanuddin',
    rating: 5,
    layanan: 'Joki Skripsi Akuntansi',
    message: 'Skripsi akuntansi dari awal sampai akhir ditangani. Hasilnya memuaskan!',
    date: '1 bulan lalu',
  },
  {
    id: 28,
    name: 'Bagas Rahman',
    university: 'Universitas Lambung Mangkurat',
    rating: 5,
    layanan: 'Cek Turnitin + Parafrase Jurnal',
    message: 'Jurnal yang diparafrase hasilnya bagus dan lolos turnitin. Mantap!',
    date: '1 bulan lalu',
  },
  {
    id: 29,
    name: 'Indah Permata',
    university: 'Universitas Riau',
    rating: 5,
    layanan: 'Joki PPT + Materi',
    message: 'PPT dan materi presentasi berkualitas tinggi. Dosen puji!',
    date: '2 bulan lalu',
  },
  {
    id: 30,
    name: 'Denny Kurniawan',
    university: 'Politeknik Negeri Jakarta',
    rating: 5,
    layanan: 'Joki Laporan KP + Data',
    message: 'Laporan kerja praktik dan olah datanya lengkap. Nilai bagus!',
    date: '2 bulan lalu',
  },
  {
    id: 31,
    name: 'Aulia Rahman',
    university: 'Universitas Sultan Ageng Tirtayasa',
    rating: 5,
    layanan: 'Unlock Jurnal Wiley + Nature',
    message: 'Berhasil unlock jurnal Nature dan Wiley untuk penelitian saya. Cepat dan akurat!',
    date: '2 bulan lalu',
  },
  {
    id: 32,
    name: 'Riska Putri',
    university: 'Universitas Pendidikan Indonesia',
    rating: 5,
    layanan: 'Joki Tugas Matematika + Fisika',
    message: 'Soal matematika dan fisika diselesaikan dengan detail. Ada langkah penyelesaiannya!',
    date: '3 bulan lalu',
  },
  {
    id: 33,
    name: 'Fadhil Akbar',
    university: 'Institut Teknologi Bandung',
    rating: 5,
    layanan: 'Joki Skripsi Teknik + Simulasi',
    message: 'Skripsi teknik mesin dengan simulasi FEM hasilnya akurat. Dosen puas!',
    date: '3 bulan lalu',
  },
  {
    id: 34,
    name: 'Mega Nurjanah',
    university: 'Universitas Islam Indonesia',
    rating: 5,
    layanan: 'Joki Makalah + Translate Grammar',
    message: 'Translate dan grammar check nya membantu banget. Hasil sangat natural!',
    date: '4 bulan lalu',
  },
  {
    id: 35,
    name: 'Rama Pratama',
    university: 'Universitas Mercu Buana',
    rating: 5,
    layanan: 'Joki Tugas Hukum + Case Study',
    message: 'Tugas hukum dan case study dihandle profesional. Referensi lengkap!',
    date: '4 bulan lalu',
  },
  {
    id: 36,
    name: 'Putri Handayani',
    university: 'Universitas Mulawarman',
    rating: 5,
    layanan: 'Joki Skripsi + Konsultasi',
    message: 'Skripsi selesai dengan konsultasi rutin. Hasil sesuai ekspektasi!',
    date: '4 bulan lalu',
  },
  {
    id: 37,
    name: 'Hafiz Rahman',
    university: 'Universitas Islam Negeri Jakarta',
    rating: 5,
    layanan: 'Joki Essay + Daftar Pustaka',
    message: 'Essay dan daftar pustaka sesuai format. Semua referensi valid dan terakreditasi!',
    date: '5 bulan lalu',
  },
  {
    id: 38,
    name: 'Dina Kartika',
    university: 'Universitas Andalas',
    rating: 5,
    layanan: 'Olah Data Eviews + Hasil',
    message: 'Data panel dan regresi diolah dengan Eviews hasilnya lengkap dan bisa langsung digunakan!',
    date: '5 bulan lalu',
  },
  {
    id: 39,
    name: 'Ari Santoso',
    university: 'Universitas Tanjungpura',
    rating: 5,
    layanan: 'Unlock Jurnal + Bab Literature',
    message: 'Unlock jurnal + bab 2 literature review nya lengkap. Sangat membantu skripsi!',
    date: '6 bulan lalu',
  },
  {
    id: 40,
    name: 'Yuni Rahmawati',
    university: 'Universitas Lampung',
    rating: 5,
    layanan: 'Joki Makalah + PPT Presentasi',
    message: 'Makalah dan presentasi powerpoint nya bagus dan profesional. Acc langsung!',
    date: '6 bulan lalu',
  },
  {
    id: 41,
    name: 'Rizki Amelia',
    university: 'Universitas Sam Ratulangi',
    rating: 5,
    layanan: 'Joki Coding + SQL Database',
    message: 'Project database dan query SQL dikerjakan sempurna. Ada dokumentasi lengkap!',
    date: '6 bulan lalu',
  },
  {
    id: 42,
    name: 'Windy Permata Sari',
    university: 'Universitas Benggolo',
    rating: 5,
    layanan: 'Joki Skripsi Hukum + Daftar Pustaka',
    message: 'Skripsi hukum dengan referensi UU yang lengkap. Sangat membantu!',
    date: '7 bulan lalu',
  },
  {
    id: 43,
    name: 'Asep Sudrajat',
    university: 'Politeknik Negeri Malang',
    rating: 5,
    layanan: 'Cek Turnitin 6x + Revisi',
    message: 'Paket 6x turnitin sangat hemat. Revisi parafrase juga gratis!',
    date: '7 bulan lalu',
  },
  {
    id: 44,
    name: 'Nella Syahputri',
    university: 'Universitas Riau',
    rating: 5,
    layanan: 'Joki Jurnal + Bab 1-2',
    message: 'Jurnal dan bab 1-2 sesuai template.Hasilnya profesional dan sesuai standar!',
    date: '7 bulan lalu',
  },
  {
    id: 45,
    name: 'Hendra Gunawan',
    university: 'Universitas Pasundan',
    rating: 5,
    layanan: 'Unlock Jurnal + E-Book',
    message: 'Berhasil unlock textbook dan jurnal untuk tugas akhir. File jernih!',
    date: '8 bulan lalu',
  },
  {
    id: 46,
    name: 'Lina Marlina',
    university: 'Universitas Indonesia',
    rating: 5,
    layanan: 'Joki Makalah Ekonomi + Grafik',
    message: 'Makalah ekonomi dengan grafik dan data analisis yang lengkap. Nilai A!',
    date: '8 bulan lalu',
  },
  {
    id: 47,
    name: 'Bayu Ardiansyah',
    university: 'Institut Teknologi Sumatera',
    rating: 5,
    layanan: 'Joki Coding + Algoritma',
    message: 'Soal algoritma dan pemrograman diselesaikan dengan benar. Ada penjelasan logika!',
    date: '8 bulan lalu',
  },
  {
    id: 48,
    name: 'Diah Kusuma',
    university: 'Universitas Merdeka Malang',
    rating: 5,
    layanan: 'Joki Skripsi + Bab 4-5',
    message: 'Skripsi bab 4-5 termasuk analisis dan pembahasan dihandle dengan baik!',
    date: '9 bulan lalu',
  },
  {
    id: 49,
    name: 'Rizky Ramadhan',
    university: 'Universitas Malikussaleh',
    rating: 5,
    layanan: 'Cek AI + Parafrase Massal',
    message: 'Parafrase massal untuk 20 dokumen berhasil. Semua lolos uji AI detection!',
    date: '9 bulan lalu',
  },
  {
    id: 50,
    name: 'Angga Pratama',
    university: 'Universitas Muhammadiyah Bandung',
    rating: 5,
    layanan: 'Joki Tugas + Penyelesaian',
    message: 'Tugas dengan berbagai mata kuliah dikerjakan tepat waktu. Puas!',
    date: '10 bulan lalu',
  },
  {
    id: 51,
    name: 'Sinta Nurhaliza',
    university: 'Universitas Islam Negeri Sunan Kalijaga',
    rating: 5,
    layanan: 'Joki Skripsi + Bimbingan',
    message: 'Skripsi dari awal hingga sidang siap ditangani dengan bimbingan intensif!',
    date: '10 bulan lalu',
  },
  {
    id: 52,
    name: 'Doni Saputra',
    university: 'Universitas Bengkulu',
    rating: 5,
    layanan: 'Unlock Dokumen + Joki Makalah',
    message: 'Kombinasi unlock dokumen dan joki makalah sangat membantu. Terima kasih!',
    date: '11 bulan lalu',
  },
];

const categories = [
  { id: 'all', label: 'Semua' },
  { id: 'joki-skripsi', label: 'Joki Skripsi' },
  { id: 'joki-makalah', label: 'Joki Makalah' },
  { id: 'joki-tugas', label: 'Joki Tugas' },
  { id: 'joki-coding', label: 'Joki Coding' },
  { id: 'turnitin', label: 'Cek Turnitin' },
  { id: 'parafrase', label: 'Parafrase' },
  { id: 'unlock-dokumen', label: 'Unlock Dokumen' },
  { id: 'olah-data', label: 'Olah Data' },
];

export default function TestimoniPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRating, setSelectedRating] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const filteredTestimonials = selectedCategory === 'all' && selectedRating === 0
    ? testimonials
    : testimonials.filter((testi) => {
        const cat = testi.layanan.toLowerCase();
        const matchCategory = selectedCategory === 'all' || (() => {
          switch (selectedCategory) {
            case 'joki-skripsi': return cat.includes('skripsi');
            case 'joki-makalah': return cat.includes('makalah');
            case 'joki-tugas': return cat.includes('tugas') && !cat.includes('skripsi') && !cat.includes('makalah') && !cat.includes('coding');
            case 'joki-coding': return cat.includes('coding');
            case 'turnitin': return cat.includes('turnitin');
            case 'parafrase': return cat.includes('parafrase');
            case 'unlock-dokumen': return cat.includes('unlock');
            case 'olah-data': return cat.includes('olah data') || cat.includes('spss') || cat.includes('eviews');
            default: return true;
          }
        })();
        const matchRating = selectedRating === 0 || testi.rating >= selectedRating;
        return matchCategory && matchRating;
      });

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlay || filteredTestimonials.slice(0, 6).length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev >= Math.min(filteredTestimonials.slice(0, 6).length - 1, 5) ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlay, filteredTestimonials]);

  // Calculate dynamic statistics
  const stats = useMemo(() => {
    const totalReviews = testimonials.length;
    const avgRating = (testimonials.reduce((sum, t) => sum + t.rating, 0) / totalReviews).toFixed(1);
    const rating5Count = testimonials.filter(t => t.rating === 5).length;
    const rating4UpCount = testimonials.filter(t => t.rating >= 4).length;
    const fiveStarPercent = Math.round((rating5Count / totalReviews) * 100);
    return { totalReviews, avgRating, rating5Count, rating4UpCount, fiveStarPercent };
  }, []);

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    filteredTestimonials.forEach(t => {
      if (dist[t.rating] !== undefined) dist[t.rating]++;
    });
    return dist;
  }, [filteredTestimonials]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark-800 via-primary-900 to-dark-800 pt-32 pb-16">
        <div className="container-custom">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Testimoni Customer
            </motion.h1>
            <motion.p
              className="text-gray-300 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Apa kata mereka yang sudah menggunakan layanan Soobin Services
            </motion.p>
            <motion.div
              className="flex items-center justify-center gap-2 mt-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.8 + i * 0.1, type: "spring", stiffness: 200 }}
                  >
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                ))}
              </div>
              <motion.span
                className="text-yellow-400 font-bold text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                4,9
              </motion.span>
              <svg className="w-6 h-6 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <motion.span
                className="text-gray-400 ml-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                Rating
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-8 border-b">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: filteredTestimonials.length, color: "text-primary-800", label: "Testimonial Ditampilkan" },
              { value: parseFloat(stats.avgRating), color: "text-yellow-500", label: "Rating Rata-rata" },
              { value: ratingDistribution[5], color: "text-green-500", label: "Rating 5 Bintang" },
              { value: ratingDistribution[4] + ratingDistribution[3], color: "text-primary-800", label: "Rating 4-3 Bintang" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
              >
                <motion.p
                  className={`text-3xl font-black ${stat.color}`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: i * 0.15 + 0.2, type: "spring", stiffness: 200 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rating Distribution Bar */}
      <section className="bg-gray-50 py-6 border-b">
        <div className="container-custom">
          <div className="max-w-xl mx-auto">
            <h3 className="text-sm font-semibold text-dark-800 mb-4 text-center">Distribusi Rating</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingDistribution[star as keyof typeof ratingDistribution];
                const percent = filteredTestimonials.length > 0 ? Math.round((count / filteredTestimonials.length) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm text-gray-600">{star}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          star === 5 ? 'bg-green-500' : star === 4 ? 'bg-primary-600' : 'bg-gray-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">{count}</span>
                    <span className="text-xs text-gray-400 w-10">({percent}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12">
        <div className="container-custom">
          {/* Filter Category */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary-800" />
              <h2 className="text-lg font-bold text-dark-800">Filter Kategori Layanan</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? 'bg-primary-800 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-800 hover:text-primary-800'
                  }`}
                >
                  {cat.label}
                  {cat.id !== 'all' && (
                    <span className="ml-1 text-xs opacity-70">
                      ({testimonials.filter(t => {
                        const catL = t.layanan.toLowerCase();
                        switch (cat.id) {
                          case 'joki-skripsi': return catL.includes('skripsi');
                          case 'joki-makalah': return catL.includes('makalah');
                          case 'joki-tugas': return catL.includes('tugas') && !catL.includes('skripsi') && !catL.includes('makalah') && !catL.includes('coding');
                          case 'joki-coding': return catL.includes('coding');
                          case 'turnitin': return catL.includes('turnitin');
                          case 'parafrase': return catL.includes('parafrase');
                          case 'unlock-dokumen': return catL.includes('unlock');
                          case 'olah-data': return catL.includes('olah data') || catL.includes('spss') || catL.includes('eviews');
                          default: return false;
                        }
                      }).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-3 flex items-center gap-1 text-sm text-gray-500 hover:text-primary-800 transition-colors"
              >
                <X className="w-4 h-4" />
                Reset Filter
              </button>
            )}
          </div>

          {/* Result Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              Menampilkan <span className="font-bold text-primary-800">{filteredTestimonials.length}</span> testimonial
              {selectedCategory !== 'all' && ` dari kategori "${categories.find(c => c.id === selectedCategory)?.label}"`}
              {selectedRating > 0 && ` dengan rating ${selectedRating}+ bintang`}
            </p>
          </div>

          {/* Filter Rating */}
          <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <h3 className="text-sm font-semibold text-dark-800">Filter Rating Bintang</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {[0, 5, 4, 3].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedRating === rating
                      ? 'bg-yellow-400 text-dark-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'
                  }`}
                >
                  {rating === 0 ? (
                    <>
                      <Star className="w-4 h-4" />
                      Semua Rating
                    </>
                  ) : (
                    <>
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                      <span className="text-xs opacity-70">ke atas</span>
                    </>
                  )}
                </button>
              ))}
            </div>
            {selectedRating > 0 && (
              <button
                onClick={() => setSelectedRating(0)}
                className="mt-3 flex items-center gap-1 text-sm text-gray-500 hover:text-primary-800 transition-colors"
              >
                <X className="w-4 h-4" />
                Reset Rating
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((testi, index) => (
              <motion.div
                key={testi.id}
                className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary-800 hover:shadow-xl transition-all duration-500 cursor-pointer"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (index % 6) * 0.1, duration: 0.5, ease: "easeOut" }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-800/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badge */}
                <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  testi.rating === 5 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {testi.rating === 5 ? 'Sempurna' : 'Baik'}
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary-800 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300">
                        {testi.name.charAt(0)}
                      </div>
                      {/* Ring effect */}
                      <div className="absolute inset-0 rounded-full border-2 border-primary-800/30 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark-800 group-hover:text-primary-800 transition-colors duration-300">{testi.name}</p>
                      <p className="text-gray-500 text-sm">{testi.university}</p>
                    </div>
                  </div>
                  <CheckCircle className={`w-5 h-5 transition-all duration-300 ${testi.rating === 5 ? 'text-green-500' : 'text-gray-300'}`} />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3 relative z-10">
                  {[...Array(testi.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180, opacity: 0 }}
                      whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                      whileHover={{ scale: 1.3, rotate: 15, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                      transition={{ delay: i * 0.08, type: "spring", stiffness: 260, damping: 20 }}
                      viewport={{ once: true }}
                      className="cursor-pointer"
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
                    </motion.div>
                  ))}
                  <motion.span initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} viewport={{ once: true }} className="ml-2 text-sm font-bold text-yellow-600">{testi.rating}.0</motion.span>
                </div>

                {/* Layanan */}
                <div className="bg-primary-800/10 text-primary-800 text-xs font-medium px-3 py-1 rounded-full inline-block mb-3 group-hover:bg-primary-800 group-hover:text-white transition-all duration-300 relative z-10">
                  {testi.layanan}
                </div>

                {/* Message */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 relative z-10">
                  &quot;{testi.message}&quot;
                </p>

                {/* Quote Icon Animation */}
                <motion.div initial={{ opacity: 0, scale: 0, y: 20 }} whileInView={{ opacity: 0.08, scale: 1, y: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} viewport={{ once: true }} className="absolute top-6 left-6 text-7xl text-primary-800 font-serif leading-none select-none pointer-events-none">&ldquo;</motion.div>
                <motion.div initial={{ opacity: 0, scale: 0, y: -20 }} whileInView={{ opacity: 0.08, scale: 1, y: 0 }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }} viewport={{ once: true }} className="absolute bottom-16 right-6 text-7xl text-primary-800 font-serif leading-none select-none rotate-180 pointer-events-none">&ldquo;</motion.div>

                {/* Expand hint */}
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
                  <span className="text-primary-800 text-xs font-medium">Chat Admin</span>
                  <MessageCircle className="w-4 h-4 text-green-500" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 relative z-10">
                  <span className="text-gray-400 text-xs">{testi.date}</span>
                  <a
                    href="https://wa.me/6287815797525"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-green-500 hover:text-green-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat Admin
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Auto-play Slider with Dot Navigation */}
      <section className="py-12 bg-white border-t">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-dark-800 mb-2">Testimoni Populer</h2>
            <p className="text-gray-500">Testimoni customer favorit yang bisa kamu lihat</p>
          </div>

          {/* Auto-play Slider */}
          <div
            className="relative overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            {/* Auto-play indicator */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-dark-800/80 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className={`w-2 h-2 rounded-full ${isAutoPlay ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-white text-xs font-medium">{isAutoPlay ? 'Auto-play' : 'Paused'}</span>
            </div>

            {/* Slides Container */}
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {filteredTestimonials.slice(0, 6).map((testi, index) => (
                <div key={testi.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gradient-to-br from-primary-800 to-dark-800 rounded-2xl p-8 text-white text-center">
                    <motion.div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} viewport={{ once: true }}>{testi.name.charAt(0)}</motion.div>
                    <motion.div className="flex items-center justify-center gap-1 mb-3">
                      {[...Array(testi.rating)].map((_, i) => (
                        <motion.div key={i} initial={{ scale: 0, rotate: -90 }} whileInView={{ scale: 1, rotate: 0 }} transition={{ delay: i * 0.1, type: "spring" }} viewport={{ once: true }}>
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        </motion.div>
                      ))}
                    </motion.div>
                    <motion.div className="bg-white/20 text-xs font-medium px-3 py-1 rounded-full inline-block mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }}>{testi.layanan}</motion.div>
                    <motion.p className="text-lg italic mb-4 max-w-2xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} viewport={{ once: true }}>&quot;{testi.message}&quot;</motion.p>
                    <motion.p className="font-semibold" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }}>{testi.name}</motion.p>
                    <motion.p className="text-white/70 text-sm" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }} viewport={{ once: true }}>{testi.university}</motion.p>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrow Navigation */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? Math.min(filteredTestimonials.slice(0, 6).length - 1, 5) : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
            >
              <svg className="w-5 h-5 text-dark-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev >= Math.min(filteredTestimonials.slice(0, 6).length - 1, 5) ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
            >
              <svg className="w-5 h-5 text-dark-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dot Navigation */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {filteredTestimonials.slice(0, 6).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'w-8 bg-primary-800'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>{currentSlide + 1} / {Math.min(filteredTestimonials.slice(0, 6).length, 6)}</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-800 py-12">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Puas dengan Layanan Kami?
          </h2>
          <p className="text-gray-400 mb-6">
            Yuk jadi customer berikutnya yang puas!
          </p>
          <a
            href="https://wa.me/6287815797525?text=Halo%20Kak%20Mau%20Pesan%20Layanan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5" />
            Pesan Sekarang
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}