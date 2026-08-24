'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

export interface CarouselItem {
  id: number;
  url: string;
  title: string;
  link?: string;
}

export const defaultItems: CarouselItem[] = [
  {
    id: 1,
    url: '/images/posters/poster-wa-channel.png',
    title: 'Testimoni di Channel WhatsApp',
    link: 'https://wa.me/628990415500?text=Halo%20Admin%20Soobin%2C%20mau%20gabung%20Channel%20WhatsApp%20resmi%20dong'
  },
  {
    id: 2,
    url: '/images/posters/poster-diskon-member.png',
    title: 'Diskon 5% Member Baru All Layanan',
    link: 'https://wa.me/628990415500?text=Halo%20Admin%20Soobin%2C%20saya%20member%20baru%20mau%20klaim%20diskon%205%25'
  },
  {
    id: 3,
    url: '/images/posters/poster-sosmed-resmi.png',
    title: 'Media Sosial & Website Resmi Soobin',
    link: 'https://www.instagram.com/soobinservices.id/'
  }
];

interface FramerCarouselProps {
  items?: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
}

export function FramerCarousel({
  items = defaultItems,
  autoPlay = true,
  interval = 4000
}: FramerCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);

  // Smooth spring sliding animation
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1;
      const targetX = -index * containerWidth;

      animate(x, targetX, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      });
    }
  }, [index, x]);

  // Handle window resize recalculation
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth || 1;
        x.set(-index * containerWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [index, x]);

  // Automatic smooth advance
  useEffect(() => {
    if (!autoPlay || isHovered || items.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, isHovered, items.length, interval]);

  return (
    <div
      className="w-full max-w-2xl lg:max-w-[660px] mx-auto px-4 sm:px-6 py-2 sm:py-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-3">
        <div
          className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-200/80 bg-white aspect-[16/9] w-full"
          ref={containerRef}
        >
          <motion.div className="flex h-full w-full" style={{ x }}>
            {items.map((item) => (
              <div key={item.id} className="shrink-0 w-full h-full relative">
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-2xl select-none"
                      draggable={false}
                    />
                  </a>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-2xl select-none"
                    draggable={false}
                  />
                )}
              </div>
            ))}
          </motion.div>

          {/* Navigation Buttons: Previous */}
          <motion.button
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            aria-label="Previous Slide"
            className={`absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 z-10
              ${
                index === 0
                  ? 'opacity-40 cursor-not-allowed bg-white/70 text-gray-400'
                  : 'bg-white/90 text-gray-800 hover:bg-white hover:scale-110 hover:opacity-100 opacity-80 backdrop-blur-xs'
              }`}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>

          {/* Navigation Buttons: Next */}
          <motion.button
            disabled={index === items.length - 1}
            onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
            aria-label="Next Slide"
            className={`absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 z-10
              ${
                index === items.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-white/70 text-gray-400'
                  : 'bg-white/90 text-gray-800 hover:bg-white hover:scale-110 hover:opacity-100 opacity-80 backdrop-blur-xs'
              }`}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>

          {/* Progress Indicator (Pill & Dots) */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-gray-900/40 backdrop-blur-md rounded-full border border-white/20 shadow-md">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'w-7 sm:w-8 bg-white shadow-sm' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FramerCarousel;
