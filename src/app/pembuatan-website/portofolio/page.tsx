'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ExternalLink, Globe, Monitor, ShoppingCart, 
  GraduationCap, Database, BookMarked, Users, Laptop, Server, Palette, Zap
} from 'lucide-react';
import WhatsAppFloat from '@/components/WhatsAppFloat';

interface LocalNavbarProps {
  onExit: (e: React.MouseEvent) => void;
}

function LocalNavbar({ onExit }: LocalNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            {/* Standard Yellow Back Button with Divider */}
            <Link
              href="/"
              onClick={onExit}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors mr-2 border-r border-gray-200 pr-4"
              title="Kembali ke SOOBIN Services"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Link>

            <Link href="/pembuatan-website" className="flex items-center gap-2">
              <div className="relative w-36 h-12">
                <Image
                  src="/logo-jardev.png"
                  alt="JAR.DEV Logo"
                  fill
                  className="object-contain object-left animate-fade-in"
                  priority
                />
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/pembuatan-website/layanan" className="text-sm font-semibold text-gray-600 hover:text-amber-500 transition-colors">
              Layanan
            </Link>
            <Link href="/pembuatan-website#features" className="text-sm font-semibold text-gray-600 hover:text-amber-500 transition-colors">
              Keunggulan
            </Link>
            <Link href="/pembuatan-website/portofolio" className="text-sm font-bold text-amber-500 transition-colors">
              Portofolio
            </Link>
          </div>

          <div>
            <a
              href="https://wa.me/6287815797525?text=Halo%20JAR.DEV%2C%20saya%20tertarik%20untuk%20konsultasi%20pembuatan%20website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold bg-amber-400 hover:bg-amber-350 text-black shadow-lg shadow-amber-400/15 hover:shadow-amber-400/30 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Konsultasi Gratis
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

const portfolioProjects = [
  {
    id: 1,
    title: 'Sinar Sentosa Abadi',
    category: 'Company Profile',
    techStack: ['Next.js', 'TailwindCSS', 'Framer Motion'],
    desc: 'Website company profile representatif untuk perusahaan ekspor hasil bumi dengan fitur katalog ekspor interaktif, galeri perkebunan, dan form kontak multi-bahasa.',
    icon: Monitor,
    performance: '98%'
  },
  {
    id: 2,
    title: 'Hijabique Store',
    category: 'E-Commerce',
    techStack: ['React', 'RajaOngkir API', 'TailwindCSS'],
    desc: 'Platform toko online hijab & busana muslim premium yang terintegrasi dengan checkout keranjang belanja otomatis, kalkulator ongkir kurir nasional, dan order langsung via WhatsApp.',
    icon: ShoppingCart,
    performance: '95%'
  },
  {
    id: 3,
    title: 'Sistem Kasir Awan (SaaS POS)',
    category: 'Custom Web App',
    techStack: ['Next.js', 'PostgreSQL', 'Chart.js'],
    desc: 'Sistem point of sales multi-cabang berbasis awan (SaaS) untuk bisnis F&B dan retail dengan visualisasi data grafik penjualan, manajemen stok, dan laporan PDF otomatis.',
    icon: Database,
    performance: '94%'
  },
  {
    id: 4,
    title: 'SMK Negeri 1 Balikpapan',
    category: 'Portal Sekolah',
    techStack: ['Next.js', 'Express', 'TailwindCSS'],
    desc: 'Website portal resmi instansi sekolah menengah kejuruan lengkap dengan modul Pengumuman, Agenda Kegiatan, database guru & siswa, serta portal PPDB Online (Penerimaan Siswa Baru).',
    icon: GraduationCap,
    performance: '97%'
  },
  {
    id: 5,
    title: 'Berita Kita',
    category: 'Portal Berita / Media',
    techStack: ['Next.js', 'Google Adsense Ready', 'SEO AMP'],
    desc: 'Portal informasi berita dan artikel nasional berkecepatan tinggi yang dioptimasi secara penuh untuk iklan Adsense, sitemap dinamis, dan kecepatan akses di atas rata-rata industri.',
    icon: BookMarked,
    performance: '99%'
  },
  {
    id: 6,
    title: 'Dr. Lana (Specialist Portofolio)',
    category: 'Personal Brand',
    techStack: ['React', 'Framer Motion', 'TailwindCSS'],
    desc: 'Website portofolio pribadi dokter spesialis untuk meningkatkan personal branding, mempublikasikan jurnal medis, dan menyediakan fitur booking jadwal konsultasi.',
    icon: Users,
    performance: '99%'
  }
];

export default function PortofolioPage() {
  const [isExitingToSoobin, setIsExitingToSoobin] = useState(false);
  const router = useRouter();

  const handleExit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExitingToSoobin(true);
    setTimeout(() => {
      router.push('/');
      setTimeout(() => {
        setIsExitingToSoobin(false);
      }, 1000);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 pt-28 pb-16 font-sans selection:bg-amber-400 selection:text-black">
      
      {/* Local Navbar */}
      <LocalNavbar onExit={handleExit} />

      {/* Hero Header */}
      <div className="bg-linear-to-b from-amber-50/70 via-white to-slate-50 text-gray-800 py-16 relative overflow-hidden border-b border-amber-105">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.08),transparent_60%)]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-amber-400 bg-amber-400/10 rounded-full px-3.5 py-1 uppercase tracking-widest border border-amber-400/20"
          >
            Portofolio Hasil Karya Digital
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black mt-4 tracking-tight leading-tight text-gray-900"
          >
            Hasil Karya Pengembangan <span className="text-amber-550">JAR.DEV</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-3xl mx-auto mt-4 text-sm sm:text-base leading-relaxed"
          >
            Lihat berbagai contoh website dan sistem aplikasi berbasis web premium yang telah kami kembangkan.
            Setiap website dioptimalkan untuk performa Google PageSpeed tinggi, kompatibilitas mobile penuh, dan ramah SEO.
          </motion.p>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioProjects.map((project, i) => {
            const ProjectIcon = project.icon;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-gray-205 flex flex-col justify-between hover:border-amber-400/50 hover:shadow-[0_10px_35px_rgba(245,158,11,0.08)] transition-all duration-300 relative group"
              >
                <div>
                  {/* Category & Performance */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1 uppercase tracking-wider">
                      {project.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-2xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                      <Zap className="w-3.5 h-3.5 fill-emerald-500/10 text-emerald-600" />
                      <span>Speed: {project.performance}</span>
                    </div>
                  </div>

                  {/* Icon and Title block */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                      <ProjectIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-500 transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mt-2">
                    {project.desc}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-gray-150">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="text-3xs font-bold text-gray-650 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Consultation/Details Trigger */}
                <div className="mt-8">
                  <a
                    href={`https://wa.me/6287815797525?text=Halo%20JAR.DEV%2C%20saya%20tertarik%20melihat%20detail%20atau%20membuat%20website%20seperti%20portofolio%20${encodeURIComponent(project.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-white border border-amber-400 text-amber-500 hover:bg-amber-400 hover:text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-400/5"
                  >
                    <span>Konsultasi Projek Ini</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Widget */}
      <WhatsAppFloat />

      {/* Return transition loader */}
      <AnimatePresence>
        {isExitingToSoobin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-955"
          >
            <div
              id="wifi-loader"
              className="scale-125"
              style={{
                ['--front-color' as any]: '#facc15',
                ['--back-color' as any]: 'rgba(250, 204, 21, 0.2)'
              }}
            >
              <svg className="circle-outer" viewBox="0 0 86 86">
                <circle className="back" cx="43" cy="43" r="40"></circle>
                <circle className="front" cx="43" cy="43" r="40"></circle>
              </svg>
              <svg className="circle-middle" viewBox="0 0 60 60">
                <circle className="back" cx="30" cy="30" r="27"></circle>
                <circle className="front" cx="30" cy="30" r="27"></circle>
              </svg>
              <svg className="circle-inner" viewBox="0 0 34 34">
                <circle className="back" cx="17" cy="17" r="14"></circle>
                <circle className="front" cx="17" cy="17" r="14"></circle>
              </svg>
              <div className="text" data-text="SOOBIN SERVICES"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
