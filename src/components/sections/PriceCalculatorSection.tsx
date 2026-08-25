'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  Send,
  MessageSquare,
  ShieldCheck,
  HelpCircle,
  Plus,
  Minus
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ServiceOption {
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
  badge?: string;
  isPackage?: boolean;
}

const CALCULATOR_SERVICES: ServiceOption[] = [
  {
    id: 'parafrase',
    name: 'Parafrase Dokumen',
    category: 'Parafrase',
    icon: RefreshCw,
    unit: 'halaman',
    unitLabel: 'Halaman',
    basePrice: 2000,
    minQty: 1,
    maxQty: 150,
    defaultQty: 10,
    step: 1,
    description: 'Turunkan similarity Turnitin dengan teknik parafrase manual akademik bermutu tinggi.',
    badge: 'Paling Populer 🔥',
  },
  {
    id: 'turnitin_1x',
    name: 'Cek Turnitin (1x Cek)',
    category: 'Turnitin',
    icon: FileCheck,
    unit: 'dokumen',
    unitLabel: 'Dokumen',
    basePrice: 8000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Akun No-Repository resmi 100% aman tanpa tersimpan di database Turnitin global.',
    badge: 'Hasil Cepat ⚡',
  },
  {
    id: 'turnitin_3x',
    name: 'Cek Turnitin (Paket 3x Cek)',
    category: 'Turnitin',
    icon: FileCheck,
    unit: 'paket',
    unitLabel: 'Paket (3x)',
    basePrice: 24000,
    minQty: 1,
    maxQty: 5,
    defaultQty: 1,
    step: 1,
    description: 'Paket hemat 3 kali pengecekan Turnitin No-Repository bebas revisi.',
    badge: 'Hemat!',
  },
  {
    id: 'cek_ai',
    name: 'Cek AI Detector (ZeroGPT)',
    category: 'Turnitin',
    icon: Sparkles,
    unit: 'dokumen',
    unitLabel: 'Dokumen',
    basePrice: 5000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Deteksi persentase AI generator (ChatGPT / Claude / Gemini) pada dokumen Anda.',
  },
  {
    id: 'ppt',
    name: 'Jasa Desain PPT Presentasi',
    category: 'Desain',
    icon: Presentation,
    unit: 'slide',
    unitLabel: 'Slide',
    basePrice: 3000,
    minQty: 5,
    maxQty: 80,
    defaultQty: 10,
    step: 1,
    description: 'Desain slide modern, rapi, visual menarik, dan siap untuk sidang skripsi / seminar.',
    badge: 'Desain Estetik ✨',
  },
  {
    id: 'formatting',
    name: 'Formatting Dokumen / Skripsi',
    category: 'Formatting',
    icon: FileText,
    unit: 'halaman',
    unitLabel: 'Halaman',
    basePrice: 1500,
    minQty: 5,
    maxQty: 250,
    defaultQty: 25,
    step: 1,
    description: 'Perapian margin, font, spasi, penomoran halaman romawi/angka, daftar isi otomatis sesuai pedoman kampus.',
  },
  {
    id: 'formatting_full',
    name: 'Paket Lengkap Formatting Skripsi',
    category: 'Formatting',
    icon: FileText,
    unit: 'dokumen',
    unitLabel: 'Dokumen Full',
    basePrice: 35000,
    minQty: 1,
    maxQty: 3,
    defaultQty: 1,
    step: 1,
    description: 'Perapian total dari Cover s/d Lampiran sampai siap cetak & ACC dosen pembimbing.',
    badge: 'Best Value 🏆',
    isPackage: true,
  },
  {
    id: 'pengetikan',
    name: 'Jasa Pengetikan Dokumen',
    category: 'Joki Tugas',
    icon: PenTool,
    unit: 'halaman',
    unitLabel: 'Halaman',
    basePrice: 1000,
    minQty: 5,
    maxQty: 150,
    defaultQty: 10,
    step: 1,
    description: 'Salin ketik dari foto/tulis tangan/PDF scan ke format Word yang rapi dan presisi.',
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
    description: 'Uji validitas, reliabilitas, regresi, uji beda, lengkap dengan interpretasi output & grafik.',
  },
  {
    id: 'review_jurnal',
    name: 'Review Jurnal Ilmiah',
    category: 'Joki Tugas',
    icon: BookOpen,
    unit: 'jurnal',
    unitLabel: 'Jurnal',
    basePrice: 25000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Analisis kritis matriks review jurnal nasional / internasional (Sinta / Scopus).',
  },
  {
    id: 'makalah',
    name: 'Joki Makalah / Essay Akademik',
    category: 'Joki Tugas',
    icon: FileText,
    unit: 'tugas',
    unitLabel: 'Makalah / Tugas',
    basePrice: 40000,
    minQty: 1,
    maxQty: 5,
    defaultQty: 1,
    step: 1,
    description: 'Penyusunan makalah akademik terstruktur lengkap dengan referensi daftar pustaka valid.',
  },
];

export default function PriceCalculatorSection() {
  const { user } = useAuth();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('parafrase');
  const [quantity, setQuantity] = useState<number>(10);

  // Active selected service
  const activeService = useMemo(() => {
    const found = CALCULATOR_SERVICES.find((s) => s.id === selectedServiceId);
    return found || CALCULATOR_SERVICES[0];
  }, [selectedServiceId]);

  // Handle service switch
  const handleSelectService = (service: ServiceOption) => {
    setSelectedServiceId(service.id);
    setQuantity(service.defaultQty);
  };

  // Price calculations
  const rawSubtotal = useMemo(() => {
    return activeService.basePrice * quantity;
  }, [activeService, quantity]);

  // Member discount (5% if user logged in)
  const isMember = Boolean(user);
  const memberDiscountRate = isMember ? 0.05 : 0;
  const memberDiscountAmount = Math.round(rawSubtotal * memberDiscountRate);
  const finalTotal = rawSubtotal - memberDiscountAmount;

  // Format currency IDR
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Compose WhatsApp URL
  const whatsappUrl = useMemo(() => {
    const memberText = isMember ? `Member (${user?.name || 'Aktif'})` : 'Reguler';
    const discountText = isMember ? `\n🎁 Diskon Member (5%): -${formatRupiah(memberDiscountAmount)}` : '';

    const text = `Halo Admin SOOBIN Services! 👋
Saya ingin order via Kalkulator Estimasi Website:

📌 Layanan: ${activeService.name}
📄 Jumlah: ${quantity} ${activeService.unitLabel}
💰 Tarif Satuan: ${formatRupiah(activeService.basePrice)} / ${activeService.unitLabel}
💵 Subtotal: ${formatRupiah(rawSubtotal)}${discountText}
✨ Estimasi Total: ${formatRupiah(finalTotal)}
👤 Status Klien: ${memberText}

Bisa tolong dicek dan diproses ya Kak? Terima kasih! 🙏`;

    return `https://wa.me/6287815797525?text=${encodeURIComponent(text)}`;
  }, [activeService, quantity, rawSubtotal, isMember, memberDiscountAmount, finalTotal, user]);

  return (
    <section id="kalkulator-harga" className="py-20 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden text-white">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-96 h-96 bg-primary-800/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Calculator className="w-4 h-4" />
            <span>Kalkulator Estimasi Instan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Hitung Biaya Tugas <span className="bg-gradient-to-r from-primary-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">Transparan & Instan</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-300">
            Dapatkan estimasi biaya pengerjaan tugas Anda dalam hitungan detik. Cukup pilih layanan dan tentukan jumlah halaman atau unit yang dibutuhkan.
          </p>
        </div>

        {/* Calculator Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Service Selector & Quantity Control (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Service Selection Grid */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
                1. Pilih Jenis Layanan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                {CALCULATOR_SERVICES.map((srv) => {
                  const Icon = srv.icon;
                  const isSelected = selectedServiceId === srv.id;

                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => handleSelectService(srv)}
                      className={`relative text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-br from-primary-600/30 to-blue-600/20 border-primary-400/80 shadow-lg shadow-primary-950/50 scale-[1.01]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-primary-500 text-white shadow-md' : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white truncate">{srv.name}</h4>
                        </div>
                        <p className="text-[11px] font-semibold text-primary-300 mt-0.5">
                          {formatRupiah(srv.basePrice)} <span className="text-[10px] text-gray-400">/{srv.unit}</span>
                        </p>
                        {srv.badge && (
                          <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30">
                            {srv.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity / Volume Adjustment */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                    2. Jumlah {activeService.unitLabel}
                  </label>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {activeService.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white px-3 py-1 bg-white/10 rounded-xl border border-white/15">
                    {quantity}
                  </span>
                  <span className="text-xs text-gray-400 ml-1.5">{activeService.unitLabel}</span>
                </div>
              </div>

              {/* Stepper Buttons & Slider */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(activeService.minQty, prev - activeService.step))}
                    disabled={quantity <= activeService.minQty}
                    className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all cursor-pointer shadow-sm active:scale-95"
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
                    className="flex-1 h-2.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-primary-500 hover:accent-primary-400 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.min(activeService.maxQty, prev + activeService.step))}
                    disabled={quantity >= activeService.maxQty}
                    className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-[11px] text-gray-400 font-medium mr-1">Pilihan Cepat:</span>
                  {[5, 10, 20, 35, 50]
                    .filter((q) => q >= activeService.minQty && q <= activeService.maxQty)
                    .map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuantity(q)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          quantity === q
                            ? 'bg-primary-500 text-white border-primary-400 shadow-sm'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {q} {activeService.unitLabel}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Price Summary Card (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-gradient-to-br from-slate-900/90 via-primary-950/60 to-slate-900/95 border border-primary-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
              {/* Top Neon Border Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-sky-400 to-blue-500" />

              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Ringkasan Estimasi</h3>
                      <span className="text-[10px] text-gray-400">SOOBIN Services Official</span>
                    </div>
                  </div>
                  {isMember ? (
                    <span className="px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 text-[10px] font-bold">
                      Member Active ✨
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-gray-300 text-[10px] font-medium">
                      Non-Member
                    </span>
                  )}
                </div>

                {/* Selected Service Breakdown */}
                <div className="py-5 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Layanan Dipilih:</span>
                    <span className="font-bold text-white text-right truncate max-w-[190px]">{activeService.name}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Tarif Satuan:</span>
                    <span className="font-semibold text-gray-200">
                      {formatRupiah(activeService.basePrice)} / {activeService.unitLabel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Volume Jumlah:</span>
                    <span className="font-semibold text-gray-200">
                      {quantity} {activeService.unitLabel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-gray-400">Subtotal Harga:</span>
                    <span className="font-bold text-white">{formatRupiah(rawSubtotal)}</span>
                  </div>

                  {/* Member Discount Row */}
                  {isMember ? (
                    <div className="flex items-center justify-between text-green-400 font-semibold bg-green-500/10 px-3 py-2 rounded-xl border border-green-500/20">
                      <span>Diskon Spesial Member (5%):</span>
                      <span>-{formatRupiah(memberDiscountAmount)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-gray-400 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                      <span className="text-[11px]">Daftar Member untuk Diskon:</span>
                      <span className="text-[11px] text-primary-400 font-bold">Hemat 5%</span>
                    </div>
                  )}
                </div>

                {/* Final Total Display */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 mb-6 text-center">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Estimasi Total Biaya
                  </span>
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-primary-400 via-sky-300 to-white bg-clip-text text-transparent">
                    {formatRupiah(finalTotal)}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    *Harga final dapat disesuaikan dengan tingkat kesulitan materi
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-950/40 hover:shadow-green-900/60 transition-all cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Pesan Sekarang via WhatsApp</span>
                </a>

                {/* Guarantee Badges */}
                <div className="pt-3 flex items-center justify-center gap-4 text-[11px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary-400" /> Garansi Revisi
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Rahasia Terjamin
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
