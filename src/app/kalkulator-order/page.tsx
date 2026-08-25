'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useAuth } from '@/context/AuthContext';
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
  ShieldCheck,
  Send,
  Plus,
  Minus,
  Info,
  Layers,
  GraduationCap,
  Trash2,
  ShoppingCart,
  PlusCircle,
  ArrowRight
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
}

interface CartItem {
  cartId: string;
  serviceId: string;
  name: string;
  unitPrice: number;
  unitLabel: string;
  quantity: number;
  subtotal: number;
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
    maxQty: 500,
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
    maxQty: 20,
    defaultQty: 1,
    step: 1,
    description: 'Pemeriksaan similarity index Turnitin resmi akun No-Repository (bebas tersimpan di database kampus/global).',
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
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Paket 3 kali pengecekan similarity Turnitin No-Repository untuk pemantauan hasil revisi naskah.',
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
    maxQty: 20,
    defaultQty: 1,
    step: 1,
    description: 'Pengecekan indikasi persentase Artificial Intelligence (AI) pada naskah artikel atau tugas ilmiah.',
  },
  {
    id: 'ppt',
    name: 'Jasa Desain PPT Presentasi',
    category: 'Desain Presentasi',
    icon: Presentation,
    unit: 'slide',
    unitLabel: 'Slide',
    basePrice: 3000,
    minQty: 1,
    maxQty: 200,
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
    minQty: 1,
    maxQty: 500,
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
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Formatting lengkap seluruh naskah dari Cover, Bab 1 hingga Lampiran sampai siap cetak & ACC dosen.',
  },
  {
    id: 'pengetikan',
    name: 'Jasa Pengetikan Dokumen',
    category: 'Pengetikan',
    icon: PenTool,
    unit: 'halaman',
    unitLabel: 'Halaman',
    basePrice: 1000,
    minQty: 1,
    maxQty: 500,
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
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Pengolahan data statistik meliputi uji instrumen, regresi, uji hipotesis, dan interpretasi output Bab 4.',
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
    maxQty: 20,
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
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Penyusunan naskah makalah akademik sistematis dengan referensi rujukan ilmiah primer yang valid.',
  },
];

export default function KalkulatorOrderPage() {
  const { user } = useAuth();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('parafrase');
  const [inputQuantity, setInputQuantity] = useState<number | string>(10);
  const [orderCart, setOrderCart] = useState<CartItem[]>([]);
  const [justAddedNotice, setJustAddedNotice] = useState<string | null>(null);

  // Active selected service
  const activeService = useMemo(() => {
    const found = ACADEMIC_SERVICES.find((s) => s.id === selectedServiceId);
    return found || ACADEMIC_SERVICES[0];
  }, [selectedServiceId]);

  // Handle service selection
  const handleSelectService = (service: ServiceItem) => {
    setSelectedServiceId(service.id);
    setInputQuantity(service.defaultQty);
  };

  // Safe parsed quantity for the active current selection
  const currentNumericQty = useMemo(() => {
    const n = typeof inputQuantity === 'string' ? parseInt(inputQuantity, 10) : inputQuantity;
    return isNaN(n) || n <= 0 ? 1 : n;
  }, [inputQuantity]);

  // Current single item calculation
  const currentSubtotal = useMemo(() => {
    return activeService.basePrice * currentNumericQty;
  }, [activeService, currentNumericQty]);

  // Add current configured service to order cart
  const handleAddToCart = () => {
    const existingIndex = orderCart.findIndex((item) => item.serviceId === activeService.id);
    let updatedCart: CartItem[];

    if (existingIndex > -1) {
      // Update existing item quantity
      const existing = orderCart[existingIndex];
      const newQty = existing.quantity + currentNumericQty;
      const updatedItem: CartItem = {
        ...existing,
        quantity: newQty,
        subtotal: existing.unitPrice * newQty,
      };
      updatedCart = [...orderCart];
      updatedCart[existingIndex] = updatedItem;
    } else {
      // Add new item
      const newItem: CartItem = {
        cartId: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        serviceId: activeService.id,
        name: activeService.name,
        unitPrice: activeService.basePrice,
        unitLabel: activeService.unitLabel,
        quantity: currentNumericQty,
        subtotal: currentSubtotal,
      };
      updatedCart = [...orderCart, newItem];
    }

    setOrderCart(updatedCart);
    setJustAddedNotice(`Berhasil menambahkan: ${activeService.name} (${currentNumericQty} ${activeService.unitLabel})`);
    setTimeout(() => setJustAddedNotice(null), 3000);
  };

  // Remove item from cart
  const handleRemoveFromCart = (cartId: string) => {
    setOrderCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // Clear all cart
  const handleClearCart = () => {
    if (orderCart.length === 0) return;
    if (confirm('Kosongkan semua daftar pesanan?')) {
      setOrderCart([]);
    }
  };

  // Determine items to calculate (if cart is empty, preview current single item; otherwise calculate whole cart)
  const isCartEmpty = orderCart.length === 0;

  const totalRawSubtotal = useMemo(() => {
    if (isCartEmpty) {
      return currentSubtotal;
    }
    return orderCart.reduce((sum, item) => sum + item.subtotal, 0);
  }, [isCartEmpty, currentSubtotal, orderCart]);

  // Member discount (5% for logged-in member)
  const isMember = Boolean(user);
  const memberDiscountRate = isMember ? 0.05 : 0;
  const memberDiscountAmount = Math.round(totalRawSubtotal * memberDiscountRate);
  const finalGrandTotal = totalRawSubtotal - memberDiscountAmount;

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

    let itemsBreakdown = '';
    if (isCartEmpty) {
      itemsBreakdown = `1. ${activeService.name} (${currentNumericQty} ${activeService.unitLabel}) - ${formatRupiah(currentSubtotal)}`;
    } else {
      itemsBreakdown = orderCart
        .map((item, idx) => `${idx + 1}. ${item.name} (${item.quantity} ${item.unitLabel}) - ${formatRupiah(item.subtotal)}`)
        .join('\n');
    }

    const text = `Halo Admin SOOBIN Services! 👋
Saya ingin melakukan pemesanan via Kalkulator Order Website:

📋 DAFTAR PESANAN SAYA:
${itemsBreakdown}

💵 Subtotal: ${formatRupiah(totalRawSubtotal)}${discountText}
✨ ESTIMASI TOTAL ORDER: ${formatRupiah(finalGrandTotal)}
👤 Status Klien: ${memberStatus}

Mohon bantuannya untuk konfirmasi dan proses pesanan ini ya Kak. Terima kasih! 🙏`;

    return `https://wa.me/6287815797525?text=${encodeURIComponent(text)}`;
  }, [isCartEmpty, activeService, currentNumericQty, currentSubtotal, orderCart, totalRawSubtotal, isMember, memberDiscountAmount, finalGrandTotal, user]);

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
            Kalkulator & Total Order
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Pilih layanan, ketik jumlah halaman/unit secara manual, dan tambahkan beberapa layanan sekaligus untuk menghitung total biaya secara instan dan transparan.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-10 sm:py-14 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Service Selection & Manual Input (7 Cols) */}
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

              {/* Step 2: Manual Number Input & Add to Order */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                    Input Manual Jumlah {activeService.unitLabel}
                  </h2>
                  <span className="text-xs text-slate-500 font-semibold">
                    Tarif: {formatRupiah(activeService.basePrice)} / {activeService.unitLabel}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-5 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeService.description}
                  </p>
                </div>

                {/* Direct Manual Number Input Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Masukkan Jumlah {activeService.unitLabel} yang Diinginkan:
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setInputQuantity((prev) => Math.max(1, (typeof prev === 'number' ? prev : parseInt(prev, 10) || 1) - activeService.step))}
                        className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-800 transition-colors cursor-pointer shrink-0"
                        title="Kurangi"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="1"
                          max={activeService.maxQty}
                          value={inputQuantity}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              setInputQuantity('');
                            } else {
                              const parsed = parseInt(val, 10);
                              setInputQuantity(isNaN(parsed) ? 1 : Math.max(1, parsed));
                            }
                          }}
                          placeholder={`Contoh: 15`}
                          className="w-full h-12 bg-white border-2 border-slate-300 focus:border-slate-900 rounded-xl px-4 text-base font-bold text-slate-900 text-center outline-none transition-all shadow-2xs"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold pointer-events-none">
                          {activeService.unitLabel}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setInputQuantity((prev) => (typeof prev === 'number' ? prev : parseInt(prev, 10) || 1) + activeService.step)}
                        className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-800 transition-colors cursor-pointer shrink-0"
                        title="Tambah"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal Preview for this selected item */}
                  <div className="p-3.5 bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">
                      Subtotal ({currentNumericQty} {activeService.unitLabel} × {formatRupiah(activeService.basePrice)}):
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatRupiah(currentSubtotal)}
                    </span>
                  </div>

                  {/* Button: Add to Order Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-99"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Tambahkan Layanan Ini ke Daftar Order</span>
                  </button>

                  {/* Notice feedback */}
                  <AnimatePresence>
                    {justAddedNotice && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{justAddedNotice}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Column: Multi-Item Order Cart & Grand Total (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Daftar Pesanan Anda</h3>
                      <p className="text-[11px] text-slate-500">
                        {orderCart.length === 0 ? '1 Layanan Aktif' : `${orderCart.length} Layanan Ditambahkan`}
                      </p>
                    </div>
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

                {/* Items List */}
                <div className="py-4 space-y-3 text-xs border-b border-slate-200 max-h-[300px] overflow-y-auto pr-1">
                  {orderCart.length === 0 ? (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">{activeService.name}</span>
                        <span className="font-bold text-slate-900">{formatRupiah(currentSubtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{currentNumericQty} {activeService.unitLabel} × {formatRupiah(activeService.basePrice)}</span>
                        <span className="text-[10px] text-slate-400">(Item aktif)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                        💡 Klik <b>&quot;+ Tambahkan Layanan Ini&quot;</b> untuk mengombinasikan dengan layanan lain.
                      </p>
                    </div>
                  ) : (
                    orderCart.map((item, index) => (
                      <div
                        key={item.cartId}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold shrink-0">
                              {index + 1}
                            </span>
                            <h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
                          </div>
                          <p className="text-[11px] text-slate-600 pl-5.5">
                            {item.quantity} {item.unitLabel} × {formatRupiah(item.unitPrice)} = <span className="font-bold text-slate-900">{formatRupiah(item.subtotal)}</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(item.cartId)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                          title="Hapus Layanan Ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Subtotal & Member Discount Breakdown */}
                <div className="py-4 space-y-2.5 text-xs border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Subtotal Semua Pesanan:</span>
                    <span className="font-bold text-slate-900">{formatRupiah(totalRawSubtotal)}</span>
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

                {/* Grand Total Display */}
                <div className="py-4 text-center bg-slate-50 rounded-xl border border-slate-200 my-4">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Estimasi Grand Total
                  </span>
                  <div className="text-3xl font-extrabold text-slate-900">
                    {formatRupiah(finalGrandTotal)}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {orderCart.length > 0 ? `Total untuk ${orderCart.length} jenis layanan` : 'Total 1 layanan terpilih'}
                  </span>
                </div>

                {/* Total Order WhatsApp CTA */}
                <div className="space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Total Order via WhatsApp</span>
                  </a>

                  {orderCart.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="w-full py-2 text-center text-xs text-slate-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
                    >
                      Kosongkan Daftar Pesanan
                    </button>
                  )}

                  {/* Standard Academic Guarantees */}
                  <div className="pt-2 space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100">
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
