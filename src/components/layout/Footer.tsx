'use client';

import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.72 1.01-.06 1.96-.64 2.48-1.5.3-.47.47-1.02.48-1.58.05-3.38.02-6.76.03-10.14.01-3.68.01-7.36.01-11.04z" />
    </svg>
  );
}

const footerLinks = {
  layanan: [
    { href: '/layanan', label: 'Cek Turnitin & AI' },
    { href: '/layanan', label: 'Parafrase Dokumen' },
    { href: '/layanan', label: 'Joki Tugas' },
    { href: '/layanan', label: 'Joki Skripsi' },
    { href: '/layanan', label: 'Unlock Dokumen' },
  ],
  info: [
    { href: '/', label: 'Tentang Kami' },
    { href: '/', label: 'Cara Pemesanan' },
    { href: '/faq', label: 'FAQ' },
    { href: '/', label: 'Kebijakan Privasi' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-800 text-white">
      <div className="container-custom py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="relative h-10 w-44 sm:h-12 sm:w-52 mb-4 sm:mb-6 block">
              <Image
                src="/logo.png"
                alt="SOOBIN Services Logo"
                fill
                className="object-contain object-left brightness-0 invert"
                priority
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 sm:mb-6">
              Solusi terpercaya untuk kebutuhan akademik Anda. Tersedia layanan
              Cek Turnitin, Parafrase, Joki Tugas, dan Unlock Dokumen dengan
              harga termurah di pasaran.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>Online 24 Jam</span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 sm:mb-6">Layanan</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.layanan.map((link, index) => (
                <li key={`layanan-${index}`}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 sm:mb-6">Informasi</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.info.map((link, index) => (
                <li key={`info-${index}`}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold mb-4 sm:mb-6">Hubungi Kami</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                <a
                  href="https://wa.me/6287815797525"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm"
                >
                  +62 878 1579 7525
                </a>
              </li>
              <li className="flex items-start gap-3">
                <InstagramIcon className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                <a
                  href="https://www.instagram.com/soobinservices.id?igsi=anRhZHFwemI5ZTg0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm"
                >
                  Instagram : @soobinservices.id
                </a>
              </li>
              <li className="flex items-start gap-3">
                <TikTokIcon className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                <a
                  href="https://www.tiktok.com/@soobinservices.id?_r=1&_t=ZS-99AWXWM99ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm"
                >
                  TikTok : @soobinservices.id
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                <a
                  href="mailto:soobinservices@gmail.com"
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm"
                >
                  soobinservices@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                <span className="text-gray-400 text-sm">
                  Indonesia (Online 24 Jam)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-dark-600">
        <div className="container-custom py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              © {currentYear} Soobin Services. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="text-gray-500 text-xs sm:text-sm">
                Termurah • Terpercaya • 20K+ Customer
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}