'use client';

import { ShieldCheck, Mail, Phone, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

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
            <Link href="/" className="flex items-center gap-2 mb-4 sm:mb-6">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600" />
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  SOOBIN
                </span>
                <span className="text-xs text-gray-400 font-medium -mt-1">
                  Services
                </span>
              </div>
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
                <Phone className="w-4 h-4 text-primary-500 mt-1" />
                <a
                  href="https://wa.me/6287815797525"
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm"
                >
                  +62 878 1579 7525
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary-500 mt-1" />
                <a
                  href="mailto:soobinservices@gmail.com"
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm"
                >
                  soobinservices@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-500 mt-1" />
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