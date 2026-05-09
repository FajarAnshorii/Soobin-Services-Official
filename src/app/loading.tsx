'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark-800">
      <div className="text-center">
        {/* Logo */}
        <motion.div
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-6"
          animate={{
            scale: [1, 0.9, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-full h-full"
          >
            <rect width="32" height="32" rx="6" fill="#1A237E" />
            <path
              d="M16 6L8 10v6c0 5.5 3.4 10.6 8 12 4.6-1.4 8-6.5 8-12v-6l-8-4z"
              fill="#fff"
            />
            <path
              d="M16 8l5.5 2.75v4.5c0 3.7-2.3 7.1-5.5 8-3.2-.9-5.5-4.3-5.5-8v-4.5L16 8z"
              fill="#3D7AB5"
            />
            <circle cx="16" cy="15" r="3" fill="#fff" />
            <path
              d="M14.5 14l1.5 1.5 3-3"
              stroke="#1A237E"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Loading Bar */}
        <div className="w-32 sm:w-40 md:w-48 h-1.5 bg-gray-700 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-linear-to-r from-primary-600 to-primary-400 rounded-full"
            initial={{ width: '0%', x: 0 }}
            animate={{ width: '100%', x: 0 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Text */}
        <motion.p
          className="text-white/70 text-sm mt-4 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Memuat halaman...
        </motion.p>
      </div>
    </div>
  );
}
