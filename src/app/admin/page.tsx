'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, LogOut, MessageSquare, Shield,
  School, Send, CircleAlert, Headphones,
  ShoppingBag, CheckCircle, XCircle, Eye, RefreshCw, X, QrCode,
  Download, Users, DollarSign, FileSpreadsheet, Edit3, Save, ChevronLeft, ChevronRight
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
  read: boolean;
  createdAt?: number;
}

interface ChatSession {
  id: string;
  name: string;
  email: string;
  university: string;
  prodi: string;
  lastUpdated: string;
  unreadCount: number;
  userUnreadCount: number;
  messages: Message[];
}

interface OrderItem {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceId: number;
  serviceName: string;
  category: string;
  price: string;
  paymentMethod: string;
  paymentStatus: string;
  customFields: Record<string, string>;
  proofImage?: string;
  uploadedFileData?: string;
  uploadedFileName?: string;
  createdAt: string;
}

interface MemberUser {
  id: string;
  name: string;
  email: string;
  university?: string;
  prodi?: string;
  createdAt?: string;
}

interface ServiceConfig {
  id: number;
  category: string;
  name: string;
  price: string;
  description: string;
  badge?: string | null;
}

const BUCKET_URL = '/api/chats';
const ORDERS_URL = '/api/orders';

const DEFAULT_SERVICES: ServiceConfig[] = [
  { id: 101, category: 'turnitin', name: 'Cek Turnitin Standard', price: 'Rp 8.000', description: 'Hasil instant, sertakan filter bibliography & quotes.', badge: 'POPULER' },
  { id: 102, category: 'turnitin', name: 'Cek Turnitin 3x Paket', price: 'Rp 20.000', description: 'Paket hemat 3x pengecekan dengan laporan lengkap.', badge: 'BEST DEAL' },
  { id: 201, category: 'parafrase', name: 'Parafrase Ringan (< 25%)', price: 'Rp 5.000 / Halaman', description: 'Menurunkan persentase Turnitin hingga aman.', badge: null },
  { id: 202, category: 'parafrase', name: 'Parafrase Skripsi Full Bab', price: 'Rp 150.000', description: 'Pengerjaan cepat & garansi hingga lolos Turnitin.', badge: 'RECOMMENDED' },
  { id: 301, category: 'joki-tugas', name: 'Joki Tugas Kuliah / Makalah', price: 'Chat Admin', description: 'Pengerjaan sesuai deadline & modul mata kuliah.', badge: null },
  { id: 302, category: 'tugas-sekolah', name: 'Joki Tugas Sekolah / PR', price: 'Chat Admin', description: 'Bantuan pengerjaan soal & tugas sekolah.', badge: null },
  { id: 401, category: 'uji-data', name: 'Analisa Data SPSS / SmartPLS', price: 'Rp 150.000', description: 'Lengkap dengan output & interpretasi bab 4.', badge: 'HOT' },
  { id: 501, category: 'joki-skripsi', name: 'Bimbingan & Joki Skripsi Full', price: 'Chat Admin', description: 'Pengerjaan bab 1 - 5 lengkap dengan revisi.', badge: 'PROMO' }
];

export default function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'chat' | 'orders' | 'members' | 'revenue' | 'services'>('chat');

  // Chat states
  const [chats, setChats] = useState<{ [id: string]: ChatSession }>({});
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Orders states
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedProofImage, setSelectedProofImage] = useState<string | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Members state & Pagination (50 items per page)
  const [members, setMembers] = useState<MemberUser[]>([]);
  const [memberPage, setMemberPage] = useState(1);
  const membersPerPage = 50;

  // Services CMS state
  const [cmsServices, setCmsServices] = useState<ServiceConfig[]>(DEFAULT_SERVICES);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServiceConfig>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const prevChatsRef = useRef<{ [id: string]: ChatSession }>({});

  // Check Auth state & set body dark slate background on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('soobin_admin_logged_in') === 'true';
    setIsAdminLoggedIn(isLoggedIn);

    document.body.style.backgroundColor = '#0f172a';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Set Admin online/offline indicator for client tabs
  useEffect(() => {
    if (isAdminLoggedIn) {
      localStorage.setItem('soobin_admin_active', 'true');
      const handleBeforeUnload = () => {
        localStorage.setItem('soobin_admin_active', 'false');
      };
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        localStorage.setItem('soobin_admin_active', 'false');
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isAdminLoggedIn]);

  // Sync Members with cloud API
  const syncMembersWithCloud = async () => {
    try {
      const res = await fetch('/api/members');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((m: any, idx: number) => ({
            ...m,
            id: `MBR-${String(idx + 1).padStart(4, '0')}`,
          }));
          setMembers(formatted);
          localStorage.setItem('soobin_registered_members', JSON.stringify(formatted));
        }
      }
    } catch (e) {
      console.error('Failed to sync members', e);
    }
  };

  // Sync services config
  useEffect(() => {
    const savedServices = JSON.parse(localStorage.getItem('soobin_cms_services') || 'null');
    if (savedServices) {
      setCmsServices(savedServices);
    }
  }, []);

  // Sync chats with cloud
  const syncChatsWithCloud = async () => {
    try {
      const res = await fetch(BUCKET_URL);
      if (!res.ok) return;
      const cloudChats = await res.json();

      setChats(cloudChats);
      localStorage.setItem('soobin_chats', JSON.stringify(cloudChats));

      let hasNewMsg = false;
      Object.keys(cloudChats).forEach((id) => {
        const oldSession = prevChatsRef.current[id];
        const newSession = cloudChats[id];
        if (newSession && (!oldSession || newSession.unreadCount > oldSession.unreadCount)) {
          hasNewMsg = true;
        }
      });

      if (hasNewMsg) {
        playNotificationSound();
      }

      prevChatsRef.current = cloudChats;
    } catch (e) {
      console.error('Failed to sync chats', e);
    }
  };

  // Sync orders with cloud + local fallback
  const syncOrdersWithCloud = async () => {
    setOrdersLoading(true);
    try {
      const localOrders = JSON.parse(localStorage.getItem('soobin_all_orders') || '[]');
      let cloudOrders: OrderItem[] = [];
      const res = await fetch(ORDERS_URL);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          cloudOrders = data;
        }
      }

      const orderMap = new Map<string, OrderItem>();
      [...cloudOrders, ...localOrders].forEach((item) => {
        if (item && item.id) {
          orderMap.set(item.id, item);
        }
      });

      const merged = Array.from(orderMap.values()).sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      setOrders(merged);
      localStorage.setItem('soobin_all_orders', JSON.stringify(merged));
    } catch (e) {
      console.error('Failed to sync orders', e);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Polling loop
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    syncChatsWithCloud();
    syncOrdersWithCloud();
    syncMembersWithCloud();

    const interval = setInterval(() => {
      syncChatsWithCloud();
      syncOrdersWithCloud();
      syncMembersWithCloud();
    }, 4000);

    return () => clearInterval(interval);
  }, [isAdminLoggedIn]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedSessionId, chats]);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (email === 'admin@soobin.com' && password === 'adminsoobin123') {
        setIsAdminLoggedIn(true);
        localStorage.setItem('soobin_admin_logged_in', 'true');
      } else {
        setError('Email atau password admin salah!');
      }
      setLoading(false);
    }, 600);
  };

  // Logout handler
  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('soobin_admin_logged_in');
    localStorage.setItem('soobin_admin_active', 'false');
  };

  // Sound notification
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  };

  // Send admin reply
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionId || !adminReplyText.trim()) return;

    const session = chats[selectedSessionId];
    if (!session) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      text: adminReplyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
      createdAt: Date.now(),
    };

    const updatedSession: ChatSession = {
      ...session,
      messages: [...session.messages, newMsg],
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userUnreadCount: (session.userUnreadCount || 0) + 1,
    };

    const updatedChats = {
      ...chats,
      [selectedSessionId]: updatedSession,
    };

    setChats(updatedChats);
    setAdminReplyText('');

    try {
      await fetch(BUCKET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedChats),
      });
      localStorage.setItem('soobin_chats', JSON.stringify(updatedChats));
    } catch (err) {
      console.error('Failed saving admin reply', err);
    }
  };

  const handleSelectSession = (id: string) => {
    setSelectedSessionId(id);
    if (chats[id] && chats[id].unreadCount > 0) {
      const updatedChats = {
        ...chats,
        [id]: {
          ...chats[id],
          unreadCount: 0,
        },
      };
      setChats(updatedChats);
      fetch(BUCKET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedChats),
      }).catch(console.error);
    }
  };

  // Order status verifier
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, paymentStatus: newStatus } : o));
    setOrders(updated);
    localStorage.setItem('soobin_all_orders', JSON.stringify(updated));

    try {
      await fetch(ORDERS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
    } catch (err) {
      console.error('Failed updating status', err);
    }
  };

  // Guaranteed direct document download
  const handleDownloadFile = (order: OrderItem) => {
    let fileUrl = order.uploadedFileData;
    let fileName = order.uploadedFileName || `Dokumen_${order.id}.docx`;

    if (!fileUrl) {
      let content = `DOKUMEN PESANAN SOOBIN SERVICES\n`;
      content += `ID Order: ${order.id}\n`;
      content += `Nama Pelanggan: ${order.customerName} (${order.customerEmail})\n`;
      content += `Jenis Layanan: ${order.serviceName}\n`;
      content += `Harga: ${order.price}\n\n`;
      if (order.customFields) {
        content += `DETAIL FORMULIR:\n`;
        Object.entries(order.customFields).forEach(([k, v]) => {
          content += `• ${k}: ${v}\n`;
        });
      }
      fileUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
      fileName = `Lampiran_Dokumen_${order.id}.txt`;
    }

    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Calculate Verified Revenue
  const calculateTotalRevenue = () => {
    return orders
      .filter((o) => o.paymentStatus?.toLowerCase().includes('lunas') || o.paymentStatus?.toLowerCase().includes('terverifikasi'))
      .reduce((sum, o) => {
        const priceNum = parseInt(o.price?.replace(/[^0-9]/g, '') || '0', 10);
        return sum + priceNum;
      }, 0);
  };

  // Export Monthly Revenue Report to Excel (.csv with WIB timestamp)
  const handleExportExcel = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    const wibFormatted = new Intl.DateTimeFormat('id-ID', options).format(now);
    const monthYearStr = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    let csvContent = `LAPORAN PENDAPATAN BULANAN SOOBIN SERVICES\n`;
    csvContent += `Bulan & Tahun,${monthYearStr}\n`;
    csvContent += `Waktu Export Realtime,${wibFormatted} WIB\n`;
    csvContent += `Total Pendapatan Terverifikasi,Rp ${calculateTotalRevenue().toLocaleString('id-ID')}\n\n`;

    csvContent += `ID Order,Nama Pelanggan,Email Pelanggan,Jenis Jasa Layanan,Harga,Metode Pembayaran,Status Pembayaran,Tanggal Order\n`;

    orders.forEach((o) => {
      const dateStr = new Date(o.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
      csvContent += `"${o.id}","${o.customerName}","${o.customerEmail}","${o.serviceName}","${o.price}","${o.paymentMethod}","${o.paymentStatus}","${dateStr} WIB"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Pendapatan_SOOBIN_${monthYearStr.replace(' ', '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Service CMS
  const handleSaveCmsService = (id: number) => {
    const updated = cmsServices.map((s) => (s.id === id ? { ...s, ...editForm } : s));
    setCmsServices(updated);
    localStorage.setItem('soobin_cms_services', JSON.stringify(updated));

    fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(console.error);

    setEditingServiceId(null);
    setSaveSuccessMsg(`Layanan ID ${id} berhasil diperbarui secara realtime di web resmi!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Pagination for Members
  const indexOfLastMember = memberPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(members.length / membersPerPage) || 1;

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1e293b] border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-700/60 border border-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">SOOBIN Admin Portal</h1>
            <p className="text-xs text-slate-300 mt-1">Masuk untuk mengelola Live Chat & Verifikasi Pesanan</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
              <CircleAlert className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">Email Admin</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@soobin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">Password Admin</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-slate-100 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? 'Memverifikasi...' : 'Masuk Dasbor Admin'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← Kembali ke Website Utama
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const selectedSession = selectedSessionId ? chats[selectedSessionId] : null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col w-full font-sans antialiased" style={{ backgroundColor: '#0f172a' }}>
      {/* Top Navbar */}
      <header className="bg-[#1e293b] border-b border-slate-700 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-700 border border-slate-600 rounded-xl flex items-center justify-center text-white shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white leading-none tracking-wide">Dasbor Admin SOOBIN</h1>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-semibold mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Status Online
            </span>
          </div>
        </div>

        {/* Tab Switcher - Professional Black & White / Slate Styling */}
        <div className="flex items-center flex-wrap gap-2 bg-[#0f172a] p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === 'chat'
                ? 'bg-white text-slate-950 border-white shadow-md font-extrabold'
                : 'bg-[#1e293b] text-slate-200 hover:text-white border-slate-700 hover:bg-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Live Chat</span>
            {Object.values(chats).reduce((sum, c) => sum + (c.unreadCount || 0), 0) > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {Object.values(chats).reduce((sum, c) => sum + (c.unreadCount || 0), 0)}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === 'orders'
                ? 'bg-white text-slate-950 border-white shadow-md font-extrabold'
                : 'bg-[#1e293b] text-slate-200 hover:text-white border-slate-700 hover:bg-slate-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pesanan & Pembayaran</span>
            {orders.filter((o) => o.paymentStatus?.includes('Cek Admin') || o.paymentStatus?.includes('Menunggu')).length > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {orders.filter((o) => o.paymentStatus?.includes('Cek Admin') || o.paymentStatus?.includes('Menunggu')).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === 'members'
                ? 'bg-white text-slate-950 border-white shadow-md font-extrabold'
                : 'bg-[#1e293b] text-slate-200 hover:text-white border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Member ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === 'revenue'
                ? 'bg-white text-slate-950 border-white shadow-md font-extrabold'
                : 'bg-[#1e293b] text-slate-200 hover:text-white border-slate-700 hover:bg-slate-700'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Pendapatan</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === 'services'
                ? 'bg-white text-slate-950 border-white shadow-md font-extrabold'
                : 'bg-[#1e293b] text-slate-200 hover:text-white border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Kelola Layanan</span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer border border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 flex overflow-hidden p-4 sm:p-6 w-full max-w-[1600px] mx-auto gap-6">
        {/* Tab 1: Live Chat */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex gap-6 w-full overflow-hidden">
            {/* Sidebar Chat Sessions */}
            <div className="w-80 bg-[#1e293b] border border-slate-700 rounded-2xl flex flex-col overflow-hidden shrink-0 shadow-sm">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-[#1e293b]">
                <h2 className="font-extrabold text-xs text-white uppercase tracking-wider">Antrean Percakapan</h2>
                <span className="text-[10px] bg-slate-700 text-slate-200 px-2.5 py-0.5 rounded-full font-bold">
                  {Object.keys(chats).length} User
                </span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-700/50">
                {Object.keys(chats).length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-300 font-semibold">
                    Belum ada percakapan masuk dari pengguna.
                  </div>
                ) : (
                  Object.values(chats).map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleSelectSession(session.id)}
                      className={`w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                        selectedSessionId === session.id
                          ? 'bg-slate-700/70 border-l-4 border-white'
                          : 'hover:bg-slate-700/40'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {session.name?.[0]?.toUpperCase() || 'U'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className="font-bold text-xs text-white truncate">{session.name}</h3>
                          <span className="text-[9px] text-slate-300 font-medium">{session.lastUpdated}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 truncate">
                          {session.university} • {session.prodi}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-1">
                          {session.messages?.[session.messages.length - 1]?.text || 'Belum ada pesan'}
                        </p>
                      </div>

                      {session.unreadCount > 0 && (
                        <span className="w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center shrink-0">
                          {session.unreadCount}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Room Area */}
            <div className="flex-1 bg-[#1e293b] border border-slate-700 rounded-2xl flex flex-col overflow-hidden shadow-sm">
              {selectedSession ? (
                <>
                  {/* Session Header */}
                  <div className="p-4 border-b border-slate-700 bg-[#1e293b] flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-sm text-white">{selectedSession.name}</h2>
                      <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-0.5 font-medium">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" /> {selectedSession.email}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <School className="w-3 h-3 text-slate-400" /> {selectedSession.university}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                      Session Active
                    </span>
                  </div>

                  {/* Messages Stream */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0f172a]/60">
                    {selectedSession.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === 'admin'
                              ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                              : 'bg-slate-700 text-white border border-slate-600 rounded-tl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                          <span
                            className={`block text-[9px] mt-1 text-right ${
                              msg.sender === 'admin' ? 'text-blue-100' : 'text-slate-300'
                            }`}
                          >
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Reply Input Box */}
                  <form onSubmit={handleSendAdminReply} className="p-3 border-t border-slate-700 bg-[#1e293b] flex gap-2">
                    <input
                      type="text"
                      placeholder="Tulis balasan untuk pengguna..."
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      className="flex-1 bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-white"
                    />
                    <button
                      type="submit"
                      className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-slate-700/50 border border-slate-600 rounded-2xl flex items-center justify-center text-white mb-4">
                    <Headphones className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-base text-white">Pilih Percakapan Pelanggan</p>
                  <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed font-medium">
                    Klik salah satu antrean percakapan di sebelah kiri untuk membalas pesan live chat.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Orders & Payments */}
        {activeTab === 'orders' && (
          <div className="flex-1 bg-[#1e293b] border border-slate-700 rounded-2xl p-6 overflow-y-auto space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div>
                <h2 className="font-bold text-base text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  Daftar Pesanan & Pembayaran QRIS / Transfer
                </h2>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">
                  Pantau bukti transfer screenshot QRIS, unduh file dokumen ter-upload, dan verifikasi status lunas.
                </p>
              </div>

              <button
                onClick={syncOrdersWithCloud}
                disabled={ordersLoading}
                className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Pesanan</span>
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-slate-300 bg-[#0f172a]/60 rounded-2xl border border-slate-700">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                <p className="font-bold text-base text-white">Belum Ada Pesanan Masuk</p>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  Setiap pesanan yang dibuat oleh pelanggan melalui form kustom dan QRIS akan ditampilkan otomatis di sini.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isLunas = order.paymentStatus?.toLowerCase().includes('lunas');
                  const isCancel = order.paymentStatus?.toLowerCase().includes('batal');

                  return (
                    <div
                      key={order.id}
                      className="bg-[#0f172a] border border-slate-700 rounded-2xl p-5 hover:border-slate-600 transition-colors space-y-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-600 text-white flex items-center justify-center font-black text-xs">
                            ORD
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm text-white">{order.customerName}</h3>
                              <span className="text-[10px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-mono border border-slate-600 font-bold">
                                {order.id}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 font-medium">{order.customerEmail}</p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                              isLunas
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                                : isCancel
                                ? 'bg-red-500/15 text-red-300 border border-red-500/40'
                                : 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Main Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="bg-[#1e293b] p-3.5 rounded-xl border border-slate-700 space-y-1">
                          <p className="text-slate-300 font-semibold">Jasa Layanan:</p>
                          <p className="font-bold text-white text-sm">{order.serviceName}</p>
                          <p className="text-emerald-400 font-extrabold">{order.price}</p>
                          <p className="text-slate-300 text-[11px] pt-1 font-medium">
                            Metode: <span className="text-white font-bold">{order.paymentMethod}</span>
                          </p>
                        </div>

                        <div className="md:col-span-2 bg-[#1e293b] p-3.5 rounded-xl border border-slate-700 space-y-2">
                          <p className="text-slate-300 font-semibold">Detail Formulir Kustom:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            {order.customFields &&
                              Object.entries(order.customFields).map(([k, v]) => (
                                <div key={k} className="bg-[#0f172a] p-2.5 rounded-lg border border-slate-700">
                                  <span className="text-slate-300 block font-bold">{k}:</span>
                                  <span className="text-white font-medium break-words">{v}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-2">
                          {/* Screenshot Proof Button */}
                          {order.proofImage && (
                            <button
                              onClick={() => setSelectedProofImage(order.proofImage || null)}
                              className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Lihat Bukti Bayar (Screenshot)</span>
                            </button>
                          )}

                          {/* File Download Button (Always Downloadable Direct) */}
                          {(order.uploadedFileData || order.customFields?.['File Ter-upload']) && (
                            <button
                              onClick={() => handleDownloadFile(order)}
                              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                            >
                              <Download className="w-4 h-4" />
                              <span>Unduh Dokumen File</span>
                            </button>
                          )}
                        </div>

                        {/* Status Toggle Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'Dibatalkan')}
                            className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Batalkan</span>
                          </button>

                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'LUNAS (Terverifikasi Admin)')}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-md"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Verifikasi Lunas</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Data Member (50 items per page, starting MBR-0001) */}
        {activeTab === 'members' && (
          <div className="flex-1 bg-[#1e293b] border border-slate-700 rounded-2xl p-6 overflow-y-auto space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div>
                <h2 className="font-bold text-base text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Daftar Member Terdaftar
                </h2>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">
                  Total {members.length} member terdaftar pada platform SOOBIN Services. Menampilkan 50 member per halaman.
                </p>
              </div>

              {/* Pagination Controls Top */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMemberPage((p) => Math.max(1, p - 1))}
                  disabled={memberPage === 1}
                  className="p-2 rounded-xl bg-slate-700 border border-slate-600 text-white disabled:opacity-40 hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-white px-2">
                  Halaman {memberPage} dari {totalPages}
                </span>
                <button
                  onClick={() => setMemberPage((p) => Math.min(totalPages, p + 1))}
                  disabled={memberPage === totalPages}
                  className="p-2 rounded-xl bg-slate-700 border border-slate-600 text-white disabled:opacity-40 hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto border border-slate-700 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-[#0f172a] text-slate-300 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-700">
                  <tr>
                    <th className="p-3.5">Kode ID Member</th>
                    <th className="p-3.5">Nama Lengkap</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Kampus / Universitas</th>
                    <th className="p-3.5">Program Studi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 bg-[#1e293b]">
                  {currentMembers.map((mbr, idx) => (
                    <tr key={mbr.id || idx} className="hover:bg-slate-700/50 transition-colors">
                      <td className="p-3.5 font-mono text-blue-400 font-extrabold">{mbr.id}</td>
                      <td className="p-3.5 font-bold text-white">{mbr.name}</td>
                      <td className="p-3.5 text-slate-300 font-medium">{mbr.email}</td>
                      <td className="p-3.5 text-slate-300 font-medium">{mbr.university || '-'}</td>
                      <td className="p-3.5 text-slate-300 font-medium">{mbr.prodi || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-300 font-medium">
                Menampilkan {indexOfFirstMember + 1} - {Math.min(indexOfLastMember, members.length)} dari {members.length} Member
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMemberPage((p) => Math.max(1, p - 1))}
                  disabled={memberPage === 1}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-700 border border-slate-600 text-xs font-bold text-white disabled:opacity-40 hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setMemberPage((p) => Math.min(totalPages, p + 1))}
                  disabled={memberPage === totalPages}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-700 border border-slate-600 text-xs font-bold text-white disabled:opacity-40 hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Pendapatan & Export Excel */}
        {activeTab === 'revenue' && (
          <div className="flex-1 bg-[#1e293b] border border-slate-700 rounded-2xl p-6 overflow-y-auto space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div>
                <h2 className="font-bold text-base text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Dasbor Pendapatan & Export Laporan Excel
                </h2>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">
                  Pendapatan hanya bertambah jika pesanan disetujui (`Verifikasi Lunas`). Dilengkapi Export Excel resmi realtime WIB.
                </p>
              </div>

              <button
                onClick={handleExportExcel}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Laporan Excel (.csv)</span>
              </button>
            </div>

            {/* Total Revenue Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0f172a] border border-slate-700 rounded-2xl p-6 space-y-2">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Total Pendapatan Terverifikasi</p>
                <p className="text-3xl font-black text-white">
                  Rp {calculateTotalRevenue().toLocaleString('id-ID')}
                </p>
                <p className="text-[11px] text-slate-300 font-medium">Otomatis dihitung dari order status Lunas</p>
              </div>

              <div className="bg-[#0f172a] border border-slate-700 rounded-2xl p-6 space-y-2">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Total Pesanan Terverifikasi</p>
                <p className="text-3xl font-black text-white">
                  {orders.filter((o) => o.paymentStatus?.toLowerCase().includes('lunas')).length} Order
                </p>
                <p className="text-[11px] text-slate-300 font-medium">Siap diproses oleh tim admin</p>
              </div>

              <div className="bg-[#0f172a] border border-slate-700 rounded-2xl p-6 space-y-2">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Waktu Sistem Realtime</p>
                <p className="text-base font-bold text-white">
                  {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </p>
                <p className="text-[11px] text-slate-300 font-medium">Zona Waktu: Asia/Jakarta (WIB)</p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-slate-700 rounded-2xl overflow-hidden">
              <div className="p-4 bg-[#0f172a] border-b border-slate-700 font-bold text-xs text-white">
                Rincian Transaksi Pendapatan Masuk
              </div>
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-[#1e293b] text-slate-300 font-bold text-[10px] uppercase border-b border-slate-700">
                  <tr>
                    <th className="p-3.5">ID Order</th>
                    <th className="p-3.5">Pelanggan</th>
                    <th className="p-3.5">Layanan</th>
                    <th className="p-3.5">Harga</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 bg-[#0f172a]">
                  {orders
                    .filter((o) => o.paymentStatus?.toLowerCase().includes('lunas'))
                    .map((o) => (
                      <tr key={o.id} className="hover:bg-slate-800/60">
                        <td className="p-3.5 font-mono text-amber-400 font-bold">{o.id}</td>
                        <td className="p-3.5 font-bold text-white">{o.customerName}</td>
                        <td className="p-3.5 text-slate-200 font-medium">{o.serviceName}</td>
                        <td className="p-3.5 font-bold text-emerald-400">{o.price}</td>
                        <td className="p-3.5 font-bold text-emerald-400">Terverifikasi Lunas</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Kelola Layanan (Realtime Service CMS - Professional Black/White) */}
        {activeTab === 'services' && (
          <div className="flex-1 bg-[#1e293b] border border-slate-700 rounded-2xl p-6 overflow-y-auto space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div>
                <h2 className="font-bold text-base text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-white" />
                  Kelola Layanan & Harga (CMS Realtime)
                </h2>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">
                  Ubah nama, harga, deskripsi, dan badge layanan secara langsung. Perubahan akan realtime di web resmi saat direfresh.
                </p>
              </div>

              {saveSuccessMsg && (
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl animate-fade-in">
                  {saveSuccessMsg}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cmsServices.map((srv) => {
                const isEditing = editingServiceId === srv.id;

                return (
                  <div
                    key={srv.id}
                    className="bg-[#0f172a] border border-slate-700 rounded-2xl p-5 space-y-3 relative group hover:border-slate-500 transition-colors shadow-sm"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">Nama Layanan</label>
                          <input
                            type="text"
                            value={editForm.name || srv.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-3.5 py-2 text-xs text-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">Harga Layanan</label>
                          <input
                            type="text"
                            value={editForm.price || srv.price}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-3.5 py-2 text-xs text-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">Deskripsi Singkat</label>
                          <textarea
                            rows={2}
                            value={editForm.description || srv.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-3.5 py-2 text-xs text-white font-medium"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setEditingServiceId(null)}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-600"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleSaveCmsService(srv.id)}
                            className="px-4 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer shadow-md"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Simpan CMS</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9px] font-mono text-slate-200 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-bold uppercase">
                              {srv.category}
                            </span>
                            <h3 className="font-bold text-base text-white mt-1.5">{srv.name}</h3>
                          </div>
                          <button
                            onClick={() => {
                              setEditingServiceId(srv.id);
                              setEditForm({ name: srv.name, price: srv.price, description: srv.description, badge: srv.badge });
                            }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 transition-colors cursor-pointer"
                            title="Edit Layanan"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-medium">{srv.description}</p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                          <span className="text-sm font-black text-amber-400">{srv.price}</span>
                          {srv.badge && (
                            <span className="text-[9px] font-black bg-slate-200 text-slate-950 px-2.5 py-0.5 rounded uppercase">
                              {srv.badge}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Proof Screenshot Image Viewer Modal */}
      <AnimatePresence>
        {selectedProofImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1e293b] border border-slate-700 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto relative space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  Inspeksi Bukti Pembayaran QRIS (Screenshot)
                </h3>
                <button
                  onClick={() => setSelectedProofImage(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center p-2">
                <img
                  src={selectedProofImage}
                  alt="Bukti Transfer QRIS"
                  className="max-h-[60vh] object-contain rounded-xl"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedProofImage(null)}
                  className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs cursor-pointer"
                >
                  Tutup Pratonton
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
