import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import TurnitinSection from '@/components/sections/TurnitinSection';
import TestimonialCarousel from '@/components/sections/TestimonialCarousel';
import ParafraseSection from '@/components/sections/ParafraseSection';
import JokiTugasSection from '@/components/sections/JokiTugasSection';
import SkripsiSection from '@/components/sections/SkripsiSection';
import UnlockDokumenSection from '@/components/sections/UnlockDokumenSection';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export const metadata: Metadata = {
  title: 'SOOBIN Services | Turnitin, Parafrase & Joki Tugas Termurah',
  description:
    'Solusi terpercaya untuk kebutuhan akademik Anda. Cek Turnitin, Parafrase Dokumen, Joki Tugas, Joki Skripsi, dan Unlock Dokumen dengan harga termurah di pasaran. Trusted 20K+ Customer!',
  keywords: [
    'joki tugas',
    'cek turnitin',
    'parafrase',
    'joki skripsi',
    'unlock dokumen',
    'joki tugas termurah',
    'soobin services',
  ],
  authors: [{ name: 'Soobin Services' }],
  openGraph: {
    title: 'SOOBIN Services | Turnitin & Parafrase Termurah',
    description:
      'Jasa joki tugas, cek turnitin, parafrase, dan unlock dokumen termurah dengan 20K+ customer puas!',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorksSection />
      <TurnitinSection />
      <TestimonialCarousel />
      <ParafraseSection />
      <JokiTugasSection />
      <SkripsiSection />
      <UnlockDokumenSection />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}