'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { InfinityLoop } from '@/components/ui/InfinityLoop';

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Show loader on pathname or searchParams change (lasts ~700ms, strictly under 2s)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Intercept click on internal links to show loading animation immediately
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
        const url = new URL(anchor.href);
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
          setIsLoading(true);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md text-white pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-3 bg-slate-900/90 border border-white/10 p-6 rounded-2xl shadow-2xl text-center max-w-xs w-full"
          >
            <div className="w-16 h-16 text-primary-400 flex items-center justify-center">
              <InfinityLoop className="w-16 h-16" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-white tracking-wide">Memuat Halaman...</p>
              <p className="text-[11px] text-gray-400">SOOBIN Services</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
