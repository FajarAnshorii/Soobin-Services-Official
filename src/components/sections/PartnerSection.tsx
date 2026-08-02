'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const row1Partners = [
  { name: 'Turnitin', logo: '/logo-turnitin.png' },
  { name: 'ZeroGPT', logo: '/logo-zerogpt.png' },
  { name: 'GPTZero', logo: '/logo-gptzero.png' },
  { name: 'SPSS', logo: '/logo-spss.png' },
  { name: 'PostgreSQL', logo: '/logo-postgresql.png' },
  { name: 'MariaDB', logo: '/logo-mariadb.png' },
  { name: 'VS Code', logo: '/logo-vscode.png' },
];

const row2Partners = [
  { name: 'SOOBIN Services', logo: '/logo.png' },
  { name: 'TablePlus', logo: '/logo-tableplus.png' },
  { name: 'Google Colab', logo: '/logo-colab.png' },
  { name: 'Google Scholar', logo: '/logo-scholar.png' },
  { name: 'Android Studio', logo: '/logo-androidstudio.png' },
  { name: 'Supabase', logo: '/logo-supabase.png' },
];

// Duplicate items to ensure smooth infinite loop
const duplicatedRow1 = [...row1Partners, ...row1Partners, ...row1Partners, ...row1Partners];
const duplicatedRow2 = [...row2Partners, ...row2Partners, ...row2Partners, ...row2Partners];

export default function PartnerSection() {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100 overflow-hidden">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xs sm:text-sm font-bold text-primary-800 tracking-[0.2em] uppercase">
            Partner Resmi
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            Didukung oleh Layanan Resmi dan Partner Company Resmi
          </p>
        </motion.div>
      </div>

      {/* Marquee Rows Container */}
      <div className="flex flex-col gap-6 w-full">
        {/* Row 1: Moves Left */}
        <div className="relative flex overflow-x-hidden w-full mask-gradient">
          <div className="animate-marquee-left flex gap-12 sm:gap-16 items-center">
            {duplicatedRow1.map((partner, index) => (
              <div 
                key={`row1-${index}`} 
                className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-[120px] sm:w-[150px] h-12 relative"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 120px, 150px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Moves Right */}
        <div className="relative flex overflow-x-hidden w-full mask-gradient">
          <div className="animate-marquee-right flex gap-12 sm:gap-16 items-center">
            {duplicatedRow2.map((partner, index) => (
              <div 
                key={`row2-${index}`} 
                className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-[120px] sm:w-[150px] h-12 relative"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 120px, 150px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
