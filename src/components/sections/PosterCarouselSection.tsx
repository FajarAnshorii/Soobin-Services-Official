'use client';

import React from 'react';
import { FramerCarousel } from '@/components/ui/framer-carousel';

export default function PosterCarouselSection() {
  return (
    <section className="py-4 sm:py-6 bg-gradient-to-b from-gray-50/80 via-white to-gray-50/50 border-b border-gray-100 overflow-hidden relative">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-amber-100/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Framer Motion Poster Carousel */}
      <FramerCarousel autoPlay={true} interval={4500} />
    </section>
  );
}
