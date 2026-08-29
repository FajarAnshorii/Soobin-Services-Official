'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  X,
  Sun,
  Moon,
  Check,
  CheckCheck,
  MessageSquare,
  Lock,
  UserCheck,
  ImagePlus,
  Clock,
  Eye,
  Download,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { compressChatImage } from '@/lib/imageCompressor';

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

const BUCKET_URL = '/api/chats';
const EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export default function WhatsAppFloat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [messageText, setMessageText] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; name?: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const isOpenRef = useRef(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Cloud sync handler
  const syncWithCloud = async () => {
    if (!sessionId || !user) return;
    try {
      const res = await fetch(`${BUCKET_URL}?session_id=${sessionId}`);
      if (!res.ok) return;
      const cloudSession = await res.json();
      if (!cloudSession) return;

      const newMsgs = cloudSession.messages || [];
      setMessages((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(newMsgs)) {
          return newMsgs;
        }
        return prev;
      });

      const currentIsOpen = isOpenRef.current;
      setUnreadCount(currentIsOpen ? 0 : cloudSession.userUnreadCount || 0);

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

  // 5-second cloud polling sync loop for logged-in users
  useEffect(() => {
    if (!sessionId || !user) return;

    syncWithCloud();

    const interval = setInterval(() => {
      syncWithCloud();
    }, 5000);

    return () => clearInterval(interval);
  }, [sessionId]);

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

  // Send Text Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !sessionId || !user) return;

    const now = new Date();
    const timeString = `${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: messageText.trim(),
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

  // Send Photo Attachment with Client Compression
  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !sessionId || !user) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (.png, .jpg, .jpeg, .webp)');
      return;
    }

    setIsUploading(true);
    try {
      const { dataUrl, fileName, fileSize } = await compressChatImage(file);

      const now = new Date();
      const timeString = `${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

      const newMsg: Message = {
        id: `msg_${Date.now()}`,
        sender: 'user',
        text: messageText.trim() || '📷 Mengirim foto',
        timestamp: timeString,
        read: false,
        createdAt: Date.now(),
        mediaUrl: dataUrl,
        mediaName: fileName,
        mediaSize: fileSize,
      };

      setMessageText('');

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
    } catch (err) {
      console.error('Failed to process image:', err);
      alert('Gagal memproses gambar. Silakan coba lagi.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const checkIsExpired = (msg: Message) => {
    const isMedia = Boolean(msg.mediaUrl || (msg.mediaName && msg.isExpired));
    if (!isMedia) return false;
    if (msg.isExpired) return true;
    if (!msg.createdAt) return false;
    return Date.now() - msg.createdAt > EXPIRATION_MS;
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
        {/* Popover Jendela Chat */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={`w-[calc(100vw-2rem)] sm:w-96 h-[480px] sm:h-[500px] rounded-2xl shadow-2xl border flex flex-col overflow-hidden mb-3 sm:mb-4 ${
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
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-1.5 shadow-2xs">
                      <Image
                        src="/favicon.png"
                        alt="Admin SOOBIN"
                        width={28}
                        height={28}
                        className="object-contain"
                        priority
                      />
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
                    Silakan login atau daftar akun terlebih dahulu untuk melakukan Live Chat & konsultasi tugas dengan Admin SOOBIN Services.
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
                        <MessageSquare
                          className={`w-12 h-12 ${theme === 'light' ? 'text-gray-300' : 'text-white/15'}`}
                        />
                        <p
                          className={`text-xs font-medium max-w-[220px] ${
                            theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          Halo <span className="font-bold text-primary-400">{user.name}</span>! Admin Live siap
                          membantu kebutuhan Anda. Kirim pesan atau foto di bawah untuk mulai percakapan.
                        </p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isAdmin = msg.sender === 'admin';
                        const isMedia = Boolean(msg.mediaUrl || (msg.mediaName && msg.isExpired));
                        const isExpired = isMedia && (msg.isExpired || (msg.createdAt ? Date.now() - msg.createdAt > EXPIRATION_MS : false));

                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col max-w-[85%] ${
                              isAdmin ? 'mr-auto items-start' : 'ml-auto items-end'
                            }`}
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
                              {/* Media Photo Section */}
                              {isMedia && (
                                <div className="mb-2">
                                  {isExpired ? (
                                    <div className="p-2.5 rounded-xl bg-slate-500/15 border border-slate-500/30 text-slate-800 dark:text-slate-300 text-xs flex items-center gap-2">
                                      <Clock className="w-4 h-4 shrink-0 text-slate-600 dark:text-slate-400" />
                                      <div className="flex flex-col text-left">
                                        <span className="font-bold text-[11px]">Foto Telah Kadaluarsa</span>
                                        <span className="text-[10px] opacity-90 leading-tight">
                                          Melewati 1x24 jam demi efisiensi sistem. Silakan kirim ulang jika diperlukan.
                                        </span>
                                      </div>
                                    </div>
                                  ) : msg.mediaUrl ? (
                                    <div className="flex flex-col gap-1">
                                      <div
                                        onClick={() =>
                                          setPreviewImage({ url: msg.mediaUrl!, name: msg.mediaName })
                                        }
                                        className="relative group rounded-xl overflow-hidden cursor-pointer border border-black/10 dark:border-white/10 bg-black/5 max-h-48"
                                      >
                                        <img
                                          src={msg.mediaUrl}
                                          alt={msg.mediaName || 'Foto Lampiran'}
                                          className="w-full h-auto object-cover max-h-48 group-hover:scale-105 transition-transform duration-200"
                                          loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold backdrop-blur-2xs">
                                          <Eye className="w-4 h-4" />
                                          <span>Lihat Foto</span>
                                        </div>
                                      </div>
                                      {msg.mediaName && (
                                        <div className="flex items-center justify-between text-[10px] opacity-80 px-1 pt-0.5">
                                          <span className="truncate max-w-[130px] font-medium">{msg.mediaName}</span>
                                          {msg.mediaSize && <span className="font-semibold">{msg.mediaSize}</span>}
                                        </div>
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                              )}

                              {/* Text Message */}
                              {msg.text && (
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 mt-1 px-1">
                              <span className={`text-[9px] ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {msg.timestamp}
                              </span>
                              {!isAdmin &&
                                (msg.read ? (
                                  <CheckCheck className="w-3 h-3 text-blue-500" />
                                ) : (
                                  <Check className="w-3 h-3 text-gray-400" />
                                ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Footer Input Form */}
                  <form
                    onSubmit={handleSendMessage}
                    className={`p-3 border-t flex gap-2 items-center ${
                      theme === 'light' ? 'bg-white border-gray-100' : 'bg-white/5 border-white/5'
                    }`}
                  >
                    {/* Hidden Image Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleSelectImage}
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                    />

                    {/* Image Attachment Button */}
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                        theme === 'light'
                          ? 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                      }`}
                      title="Kirim Foto"
                      aria-label="Kirim Foto"
                    >
                      {isUploading ? (
                        <Loader2 className="w-4.5 h-4.5 animate-spin text-primary-500" />
                      ) : (
                        <ImagePlus className="w-4.5 h-4.5" />
                      )}
                    </button>

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
          <div className="relative bg-white border border-gray-200 hover:border-primary-600 p-3.5 rounded-full shadow-2xl shadow-primary-950/20 hover:shadow-primary-900/30 transition-all duration-300 flex items-center justify-center">
            <Image
              src="/favicon.png"
              alt="Chat Admin SOOBIN"
              width={28}
              height={28}
              className="object-contain drop-shadow-2xs"
              priority
            />

            {/* Unread Count Badge */}
            {unreadCount > 0 && user && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </div>
        </motion.button>
      </div>

      {/* Modal Zoom Preview Foto */}
      <AnimatePresence>
        {previewImage && (
          <div
            className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative max-w-2xl w-full max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 bg-black/50 border-b border-white/10 flex items-center justify-between">
                <span className="text-white text-xs font-bold truncate max-w-[240px]">
                  {previewImage.name || 'Preview Foto'}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={previewImage.url}
                    download={previewImage.name || 'foto_soobin.jpg'}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh</span>
                  </a>
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3 flex items-center justify-center overflow-auto max-h-[calc(90vh-60px)] bg-black/30">
                <img
                  src={previewImage.url}
                  alt={previewImage.name || 'Preview'}
                  className="max-h-[72vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}