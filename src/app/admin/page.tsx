'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, LogOut, MessageSquare, Shield, User as UserIcon,
  School, GraduationCap, Send, Clock, CircleAlert, Headphones,
  ShoppingBag, CheckCircle, XCircle, Eye, RefreshCw, X, QrCode, CreditCard
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
  createdAt: string;
}

const BUCKET_URL = '/api/chats';
const ORDERS_URL = '/api/orders';

export default function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'chat' | 'orders'>('chat');

  // Chat states
  const [chats, setChats] = useState<{ [id: string]: ChatSession }>({});
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Orders states
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedProofImage, setSelectedProofImage] = useState<string | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

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

  // Web Audio API notification sound
  const playNotificationSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.error('Failed to play beep', e);
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

  // Sync orders with cloud
  const syncOrdersWithCloud = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(ORDERS_URL);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
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
      if (activeTab === 'orders') {
        syncOrdersWithCloud();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isAdminLoggedIn, activeTab]);

  // Admin login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (email.toLowerCase() === 'admin@soobin.com' && password === 'adminsoobin123') {
        localStorage.setItem('soobin_admin_logged_in', 'true');
        setIsAdminLoggedIn(true);
      } else {
        setError('Kredensial admin salah');
      }
      setLoading(false);
    }, 850);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.setItem('soobin_admin_logged_in', 'false');
    localStorage.setItem('soobin_admin_active', 'false');
    setIsAdminLoggedIn(false);
    setSelectedSessionId(null);
  };

  // Update order status (Admin manual check)
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, paymentStatus: newStatus } : o));
    setOrders(updated);

    try {
      await fetch(ORDERS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  // Send reply handler
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedSessionId) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: `msg_admin_${Date.now()}`,
      sender: 'admin',
      text: adminReplyText.trim(),
      timestamp: timeString,
      read: true,
      createdAt: Date.now(),
    };

    const targetSession = chats[selectedSessionId];
    if (!targetSession) return;

    const updatedSession: ChatSession = {
      ...targetSession,
      unreadCount: 0,
      lastUpdated: new Date().toISOString(),
      messages: [...targetSession.messages, newMsg],
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
    } catch (e) {
      console.error('Failed to send reply to cloud', e);
    }
  };

  const handleSelectSession = async (id: string) => {
    setSelectedSessionId(id);

    const session = chats[id];
    if (session && session.unreadCount > 0) {
      const updatedSession = { ...session, unreadCount: 0 };
      const updatedChats = { ...chats, [id]: updatedSession };
      setChats(updatedChats);

      try {
        await fetch(BUCKET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedChats),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const chatList = Object.values(chats).sort((a, b) => {
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
  });

  const selectedSession = selectedSessionId ? chats[selectedSessionId] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary-900/20 blur-3xl pointer-events-none rounded-full"></div>

      {!isAdminLoggedIn ? (
        // --- Admin Login Form ---
        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-dark-900/80 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-xl"
          >
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary-800/40 border border-primary-500/30 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary-900/40">
                <Shield className="w-6 h-6 text-primary-400" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">Portal Admin SOOBIN</h1>
              <p className="text-xs text-gray-400 mt-1">Dasbor Pemantauan Pesanan & Live Chat</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Admin</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@soobin.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-white/10 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Kata Sandi</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-white/10 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400 flex items-center gap-2">
                  <CircleAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-800 hover:bg-primary-750 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-primary-950/20 disabled:opacity-50 mt-2 cursor-pointer"
              >
                {loading ? 'Menghubungkan...' : 'Masuk Portal'}
              </button>
            </form>
          </motion.div>
        </div>
      ) : (
        // --- Admin Dashboard Portal ---
        <div className="h-screen flex flex-col relative z-10 overflow-hidden">
          {/* Header Panel */}
          <header className="h-16 border-b border-white/10 bg-dark-900/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-400" />
                <h2 className="text-sm sm:text-base font-bold tracking-tight">Dasbor Admin SOOBIN</h2>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 ml-2">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'chat'
                      ? 'bg-primary-800 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Live Chat</span>
                  {chatList.reduce((acc, curr) => acc + curr.unreadCount, 0) > 0 && (
                    <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
                      {chatList.reduce((acc, curr) => acc + curr.unreadCount, 0)}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab('orders');
                    syncOrdersWithCloud();
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-amber-500 text-dark-950 shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Pesanan & Pembayaran</span>
                  <span className="bg-amber-400/30 text-amber-300 text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    {orders.length}
                  </span>
                </button>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              Keluar Dasbor
            </button>
          </header>

          {/* Core Panel Content */}
          <div className="flex-1 flex overflow-hidden">
            {activeTab === 'chat' ? (
              <>
                {/* Sidebar Chat Sessions */}
                <aside className="w-80 border-r border-white/10 bg-dark-900/20 flex flex-col shrink-0 overflow-y-auto">
                  <div className="p-4 border-b border-white/5 shrink-0 bg-dark-900/20 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Antrean Obrolan ({chatList.length})
                    </span>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  </div>
                  <div className="flex-1 overflow-y-auto py-2">
                    {chatList.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-500 gap-2">
                        <MessageSquare className="w-8 h-8 text-white/10" />
                        <p className="text-xs">Belum ada obrolan masuk</p>
                      </div>
                    ) : (
                      chatList.map((session) => {
                        const isSelected = session.id === selectedSessionId;
                        const lastMsg = session.messages[session.messages.length - 1];

                        return (
                          <button
                            key={session.id}
                            onClick={() => handleSelectSession(session.id)}
                            className={`w-full text-left p-4 border-b border-white/5 flex gap-3 cursor-pointer items-start transition-colors ${
                              isSelected
                                ? 'bg-primary-950/40 border-r-4 border-r-primary-500'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="w-9 h-9 rounded-full bg-primary-800 flex items-center justify-center text-xs uppercase font-bold shrink-0 shadow-md">
                              {session.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1.5 mb-1">
                                <span className="text-xs font-bold truncate block">{session.name}</span>
                                {session.unreadCount > 0 && (
                                  <span className="bg-red-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0">
                                    {session.unreadCount}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-400 truncate">
                                {lastMsg ? lastMsg.text : 'Memulai percakapan baru'}
                              </p>
                              <span className="text-[8px] text-gray-500 block mt-1.5">
                                {session.university ? `${session.university.split(' ')[0]} - ` : 'Guest'}
                                {lastMsg && lastMsg.timestamp}
                              </span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </aside>

                {/* Chat Pane */}
                <main className="flex-1 flex flex-col overflow-hidden bg-black/10">
                  {selectedSession ? (
                    <>
                      {/* Selected Session Header */}
                      <div className="px-6 py-4 border-b border-white/10 bg-dark-900/40 shrink-0 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm sm:text-base truncate">{selectedSession.name}</h3>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              selectedSession.email ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-white/5'
                            }`}>
                              {selectedSession.email ? 'Member' : 'Guest'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                            {selectedSession.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-gray-500" />
                                {selectedSession.email}
                              </span>
                            )}
                            {selectedSession.university && (
                              <span className="flex items-center gap-1">
                                <School className="w-3.5 h-3.5 text-gray-500" />
                                {selectedSession.university}
                              </span>
                            )}
                            {selectedSession.prodi && (
                              <span className="flex items-center gap-1">
                                <GraduationCap className="w-3.5 h-3.5 text-gray-500" />
                                {selectedSession.prodi}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Messages Feed */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {[...selectedSession.messages]
                          .sort((a, b) => {
                            const getMsgTime = (msg: Message) => {
                              if (msg.createdAt) return msg.createdAt;
                              const match = msg.id.match(/\d+/);
                              return match ? parseInt(match[0], 10) : 0;
                            };
                            return getMsgTime(a) - getMsgTime(b);
                          })
                          .map((msg) => {
                          const isAdmin = msg.sender === 'admin';
                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col max-w-[70%] ${isAdmin ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                            >
                              <div
                                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium wrap-break-word w-full shadow-md ${
                                  isAdmin
                                    ? 'bg-primary-800 text-white rounded-tr-none'
                                    : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
                                }`}
                              >
                                {msg.text}
                              </div>
                              <span className="text-[9px] text-gray-500 mt-1 px-1">
                                {msg.timestamp}
                              </span>
                            </div>
                          );
                        })}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Reply Input Form */}
                      <form
                        onSubmit={handleSendReply}
                        className="p-4 border-t border-white/10 bg-dark-900/50 shrink-0 flex gap-3 items-center"
                      >
                        <input
                          type="text"
                          value={adminReplyText}
                          onChange={(e) => setAdminReplyText(e.target.value)}
                          placeholder={`Kirim balasan ke ${selectedSession.name}...`}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-white/10 transition-colors placeholder-gray-500"
                        />
                        <button
                          type="submit"
                          disabled={!adminReplyText.trim()}
                          className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                            adminReplyText.trim()
                              ? 'bg-primary-800 hover:bg-primary-750 text-white'
                              : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                          }`}
                        >
                          <Send className="w-4.5 h-4.5" />
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-3 text-gray-500">
                      <Headphones className="w-16 h-16 text-white/5" />
                      <div>
                        <h3 className="text-base font-bold text-gray-400">Belum Ada Obrolan Dipilih</h3>
                        <p className="text-xs max-w-sm mt-1">
                          Silakan pilih sesi chat dari daftar di kolom kiri untuk memantau & membalas pesan.
                        </p>
                      </div>
                    </div>
                  )}
                </main>
              </>
            ) : (
              // --- Orders & Payment Checking View ---
              <main className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
                <div className="max-w-6xl mx-auto space-y-6">
                  {/* Orders Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-amber-400" />
                        Daftar Pesanan & Pembayaran QRIS / Transfer
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Pantau bukti transfer screenshot QRIS, detail form custom, dan verifikasi status lunas.
                      </p>
                    </div>

                    <button
                      onClick={syncOrdersWithCloud}
                      className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold px-3 py-2 rounded-xl text-gray-300 transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading ? 'animate-spin' : ''}`} />
                      <span>Refresh Pesanan</span>
                    </button>
                  </div>

                  {/* Orders Table List */}
                  {orders.length === 0 ? (
                    <div className="bg-dark-900/60 border border-white/10 rounded-2xl p-12 text-center text-gray-500 space-y-3">
                      <ShoppingBag className="w-12 h-12 mx-auto text-white/10" />
                      <h4 className="text-sm font-bold text-gray-300">Belum Ada Pesanan Masuk</h4>
                      <p className="text-xs max-w-md mx-auto">
                        Setiap pesanan yang dibuat oleh pelanggan melalui form kustom dan QRIS akan ditampilkan otomatis di sini.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {orders.map((order) => {
                        const isQris = order.paymentMethod?.toLowerCase().includes('qris');
                        const isLunas = order.paymentStatus?.toLowerCase().includes('lunas');
                        const isCanceled = order.paymentStatus?.toLowerCase().includes('batal') || order.paymentStatus?.toLowerCase().includes('expired');

                        return (
                          <div
                            key={order.id}
                            className="bg-dark-900/80 border border-white/10 rounded-2xl p-5 shadow-xl hover:border-white/20 transition-all space-y-4"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                  isQris ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                }`}>
                                  {isQris ? <QrCode className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-sm text-white">{order.customerName}</h4>
                                    <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded font-mono">
                                      {order.id}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-400">{order.customerEmail || 'Guest'}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 self-end sm:self-auto">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                  isLunas
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                    : isCanceled
                                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                                }`}>
                                  {order.paymentStatus}
                                </span>
                              </div>
                            </div>

                            {/* Service & Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              {/* Service Info */}
                              <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                                <span className="text-gray-400 font-medium">Jasa Layanan:</span>
                                <p className="font-bold text-primary-300 text-sm">{order.serviceName}</p>
                                <p className="font-bold text-green-400 mt-1">{order.price}</p>
                                <p className="text-[10px] text-gray-500 mt-2">
                                  Metode: <strong className="text-gray-300">{order.paymentMethod}</strong>
                                </p>
                              </div>

                              {/* Form Detail Info */}
                              <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1.5 md:col-span-2">
                                <span className="text-gray-400 font-medium block">Detail Formulir Kustom:</span>
                                {order.customFields && Object.keys(order.customFields).length > 0 ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    {Object.entries(order.customFields).map(([k, v]) => (
                                      <div key={k} className="bg-black/20 p-2 rounded-lg border border-white/5">
                                        <span className="text-[10px] text-gray-400 block">{k}:</span>
                                        <span className="font-semibold text-gray-200 break-words">{v}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 italic">Tidak ada rincian form khusus.</p>
                                )}
                              </div>
                            </div>

                            {/* Footer / Proof & Actions */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                              {/* Bukti Pembayaran Screenshot */}
                              <div>
                                {order.proofImage ? (
                                  <button
                                    onClick={() => setSelectedProofImage(order.proofImage!)}
                                    className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl hover:bg-amber-500/20 transition-all cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4" />
                                    <span>Lihat Bukti Bayar (Screenshot)</span>
                                  </button>
                                ) : (
                                  <span className="text-xs text-gray-500 italic">
                                    (Metode Transfer / Belum ada Lampiran Foto)
                                  </span>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 self-end sm:self-auto">
                                {!isLunas && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'Lunas (Terverifikasi Admin)')}
                                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>Verifikasi Lunas</span>
                                  </button>
                                )}

                                {!isCanceled && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'Dibatalkan (Expired/Ditolak)')}
                                    className="flex items-center gap-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Batalkan</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </main>
            )}
          </div>
        </div>
      )}

      {/* Proof Image Fullscreen Modal */}
      {selectedProofImage && (
        <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-dark-900 border border-white/10 rounded-2xl p-4 overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <h4 className="font-bold text-sm text-white">Bukti Pembayaran QRIS Pelanggan</h4>
              <button
                onClick={() => setSelectedProofImage(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full h-[450px] bg-black/50 rounded-xl overflow-hidden flex items-center justify-center">
              <Image
                src={selectedProofImage}
                alt="Bukti Transfer QRIS"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
