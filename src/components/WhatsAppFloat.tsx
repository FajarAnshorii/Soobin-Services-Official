'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Send, X, Sun, Moon, Check, CheckCheck, MessageSquare, Lock, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

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

const BUCKET_URL = '/api/chats';

export default function WhatsAppFloat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [messageText, setMessageText] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('soobin_chat_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Set Session ID dynamically based on auth state
  useEffect(() => {
    setMessages([]);
    setUnreadCount(0);

    if (user) {
      const memberSessId = `chat_member_${user.email.replace(/[@.]/g, '_')}`;
      setSessionId(memberSessId);
    } else {
      setSessionId('');
    }
  }, [user]);

  // Sync session with logged-in user profile info
  useEffect(() => {
    if (!sessionId || !user) return;

    const syncProfile = async () => {
      try {
        const res = await fetch(`${BUCKET_URL}?session_id=${sessionId}`);
        let session: ChatSession | null = null;
        if (res.ok) {
          session = await res.json();
        }

        if (!session) {
          session = {
            id: sessionId,
            name: user.name,
            email: user.email,
            university: user.university || '',
            prodi: user.prodi || '',
            lastUpdated: new Date().toISOString(),
            unreadCount: 0,
            userUnreadCount: 0,
            messages: [],
          };
          
          await fetch(BUCKET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(session),
          });
        } else if (session.name !== user.name || session.email !== user.email) {
          session.name = user.name;
          session.email = user.email;
          session.university = user.university || '';
          session.prodi = user.prodi || '';

          await fetch(BUCKET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(session),
          });
        }

        setMessages(session.messages || []);
        setUnreadCount(session.userUnreadCount || 0);
      } catch (e) {
        console.error('Failed to sync profile with cloud', e);
      }
    };

    syncProfile();
  }, [sessionId, user]);

  // Cloud sync handler
  const syncWithCloud = async (currentSessionId: string, currentIsOpen: boolean) => {
    if (!currentSessionId || !user) return;
    try {
      const res = await fetch(`${BUCKET_URL}?session_id=${currentSessionId}`);
      if (!res.ok) return;
      const cloudSession = await res.json();
      if (!cloudSession) return;

      setMessages(cloudSession.messages || []);
      setUnreadCount(currentIsOpen ? 0 : (cloudSession.userUnreadCount || 0));

      if (currentIsOpen && cloudSession.userUnreadCount > 0) {
        cloudSession.userUnreadCount = 0;
        await fetch(BUCKET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cloudSession),
        });
      }
    } catch (e) {
      console.error('Failed to sync with cloud', e);
    }
  };

  // 2-second cloud polling sync loop for logged-in users
  useEffect(() => {
    if (!sessionId || !user) return;

    syncWithCloud(sessionId, isOpen);

    const interval = setInterval(() => {
      syncWithCloud(sessionId, isOpen);
    }, 2000);

    return () => clearInterval(interval);
  }, [sessionId, isOpen, user]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('soobin_chat_theme', nextTheme);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !sessionId || !user) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: timeString,
      read: false,
      createdAt: Date.now(),
    };

    setMessageText('');

    try {
      const res = await fetch(`${BUCKET_URL}?session_id=${sessionId}`);
      let session: ChatSession | null = null;
      if (res.ok) {
        session = await res.json();
      }

      if (!session) {
        session = {
          id: sessionId,
          name: user.name,
          email: user.email,
          university: user.university || '',
          prodi: user.prodi || '',
          lastUpdated: now.toISOString(),
          unreadCount: 0,
          userUnreadCount: 0,
          messages: [],
        };
      }

      session.messages.push(newMsg);
      session.lastUpdated = now.toISOString();
      session.unreadCount += 1;

      await fetch(BUCKET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      });

      setMessages([...session.messages]);
    } catch (e) {
      console.error('Failed to send message to cloud', e);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Popover Jendela Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`w-[calc(100vw-2rem)] sm:w-96 h-[480px] rounded-2xl shadow-2xl border flex flex-col overflow-hidden mb-4 ${
              theme === 'light'
                ? 'bg-white border-gray-100 text-dark-800'
                : 'bg-[#0d1224] border-white/10 text-white shadow-primary-950/40'
            }`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header Chat */}
            <div
              className={`px-4 py-3 flex items-center justify-between border-b ${
                theme === 'light' ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary-800 text-white flex items-center justify-center font-bold">
                    <Headphones className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="text-sm font-bold">Admin Live SOOBIN</h3>
                  <span className="text-[10px] text-green-500 font-medium">Aktif Realtime</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    theme === 'light' ? 'hover:bg-gray-200 text-gray-500' : 'hover:bg-white/10 text-gray-300'
                  }`}
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    theme === 'light' ? 'hover:bg-gray-200 text-gray-500' : 'hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Body / Isi Pesan */}
            {!user ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3 bg-gradient-to-b from-transparent to-black/20">
                <div className="w-14 h-14 bg-primary-800/10 border border-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400 mb-1 shadow-inner">
                  <Lock className="w-7 h-7 text-primary-400 animate-bounce" />
                </div>
                <h4 className="font-bold text-sm text-white">Akses Live Chat Khusus Member</h4>
                <p className="text-xs text-gray-400 max-w-[240px] leading-relaxed">
                  Silakan login atau daftar akun terlebih dahulu untuk melakukan Live Chat dengan Admin SOOBIN Services.
                </p>
                <Link
                  href="/auth"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 bg-primary-800 hover:bg-primary-750 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Masuk / Daftar Member Baru</span>
                </Link>
              </div>
            ) : (
              <>
                <div
                  className={`flex-1 overflow-y-auto p-4 space-y-3.5 ${
                    theme === 'light' ? 'bg-gray-50/50' : 'bg-black/10'
                  }`}
                >
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-2">
                      <MessageSquare className={`w-12 h-12 ${theme === 'light' ? 'text-gray-300' : 'text-white/15'}`} />
                      <p className={`text-xs font-medium max-w-[220px] ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Halo <span className="font-bold text-primary-400">{user.name}</span>! Admin Live siap membantu kebutuhan Anda. Kirim pesan di bawah untuk mulai percakapan.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isAdmin = msg.sender === 'admin';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col max-w-[80%] ${isAdmin ? 'mr-auto items-start' : 'ml-auto items-end'}`}
                        >
                          <div
                            className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium wrap-break-word w-full ${
                              isAdmin
                                ? theme === 'light'
                                  ? 'bg-white border border-gray-100 text-dark-800 rounded-tl-none shadow-sm'
                                  : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
                                : theme === 'light'
                                  ? 'bg-primary-800 text-white rounded-tr-none'
                                  : 'bg-primary-700 text-white rounded-tr-none'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 px-1">
                            <span className={`text-[9px] ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {msg.timestamp}
                            </span>
                            {!isAdmin && (
                              msg.read ? (
                                <CheckCheck className="w-3 h-3 text-blue-500" />
                              ) : (
                                <Check className="w-3 h-3 text-gray-400" />
                              )
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Footer Input */}
                <form
                  onSubmit={handleSendMessage}
                  className={`p-3 border-t flex gap-2 items-center ${
                    theme === 'light' ? 'bg-white border-gray-100' : 'bg-white/5 border-white/5'
                  }`}
                >
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Tulis pesan Anda..."
                    className={`flex-1 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none border ${
                      theme === 'light'
                        ? 'bg-gray-50 border-gray-200 focus:border-primary-500 focus:bg-white text-dark-800'
                        : 'bg-white/5 border-white/10 focus:border-primary-500 focus:bg-white/10 text-white'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      messageText.trim()
                        ? 'bg-primary-800 hover:bg-primary-750 text-white'
                        : 'bg-gray-150 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4.5 h-4.5" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tombol Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group border-0 focus:outline-none cursor-pointer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulse Ring */}
        <span className="absolute inset-0 bg-primary-800 rounded-full animate-ping opacity-25" />

        {/* Button */}
        <div className="relative bg-white border border-gray-150 text-primary-800 hover:text-primary-750 p-4 rounded-full shadow-2xl shadow-primary-950/20 transition-colors duration-300">
          <Headphones className="w-6.5 h-6.5" />
          
          {/* Unread Count Badge */}
          {unreadCount > 0 && user && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </div>
      </motion.button>
    </div>
  );
}