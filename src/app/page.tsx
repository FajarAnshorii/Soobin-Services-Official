import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import PosterCarouselSection from '@/components/sections/PosterCarouselSection';
import PartnerSection from '@/components/sections/PartnerSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import TurnitinSection from '@/components/sections/TurnitinSection';
import TestimonialCarousel from '@/components/sections/TestimonialCarousel';
import ParafraseSection from '@/components/sections/ParafraseSection';
import JokiTugasSection from '@/components/sections/JokiTugasSection';
import SkripsiSection from '@/components/sections/SkripsiSection';
import UnlockDokumenSection from '@/components/sections/UnlockDokumenSection';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Soobin Services",
    "url": "https://soobinservices.com",
    "logo": "https://soobinservices.com/logo.png",
    "sameAs": [
      "https://www.instagram.com/soobinservices.id/",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Indonesian"],
    },
  };

  return (
    <main className="min-h-screen">
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Navbar />
      <Hero />
      <PosterCarouselSection />
      <PartnerSection />
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