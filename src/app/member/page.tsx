'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart, CartItem } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  ShoppingCart,
  History,
  Trash2,
  Calendar,
  DollarSign,
  Clock,
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
  GraduationCap,
  Building,
  Mail,
  CheckCircle2
} from 'lucide-react';

export default function MemberPage() {
  const { user, loading } = useAuth();
  const { cart, orderHistory, removeFromCart, clearCart, placeOrder } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'history';
  const [activeTab, setActiveTab] = useState<string>(activeTabParam);

  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState<boolean>(true);

  // Fetch real-time orders directly from Supabase Database for the logged-in member
  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    const fetchMemberOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) return;
        const allOrders = await res.json();
        if (!Array.isArray(allOrders)) return;

        // Filter orders belonging to this member (by email)
        const myOrders = allOrders.filter(
          (o: any) => o && o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase()
        );

        if (isMounted) {
          setDbOrders(myOrders);
          setFetchingOrders(false);
        }
      } catch (err) {
        console.error('Failed to fetch member orders from Supabase:', err);
      } finally {
        if (isMounted) setFetchingOrders(false);
      }
    };

    fetchMemberOrders();
    const interval = setInterval(fetchMemberOrders, 5000); // 5s realtime sync

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  // Combine local order history and Supabase DB orders
  const combinedHistory = React.useMemo(() => {
    const map = new Map<string, any>();

    // Add DB orders first (realtime from Supabase)
    dbOrders.forEach((o) => {
      const createdDate = o.createdAt ? new Date(o.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'Hari Ini';

      map.set(o.id, {
        id: o.id,
        date: createdDate,
        items: [{ name: o.serviceName, price: o.price }],
        totalPrice: o.price,
        status: o.paymentStatus || 'Sedang Diproses',
        fileName: o.uploadedFileName,
        proofImage: o.proofImage,
      });
    });

    // Add local history orders
    orderHistory.forEach((o) => {
      if (!map.has(o.id)) {
        map.set(o.id, o);
      }
    });

    return Array.from(map.values());
  }, [dbOrders, orderHistory]);

  // Calculate total price of cart
  const getCartTotal = () => {
    let hasNumericPrice = false;
    const total = cart.reduce((acc, curr) => {
      if (curr.price.includes('Rp')) {
        hasNumericPrice = true;
        const num = parseInt(curr.price.replace(/[^0-9]/g, ''));
        return acc + num;
      }
      return acc;
    }, 0);

    return total > 0 ? `Rp ${total.toLocaleString('id-ID')}` : 'Chat Admin';
  };

  const handleCheckout = () => {
    if (!user || cart.length === 0) return;

    // Generate WhatsApp checkout message
    const waText = `Halo Kak, saya member SOOBIN:
- Nama: ${user.name}
- Kampus: ${user.university}
- Prodi: ${user.prodi}

Saya mau order layanan berikut:
${cart.map((item, idx) => `${idx + 1}. Jasa ${item.name} (${item.price})`).join('\n')}

Mohon segera diproses kak, terima kasih!`;

    const waLink = `https://wa.me/6287815797525?text=${encodeURIComponent(waText)}`;
    
    // Save to history & trigger notification toast
    placeOrder(cart);
    
    // Clear cart
    clearCart();

    // Open WhatsApp link in new tab
    window.open(waLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col pt-20">
      <Navbar />

      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-500 hover:text-primary-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: User Profile Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-150 p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
              <div className="w-16 h-16 rounded-full bg-primary-800 text-white flex items-center justify-center text-2xl font-black uppercase shadow-inner">
                {user?.name?.charAt(0) || 'M'}
              </div>
              <div className="flex flex-col truncate">
                <h2 className="text-lg font-black text-gray-900 truncate">{user?.name}</h2>
                <span className="bg-green-100 text-green-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider w-max mt-1">
                  Member SOOBIN
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Mail className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                <span className="truncate">{user?.university}</span>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                <span className="truncate">{user?.prodi}</span>
              </div>
            </div>

            {/* Member Benefit Box */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3.5 flex items-start gap-2.5">
              <div className="text-emerald-600 font-black text-base shrink-0 mt-0.5">👑</div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-emerald-900">Hak Istimewa Member</span>
                <p className="text-[11px] text-emerald-700 leading-relaxed mt-0.5">
                  Diskon 5% otomatis aktif untuk seluruh layanan Cek Turnitin & Cek AI!
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Cart & History Tabs */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Tab Buttons */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab('history');
                  router.push('/member?tab=history');
                }}
                className={`py-3.5 px-6 font-bold text-sm sm:text-base border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
                  activeTab === 'history'
                    ? 'border-primary-800 text-primary-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <History className="w-4.5 h-4.5" />
                Riwayat Pembelian
              </button>
              <button
                onClick={() => {
                  setActiveTab('cart');
                  router.push('/member?tab=cart');
                }}
                className={`py-3.5 px-6 font-bold text-sm sm:text-base border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
                  activeTab === 'cart'
                    ? 'border-primary-800 text-primary-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                Keranjang Belanja ({cart.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="min-h-[400px]">
              {activeTab === 'history' ? (
                /* Tab 1: History */
                <div className="flex flex-col gap-4">
                  {fetchingOrders && combinedHistory.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-800"></div>
                    </div>
                  ) : combinedHistory.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Belum ada riwayat pesanan</h3>
                      <p className="text-sm text-gray-500 max-w-sm">
                        Anda belum pernah memesan jasa akademik di SOOBIN. Mulai pesan sekarang untuk mendapatkan hasil tugas terbaik!
                      </p>
                      <Link href="/layanan" className="mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-primary-800 hover:bg-primary-750 text-white transition-all shadow-md">
                        Jelajahi Jasa Kami
                      </Link>
                    </div>
                  ) : (
                    combinedHistory.map((order) => {
                      const isLunas = order.status?.toLowerCase().includes('lunas');
                      const isCancel = order.status?.toLowerCase().includes('batal');

                      return (
                        <div key={order.id} className="bg-white rounded-xl border border-gray-150 p-5 sm:p-6 shadow-sm flex flex-col gap-4">
                          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                                {order.id}
                              </span>
                              <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" /> {order.date}
                              </span>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1 ${
                              isLunas
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : isCancel
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              <Clock className="w-3 h-3" /> {order.status}
                            </span>
                          </div>

                          <div className="flex flex-col gap-3">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-sm font-semibold">
                                <span className="text-gray-900">{item.name}</span>
                                <span className="text-gray-500 text-xs">{item.price}</span>
                              </div>
                            ))}
                            {order.fileName && (
                              <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary-800" />
                                <span>File Dokumen: <strong>{order.fileName}</strong></span>
                              </div>
                            )}
                          </div>

                          <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Harga</span>
                            <span className="text-base font-extrabold text-primary-800">{order.totalPrice}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                /* Tab 2: Shopping Cart */
                <div className="flex flex-col gap-6">
                  {cart.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Keranjang Belanja Kosong</h3>
                      <p className="text-sm text-gray-500 max-w-sm">
                        Belum ada layanan yang ditambahkan. Klik ikon keranjang belanja di daftar produk layanan kami untuk memasukkannya ke sini.
                      </p>
                      <Link href="/layanan" className="mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-primary-800 hover:bg-primary-750 text-white transition-all shadow-md">
                        Cari Jasa
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm flex flex-col">
                      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-extrabold text-gray-900">Daftar Layanan Terpilih</h3>
                        <button onClick={clearCart} className="text-xs font-bold text-red-600 hover:underline">
                          Kosongkan Keranjang
                        </button>
                      </div>

                      <div className="divide-y divide-gray-100">
                        {cart.map((item) => (
                          <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                            <div className="flex flex-col min-w-0">
                              <h4 className="font-bold text-sm sm:text-base text-gray-900 truncate">{item.name}</h4>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                                {item.category}
                              </span>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="font-extrabold text-sm sm:text-base text-primary-800 shrink-0">
                                {item.price}
                              </span>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Hapus"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-5 bg-slate-50 border-t border-gray-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Total Belanja</span>
                          <span className="text-xl font-extrabold text-gray-950 mt-0.5">{getCartTotal()}</span>
                        </div>

                        <button
                          onClick={handleCheckout}
                          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-bold bg-primary-800 hover:bg-primary-750 text-white transition-all shadow-lg shadow-primary-950/10 hover:shadow-primary-950/20 hover:-translate-y-0.5"
                        >
                          Pesan Semua via WhatsApp <ExternalLink className="w-4 h-4 ml-1.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
