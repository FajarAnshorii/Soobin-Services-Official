'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  CheckCircle2,
  ShieldCheck,
  Send,
  Plus,
  Minus,
  Info,
  Trash2,
  ShoppingCart,
  PlusCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Filter
} from 'lucide-react';
import { categories as allCategories, services as staticServices } from '@/lib/servicesData';
import { useRealtimeServices } from '@/hooks/useRealtimeServices';
import { parseTokenToNumber } from '@/lib/priceUtils';

interface CartItem {
  cartId: string;
  serviceId: number | string;
  name: string;
  category: string;
  unitPrice: number;
  unitLabel: string;
  quantity: number;
  subtotal: number;
  isTurnitinOrAi: boolean;
}

const ITEMS_PER_PAGE = 6; // Strictly 2 columns x 3 rows = max 3 rows

export default function KalkulatorOrderPage() {
  const { user } = useAuth();
  const { services: realtimeDbServices } = useRealtimeServices();

  // Merge static services with realtime database services
  const allServicesList = useMemo(() => {
    if (realtimeDbServices && realtimeDbServices.length > 0) {
      return realtimeDbServices.map((ds: any) => {
        const defaultItem = staticServices.find((s) => s.id === ds.id || s.name?.toLowerCase() === ds.name?.toLowerCase());
        return {
          id: ds.id,
          category: ds.category || defaultItem?.category || 'umum',
          name: ds.name || defaultItem?.name || 'Layanan Akademik',
          price: ds.price || defaultItem?.price || 'Chat Admin',
          icon: defaultItem?.icon || FileText,
          description: ds.description || 'Pengerjaan cepat, profesional & garansi kualitas hasil terbaik.',
        };
      });
    }
    return staticServices.map((s: any) => ({
      ...s,
      description: s.description || 'Pengerjaan cepat, profesional & garansi kualitas hasil terbaik.',
    }));
  }, [realtimeDbServices]);

  // States
  const [selectedServiceId, setSelectedServiceId] = useState<number | string>(1);
  const [inputQuantity, setInputQuantity] = useState<number | string>(1);
  const [orderCart, setOrderCart] = useState<CartItem[]>([]);
  const [justAddedNotice, setJustAddedNotice] = useState<string | null>(null);

  // Search & Category
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Helper: Detect unit label & base price for any service string
  const getServiceMeta = (service: any) => {
    const priceStr = service.price || '';
    const lowerPrice = priceStr.toLowerCase();
    const priceNum = parseTokenToNumber(priceStr);
    const cat = service.category || '';
    const nameLower = (service.name || '').toLowerCase();

    let unitLabel = 'Item / Dokumen';
    if (lowerPrice.includes('/hal') || lowerPrice.includes('/halaman') || nameLower.includes('halaman') || nameLower.includes('parafrase') || nameLower.includes('pengetikan')) {
      unitLabel = 'Halaman';
    } else if (lowerPrice.includes('/slide') || nameLower.includes('ppt') || nameLower.includes('slide')) {
      unitLabel = 'Slide';
    } else if (lowerPrice.includes('/sumber') || nameLower.includes('pustaka') || nameLower.includes('mendeley')) {
      unitLabel = 'Sumber Rujukan';
    } else if (lowerPrice.includes('/review') || nameLower.includes('review jurnal')) {
      unitLabel = 'Artikel Review';
    } else if (lowerPrice.includes('/produk') || lowerPrice.includes('/foto')) {
      unitLabel = 'Produk / Foto';
    } else if (lowerPrice.includes('/caption') || lowerPrice.includes('/post') || lowerPrice.includes('/story')) {
      unitLabel = 'Post / Konten';
    } else if (lowerPrice.includes('/artikel') || lowerPrice.includes('/jurnal')) {
      unitLabel = 'Artikel Jurnal';
    } else if (cat === 'turnitin') {
      unitLabel = lowerPrice.includes('paket') || nameLower.includes('paket') ? 'Paket' : 'Dokumen';
    } else if (cat === 'unlock') {
      unitLabel = 'File Dokumen';
    } else if (cat === 'uji-data') {
      unitLabel = 'Paket Analisis';
    } else if (cat === 'uiux') {
      unitLabel = 'Halaman / Screen';
    } else if (cat === 'tugas-sekolah' || cat === 'joki-tugas' || cat === 'joki-skripsi' || cat === 'laporan-akademik') {
      unitLabel = 'Tugas / Naskah';
    }

    const isTurnitinOrAi = cat === 'turnitin' || nameLower.includes('turnitin') || nameLower.includes('cek ai') || nameLower.includes('zerogpt');

    return {
      basePrice: priceNum > 0 ? priceNum : 50000,
      isChatAdmin: priceNum === 0 || lowerPrice.includes('chat'),
      unitLabel,
      isTurnitinOrAi,
    };
  };

  // Filtered services based on search and category
  const filteredServices = useMemo(() => {
    return allServicesList.filter((service) => {
      const matchCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [allServicesList, selectedCategory, searchQuery]);

  // Pagination calculations (strictly 6 items per page)
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE) || 1;
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  // Active selected service object
  const activeService = useMemo(() => {
    const found = allServicesList.find((s) => s.id === selectedServiceId);
    return found || allServicesList[0] || staticServices[0];
  }, [allServicesList, selectedServiceId]);

  const activeServiceMeta = useMemo(() => {
    return getServiceMeta(activeService);
  }, [activeService]);

  // Reset pagination on filter changes
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  // Service selection
  const handleSelectService = (service: any) => {
    setSelectedServiceId(service.id);
    const meta = getServiceMeta(service);
    if (meta.unitLabel === 'Halaman' || meta.unitLabel === 'Slide') {
      setInputQuantity(10);
    } else {
      setInputQuantity(1);
    }
  };

  // Safe parsed quantity
  const currentNumericQty = useMemo(() => {
    const n = typeof inputQuantity === 'string' ? parseInt(inputQuantity, 10) : inputQuantity;
    return isNaN(n) || n <= 0 ? 1 : n;
  }, [inputQuantity]);

  // Active service subtotal
  const currentSubtotal = useMemo(() => {
    return activeServiceMeta.basePrice * currentNumericQty;
  }, [activeServiceMeta.basePrice, currentNumericQty]);

  // Add to Cart
  const handleAddToCart = () => {
    const existingIndex = orderCart.findIndex((item) => item.serviceId === activeService.id);
    let updatedCart: CartItem[];

    if (existingIndex > -1) {
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
      const newItem: CartItem = {
        cartId: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        serviceId: activeService.id,
        name: activeService.name,
        category: activeService.category,
        unitPrice: activeServiceMeta.basePrice,
        unitLabel: activeServiceMeta.unitLabel,
        quantity: currentNumericQty,
        subtotal: currentSubtotal,
        isTurnitinOrAi: activeServiceMeta.isTurnitinOrAi,
      };
      updatedCart = [...orderCart, newItem];
    }

    setOrderCart(updatedCart);
    setJustAddedNotice(`Berhasil menambahkan: ${activeService.name} (${currentNumericQty} ${activeServiceMeta.unitLabel})`);
    setTimeout(() => setJustAddedNotice(null), 3000);
  };

  // Remove item
  const handleRemoveFromCart = (cartId: string) => {
    setOrderCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // Clear cart
  const handleClearCart = () => {
    if (orderCart.length === 0) return;
    if (confirm('Kosongkan semua daftar pesanan?')) {
      setOrderCart([]);
    }
  };

  const isCartEmpty = orderCart.length === 0;

  const totalRawSubtotal = useMemo(() => {
    if (isCartEmpty) {
      return currentSubtotal;
    }
    return orderCart.reduce((sum, item) => sum + item.subtotal, 0);
  }, [isCartEmpty, currentSubtotal, orderCart]);

  // Member discount (5% strictly ONLY for Turnitin & Cek AI)
  const isMember = Boolean(user);
  const memberDiscountAmount = useMemo(() => {
    if (!isMember) return 0;
    if (isCartEmpty) {
      return activeServiceMeta.isTurnitinOrAi ? Math.round(currentSubtotal * 0.05) : 0;
    }
    return orderCart.reduce((sum, item) => {
      if (item.isTurnitinOrAi) {
        return sum + Math.round(item.subtotal * 0.05);
      }
      return sum;
    }, 0);
  }, [isMember, isCartEmpty, activeServiceMeta.isTurnitinOrAi, currentSubtotal, orderCart]);

  const finalGrandTotal = totalRawSubtotal - memberDiscountAmount;

  // Currency formatter
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // WhatsApp order link generator
  const whatsappUrl = useMemo(() => {
    const memberStatus = isMember ? `Member (${user?.name || 'Aktif'})` : 'Reguler';
    const discountText = memberDiscountAmount > 0 ? `\nPotongan Diskon Member Turnitin & AI (5%): -${formatRupiah(memberDiscountAmount)}` : '';

    let itemsBreakdown = '';
    if (isCartEmpty) {
      itemsBreakdown = `1. ${activeService.name} (${currentNumericQty} ${activeServiceMeta.unitLabel}) - ${formatRupiah(currentSubtotal)}`;
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
  }, [isCartEmpty, activeService, currentNumericQty, activeServiceMeta, currentSubtotal, orderCart, totalRawSubtotal, isMember, memberDiscountAmount, finalGrandTotal, user]);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Header Section */}
      <section className="pt-28 sm:pt-36 pb-8 sm:pb-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5 text-slate-700" />
            <span>Kalkulator & Total Order Seluruh Layanan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Kalkulator Order
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Cari dari seluruh katalog layanan kami, input jumlah halaman atau unit secara manual, dan tambahkan beberapa layanan ke dalam satu total pesanan resmi.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-8 sm:py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Service Selection, Search, 14 Categories, & Manual Input (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Select Service with Search & 14 Category Tabs */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                    Pilih Jenis Layanan
                  </h2>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Menampilkan {filteredServices.length} dari {allServicesList.length} Layanan
                  </span>
                </div>

                {/* Search Bar Input */}
                <div className="relative mb-3.5">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Cari layanan apa saja... (misal: SPSS, Mendeley, PPT, Skripsi, Scribd, Logo, dll)"
                    className="w-full h-10 pl-10 pr-4 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs font-medium text-slate-900 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold px-1.5 py-0.5 rounded cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* 14 Category Filter Tabs Matching /layanan */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3.5 scrollbar-none no-scrollbar">
                  {allCategories.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    const IconComponent = cat.icon || Filter;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Services Grid (Strictly 2 Columns x Max 3 Rows = 6 Cards) */}
                {paginatedServices.length === 0 ? (
                  <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                    <Search className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                    <p className="text-xs font-semibold text-slate-700">Layanan tidak ditemukan</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Coba kata kunci lain atau pilih tab Semua</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 min-h-[220px]">
                    {paginatedServices.map((srv) => {
                      const Icon = srv.icon || FileText;
                      const isSelected = selectedServiceId === srv.id;
                      const srvMeta = getServiceMeta(srv);

                      return (
                        <button
                          key={srv.id}
                          type="button"
                          onClick={() => handleSelectService(srv)}
                          className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 h-[68px] ${
                            isSelected
                              ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-900 hover:border-slate-400 hover:bg-slate-50/80'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`} title={srv.name}>
                              {srv.name}
                            </h3>
                            <p className={`text-[11px] font-semibold mt-0.5 ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                              {srv.price}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Pagination Controls (Max 3 Rows Height Guard) */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-3.5 mt-3 border-t border-slate-200">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-slate-600 px-2">
                        Halaman {currentPage} dari {totalPages}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Step 2: Manual Number Input & Add to Order */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                    Input Manual Jumlah {activeServiceMeta.unitLabel}
                  </h2>
                  <span className="text-xs text-slate-500 font-semibold">
                    Tarif Dasar: {activeService.price}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-5 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <b>{activeService.name}</b> — {activeService.description}
                  </p>
                </div>

                {/* Direct Manual Number Input Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Masukkan Jumlah {activeServiceMeta.unitLabel} yang Diinginkan:
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setInputQuantity((prev) => Math.max(1, (typeof prev === 'number' ? prev : parseInt(prev, 10) || 1) - 1))}
                        className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-800 transition-colors cursor-pointer shrink-0"
                        title="Kurangi"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="1"
                          max="999"
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
                          placeholder="Contoh: 10"
                          className="w-full h-12 bg-white border-2 border-slate-300 focus:border-slate-900 rounded-xl px-4 text-base font-bold text-slate-900 text-center outline-none transition-all shadow-2xs"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold pointer-events-none">
                          {activeServiceMeta.unitLabel}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setInputQuantity((prev) => (typeof prev === 'number' ? prev : parseInt(prev, 10) || 1) + 1)}
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
                      Subtotal ({currentNumericQty} {activeServiceMeta.unitLabel} × {formatRupiah(activeServiceMeta.basePrice)}):
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
                        <span>{currentNumericQty} {activeServiceMeta.unitLabel} × {formatRupiah(activeServiceMeta.basePrice)}</span>
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
                    memberDiscountAmount > 0 ? (
                      <div className="flex items-center justify-between text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 font-semibold">
                        <span>Diskon Member Turnitin & AI (5%):</span>
                        <span>-{formatRupiah(memberDiscountAmount)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-[11px]">
                        <span>Diskon Member (5%):</span>
                        <span className="font-medium text-slate-700">Khusus Layanan Turnitin & Cek AI</span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-between text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-[11px]">
                      <span>Benefit Akun Member:</span>
                      <span className="font-semibold text-slate-800">Diskon 5% Turnitin & Cek AI</span>
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
