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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('soobin_session');
      if (savedSession) {
        setUser(JSON.parse(savedSession));
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

      // Sync member to Cloud Database for Admin Dashboard
      fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      }).catch(console.error);

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
            className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#0d1224]/80 backdrop-blur-md text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.05, duration: 0.25 }}
            >
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-primary-800 border-r-green-500 animate-spin"></div>
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold tracking-tight text-white">Sedang Keluar...</h3>
                <p className="text-xs text-gray-400 mt-1 px-4">Menghapus sesi aman Anda dan memulihkan harga normal</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
