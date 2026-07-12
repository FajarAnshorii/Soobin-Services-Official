import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CheckCircle, Shield, Clock, Award, FileText, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Jasa Parafrase Turnitin & Dokumen Akademik Termurah',
  description:
    'Layanan parafrase dokumen untuk menurunkan persentase kemiripan Turnitin secara profesional, natural, formal, dan sesuai konteks akademik.',
  alternates: {
    canonical: '/jasa-parafrase',
  },
};

export default function JasaParafrasePage() {
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
            <span className="bg-primary-700/50 border border-primary-600 text-primary-300 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Layanan Akademik Premium
            </span>
            <h1 className="text-3xl md:text-5xl font-black mt-4 leading-tight">
              Jasa Parafrase Dokumen & Lolos Turnitin
            </h1>
            <p className="text-gray-300 text-base md:text-lg mt-6 leading-relaxed">
              Kami bantu menyusun ulang kalimat dokumen, tugas, maupun skripsi Anda agar terbebas dari plagiarisme Turnitin tanpa mengubah substansi atau ide pokok aslinya.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://wa.me/6287815797525?text=Halo%20Soobin%20Services%2C%20saya%20tertarik%20dengan%20Jasa%20Parafrase%20Dokumen."
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
                Lihat Paket Lainnya
              </a>
            </div>
          </div>
        </section>

        {/* Keunggulan Section */}
        <section className="py-16 bg-white">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-gray-950">Mengapa Memilih Jasa Parafrase Kami?</h2>
              <p className="text-gray-500 text-sm mt-2">Kualitas pengerjaan dan kepuasan pelanggan adalah prioritas utama kami.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Garansi Lolos Turnitin</h3>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">Hasil parafrase terbukti menurunkan persentase kemiripan (similarity) hingga batas aman yang ditentukan kampus Anda.</p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Proses Cepat & Tepat Waktu</h3>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">Pengerjaan disesuaikan dengan tenggat waktu (deadline) Anda dengan opsi ekspres 24 jam selesai.</p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Bahasa Natural & Akademik</h3>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">Parafrase dilakukan secara manual dengan standar tata bahasa baku yang tetap menjaga esensi pembahasan ilmiah.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Layanan Detail Section */}
        <section className="py-16 bg-slate-50">
          <div className="container-custom max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl border border-gray-150 p-8 md:p-12 shadow-xs">
              <h2 className="text-2xl md:text-3xl font-black text-gray-950 mb-6">Jenis Dokumen yang Kami Layani</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Skripsi, Tesis, & Disertasi',
                  'Jurnal Ilmiah (Nasional & Internasional)',
                  'Esai & Makalah Kuliah',
                  'Laporan Praktikum & Magang',
                  'Buku & Naskah Publikasi',
                  'Artikel Umum & Dokumen Bisnis',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-gray-100">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="font-bold text-sm text-gray-800">{item}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-10 pt-8">
                <h3 className="font-extrabold text-lg text-gray-900 mb-4">Bagaimana Cara Pemesanannya?</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  {[
                    { step: '1', title: 'Kirim File', desc: 'Kirimkan dokumen Word Anda via WhatsApp.' },
                    { step: '2', title: 'Estimasi & DP', desc: 'Kami hitung jumlah halaman dan sepakati harga & deadline.' },
                    { step: '3', title: 'Pengerjaan', desc: 'Tim kami melakukan parafrase manual berkualitas.' },
                    { step: '4', title: 'Pelunasan & Kirim', desc: 'Hasil dicek kembali dan dikirim setelah pelunasan.' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1">
                      <div className="w-8 h-8 rounded-full bg-primary-800 text-white flex items-center justify-center font-bold text-sm mb-3">
                        {item.step}
                      </div>
                      <h4 className="font-bold text-sm text-gray-950">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  ))}
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
