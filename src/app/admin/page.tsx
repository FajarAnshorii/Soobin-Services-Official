'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, LogOut, MessageSquare, Shield,
  School, Send, CircleAlert, Headphones,
  ShoppingBag, CheckCircle, XCircle, Eye, RefreshCw, X, QrCode,
  Download, Users, DollarSign, FileSpreadsheet, Edit3, Save, ChevronLeft, ChevronRight,
  Search, LayoutDashboard, TrendingUp, Clock, Check, FileText
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

  // Tab & Search state
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'orders' | 'members' | 'revenue' | 'services'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Set body background to clean LIGHT slate #f8fafc on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('soobin_admin_logged_in') === 'true';
    setIsAdminLoggedIn(isLoggedIn);

    document.body.style.backgroundColor = '#f8fafc';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Admin Active Status Flag
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

  // Sync Members API
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

  // Sync Services CMS
  useEffect(() => {
    const savedServices = JSON.parse(localStorage.getItem('soobin_cms_services') || 'null');
    if (savedServices) {
      setCmsServices(savedServices);
    }
  }, []);

  // Sync Chats API
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

  // Sync Orders API
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

  // Auto scroll chat stream
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

  // Audio tone
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

  // Update order status
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

  // Direct document download
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

  // Total Verified Revenue calculation
  const calculateTotalRevenue = () => {
    return orders
      .filter((o) => o.paymentStatus?.toLowerCase().includes('lunas') || o.paymentStatus?.toLowerCase().includes('terverifikasi'))
      .reduce((sum, o) => {
        const priceNum = parseInt(o.price?.replace(/[^0-9]/g, '') || '0', 10);
        return sum + priceNum;
      }, 0);
  };

  // Export Excel CSV
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

  // Filtered lists based on search query
  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = members.filter(
    (m) =>
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.university && m.university.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination for Members
  const indexOfLastMember = memberPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage) || 1;

  const pendingOrdersCount = orders.filter(
    (o) => o.paymentStatus?.includes('Cek Admin') || o.paymentStatus?.includes('Menunggu')
  ).length;

  const unreadChatsCount = Object.values(chats).reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  // LOGIN SCREEN - ULTRA CLEAN BRIGHT LIGHT THEME
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">SOOBIN Admin Portal</h1>
            <p className="text-xs text-slate-600 font-semibold mt-1.5">Masuk untuk mengelola Live Chat & Verifikasi Pesanan</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center flex items-center justify-center gap-2">
              <CircleAlert className="w-4 h-4 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Email Admin</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@soobin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Password Admin</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? 'Memverifikasi...' : 'Masuk Dasbor Admin'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <Link href="/" className="text-xs text-slate-600 hover:text-blue-600 transition-colors font-bold">
              ← Kembali ke Website Utama
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const selectedSession = selectedSessionId ? chats[selectedSessionId] : null;

  // MAIN DASHBOARD - BRIGHT CLEAN WHITE & SLATE THEME (LIGHT MODE)
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex w-full font-sans antialiased" style={{ backgroundColor: '#f8fafc' }}>
      {/* LEFT VERTICAL SIDEBAR NAVIGATION (Modern SaaS Light Theme) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen z-30 shadow-xs">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-base text-slate-900 tracking-tight leading-none">SOOBIN</h1>
              <p className="text-[10px] text-blue-600 font-extrabold mt-1 uppercase tracking-wider">Services Admin</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1.5">
            <p className="text-[10px] font-black text-slate-400 px-3 pt-2 pb-1 uppercase tracking-wider">Menu Utam</p>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md font-extrabold'
                  : 'bg-white text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview Dasbor</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md font-extrabold'
                  : 'bg-white text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Live Chat</span>
              </div>
              {unreadChatsCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                  {unreadChatsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md font-extrabold'
                  : 'bg-white text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Pesanan & Pembayaran</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                activeTab === 'members'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md font-extrabold'
                  : 'bg-white text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Data Member</span>
              </div>
              <span className="bg-slate-200 text-slate-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {members.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('revenue')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                activeTab === 'revenue'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md font-extrabold'
                  : 'bg-white text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4" />
                <span>Pendapatan & Export</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                activeTab === 'services'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md font-extrabold'
                  : 'bg-white text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-4 h-4" />
                <span>Kelola Layanan (CMS)</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Footer Admin Profile */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
          <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-xs shrink-0">
                AD
              </div>
              <div className="truncate">
                <p className="text-xs font-black text-slate-900 truncate">Administrator</p>
                <p className="text-[10px] text-slate-500 font-bold truncate">admin@soobin.com</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-xs font-extrabold text-red-600 hover:text-red-700 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 transition-colors cursor-pointer border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER BAR */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          {/* Global Search Bar */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari pesanan, nama member, atau layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

          {/* Quick Actions & Realtime Status */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-emerald-700 flex items-center gap-2 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Online Realtime (WIB)
            </span>

            <button
              onClick={() => {
                syncOrdersWithCloud();
                syncMembersWithCloud();
                syncChatsWithCloud();
              }}
              disabled={ordersLoading}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
              title="Refresh Data Realtime"
            >
              <RefreshCw className={`w-4 h-4 ${ordersLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* TOP KPI STAT CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-emerald-600">
                    <span className="text-xs font-black uppercase tracking-wider">Total Pendapatan</span>
                    <DollarSign className="w-5 h-5 bg-emerald-50 p-1 rounded-lg border border-emerald-200" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">
                    Rp {calculateTotalRevenue().toLocaleString('id-ID')}
                  </p>
                  <p className="text-[11px] text-slate-600 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Terverifikasi dari Lunas
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-blue-600">
                    <span className="text-xs font-black uppercase tracking-wider">Total Member</span>
                    <Users className="w-5 h-5 bg-blue-50 p-1 rounded-lg border border-blue-200" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{members.length} Member</p>
                  <p className="text-[11px] text-slate-600 font-bold">Format MBR-0001 dst.</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-amber-600">
                    <span className="text-xs font-black uppercase tracking-wider">Pesanan Menunggu</span>
                    <ShoppingBag className="w-5 h-5 bg-amber-50 p-1 rounded-lg border border-amber-200" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{pendingOrdersCount} Pesanan</p>
                  <p className="text-[11px] text-slate-600 font-bold">Perlu Cek Verifikasi Admin</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-purple-600">
                    <span className="text-xs font-black uppercase tracking-wider">Chat Sesi Aktif</span>
                    <MessageSquare className="w-5 h-5 bg-purple-50 p-1 rounded-lg border border-purple-200" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{Object.keys(chats).length} Sesi</p>
                  <p className="text-[11px] text-slate-600 font-bold">{unreadChatsCount} Belum Dibaca</p>
                </div>
              </div>

              {/* RECENT ACTIVITY & RECENT ORDERS SPLIT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders Table Overview */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h2 className="font-black text-sm text-slate-900 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-amber-600" />
                      Pesanan Terbaru Masuk
                    </h2>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-extrabold text-blue-600 hover:text-blue-700"
                    >
                      Lihat Semua →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-800">
                      <thead className="bg-slate-100 text-slate-700 font-black text-[10px] uppercase border-b border-slate-200">
                        <tr>
                          <th className="p-3">ID Order</th>
                          <th className="p-3">Nama Pelanggan</th>
                          <th className="p-3">Layanan</th>
                          <th className="p-3">Harga</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono text-amber-700 font-black">{o.id}</td>
                            <td className="p-3 font-bold text-slate-900">{o.customerName}</td>
                            <td className="p-3 text-slate-700 font-medium">{o.serviceName}</td>
                            <td className="p-3 font-black text-emerald-600">{o.price}</td>
                            <td className="p-3">
                              <span
                                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                                  o.paymentStatus?.toLowerCase().includes('lunas')
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                                }`}
                              >
                                {o.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Registered Members Widget */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h2 className="font-black text-sm text-slate-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      Member Terdaftar Terbaru
                    </h2>
                    <button
                      onClick={() => setActiveTab('members')}
                      className="text-xs font-extrabold text-blue-600 hover:text-blue-700"
                    >
                      Kelola →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {members.slice(0, 4).map((m) => (
                      <div key={m.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-xs text-slate-900">{m.name}</p>
                          <p className="text-[10px] text-slate-600 font-bold">{m.email}</p>
                        </div>
                        <span className="text-[10px] font-mono font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                          {m.id}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="flex gap-6 h-[calc(100vh-140px)] overflow-hidden">
              {/* Sidebar Chat Sessions */}
              <div className="w-80 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shrink-0 shadow-xs">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <h2 className="font-black text-xs text-slate-900 uppercase tracking-wider">Antrean Percakapan</h2>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-bold">
                    {Object.keys(chats).length} User
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
                  {Object.keys(chats).length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-600 font-bold">
                      Belum ada percakapan masuk dari pengguna.
                    </div>
                  ) : (
                    Object.values(chats).map((session) => (
                      <button
                        key={session.id}
                        onClick={() => handleSelectSession(session.id)}
                        className={`w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                          selectedSessionId === session.id
                            ? 'bg-blue-50 border-l-4 border-blue-600'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {session.name?.[0]?.toUpperCase() || 'U'}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className="font-bold text-xs text-slate-900 truncate">{session.name}</h3>
                            <span className="text-[9px] text-slate-500 font-bold">{session.lastUpdated}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 truncate font-semibold">
                            {session.university} • {session.prodi}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate mt-1 font-medium">
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
              <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-xs">
                {selectedSession ? (
                  <>
                    {/* Session Header */}
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div>
                        <h2 className="font-black text-sm text-slate-900">{selectedSession.name}</h2>
                        <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-0.5 font-bold">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-blue-600" /> {selectedSession.email}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <School className="w-3.5 h-3.5 text-blue-600" /> {selectedSession.university}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full font-bold">
                        Session Active
                      </span>
                    </div>

                    {/* Messages Stream */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                      {selectedSession.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                              msg.sender === 'admin'
                                ? 'bg-blue-600 text-white rounded-tr-none shadow-xs font-medium'
                                : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none font-medium shadow-xs'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <span
                              className={`block text-[9px] mt-1 text-right font-bold ${
                                msg.sender === 'admin' ? 'text-blue-100' : 'text-slate-500'
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
                    <form onSubmit={handleSendAdminReply} className="p-3 border-t border-slate-200 bg-white flex gap-2">
                      <input
                        type="text"
                        placeholder="Tulis balasan untuk pengguna..."
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center text-blue-600 mb-4 shadow-xs">
                      <Headphones className="w-8 h-8" />
                    </div>
                    <p className="font-black text-base text-slate-900">Pilih Percakapan Pelanggan</p>
                    <p className="text-xs text-slate-600 mt-1 max-w-xs leading-relaxed font-bold">
                      Klik salah satu antrean percakapan di sebelah kiri untuk membalas pesan live chat.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS & PAYMENTS */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-amber-600" />
                    Daftar Pesanan & Pembayaran QRIS / Transfer
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5 font-bold">
                    Pantau bukti transfer screenshot QRIS, unduh file dokumen ter-upload, dan verifikasi status lunas.
                  </p>
                </div>

                <button
                  onClick={syncOrdersWithCloud}
                  disabled={ordersLoading}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh Pesanan</span>
                </button>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-slate-600 bg-slate-50 rounded-2xl border border-slate-200">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-amber-600" />
                  <p className="font-black text-base text-slate-900">Belum Ada Pesanan Masuk</p>
                  <p className="text-xs text-slate-600 mt-1 font-bold">
                    Setiap pesanan yang dibuat oleh pelanggan melalui form kustom dan QRIS akan ditampilkan otomatis di sini.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const isLunas = order.paymentStatus?.toLowerCase().includes('lunas');
                    const isCancel = order.paymentStatus?.toLowerCase().includes('batal');

                    return (
                      <div
                        key={order.id}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors space-y-4 shadow-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                              ORD
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-black text-sm text-slate-900">{order.customerName}</h3>
                                <span className="text-[10px] bg-slate-200 text-slate-900 px-2 py-0.5 rounded font-mono border border-slate-300 font-bold">
                                  {order.id}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 font-bold">{order.customerEmail}</p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                                isLunas
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : isCancel
                                  ? 'bg-red-100 text-red-800 border border-red-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Main Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1 shadow-xs">
                            <p className="text-slate-600 font-bold">Jasa Layanan:</p>
                            <p className="font-black text-slate-900 text-sm">{order.serviceName}</p>
                            <p className="text-emerald-700 font-black">{order.price}</p>
                            <p className="text-slate-600 text-[11px] pt-1 font-bold">
                              Metode: <span className="text-slate-900 font-black">{order.paymentMethod}</span>
                            </p>
                          </div>

                          <div className="md:col-span-2 bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
                            <p className="text-slate-600 font-bold">Detail Formulir Kustom:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                              {order.customFields &&
                                Object.entries(order.customFields).map(([k, v]) => (
                                  <div key={k} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                                    <span className="text-slate-700 block font-black">{k}:</span>
                                    <span className="text-slate-900 font-bold break-words">{v}</span>
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
                                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                <span>Lihat Bukti Bayar (Screenshot)</span>
                              </button>
                            )}

                            {/* File Download Button (Guaranteed Direct Download) */}
                            {(order.uploadedFileData || order.customFields?.['File Ter-upload']) && (
                              <button
                                onClick={() => handleDownloadFile(order)}
                                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
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
                              className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Batalkan</span>
                            </button>

                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'LUNAS (Terverifikasi Admin)')}
                              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
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

          {/* TAB 3: DATA MEMBER (50 per page, MBR-0001 format) */}
          {activeTab === 'members' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Daftar Member Terdaftar
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5 font-bold">
                    Total {filteredMembers.length} member terdaftar. Menampilkan 50 member per halaman.
                  </p>
                </div>

                {/* Pagination Controls Top */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMemberPage((p) => Math.max(1, p - 1))}
                    disabled={memberPage === 1}
                    className="p-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 disabled:opacity-40 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-black text-slate-900 px-2">
                    Halaman {memberPage} dari {totalPages}
                  </span>
                  <button
                    onClick={() => setMemberPage((p) => Math.min(totalPages, p + 1))}
                    disabled={memberPage === totalPages}
                    className="p-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 disabled:opacity-40 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Members Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-900">
                  <thead className="bg-slate-100 text-slate-700 font-black uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Kode ID Member</th>
                      <th className="p-3.5">Nama Lengkap</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Kampus / Universitas</th>
                      <th className="p-3.5">Program Studi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {currentMembers.map((mbr, idx) => (
                      <tr key={mbr.id || idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-mono text-blue-700 font-black">{mbr.id}</td>
                        <td className="p-3.5 font-bold text-slate-900">{mbr.name}</td>
                        <td className="p-3.5 text-slate-700 font-semibold">{mbr.email}</td>
                        <td className="p-3.5 text-slate-700 font-semibold">{mbr.university || '-'}</td>
                        <td className="p-3.5 text-slate-700 font-semibold">{mbr.prodi || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Pagination */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-600 font-bold">
                  Menampilkan {indexOfFirstMember + 1} - {Math.min(indexOfLastMember, filteredMembers.length)} dari {filteredMembers.length} Member
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMemberPage((p) => Math.max(1, p - 1))}
                    disabled={memberPage === 1}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-900 disabled:opacity-40 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setMemberPage((p) => Math.min(totalPages, p + 1))}
                    disabled={memberPage === totalPages}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-900 disabled:opacity-40 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REVENUE & EXCEL REPORT */}
          {activeTab === 'revenue' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Dasbor Pendapatan & Export Laporan Excel
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5 font-bold">
                    Pendapatan hanya bertambah jika pesanan disetujui (`Verifikasi Lunas`). Dilengkapi Export Excel resmi realtime WIB.
                  </p>
                </div>

                <button
                  onClick={handleExportExcel}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export Laporan Excel (.csv)</span>
                </button>
              </div>

              {/* Total Revenue Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2">
                  <p className="text-xs font-black text-emerald-700 uppercase tracking-wider">Total Pendapatan Terverifikasi</p>
                  <p className="text-3xl font-black text-slate-900">
                    Rp {calculateTotalRevenue().toLocaleString('id-ID')}
                  </p>
                  <p className="text-[11px] text-slate-600 font-bold">Otomatis dihitung dari order status Lunas</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2">
                  <p className="text-xs font-black text-amber-700 uppercase tracking-wider">Total Pesanan Terverifikasi</p>
                  <p className="text-3xl font-black text-slate-900">
                    {orders.filter((o) => o.paymentStatus?.toLowerCase().includes('lunas')).length} Order
                  </p>
                  <p className="text-[11px] text-slate-600 font-bold">Siap diproses oleh tim admin</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2">
                  <p className="text-xs font-black text-blue-700 uppercase tracking-wider">Waktu Sistem Realtime</p>
                  <p className="text-base font-bold text-slate-900">
                    {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-[11px] text-slate-600 font-bold">Zona Waktu: Asia/Jakarta (WIB)</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-4 bg-slate-100 border-b border-slate-200 font-black text-xs text-slate-900">
                  Rincian Transaksi Pendapatan Masuk
                </div>
                <table className="w-full text-left text-xs text-slate-900">
                  <thead className="bg-white text-slate-700 font-black text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">ID Order</th>
                      <th className="p-3.5">Pelanggan</th>
                      <th className="p-3.5">Layanan</th>
                      <th className="p-3.5">Harga</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {orders
                      .filter((o) => o.paymentStatus?.toLowerCase().includes('lunas'))
                      .map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-mono text-amber-700 font-black">{o.id}</td>
                          <td className="p-3.5 font-bold text-slate-900">{o.customerName}</td>
                          <td className="p-3.5 text-slate-700 font-semibold">{o.serviceName}</td>
                          <td className="p-3.5 font-black text-emerald-700">{o.price}</td>
                          <td className="p-3.5 font-black text-emerald-700">Terverifikasi Lunas</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SERVICE CMS */}
          {activeTab === 'services' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-blue-600" />
                    Kelola Layanan & Harga (CMS Realtime)
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5 font-bold">
                    Ubah nama, harga, deskripsi, dan badge layanan secara langsung. Perubahan akan realtime di web resmi saat direfresh.
                  </p>
                </div>

                {saveSuccessMsg && (
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-1.5 rounded-xl animate-fade-in">
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
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 relative group hover:border-slate-300 transition-colors shadow-xs"
                    >
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Layanan</label>
                            <input
                              type="text"
                              value={editForm.name || srv.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Harga Layanan</label>
                            <input
                              type="text"
                              value={editForm.price || srv.price}
                              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                            <textarea
                              rows={2}
                              value={editForm.description || srv.description}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              onClick={() => setEditingServiceId(null)}
                              className="px-3.5 py-1.5 rounded-lg bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300"
                            >
                              Batal
                            </button>
                            <button
                              onClick={() => handleSaveCmsService(srv.id)}
                              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
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
                              <span className="text-[9px] font-mono text-slate-800 bg-slate-200 border border-slate-300 px-2 py-0.5 rounded font-bold uppercase">
                                {srv.category}
                              </span>
                              <h3 className="font-black text-base text-slate-900 mt-1.5">{srv.name}</h3>
                            </div>
                            <button
                              onClick={() => {
                                setEditingServiceId(srv.id);
                                setEditForm({ name: srv.name, price: srv.price, description: srv.description, badge: srv.badge });
                              }}
                              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 transition-colors cursor-pointer shadow-xs"
                              title="Edit Layanan"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-xs text-slate-700 leading-relaxed font-semibold">{srv.description}</p>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                            <span className="text-sm font-black text-emerald-700">{srv.price}</span>
                            {srv.badge && (
                              <span className="text-[9px] font-black bg-blue-600 text-white px-2.5 py-0.5 rounded uppercase">
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
      </div>

      {/* Proof Screenshot Image Viewer Modal */}
      <AnimatePresence>
        {selectedProofImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto relative space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-amber-600" />
                  Inspeksi Bukti Pembayaran QRIS (Screenshot)
                </h3>
                <button
                  onClick={() => setSelectedProofImage(null)}
                  className="p-1 text-slate-500 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center p-2">
                <img
                  src={selectedProofImage}
                  alt="Bukti Transfer QRIS"
                  className="max-h-[60vh] object-contain rounded-xl"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedProofImage(null)}
                  className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold text-xs cursor-pointer"
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
