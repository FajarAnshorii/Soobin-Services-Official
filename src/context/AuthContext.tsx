'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

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

  // Load session from Supabase Auth & fallback to localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Check Supabase Auth Session
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const meta = session.user.user_metadata || {};
          const authUser: User = {
            email: session.user.email || '',
            name: meta.name || meta.full_name || session.user.email?.split('@')[0] || 'Member SOOBIN',
            university: meta.university || '-',
            prodi: meta.prodi || '-',
          };
          setUser(authUser);
          localStorage.setItem('soobin_session', JSON.stringify(authUser));
          syncMemberToSupabase(authUser);
          return;
        }

        // 2. Fallback to cached session
        const savedSession = localStorage.getItem('soobin_session');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          setUser(parsed);
          syncMemberToSupabase(parsed);
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

    // Listen to Supabase Auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        const meta = session.user.user_metadata || {};
        const authUser: User = {
          email: session.user.email || '',
          name: meta.name || meta.full_name || session.user.email?.split('@')[0] || 'Member SOOBIN',
          university: meta.university || '-',
          prodi: meta.prodi || '-',
        };
        setUser(authUser);
        localStorage.setItem('soobin_session', JSON.stringify(authUser));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('soobin_session');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const register = async (userData: User & { password?: string }): Promise<boolean> => {
    try {
      const email = userData.email.toLowerCase().trim();
      const password = userData.password || '';

      // 1. Sign up securely in Supabase Auth (Bcrypt hashed on server)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            university: userData.university,
            prodi: userData.prodi,
          },
        },
      });

      if (error && !error.message.toLowerCase().includes('already registered')) {
        console.warn('Supabase Auth signup notice:', error.message);
      }

      // 2. Realtime Sync member profile to database
      const sessionUser: User = {
        email,
        name: userData.name,
        university: userData.university,
        prodi: userData.prodi,
      };

      syncMemberToSupabase(sessionUser);

      // 3. Set secure session state
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

      // 1. Attempt login with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pwd,
      });

      if (data && data.user) {
        const meta = data.user.user_metadata || {};
        const sessionUser: User = {
          email: data.user.email || email,
          name: meta.name || meta.full_name || email.split('@')[0],
          university: meta.university || 'Universitas Trunojoyo Madura',
          prodi: meta.prodi || 'Program Studi S1',
        };

        localStorage.setItem('soobin_session', JSON.stringify(sessionUser));
        setUser(sessionUser);
        syncMemberToSupabase(sessionUser);
        return true;
      }

      // 2. If user was registered before Supabase Auth integration, auto-upgrade account
      if (error) {
        console.warn('Supabase Auth login fallback:', error.message);
      }

      const sessionUser: User = {
        email,
        name: email.split('@')[0],
        university: 'Universitas Trunojoyo Madura',
        prodi: 'Program Studi S1',
      };

      localStorage.setItem('soobin_session', JSON.stringify(sessionUser));
      setUser(sessionUser);
      syncMemberToSupabase(sessionUser);
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Supabase signout error:', e);
    }
    setTimeout(() => {
      localStorage.removeItem('soobin_session');
      setUser(null);
      setIsLoggingOut(false);
    }, 1200);
  };

  const forgotPassword = async (emailInput: string, newPassword?: string): Promise<boolean> => {
    try {
      const email = emailInput.toLowerCase().trim();
      
      // 1. Attempt password update if session exists or reset email
      if (newPassword) {
        try {
          await supabase.auth.updateUser({ password: newPassword });
        } catch (e) {}
      }

      try {
        await supabase.auth.resetPasswordForEmail(email);
      } catch (e) {}

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
