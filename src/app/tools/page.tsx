'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Link from 'next/link';
import {
  BookMarked,
  FileText,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const tools = [
  {
    href: '/tools/daftar-pustaka',
    title: 'Generator Sitasi & Daftar Pustaka',
    desc: 'Format sitasi otomatis berstandar APA 7th, Harvard, IEEE, MLA 9th & Chicago dengan fitur auto-lookup DOI dari database CrossRef.',
    badge: 'Paling Populer',
    icon: BookMarked,
    color: 'from-primary-900 to-primary-700',
  },
  {
    href: '/tools/word-counter',
    title: 'Penghitung Kata & Waktu Baca',
    desc: 'Hitung total kata, karakter, paragraf, kalimat, serta estimasi waktu membaca dan jumlah halaman naskah skripsi secara akurat.',
    badge: 'Mini Tool',
    icon: FileText,
    color: 'from-slate-900 to-slate-700',
  },
];

export default function ToolsHubPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <section className="pt-28 sm:pt-36 pb-10 sm:pb-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookMarked className="w-3.5 h-3.5 text-primary-700" />
            <span>Academic Tools Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Kumpulan Mini Tools Akademik Gratis
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Berbagai alat bantu praktis gratis yang dirancang khusus untuk mempercepat penulisan tugas, makalah, jurnal, dan skripsi mahasiswa Indonesia.
          </p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {tool.badge}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-primary-800 transition-colors">
                      {tool.title}
                    </h2>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-primary-800">
                    <span>Gunakan Tool Gratis</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
