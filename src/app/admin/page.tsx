'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { Calendar } from '@/components/ui/mini-calendar';
import {
  Mail, Lock, LogOut, MessageSquare, Shield,
  School, Send, CircleAlert, Headphones,
  ShoppingBag, CheckCircle, XCircle, Eye, RefreshCw, X, QrCode, Plus,
  Download, Users, DollarSign, FileSpreadsheet, Edit3, Save, ChevronLeft, ChevronRight,
  Search, LayoutDashboard, TrendingUp, Clock, Check, FileText, Trash2, Star, Calendar as CalendarIcon,
  Menu, PanelLeftClose, PanelLeftOpen, Maximize2, Minimize2, ImagePlus, Loader2, Gift, Sparkles, Award, ExternalLink, Copy, Flame
} from 'lucide-react';
import { compressChatImage } from '@/lib/imageCompressor';

export interface TurnitinRedeemItem {
  id: string;
  memberEmail: string;
  memberName: string;
  memberUniversity?: string;
  memberProdi?: string;
  memberPhone?: string;
  platform: string;
  proofImage: string;
  status: 'MENUNGGU_VERIFIKASI' | 'DISETUJUI' | 'DITOLAK';
  voucherCode?: string | null;
  adminNote?: string | null;
  approvedAt?: string | null;
  createdAt: string;
}

interface Message {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
  read: boolean;
  createdAt?: number;
  mediaUrl?: string;
  mediaName?: string;
  mediaSize?: string;
  isExpired?: boolean;
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
  { id: 1, category: 'turnitin', name: 'Cek Turnitin 1x', price: 'Rp 9.000', description: 'Pengerjaan cepat & garansi kualitas hasil terbaik.', badge: null },
  { id: 2, category: 'turnitin', name: 'Cek Turnitin 3x', price: 'Rp 24.000', description: 'Paket hemat 3x pengecekan dengan laporan lengkap.', badge: 'Hemat!' },
  { id: 3, category: 'turnitin', name: 'Cek Turnitin 6x', price: 'Rp 48.000', description: 'Pengecekan lengkap dan garansi hasil valid.', badge: 'Best Deal!' },
  { id: 4, category: 'turnitin', name: 'Cek AI 1x', price: 'Rp 5.000', description: 'Deteksi AI hasil instan dan detail.', badge: 'ZEROGPT' },
  { id: 5, category: 'turnitin', name: 'Cek AI 2x', price: 'Rp 10.000', description: 'Paket 2x deteksi AI instan.', badge: 'ZEROGPT' },
  { id: 6, category: 'parafrase', name: 'Parafrase Dokumen', price: 'Rp 2.000/Hal', description: 'Menurunkan persentase Turnitin hingga aman.', badge: null },
  { id: 7, category: 'joki-tugas', name: 'Translate Grammar', price: 'Rp 2.000/Hal', description: 'Penerjemahan dan perbaikan tata bahasa baku.', badge: null },
  { id: 8, category: 'joki-tugas', name: 'Daftar Pustaka', price: 'Rp 1.000/Sumber', description: 'Penyusunan referensi APA/IEEE/Harvard rapi.', badge: null },
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
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'orders' | 'members' | 'redeems' | 'revenue' | 'services' | 'testimonials' | 'promotions'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Testimonials state
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [testiSearchQuery, setTestiSearchQuery] = useState('');
  const [testiCurrentPage, setTestiCurrentPage] = useState(1);

  // Promotions (Trusted By) Showcase CRUD state
  const [promotionsGroup, setPromotionsGroup] = useState<'influencer' | 'public'>('influencer');
  const [promotionsList, setPromotionsList] = useState<any[]>([]);
  const [promotionsLoading, setPromotionsLoading] = useState(false);
  const [promotionsSearchQuery, setPromotionsSearchQuery] = useState('');
  const [promotionsPlatformFilter, setPromotionsPlatformFilter] = useState('all');
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<any | null>(null);
  const [isSavingPromotion, setIsSavingPromotion] = useState(false);
  const [deletingPromotionId, setDeletingPromotionId] = useState<string | null>(null);
  const [promotionPreviewZoom, setPromotionPreviewZoom] = useState<string | null>(null);

  // Fetch real-time promotions for Admin
  const fetchAdminPromotions = async () => {
    try {
      setPromotionsLoading(true);
      const res = await fetch(`/api/promotions?type=${promotionsGroup}&all=true`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setPromotionsList(data);
      }
    } catch (e) {
      console.error('Failed fetching admin promotions', e);
    } finally {
      setPromotionsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAdminPromotions();
    }
  }, [isAdminLoggedIn, promotionsGroup]);

  const handleDeletePromotion = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data promosi ini dari database?')) return;
    try {
      setDeletingPromotionId(id);
      const res = await fetch(`/api/promotions?id=${id}&type=${promotionsGroup}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdminPromotions();
      } else {
        alert('Gagal menghapus data promosi');
      }
    } catch (e) {
      alert('Terjadi kesalahan saat menghapus data promosi');
    } finally {
      setDeletingPromotionId(null);
    }
  };

  const handleSavePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromotion?.name || !editingPromotion?.handle || !editingPromotion?.promotionTitle || !editingPromotion?.proofMediaUrl) {
      alert('Mohon lengkapi Nama, Handle (@username), Judul Promosi, dan Foto Bukti Promosi.');
      return;
    }

    try {
      setIsSavingPromotion(true);
      const payload = {
        ...editingPromotion,
        targetGroup: editingPromotion.targetGroup || promotionsGroup,
      };

      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsPromotionModalOpen(false);
        setEditingPromotion(null);
        fetchAdminPromotions();
      } else {
        alert(data.error || 'Gagal menyimpan data promosi');
      }
    } catch (e: any) {
      alert(e.message || 'Terjadi kesalahan saat menyimpan data promosi');
    } finally {
      setIsSavingPromotion(false);
    }
  };

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
  const [adminChatPreview, setAdminChatPreview] = useState<{ url: string; name?: string } | null>(null);
  const [isAdminChatUploading, setIsAdminChatUploading] = useState(false);
  const adminFileInputRef = useRef<HTMLInputElement>(null);

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

  // Responsive Sidebar States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

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

  // Services CMS state & Full CRUD
  const [cmsServices, setCmsServices] = useState<ServiceConfig[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('soobin_cms_services');
        return cached ? JSON.parse(cached) : DEFAULT_SERVICES;
      } catch (e) {
        return DEFAULT_SERVICES;
      }
    }
    return DEFAULT_SERVICES;
  });
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServiceConfig>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('all');
  const [serviceSearchTerm, setServiceSearchTerm] = useState<string>('');
  const [isCreateServiceOpen, setIsCreateServiceOpen] = useState<boolean>(false);
  const [newService, setNewService] = useState<Partial<ServiceConfig>>({
    category: 'turnitin',
    name: '',
    price: '',
    description: 'Pengerjaan cepat & garansi kualitas hasil terbaik.',
    badge: '',
  });
  const [deletingServiceId, setDeletingServiceId] = useState<number | null>(null);
  const [savingServiceId, setSavingServiceId] = useState<number | null>(null);
  const [servicesLoading, setServicesLoading] = useState(false);

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

  // REDEEM FREE TURNITIN STATES
  const [redeems, setRedeems] = useState<TurnitinRedeemItem[]>([]);
  const [redeemsLoading, setRedeemsLoading] = useState(false);
  const [selectedMemberForRedeemDetail, setSelectedMemberForRedeemDetail] = useState<MemberUser | null>(null);
  const [redeemZoomImage, setRedeemZoomImage] = useState<string | null>(null);
  const [rejectReasonModal, setRejectReasonModal] = useState<{ isOpen: boolean; redeemId: string; reason: string }>({
    isOpen: false,
    redeemId: '',
    reason: '',
  });
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [redeemStatusFilter, setRedeemStatusFilter] = useState<string>('all');
  const [redeemSearchTerm, setRedeemSearchTerm] = useState<string>('');
  const [redeemSubTab, setRedeemSubTab] = useState<'members_table' | 'submissions'>('members_table');

  // Set body background & check server-side authenticated session on mount
  useEffect(() => {
    const checkServerAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAdminLoggedIn(true);
            return;
          }
        }
      } catch (err) {
        console.warn('Admin session check error:', err);
      }
      setIsAdminLoggedIn(false);
    };

    checkServerAuth();

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

  // Sync Redeems API
  const [redeemBatchQuota, setRedeemBatchQuota] = useState<{
    totalQuota: number;
    claimedCount: number;
    remainingQuota: number;
    batchEndTime: number;
  }>({
    totalQuota: 10,
    claimedCount: 0,
    remainingQuota: 10,
    batchEndTime: 0,
  });

  const syncRedeemsWithCloud = async () => {
    try {
      setRedeemsLoading(true);
      const res = await fetch('/api/redeems', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setRedeems(data);
          try {
            localStorage.setItem('soobin_redeems_list', JSON.stringify(data));
          } catch (e) {}
        } else if (data && Array.isArray(data.redeems)) {
          setRedeems(data.redeems);
          if (data.quota) {
            setRedeemBatchQuota(data.quota);
          }
          try {
            localStorage.setItem('soobin_redeems_list', JSON.stringify(data.redeems));
          } catch (e) {}
        }
      }
    } catch (e) {
      console.error('Failed to sync redeems', e);
    } finally {
      setRedeemsLoading(false);
    }
  };

  const handleApproveRedeem = async (redeemId: string) => {
    setActionLoadingId(redeemId);
    try {
      const res = await fetch('/api/redeems', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: redeemId, action: 'approve' }),
      });
      if (res.ok) {
        await syncRedeemsWithCloud();
      }
    } catch (err) {
      console.error('Gagal menyetujui klaim:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenRejectModal = (redeemId: string) => {
    setRejectReasonModal({
      isOpen: true,
      redeemId,
      reason: 'Status/Story WA/IG tidak berstatus publik atau dikecualikan (hanya untuk admin). Mohon share ulang secara publik ke semua kontak.',
    });
  };

  const handleConfirmRejectRedeem = async () => {
    if (!rejectReasonModal.redeemId) return;
    setActionLoadingId(rejectReasonModal.redeemId);
    try {
      const res = await fetch('/api/redeems', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rejectReasonModal.redeemId,
          action: 'reject',
          reason: rejectReasonModal.reason || 'Bukti share tidak memenuhi syarat publik.',
        }),
      });
      if (res.ok) {
        setRejectReasonModal({ isOpen: false, redeemId: '', reason: '' });
        await syncRedeemsWithCloud();
      }
    } catch (err) {
      console.error('Gagal menolak klaim:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteRedeem = async (redeemId: string) => {
    if (!window.confirm('Hapus riwayat pengajuan redeem ini?')) return;
    setActionLoadingId(redeemId);
    try {
      const res = await fetch(`/api/redeems?id=${encodeURIComponent(redeemId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await syncRedeemsWithCloud();
      }
    } catch (err) {
      console.error('Gagal menghapus klaim:', err);
    } finally {
      setActionLoadingId(null);
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
      const res = await fetch(BUCKET_URL, { cache: 'no-store' });
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

  // Sync Services API (100% Realtime Database Supabase)
  const syncServicesWithCloud = async () => {
    setServicesLoading(true);
    try {
      const res = await fetch('/api/services', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.services) && data.services.length > 0) {
          setCmsServices(data.services);
          try {
            localStorage.setItem('soobin_cms_services', JSON.stringify(data.services));
          } catch (e) {
            // Ignore localStorage quota errors
          }
        }
      }
    } catch (e) {
      console.error('Failed to sync services from database', e);
    } finally {
      setServicesLoading(false);
    }
  };

  // Polling loop
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    syncChatsWithCloud();
    syncOrdersWithCloud();
    syncMembersWithCloud();
    syncServicesWithCloud();
    syncRedeemsWithCloud();

    const interval = setInterval(() => {
      syncChatsWithCloud();
      syncOrdersWithCloud();
      syncMembersWithCloud();
      syncRedeemsWithCloud();
    }, 4000);

    return () => clearInterval(interval);
  }, [isAdminLoggedIn]);

  // Auto scroll chat stream
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedSessionId, chats]);

  // Server-side Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Email atau password administrator salah!');
      } else {
        setIsAdminLoggedIn(true);
        localStorage.setItem('soobin_admin_active', 'true');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal terhubung ke server autentikasi');
    } finally {
      setLoading(false);
    }
  };

  // Server-side Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setIsAdminLoggedIn(false);
      localStorage.removeItem('soobin_admin_logged_in');
      localStorage.setItem('soobin_admin_active', 'false');
    }
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

  // Send admin photo reply
  const handleAdminSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedSessionId) return;

    const session = chats[selectedSessionId];
    if (!session) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (.png, .jpg, .jpeg, .webp)');
      return;
    }

    setIsAdminChatUploading(true);
    try {
      const { dataUrl, fileName, fileSize } = await compressChatImage(file);

      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        sender: 'admin',
        text: adminReplyText.trim() || '📷 Mengirim foto',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true,
        createdAt: Date.now(),
        mediaUrl: dataUrl,
        mediaName: fileName,
        mediaSize: fileSize,
      };

      setAdminReplyText('');

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

      await fetch(BUCKET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSession),
      });
      localStorage.setItem('soobin_chats', JSON.stringify(updatedChats));
    } catch (err) {
      console.error('Failed sending admin photo reply', err);
      alert('Gagal mengirim foto');
    } finally {
      setIsAdminChatUploading(false);
      if (adminFileInputRef.current) {
        adminFileInputRef.current.value = '';
      }
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

  // Helper to notify other tabs/pages immediately
  const broadcastServiceChange = (payload: any) => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('soobin_services_sync');
        bc.postMessage(payload);
        setTimeout(() => bc.close(), 100);
      }
    } catch (e) {}
  };

  // 1. CREATE New Service in Supabase
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.price) {
      alert('Nama dan Harga Layanan wajib diisi!');
      return;
    }

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      });
      if (res.ok) {
        const result = await res.json();
        const created = result.service || { ...newService, id: Date.now() };
        const updated = [...cmsServices, created];
        try {
          localStorage.setItem('soobin_cms_services', JSON.stringify(updated));
        } catch (e) {
          // Ignore localStorage quota errors - memory state & Supabase are primary
        }
        setIsCreateServiceOpen(false);
        setNewService({
          category: 'turnitin',
          name: '',
          price: '',
          description: 'Pengerjaan cepat & garansi kualitas hasil terbaik.',
          badge: '',
        });
        setSaveSuccessMsg(`Layanan "${created.name}" berhasil ditambahkan ke database!`);
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        broadcastServiceChange({ type: 'SERVICE_UPDATED', service: created });
      }
    } catch (err) {
      console.error('Failed creating service', err);
    }
  };

  // 2. UPDATE Service in Supabase
  const handleSaveCmsService = async (id: number) => {
    setSavingServiceId(id);
    const existing = cmsServices.find((s) => s.id === id);
    const updatedItem: ServiceConfig = {
      id,
      category: editForm.category !== undefined ? editForm.category : (existing?.category || 'umum'),
      name: editForm.name !== undefined ? editForm.name : (existing?.name || ''),
      price: editForm.price !== undefined ? editForm.price : (existing?.price || ''),
      description: editForm.description !== undefined ? editForm.description : (existing?.description || ''),
      badge: editForm.badge ? editForm.badge.trim() : (editForm.badge === '' ? null : (existing?.badge || null)),
    };

    try {
      const res = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });

      if (res.ok) {
        // Update local React memory state
        const updatedList = cmsServices.map((s) => (s.id === id ? updatedItem : s));
        setCmsServices(updatedList);
        try {
          localStorage.setItem('soobin_cms_services', JSON.stringify(updatedList));
        } catch (e) {
          // Ignore localStorage quota errors
        }
        setEditingServiceId(null);
        setSaveSuccessMsg(`✓ Layanan "${updatedItem.name}" berhasil disimpan ke Database (${updatedItem.price})!`);
        setTimeout(() => setSaveSuccessMsg(''), 5000);
        // Broadcast to all open tabs and pages
        broadcastServiceChange({ type: 'SERVICE_UPDATED', service: updatedItem });
        // Sync fresh from Supabase
        syncServicesWithCloud();
      } else {
        const errData = await res.json();
        alert(`Gagal menyimpan ke database: ${errData.error || 'Terjadi kesalahan'}`);
      }
    } catch (err: any) {
      console.error('Failed updating service in database', err);
      alert(`Gagal menyimpan ke database: ${err.message || 'Koneksi bermasalah'}`);
    } finally {
      setSavingServiceId(null);
    }
  };

  // 3. DELETE Service from Supabase
  const handleDeleteService = async (id: number, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus layanan "${name}" dari database?`)) return;

    setDeletingServiceId(id);
    try {
      const res = await fetch(`/api/services?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const updated = cmsServices.filter((s) => s.id !== id);
        setCmsServices(updated);
        try {
          localStorage.setItem('soobin_cms_services', JSON.stringify(updated));
        } catch (e) {
          // Ignore localStorage quota errors
        }
        setSaveSuccessMsg(`Layanan "${name}" berhasil dihapus dari database!`);
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        broadcastServiceChange({ type: 'SERVICE_UPDATED', deletedId: id });
      }
    } catch (err) {
      console.error('Failed deleting service', err);
    } finally {
      setDeletingServiceId(null);
    }
  };

  // Filtered CMS Services based on category and search
  const filteredCmsServices = cmsServices.filter((s) => {
    const matchesCategory =
      serviceCategoryFilter === 'all' || s.category?.toLowerCase() === serviceCategoryFilter.toLowerCase();
    const q = serviceSearchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (s.name || '').toLowerCase().includes(q) ||
      (s.description || '').toLowerCase().includes(q) ||
      (s.category || '').toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

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

  const pendingRedeemsCount = useMemo(() => {
    return redeems.filter((r) => r.status === 'MENUNGGU_VERIFIKASI').length;
  }, [redeems]);

  const approvedRedeemsCount = useMemo(() => {
    return redeems.filter((r) => r.status === 'DISETUJUI').length;
  }, [redeems]);

  const rejectedRedeemsCount = useMemo(() => {
    return redeems.filter((r) => r.status === 'DITOLAK').length;
  }, [redeems]);

  // Aggregate stats per member email (Total, Disetujui, Ditolak, List)
  const memberRedeemStats = useMemo(() => {
    const map: Record<string, { total: number; approved: number; rejected: number; pending: number; list: TurnitinRedeemItem[] }> = {};

    redeems.forEach((r) => {
      const email = (r.memberEmail || '').toLowerCase().trim();
      if (!email) return;
      if (!map[email]) {
        map[email] = { total: 0, approved: 0, rejected: 0, pending: 0, list: [] };
      }
      map[email].total += 1;
      map[email].list.push(r);
      if (r.status === 'DISETUJUI') map[email].approved += 1;
      if (r.status === 'DITOLAK') map[email].rejected += 1;
      if (r.status === 'MENUNGGU_VERIFIKASI') map[email].pending += 1;
    });

    return map;
  }, [redeems]);

  // Monthly top sharer calculation
  const topSharerMember = useMemo<{ member: MemberUser; count: number } | null>(() => {
    if (members.length === 0) return null;
    let topMbr: MemberUser | null = null;
    let maxApproved = 0;

    members.forEach((m) => {
      const email = (m.email || '').toLowerCase().trim();
      const stats = memberRedeemStats[email];
      const count = stats?.approved || 0;
      if (count > maxApproved) {
        maxApproved = count;
        topMbr = m;
      }
    });

    if (maxApproved === 0 || !topMbr) return null;
    return { member: topMbr, count: maxApproved };
  }, [members, memberRedeemStats]);

  // Filtered redeems for the Submissions sub-tab
  const filteredSubmissions = useMemo(() => {
    return redeems.filter((r) => {
      const matchesStatus = redeemStatusFilter === 'all' || r.status === redeemStatusFilter;
      const q = redeemSearchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (r.memberName || '').toLowerCase().includes(q) ||
        (r.memberEmail || '').toLowerCase().includes(q) ||
        (r.voucherCode || '').toLowerCase().includes(q) ||
        (r.id || '').toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [redeems, redeemStatusFilter, redeemSearchTerm]);

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
      {/* MOBILE DRAWER OVERLAY (SLIDE-OVER ON PHONES) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
            />

            {/* Slide-In Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white z-50 flex flex-col justify-between shadow-2xl border-r border-slate-300 lg:hidden"
            >
              <div>
                {/* Brand Header & Close Button */}
                <div className="p-4 border-b border-slate-300 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="font-black text-sm text-slate-900 tracking-tight leading-none">SOOBIN</h1>
                      <p className="text-[9px] text-slate-700 font-black mt-0.5 uppercase tracking-wider">Services Admin</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 transition-colors"
                    title="Tutup Menu"
                  >
                    <X className="w-5 h-5 text-slate-900" />
                  </button>
                </div>

                {/* Nav Items Mobile */}
                <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-170px)]">
                  <p className="text-[10px] font-black text-slate-900 px-3 pt-2 pb-1 uppercase tracking-wider">Menu Utama</p>

                  <button
                    onClick={() => { setActiveTab('overview'); setIsMobileSidebarOpen(false); }}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === 'overview'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-white' : 'text-slate-900'}`} />
                      <span>Overview Dasbor</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('chat'); setIsMobileSidebarOpen(false); }}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === 'chat'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className={`w-4 h-4 ${activeTab === 'chat' ? 'text-white' : 'text-slate-900'}`} />
                      <span>Live Chat</span>
                    </div>
                    {unreadChatsCount > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === 'chat' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                        {unreadChatsCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => { setActiveTab('orders'); setIsMobileSidebarOpen(false); }}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === 'orders'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-slate-900'}`} />
                      <span>Pesanan & Pembayaran</span>
                    </div>
                    {pendingOrdersCount > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === 'orders' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                        {pendingOrdersCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => { setActiveTab('members'); setIsMobileSidebarOpen(false); }}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === 'members'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className={`w-4 h-4 ${activeTab === 'members' ? 'text-white' : 'text-slate-900'}`} />
                      <span>Data Member</span>
                    </div>
                    <span className="bg-slate-200 text-slate-900 text-[10px] px-2 py-0.5 rounded-full font-black border border-slate-300">
                      {members.length}
                    </span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('redeems'); setIsMobileSidebarOpen(false); }}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === 'redeems'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Gift className={`w-4 h-4 ${activeTab === 'redeems' ? 'text-white' : 'text-amber-600'}`} />
                      <span>Klaim Free Turnitin</span>
                    </div>
                    {pendingRedeemsCount > 0 ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-amber-400 text-slate-950 border border-amber-500">
                        {pendingRedeemsCount} Baru
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-slate-300">
                        {redeems.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => { setActiveTab('revenue'); setIsMobileSidebarOpen(false); }}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === 'revenue'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <DollarSign className={`w-4 h-4 ${activeTab === 'revenue' ? 'text-white' : 'text-slate-900'}`} />
                      <span>Pendapatan & Export</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('services'); setIsMobileSidebarOpen(false); }}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === 'services'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Edit3 className={`w-4 h-4 ${activeTab === 'services' ? 'text-white' : 'text-slate-900'}`} />
                      <span>Kelola Layanan (CMS)</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('testimonials'); setIsMobileSidebarOpen(false); }}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
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

                  <button
                    onClick={() => { setActiveTab('promotions'); setIsMobileSidebarOpen(false); }}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === 'promotions'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className={`w-4 h-4 ${activeTab === 'promotions' ? 'text-white' : 'text-slate-900'}`} />
                      <span>Showcase Promosi</span>
                    </div>
                    <span className="bg-primary-100 text-primary-900 text-[10px] px-2 py-0.5 rounded-full font-black border border-primary-300">
                      {promotionsList.length}
                    </span>
                  </button>
                </nav>
              </div>

              {/* Drawer Footer Admin Profile */}
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
                  className="w-full text-xs font-black text-slate-900 hover:text-black flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-300"
                >
                  <LogOut className="w-4 h-4 text-slate-900" />
                  <span>Keluar Sesi</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP VERTICAL SIDEBAR NAVIGATION (COLLAPSIBLE & EXPANDABLE) */}
      <aside
        className={`bg-white border-r border-slate-300 hidden lg:flex flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen z-30 shadow-xs transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Brand Header & Toggle */}
          <div className={`border-b border-slate-300 flex items-center justify-between ${isSidebarCollapsed ? 'p-3 flex-col gap-2 text-center' : 'p-4'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <h1 className="font-black text-base text-slate-900 tracking-tight leading-none">SOOBIN</h1>
                  <p className="text-[10px] text-slate-900 font-black mt-1 uppercase tracking-wider truncate">Services Admin</p>
                </div>
              )}
            </div>

            {/* Desktop Minimize/Maximize Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors border border-slate-300"
              title={isSidebarCollapsed ? 'Perlebar Sidebar (Maximize)' : 'Perkecil Sidebar (Minimize)'}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-slate-900" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-slate-900" />
              )}
            </button>
          </div>

          {/* Nav Items Desktop */}
          <nav className="p-3 space-y-1.5">
            {!isSidebarCollapsed && (
              <p className="text-[10px] font-black text-slate-900 px-3 pt-2 pb-1 uppercase tracking-wider">Menu Utama</p>
            )}

            <button
              onClick={() => setActiveTab('overview')}
              title="Overview Dasbor"
              className={`w-full rounded-xl text-xs font-black transition-all flex items-center cursor-pointer border ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-white' : 'text-slate-900'}`} />
                {!isSidebarCollapsed && <span>Overview Dasbor</span>}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              title="Live Chat"
              className={`w-full rounded-xl text-xs font-black transition-all flex items-center cursor-pointer border ${
                isSidebarCollapsed ? 'justify-center p-3 relative' : 'justify-between px-3.5 py-2.5'
              } ${
                activeTab === 'chat'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className={`w-4 h-4 ${activeTab === 'chat' ? 'text-white' : 'text-slate-900'}`} />
                {!isSidebarCollapsed && <span>Live Chat</span>}
              </div>
              {unreadChatsCount > 0 && (
                isSidebarCollapsed ? (
                  <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                ) : (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === 'chat' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                    {unreadChatsCount}
                  </span>
                )
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              title="Pesanan & Pembayaran"
              className={`w-full rounded-xl text-xs font-black transition-all flex items-center cursor-pointer border ${
                isSidebarCollapsed ? 'justify-center p-3 relative' : 'justify-between px-3.5 py-2.5'
              } ${
                activeTab === 'orders'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-slate-900'}`} />
                {!isSidebarCollapsed && <span>Pesanan & Pembayaran</span>}
              </div>
              {pendingOrdersCount > 0 && (
                isSidebarCollapsed ? (
                  <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                ) : (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === 'orders' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                    {pendingOrdersCount}
                  </span>
                )
              )}
            </button>

            <button
              onClick={() => setActiveTab('members')}
              title="Data Member"
              className={`w-full rounded-xl text-xs font-black transition-all flex items-center cursor-pointer border ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } ${
                activeTab === 'members'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className={`w-4 h-4 ${activeTab === 'members' ? 'text-white' : 'text-slate-900'}`} />
                {!isSidebarCollapsed && <span>Data Member</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="bg-slate-200 text-slate-900 text-[10px] px-2 py-0.5 rounded-full font-black border border-slate-300">
                  {members.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('redeems')}
              title="Klaim Free Turnitin"
              className={`w-full rounded-xl text-xs font-black transition-all flex items-center cursor-pointer border ${
                isSidebarCollapsed ? 'justify-center p-3 relative' : 'justify-between px-3.5 py-2.5'
              } ${
                activeTab === 'redeems'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Gift className={`w-4 h-4 ${activeTab === 'redeems' ? 'text-white' : 'text-amber-600'}`} />
                {!isSidebarCollapsed && <span>Klaim Free Turnitin</span>}
              </div>
              {pendingRedeemsCount > 0 ? (
                isSidebarCollapsed ? (
                  <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-white" />
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-amber-400 text-slate-950 border border-amber-500">
                    {pendingRedeemsCount} Baru
                  </span>
                )
              ) : (
                !isSidebarCollapsed && (
                  <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-slate-300">
                    {redeems.length}
                  </span>
                )
              )}
            </button>

            <button
              onClick={() => setActiveTab('revenue')}
              title="Pendapatan & Export"
              className={`w-full rounded-xl text-xs font-black transition-all flex items-center cursor-pointer border ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } ${
                activeTab === 'revenue'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className={`w-4 h-4 ${activeTab === 'revenue' ? 'text-white' : 'text-slate-900'}`} />
                {!isSidebarCollapsed && <span>Pendapatan & Export</span>}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              title="Kelola Layanan (CMS)"
              className={`w-full rounded-xl text-xs font-black transition-all flex items-center cursor-pointer border ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } ${
                activeTab === 'services'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Edit3 className={`w-4 h-4 ${activeTab === 'services' ? 'text-white' : 'text-slate-900'}`} />
                {!isSidebarCollapsed && <span>Kelola Layanan (CMS)</span>}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              title="Testimoni & Rating"
              className={`w-full rounded-xl text-xs font-black transition-all flex items-center cursor-pointer border ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } ${
                activeTab === 'testimonials'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                {!isSidebarCollapsed && <span>Testimoni & Rating</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-black border border-amber-300">
                  {testimonialsList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('promotions')}
              title="Showcase Promosi (Trusted By)"
              className={`w-full rounded-xl text-xs font-black transition-all flex items-center cursor-pointer border ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } ${
                activeTab === 'promotions'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className={`w-4 h-4 shrink-0 ${activeTab === 'promotions' ? 'text-white' : 'text-slate-900'}`} />
                {!isSidebarCollapsed && <span>Showcase Promosi</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="bg-primary-100 text-primary-900 text-[10px] px-2 py-0.5 rounded-full font-black border border-primary-300">
                  {promotionsList.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Footer Desktop Admin Profile */}
        <div className={`border-t border-slate-300 bg-slate-50 ${isSidebarCollapsed ? 'p-2 space-y-2 text-center' : 'p-3 space-y-2'}`}>
          {!isSidebarCollapsed ? (
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
          ) : (
            <div className="w-10 h-10 mx-auto rounded-lg bg-slate-900 text-white font-black flex items-center justify-center text-xs shadow-xs" title="Administrator">
              AD
            </div>
          )}

          <button
            onClick={handleLogout}
            title="Keluar Sesi Admin"
            className={`w-full text-xs font-black text-slate-900 hover:text-black flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-300 ${
              isSidebarCollapsed ? 'p-2.5' : 'px-3 py-2'
            }`}
          >
            <LogOut className="w-4 h-4 text-slate-900" />
            {!isSidebarCollapsed && <span>Keluar Sesi</span>}
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTAINER (TAKES 100% FULL WIDTH ON MOBILE) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
        {/* TOP HEADER BAR */}
        <header className="bg-white border-b border-slate-300 px-3.5 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 flex items-center gap-1.5 font-bold shadow-xs cursor-pointer shrink-0"
              title="Buka Menu Admin"
            >
              <Menu className="w-5 h-5 text-slate-900" />
              <span className="text-xs font-black hidden sm:inline">Menu</span>
            </button>

            {/* Desktop Minimize/Maximize Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 text-xs font-black transition-colors cursor-pointer shrink-0"
              title={isSidebarCollapsed ? 'Perlebar Sidebar (Maximize)' : 'Perkecil Sidebar (Minimize)'}
            >
              {isSidebarCollapsed ? (
                <>
                  <PanelLeftOpen className="w-4 h-4 text-slate-900" />
                  <span>Perlebar Menu</span>
                </>
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4 text-slate-900" />
                  <span>Kecilkan Menu</span>
                </>
              )}
            </button>

            {/* Global Search Bar */}
            <div className="relative flex-1 max-w-xs sm:max-w-md">
              <Search className="w-4 h-4 text-slate-900 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari pesanan, member, layanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-black placeholder:text-slate-500 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Quick Actions & Realtime Status */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="hidden md:flex text-xs text-slate-900 items-center gap-2 font-black bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              Realtime (WIB)
            </span>

            <button
              onClick={() => {
                syncOrdersWithCloud();
                syncMembersWithCloud();
                syncChatsWithCloud();
              }}
              disabled={ordersLoading}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              title="Refresh Data Realtime"
            >
              <RefreshCw className={`w-4 h-4 text-slate-900 ${ordersLoading ? 'animate-spin' : ''}`} />
              <span className="text-xs font-black hidden sm:inline">Sync</span>
            </button>
          </div>
        </header>

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              {/* TOP KPI STAT CARDS GRID - ALL INTERACTIVE & CONNECTED */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                <div
                  onClick={() => setActiveTab('revenue')}
                  className="bg-white border border-slate-300 hover:border-slate-900 rounded-2xl p-4 sm:p-5 space-y-2 shadow-xs hover:shadow-md transition-all cursor-pointer group"
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
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-[calc(100vh-120px)] lg:h-[calc(100vh-140px)] overflow-hidden">
              {/* Sidebar Chat Sessions */}
              <div className={`w-full lg:w-80 bg-white border border-slate-300 rounded-2xl flex flex-col overflow-hidden shrink-0 shadow-xs ${selectedSessionId ? 'hidden lg:flex' : 'flex'}`}>
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
              <div className={`flex-1 bg-white border border-slate-300 rounded-2xl flex flex-col overflow-hidden shadow-xs ${!selectedSessionId ? 'hidden lg:flex' : 'flex'}`}>
                {selectedSession ? (
                  <>
                    {/* Session Header with Mobile Back Button */}
                    <div className="p-3.5 sm:p-4 border-b border-slate-300 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          onClick={() => setSelectedSessionId(null)}
                          className="lg:hidden p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                          title="Kembali ke Antrean"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="text-[11px] font-black">Antrean</span>
                        </button>
                        <div className="min-w-0">
                          <h2 className="font-black text-sm text-slate-900 truncate">{selectedSession.name}</h2>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-slate-900 mt-0.5 font-bold">
                            <span className="flex items-center gap-1 truncate">
                              <Mail className="w-3.5 h-3.5 text-slate-900 shrink-0" /> <span className="truncate">{selectedSession.email}</span>
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1 truncate">
                              <School className="w-3.5 h-3.5 text-slate-900 shrink-0" /> <span className="truncate">{selectedSession.university}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] bg-slate-200 text-slate-900 border border-slate-400 px-2 sm:px-2.5 py-1 rounded-full font-black shrink-0">
                        Active
                      </span>
                    </div>

                    {/* Messages Stream */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                      {selectedSession.messages.map((msg) => {
                        const isMedia = Boolean(msg.mediaUrl || (msg.mediaName && msg.isExpired));
                        const isExpired = isMedia && (msg.isExpired || (msg.createdAt ? (Date.now() - msg.createdAt > 24 * 60 * 60 * 1000) : false));

                        return (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed font-bold ${
                                msg.sender === 'admin'
                                  ? 'bg-slate-900 text-white rounded-tr-none shadow-xs'
                                  : 'bg-white text-slate-900 border border-slate-300 rounded-tl-none shadow-xs'
                              }`}
                            >
                              {/* Media Photo Section */}
                              {isMedia && (
                                <div className="mb-2">
                                  {isExpired ? (
                                    <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs flex items-center gap-2">
                                      <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                                      <div className="flex flex-col text-left">
                                        <span className="font-black text-[11px]">Foto Telah Kadaluarsa</span>
                                        <span className="text-[10px] font-semibold opacity-90 leading-tight">
                                          Melewati 1x24 jam demi efisiensi sistem. Silakan kirim ulang jika diperlukan.
                                        </span>
                                      </div>
                                    </div>
                                  ) : msg.mediaUrl ? (
                                    <div className="flex flex-col gap-1">
                                      <div
                                        onClick={() =>
                                          setAdminChatPreview({ url: msg.mediaUrl!, name: msg.mediaName })
                                        }
                                        className="relative group rounded-xl overflow-hidden cursor-pointer border border-slate-300 bg-black/5 max-h-48"
                                      >
                                        <img
                                          src={msg.mediaUrl}
                                          alt={msg.mediaName || 'Foto'}
                                          className="w-full h-auto object-cover max-h-48 group-hover:scale-105 transition-transform duration-200"
                                          loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-black backdrop-blur-2xs">
                                          <Eye className="w-4 h-4" />
                                          <span>Lihat Foto</span>
                                        </div>
                                      </div>
                                      {msg.mediaName && (
                                        <div className="flex items-center justify-between text-[10px] opacity-80 px-1 pt-0.5 font-medium">
                                          <span className="truncate max-w-[140px]">{msg.mediaName}</span>
                                          {msg.mediaSize && <span>{msg.mediaSize}</span>}
                                        </div>
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                              )}

                              {msg.text && (
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                              )}
                              <span
                                className={`block text-[9px] mt-1 text-right font-black ${
                                  msg.sender === 'admin' ? 'text-slate-300' : 'text-slate-500'
                                }`}
                              >
                                {formatChatDate(msg.createdAt || msg.timestamp)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Reply Input Box */}
                    <form onSubmit={handleSendAdminReply} className="p-3 border-t border-slate-300 bg-white flex gap-2 items-center">
                      <input
                        type="file"
                        ref={adminFileInputRef}
                        onChange={handleAdminSelectImage}
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isAdminChatUploading}
                        onClick={() => adminFileInputRef.current?.click()}
                        className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                        title="Kirim Foto Lampiran"
                      >
                        {isAdminChatUploading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                        ) : (
                          <ImagePlus className="w-4 h-4" />
                        )}
                      </button>

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
            <div className="bg-white border border-slate-300 rounded-2xl p-3.5 sm:p-6 space-y-3.5 sm:space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 border-b border-slate-300 pb-3 sm:pb-4">
                <div>
                  <h2 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
                    Daftar Pesanan & Pembayaran QRIS
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-600 font-bold mt-0.5">
                    Pantau bukti transfer screenshot QRIS, unduh file dokumen ter-upload, dan verifikasi status lunas.
                  </p>
                </div>

                <button
                  onClick={syncOrdersWithCloud}
                  disabled={ordersLoading}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-900 ${ordersLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh Pesanan</span>
                </button>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-8 sm:p-12 text-center text-slate-900 bg-slate-50 rounded-2xl border border-slate-300">
                  <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2.5 text-slate-900" />
                  <p className="font-black text-sm sm:text-base text-slate-900">Belum Ada Pesanan Masuk</p>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-1 font-bold">
                    Setiap pesanan yang dibuat oleh pelanggan melalui form kustom dan QRIS akan ditampilkan otomatis di sini.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {filteredOrders.map((order) => {
                    const isLunas = order.paymentStatus?.toLowerCase().includes('lunas');
                    const isCancel = order.paymentStatus?.toLowerCase().includes('batal');

                    return (
                      <div
                        key={order.id}
                        className="bg-slate-50/90 hover:bg-slate-50 border border-slate-300 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:border-slate-400 transition-colors space-y-2.5 sm:space-y-3 shadow-xs"
                      >
                        {/* Top Header of Card (Cleanly Separated Rows on Mobile) */}
                        <div className="border-b border-slate-200 pb-2.5 space-y-1.5">
                          {/* Row 1: Avatar, Customer Name, ID & Status Badge */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-[10px] shrink-0 shadow-2xs">
                                ORD
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h3 className="font-black text-xs sm:text-sm text-slate-900 truncate leading-tight">
                                    {order.customerName || 'Pelanggan'}
                                  </h3>
                                  <span className="text-[9px] sm:text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono font-black shrink-0">
                                    {order.id}
                                  </span>
                                </div>
                                <p className="text-[10px] sm:text-[11px] text-slate-600 font-semibold truncate mt-0.5">
                                  {order.customerEmail}
                                </p>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <span
                              className={`text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 text-center ${
                                isLunas
                                  ? 'bg-slate-900 text-white'
                                  : isCancel
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {order.paymentStatus || 'Menunggu'}
                            </span>
                          </div>

                          {/* Row 2: Date Calendar Timestamp */}
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-600 font-bold pl-10.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>{formatFullDateIndonesian(order.createdAt, order.id)}</span>
                          </div>
                        </div>

                        {/* Main Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          {/* Service Box */}
                          <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 space-y-1">
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Jasa Layanan
                            </p>
                            <p className="font-black text-xs sm:text-sm text-slate-900 leading-tight">
                              {order.serviceName}
                            </p>
                            <div className="flex items-center justify-between pt-0.5">
                              <span className="font-black text-xs sm:text-sm text-slate-900">{order.price}</span>
                              <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                {order.paymentMethod || 'QRIS'}
                              </span>
                            </div>
                          </div>

                          {/* Custom Form Fields Box */}
                          <div className="sm:col-span-2 bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 space-y-1">
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Detail Formulir Kustom
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] sm:text-[11px]">
                              {order.customFields && Object.keys(order.customFields).length > 0 ? (
                                Object.entries(order.customFields).map(([k, v]) => (
                                  <div key={k} className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 leading-tight">
                                    <span className="text-slate-500 block text-[8px] sm:text-[9px] font-black uppercase truncate">{k}</span>
                                    <span className="text-slate-900 font-bold text-[10px] sm:text-[11px] break-words line-clamp-2">{v}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-[10px] text-slate-400 italic">Tidak ada formulir khusus</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions Toolbar Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-slate-200">
                          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                            {/* Screenshot Proof Button */}
                            {order.proofImage && (
                              <button
                                onClick={() => setSelectedProofImage(order.proofImage || null)}
                                className="px-2 sm:px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-[10px] sm:text-xs font-black flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-900" />
                                <span>Bukti Bayar</span>
                              </button>
                            )}

                            {/* File Download Button */}
                            {(order.uploadedFileData || order.customFields?.['File Ter-upload']) && (
                              <button
                                onClick={() => handleDownloadFile(order)}
                                className="px-2 sm:px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white text-[10px] sm:text-xs font-black flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              >
                                <Download className="w-3.5 h-3.5 text-white" />
                                <span>Unduh Dokumen</span>
                              </button>
                            )}

                            {/* Expired Warning Badge */}
                            {isOrderFileExpired(order) && (
                              <span className="px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[9px] sm:text-[10px] font-bold flex items-center gap-1" title="File > 2 hari">
                                <Clock className="w-3 h-3 text-amber-700 shrink-0" />
                                <span>&gt; 2 Hari</span>
                              </span>
                            )}
                          </div>

                          {/* Status Toggle Buttons */}
                          <div className="flex items-center gap-1 sm:gap-1.5 ml-auto sm:ml-0">
                            <button
                              disabled={updatingOrderId === order.id}
                              onClick={() => handleUpdateOrderStatus(order.id, 'Dibatalkan')}
                              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black flex items-center gap-1 cursor-pointer transition-all border ${
                                isCancel
                                  ? 'bg-rose-100 text-rose-900 border-rose-300 ring-1 ring-rose-400'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                              } ${updatingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{isCancel ? '✕ Batal' : 'Batalkan'}</span>
                            </button>

                            <button
                              disabled={updatingOrderId === order.id}
                              onClick={() => handleUpdateOrderStatus(order.id, 'LUNAS (Terverifikasi Admin)')}
                              className={`px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-black flex items-center gap-1 cursor-pointer transition-all border shadow-2xs ${
                                isLunas
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-slate-900 hover:bg-black text-white border-transparent'
                              } ${updatingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-white" />
                              <span>{isLunas ? '✓ Lunas' : 'Verifikasi Lunas'}</span>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 pb-4">
                <div>
                  <h2 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-900" />
                    Daftar Member Terdaftar (Database Cloudflare D1)
                  </h2>
                  <p className="text-xs text-slate-900 mt-0.5 font-bold">
                    Total {filteredMembers.length} member terdaftar. Data terhubung langsung ke Cloudflare D1 secara realtime.
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

              {/* Members Table with 8 Columns */}
              <div className="overflow-x-auto border border-slate-300 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-900">
                  <thead className="bg-slate-100 text-slate-900 font-black uppercase tracking-wider text-[10px] border-b border-slate-300">
                    <tr>
                      <th className="p-3.5">Kode ID Member</th>
                      <th className="p-3.5">Nama Lengkap</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Kampus / Universitas</th>
                      <th className="p-3.5">Program Studi</th>
                      <th className="p-3.5 text-center">Total Redeem</th>
                      <th className="p-3.5 text-center">Disetujui</th>
                      <th className="p-3.5 text-center">Ditolak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {currentMembers.map((mbr, idx) => {
                      const mbrEmail = (mbr.email || '').toLowerCase().trim();
                      const stats = memberRedeemStats[mbrEmail] || { total: 0, approved: 0, rejected: 0, pending: 0, list: [] };

                      return (
                        <tr key={mbr.id || idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-mono text-slate-900 font-black">{mbr.id}</td>
                          <td className="p-3.5 font-black text-slate-900">{mbr.name}</td>
                          <td className="p-3.5 text-slate-900 font-bold">{mbr.email}</td>
                          <td className="p-3.5 text-slate-900 font-bold">{mbr.university || '-'}</td>
                          <td className="p-3.5 text-slate-900 font-bold">{mbr.prodi || '-'}</td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${
                                stats.total > 0
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-slate-100 text-slate-400 border-slate-200'
                              }`}>
                                {stats.total}
                              </span>
                              {stats.total > 0 && (
                                <button
                                  onClick={() => setSelectedMemberForRedeemDetail(mbr)}
                                  className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[11px] font-black flex items-center gap-1 cursor-pointer transition-colors"
                                  title="Lihat Detail Bukti Share"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Detail</span>
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5 text-center">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${
                              stats.approved > 0
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}>
                              {stats.approved}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${
                              stats.rejected > 0
                                ? 'bg-rose-100 text-rose-900 border-rose-300'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}>
                              {stats.rejected}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
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

          {/* TAB 4: KLAIM FREE TURNITIN 1X (SISTEM REWARD SHARE 3 HARI COOLDOWN) */}
          {activeTab === 'redeems' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                        <Gift className="w-5 h-5" />
                      </div>
                      <h2 className="font-black text-lg text-slate-900">
                        Kelola Klaim Free Turnitin 1x (Share Status WA / Story IG)
                      </h2>
                    </div>
                    <p className="text-xs text-slate-600 font-bold mt-1 max-w-3xl">
                      Syarat verifikasi: Bukti screenshot WA/IG wajib berstatus publik ke semua orang (tidak boleh private/custom). Cooldown member 3 hari 1x klaim. Member terbanyak per bulan mendapatkan reward 1x Cek AI Gratis!
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={syncRedeemsWithCloud}
                      disabled={redeemsLoading}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs font-black flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${redeemsLoading ? 'animate-spin' : ''}`} />
                      <span>{redeemsLoading ? 'Sinkron...' : 'Refresh Data'}</span>
                    </button>
                  </div>
                </div>

                {/* 3-Day Batch Quota Monitor Card */}
                <div className="mt-4 bg-slate-900 text-white rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">Status Kuota Batch 3 Hari (Rebutan 10 Slot):</span>
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          redeemBatchQuota.remainingQuota > 0 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {redeemBatchQuota.remainingQuota > 0 ? `${redeemBatchQuota.remainingQuota} / 10 Slot Tersedia` : 'Kuota Batch Penuh (0/10)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Maksimal 10 ACC per batch 3 hari. Ter-ACC Batch Ini: <strong className="text-amber-300">{redeemBatchQuota.claimedCount} / 10</strong>
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-48 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        redeemBatchQuota.remainingQuota === 0
                          ? 'bg-rose-500'
                          : redeemBatchQuota.remainingQuota <= 3
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (redeemBatchQuota.claimedCount / 10) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Top Metrics 4 Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-5">
                  <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 sm:p-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Total Pengajuan</p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{redeems.length}</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">Semua riwayat pengajuan</p>
                  </div>

                  <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-3 sm:p-4">
                    <p className="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Menunggu Verifikasi</span>
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-amber-900 mt-1">{pendingRedeemsCount}</p>
                    <p className="text-[10px] text-amber-700 font-bold mt-0.5">Perlu dicek admin</p>
                  </div>

                  <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-3 sm:p-4">
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Disetujui (ACC)</span>
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-emerald-900 mt-1">{approvedRedeemsCount}</p>
                    <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Voucher aktif diterbitkan</p>
                  </div>

                  <div className="bg-linear-to-br from-purple-50 to-indigo-50 border border-indigo-200 rounded-xl p-3 sm:p-4">
                    <p className="text-[10px] font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Top Sharer Bulan Ini</span>
                    </p>
                    {topSharerMember && topSharerMember.member ? (
                      <div className="mt-1">
                        <p className="text-xs sm:text-sm font-black text-indigo-950 truncate">
                          {topSharerMember.member.name || 'Member'}
                        </p>
                        <p className="text-[10px] font-black text-indigo-700 mt-0.5">
                          {topSharerMember.count}x Share Disetujui • Gratis 1x Cek AI
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-slate-500 mt-1">Belum ada data share disetujui</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sub-Tab Navigation Bar */}
              <div className="bg-white border border-slate-300 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRedeemSubTab('members_table')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        redeemSubTab === 'members_table'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      Daftar Member & Statistik ({members.length} Database)
                    </button>
                    <button
                      onClick={() => setRedeemSubTab('submissions')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 ${
                        redeemSubTab === 'submissions'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      <span>Antrean Pengajuan</span>
                      {pendingRedeemsCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full font-black bg-amber-400 text-slate-950">
                          {pendingRedeemsCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama, email, voucher..."
                      value={redeemSearchTerm}
                      onChange={(e) => setRedeemSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-slate-900"
                    />
                    {redeemSearchTerm && (
                      <button
                        onClick={() => setRedeemSearchTerm('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* VIEW 1: 14 MEMBER DATABASE TABLE (8 COLUMNS) */}
                {redeemSubTab === 'members_table' && (
                  <div className="space-y-4">
                    <div className="overflow-x-auto border border-slate-300 rounded-xl">
                      <table className="w-full text-left text-xs text-slate-900">
                        <thead className="bg-slate-100 text-slate-900 font-black uppercase tracking-wider text-[10px] border-b border-slate-300">
                          <tr>
                            <th className="p-3.5">Kode ID Member</th>
                            <th className="p-3.5">Nama Lengkap</th>
                            <th className="p-3.5">Email</th>
                            <th className="p-3.5">Kampus / Universitas</th>
                            <th className="p-3.5">Program Studi</th>
                            <th className="p-3.5 text-center">Total Redeem</th>
                            <th className="p-3.5 text-center">Disetujui</th>
                            <th className="p-3.5 text-center">Ditolak</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {members.filter((m) => {
                            if (!redeemSearchTerm) return true;
                            const q = redeemSearchTerm.toLowerCase();
                            return (
                              (m.name || '').toLowerCase().includes(q) ||
                              (m.email || '').toLowerCase().includes(q) ||
                              (m.id || '').toLowerCase().includes(q) ||
                              (m.university || '').toLowerCase().includes(q)
                            );
                          }).map((mbr, idx) => {
                            const mbrEmail = (mbr.email || '').toLowerCase().trim();
                            const stats = memberRedeemStats[mbrEmail] || { total: 0, approved: 0, rejected: 0, pending: 0, list: [] };

                            return (
                              <tr key={mbr.id || idx} className="hover:bg-slate-50 transition-colors">
                                <td className="p-3.5 font-mono text-slate-900 font-black">{mbr.id}</td>
                                <td className="p-3.5 font-black text-slate-900">{mbr.name}</td>
                                <td className="p-3.5 text-slate-900 font-bold">{mbr.email}</td>
                                <td className="p-3.5 text-slate-900 font-bold">{mbr.university || '-'}</td>
                                <td className="p-3.5 text-slate-900 font-bold">{mbr.prodi || '-'}</td>
                                <td className="p-3.5 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${
                                      stats.total > 0
                                        ? 'bg-slate-900 text-white border-slate-900'
                                        : 'bg-slate-100 text-slate-400 border-slate-200'
                                    }`}>
                                      {stats.total}
                                    </span>
                                    {stats.total > 0 && (
                                      <button
                                        onClick={() => setSelectedMemberForRedeemDetail(mbr)}
                                        className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[11px] font-black flex items-center gap-1 cursor-pointer transition-colors"
                                        title="Lihat Detail Bukti Pengajuan"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Detail</span>
                                      </button>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3.5 text-center">
                                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${
                                    stats.approved > 0
                                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                      : 'bg-slate-100 text-slate-400 border-slate-200'
                                  }`}>
                                    {stats.approved}
                                  </span>
                                </td>
                                <td className="p-3.5 text-center">
                                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${
                                    stats.rejected > 0
                                      ? 'bg-rose-100 text-rose-900 border-rose-300'
                                      : 'bg-slate-100 text-slate-400 border-slate-200'
                                  }`}>
                                    {stats.rejected}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* VIEW 2: ALL SUBMISSIONS STREAM / TABLE */}
                {redeemSubTab === 'submissions' && (
                  <div className="space-y-4">
                    {/* Filter Status Pills */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-slate-500">Status:</span>
                      {(['all', 'MENUNGGU_VERIFIKASI', 'DISETUJUI', 'DITOLAK'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setRedeemStatusFilter(st)}
                          className={`px-3 py-1 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                            redeemStatusFilter === st
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                          }`}
                        >
                          {st === 'all' && `Semua (${redeems.length})`}
                          {st === 'MENUNGGU_VERIFIKASI' && `Menunggu ACC (${pendingRedeemsCount})`}
                          {st === 'DISETUJUI' && `Disetujui (${approvedRedeemsCount})`}
                          {st === 'DITOLAK' && `Ditolak (${rejectedRedeemsCount})`}
                        </button>
                      ))}
                    </div>

                    {filteredSubmissions.length === 0 ? (
                      <div className="p-8 text-center text-slate-600 bg-slate-50 rounded-xl border border-slate-300 font-bold text-xs">
                        Tidak ada pengajuan redeem yang sesuai filter.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredSubmissions.map((r) => {
                          const isPending = r.status === 'MENUNGGU_VERIFIKASI';
                          const isApproved = r.status === 'DISETUJUI';
                          const isRejected = r.status === 'DITOLAK';

                          return (
                            <div
                              key={r.id}
                              className="bg-slate-50 border border-slate-300 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-400 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                {/* Thumbnail */}
                                {r.proofImage ? (
                                  <button
                                    onClick={() => setRedeemZoomImage(r.proofImage)}
                                    className="w-16 h-20 rounded-lg overflow-hidden border border-slate-300 bg-slate-200 shrink-0 relative group cursor-pointer shadow-xs"
                                    title="Klik untuk memperbesar screenshot bukti"
                                  >
                                    <img
                                      src={r.proofImage}
                                      alt="Bukti Share"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                      <Eye className="w-4 h-4" />
                                    </div>
                                  </button>
                                ) : (
                                  <div className="w-16 h-20 rounded-lg border border-dashed border-slate-300 bg-slate-100 flex flex-col items-center justify-center text-center p-1 shrink-0 text-slate-400">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 mb-0.5" />
                                    <span className="text-[8px] font-bold text-slate-600 leading-tight">Foto Dihapus</span>
                                    <span className="text-[7px] text-slate-400">(Hemat DB)</span>
                                  </div>
                                )}

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-black text-sm text-slate-900">{r.memberName}</h4>
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 border border-slate-300">
                                      {r.platform}
                                    </span>
                                    {/* Status Badge */}
                                    <span
                                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                        isPending
                                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                          : isApproved
                                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                          : 'bg-rose-100 text-rose-900 border border-rose-300'
                                      }`}
                                    >
                                      {isPending ? '⏳ Menunggu Verifikasi' : isApproved ? '✓ Disetujui' : '✕ Ditolak'}
                                    </span>
                                  </div>

                                  <p className="text-xs text-slate-600 font-bold">
                                    {r.memberEmail} {r.memberUniversity ? `• ${r.memberUniversity}` : ''} {r.memberProdi ? `(${r.memberProdi})` : ''}
                                  </p>

                                  <p className="text-[11px] text-slate-500 font-semibold">
                                    Diajukan: {new Date(r.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                  </p>

                                  {isApproved && r.voucherCode && (
                                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 text-xs font-black text-emerald-950 mt-1">
                                      <span>Kode Voucher:</span>
                                      <code className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                                        {r.voucherCode}
                                      </code>
                                    </div>
                                  )}

                                  {isRejected && r.adminNote && (
                                    <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 p-2 rounded-lg font-bold mt-1">
                                      Alasan Penolakan: {r.adminNote}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                {isPending && (
                                  <>
                                    <button
                                      disabled={actionLoadingId === r.id}
                                      onClick={() => handleOpenRejectModal(r.id)}
                                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 text-xs font-black flex items-center gap-1 cursor-pointer transition-colors"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      <span>Tolak</span>
                                    </button>

                                    <button
                                      disabled={actionLoadingId === r.id}
                                      onClick={() => handleApproveRedeem(r.id)}
                                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                                    >
                                      {actionLoadingId === r.id ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                      )}
                                      <span>Setujui (ACC)</span>
                                    </button>
                                  </>
                                )}

                                <button
                                  onClick={() => handleDeleteRedeem(r.id)}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                                  title="Hapus riwayat pengajuan"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: REVENUE & EXCEL REPORT */}
          {activeTab === 'revenue' && (
            <div className="bg-white border border-slate-300 rounded-2xl p-3.5 sm:p-6 space-y-3.5 sm:space-y-5 shadow-xs">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 border-b border-slate-300 pb-3 sm:pb-4">
                <div>
                  <h2 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
                    Dasbor Pendapatan & Export Excel
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-600 font-bold mt-0.5">
                    Pilih tanggal pada kalender untuk melihat pendapatan & riwayat orderan harian realtime.
                  </p>
                </div>

                <button
                  onClick={handleExportDailyExcel}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
                >
                  <FileSpreadsheet className="w-4 h-4 text-white" />
                  <span>Export Laporan Excel (.xlsx)</span>
                </button>
              </div>

              {/* 3 Top KPI Stat Cards - Sleek Compact Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                {/* Total Pendapatan */}
                <div className="bg-slate-50 border border-slate-300 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-1 shadow-2xs">
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider truncate">
                    Pendapatan ({selectedRevenueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })})
                  </p>
                  <p className="text-base sm:text-2xl font-black text-slate-900 truncate">
                    Rp {revenueForSelectedDate.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 font-semibold truncate">Status Lunas</p>
                </div>

                {/* Total Pesanan */}
                <div className="bg-slate-50 border border-slate-300 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-1 shadow-2xs">
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider truncate">
                    Pesanan ({selectedRevenueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })})
                  </p>
                  <p className="text-base sm:text-2xl font-black text-slate-900 truncate">
                    {ordersForSelectedDate.length} Order
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 font-semibold truncate">
                    {lunasOrdersSelectedDate.length} Terverifikasi
                  </p>
                </div>

                {/* Waktu Realtime */}
                <div className="col-span-2 sm:col-span-1 bg-slate-50 border border-slate-300 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-1 shadow-2xs">
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider truncate">
                    Waktu Realtime
                  </p>
                  <p className="text-xs sm:text-base font-black text-slate-900 capitalize truncate">
                    {selectedRevenueDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 font-semibold truncate">Asia/Jakarta (WIB)</p>
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
              <div className="border border-slate-300 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xs">
                <div className="p-3 sm:p-4 bg-slate-100 border-b border-slate-300 flex items-center justify-between font-black text-xs text-slate-900">
                  <span className="truncate">
                    Rincian Transaksi ({selectedRevenueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-600 font-bold bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0 ml-2">
                    {ordersForSelectedDate.length} Pesanan
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] sm:text-xs text-slate-900">
                    <thead className="bg-white text-slate-900 font-black text-[9px] sm:text-[10px] uppercase border-b border-slate-300">
                      <tr>
                        <th className="p-2.5 sm:p-3.5">ID Order</th>
                        <th className="p-2.5 sm:p-3.5">Waktu (WIB)</th>
                        <th className="p-2.5 sm:p-3.5">Pelanggan</th>
                        <th className="p-2.5 sm:p-3.5">Layanan</th>
                        <th className="p-2.5 sm:p-3.5">Harga</th>
                        <th className="p-2.5 sm:p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {ordersForSelectedDate.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 sm:p-8 text-center text-slate-500 font-bold">
                            Tidak ada pesanan masuk pada tanggal ini.
                          </td>
                        </tr>
                      ) : (
                        ordersForSelectedDate.map((o) => (
                          <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-2.5 sm:p-3.5 font-mono text-slate-900 font-black">{o.id}</td>
                            <td className="p-2.5 sm:p-3.5 text-slate-900 font-extrabold whitespace-nowrap">
                              {formatFullDateIndonesian(o.createdAt, o.id)}
                            </td>
                            <td className="p-2.5 sm:p-3.5">
                              <p className="font-black text-slate-900 truncate max-w-[120px] sm:max-w-none">{o.customerName}</p>
                              <p className="text-[10px] text-slate-500 truncate max-w-[120px] sm:max-w-none">{o.customerEmail}</p>
                            </td>
                            <td className="p-2.5 sm:p-3.5 font-bold text-slate-900">{o.serviceName}</td>
                            <td className="p-2.5 sm:p-3.5 font-black text-slate-900">{o.price}</td>
                            <td className="p-2.5 sm:p-3.5">
                              <span
                                className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                                  o.paymentStatus?.toLowerCase().includes('lunas')
                                    ? 'bg-slate-900 text-white'
                                    : o.paymentStatus?.toLowerCase().includes('batal')
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-900'
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
            </div>
          )}

          {/* TAB 5: SERVICE CMS (FULL 100% CRUD REALTIME SUPABASE) */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              {/* Header & Actions */}
              <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-300 pb-4">
                  <div>
                    <h2 className="font-black text-lg text-slate-900 flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-slate-900" />
                      Kelola Layanan & Harga (CMS Database Realtime)
                    </h2>
                    <p className="text-xs text-slate-700 mt-1 font-bold">
                      Full CRUD: Tambah, edit, cari, dan hapus layanan resmi yang tersambung 100% langsung ke database Supabase.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={syncServicesWithCloud}
                      disabled={servicesLoading}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Sinkronkan dengan Database Supabase"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${servicesLoading ? 'animate-spin' : ''}`} />
                      <span>{servicesLoading ? 'Sinkron...' : 'Sinkron Database'}</span>
                    </button>

                    <button
                      onClick={() => setIsCreateServiceOpen(true)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Layanan Baru</span>
                    </button>
                  </div>
                </div>

                {saveSuccessMsg && (
                  <div className="p-3 bg-slate-900 text-white rounded-xl text-xs font-black flex items-center justify-between animate-fade-in shadow-xs">
                    <span>✓ {saveSuccessMsg}</span>
                    <button onClick={() => setSaveSuccessMsg('')} className="text-white hover:text-slate-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama, harga, deskripsi..."
                      value={serviceSearchTerm}
                      onChange={(e) => setServiceSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-slate-900 transition-colors"
                    />
                    {serviceSearchTerm && (
                      <button
                        onClick={() => setServiceSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {[
                      { key: 'all', label: `Semua (${cmsServices.length})` },
                      { key: 'turnitin', label: 'Cek Turnitin & AI' },
                      { key: 'parafrase', label: 'Parafrase' },
                      { key: 'joki-tugas', label: 'Joki Tugas' },
                      { key: 'joki-skripsi', label: 'Joki Skripsi' },
                      { key: 'uji-data', label: 'Uji & Olah Data' },
                      { key: 'tugas-sekolah', label: 'Tugas Sekolah' },
                      { key: 'laporan-akademik', label: 'Laporan Akademik' },
                      { key: 'unlock', label: 'Unlock Dokumen' },
                      { key: 'desain', label: 'Desain Grafis & PPT' },
                      { key: 'uiux', label: 'UI/UX Design' },
                      { key: 'medsos', label: 'Media Sosial' },
                      { key: 'subscribe-ai', label: 'Subscribe AI' },
                      { key: 'premium', label: 'Apps & Streaming Premium' },
                      { key: 'umum', label: 'Umum' },
                    ].map((cat) => (
                      <button
                        key={cat.key}
                        onClick={() => setServiceCategoryFilter(cat.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition-colors cursor-pointer ${
                          serviceCategoryFilter === cat.key
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] font-black text-slate-600 flex items-center justify-between pt-1">
                  <span>Menampilkan {filteredCmsServices.length} dari total {cmsServices.length} layanan & produk di database Supabase</span>
                  {serviceCategoryFilter !== 'all' && (
                    <button
                      onClick={() => setServiceCategoryFilter('all')}
                      className="text-slate-900 underline hover:text-black font-black"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCmsServices.length === 0 ? (
                  <div className="col-span-full bg-white border border-slate-300 rounded-2xl p-12 text-center space-y-3">
                    <p className="text-sm font-black text-slate-700">Tidak ada layanan yang sesuai dengan pencarian atau filter.</p>
                    <button
                      onClick={() => {
                        setServiceSearchTerm('');
                        setServiceCategoryFilter('all');
                      }}
                      className="px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-black"
                    >
                      Reset Pencarian
                    </button>
                  </div>
                ) : (
                  filteredCmsServices.map((srv) => {
                    const isEditing = editingServiceId === srv.id;

                    return (
                      <div
                        key={srv.id}
                        className="bg-white border border-slate-300 rounded-2xl p-5 space-y-3 relative group hover:border-slate-400 transition-colors shadow-xs"
                      >
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-black text-slate-900 mb-1">Kategori</label>
                                <select
                                  value={editForm.category || srv.category || 'umum'}
                                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                                >
                                  <option value="turnitin">Cek Turnitin & AI</option>
                                  <option value="parafrase">Parafrase</option>
                                  <option value="joki-tugas">Joki Tugas Kuliah</option>
                                  <option value="joki-skripsi">Joki Skripsi</option>
                                  <option value="uji-data">Uji & Olah Data (SPSS/PLS/dll)</option>
                                  <option value="tugas-sekolah">Tugas Sekolah (SMP/SMA)</option>
                                  <option value="laporan-akademik">Laporan Akademik / Magang</option>
                                  <option value="unlock">Unlock Dokumen</option>
                                  <option value="desain">Desain Grafis & PPT</option>
                                  <option value="uiux">UI/UX Design</option>
                                  <option value="medsos">Media Sosial</option>
                                  <option value="subscribe-ai">Subscribe AI</option>
                                  <option value="premium">Apps & Streaming Premium</option>
                                  <option value="umum">Umum</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-black text-slate-900 mb-1">Badge Promosi (Opsional)</label>
                                <input
                                  type="text"
                                  placeholder="POPULER / BEST SELLER / PROMO"
                                  value={editForm.badge !== undefined ? editForm.badge || '' : srv.badge || ''}
                                  onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-black text-slate-900 mb-1">Nama Layanan</label>
                              <input
                                type="text"
                                value={editForm.name !== undefined ? editForm.name : srv.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-black"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-black text-slate-900 mb-1">Harga Layanan</label>
                              <input
                                type="text"
                                value={editForm.price !== undefined ? editForm.price : srv.price}
                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-black"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-black text-slate-900 mb-1">Deskripsi Singkat</label>
                              <textarea
                                rows={2}
                                value={editForm.description !== undefined ? editForm.description : srv.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold"
                              />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                              <button
                                onClick={() => setEditingServiceId(null)}
                                className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-black hover:bg-slate-200 border border-slate-300"
                              >
                                Batal
                              </button>
                              <button
                                type="button"
                                disabled={savingServiceId === srv.id}
                                onClick={() => handleSaveCmsService(srv.id)}
                                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                              >
                                <Save className={`w-3.5 h-3.5 ${savingServiceId === srv.id ? 'animate-spin' : ''}`} />
                                <span>{savingServiceId === srv.id ? 'Menyimpan...' : 'Simpan ke Database'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-mono text-slate-900 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded font-black uppercase">
                                    {srv.category}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-500 font-bold">
                                    #{srv.id}
                                  </span>
                                </div>
                                <h3 className="font-black text-base text-slate-900">{srv.name}</h3>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingServiceId(srv.id);
                                    setEditForm({
                                      category: srv.category,
                                      name: srv.name,
                                      price: srv.price,
                                      description: srv.description,
                                      badge: srv.badge,
                                    });
                                  }}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition-colors cursor-pointer shadow-xs"
                                  title="Edit Layanan"
                                >
                                  <Edit3 className="w-4 h-4 text-slate-900" />
                                </button>
                                <button
                                  onClick={() => handleDeleteService(srv.id, srv.name)}
                                  disabled={deletingServiceId === srv.id}
                                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer shadow-xs"
                                  title="Hapus Layanan dari Database"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-slate-700 leading-relaxed font-bold">{srv.description}</p>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
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
                  })
                )}
              </div>

              {/* CREATE SERVICE MODAL */}
              {isCreateServiceOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white border border-slate-300 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-in">
                    <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                      <div className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-slate-900" />
                        <h3 className="font-black text-base text-slate-900">Tambah Layanan Baru ke Database</h3>
                      </div>
                      <button
                        onClick={() => setIsCreateServiceOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateService} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-black text-slate-900 mb-1">
                            Kategori <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={newService.category || 'turnitin'}
                            onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:bg-white"
                          >
                            <option value="turnitin">Cek Turnitin & AI</option>
                            <option value="parafrase">Parafrase</option>
                            <option value="joki-tugas">Joki Tugas Kuliah</option>
                            <option value="joki-skripsi">Joki Skripsi</option>
                            <option value="uji-data">Uji & Olah Data (SPSS/PLS/dll)</option>
                            <option value="tugas-sekolah">Tugas Sekolah (SMP/SMA)</option>
                            <option value="laporan-akademik">Laporan Akademik / Magang</option>
                            <option value="unlock">Unlock Dokumen</option>
                            <option value="desain">Desain Grafis & PPT</option>
                            <option value="uiux">UI/UX Design</option>
                            <option value="medsos">Media Sosial</option>
                            <option value="subscribe-ai">Subscribe AI</option>
                            <option value="premium">Apps & Streaming Premium</option>
                            <option value="umum">Umum</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-900 mb-1">
                            Badge Promosi (Opsional)
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: POPULER / BEST SELLER"
                            value={newService.badge || ''}
                            onChange={(e) => setNewService({ ...newService, badge: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-900 mb-1">
                          Nama Layanan <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Cek Turnitin No Repository Instant"
                          value={newService.name || ''}
                          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-black focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-900 mb-1">
                          Harga Layanan <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Rp 8.000 atau Rp 5.000 / Hal atau Chat Admin"
                          value={newService.price || ''}
                          onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-black focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-900 mb-1">
                          Deskripsi Singkat Layanan
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Jelaskan detail layanan atau keunggulan pengerjaan..."
                          value={newService.description || ''}
                          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold focus:bg-white"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setIsCreateServiceOpen(false)}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black border border-slate-300 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save className="w-4 h-4" />
                          <span>Simpan ke Database</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: TESTIMONIALS MODERATION */}
          {activeTab === 'testimonials' && (() => {
            const filtered = testimonialsList.filter((t: any) => {
              if (!testiSearchQuery.trim()) return true;
              const q = testiSearchQuery.toLowerCase().trim();
              return (
                (t.name || '').toLowerCase().includes(q) ||
                (t.university || '').toLowerCase().includes(q) ||
                (t.prodi || '').toLowerCase().includes(q) ||
                (t.serviceName || '').toLowerCase().includes(q) ||
                (t.comment || '').toLowerCase().includes(q)
              );
            });

            const perPage = 15;
            const totalPages = Math.ceil(filtered.length / perPage) || 1;
            const startIdx = (testiCurrentPage - 1) * perPage;
            const paginated = filtered.slice(startIdx, startIdx + perPage);

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-300 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                      Kelola Ulasan Testimoni & Rating Member
                    </h2>
                    <p className="text-xs text-slate-900 font-bold mt-1">
                      Semua ulasan & rating tersimpan di database Supabase Cloud ({testimonialsList.length} total ulasan)
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={testiSearchQuery}
                        onChange={(e) => {
                          setTestiSearchQuery(e.target.value);
                          setTestiCurrentPage(1);
                        }}
                        placeholder="Cari nama, kampus, isi ulasan..."
                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <span className="bg-slate-900 text-white text-xs font-black px-3.5 py-1.5 rounded-xl">
                      {filtered.length} Ulasan
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
                  {paginated.length === 0 ? (
                    <div className="col-span-full bg-white border border-slate-300 rounded-2xl p-12 text-center text-slate-900 font-black">
                      {testimonialsList.length === 0
                        ? 'Belum ada testimoni dari member.'
                        : 'Tidak ada ulasan yang cocok dengan pencarian.'}
                    </div>
                  ) : (
                    paginated.map((testi: any) => {
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
                          className="bg-white border border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-400 transition-colors"
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

                {/* Admin Testimonials Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-slate-300">
                    <p className="text-xs font-bold text-slate-900">
                      Halaman {testiCurrentPage} dari {totalPages} ({filtered.length} ulasan)
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTestiCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={testiCurrentPage === 1}
                        className="px-3 py-1.5 bg-white border border-slate-300 text-slate-900 font-bold text-xs rounded-xl disabled:opacity-40 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => setTestiCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={testiCurrentPage === totalPages}
                        className="px-3 py-1.5 bg-white border border-slate-300 text-slate-900 font-bold text-xs rounded-xl disabled:opacity-40 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 8: SHOWCASE PROMOSI (TRUSTED BY) CMS */}
          {activeTab === 'promotions' && (() => {
            const filtered = promotionsList.filter((item: any) => {
              // 1. Platform filter
              if (promotionsPlatformFilter !== 'all' && item.platform !== promotionsPlatformFilter) {
                return false;
              }
              // 2. Search query filter
              if (promotionsSearchQuery.trim()) {
                const q = promotionsSearchQuery.toLowerCase().trim();
                const matchName = (item.name || '').toLowerCase().includes(q);
                const matchHandle = (item.handle || '').toLowerCase().includes(q);
                const matchTitle = (item.promotionTitle || '').toLowerCase().includes(q);
                const matchRole = (item.universityOrRole || '').toLowerCase().includes(q);
                const matchCaption = (item.caption || '').toLowerCase().includes(q);
                if (!matchName && !matchHandle && !matchTitle && !matchRole && !matchCaption) return false;
              }
              return true;
            });

            return (
              <div className="space-y-6">
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-300 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary-900" />
                      Kelola Showcase Bukti Promosi (Trusted By)
                    </h2>
                    <p className="text-xs text-slate-600 font-bold mt-1">
                      Data tersimpan di Cloudflare D1 Database & tampil realtime di halaman <Link href="/trusted-by" target="_blank" className="text-primary-800 underline font-black">/trusted-by</Link>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingPromotion({
                          targetGroup: promotionsGroup,
                          name: '',
                          handle: '@',
                          platform: 'instagram',
                          platformUrl: '',
                          avatarUrl: '',
                          followers: '',
                          following: '',
                          universityOrRole: '',
                          verified: false,
                          category: '',
                          promotionTitle: '',
                          caption: '',
                          proofMediaUrl: '',
                          proofMediaType: 'image',
                          highlightBadge: 'Official Story Proof',
                          isApproved: true,
                        });
                        setIsPromotionModalOpen(true);
                      }}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Data Promosi</span>
                    </button>

                    <button
                      onClick={fetchAdminPromotions}
                      disabled={promotionsLoading}
                      className="p-2 bg-white border border-slate-300 text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      title="Refresh Data Promosi"
                    >
                      <RefreshCw className={`w-4 h-4 text-slate-900 ${promotionsLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Sub Category Switcher: Influencer vs Public */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-300 shadow-xs">
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl max-w-md w-full">
                    <button
                      onClick={() => {
                        setPromotionsGroup('influencer');
                        setPromotionsPlatformFilter('all');
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        promotionsGroup === 'influencer'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Influencer & Creator</span>
                    </button>
                    <button
                      onClick={() => {
                        setPromotionsGroup('public');
                        setPromotionsPlatformFilter('all');
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        promotionsGroup === 'public'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Publik & Member</span>
                    </button>
                  </div>

                  {/* Search & Platform Filter */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full sm:w-56">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={promotionsSearchQuery}
                        onChange={(e) => setPromotionsSearchQuery(e.target.value)}
                        placeholder="Cari nama, handle, judul..."
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      {['all', 'instagram', 'tiktok', 'facebook'].map((plat) => (
                        <button
                          key={plat}
                          onClick={() => setPromotionsPlatformFilter(plat)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all cursor-pointer border ${
                            promotionsPlatformFilter === plat
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {plat === 'all' ? 'Semua' : plat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cards List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {promotionsLoading ? (
                    <div className="col-span-full bg-white border border-slate-300 rounded-2xl p-12 text-center text-slate-500 font-bold space-y-2">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-slate-700" />
                      <p>Memuat data promosi dari Cloudflare D1...</p>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="col-span-full bg-white border border-slate-300 rounded-2xl p-12 text-center space-y-3">
                      <Award className="w-10 h-10 text-slate-400 mx-auto" />
                      <p className="text-slate-900 font-black text-sm">
                        Belum ada data promosi di kategori {promotionsGroup === 'influencer' ? 'Influencer & Creator' : 'Publik & Member'}.
                      </p>
                      <button
                        onClick={() => {
                          setEditingPromotion({
                            targetGroup: promotionsGroup,
                            name: '',
                            handle: '@',
                            platform: 'instagram',
                            platformUrl: '',
                            avatarUrl: '',
                            followers: '',
                            following: '',
                            universityOrRole: '',
                            verified: false,
                            category: '',
                            promotionTitle: '',
                            caption: '',
                            proofMediaUrl: '',
                            proofMediaType: 'image',
                            highlightBadge: 'Official Story Proof',
                            isApproved: true,
                          });
                          setIsPromotionModalOpen(true);
                        }}
                        className="px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-black transition-colors"
                      >
                        + Tambah Data Pertama
                      </button>
                    </div>
                  ) : (
                    filtered.map((item: any) => (
                      <div
                        key={item.id}
                        className="bg-white border border-slate-300 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden"
                      >
                        {/* Top Highlight Badge */}
                        {item.highlightBadge && (
                          <div className="absolute top-0 right-0 bg-slate-900 text-white text-[9px] font-black px-2.5 py-0.5 rounded-bl-xl shadow-xs">
                            {item.highlightBadge}
                          </div>
                        )}

                        <div className="space-y-3">
                          {/* Profile Header */}
                          <div className="flex items-center gap-3 pt-1">
                            <div className="w-12 h-12 rounded-full bg-slate-900 p-0.5 shrink-0 overflow-hidden flex items-center justify-center text-white font-black text-xs">
                              {item.avatarUrl ? (
                                <img
                                  src={item.avatarUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded-full"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span>{item.name?.charAt(0) || 'P'}</span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1 pr-12">
                              <div className="flex items-center gap-1">
                                <h4 className="font-black text-sm text-slate-900 truncate">{item.name}</h4>
                                {item.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                              </div>
                              <p className="text-xs text-primary-800 font-bold flex items-center gap-1 mt-0.5">
                                <span className="capitalize font-black">[{item.platform}]</span>
                                <span className="truncate">{item.handle}</span>
                              </p>
                              {(item.followers || item.following) && (
                                <p className="text-[10px] text-slate-600 font-extrabold mt-0.5">
                                  {item.followers && `${item.followers} pengikut`}
                                  {item.followers && item.following && ' • '}
                                  {item.following && `${item.following} mengikuti`}
                                </p>
                              )}
                              {item.universityOrRole && (
                                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                  {item.universityOrRole}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Promotion Details */}
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1">
                            <p className="text-xs font-black text-slate-900 line-clamp-2">
                              {item.promotionTitle}
                            </p>
                            {item.caption && (
                              <p className="text-[11px] text-slate-600 italic line-clamp-2 leading-relaxed">
                                &ldquo;{item.caption}&rdquo;
                              </p>
                            )}
                          </div>

                          {/* Proof Media Preview */}
                          {item.proofMediaUrl && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Bukti Foto / Story:</span>
                              <div
                                onClick={() => setPromotionPreviewZoom(item.proofMediaUrl)}
                                className="w-full h-32 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative group cursor-pointer"
                                title="Klik untuk perbesar foto bukti"
                              >
                                <img
                                  src={item.proofMediaUrl}
                                  alt="Bukti Promosi"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span>Lihat Penuh</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-slate-400">
                            {item.promotedDate || 'Aktif'}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {item.platformUrl && (
                              <a
                                href={item.platformUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                title="Buka Link Profil Medsos"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => {
                                setEditingPromotion({ ...item, targetGroup: item.targetGroup || promotionsGroup });
                                setIsPromotionModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-xs font-black transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeletePromotion(item.id)}
                              disabled={deletingPromotionId === item.id}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Promosi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}
        </main>
      </div>

      {/* MODAL FORM CREATE / EDIT PROMOTION */}
      <AnimatePresence>
        {isPromotionModalOpen && editingPromotion && (
          <div
            className="fixed inset-0 z-100 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            onClick={() => setIsPromotionModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-slate-300 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl my-auto"
            >
              {/* Modal Header */}
              <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-sm sm:text-base font-black">
                      {editingPromotion.id ? 'Edit Data Showcase Promosi' : 'Tambah Bukti Promosi Baru'}
                    </h3>
                    <p className="text-[10px] text-slate-300">
                      Tersimpan langsung ke Cloudflare D1 Database
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPromotionModalOpen(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSavePromotion} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
                {/* Target Group Selector */}
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Kategori Showcase
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingPromotion((prev: any) => ({ ...prev, targetGroup: 'influencer' }))}
                      className={`py-2 px-3 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                        editingPromotion.targetGroup === 'influencer'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Influencer & Content Creator
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingPromotion((prev: any) => ({ ...prev, targetGroup: 'public' }))}
                      className={`py-2 px-3 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                        editingPromotion.targetGroup === 'public'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Publik & Member / Komunitas
                    </button>
                  </div>
                </div>

                {/* Name & Handle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Nama Akun / Creator <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPromotion.name || ''}
                      onChange={(e) => setEditingPromotion((prev: any) => ({ ...prev, name: e.target.value }))}
                      placeholder="Contoh: 파자르 (Fajar)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Handle / Username Medsos <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPromotion.handle || ''}
                      onChange={(e) => setEditingPromotion((prev: any) => ({ ...prev, handle: e.target.value }))}
                      placeholder="Contoh: @fajaransh_"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                {/* Platform & Platform URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Platform Medsos
                    </label>
                    <select
                      value={editingPromotion.platform || 'instagram'}
                      onChange={(e) => setEditingPromotion((prev: any) => ({ ...prev, platform: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="facebook">Facebook</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Link URL Profil (Opsional)
                    </label>
                    <input
                      type="url"
                      value={editingPromotion.platformUrl || ''}
                      onChange={(e) => setEditingPromotion((prev: any) => ({ ...prev, platformUrl: e.target.value }))}
                      placeholder="https://www.instagram.com/fajaransh_/"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                {/* Followers & Following */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Jumlah Pengikut (Followers)
                    </label>
                    <input
                      type="text"
                      value={editingPromotion.followers || ''}
                      onChange={(e) => setEditingPromotion((prev: any) => ({ ...prev, followers: e.target.value }))}
                      placeholder="Contoh: 1.830 atau 12.5K"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Jumlah Mengikuti (Following)
                    </label>
                    <input
                      type="text"
                      value={editingPromotion.following || ''}
                      onChange={(e) => setEditingPromotion((prev: any) => ({ ...prev, following: e.target.value }))}
                      placeholder="Contoh: 1.033 atau 250"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                {/* Role / University / Bio */}
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    Role / Kampus / Keterangan Bio
                  </label>
                  <input
                    type="text"
                    value={editingPromotion.universityOrRole || ''}
                    onChange={(e) => setEditingPromotion((prev: any) => ({ ...prev, universityOrRole: e.target.value }))}
                    placeholder="Contoh: Fullstack & Web Dev (Head of SOOBIN Services)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                  />
                </div>

                {/* Avatar Photo (Upload or URL) */}
                <div className="bg-slate-50 border border-slate-300 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-900">
                      Foto Profil / Avatar
                    </label>
                    {editingPromotion.avatarUrl && (
                      <span className="text-[10px] text-emerald-700 font-black">✓ Foto Terpasang</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-900 p-0.5 shrink-0 overflow-hidden flex items-center justify-center text-white font-black text-xs">
                      {editingPromotion.avatarUrl ? (
                        <img
                          src={editingPromotion.avatarUrl}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      ) : (
                        <span>{editingPromotion.name?.charAt(0) || 'A'}</span>
                      )}
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <input
                        type="text"
                        value={editingPromotion.avatarUrl || ''}
                        onChange={(e) => setEditingPromotion((prev: any) => ({ ...prev, avatarUrl: e.target.value }))}
                        placeholder="Masukkan URL foto atau klik unggah di samping"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-black cursor-pointer transition-colors">
                        <ImagePlus className="w-3.5 h-3.5" />
                        <span>Pilih File Foto Avatar</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result) {
                                  setEditingPromotion((prev: any) => ({ ...prev, avatarUrl: ev.target?.result as string }));
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Promotion Title & Caption */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Judul Bukti Promosi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPromotion.promotionTitle || ''}
                      onChange={(e) => setEditingPromotion((prev: any) => ({ ...prev, promotionTitle: e.target.value }))}
                      placeholder="Contoh: Instagram Story Promosi: Jasa Service Trusted 2023 - SOOBIN Services"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Kutipan Ulasan / Caption Promosi
                    </label>
                    <textarea
                      rows={2}
                      value={editingPromotion.caption || ''}
                      onChange={(e) => setEditingPromotion((prev: any) => ({ ...prev, caption: e.target.value }))}
                      placeholder="Contoh: “Solusi kebutuhan akademikmu” • @soobinservices.id"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                {/* Proof Media Photo (Upload or URL) */}
                <div className="bg-slate-50 border border-slate-300 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-900">
                      Foto Screenshot Bukti Promosi (Story/Feed/Post) <span className="text-rose-500">*</span>
                    </label>
                    {editingPromotion.proofMediaUrl && (
                      <span className="text-[10px] text-emerald-700 font-black">✓ Gambar Terpasang</span>
                    )}
                  </div>

                  <input
                    type="text"
                    required
                    value={editingPromotion.proofMediaUrl || ''}
                    onChange={(e) => setEditingPromotion((prev: any) => ({ ...prev, proofMediaUrl: e.target.value }))}
                    placeholder="URL gambar atau klik unggah di bawah"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                  />

                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black cursor-pointer transition-colors shadow-xs">
                      <ImagePlus className="w-4 h-4 text-amber-400" />
                      <span>Unggah File Screenshot Bukti</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                setEditingPromotion((prev: any) => ({ ...prev, proofMediaUrl: ev.target?.result as string }));
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {editingPromotion.proofMediaUrl && (
                      <div className="h-14 w-20 rounded-lg overflow-hidden border border-slate-300 bg-black">
                        <img
                          src={editingPromotion.proofMediaUrl}
                          alt="Thumbnail Bukti"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Highlight Badge & Verified Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Highlight Badge (Pojok Kanan Atas)
                    </label>
                    <input
                      type="text"
                      value={editingPromotion.highlightBadge || ''}
                      onChange={(e) => setEditingPromotion((prev: any) => ({ ...prev, highlightBadge: e.target.value }))}
                      placeholder="Official Story Proof"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-300 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(editingPromotion.verified)}
                        onChange={(e) => setEditingPromotion((prev: any) => ({ ...prev, verified: e.target.checked }))}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">
                        Centang Akun Terverifikasi (Verified)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsPromotionModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingPromotion}
                    className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSavingPromotion && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isSavingPromotion ? 'Menyimpan...' : 'Simpan Data Promosi'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL ZOOM PREVIEW SCREENSHOT BUKTI */}
      <AnimatePresence>
        {promotionPreviewZoom && (
          <div
            className="fixed inset-0 z-100 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setPromotionPreviewZoom(null)}
          >
            <button
              onClick={() => setPromotionPreviewZoom(null)}
              className="fixed top-4 right-4 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer z-110"
              title="Tutup Zoom"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] max-w-[92vw] sm:max-w-xl flex items-center justify-center"
            >
              <img
                src={promotionPreviewZoom}
                alt="Bukti Screenshot Fullsize"
                className="max-h-[82vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/20"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Save Toast Notification */}
      <AnimatePresence>
        {saveSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 font-black text-sm">
              ✓
            </div>
            <div className="flex-1 text-xs">
              <p className="font-black text-emerald-400 uppercase tracking-wider text-[10px]">Tersimpan ke Database</p>
              <p className="font-bold text-slate-100 mt-0.5">{saveSuccessMsg}</p>
            </div>
            <button
              onClick={() => setSaveSuccessMsg('')}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Modal Zoom Preview Foto Live Chat Admin */}
      <AnimatePresence>
        {adminChatPreview && (
          <div
            className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setAdminChatPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative max-w-2xl w-full max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 bg-black/50 border-b border-white/10 flex items-center justify-between">
                <span className="text-white text-xs font-bold truncate max-w-60">
                  {adminChatPreview.name || 'Preview Foto Live Chat'}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={adminChatPreview.url}
                    download={adminChatPreview.name || 'foto_livechat.jpg'}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh</span>
                  </a>
                  <button
                    onClick={() => setAdminChatPreview(null)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3 flex items-center justify-center overflow-auto max-h-[calc(90vh-60px)] bg-black/30">
                <img
                  src={adminChatPreview.url}
                  alt={adminChatPreview.name || 'Preview'}
                  className="max-h-[72vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DETAIL PENGALAMAN & RIWAYAT REDEEM MEMBER */}
      <AnimatePresence>
        {selectedMemberForRedeemDetail && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
            onClick={() => setSelectedMemberForRedeemDetail(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-300 rounded-3xl p-5 sm:p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative space-y-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-sm shadow-xs">
                    {selectedMemberForRedeemDetail.name?.charAt(0) || 'M'}
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900">{selectedMemberForRedeemDetail.name}</h3>
                    <p className="text-xs text-slate-600 font-bold">
                      {selectedMemberForRedeemDetail.email} • {selectedMemberForRedeemDetail.university || '-'} ({selectedMemberForRedeemDetail.prodi || '-'})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMemberForRedeemDetail(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Member Stats Summary */}
              {(() => {
                const mbrEmail = (selectedMemberForRedeemDetail.email || '').toLowerCase().trim();
                const stats = memberRedeemStats[mbrEmail] || { total: 0, approved: 0, rejected: 0, pending: 0, list: [] };
                const memberSubmissions = redeems.filter((r) => (r.memberEmail || '').toLowerCase().trim() === mbrEmail);

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Total Pengajuan</p>
                        <p className="text-xl font-black text-slate-900 mt-0.5">{stats.total}</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-center">
                        <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Disetujui (ACC)</p>
                        <p className="text-xl font-black text-emerald-900 mt-0.5">{stats.approved}</p>
                      </div>
                      <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 text-center">
                        <p className="text-[10px] font-black text-rose-800 uppercase tracking-wider">Ditolak</p>
                        <p className="text-xl font-black text-rose-900 mt-0.5">{stats.rejected}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <h4 className="font-black text-sm text-slate-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-700" />
                        <span>Riwayat Pengajuan & Bukti Screenshot ({memberSubmissions.length})</span>
                      </h4>

                      {memberSubmissions.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-xs font-bold">
                          Member ini belum pernah mengajukan klaim free turnitin.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {memberSubmissions.map((sub) => {
                            const isPending = sub.status === 'MENUNGGU_VERIFIKASI';
                            const isApproved = sub.status === 'DISETUJUI';
                            const isRejected = sub.status === 'DITOLAK';

                            return (
                              <div
                                key={sub.id}
                                className="bg-slate-50 border border-slate-300 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                              >
                                <div className="flex items-start gap-3.5">
                                  {sub.proofImage ? (
                                    <button
                                      onClick={() => setRedeemZoomImage(sub.proofImage)}
                                      className="w-20 h-24 rounded-xl overflow-hidden border border-slate-300 bg-slate-200 shrink-0 relative group cursor-pointer shadow-xs"
                                      title="Klik untuk melihat foto bukti ukuran penuh"
                                    >
                                      <img
                                        src={sub.proofImage}
                                        alt="Bukti Share"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                        <Eye className="w-5 h-5" />
                                      </div>
                                    </button>
                                  ) : (
                                    <div className="w-20 h-24 rounded-xl border border-dashed border-slate-300 bg-slate-100 flex flex-col items-center justify-center text-center p-1.5 shrink-0 text-slate-400 shadow-xs">
                                      <CheckCircle className="w-6 h-6 text-emerald-500 mb-1" />
                                      <span className="text-[9px] font-black text-slate-600 leading-tight">Diverifikasi & Dihapus</span>
                                      <span className="text-[8px] text-slate-400 mt-0.5">(Hemat Memori)</span>
                                    </div>
                                  )}

                                  <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-black text-slate-900">
                                        Platform: {sub.platform}
                                      </span>
                                      <span
                                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                          isPending
                                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                            : isApproved
                                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                                        }`}
                                      >
                                        {isPending ? '⏳ Menunggu Verifikasi' : isApproved ? '✓ Disetujui' : '✕ Ditolak'}
                                      </span>
                                    </div>

                                    <p className="text-[11px] text-slate-600 font-semibold">
                                      Diajukan: {new Date(sub.createdAt).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                                    </p>

                                    {isApproved && sub.voucherCode && (
                                      <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 text-xs text-emerald-950 space-y-1">
                                        <div className="flex items-center gap-2 font-mono font-black">
                                          <span>Kode Voucher:</span>
                                          <span className="bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-900 text-xs">
                                            {sub.voucherCode}
                                          </span>
                                        </div>
                                        {sub.approvedAt && (
                                          <p className="text-[10px] text-emerald-700 font-bold">
                                            Disetujui pada: {new Date(sub.approvedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    {isRejected && sub.adminNote && (
                                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-xs text-rose-900 font-bold">
                                        Alasan: {sub.adminNote}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Actions in Detail Modal */}
                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                  {isPending && (
                                    <>
                                      <button
                                        disabled={actionLoadingId === sub.id}
                                        onClick={() => handleOpenRejectModal(sub.id)}
                                        className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 text-xs font-black flex items-center gap-1 cursor-pointer transition-colors"
                                      >
                                        <XCircle className="w-4 h-4" />
                                        <span>Tolak</span>
                                      </button>

                                      <button
                                        disabled={actionLoadingId === sub.id}
                                        onClick={() => handleApproveRedeem(sub.id)}
                                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                                      >
                                        {actionLoadingId === sub.id ? (
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        )}
                                        <span>Setujui (ACC)</span>
                                      </button>
                                    </>
                                  )}

                                  <button
                                    onClick={() => handleDeleteRedeem(sub.id)}
                                    className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                                    title="Hapus riwayat pengajuan ini"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                  onClick={() => setSelectedMemberForRedeemDetail(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs cursor-pointer shadow-xs"
                >
                  Tutup Rincian
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL FULLSCREEN ZOOM BUKTI SCREENSHOT */}
      <AnimatePresence>
        {redeemZoomImage && (
          <div
            className="fixed inset-0 z-100 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setRedeemZoomImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl w-full max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-3.5 bg-black/60 border-b border-white/10 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black">Inspeksi Screenshot Bukti Share (Pastikan Status Publik)</span>
                </div>
                <button
                  onClick={() => setRedeemZoomImage(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 flex items-center justify-center overflow-auto max-h-[calc(90vh-70px)] bg-black/40">
                <img
                  src={redeemZoomImage}
                  alt="Bukti Share Fullsize"
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL INPUT ALASAN PENOLAKAN KLAIM */}
      <AnimatePresence>
        {rejectReasonModal.isOpen && (
          <div
            className="fixed inset-0 z-100 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setRejectReasonModal({ isOpen: false, redeemId: '', reason: '' })}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-300 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 text-rose-700">
                  <XCircle className="w-5 h-5" />
                  <h3 className="font-black text-sm text-slate-900">Alasan Penolakan Klaim</h3>
                </div>
                <button
                  onClick={() => setRejectReasonModal({ isOpen: false, redeemId: '', reason: '' })}
                  className="p-1 text-slate-400 hover:text-slate-900 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                  Tuliskan alasan penolakan agar member dapat memperbaiki dan mengupload ulang bukti share publik yang valid:
                </p>

                <textarea
                  rows={4}
                  value={rejectReasonModal.reason}
                  onChange={(e) => setRejectReasonModal((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder="Contoh: Status/Story di-private atau hanya dibagikan ke kontak admin. Mohon share publik ke semua kontak..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                />

                {/* Quick Templates */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Template Cepat:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Status/Story di-private atau kontak dikecualikan.',
                      'Screenshot buram / tidak menampilkan jumlah tayangan/status.',
                      'Bukan status/story tentang Soobin Services.',
                    ].map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRejectReasonModal((prev) => ({ ...prev, reason: tpl }))}
                        className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 rounded-lg border border-slate-300 transition-colors text-left"
                      >
                        {tpl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setRejectReasonModal({ isOpen: false, redeemId: '', reason: '' })}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRejectRedeem}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-colors shadow-xs"
                >
                  Konfirmasi Tolak
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
