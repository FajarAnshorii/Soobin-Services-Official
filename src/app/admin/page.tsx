'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogOut, MessageSquare, Shield, User as UserIcon, School, GraduationCap, Send, Clock, CircleAlert, Headphones } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
  read: boolean;
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

export default function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Dashboard states
  const [chats, setChats] = useState<{ [id: string]: ChatSession }>({});
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const prevChatsRef = useRef<{ [id: string]: ChatSession }>({});

  // 1. Check Auth state on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('soobin_admin_logged_in') === 'true';
    setIsAdminLoggedIn(isLoggedIn);
  }, []);

  // 2. Set Admin online/offline indicator for client tabs
  useEffect(() => {
    if (isAdminLoggedIn) {
      localStorage.setItem('soobin_admin_active', 'true');
      
      // Clean up when tab closes or admin logs out
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
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.error('Failed to play beep', e);
    }
  };

  // 3. Load chats and sync in realtime
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const loadChats = () => {
      try {
        const chatsStr = localStorage.getItem('soobin_chats') || '{}';
        const currentChats = JSON.parse(chatsStr);
        setChats(currentChats);

        // Check if any chat has a new message to play sound
        let hasNewMsg = false;
        Object.keys(currentChats).forEach((id) => {
          const oldSession = prevChatsRef.current[id];
          const newSession = currentChats[id];
          if (newSession && (!oldSession || newSession.unreadCount > oldSession.unreadCount)) {
            hasNewMsg = true;
          }
        });

        if (hasNewMsg) {
          playNotificationSound();
        }

        prevChatsRef.current = currentChats;
      } catch (e) {
        console.error('Failed to parse chats', e);
      }
    };

    loadChats();

    const handleStorage = () => {
      loadChats();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('soobin_chat_update', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('soobin_chat_update', handleStorage);
    };
  }, [isAdminLoggedIn]);

  // 4. Scroll selected chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedSessionId, chats]);

  // 5. Handle admin login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated login check
    setTimeout(() => {
      if (email.toLowerCase() === 'admin@soobin.com' && password === 'adminsoobin123') {
        localStorage.setItem('soobin_admin_logged_in', 'true');
        setIsAdminLoggedIn(true);
      } else {
        setError('Kredensial admin salah');
      }
      setLoading(false);
    }, 800);
  };

  // 6. Handle logout
  const handleLogout = () => {
    localStorage.setItem('soobin_admin_logged_in', 'false');
    localStorage.setItem('soobin_admin_active', 'false');
    setIsAdminLoggedIn(false);
    setSelectedSessionId(null);
  };

  // 7. Handle sending admin reply
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedSessionId) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: `msg_admin_${Date.now()}`,
      sender: 'admin',
      text: adminReplyText,
      timestamp: timeString,
      read: true,
    };

    const chatsStr = localStorage.getItem('soobin_chats') || '{}';
    const currentChats = JSON.parse(chatsStr);
    const session = currentChats[selectedSessionId] as ChatSession;

    if (session) {
      session.messages.push(newMsg);
      session.lastUpdated = now.toISOString();
      session.unreadCount = 0; // Reset admin unread count since admin is looking
      session.userUnreadCount += 1; // Increment user unread count for notification badge
      
      // Set all user messages in this chat as read
      session.messages = session.messages.map(m => m.sender === 'user' ? { ...m, read: true } : m);

      currentChats[selectedSessionId] = session;
      localStorage.setItem('soobin_chats', JSON.stringify(currentChats));

      setChats(currentChats);
      setAdminReplyText('');

      // Notify other tabs
      window.dispatchEvent(new Event('soobin_chat_update'));
    }
  };

  // 8. Select a session and mark messages as read
  const handleSelectSession = (id: string) => {
    setSelectedSessionId(id);

    const chatsStr = localStorage.getItem('soobin_chats') || '{}';
    const currentChats = JSON.parse(chatsStr);
    const session = currentChats[id] as ChatSession;

    if (session && session.unreadCount > 0) {
      session.unreadCount = 0;
      // Mark all user messages as read
      session.messages = session.messages.map(m => m.sender === 'user' ? { ...m, read: true } : m);
      currentChats[id] = session;
      localStorage.setItem('soobin_chats', JSON.stringify(currentChats));
      setChats(currentChats);
      window.dispatchEvent(new Event('soobin_chat_update'));
    }
  };

  // Convert Object of chats to sorted array
  const chatList = Object.values(chats).sort(
    (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  );

  const selectedSession = selectedSessionId ? chats[selectedSessionId] : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-dark-800 via-primary-900 to-dark-800 text-white font-sans">
      {/* Glow effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-800/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>

      {!isAdminLoggedIn ? (
        // --- Admin Login Form ---
        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <motion.div
            className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-12 h-12 bg-primary-800 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-primary-950/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Portal Admin Live</h1>
              <p className="text-xs text-gray-400 mt-1">Halaman masuk khusus untuk Admin Call Center Soobin</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/25 border border-red-500/50 rounded-xl p-3 text-red-200 text-xs sm:text-sm mb-4">
                <CircleAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-semibold">Email Admin</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@soobin.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-semibold">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Helpful Credentials Note */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-[10px] sm:text-xs text-primary-300">
                <span className="font-semibold block mb-0.5">💡 Tips Pengujian:</span>
                Masukkan email <span className="font-mono text-white bg-white/10 px-1 py-0.5 rounded">admin@soobin.com</span> dan password <span className="font-mono text-white bg-white/10 px-1 py-0.5 rounded">adminsoobin123</span> untuk masuk.
              </div>

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
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary-400" />
              <h2 className="text-sm sm:text-base font-bold tracking-tight">Dasbor Admin Live Chat</h2>
              <span className="bg-green-500/25 border border-green-500/30 text-green-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block animate-pulse">
                Online Sync
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar Dasbor
            </button>
          </header>

          {/* Core Panel Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Chat Sessions */}
            <aside className="w-80 border-r border-white/10 bg-dark-900/20 flex flex-col shrink-0 overflow-y-auto">
              <div className="p-4 border-b border-white/5 shrink-0 bg-dark-900/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Antrean Obrolan ({chatList.length})
                </span>
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
                  {/* Selected Session Header / User Meta */}
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
                    {selectedSession.messages.map((msg) => {
                      const isAdmin = msg.sender === 'admin';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col max-w-[70%] ${isAdmin ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                        >
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium break-words w-full shadow-md ${
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
                      Silakan pilih sesi chat dari daftar di kolom kiri untuk melihat pesan masuk dan membalas secara realtime.
                    </p>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
