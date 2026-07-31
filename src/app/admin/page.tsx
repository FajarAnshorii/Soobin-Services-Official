'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, LogOut, MessageSquare, Shield, User as UserIcon,
  School, GraduationCap, Send, Clock, CircleAlert, Headphones,
  ShoppingBag, CheckCircle, XCircle, Eye, RefreshCw, X, QrCode, CreditCard,
  Download, Users, DollarSign, FileSpreadsheet, Edit3, Save, ChevronLeft, ChevronRight, FileText
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

// Initial fallback services list for CMS
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

  // Check Auth state on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('soobin_admin_logged_in') === 'true';
    setIsAdminLoggedIn(isLoggedIn);
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

  // Load Members & CMS Services on mount
  useEffect(() => {
    // Load Members from registered users
    const loadedMembers = JSON.parse(localStorage.getItem('soobin_registered_members') || '[]');
    if (loadedMembers.length === 0) {
      // Fallback demo members if empty
      const demoMembers: MemberUser[] = Array.from({ length: 65 }).map((_, i) => ({
        id: `MBR-${1000 + i}`,
        name: i % 2 === 0 ? `Filda Felissa ${i + 1}` : `Bintang Prasetyo ${i + 1}`,
        email: `user${i + 1}@gmail.com`,
        university: i % 3 === 0 ? 'Universitas Gadjah Mada' : i % 2 === 0 ? 'Universitas Indonesia' : 'Universitas Brawijaya',
        prodi: i % 2 === 0 ? 'Manajemen S1' : 'Teknik Informatika S1',
        createdAt: new Date(Date.now() - i * 86400000).toISOString()
      }));
      setMembers(demoMembers);
      localStorage.setItem('soobin_registered_members', JSON.stringify(demoMembers));
    } else {
      setMembers(loadedMembers);
    }

    // Load Services CMS config
    const savedServices = JSON.parse(localStorage.getItem('soobin_cms_services') || 'null');
    if (savedServices) {
      setCmsServices(savedServices);
    }
  }, []);

  // Web Audio API notification sound
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.log('Audio playback prevented');
    }
  };

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
      console.error('Failed to sync chats with cloud', e);
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

      // Unique merge by order ID
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

    const interval = setInterval(() => {
      syncChatsWithCloud();
      syncOrdersWithCloud();
    }, 5000);

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

  // Send admin message
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

  // Select chat session
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

  // Download File attachment helper
  const handleDownloadFile = (order: OrderItem) => {
    if (order.uploadedFileData) {
      const a = document.createElement('a');
      a.href = order.uploadedFileData;
      a.download = order.uploadedFileName || `Dokumen_${order.id}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert(`File dokumen ${order.uploadedFileName || ''} tersimpan di server cloud. Silakan minta pelanggan mengunggah ulang via WhatsApp jika perlu.`);
    }
  };

  // Calculate Total Verified Revenue
  const calculateTotalRevenue = () => {
    return orders
      .filter((o) => o.paymentStatus?.toLowerCase().includes('lunas') || o.paymentStatus?.toLowerCase().includes('terverifikasi'))
      .reduce((sum, o) => {
        const priceNum = parseInt(o.price?.replace(/[^0-9]/g, '') || '0', 10);
        return sum + priceNum;
      }, 0);
  };

  // Export Monthly Revenue Report to Excel (.csv format with WIB timestamp)
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

  // CMS Service edit submit
  const handleSaveCmsService = (id: number) => {
    const updated = cmsServices.map((s) => (s.id === id ? { ...s, ...editForm } : s));
    setCmsServices(updated);
    localStorage.setItem('soobin_cms_services', JSON.stringify(updated));

    // Save to Cloud API as well
    fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(console.error);

    setEditingServiceId(null);
    setSaveSuccessMsg(`Layanan ID ${id} berhasil diperbarui secara realtime di web resmi!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Pagination logic for Members
  const indexOfLastMember = memberPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(members.length / membersPerPage) || 1;

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.2)_0%,transparent_70%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-800 border border-dark-700 p-8 rounded-3xl shadow-2xl max-w-md w-full relative z-10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-800/20 border border-primary-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-400">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">SOOBIN Admin Portal</h1>
            <p className="text-xs text-dark-300 mt-1">Masuk untuk mengelola Live Chat & Verifikasi Pesanan</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
              <CircleAlert className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-dark-200 mb-1.5">Email Admin</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-dark-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@soobin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-200 mb-1.5">Password Admin</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-dark-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-800 hover:bg-primary-750 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? 'Memverifikasi...' : 'Masuk Dasbor Admin'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-dark-700 text-center">
            <Link href="/" className="text-xs text-dark-400 hover:text-white transition-colors">
              ← Kembali ke Website Utama
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const selectedSession = selectedSessionId ? chats[selectedSessionId] : null;

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100 flex flex-col w-full font-sans antialiased">
      {/* Top Navbar */}
      <header className="bg-dark-900/90 backdrop-blur-md border-b border-dark-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-800/30 border border-primary-800/60 rounded-xl flex items-center justify-center text-primary-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white leading-none">Dasbor Admin SOOBIN</h1>
            <span className="text-[11px] text-green-400 flex items-center gap-1.5 font-semibold mt-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Status Online
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center flex-wrap gap-1.5 bg-dark-950/80 p-1.5 rounded-2xl border border-dark-800">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-primary-800 text-white shadow-md'
                : 'text-dark-300 hover:text-white hover:bg-dark-800'
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
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-dark-950 font-black shadow-md'
                : 'text-dark-300 hover:text-white hover:bg-dark-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pesanan & Pembayaran</span>
            {orders.filter((o) => o.paymentStatus?.includes('Cek Admin') || o.paymentStatus?.includes('Menunggu')).length > 0 && (
              <span className="bg-amber-400 text-dark-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {orders.filter((o) => o.paymentStatus?.includes('Cek Admin') || o.paymentStatus?.includes('Menunggu')).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'members'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-dark-300 hover:text-white hover:bg-dark-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Member ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'revenue'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-dark-300 hover:text-white hover:bg-dark-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Pendapatan</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'services'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-dark-300 hover:text-white hover:bg-dark-800'
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
        {activeTab === 'chat' && (
          <div className="flex-1 flex gap-6 w-full overflow-hidden">
            {/* Sidebar Chat Sessions */}
            <div className="w-80 bg-dark-900 border border-dark-800 rounded-2xl flex flex-col overflow-hidden shrink-0">
              <div className="p-4 border-b border-dark-800 flex items-center justify-between">
                <h2 className="font-bold text-xs text-white uppercase tracking-wider">Antrean Percakapan</h2>
                <span className="text-[10px] bg-primary-800/20 text-primary-400 px-2 py-0.5 rounded-full font-bold">
                  {Object.keys(chats).length} User
                </span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-dark-800/50">
                {Object.keys(chats).length === 0 ? (
                  <div className="p-8 text-center text-xs text-dark-400">
                    Belum ada percakapan masuk dari pengguna.
                  </div>
                ) : (
                  Object.values(chats).map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleSelectSession(session.id)}
                      className={`w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                        selectedSessionId === session.id
                          ? 'bg-primary-800/10 border-l-4 border-primary-500'
                          : 'hover:bg-dark-850'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-dark-700 border border-dark-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {session.name?.[0]?.toUpperCase() || 'U'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className="font-bold text-xs text-white truncate">{session.name}</h3>
                          <span className="text-[9px] text-dark-400">{session.lastUpdated}</span>
                        </div>
                        <p className="text-[11px] text-dark-300 truncate">
                          {session.university} • {session.prodi}
                        </p>
                        <p className="text-[10px] text-dark-400 truncate mt-1">
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
            <div className="flex-1 bg-dark-900 border border-dark-800 rounded-2xl flex flex-col overflow-hidden">
              {selectedSession ? (
                <>
                  {/* Session Header */}
                  <div className="p-4 border-b border-dark-800 bg-dark-850 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-sm text-white">{selectedSession.name}</h2>
                      <div className="flex items-center gap-3 text-[11px] text-dark-300 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {selectedSession.email}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <School className="w-3 h-3" /> {selectedSession.university}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full font-bold">
                      Session Active
                    </span>
                  </div>

                  {/* Messages Stream */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-dark-950/50">
                    {selectedSession.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === 'admin'
                              ? 'bg-primary-800 text-white rounded-tr-none'
                              : 'bg-dark-800 text-dark-100 border border-dark-700 rounded-tl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                          <span
                            className={`block text-[9px] mt-1 text-right ${
                              msg.sender === 'admin' ? 'text-primary-200' : 'text-dark-400'
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
                  <form onSubmit={handleSendAdminReply} className="p-3 border-t border-dark-800 bg-dark-900 flex gap-2">
                    <input
                      type="text"
                      placeholder="Tulis balasan untuk pengguna..."
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      className="flex-1 bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-dark-400 focus:outline-none focus:border-primary-500"
                    />
                    <button
                      type="submit"
                      className="bg-primary-800 hover:bg-primary-750 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-dark-400">
                  <Headphones className="w-12 h-12 mb-3 text-dark-600" />
                  <p className="font-bold text-sm text-dark-300">Pilih Percakapan Pelanggan</p>
                  <p className="text-xs text-dark-500 mt-1 max-w-xs">
                    Klik salah satu antrean percakapan di sebelah kiri untuk membalas pesan live chat.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Orders & Payments */}
        {activeTab === 'orders' && (
          <div className="flex-1 bg-dark-900 border border-dark-800 rounded-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-dark-800 pb-4">
              <div>
                <h2 className="font-bold text-base text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  Daftar Pesanan & Pembayaran QRIS / Transfer
                </h2>
                <p className="text-xs text-dark-400 mt-0.5">
                  Pantau bukti transfer screenshot QRIS, download file tugas ter-upload, dan verifikasi status lunas.
                </p>
              </div>

              <button
                onClick={syncOrdersWithCloud}
                disabled={ordersLoading}
                className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-dark-200 border border-dark-700 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Pesanan</span>
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-dark-400 bg-dark-950/50 rounded-2xl border border-dark-800">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-dark-600" />
                <p className="font-bold text-sm text-dark-300">Belum Ada Pesanan Masuk</p>
                <p className="text-xs text-dark-500 mt-1">
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
                      className="bg-dark-950 border border-dark-800 rounded-2xl p-5 hover:border-dark-700 transition-colors space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dark-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-xs">
                            ORD
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm text-white">{order.customerName}</h3>
                              <span className="text-[10px] bg-dark-800 text-dark-300 px-2 py-0.5 rounded font-mono">
                                {order.id}
                              </span>
                            </div>
                            <p className="text-xs text-dark-400">{order.customerEmail}</p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                              isLunas
                                ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                                : isCancel
                                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Main Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="bg-dark-900 p-3.5 rounded-xl border border-dark-800 space-y-1">
                          <p className="text-dark-400 font-semibold">Jasa Layanan:</p>
                          <p className="font-bold text-white text-sm">{order.serviceName}</p>
                          <p className="text-green-400 font-bold">{order.price}</p>
                          <p className="text-dark-400 text-[11px] pt-1">Metode: <span className="text-white font-semibold">{order.paymentMethod}</span></p>
                        </div>

                        <div className="md:col-span-2 bg-dark-900 p-3.5 rounded-xl border border-dark-800 space-y-2">
                          <p className="text-dark-400 font-semibold">Detail Formulir Kustom:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            {order.customFields &&
                              Object.entries(order.customFields).map(([k, v]) => (
                                <div key={k} className="bg-dark-950 p-2 rounded-lg border border-dark-800">
                                  <span className="text-dark-400 block font-bold">{k}:</span>
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
                              className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Lihat Bukti Bayar (Screenshot)</span>
                            </button>
                          )}

                          {/* File Download Button */}
                          {(order.uploadedFileData || order.customFields?.['File Ter-upload']) && (
                            <button
                              onClick={() => handleDownloadFile(order)}
                              className="px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
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
                            className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Batalkan</span>
                          </button>

                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'LUNAS (Terverifikasi Admin)')}
                            className="px-3.5 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-dark-950 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors shadow-md"
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

        {/* Tab 3: Data Member (50 items per page pagination) */}
        {activeTab === 'members' && (
          <div className="flex-1 bg-dark-900 border border-dark-800 rounded-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-dark-800 pb-4">
              <div>
                <h2 className="font-bold text-base text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Daftar Member Terdaftar
                </h2>
                <p className="text-xs text-dark-400 mt-0.5">
                  Total {members.length} member terdaftar pada platform SOOBIN Services. Menampilkan 50 member per halaman.
                </p>
              </div>

              {/* Pagination Controls Top */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMemberPage((p) => Math.max(1, p - 1))}
                  disabled={memberPage === 1}
                  className="p-2 rounded-xl bg-dark-800 border border-dark-700 text-dark-200 disabled:opacity-40 hover:bg-dark-700 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-white px-2">
                  Halaman {memberPage} dari {totalPages}
                </span>
                <button
                  onClick={() => setMemberPage((p) => Math.min(totalPages, p + 1))}
                  disabled={memberPage === totalPages}
                  className="p-2 rounded-xl bg-dark-800 border border-dark-700 text-dark-200 disabled:opacity-40 hover:bg-dark-700 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto border border-dark-800 rounded-2xl">
              <table className="w-full text-left text-xs text-dark-200">
                <thead className="bg-dark-950 text-dark-400 font-bold uppercase tracking-wider text-[10px] border-b border-dark-800">
                  <tr>
                    <th className="p-3.5">ID Member</th>
                    <th className="p-3.5">Nama Lengkap</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Kampus / Universitas</th>
                    <th className="p-3.5">Program Studi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800/60 bg-dark-900">
                  {currentMembers.map((mbr) => (
                    <tr key={mbr.id} className="hover:bg-dark-850/60 transition-colors">
                      <td className="p-3.5 font-mono text-primary-400 font-bold">{mbr.id}</td>
                      <td className="p-3.5 font-bold text-white">{mbr.name}</td>
                      <td className="p-3.5 text-dark-300">{mbr.email}</td>
                      <td className="p-3.5 text-dark-300">{mbr.university || '-'}</td>
                      <td className="p-3.5 text-dark-300">{mbr.prodi || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-dark-400">
                Menampilkan {indexOfFirstMember + 1} - {Math.min(indexOfLastMember, members.length)} dari {members.length} Member
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMemberPage((p) => Math.max(1, p - 1))}
                  disabled={memberPage === 1}
                  className="px-3 py-1.5 rounded-xl bg-dark-800 border border-dark-700 text-xs font-bold text-white disabled:opacity-40 hover:bg-dark-700 transition-colors cursor-pointer"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setMemberPage((p) => Math.min(totalPages, p + 1))}
                  disabled={memberPage === totalPages}
                  className="px-3 py-1.5 rounded-xl bg-dark-800 border border-dark-700 text-xs font-bold text-white disabled:opacity-40 hover:bg-dark-700 transition-colors cursor-pointer"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Pendapatan & Export Excel */}
        {activeTab === 'revenue' && (
          <div className="flex-1 bg-dark-900 border border-dark-800 rounded-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-dark-800 pb-4">
              <div>
                <h2 className="font-bold text-base text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Dasbor Pendapatan & Export Laporan Excel
                </h2>
                <p className="text-xs text-dark-400 mt-0.5">
                  Pendapatan hanya bertambah jika pesanan disetujui (`Verifikasi Lunas`). Dilengkapi Export Excel resmi realtime WIB.
                </p>
              </div>

              <button
                onClick={handleExportExcel}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Laporan Excel (.csv)</span>
              </button>
            </div>

            {/* Total Revenue Stat Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-900/40 to-dark-900 border border-emerald-500/30 rounded-2xl p-6 space-y-2">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Total Pendapatan Terverifikasi</p>
                <p className="text-3xl font-black text-white">
                  Rp {calculateTotalRevenue().toLocaleString('id-ID')}
                </p>
                <p className="text-[11px] text-emerald-300/80">Otomatis dihitung dari order status Lunas</p>
              </div>

              <div className="bg-dark-950 border border-dark-800 rounded-2xl p-6 space-y-2">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Total Pesanan Terverifikasi</p>
                <p className="text-3xl font-black text-white">
                  {orders.filter((o) => o.paymentStatus?.toLowerCase().includes('lunas')).length} Order
                </p>
                <p className="text-[11px] text-dark-400">Siap diproses oleh tim admin</p>
              </div>

              <div className="bg-dark-950 border border-dark-800 rounded-2xl p-6 space-y-2">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Waktu Sistem Realtime</p>
                <p className="text-base font-bold text-white">
                  {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </p>
                <p className="text-[11px] text-dark-400">Zona Waktu: Asia/Jakarta (WIB)</p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-dark-800 rounded-2xl overflow-hidden">
              <div className="p-4 bg-dark-950 border-b border-dark-800 font-bold text-xs text-white">
                Rincian Transaksi Pendapatan Masuk
              </div>
              <table className="w-full text-left text-xs text-dark-200">
                <thead className="bg-dark-900 text-dark-400 font-bold text-[10px] uppercase border-b border-dark-800">
                  <tr>
                    <th className="p-3">ID Order</th>
                    <th className="p-3">Pelanggan</th>
                    <th className="p-3">Layanan</th>
                    <th className="p-3">Harga</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800 bg-dark-950">
                  {orders
                    .filter((o) => o.paymentStatus?.toLowerCase().includes('lunas'))
                    .map((o) => (
                      <tr key={o.id} className="hover:bg-dark-900">
                        <td className="p-3 font-mono text-amber-400 font-bold">{o.id}</td>
                        <td className="p-3 font-bold text-white">{o.customerName}</td>
                        <td className="p-3">{o.serviceName}</td>
                        <td className="p-3 font-bold text-green-400">{o.price}</td>
                        <td className="p-3 font-bold text-green-400">Terverifikasi Lunas</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Kelola Layanan (Realtime Service CMS) */}
        {activeTab === 'services' && (
          <div className="flex-1 bg-dark-900 border border-dark-800 rounded-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-dark-800 pb-4">
              <div>
                <h2 className="font-bold text-base text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-purple-400" />
                  Kelola Layanan & Harga (CMS Realtime)
                </h2>
                <p className="text-xs text-dark-400 mt-0.5">
                  Ubah nama, harga, deskripsi, dan badge layanan secara langsung. Perubahan akan realtime di web resmi saat direfresh.
                </p>
              </div>

              {saveSuccessMsg && (
                <span className="text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-xl animate-fade-in">
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
                    className="bg-dark-950 border border-dark-800 rounded-2xl p-5 space-y-3 relative group hover:border-purple-500/40 transition-colors"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-dark-400 mb-1">Nama Layanan</label>
                          <input
                            type="text"
                            value={editForm.name || srv.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-dark-400 mb-1">Harga Layanan</label>
                          <input
                            type="text"
                            value={editForm.price || srv.price}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-dark-400 mb-1">Deskripsi Singkat</label>
                          <textarea
                            rows={2}
                            value={editForm.description || srv.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setEditingServiceId(null)}
                            className="px-3 py-1.5 rounded-lg bg-dark-800 text-dark-300 text-xs font-bold"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleSaveCmsService(srv.id)}
                            className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
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
                            <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-bold uppercase">
                              {srv.category}
                            </span>
                            <h3 className="font-bold text-sm text-white mt-1">{srv.name}</h3>
                          </div>
                          <button
                            onClick={() => {
                              setEditingServiceId(srv.id);
                              setEditForm({ name: srv.name, price: srv.price, description: srv.description, badge: srv.badge });
                            }}
                            className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-purple-400 border border-purple-500/30 transition-colors cursor-pointer"
                            title="Edit Layanan"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-dark-300">{srv.description}</p>

                        <div className="flex items-center justify-between pt-2 border-t border-dark-800/80">
                          <span className="text-sm font-black text-amber-400">{srv.price}</span>
                          {srv.badge && (
                            <span className="text-[9px] font-black bg-amber-400 text-dark-950 px-2 py-0.5 rounded uppercase">
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
              className="bg-dark-900 border border-dark-700 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto relative space-y-4"
            >
              <div className="flex items-center justify-between border-b border-dark-800 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  Inspeksi Bukti Pembayaran QRIS (Screenshot)
                </h3>
                <button
                  onClick={() => setSelectedProofImage(null)}
                  className="p-1 text-dark-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-dark-800 bg-black flex items-center justify-center p-2">
                <img
                  src={selectedProofImage}
                  alt="Bukti Transfer QRIS"
                  className="max-h-[60vh] object-contain rounded-xl"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedProofImage(null)}
                  className="px-5 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-white font-bold text-xs cursor-pointer"
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
