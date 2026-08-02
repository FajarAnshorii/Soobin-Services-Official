'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Loading() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Automatically dismiss loader quickly (500ms) to avoid stuck full-screen blockage
    const timer = setTimeout(() => {
      setShow(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B1527]/90 backdrop-blur-md text-white pointer-events-none transition-opacity duration-300">
      <div className="text-center space-y-4">
        {/* Animated Brand Shield */}
        <motion.div
          className="w-16 h-16 mx-auto"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-full h-full"
          >
            <rect width="32" height="32" rx="8" fill="#0F1E36" />
            <path
              d="M16 6L8 10v6c0 5.5 3.4 10.6 8 12 4.6-1.4 8-6.5 8-12v-6l-8-4z"
              fill="#00C853"
            />
            <path
              d="M14.5 14l1.5 1.5 3-3"
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Text */}
        <motion.p
          className="text-gray-200 text-xs font-semibold tracking-wider uppercase"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Memuat Halaman...
        </motion.p>
      </div>
    </div>
  );
}
