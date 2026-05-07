'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/6287815797525?text=Halo%20Kak%20Mau%20Joki%20Tugas"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
    >
      {/* Pulse Ring */}
      <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30" />

      {/* Button */}
      <div className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl shadow-green-500/40 transition-colors duration-300">
        <MessageCircle className="w-7 h-7" />

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-dark-800 text-white text-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Chat WhatsApp
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-8 border-transparent border-r-0 border-dark-800" />
        </div>
      </div>
    </motion.a>
  );
}