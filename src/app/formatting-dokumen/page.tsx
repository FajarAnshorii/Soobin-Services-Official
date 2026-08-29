import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { AlignLeft, FileText, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Jasa Formatting Skripsi & Kerapian Dokumen Terdekat',
  description:
    'Layanan merapikan dokumen Word, layout skripsi sesuai pedoman penulisan kampus, pembuatan daftar isi otomatis, nomor halaman, dan daftar pustaka Mendeley.',
  alternates: {
    canonical: '/formatting-dokumen',
  },
};

export default function FormattingDokumenPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col pt-20">
      <Navbar />

      <main className="grow">
        {/* Hero Section */}
        <section className="bg-linear-to-b from-[#0f2744] to-[#0a1628] text-white py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          </div>
          <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              Jasa Formatting Skripsi & Kerapian Dokumen
            </h1>
            <p className="text-gray-300 text-base md:text-lg mt-6 leading-relaxed">
              Dokumen skripsi Anda berantakan saat dicetak? Kami bantu merapikan dokumen Word, format bab, margin, nomor halaman (romawi/angka), daftar isi otomatis, dan sitasi sesuai template kampus Anda.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://wa.me/6287815797525?text=Halo%20Soobin%20Services%2C%20saya%20tertarik%20dengan%20Jasa%20Formatting%20Skripsi."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-green-950/20 text-sm flex items-center justify-center gap-2"
              >
                Pesan via WhatsApp <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/layanan"
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold px-8 py-3.5 rounded-xl transition-all text-sm flex items-center justify-center"
              >
                Lihat Paket Layanan
              </a>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-16 bg-white">
          <div className="container-custom max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-gray-950">Layanan Perapian Dokumen yang Kami Sediakan</h2>
              <p className="text-gray-500 text-sm mt-2">Bebaskan diri Anda dari stres akibat dokumen yang tidak rapi.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-gray-100 flex gap-4">
                <AlignLeft className="w-8 h-8 text-blue-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-base text-gray-950">Mendeley & Sitasi</h3>
                  <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">Perapian referensi, daftar pustaka otomatis menggunakan Mendeley, Zotero, atau APA Style secara akurat.</p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-gray-100 flex gap-4">
                <FileText className="w-8 h-8 text-green-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-base text-gray-950">Daftar Isi Otomatis</h3>
                  <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">Pembuatan Daftar Isi, Daftar Gambar, dan Daftar Tabel otomatis dengan penomoran yang sinkron dan rapi.</p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-gray-100 flex gap-4">
                <CheckCircle className="w-8 h-8 text-purple-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-base text-gray-950">Layout Sesuai Buku Pedoman</h3>
                  <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">Mengatur spasi, margin, ukuran kertas, header/footer, bab/sub-bab, dan nomor halaman beda posisi (romawi dan angka).</p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-gray-100 flex gap-4">
                <AlignLeft className="w-8 h-8 text-primary-800 shrink-0" />
                <div>
                  <h3 className="font-bold text-base text-gray-950">Konversi Format</h3>
                  <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">Bantuan merapikan penulisan tabel, grafik, skema gambar, serta konversi dokumen antar format PDF/Word/LaTeX.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
