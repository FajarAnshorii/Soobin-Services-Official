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

// Helper to auto-sync user profile to Supabase via /api/members
const syncMemberToSupabase = (userData: User) => {
  if (!userData || !userData.email) return;
  fetch('/api/members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      university: userData.university,
      prodi: userData.prodi,
      createdAt: new Date().toISOString(),
    }),
  }).catch(console.error);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Load session from localStorage on mount & sync to Supabase Cloud Database
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('soobin_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setUser(parsed);
        syncMemberToSupabase(parsed);
      }
    } catch (e) {
      console.error('Failed to load session', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = async (userData: User & { password?: string }): Promise<boolean> => {
    try {
      const usersStr = localStorage.getItem('soobin_users') || '[]';
      const users = JSON.parse(usersStr);

      // Check if user already exists
      const existingUser = users.find((u: any) => u.email.toLowerCase() === userData.email.toLowerCase());
      if (existingUser) {
        throw new Error('Email sudah terdaftar');
      }

      // Save user profile + credentials
      const newUser = {
        email: userData.email.toLowerCase(),
        password: userData.password || '',
        name: userData.name,
        university: userData.university,
        prodi: userData.prodi,
      };

      users.push(newUser);
      localStorage.setItem('soobin_users', JSON.stringify(users));

      // Realtime Sync member to Supabase Cloud Database
      syncMemberToSupabase(newUser);

      // Auto login after register
      const sessionUser: User = {
        email: newUser.email,
        name: newUser.name,
        university: newUser.university,
        prodi: newUser.prodi,
      };

      localStorage.setItem('soobin_session', JSON.stringify(sessionUser));
      setUser(sessionUser);
      return true;
    } catch (err: any) {
      console.error('Registration error:', err);
      throw err;
    }
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const usersStr = localStorage.getItem('soobin_users') || '[]';
      const users = JSON.parse(usersStr);

      const foundUser = users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === (password || '')
      );

      if (!foundUser) {
        throw new Error('Email atau password salah');
      }

      const sessionUser: User = {
        email: foundUser.email,
        name: foundUser.name,
        university: foundUser.university,
        prodi: foundUser.prodi,
      };

      localStorage.setItem('soobin_session', JSON.stringify(sessionUser));
      setUser(sessionUser);

      // Realtime Sync member to Supabase Cloud Database on login
      syncMemberToSupabase(sessionUser);
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('soobin_session');
      setUser(null);
      setIsLoggingOut(false);
    }, 1500);
  };

  const forgotPassword = async (email: string, newPassword?: string): Promise<boolean> => {
    try {
      const usersStr = localStorage.getItem('soobin_users') || '[]';
      const users = JSON.parse(usersStr);

      const userIndex = users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (userIndex === -1) {
        throw new Error('Email tidak ditemukan');
      }

      users[userIndex].password = newPassword || '';
      localStorage.setItem('soobin_users', JSON.stringify(users));
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
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
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
