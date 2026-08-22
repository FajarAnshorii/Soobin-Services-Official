'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { Calendar } from '@/components/ui/mini-calendar';
import {
  Mail, Lock, LogOut, MessageSquare, Shield,
  School, Send, CircleAlert, Headphones,
  ShoppingBag, CheckCircle, XCircle, Eye, RefreshCw, X, QrCode,
  Download, Users, DollarSign, FileSpreadsheet, Edit3, Save, ChevronLeft, ChevronRight,
  Search, LayoutDashboard, TrendingUp, Clock, Check, FileText, Trash2, Star, Calendar as CalendarIcon
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
  isFileExpired?: boolean;
}

// Helper to determine if file is expired (> 48 hours / 2 days)
const isOrderFileExpired = (order: OrderItem): boolean => {
  if (order.isFileExpired) return true;
  const now = Date.now();
  const TWO_DAYS_MS = 48 * 60 * 60 * 1000;
  const orderTime = new Date(order.createdAt || 0).getTime() || parseInt(String(order.id).replace(/\D/g, '') || '0', 10);
  if (orderTime > 0 && (now - orderTime) > TWO_DAYS_MS) {
    return true;
  }
  return false;
};

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

// Helper to get YYYY-MM-DD date key in Asia/Jakarta (WIB) timezone with fallback to orderId timestamp
const getWIBDateKey = (dateInput?: string | Date | null, orderId?: string): string => {
  let d: Date | null = null;
  if (dateInput) {
    const parsed = new Date(dateInput);
    if (!isNaN(parsed.getTime())) {
      d = parsed;
    }
  }
  if (!d && orderId) {
    const match = orderId.match(/\d{10,13}/);
    if (match) {
      const ts = parseInt(match[0], 10);
      const parsedTs = new Date(ts);
      if (!isNaN(parsedTs.getTime()) && parsedTs.getFullYear() >= 2020) {
        d = parsedTs;
      }
    }
  }
  if (!d) return '';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
};

// Helper to format full Indonesian date with Day, Date, Month, Year & Time WIB
const formatFullDateIndonesian = (dateInput?: string | Date | null, orderId?: string): string => {
  let d: Date | null = null;
  if (dateInput) {
    const parsed = new Date(dateInput);
    if (!isNaN(parsed.getTime())) {
      d = parsed;
    }
  }
  if (!d && orderId) {
    const match = orderId.match(/\d{10,13}/);
    if (match) {
      const ts = parseInt(match[0], 10);
      const parsedTs = new Date(ts);
      if (!isNaN(parsedTs.getTime()) && parsedTs.getFullYear() >= 2020) {
        d = parsedTs;
      }
    }
  }
  if (!d) return '-';
  try {
    const dateFormatted = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
    return `${dateFormatted} WIB`;
  } catch (e) {
    return String(dateInput);
  }
};

// Helper to format live chat timestamps nicely (Tanggal, Bulan, Tahun & Jam WIB)
const formatChatDate = (dateInput?: string | number | Date | null): string => {
  if (!dateInput) return '-';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d) + ' WIB';
  } catch (e) {
    return String(dateInput);
  }
};

const parsePriceNumber = (priceStr: string): number => {
  if (!priceStr) return 0;
  const num = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? 0 : num;
};

export default function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Tab & Search state
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'orders' | 'members' | 'revenue' | 'services' | 'testimonials'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Testimonials state
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);

  // Fetch real-time testimonials for Admin
  const fetchAdminTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setTestimonialsList(data);
      }
    } catch (e) {
      console.error('Failed fetching testimonials for admin', e);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAdminTestimonials();
      const interval = setInterval(fetchAdminTestimonials, 5000);
      return () => clearInterval(interval);
    }
  }, [isAdminLoggedIn]);

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus ulasan testimoni ini?')) return;
    try {
      await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
      fetchAdminTestimonials();
    } catch (e) {
      alert('Gagal menghapus ulasan testimoni');
    }
  };

  // Chat states
  const [chats, setChats] = useState<{ [id: string]: ChatSession }>({});
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Orders states
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('soobin_all_orders');
        return cached ? JSON.parse(cached) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [selectedProofImage, setSelectedProofImage] = useState<string | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Revenue & Calendar Date State
  const [selectedRevenueDate, setSelectedRevenueDate] = useState<Date>(new Date());
  const [revenueFilterMode, setRevenueFilterMode] = useState<'daily' | 'all'>('daily');

  // Members state & Pagination (50 items per page)
  const [members, setMembers] = useState<MemberUser[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('soobin_all_members');
        return cached ? JSON.parse(cached) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [memberPage, setMemberPage] = useState(1);
  const membersPerPage = 50;

  // Services CMS state
  const [cmsServices, setCmsServices] = useState<ServiceConfig[]>(DEFAULT_SERVICES);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServiceConfig>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Compute order counts per day (YYYY-MM-DD -> count) for mini-calendar & daily stats
  const dayOrderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      const key = getWIBDateKey(o.createdAt, o.id);
      if (key) {
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  }, [orders]);

  // Selected date key in WIB
  const selectedDateKey = useMemo(() => getWIBDateKey(selectedRevenueDate), [selectedRevenueDate]);

  // Orders filtered by selected date
  const ordersForSelectedDate = useMemo(() => {
    return orders.filter((o) => getWIBDateKey(o.createdAt, o.id) === selectedDateKey);
  }, [orders, selectedDateKey]);

  // Verified lunas orders for selected date
  const lunasOrdersSelectedDate = useMemo(() => {
    return ordersForSelectedDate.filter(
      (o) => o.paymentStatus?.toLowerCase().includes('lunas') || o.paymentStatus?.toLowerCase().includes('terverifikasi')
    );
  }, [ordersForSelectedDate]);

  // Revenue total for selected date
  const revenueForSelectedDate = useMemo(() => {
    return lunasOrdersSelectedDate.reduce((sum, o) => sum + parsePriceNumber(o.price), 0);
  }, [lunasOrdersSelectedDate]);

  // Pending & Canceled orders for selected date
  const pendingOrdersSelectedDate = useMemo(() => {
    return ordersForSelectedDate.filter(
      (o) => !o.paymentStatus?.toLowerCase().includes('lunas') && !o.paymentStatus?.toLowerCase().includes('batal')
    );
  }, [ordersForSelectedDate]);

  const cancelOrdersSelectedDate = useMemo(() => {
    return ordersForSelectedDate.filter((o) => o.paymentStatus?.toLowerCase().includes('batal'));
  }, [ordersForSelectedDate]);

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

  // Sync Orders API (100% Realtime Database Supabase)
  const syncOrdersWithCloud = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(ORDERS_URL, { cache: 'no-store' });
      if (res.ok) {
        const cloudOrders: OrderItem[] = await res.json();
        if (Array.isArray(cloudOrders)) {
          // Pure 100% Supabase Database: sort descending by timestamp
          const sorted = cloudOrders.sort((a, b) => {
            const timeA = new Date(a.createdAt || '').getTime() || parseInt(a.id?.replace(/\D/g, '') || '0', 10);
            const timeB = new Date(b.createdAt || '').getTime() || parseInt(b.id?.replace(/\D/g, '') || '0', 10);
            return timeB - timeA;
          });
          setOrders(sorted);
          localStorage.setItem('soobin_all_orders', JSON.stringify(sorted));
        }
      }
    } catch (e) {
      console.error('Failed to sync orders from database', e);
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

  // Reset all chats in Supabase & state
  const handleResetChats = async () => {
    if (!window.confirm('Apakah Anda yakin ingin mereset dan menghapus seluruh antrean percakapan live chat?')) {
      return;
    }
    try {
      await fetch('/api/chats', { method: 'DELETE' });
      setChats({});
      setSelectedSessionId(null);
      alert('Seluruh antrean percakapan live chat berhasil di-reset!');
    } catch (err) {
      console.error('Gagal reset chat:', err);
    }
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
      messages: [...(session.messages || []), newMsg],
      lastUpdated: new Date().toISOString(),
      userUnreadCount: (session.userUnreadCount || 0) + 1,
      unreadCount: 0,
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
        body: JSON.stringify(updatedSession),
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

  // Update order status directly in Supabase
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    const updated = orders.map((o) => (o.id === orderId ? { ...o, paymentStatus: newStatus } : o));
    setOrders(updated);
    localStorage.setItem('soobin_all_orders', JSON.stringify(updated));

    try {
      const res = await fetch(ORDERS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (!res.ok) {
        throw new Error('Gagal update status di database');
      }
    } catch (err) {
      console.error('Failed updating status in database', err);
      syncOrdersWithCloud();
    } finally {
      setTimeout(() => setUpdatingOrderId(null), 300);
    }
  };

  // Direct document download
  const handleDownloadFile = (order: OrderItem) => {
    if (isOrderFileExpired(order) && !order.uploadedFileData) {
      alert(`File dokumen untuk pesanan ${order.id} sudah kedaluwarsa (> 2 hari) dan telah dibersihkan secara otomatis dari database untuk menghemat kapasitas. Data riwayat pesanan & pendapatan tetap tersimpan aman.`);
      return;
    }

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

  // Export Excel (.xlsx) for Selected Date
  const handleExportDailyExcel = () => {
    const dateLabel = formatFullDateIndonesian(selectedRevenueDate);
    const targetOrders = ordersForSelectedDate;

    if (targetOrders.length === 0) {
      alert(`Belum ada transaksi pesanan pada tanggal ${selectedDateKey}`);
      return;
    }

    const rows = targetOrders.map((o) => ({
      'ID Order': o.id,
      'Tanggal, Bulan, Tahun & Waktu': formatFullDateIndonesian(o.createdAt),
      'Nama Pelanggan': o.customerName,
      'Email Pelanggan': o.customerEmail,
      'Layanan': o.serviceName,
      'Harga': o.price,
      'Metode Pembayaran': o.paymentMethod,
      'Status Pembayaran': o.paymentStatus,
    }));

    const summaryData = [
      { 'METRIK': 'LAPORAN PENDAPATAN HARIAN SOOBIN SERVICES', 'NILAI': '' },
      { 'METRIK': 'Tanggal Laporan', 'NILAI': dateLabel },
      { 'METRIK': 'Total Pendapatan Terverifikasi', 'NILAI': `Rp ${revenueForSelectedDate.toLocaleString('id-ID')}` },
      { 'METRIK': 'Total Jumlah Orderan', 'NILAI': `${ordersForSelectedDate.length} Order` },
      { 'METRIK': 'Order Lunas Terverifikasi', 'NILAI': `${lunasOrdersSelectedDate.length} Order` },
      { 'METRIK': 'Order Menunggu Verifikasi', 'NILAI': `${pendingOrdersSelectedDate.length} Order` },
      { 'METRIK': 'Order Dibatalkan', 'NILAI': `${cancelOrdersSelectedDate.length} Order` },
    ];

    const workbook = XLSX.utils.book_new();
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    const mainSheet = XLSX.utils.json_to_sheet(rows);

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan Harian');
    XLSX.utils.book_append_sheet(workbook, mainSheet, `Order_${selectedDateKey}`);

    XLSX.writeFile(workbook, `Laporan_Pendapatan_SOOBIN_Harian_${selectedDateKey}.xlsx`);
  };

  // Export Excel (.xlsx) for All Orders in Database
  const handleExportAllExcel = () => {
    const rows = orders.map((o) => ({
      'ID Order': o.id,
      'Tanggal, Bulan, Tahun & Waktu': formatFullDateIndonesian(o.createdAt),
      'Nama Pelanggan': o.customerName,
      'Email Pelanggan': o.customerEmail,
      'Layanan': o.serviceName,
      'Harga': o.price,
      'Metode Pembayaran': o.paymentMethod,
      'Status Pembayaran': o.paymentStatus,
    }));

    const workbook = XLSX.utils.book_new();
    const mainSheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, mainSheet, 'Semua Orderan Database');

    XLSX.writeFile(workbook, `Laporan_Pendapatan_SOOBIN_Semua_Database.xlsx`);
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
  const filteredOrders = orders.filter((o) => {
    if (!o) return false;
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return true;
    return (
      (o.id || '').toLowerCase().includes(q) ||
      (o.customerName || '').toLowerCase().includes(q) ||
      (o.customerEmail || '').toLowerCase().includes(q) ||
      (o.serviceName || '').toLowerCase().includes(q)
    );
  });

  const filteredMembers = members.filter((m) => {
    if (!m) return false;
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return true;
    return (
      (m.id || '').toLowerCase().includes(q) ||
      (m.name || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      ((m.university || '') && (m.university || '').toLowerCase().includes(q))
    );
  });

  // Pagination for Members
  const indexOfLastMember = memberPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage) || 1;

  const pendingOrdersCount = orders.filter(
    (o) => o.paymentStatus?.includes('Cek Admin') || o.paymentStatus?.includes('Menunggu')
  ).length;

  const unreadChatsCount = Object.values(chats).reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  // LOGIN SCREEN - ALL TEXT BLACK MONOCHROME
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-300 p-8 rounded-3xl shadow-xl max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-sm">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">SOOBIN Admin Portal</h1>
            <p className="text-xs text-slate-800 font-bold mt-1.5">Masuk untuk mengelola Live Chat & Verifikasi Pesanan</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-slate-100 border border-slate-400 text-slate-900 text-xs font-black text-center flex items-center justify-center gap-2">
              <CircleAlert className="w-4 h-4 text-slate-900" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1.5">Email Admin</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-900 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@soobin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-black placeholder:text-slate-500 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1.5">Password Admin</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-900 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-black placeholder:text-slate-500 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-black text-white font-black py-3.5 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? 'Memverifikasi...' : 'Masuk Dasbor Admin'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <Link href="/" className="text-xs text-slate-900 hover:text-black transition-colors font-black">
              ← Kembali ke Website Utama
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const selectedSession = selectedSessionId ? chats[selectedSessionId] : null;

  // MAIN DASHBOARD - ALL TEXT BLACK MONOCHROME UI (LIGHT THEME)
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex w-full font-sans antialiased" style={{ backgroundColor: '#f8fafc' }}>
      {/* LEFT VERTICAL SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-slate-300 flex flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen z-30 shadow-xs">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-300 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-base text-slate-900 tracking-tight leading-none">SOOBIN</h1>
              <p className="text-[10px] text-slate-900 font-black mt-1 uppercase tracking-wider">Services Admin</p>
            </div>
          </div>

          {/* Nav Items - ALL BLACK TEXT */}
          <nav className="p-3 space-y-1.5">
            <p className="text-[10px] font-black text-slate-900 px-3 pt-2 pb-1 uppercase tracking-wider">Menu Utam</p>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-slate-900" />
                <span>Overview Dasbor</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                activeTab === 'chat'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-slate-900" />
                <span>Live Chat</span>
              </div>
              {unreadChatsCount > 0 && (
                <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                  {unreadChatsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                activeTab === 'orders'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-slate-900" />
                <span>Pesanan & Pembayaran</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                activeTab === 'members'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-900" />
                <span>Data Member</span>
              </div>
              <span className="bg-slate-200 text-slate-900 text-[10px] px-2 py-0.5 rounded-full font-black border border-slate-300">
                {members.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('revenue')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                activeTab === 'revenue'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4 text-slate-900" />
                <span>Pendapatan & Export</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                activeTab === 'services'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-4 h-4 text-slate-900" />
                <span>Kelola Layanan (CMS)</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                activeTab === 'testimonials'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Testimoni & Rating</span>
              </div>
              <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-black border border-amber-300">
                {testimonialsList.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Footer Admin Profile */}
        <div className="p-3 border-t border-slate-300 bg-slate-50 space-y-2">
          <div className="p-2.5 bg-white border border-slate-300 rounded-xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black flex items-center justify-center text-xs shrink-0">
                AD
              </div>
              <div className="truncate">
                <p className="text-xs font-black text-slate-900 truncate">Administrator</p>
                <p className="text-[10px] text-slate-900 font-bold truncate">admin@soobin.com</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-xs font-black text-slate-900 hover:text-black flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-300"
          >
            <LogOut className="w-4 h-4 text-slate-900" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER BAR */}
        <header className="bg-white border-b border-slate-300 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          {/* Global Search Bar */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-900 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari pesanan, nama member, atau layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 font-black placeholder:text-slate-500 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
            />
          </div>

          {/* Quick Actions & Realtime Status */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-900 flex items-center gap-2 font-black bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 animate-pulse" />
              Sistem Online Realtime (WIB)
            </span>

            <button
              onClick={() => {
                syncOrdersWithCloud();
                syncMembersWithCloud();
                syncChatsWithCloud();
              }}
              disabled={ordersLoading}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition-colors cursor-pointer"
              title="Refresh Data Realtime"
            >
              <RefreshCw className={`w-4 h-4 text-slate-900 ${ordersLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* TOP KPI STAT CARDS GRID - ALL INTERACTIVE & CONNECTED */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div
                  onClick={() => setActiveTab('revenue')}
                  className="bg-white border border-slate-300 hover:border-slate-900 rounded-2xl p-5 space-y-2 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-slate-900">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 group-hover:text-black">Total Pendapatan</span>
                    <DollarSign className="w-5 h-5 bg-slate-100 p-1 rounded-lg border border-slate-300 text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">
                    Rp {calculateTotalRevenue().toLocaleString('id-ID')}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-900 font-extrabold pt-1">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-slate-900" /> Terverifikasi
                    </span>
                    <span className="text-[10px] font-black underline group-hover:text-black">Lihat Rincian →</span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('members')}
                  className="bg-white border border-slate-300 hover:border-slate-900 rounded-2xl p-5 space-y-2 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-slate-900">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 group-hover:text-black">Total Member</span>
                    <Users className="w-5 h-5 bg-slate-100 p-1 rounded-lg border border-slate-300 text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{members.length} Member</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-900 font-extrabold pt-1">
                    <span>Format MBR-0001 dst.</span>
                    <span className="text-[10px] font-black underline group-hover:text-black">Kelola Member →</span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('orders')}
                  className="bg-white border border-slate-300 hover:border-slate-900 rounded-2xl p-5 space-y-2 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-slate-900">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 group-hover:text-black">Pesanan Menunggu</span>
                    <ShoppingBag className="w-5 h-5 bg-slate-100 p-1 rounded-lg border border-slate-300 text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{pendingOrdersCount} Pesanan</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-900 font-extrabold pt-1">
                    <span>Perlu Verifikasi Admin</span>
                    <span className="text-[10px] font-black underline group-hover:text-black">Cek Pesanan →</span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('chat')}
                  className="bg-white border border-slate-300 hover:border-slate-900 rounded-2xl p-5 space-y-2 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-slate-900">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 group-hover:text-black">Chat Sesi Aktif</span>
                    <MessageSquare className="w-5 h-5 bg-slate-100 p-1 rounded-lg border border-slate-300 text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{Object.keys(chats).length} Sesi</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-900 font-extrabold pt-1">
                    <span>{unreadChatsCount} Belum Dibaca</span>
                    <span className="text-[10px] font-black underline group-hover:text-black">Buka Live Chat →</span>
                  </div>
                </div>
              </div>

              {/* RECENT ACTIVITY & RECENT ORDERS SPLIT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders Table Overview */}
                <div className="lg:col-span-2 bg-white border border-slate-300 rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                    <h2 className="font-black text-sm text-slate-900 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-slate-900" />
                      Pesanan Terbaru Masuk
                    </h2>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-black text-slate-900 hover:text-black underline cursor-pointer"
                    >
                      Lihat Semua ({orders.length}) →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-900">
                      <thead className="bg-slate-100 text-slate-900 font-black text-[10px] uppercase border-b border-slate-300">
                        <tr>
                          <th className="p-3 whitespace-nowrap">ID Order</th>
                          <th className="p-3 whitespace-nowrap">Waktu (WIB)</th>
                          <th className="p-3 whitespace-nowrap">Nama Pelanggan</th>
                          <th className="p-3 whitespace-nowrap">Layanan</th>
                          <th className="p-3 whitespace-nowrap">Harga</th>
                          <th className="p-3 whitespace-nowrap">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-6 text-center text-slate-500 font-bold">
                              Belum ada transaksi di database
                            </td>
                          </tr>
                        ) : (
                          orders.slice(0, 5).map((o) => {
                            const isLunas = o.paymentStatus?.toLowerCase().includes('lunas') || o.paymentStatus?.toLowerCase().includes('terverifikasi');
                            const isCancel = o.paymentStatus?.toLowerCase().includes('batal');

                            return (
                              <tr
                                key={o.id}
                                onClick={() => setActiveTab('orders')}
                                className="hover:bg-slate-50 cursor-pointer transition-colors"
                              >
                                <td className="p-3 font-mono text-slate-900 font-black whitespace-nowrap">{o.id}</td>
                                <td className="p-3 text-slate-700 font-bold whitespace-nowrap">
                                  {formatFullDateIndonesian(o.createdAt, o.id)}
                                </td>
                                <td className="p-3 font-black text-slate-900 whitespace-nowrap">{o.customerName}</td>
                                <td className="p-3 text-slate-900 font-bold whitespace-nowrap">{o.serviceName}</td>
                                <td className="p-3 font-black text-slate-900 whitespace-nowrap">{o.price}</td>
                                <td className="p-3 whitespace-nowrap">
                                  <span
                                    className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase inline-flex items-center gap-1 whitespace-nowrap shadow-2xs ${
                                      isLunas
                                        ? 'bg-slate-900 text-white border border-slate-900'
                                        : isCancel
                                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                        : 'bg-slate-200 text-slate-900 border border-slate-400'
                                    }`}
                                  >
                                    {isLunas ? '✓ LUNAS (TERVERIFIKASI)' : isCancel ? '✕ DIBATALKAN' : o.paymentStatus}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Registered Members Widget */}
                <div className="bg-white border border-slate-300 rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                    <h2 className="font-black text-sm text-slate-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-900" />
                      Member Terdaftar Terbaru
                    </h2>
                    <button
                      onClick={() => setActiveTab('members')}
                      className="text-xs font-black text-slate-900 hover:text-black underline cursor-pointer"
                    >
                      Kelola ({members.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {members.length === 0 ? (
                      <p className="text-xs text-slate-500 font-bold p-4 text-center">Belum ada member terdaftar</p>
                    ) : (
                      members.slice(0, 4).map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setActiveTab('members')}
                          className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-black text-xs text-slate-900 truncate">{m.name}</p>
                            <p className="text-[10px] text-slate-900 font-bold truncate">{m.email}</p>
                            {(m.university || m.prodi) && (
                              <p className="text-[9px] text-slate-600 font-semibold truncate mt-0.5">
                                {[m.university, m.prodi].filter(Boolean).join(' • ')}
                              </p>
                            )}
                          </div>
                          <span className="text-[10px] font-mono font-black text-slate-900 bg-slate-200 px-2 py-0.5 rounded border border-slate-400 shrink-0">
                            {m.id}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* BOTTOM QUICK STATUS: REVENUE TODAY, CMS & TESTIMONIALS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
                <div
                  onClick={() => setActiveTab('revenue')}
                  className="bg-white border border-slate-300 hover:border-slate-900 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-600 tracking-wider">Laporan Keuangan & Export</p>
                    <p className="text-sm font-black text-slate-900">Kalender Pendapatan Harian</p>
                    <p className="text-[11px] text-slate-700 font-bold">Buka & Export Rekap Excel →</p>
                  </div>
                  <CalendarIcon className="w-8 h-8 text-slate-800 p-1.5 bg-slate-100 rounded-xl border border-slate-300 shrink-0" />
                </div>

                <div
                  onClick={() => setActiveTab('services')}
                  className="bg-white border border-slate-300 hover:border-slate-900 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-600 tracking-wider">Katalog Layanan (CMS)</p>
                    <p className="text-sm font-black text-slate-900">{cmsServices.length} Layanan Aktif</p>
                    <p className="text-[11px] text-slate-700 font-bold">Kelola Harga & Deskripsi →</p>
                  </div>
                  <Edit3 className="w-8 h-8 text-slate-800 p-1.5 bg-slate-100 rounded-xl border border-slate-300 shrink-0" />
                </div>

                <div
                  onClick={() => setActiveTab('testimonials')}
                  className="bg-white border border-slate-300 hover:border-slate-900 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-600 tracking-wider">Testimoni & Kepuasan</p>
                    <p className="text-sm font-black text-slate-900">{testimonialsList.length} Ulasan Pelanggan</p>
                    <p className="text-[11px] text-slate-700 font-bold">Pantau Rating & Feedback →</p>
                  </div>
                  <Star className="w-8 h-8 text-amber-500 fill-amber-400 p-1.5 bg-amber-50 rounded-xl border border-amber-300 shrink-0" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="flex gap-6 h-[calc(100vh-140px)] overflow-hidden">
              {/* Sidebar Chat Sessions */}
              <div className="w-80 bg-white border border-slate-300 rounded-2xl flex flex-col overflow-hidden shrink-0 shadow-xs">
                <div className="p-4 border-b border-slate-300 flex items-center justify-between bg-slate-50">
                  <div>
                    <h2 className="font-black text-xs text-slate-900 uppercase tracking-wider">Antrean Percakapan</h2>
                    <span className="text-[10px] text-slate-600 font-bold">
                      {Object.keys(chats).length} User Aktif
                    </span>
                  </div>
                  <button
                    onClick={handleResetChats}
                    title="Reset Seluruh Chat"
                    className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 text-[10px] font-black flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3 text-red-700" />
                    <span>Reset Chat</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
                  {Object.keys(chats).length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-900 font-black">
                      Belum ada percakapan masuk dari pengguna.
                    </div>
                  ) : (
                    Object.values(chats).map((session) => (
                      <button
                        key={session.id}
                        onClick={() => handleSelectSession(session.id)}
                        className={`w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                          selectedSessionId === session.id
                            ? 'bg-slate-100 border-l-4 border-slate-900'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {session.name?.[0]?.toUpperCase() || 'U'}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h3 className="font-black text-xs text-slate-900 truncate">{session.name}</h3>
                            <span className="text-[9px] text-slate-700 font-extrabold shrink-0">
                              {formatChatDate(session.lastUpdated)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-900 truncate font-extrabold">
                            {session.university} • {session.prodi}
                          </p>
                          <p className="text-[10px] text-slate-900 truncate mt-1 font-bold">
                            {session.messages?.[session.messages.length - 1]?.text || 'Belum ada pesan'}
                          </p>
                        </div>

                        {session.unreadCount > 0 && (
                          <span className="w-4 h-4 bg-slate-900 text-white rounded-full text-[9px] font-black flex items-center justify-center shrink-0">
                            {session.unreadCount}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Room Area */}
              <div className="flex-1 bg-white border border-slate-300 rounded-2xl flex flex-col overflow-hidden shadow-xs">
                {selectedSession ? (
                  <>
                    {/* Session Header */}
                    <div className="p-4 border-b border-slate-300 bg-slate-50 flex items-center justify-between">
                      <div>
                        <h2 className="font-black text-sm text-slate-900">{selectedSession.name}</h2>
                        <div className="flex items-center gap-3 text-[11px] text-slate-900 mt-0.5 font-bold">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-900" /> {selectedSession.email}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <School className="w-3.5 h-3.5 text-slate-900" /> {selectedSession.university}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] bg-slate-200 text-slate-900 border border-slate-400 px-2.5 py-1 rounded-full font-black">
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
                            className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed font-bold ${
                              msg.sender === 'admin'
                                ? 'bg-slate-900 text-white rounded-tr-none shadow-xs'
                                : 'bg-white text-slate-900 border border-slate-300 rounded-tl-none shadow-xs'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <span
                              className={`block text-[9px] mt-1 text-right font-black ${
                                msg.sender === 'admin' ? 'text-slate-300' : 'text-slate-500'
                              }`}
                            >
                              {formatChatDate(msg.createdAt || msg.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Reply Input Box */}
                    <form onSubmit={handleSendAdminReply} className="p-3 border-t border-slate-300 bg-white flex gap-2">
                      <input
                        type="text"
                        placeholder="Tulis balasan untuk pengguna..."
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-black placeholder:text-slate-500 focus:outline-none focus:border-slate-900 focus:bg-white"
                      />
                      <button
                        type="submit"
                        className="bg-slate-900 hover:bg-black text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-2xl flex items-center justify-center text-slate-900 mb-4 shadow-xs">
                      <Headphones className="w-8 h-8 text-slate-900" />
                    </div>
                    <p className="font-black text-base text-slate-900">Pilih Percakapan Pelanggan</p>
                    <p className="text-xs text-slate-900 mt-1 max-w-xs leading-relaxed font-bold">
                      Klik salah satu antrean percakapan di sebelah kiri untuk membalas pesan live chat.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS & PAYMENTS */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-slate-300 rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <h2 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-slate-900" />
                    Daftar Pesanan & Pembayaran QRIS / Transfer
                  </h2>
                  <p className="text-xs text-slate-900 mt-0.5 font-bold">
                    Pantau bukti transfer screenshot QRIS, unduh file dokumen ter-upload, dan verifikasi status lunas.
                  </p>
                </div>

                <button
                  onClick={syncOrdersWithCloud}
                  disabled={ordersLoading}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs font-black flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-900 ${ordersLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh Pesanan</span>
                </button>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-slate-900 bg-slate-50 rounded-2xl border border-slate-300">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-900" />
                  <p className="font-black text-base text-slate-900">Belum Ada Pesanan Masuk</p>
                  <p className="text-xs text-slate-900 mt-1 font-bold">
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
                        className="bg-slate-50 border border-slate-300 rounded-2xl p-5 hover:border-slate-400 transition-colors space-y-4 shadow-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xs">
                              ORD
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-black text-sm text-slate-900">{order.customerName}</h3>
                                <span className="text-[10px] bg-slate-200 text-slate-900 px-2 py-0.5 rounded font-mono border border-slate-400 font-black">
                                  {order.id}
                                </span>
                                <span className="text-[11px] font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-300 flex items-center gap-1.5 shadow-2xs">
                                  <CalendarIcon className="w-3.5 h-3.5 text-slate-900" />
                                  {formatFullDateIndonesian(order.createdAt, order.id)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-900 font-bold mt-0.5">{order.customerEmail}</p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                                isLunas
                                  ? 'bg-slate-900 text-white border border-slate-900'
                                  : isCancel
                                  ? 'bg-slate-200 text-slate-900 border border-slate-400'
                                  : 'bg-slate-200 text-slate-900 border border-slate-400'
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Main Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div className="bg-white p-3.5 rounded-xl border border-slate-300 space-y-1.5 shadow-xs">
                            <p className="text-slate-900 font-bold">Jasa Layanan:</p>
                            <p className="font-black text-slate-900 text-sm">{order.serviceName}</p>
                            <p className="text-slate-900 font-black">{order.price}</p>
                            <div className="pt-1 text-[11px] space-y-0.5 border-t border-slate-100">
                              <p className="text-slate-900 font-bold">
                                Metode: <span className="text-slate-900 font-black">{order.paymentMethod || 'QRIS / Transfer'}</span>
                              </p>
                              <p className="text-slate-700 font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-600" />
                                <span>Tanggal: {formatFullDateIndonesian(order.createdAt, order.id)}</span>
                              </p>
                            </div>
                          </div>

                          <div className="md:col-span-2 bg-white p-3.5 rounded-xl border border-slate-300 space-y-2 shadow-xs">
                            <p className="text-slate-900 font-bold">Detail Formulir Kustom:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                              {order.customFields &&
                                Object.entries(order.customFields).map(([k, v]) => (
                                  <div key={k} className="bg-slate-50 p-2.5 rounded-lg border border-slate-300">
                                    <span className="text-slate-900 block font-black">{k}:</span>
                                    <span className="text-slate-900 font-bold break-words">{v}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Screenshot Proof Button */}
                            {order.proofImage && (
                              <button
                                onClick={() => setSelectedProofImage(order.proofImage || null)}
                                className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-400 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <Eye className="w-4 h-4 text-slate-900" />
                                <span>Lihat Bukti Bayar (Screenshot)</span>
                              </button>
                            )}

                            {/* File Download Button */}
                            {(order.uploadedFileData || order.customFields?.['File Ter-upload']) && (
                              <button
                                onClick={() => handleDownloadFile(order)}
                                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                              >
                                <Download className="w-4 h-4" />
                                <span>Unduh Dokumen File</span>
                              </button>
                            )}

                            {/* Peringatan Status File Kedaluwarsa (> 2 Hari) */}
                            {isOrderFileExpired(order) && (
                              <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-black flex items-center gap-1.5 shadow-2xs" title="Peringatan: Pesanan ini sudah lebih dari 2 hari (48 jam).">
                                <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                <span>Peringatan: File Kedaluwarsa (&gt; 2 Hari)</span>
                              </span>
                            )}
                          </div>

                          {/* Status Toggle Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              disabled={updatingOrderId === order.id}
                              onClick={() => handleUpdateOrderStatus(order.id, 'Dibatalkan')}
                              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all border ${
                                isCancel
                                  ? 'bg-rose-100 text-rose-900 border-rose-400 shadow-xs ring-2 ring-rose-300'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                              } ${updatingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <XCircle className="w-4 h-4 text-slate-900" />
                              <span>{isCancel ? '✕ Dibatalkan' : 'Batalkan'}</span>
                            </button>

                            <button
                              disabled={updatingOrderId === order.id}
                              onClick={() => handleUpdateOrderStatus(order.id, 'LUNAS (Terverifikasi Admin)')}
                              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all border shadow-xs ${
                                isLunas
                                  ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-400'
                                  : 'bg-slate-900 hover:bg-black text-white border-transparent'
                              } ${updatingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <CheckCircle className="w-4 h-4 text-white" />
                              <span>{isLunas ? '✓ Lunas (Terverifikasi)' : 'Verifikasi Lunas'}</span>
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
            <div className="bg-white border border-slate-300 rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <h2 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-900" />
                    Daftar Member Terdaftar
                  </h2>
                  <p className="text-xs text-slate-900 mt-0.5 font-bold">
                    Total {filteredMembers.length} member terdaftar. Menampilkan 50 member per halaman.
                  </p>
                </div>

                {/* Pagination Controls Top */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMemberPage((p) => Math.max(1, p - 1))}
                    disabled={memberPage === 1}
                    className="p-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-900 disabled:opacity-40 hover:bg-slate-200 transition-colors cursor-pointer font-black"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-black text-slate-900 px-2">
                    Halaman {memberPage} dari {totalPages}
                  </span>
                  <button
                    onClick={() => setMemberPage((p) => Math.min(totalPages, p + 1))}
                    disabled={memberPage === totalPages}
                    className="p-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-900 disabled:opacity-40 hover:bg-slate-200 transition-colors cursor-pointer font-black"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Members Table */}
              <div className="overflow-x-auto border border-slate-300 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-900">
                  <thead className="bg-slate-100 text-slate-900 font-black uppercase tracking-wider text-[10px] border-b border-slate-300">
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
                        <td className="p-3.5 font-mono text-slate-900 font-black">{mbr.id}</td>
                        <td className="p-3.5 font-black text-slate-900">{mbr.name}</td>
                        <td className="p-3.5 text-slate-900 font-bold">{mbr.email}</td>
                        <td className="p-3.5 text-slate-900 font-bold">{mbr.university || '-'}</td>
                        <td className="p-3.5 text-slate-900 font-bold">{mbr.prodi || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Pagination */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-900 font-bold">
                  Menampilkan {indexOfFirstMember + 1} - {Math.min(indexOfLastMember, filteredMembers.length)} dari {filteredMembers.length} Member
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMemberPage((p) => Math.max(1, p - 1))}
                    disabled={memberPage === 1}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-black text-slate-900 disabled:opacity-40 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setMemberPage((p) => Math.min(totalPages, p + 1))}
                    disabled={memberPage === totalPages}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-black text-slate-900 disabled:opacity-40 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REVENUE & EXCEL REPORT */}
          {activeTab === 'revenue' && (
            <div className="bg-white border border-slate-300 rounded-2xl p-6 space-y-6 shadow-xs">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <h2 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-slate-900" />
                    Dasbor Pendapatan & Export Laporan Excel
                  </h2>
                  <p className="text-xs text-slate-900 mt-0.5 font-bold">
                    Pilih tanggal pada kalender untuk melihat pendapatan dan riwayat orderan per hari secara realtime.
                  </p>
                </div>

                <button
                  onClick={handleExportDailyExcel}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-white" />
                  <span>Export Laporan Excel (.xlsx)</span>
                </button>
              </div>

              {/* 3 Top KPI Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 border border-slate-300 rounded-2xl p-6 space-y-2">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Total Pendapatan ({selectedRevenueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})
                  </p>
                  <p className="text-3xl font-black text-slate-900">
                    Rp {revenueForSelectedDate.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[11px] text-slate-900 font-bold">Otomatis dihitung dari order status Lunas</p>
                </div>

                <div className="bg-slate-50 border border-slate-300 rounded-2xl p-6 space-y-2">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Total Pesanan ({selectedRevenueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})
                  </p>
                  <p className="text-3xl font-black text-slate-900">
                    {ordersForSelectedDate.length} Order
                  </p>
                  <p className="text-[11px] text-slate-900 font-bold">
                    {lunasOrdersSelectedDate.length} Terverifikasi Lunas
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-300 rounded-2xl p-6 space-y-2">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-wider">Waktu Sistem Realtime</p>
                  <p className="text-base font-black text-slate-900 capitalize">
                    {selectedRevenueDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-[11px] text-slate-900 font-bold">Zona Waktu: Asia/Jakarta (WIB)</p>
                </div>
              </div>

              {/* Mini Calendar Component */}
              <div>
                <Calendar
                  selectedDate={selectedRevenueDate}
                  onSelectDate={(d) => setSelectedRevenueDate(d)}
                />
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-300 rounded-2xl overflow-hidden">
                <div className="p-4 bg-slate-100 border-b border-slate-300 flex items-center justify-between font-black text-xs text-slate-900">
                  <span>
                    Rincian Transaksi Pendapatan Masuk ({selectedRevenueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })})
                  </span>
                  <span className="text-[11px] text-slate-600 font-bold">
                    {ordersForSelectedDate.length} Pesanan
                  </span>
                </div>
                <table className="w-full text-left text-xs text-slate-900">
                  <thead className="bg-white text-slate-900 font-black text-[10px] uppercase border-b border-slate-300">
                    <tr>
                      <th className="p-3.5">ID Order</th>
                      <th className="p-3.5">Tanggal, Bulan, Tahun & Jam (WIB)</th>
                      <th className="p-3.5">Pelanggan</th>
                      <th className="p-3.5">Layanan</th>
                      <th className="p-3.5">Harga</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {ordersForSelectedDate.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-bold">
                          Tidak ada pesanan masuk pada tanggal ini.
                        </td>
                      </tr>
                    ) : (
                      ordersForSelectedDate.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-mono text-slate-900 font-black">{o.id}</td>
                          <td className="p-3.5 text-slate-900 font-extrabold whitespace-nowrap">
                            {formatFullDateIndonesian(o.createdAt, o.id)}
                          </td>
                          <td className="p-3.5">
                            <p className="font-black text-slate-900">{o.customerName}</p>
                            <p className="text-[10px] text-slate-600 font-bold">{o.customerEmail}</p>
                          </td>
                          <td className="p-3.5 text-slate-900 font-bold">{o.serviceName}</td>
                          <td className="p-3.5 font-black text-slate-900">{o.price}</td>
                          <td className="p-3.5">
                            <span
                              className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                o.paymentStatus?.toLowerCase().includes('lunas')
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-slate-200 text-slate-900 border border-slate-400'
                              }`}
                            >
                              {o.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SERVICE CMS */}
          {activeTab === 'services' && (
            <div className="bg-white border border-slate-300 rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <h2 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-slate-900" />
                    Kelola Layanan & Harga (CMS Realtime)
                  </h2>
                  <p className="text-xs text-slate-900 mt-0.5 font-bold">
                    Ubah nama, harga, deskripsi, dan badge layanan secara langsung. Perubahan akan realtime di web resmi saat direfresh.
                  </p>
                </div>

                {saveSuccessMsg && (
                  <span className="text-xs font-black bg-slate-900 text-white border border-slate-900 px-3.5 py-1.5 rounded-xl animate-fade-in">
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
                      className="bg-slate-50 border border-slate-300 rounded-2xl p-5 space-y-3 relative group hover:border-slate-400 transition-colors shadow-xs"
                    >
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-black text-slate-900 mb-1">Nama Layanan</label>
                            <input
                              type="text"
                              value={editForm.name || srv.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-black"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-black text-slate-900 mb-1">Harga Layanan</label>
                            <input
                              type="text"
                              value={editForm.price || srv.price}
                              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-black"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-black text-slate-300 mb-1">Deskripsi Singkat</label>
                            <textarea
                              rows={2}
                              value={editForm.description || srv.description}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-black"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              onClick={() => setEditingServiceId(null)}
                              className="px-3.5 py-1.5 rounded-lg bg-slate-200 text-slate-900 text-xs font-black hover:bg-slate-300"
                            >
                              Batal
                            </button>
                            <button
                              onClick={() => handleSaveCmsService(srv.id)}
                              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow-xs"
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
                              <span className="text-[9px] font-mono text-slate-900 bg-slate-200 border border-slate-400 px-2 py-0.5 rounded font-black uppercase">
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
                              <Edit3 className="w-4 h-4 text-slate-900" />
                            </button>
                          </div>

                          <p className="text-xs text-slate-900 leading-relaxed font-bold">{srv.description}</p>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-300">
                            <span className="text-sm font-black text-slate-900">{srv.price}</span>
                            {srv.badge && (
                              <span className="text-[9px] font-black bg-slate-900 text-white px-2.5 py-0.5 rounded uppercase">
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

          {/* TAB 7: TESTIMONIALS MODERATION */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-300 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                    Kelola Ulasan Testimoni & Rating Member
                  </h2>
                  <p className="text-xs text-slate-900 font-bold mt-1">
                    Semua ulasan & rating yang dikirimkan oleh member secara realtime tersimpan di sini
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-white text-xs font-black px-3.5 py-1.5 rounded-xl">
                    Total: {testimonialsList.length} Ulasan
                  </span>
                  <button
                    onClick={fetchAdminTestimonials}
                    className="p-2 bg-white border border-slate-300 text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    title="Refresh Data"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-900" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonialsList.length === 0 ? (
                  <div className="col-span-full bg-white border border-slate-300 rounded-2xl p-12 text-center text-slate-900 font-black">
                    Belum ada testimoni dari member.
                  </div>
                ) : (
                  testimonialsList.map((testi: any) => {
                    const dateStr = testi.createdAt
                      ? new Date(testi.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Baru Saja';

                    return (
                      <div
                        key={testi.id}
                        className="bg-white border border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-xs uppercase shrink-0">
                                {testi.name?.charAt(0) || 'M'}
                              </div>
                              <div className="truncate">
                                <h4 className="font-black text-xs text-slate-900 truncate">{testi.name}</h4>
                                <p className="text-[10px] text-slate-900 font-bold truncate">
                                  {testi.university || 'Mahasiswa'} {testi.prodi ? `• ${testi.prodi}` : ''}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteTestimonial(testi.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer shrink-0"
                              title="Hapus Testimoni"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            {[...Array(testi.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            ))}
                            <span className="text-[10px] font-black text-amber-600 ml-1">
                              ({testi.rating || 5}/5)
                            </span>
                          </div>

                          <span className="bg-slate-100 text-slate-900 border border-slate-300 text-[10px] font-black px-2.5 py-0.5 rounded-md inline-block">
                            {testi.serviceName}
                          </span>

                          <p className="text-xs text-slate-900 font-bold leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            &quot;{testi.comment}&quot;
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-900 font-black">
                          <span>{dateStr}</span>
                          <span className="text-green-700 font-black">✔ Terverifikasi</span>
                        </div>
                      </div>
                    );
                  })
                )}
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
              className="bg-white border border-slate-300 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto relative space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-slate-900" />
                  Inspeksi Bukti Pembayaran QRIS (Screenshot)
                </h3>
                <button
                  onClick={() => setSelectedProofImage(null)}
                  className="p-1 text-slate-900 hover:text-black rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 flex items-center justify-center p-2">
                <img
                  src={selectedProofImage}
                  alt="Bukti Transfer QRIS"
                  className="max-h-[60vh] object-contain rounded-xl"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedProofImage(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs cursor-pointer"
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
