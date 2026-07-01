'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Send, X, Sun, Moon, Check, CheckCheck, MessageSquare } from 'lucide-react';
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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
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

  // Set Session ID dynamically based on auth state (Guest vs specific Member account)
  useEffect(() => {
    setMessages([]);
    setUnreadCount(0);

    if (user) {
      const memberSessId = `chat_member_${user.email.replace(/[@.]/g, '_')}`;
      setSessionId(memberSessId);
    } else {
      let guestSessId = localStorage.getItem('soobin_chat_guest_session_id');
      if (!guestSessId) {
        guestSessId = `chat_guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        localStorage.setItem('soobin_chat_guest_session_id', guestSessId);
      }
      setSessionId(guestSessId);
    }
  }, [user]);

  // Sync session with logged-in user profile info
  useEffect(() => {
    if (!sessionId) return;

    const syncProfile = async () => {
      try {
        const res = await fetch(BUCKET_URL);
        let cloudChats: { [id: string]: ChatSession } = {};
        if (res.ok) {
          cloudChats = await res.json();
        }

        let session = cloudChats[sessionId] as ChatSession;

        if (!session) {
          // Restore from local storage if available to prevent reload clearing issues
          const localChatsStr = localStorage.getItem('soobin_chats') || '{}';
          const localChats = JSON.parse(localChatsStr);
          const localSession = localChats[sessionId] as ChatSession;

          if (localSession && localSession.messages.length > 0) {
            session = localSession;
          } else {
            session = {
              id: sessionId,
              name: user ? user.name : `Guest #${sessionId.slice(-4)}`,
              email: user ? user.email : '',
              university: user ? user.university : '',
              prodi: user ? user.prodi : '',
              lastUpdated: new Date().toISOString(),
              unreadCount: 0,
              userUnreadCount: 0,
              messages: [],
            };
          }
          cloudChats[sessionId] = session;
          
          await fetch(BUCKET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cloudChats),
          });
        } else if (user && (session.name !== user.name || session.email !== user.email)) {
          session.name = user.name;
          session.email = user.email;
          session.university = user.university;
          session.prodi = user.prodi;
          cloudChats[sessionId] = session;

          await fetch(BUCKET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cloudChats),
          });
        }

        const localChatsStr = localStorage.getItem('soobin_chats') || '{}';
        const localChats = JSON.parse(localChatsStr);
        localChats[sessionId] = session;
        localStorage.setItem('soobin_chats', JSON.stringify(localChats));

        setMessages(session.messages);
        setUnreadCount(session.userUnreadCount);
      } catch (e) {
        console.error('Failed to sync profile with cloud', e);
      }
    };

    syncProfile();
  }, [sessionId, user]);

  // Cloud sync handler
  const syncWithCloud = async (currentSessionId: string, currentIsOpen: boolean) => {
    if (!currentSessionId) return;
    try {
      const res = await fetch(BUCKET_URL);
      if (!res.ok) return;
      const cloudChats = await res.json();

      const cloudSession = cloudChats[currentSessionId] as ChatSession;
      if (!cloudSession) return;

      const chatsStr = localStorage.getItem('soobin_chats') || '{}';
      const localChats = JSON.parse(chatsStr);
      const localSession = localChats[currentSessionId] as ChatSession;

      let hasChanges = false;
      let mergedMessages = localSession ? [...localSession.messages] : [];

      // Merge messages from cloud
      const localMsgIds = new Set(mergedMessages.map(m => m.id));
      cloudSession.messages.forEach((m) => {
        if (localMsgIds.has(m.id)) {
          const existing = mergedMessages.find(x => x.id === m.id);
          if (existing && existing.read !== m.read) {
            existing.read = m.read;
            hasChanges = true;
          }
        } else {
          mergedMessages.push(m);
          hasChanges = true;
        }
      });

      const getMessageTime = (msg: Message) => {
        if (msg.createdAt) return msg.createdAt;
        const match = msg.id.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      };
      mergedMessages.sort((a, b) => getMessageTime(a) - getMessageTime(b));

      const updatedSession: ChatSession = {
        id: currentSessionId,
        name: cloudSession.name || (user ? user.name : `Guest #${currentSessionId.slice(-4)}`),
        email: cloudSession.email || (user ? user.email : ''),
        university: cloudSession.university || (user ? user.university : ''),
        prodi: cloudSession.prodi || (user ? user.prodi : ''),
        lastUpdated: cloudSession.lastUpdated || new Date().toISOString(),
        unreadCount: cloudSession.unreadCount,
        userUnreadCount: currentIsOpen ? 0 : cloudSession.userUnreadCount,
        messages: mergedMessages,
      };

      if (hasChanges || !localSession || localSession.userUnreadCount !== updatedSession.userUnreadCount) {
        localChats[currentSessionId] = updatedSession;
        localStorage.setItem('soobin_chats', JSON.stringify(localChats));
        setMessages(mergedMessages);
        setUnreadCount(updatedSession.userUnreadCount);

        // Clear user unread count if opened
        if (currentIsOpen && cloudSession.userUnreadCount > 0) {
          updatedSession.userUnreadCount = 0;
          localChats[currentSessionId] = updatedSession;
          localStorage.setItem('soobin_chats', JSON.stringify(localChats));
          
          cloudChats[currentSessionId] = updatedSession;
          await fetch(BUCKET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cloudChats),
          });
        }

        window.dispatchEvent(new Event('soobin_chat_update'));
      }
    } catch (e) {
      console.error('Failed to sync with cloud', e);
    }
  };

  // 2-second cloud polling sync loop
  useEffect(() => {
    if (!sessionId) return;

    syncWithCloud(sessionId, isOpen);

    const interval = setInterval(() => {
      syncWithCloud(sessionId, isOpen);
    }, 2000);

    return () => clearInterval(interval);
  }, [sessionId, isOpen]);

  // Local storage same-tab listener
  useEffect(() => {
    if (!sessionId) return;

    const handleLocalUpdate = () => {
      try {
        const chatsStr = localStorage.getItem('soobin_chats') || '{}';
        const chats = JSON.parse(chatsStr);
        const session = chats[sessionId] as ChatSession;
        if (session) {
          setMessages(session.messages);
          setUnreadCount(isOpen ? 0 : session.userUnreadCount);
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('storage', handleLocalUpdate);
    window.addEventListener('soobin_chat_update', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleLocalUpdate);
      window.removeEventListener('soobin_chat_update', handleLocalUpdate);
    };
  }, [sessionId, isOpen]);

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
    if (!messageText.trim() || !sessionId) return;

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

    const text = messageText;
    setMessageText('');

    try {
      const res = await fetch(BUCKET_URL);
      let cloudChats: { [id: string]: ChatSession } = {};
      if (res.ok) {
        cloudChats = await res.json();
      }

      let session = cloudChats[sessionId] as ChatSession;
      if (!session) {
        session = {
          id: sessionId,
          name: user ? user.name : `Guest #${sessionId.slice(-4)}`,
          email: user ? user.email : '',
          university: user ? user.university : '',
          prodi: user ? user.prodi : '',
          lastUpdated: now.toISOString(),
          unreadCount: 0,
          userUnreadCount: 0,
          messages: [],
        };
      }

      if (user) {
        session.name = user.name;
        session.email = user.email;
        session.university = user.university;
        session.prodi = user.prodi;
      }

      session.messages.push(newMsg);
      session.lastUpdated = now.toISOString();
      session.unreadCount += 1;

      cloudChats[sessionId] = session;

      await fetch(BUCKET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cloudChats),
      });

      const localChatsStr = localStorage.getItem('soobin_chats') || '{}';
      const localChats = JSON.parse(localChatsStr);
      localChats[sessionId] = session;
      localStorage.setItem('soobin_chats', JSON.stringify(localChats));

      setMessages([...session.messages]);
      window.dispatchEvent(new Event('soobin_chat_update'));
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
                  <h3 className="text-sm font-bold">Admin Live</h3>
                  <span className="text-[10px] text-green-500 font-medium">Aktif Sekarang</span>
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
            <div
              className={`flex-1 overflow-y-auto p-4 space-y-3.5 ${
                theme === 'light' ? 'bg-gray-50/50' : 'bg-black/10'
              }`}
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-2">
                  <MessageSquare className={`w-12 h-12 ${theme === 'light' ? 'text-gray-300' : 'text-white/15'}`} />
                  <p className={`text-xs font-medium max-w-[200px] ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Halo! Admin Live siap membantu kebutuhan akademik Anda. Kirim pesan di bawah untuk memulai chat.
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
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </div>
      </motion.button>
    </div>
  );
}