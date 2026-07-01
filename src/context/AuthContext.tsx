'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
    localStorage.removeItem('soobin_session');
    setUser(null);
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
