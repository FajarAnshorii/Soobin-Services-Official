'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface User {
  email: string;
  name: string;
  university: string;
  prodi: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (userData: User & { password?: string }) => Promise<boolean>;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string, newPassword?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to hash password securely with Web Crypto SHA-256
async function hashPassword(password: string): Promise<string> {
  if (!password) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_soobin_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Helper to auto-sync user profile to Cloudflare D1 via /api/members
const syncMemberToDatabase = (userData: User, passwordHash?: string) => {
  if (!userData || !userData.email) return;
  fetch('/api/members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      university: userData.university,
      prodi: userData.prodi,
      passwordHash: passwordHash || null,
      createdAt: new Date().toISOString(),
    }),
  }).catch(console.error);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const savedSession = localStorage.getItem('soobin_session');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed && parsed.email) {
            setUser(parsed);
            syncMemberToDatabase(parsed);
          }
        }
      } catch (e) {
        console.error('Failed to load auth session', e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Clean up legacy plaintext credentials if any
    try {
      localStorage.removeItem('soobin_users');
    } catch {}
  }, []);

  const register = async (userData: User & { password?: string }): Promise<boolean> => {
    try {
      const email = userData.email.toLowerCase().trim();
      const password = userData.password || '';
      const passwordHash = await hashPassword(password);

      const sessionUser: User = {
        email,
        name: userData.name || 'Member SOOBIN',
        university: userData.university || 'Universitas Trunojoyo Madura',
        prodi: userData.prodi || 'Program Studi S1',
      };

      // 1. Save member to Cloudflare D1 Database
      await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sessionUser.name,
          email: sessionUser.email,
          university: sessionUser.university,
          prodi: sessionUser.prodi,
          passwordHash,
          createdAt: new Date().toISOString(),
        }),
      });

      // 2. Set active session state
      localStorage.setItem('soobin_session', JSON.stringify(sessionUser));
      setUser(sessionUser);
      return true;
    } catch (err: any) {
      console.error('Registration error:', err);
      throw err;
    }
  };

  const login = async (emailInput: string, password?: string): Promise<boolean> => {
    try {
      const email = emailInput.toLowerCase().trim();
      const pwd = password || '';
      const passwordHash = await hashPassword(pwd);

      const sessionUser: User = {
        email,
        name: email.split('@')[0],
        university: 'Universitas Trunojoyo Madura',
        prodi: 'Program Studi S1',
      };

      // Sync member record to Cloudflare D1
      syncMemberToDatabase(sessionUser, passwordHash);

      localStorage.setItem('soobin_session', JSON.stringify(sessionUser));
      setUser(sessionUser);
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('soobin_session');
      setUser(null);
      setIsLoggingOut(false);
    }, 1000);
  };

  const forgotPassword = async (emailInput: string, newPassword?: string): Promise<boolean> => {
    try {
      const email = emailInput.toLowerCase().trim();
      if (newPassword) {
        const passwordHash = await hashPassword(newPassword);
        syncMemberToDatabase({
          email,
          name: email.split('@')[0],
          university: 'Universitas Trunojoyo Madura',
          prodi: 'Program Studi S1',
        }, passwordHash);
      }
      return true;
    } catch (err: any) {
      console.error('Forgot password error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, forgotPassword }}>
      {children}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md text-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl text-slate-900 shadow-2xl max-w-sm w-full text-center"
            >
              <div className="w-12 h-12 border-4 border-primary-700 border-t-transparent rounded-full animate-spin"></div>
              <h3 className="text-xl font-bold text-slate-900">Keluar dari Sesi...</h3>
              <p className="text-sm text-slate-900">Terima kasih telah menggunakan SOOBIN Services!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
