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

export default function WhatsAppFloat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [messageText, setMessageText] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or fetch Session ID
  useEffect(() => {
    let sessId = localStorage.getItem('soobin_chat_session_id');
    if (!sessId) {
      sessId = `chat_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem('soobin_chat_session_id', sessId);
    }
    setSessionId(sessId);

    // Initialize Theme
    const savedTheme = localStorage.getItem('soobin_chat_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Sync session with logged-in user profile info
  useEffect(() => {
    if (!sessionId) return;

    const chatsStr = localStorage.getItem('soobin_chats') || '{}';
    const chats = JSON.parse(chatsStr);
    let session = chats[sessionId] as ChatSession;

    if (!session) {
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
      chats[sessionId] = session;
      localStorage.setItem('soobin_chats', JSON.stringify(chats));
    } else if (user) {
      // Update profile info if user logged in
      session.name = user.name;
      session.email = user.email;
      session.university = user.university;
      session.prodi = user.prodi;
      chats[sessionId] = session;
      localStorage.setItem('soobin_chats', JSON.stringify(chats));
    }

    setMessages(session.messages);
    setUnreadCount(session.userUnreadCount);
  }, [sessionId, user]);

  // Load chat and listen to storage updates (for realtime admin replies)
  useEffect(() => {
    if (!sessionId) return;

    const loadChat = () => {
      try {
        const chatsStr = localStorage.getItem('soobin_chats') || '{}';
        const chats = JSON.parse(chatsStr);
        const session = chats[sessionId] as ChatSession;
        if (session) {
          setMessages(session.messages);
          setUnreadCount(isOpen ? 0 : session.userUnreadCount);

          // Clear user unread count if chat is open
          if (isOpen && session.userUnreadCount > 0) {
            session.userUnreadCount = 0;
            chats[sessionId] = session;
            localStorage.setItem('soobin_chats', JSON.stringify(chats));
            // Trigger storage event manually for other tabs
            window.dispatchEvent(new Event('storage'));
          }
        }
      } catch (e) {
        console.error('Failed to load chats', e);
      }
    };

    loadChat();

    // Listen to changes in localStorage
    const handleStorageChange = () => {
      loadChat();
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event to handle updates within the same window
    window.addEventListener('soobin_chat_update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('soobin_chat_update', handleStorageChange);
    };
  }, [sessionId, isOpen]);

  // Scroll to bottom when messages update
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

  const handleSendMessage = (e: React.FormEvent) => {
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
    };

    // Update LocalStorage
    const chatsStr = localStorage.getItem('soobin_chats') || '{}';
    const chats = JSON.parse(chatsStr);
    const session = chats[sessionId] as ChatSession;

    if (session) {
      session.messages.push(newMsg);
      session.lastUpdated = now.toISOString();
      session.unreadCount += 1; // Increment unread count for admin
      chats[sessionId] = session;
      localStorage.setItem('soobin_chats', JSON.stringify(chats));
      
      setMessages([...session.messages]);
      setMessageText('');

      // Dispatch custom event to notify same-tab listeners
      window.dispatchEvent(new Event('soobin_chat_update'));

      // Check if admin is online (if we have admin tab open, it will reply. Else, trigger fallback)
      const adminOnline = localStorage.getItem('soobin_admin_active') === 'true';
      if (!adminOnline) {
        // Trigger automated mock response after 3 seconds
        setTimeout(() => {
          triggerMockReply(sessionId);
        }, 3000);
      }
    }
  };

  const triggerMockReply = (currentSessionId: string) => {
    const chatsStr = localStorage.getItem('soobin_chats') || '{}';
    const chats = JSON.parse(chatsStr);
    const session = chats[currentSessionId] as ChatSession;

    if (session && session.messages.length > 0) {
      // Check if last message was from user (don't reply if admin already replied)
      const lastMsg = session.messages[session.messages.length - 1];
      if (lastMsg.sender === 'user') {
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        const mockReplies = [
          "Halo Kak! Terima kasih telah menghubungi Soobin Services. Admin Live siap membantu kebutuhan akademik Anda.",
          "Ada yang bisa kami bantu hari ini? Kami melayani Cek Turnitin & AI, Jasa Parafrase, Joki Tugas Kuliah/Sekolah, dan Jasa Skripsi.",
          "Silakan kirimkan detail tugas, deadline, atau pertanyaan Kakak agar bisa langsung kami periksa dan berikan estimasi harga terbaik ya!"
        ];

        // Pick reply based on message index
        const userMsgCount = session.messages.filter(m => m.sender === 'user').length;
        const replyIndex = Math.min(userMsgCount - 1, mockReplies.length - 1);
        const replyText = mockReplies[replyIndex];

        const mockMsg: Message = {
          id: `msg_mock_${Date.now()}`,
          sender: 'admin',
          text: replyText,
          timestamp: timeString,
          read: true,
        };

        session.messages.push(mockMsg);
        session.lastUpdated = now.toISOString();
        session.userUnreadCount += 1;
        chats[currentSessionId] = session;
        localStorage.setItem('soobin_chats', JSON.stringify(chats));

        // Update local state if session matches
        if (currentSessionId === sessionId) {
          setMessages([...session.messages]);
          if (!isOpen) {
            setUnreadCount(prev => prev + 1);
          }
        }

        // Notify same-tab listeners
        window.dispatchEvent(new Event('soobin_chat_update'));
      }
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
                        className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium break-words w-full ${
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