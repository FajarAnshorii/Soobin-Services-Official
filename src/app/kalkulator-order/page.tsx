'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
  Calculator,
  RefreshCw,
  FileCheck,
  Presentation,
  FileText,
  PenTool,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Send,
  Plus,
  Minus,
  Info,
  Layers,
  GraduationCap
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  icon: any;
  unit: string;
  unitLabel: string;
  basePrice: number;
  minQty: number;
  maxQty: number;
  defaultQty: number;
  step: number;
  description: string;
  isPackage?: boolean;
}

const ACADEMIC_SERVICES: ServiceItem[] = [
  {
    id: 'parafrase',
    name: 'Parafrase Dokumen',
    category: 'Parafrase',
    icon: RefreshCw,
    unit: 'halaman',
    unitLabel: 'Halaman',
    basePrice: 2000,
    minQty: 1,
    maxQty: 200,
    defaultQty: 10,
    step: 1,
    description: 'Pengerjaan parafrase manual akademik per halaman untuk menurunkan similarity Turnitin secara efektif.',
  },
  {
    id: 'turnitin_1x',
    name: 'Cek Turnitin (1x Pemeriksaan)',
    category: 'Turnitin & AI',
    icon: FileCheck,
    unit: 'dokumen',
    unitLabel: 'Dokumen',
    basePrice: 8000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Pemeriksaan similarity index Turnitin resmi akun No-Repository (bebas tersimpan di database kampus/global).',
    isPackage: true,
  },
  {
    id: 'turnitin_3x',
    name: 'Cek Turnitin (Paket 3x Pemeriksaan)',
    category: 'Turnitin & AI',
    icon: FileCheck,
    unit: 'paket',
    unitLabel: 'Paket (3x Cek)',
    basePrice: 24000,
    minQty: 1,
    maxQty: 5,
    defaultQty: 1,
    step: 1,
    description: 'Paket 3 kali pengecekan similarity Turnitin No-Repository untuk pemantauan hasil revisi naskah.',
    isPackage: true,
  },
  {
    id: 'cek_ai',
    name: 'Cek AI Detector (ZeroGPT)',
    category: 'Turnitin & AI',
    icon: Layers,
    unit: 'dokumen',
    unitLabel: 'Dokumen',
    basePrice: 5000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Pengecekan indikasi persentase Artificial Intelligence (AI) pada naskah artikel atau tugas ilmiah.',
    isPackage: true,
  },
  {
    id: 'ppt',
    name: 'Jasa Desain PPT Presentasi',
    category: 'Desain Presentasi',
    icon: Presentation,
    unit: 'slide',
    unitLabel: 'Slide',
    basePrice: 3000,
    minQty: 5,
    maxQty: 100,
    defaultQty: 10,
    step: 1,
    description: 'Penyusunan slide presentasi profesional untuk seminar proposal, sidang skripsi, dan presentasi perkuliahan.',
  },
  {
    id: 'formatting',
    name: 'Formatting Dokumen & Skripsi',
    category: 'Formatting',
    icon: FileText,
    unit: 'halaman',
    unitLabel: 'Halaman',
    basePrice: 1500,
    minQty: 5,
    maxQty: 300,
    defaultQty: 25,
    step: 1,
    description: 'Perapian layout, margin, spasi, penomoran romawi/angka, daftar isi, tabel, dan gambar otomatis sesuai pedoman kampus.',
  },
  {
    id: 'formatting_full',
    name: 'Paket Full Formatting Skripsi/Tesis',
    category: 'Formatting',
    icon: GraduationCap,
    unit: 'dokumen',
    unitLabel: 'Dokumen Lengkap',
    basePrice: 35000,
    minQty: 1,
    maxQty: 3,
    defaultQty: 1,
    step: 1,
    description: 'Formatting lengkap seluruh naskah dari Cover, Bab 1 hingga Lampiran sampai siap cetak & ACC dosen.',
    isPackage: true,
  },
  {
    id: 'pengetikan',
    name: 'Jasa Pengetikan Dokumen',
    category: 'Pengetikan',
    icon: PenTool,
    unit: 'halaman',
    unitLabel: 'Halaman',
    basePrice: 1000,
    minQty: 5,
    maxQty: 200,
    defaultQty: 10,
    step: 1,
    description: 'Pengetikan ulang materi dari tulisan tangan, dokumen cetak fisik, atau PDF hasil pemindaian ke format Microsoft Word.',
  },
  {
    id: 'olah_data',
    name: 'Olah Data Statistik (SPSS / SEM / R)',
    category: 'Analisis Data',
    icon: BarChart3,
    unit: 'uji',
    unitLabel: 'Paket Uji',
    basePrice: 100000,
    minQty: 1,
    maxQty: 5,
    defaultQty: 1,
    step: 1,
    description: 'Pengolahan data statistik meliputi uji instrumen, regresi, uji hipotesis, dan interpretasi output Bab 4.',
    isPackage: true,
  },
  {
    id: 'review_jurnal',
    name: 'Review Jurnal Ilmiah',
    category: 'Tugas Akademik',
    icon: BookOpen,
    unit: 'jurnal',
    unitLabel: 'Artikel Jurnal',
    basePrice: 25000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Pembuatan matriks review dan telaah kritis artikel jurnal ilmiah nasional (SINTA) maupun internasional.',
  },
  {
    id: 'makalah',
    name: 'Penyusunan Makalah / Essay',
    category: 'Tugas Akademik',
    icon: FileText,
    unit: 'tugas',
    unitLabel: 'Naskah Makalah',
    basePrice: 40000,
    minQty: 1,
    maxQty: 5,
    defaultQty: 1,
    step: 1,
    description: 'Penyusunan naskah makalah akademik sistematis dengan referensi rujukan ilmiah primer yang valid.',
    isPackage: true,
  },
];

export default function KalkulatorOrderPage() {
  const { user } = useAuth();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('parafrase');
  const [quantity, setQuantity] = useState<number>(10);

  // Active selected service
  const activeService = useMemo(() => {
    const found = ACADEMIC_SERVICES.find((s) => s.id === selectedServiceId);
    return found || ACADEMIC_SERVICES[0];
  }, [selectedServiceId]);

  // Handle service switch
  const handleSelectService = (service: ServiceItem) => {
    setSelectedServiceId(service.id);
    setQuantity(service.defaultQty);
  };

  // Price calculations
  const rawSubtotal = useMemo(() => {
    return activeService.basePrice * quantity;
  }, [activeService, quantity]);

  // Member discount (5% for logged-in member)
  const isMember = Boolean(user);
  const memberDiscountRate = isMember ? 0.05 : 0;
  const memberDiscountAmount = Math.round(rawSubtotal * memberDiscountRate);
  const finalTotal = rawSubtotal - memberDiscountAmount;

  // Currency formatter
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // WhatsApp order link
  const whatsappUrl = useMemo(() => {
    const memberStatus = isMember ? `Member (${user?.name || 'Aktif'})` : 'Reguler';
    const discountText = isMember ? `\nPotongan Diskon Member (5%): -${formatRupiah(memberDiscountAmount)}` : '';

    const text = `Halo Admin SOOBIN Services! 👋
Saya ingin melakukan pemesanan via Kalkulator Order Website:

Rincian Estimasi:
• Layanan: ${activeService.name}
• Jumlah / Volume: ${quantity} ${activeService.unitLabel}
• Tarif Dasar: ${formatRupiah(activeService.basePrice)} / ${activeService.unitLabel}
• Subtotal: ${formatRupiah(rawSubtotal)}${discountText}
• Estimasi Total Biaya: ${formatRupiah(finalTotal)}
• Status Pemesan: ${memberStatus}

Mohon bantuannya untuk konfirmasi dan proses order ini ya Kak. Terima kasih.`;

    return `https://wa.me/6287815797525?text=${encodeURIComponent(text)}`;
  }, [activeService, quantity, rawSubtotal, isMember, memberDiscountAmount, finalTotal, user]);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero / Header Section */}
      <section className="pt-28 sm:pt-36 pb-10 sm:pb-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5 text-slate-700" />
            <span>Kalkulator Order Akademik</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Kalkulator Estimasi Biaya
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hitung perkiraan biaya pengerjaan tugas dan layanan akademik secara transparan, akurat, dan sesuai dengan volume naskah Anda.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-10 sm:py-14 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Service Selection & Volume Configuration (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Select Service */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                    Pilih Jenis Layanan
                  </h2>
                  <span className="text-[11px] text-slate-500 font-medium">11 Pilihan Layanan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {ACADEMIC_SERVICES.map((srv) => {
                    const Icon = srv.icon;
                    const isSelected = selectedServiceId === srv.id;

                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => handleSelectService(srv)}
                        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-900 hover:border-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {srv.name}
                          </h3>
                          <p className={`text-[11px] font-semibold mt-0.5 ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                            {formatRupiah(srv.basePrice)} <span className="text-[10px] opacity-80">/{srv.unit}</span>
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Volume & Quantity Adjustment */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                    Jumlah / Volume {activeService.unitLabel}
                  </h2>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-slate-900">{quantity}</span>
                    <span className="text-xs text-slate-600 font-medium">{activeService.unitLabel}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-5 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeService.description}
                  </p>
                </div>

                {/* Stepper Buttons & Slider */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(activeService.minQty, prev - activeService.step))}
                      disabled={quantity <= activeService.minQty}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
                      title="Kurangi"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <input
                      type="range"
                      min={activeService.minQty}
                      max={activeService.maxQty}
                      step={activeService.step}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />

                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.min(activeService.maxQty, prev + activeService.step))}
                      disabled={quantity >= activeService.maxQty}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
                      title="Tambah"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Preset Buttons */}
                  {!activeService.isPackage && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-500 font-medium mr-1">Preset Cepat:</span>
                      {[5, 10, 20, 35, 50, 75, 100]
                        .filter((q) => q >= activeService.minQty && q <= activeService.maxQty)
                        .map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setQuantity(q)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                              quantity === q
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {q} {activeService.unitLabel}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Formal Price Quotation Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Ringkasan Estimasi Order</h3>
                    <p className="text-[11px] text-slate-500">SOOBIN Services Official</p>
                  </div>
                  {isMember ? (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                      Member Aktif
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-medium">
                      Klien Reguler
                    </span>
                  )}
                </div>

                {/* Line Items */}
                <div className="py-4 space-y-3 text-xs border-b border-slate-200">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-600">Layanan:</span>
                    <span className="font-bold text-slate-900 text-right">{activeService.name}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Tarif Satuan:</span>
                    <span className="font-semibold text-slate-800">
                      {formatRupiah(activeService.basePrice)} / {activeService.unitLabel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Volume Jumlah:</span>
                    <span className="font-semibold text-slate-800">
                      {quantity} {activeService.unitLabel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-bold text-slate-900">{formatRupiah(rawSubtotal)}</span>
                  </div>

                  {isMember ? (
                    <div className="flex items-center justify-between text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 font-semibold">
                      <span>Diskon Khusus Member (5%):</span>
                      <span>-{formatRupiah(memberDiscountAmount)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-[11px]">
                      <span>Benefit Akun Member:</span>
                      <span className="font-semibold text-slate-800">Diskon 5% Tiap Order</span>
                    </div>
                  )}
                </div>

                {/* Total Box */}
                <div className="py-4 text-center bg-slate-50 rounded-xl border border-slate-200 my-4">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Estimasi Total Biaya
                  </span>
                  <div className="text-3xl font-extrabold text-slate-900">
                    {formatRupiah(finalTotal)}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    *Harga final transparan tanpa biaya tersembunyi
                  </span>
                </div>

                {/* Order Button */}
                <div className="space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Lanjutkan Pesanan ke WhatsApp</span>
                  </a>

                  {/* Standard Academic Guarantees */}
                  <div className="pt-2 space-y-1.5 text-[11px] text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Garansi pengerjaan sesuai pedoman & instruksi kampus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                      <span>Kerahasiaan data dan naskah dokumen terjamin 100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
