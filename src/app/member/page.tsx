'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
  CheckCircle2,
  Gift,
  Upload,
  Send,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';

export default function MemberPage() {
  const { user, loading } = useAuth();
  const { cart, orderHistory, removeFromCart, clearCart, placeOrder } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'history';
  const [activeTab, setActiveTab] = useState<string>(activeTabParam);

  // Sync tab state when URL search params change
  useEffect(() => {
    if (activeTabParam) {
      setActiveTab(activeTabParam);
    }
  }, [activeTabParam]);

  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState<boolean>(true);

  // REDEEM FREE TURNITIN STATES
  const [redeems, setRedeems] = useState<any[]>([]);
  const [fetchingRedeems, setFetchingRedeems] = useState<boolean>(true);
  const [redeemPlatform, setRedeemPlatform] = useState<'WhatsApp Status' | 'Instagram Story'>('WhatsApp Status');
  const [redeemPhone, setRedeemPhone] = useState<string>('');
  const [redeemProofImage, setRedeemProofImage] = useState<string>('');
  const [redeemAgreed, setRedeemAgreed] = useState<boolean>(false);
  const [submittingRedeem, setSubmittingRedeem] = useState<boolean>(false);
  const [redeemSubmitError, setRedeemSubmitError] = useState<string>('');
  const [copiedVoucher, setCopiedVoucher] = useState<boolean>(false);
  const [cooldownRemainingText, setCooldownRemainingText] = useState<string>('');

  // Fetch real-time member redeems from Supabase / API
  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    const fetchMemberRedeems = async () => {
      try {
        const res = await fetch(`/api/redeems?email=${encodeURIComponent(user.email)}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && isMounted) {
          setRedeems(data);
        }
      } catch (err) {
        console.error('Failed to fetch member redeems:', err);
      } finally {
        if (isMounted) setFetchingRedeems(false);
      }
    };

    fetchMemberRedeems();
    const interval = setInterval(fetchMemberRedeems, 4000); // 4s realtime poll

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  // Derived Redeem Stats
  const latestRedeem = useMemo(() => {
    if (!redeems || redeems.length === 0) return null;
    return [...redeems].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }, [redeems]);

  const memberApprovedCount = useMemo(() => {
    return redeems.filter((r) => r.status === 'DISETUJUI').length;
  }, [redeems]);

  const latestApproved = useMemo(() => {
    const approved = redeems.filter((r) => r.status === 'DISETUJUI');
    if (approved.length === 0) return null;
    return approved.sort((a, b) => new Date(b.approvedAt || b.createdAt).getTime() - new Date(a.approvedAt || a.createdAt).getTime())[0];
  }, [redeems]);

  // 3-Day (72 Hour) Cooldown Calculation
  const isCooldownActive = useMemo(() => {
    if (!latestApproved) return false;
    const approvedTime = new Date(latestApproved.approvedAt || latestApproved.createdAt).getTime();
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
    return (Date.now() - approvedTime) < THREE_DAYS_MS;
  }, [latestApproved]);

  // Live Timer for Cooldown
  useEffect(() => {
    if (!latestApproved || !isCooldownActive) {
      setCooldownRemainingText('');
      return;
    }

    const updateTimer = () => {
      const approvedTime = new Date(latestApproved.approvedAt || latestApproved.createdAt).getTime();
      const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
      const diff = THREE_DAYS_MS - (Date.now() - approvedTime);

      if (diff <= 0) {
        setCooldownRemainingText('Siap Klaim Baru');
        return;
      }

      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((diff % (60 * 1000)) / 1000);

      if (days > 0) {
        setCooldownRemainingText(`${days} Hari ${hours} Jam ${minutes} Menit`);
      } else {
        setCooldownRemainingText(`${hours} Jam ${minutes} Menit ${seconds} Detik`);
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [latestApproved, isCooldownActive]);

  // Handle Proof Image File Upload with compression to base64
  const handleRedeemFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran file terlalu besar! Maksimal 8 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new (window as any).Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setRedeemProofImage(dataUrl);
      };
    };
    reader.readAsDataURL(file);
  };

  // Submit Redeem Claim
  const handleRedeemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!redeemProofImage) {
      setRedeemSubmitError('Silakan unggah foto screenshot bukti share terlebih dahulu!');
      return;
    }
    if (!redeemAgreed) {
      setRedeemSubmitError('Anda wajib menyetujui pernyataan bahwa status/story diset publik.');
      return;
    }

    setSubmittingRedeem(true);
    setRedeemSubmitError('');

    try {
      const payload = {
        memberEmail: user.email,
        memberName: user.name || 'Member SOOBIN',
        memberUniversity: user.university || '-',
        memberProdi: user.prodi || '-',
        memberPhone: redeemPhone || '-',
        platform: redeemPlatform,
        proofImage: redeemProofImage,
      };

      const res = await fetch('/api/redeems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal mengirim pengajuan klaim');
      }

      // Reset form
      setRedeemProofImage('');
      setRedeemAgreed(false);
      
      // Refresh list immediately
      const refreshed = await fetch(`/api/redeems?email=${encodeURIComponent(user.email)}`, { cache: 'no-store' });
      if (refreshed.ok) {
        const data = await refreshed.json();
        if (Array.isArray(data)) setRedeems(data);
      }
    } catch (err: any) {
      setRedeemSubmitError(err.message || 'Terjadi kesalahan saat mengirim pengajuan');
    } finally {
      setSubmittingRedeem(false);
    }
  };

  // Helper for generating Direct WhatsApp Link
  const getWhatsAppRedeemLink = (voucherCode?: string | null) => {
    const code = voucherCode || 'SBN-TRN-OFFICIAL';
    const waText = `Halo Admin SOOBIN, saya member resmi mau klaim Free Cek Turnitin 1x No Repository:
- Nama: ${user?.name || '-'}
- Email: ${user?.email || '-'}
- Kampus: ${user?.university || '-'}
- KODE VOUCHER RESMI: ${code}

Berikut saya lampirkan dokumen skripsi / tugas saya untuk dicekkan Turnitin No Repository gratis. Terima kasih admin!`;

    return `https://wa.me/6287815797525?text=${encodeURIComponent(waText)}`;
  };

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
                className={`py-3.5 px-4 sm:px-6 font-bold text-xs sm:text-base border-b-2 flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all ${
                  activeTab === 'history'
                    ? 'border-primary-800 text-primary-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <History className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <span>Riwayat Pesanan</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('cart');
                  router.push('/member?tab=cart');
                }}
                className={`py-3.5 px-4 sm:px-6 font-bold text-xs sm:text-base border-b-2 flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all ${
                  activeTab === 'cart'
                    ? 'border-primary-800 text-primary-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <span>Keranjang ({cart.length})</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('redeem');
                  router.push('/member?tab=redeem');
                }}
                className={`py-3.5 px-4 sm:px-6 font-bold text-xs sm:text-base border-b-2 flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all relative ${
                  activeTab === 'redeem'
                    ? 'border-primary-800 text-primary-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Gift className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-500" />
                <span>Free Turnitin (3 Hari)</span>
                <span className="hidden sm:inline-block ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[10px] font-black rounded-full uppercase">
                  Gratis
                </span>
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
              ) : activeTab === 'cart' ? (
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
              ) : (
                /* Tab 3: Redeem Free Turnitin (3 Hari Sekali) */
                <div className="flex flex-col gap-6">
                  {/* Top Highlights: Stats & Monthly Top Sharer Reward Info */}
                  <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                        <Gift className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-gray-950">Free Cek Turnitin (3 Hari Sekali)</h3>
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                            No Repository
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Bagikan info/poster SOOBIN ke Status WA atau Story IG publik dan dapatkan Cek Turnitin gratis 1x tiap 3 hari.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-amber-200 shadow-2xs self-stretch sm:self-auto justify-between sm:justify-start">
                      <span className="text-xs font-bold text-gray-500">Total Share Berhasil:</span>
                      <span className="text-sm font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                        {memberApprovedCount}x
                      </span>
                    </div>
                  </div>

                  {/* Monthly Top Sharer Incentive Notice */}
                  <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm border border-slate-800">
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-amber-300">Reward Bulanan: Gratis 1x Cek AI!</h4>
                      <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                        Member dengan frekuensi share terbanyak tiap bulan akan otomatis mendapatkan voucher <strong>Gratis 1x Cek AI ZeroGPT</strong>.
                      </p>
                    </div>
                  </div>

                  {/* ACTIVE CLAIM STATUS STATES */}
                  {fetchingRedeems ? (
                    <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-800"></div>
                    </div>
                  ) : latestRedeem && latestRedeem.status === 'MENUNGGU_VERIFIKASI' ? (
                    /* STATE 1: PENDING VERIFICATION */
                    <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm flex flex-col gap-4">
                      <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                        <div className="flex items-center gap-2.5">
                          <Clock className="w-5 h-5 text-amber-600" />
                          <h4 className="text-sm font-black text-gray-900">Pengajuan Sedang Diverifikasi Admin</h4>
                        </div>
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          Menunggu ACC
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        Terima kasih! Bukti tangkapan layar share <strong>{latestRedeem.platform}</strong> Anda telah terkirim pada{' '}
                        <strong>{new Date(latestRedeem.createdAt).toLocaleString('id-ID')}</strong> dan sedang diperiksa oleh tim admin SOOBIN (Estimasi 5–15 menit).
                      </p>

                      {latestRedeem.proofImage && (
                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <img
                            src={latestRedeem.proofImage}
                            alt="Bukti Share"
                            className="w-16 h-16 object-cover rounded-lg border border-slate-300"
                          />
                          <div className="flex flex-col text-xs text-gray-600">
                            <span className="font-bold text-gray-900">Bukti Share Terunggah</span>
                            <span className="text-[11px] text-gray-500">Platform: {latestRedeem.platform}</span>
                            <span className="text-[10px] text-emerald-600 font-bold mt-0.5">✓ Wajib berstatus publik</span>
                          </div>
                        </div>
                      )}

                      <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900">
                        🔔 <strong>Tips:</strong> Setelah disetujui, halaman ini akan otomatis menampilkan tombol <strong>Klaim Voucher ke WhatsApp</strong> dengan kode acak resmi Anda.
                      </div>
                    </div>
                  ) : latestRedeem && latestRedeem.status === 'DISETUJUI' && isCooldownActive ? (
                    /* STATE 2: APPROVED & COOLDOWN ACTIVE (3 DAYS) */
                    <div className="bg-white rounded-2xl border-2 border-emerald-400 p-6 shadow-md flex flex-col gap-5">
                      <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                          <div>
                            <h4 className="text-sm sm:text-base font-black text-gray-950">Klaim Anda Berhasil Disetujui!</h4>
                            <p className="text-[11px] text-emerald-700">Kode voucher Free Turnitin No Repository siap digunakan.</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Disetujui Admin
                        </span>
                      </div>

                      {/* Voucher Card Showcase */}
                      <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-500/30">
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                            KODE VOUCHER RESMI SOOBIN
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wider">
                              {latestRedeem.voucherCode || 'SBN-TRN-OFFICIAL'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (latestRedeem.voucherCode) {
                                  navigator.clipboard.writeText(latestRedeem.voucherCode);
                                  setCopiedVoucher(true);
                                  setTimeout(() => setCopiedVoucher(false), 2000);
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
                            >
                              {copiedVoucher ? 'Tersalin!' : 'Salin'}
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            1x Cek Turnitin No Repository + Garansi Hasil & Bebas Masuk Database Kampus.
                          </p>
                        </div>

                        {/* Direct WhatsApp CTA Button */}
                        <a
                          href={getWhatsAppRedeemLink(latestRedeem.voucherCode)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] shrink-0"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Klaim Voucher via WhatsApp</span>
                        </a>
                      </div>

                      {/* 3-Day Cooldown Notice */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 text-gray-700">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span>Klaim gratis berikutnya dapat diajukan dalam:</span>
                        </div>
                        <span className="font-mono font-black text-primary-800 bg-primary-50 px-3 py-1 rounded-lg border border-primary-200 text-center sm:text-right">
                          ⏳ {cooldownRemainingText} (Cooldown 3 Hari)
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* STATE 3: SUBMIT FORM (NEW CLAIM / COOLDOWN EXPIRED / AFTER REJECT) */
                    <div className="bg-white rounded-2xl border border-gray-150 p-5 sm:p-7 shadow-sm flex flex-col gap-6">
                      
                      {/* Rejected Notice if previous was rejected */}
                      {latestRedeem && latestRedeem.status === 'DITOLAK' && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col gap-1.5 text-xs text-red-900">
                          <div className="flex items-center gap-2 font-black">
                            <span className="w-2 h-2 rounded-full bg-red-600"></span>
                            <span>Pengajuan Sebelumnya Ditolak Admin:</span>
                          </div>
                          <p className="text-red-700 leading-relaxed ml-4">
                            "{latestRedeem.adminNote || 'Bukti status/story tidak berstatus publik atau dikecualikan.'}"
                          </p>
                          <p className="text-[11px] text-red-600 ml-4 font-semibold mt-1">
                            Silakan upload ulang tangkapan layar status publik yang memenuhi syarat di bawah ini.
                          </p>
                        </div>
                      )}

                      {/* Rule Banner */}
                      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                            !
                          </div>
                          <h4 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wide">
                            Syarat & Ketentuan Wajib Share Publik
                          </h4>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                          <li>
                            Share poster/banner promosi SOOBIN Services ke <strong>Status WhatsApp</strong> atau <strong>Story Instagram</strong>.
                          </li>
                          <li className="text-amber-200 font-bold">
                            ⚠️ WAJIB PUBLIK: Status/Story WAJIB dapat dilihat oleh SEMUA KONTAK / PUBLIK. Screenshot yang hanya memperlihatkan status dibagikan ke kontak admin SOOBIN saja (dikecualikan/custom privacy) OTOMATIS DITOLAK.
                          </li>
                          <li>
                            Unggah screenshot yang memperlihatkan status telah tayang dan menu pengaturan privasi/viewers.
                          </li>
                          <li>
                            Klaim dapat dilakukan secara rutin <strong>1x setiap 3 hari</strong>.
                          </li>
                        </ul>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleRedeemSubmit} className="space-y-5">
                        {/* Platform Selector */}
                        <div>
                          <label className="block text-xs font-black text-gray-900 mb-2">
                            Pilih Platform Share <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setRedeemPlatform('WhatsApp Status')}
                              className={`p-3 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                redeemPlatform === 'WhatsApp Status'
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                  : 'bg-slate-50 text-gray-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <MessageCircle className="w-4 h-4 text-emerald-400" />
                              <span>Status WhatsApp</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setRedeemPlatform('Instagram Story')}
                              className={`p-3 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                redeemPlatform === 'Instagram Story'
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                  : 'bg-slate-50 text-gray-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span className="text-pink-400 text-sm">📸</span>
                              <span>Story Instagram</span>
                            </button>
                          </div>
                        </div>

                        {/* WhatsApp Number Confirmation */}
                        <div>
                          <label className="block text-xs font-black text-gray-900 mb-1.5">
                            Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            value={redeemPhone}
                            onChange={(e) => setRedeemPhone(e.target.value)}
                            placeholder="Contoh: 081234567890"
                            className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 focus:border-slate-800 rounded-xl text-xs font-bold text-slate-900 outline-none"
                          />
                        </div>

                        {/* Screenshot Proof Upload */}
                        <div>
                          <label className="block text-xs font-black text-gray-900 mb-1.5">
                            Upload Bukti Tangkapan Layar (Screenshot) <span className="text-red-500">*</span>
                          </label>
                          
                          {redeemProofImage ? (
                            <div className="relative rounded-2xl border border-emerald-300 bg-emerald-50/50 p-4 flex items-center gap-4">
                              <img
                                src={redeemProofImage}
                                alt="Preview Bukti"
                                className="w-20 h-20 object-cover rounded-xl border border-emerald-200 shadow-xs"
                              />
                              <div className="flex flex-col gap-1">
                                <span className="text-xs font-black text-emerald-900">Bukti Foto Siap Dikirim</span>
                                <span className="text-[11px] text-emerald-700">Tangkapan layar resolusi penuh terlampir.</span>
                                <button
                                  type="button"
                                  onClick={() => setRedeemProofImage('')}
                                  className="text-xs font-bold text-red-600 hover:underline w-max cursor-pointer mt-1"
                                >
                                  Ganti Foto Lain
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-slate-50/60 hover:bg-white transition-all cursor-pointer">
                              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-2xs mb-2">
                                <Upload className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-black text-gray-900">Klik atau Tarik Foto Bukti ke Sini</span>
                              <span className="text-[11px] text-gray-500 mt-0.5">Format JPG, PNG, atau WebP (Maks. 5 MB)</span>
                              <input
                                type="file"
                                accept="image/*"
                                required
                                onChange={handleRedeemFileChange}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>

                        {/* Integrity Checkbox */}
                        <div className="flex items-start gap-2.5 pt-1">
                          <input
                            type="checkbox"
                            id="integrityCheck"
                            required
                            checked={redeemAgreed}
                            onChange={(e) => setRedeemAgreed(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-slate-900 cursor-pointer"
                          />
                          <label htmlFor="integrityCheck" className="text-xs text-gray-700 leading-relaxed cursor-pointer font-medium">
                            Saya menyatakan dengan jujur bahwa Status/Story ini <strong>dibagikan secara publik ke seluruh kontak</strong> (tidak di-private/tidak dikecualikan).
                          </label>
                        </div>

                        {redeemSubmitError && (
                          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                            {redeemSubmitError}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={submittingRedeem || !redeemProofImage || !redeemAgreed}
                          className="w-full h-12 rounded-xl bg-slate-900 hover:bg-black disabled:opacity-50 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                        >
                          {submittingRedeem ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Mengirim Bukti...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Kirim Pengajuan Klaim Free Turnitin</span>
                            </>
                          )}
                        </button>
                      </form>
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
