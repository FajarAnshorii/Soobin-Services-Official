import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { BarChart3, PieChart, Activity, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Jasa Pengolahan Data & Analisa Data Statistik Terpercaya',
  description:
    'Layanan analisis data kuantitatif dan kualitatif untuk skripsi, tesis, dan penelitian umum menggunakan SPSS, SmartPLS, EViews, dan Excel.',
  alternates: {
    canonical: '/pengolahan-data',
  },
};

export default function PengolahanDataPage() {
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
              Jasa Pengolahan Data & Analisis Statistik
            </h1>
            <p className="text-gray-300 text-base md:text-lg mt-6 leading-relaxed">
              Bingung dengan rumus statistik skripsi atau penelitian Anda? Kami menyediakan bantuan pengolahan data dengan software populer secara akurat dan dilengkapi interpretasi lengkap.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://wa.me/6287815797525?text=Halo%20Soobin%20Services%2C%20saya%20tertarik%20dengan%20Jasa%20Pengolahan%20Data%20Statistik."
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

        {/* Software & Method Section */}
        <section className="py-16 bg-white">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-gray-950">Software & Metode Analisis yang Kami Gunakan</h2>
              <p className="text-gray-500 text-sm mt-2">Dukungan penuh untuk berbagai jenis analisis data kuantitatif maupun kualitatif.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: BarChart3, title: 'SPSS', desc: 'Uji hipotesis, regresi linier, uji t, uji F, korelasi, validitas, reliabilitas, dan analisis deskriptif.' },
                { icon: PieChart, title: 'SmartPLS / PLS-SEM', desc: 'Analisis Structural Equation Modeling untuk hubungan antar variabel laten dengan sampel kecil.' },
                { icon: Activity, title: 'EViews', desc: 'Sangat cocok untuk data panel, runtun waktu (time series), analisis ekonomi makro, dan ekonometrika.' },
                { icon: ShieldCheck, title: 'Interpretasi Hasil', desc: 'Setiap hasil pengolahan data kami lengkapi dengan interpretasi tertulis yang siap dimasukkan ke bab 4 skripsi Anda.' },
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-950">{item.title}</h3>
                    <p className="text-gray-500 text-xs mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
