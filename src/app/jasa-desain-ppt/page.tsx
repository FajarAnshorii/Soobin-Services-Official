import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Palette, Layers, Award, Sparkles, Monitor, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Jasa Desain Slide PPT Presentasi Keren & Professional',
  description:
    'Layanan jasa desain template PowerPoint (PPT) profesional untuk seminar proposal, skripsi, bisnis pitch deck, dan presentasi perkuliahan.',
  alternates: {
    canonical: '/jasa-desain-ppt',
  },
};

export default function JasaDesainPptPage() {
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
              Jasa Desain Slide Presentasi & PPT Professional
            </h1>
            <p className="text-gray-300 text-base md:text-lg mt-6 leading-relaxed">
              Buat presentasi Anda tampil luar biasa dan memikat audiens. Kami merancang slide presentasi PowerPoint (PPT) kustom, modern, interaktif, dan mudah dimengerti.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://wa.me/6287815797525?text=Halo%20Soobin%20Services%2C%20saya%20tertarik%20dengan%20Jasa%20Desain%20PPT%20Presentasi."
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

        {/* Layanan Slide Jenis */}
        <section className="py-16 bg-white">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-gray-950">Desain Slide Presentasi untuk Segala Kebutuhan</h2>
              <p className="text-gray-500 text-sm mt-2">Apapun tujuannya, kami buat slide presentasi Anda tampak menawan.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Award, title: 'Sidang Skripsi & Sempro', desc: 'Desain ringkas, formal, dan fokus pada poin penting penelitian agar dosen penguji terkesan.' },
                { icon: Sparkles, title: 'Pitch Deck & Bisnis', desc: 'Visualisasi modern berorientasi data untuk meyakinkan klien, investor, atau calon mitra bisnis.' },
                { icon: Layers, title: 'Presentasi Kuliah', desc: 'Slide kreatif untuk tugas kelompok atau individu agar presentasi Anda berkesan di kelas.' },
                { icon: Palette, title: 'Redesain Slide Lama', desc: 'Ubah slide lama Anda yang membosankan menjadi desain baru yang segar dan memikat.' },
                { icon: Monitor, title: 'Company Profile', desc: 'Profil perusahaan yang dikemas menarik dalam bentuk presentasi untuk branding professional.' },
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
