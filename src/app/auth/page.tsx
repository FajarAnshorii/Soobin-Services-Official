'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, Mail, Lock, User as UserIcon, GraduationCap, School, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import UniversityCombobox from '@/components/UniversityCombobox';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LdkeN8sAAAAAECiWedvyA2TQfTtvD6iEg19fo4I';

export default function AuthPage() {
  const router = useRouter();
  const { user, register, login, forgotPassword } = useAuth();
  const { addToast } = useCart();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/layanan');
    }
  }, [user, router]);

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [prodi, setProdi] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleTabChange = (tab: 'login' | 'register' | 'forgot') => {
    clearMessages();
    setCaptchaToken('');
    recaptchaRef.current?.reset();
    setActiveTab(tab);
  };

  // Helper to verify captcha token via server API
  const verifyCaptcha = async (token: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email || !password) {
      setError('Harap isi semua kolom');
      addToast('Harap isi semua kolom', 'warning');
      return;
    }

    if (!captchaToken) {
      setError('Harap centang verifikasi "Saya bukan robot" terlebih dahulu!');
      addToast('Harap centang verifikasi reCAPTCHA!', 'warning');
      return;
    }

    setLoading(true);
    try {
      const isCaptchaValid = await verifyCaptcha(captchaToken);
      if (!isCaptchaValid) {
        throw new Error('Verifikasi reCAPTCHA tidak valid atau telah kedaluwarsa. Silakan centang ulang.');
      }

      await login(email, password);
      addToast('Login berhasil! Selamat datang kembali.', 'success');
      setSuccess('Login berhasil! Mengalihkan...');
      setTimeout(() => {
        router.push('/layanan');
      }, 1500);
    } catch (err: any) {
      const errMsg = err.message || 'Login gagal, periksa email dan password Anda';
      setError(errMsg);
      addToast(errMsg, 'error');
      setCaptchaToken('');
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email || !password || !name || !university || !prodi) {
      setError('Harap isi semua kolom');
      addToast('Harap isi semua kolom', 'warning');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      addToast('Password minimal 6 karakter', 'warning');
      return;
    }

    if (!captchaToken) {
      setError('Harap centang verifikasi "Saya bukan robot" terlebih dahulu!');
      addToast('Harap centang verifikasi reCAPTCHA!', 'warning');
      return;
    }

    setLoading(true);
    try {
      const isCaptchaValid = await verifyCaptcha(captchaToken);
      if (!isCaptchaValid) {
        throw new Error('Verifikasi reCAPTCHA tidak valid atau telah kedaluwarsa. Silakan centang ulang.');
      }

      await register({ email, password, name, university, prodi });
      addToast('Registrasi berhasil! Selamat bergabung menjadi member.', 'success');
      setSuccess('Registrasi berhasil! Selamat bergabung...');
      setTimeout(() => {
        router.push('/layanan');
      }, 1500);
    } catch (err: any) {
      const errMsg = err.message || 'Registrasi gagal';
      setError(errMsg);
      addToast(errMsg, 'error');
      setCaptchaToken('');
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email || !password || !confirmPassword) {
      setError('Harap isi semua kolom');
      addToast('Harap isi semua kolom', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      addToast('Konfirmasi password tidak cocok', 'warning');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      addToast('Password minimal 6 karakter', 'warning');
      return;
    }

    if (!captchaToken) {
      setError('Harap centang verifikasi "Saya bukan robot" terlebih dahulu!');
      addToast('Harap centang verifikasi reCAPTCHA!', 'warning');
      return;
    }

    setLoading(true);
    try {
      const isCaptchaValid = await verifyCaptcha(captchaToken);
      if (!isCaptchaValid) {
        throw new Error('Verifikasi reCAPTCHA tidak valid atau telah kedaluwarsa. Silakan centang ulang.');
      }

      await forgotPassword(email, password);
      addToast('Password berhasil diubah! Silakan login kembali.', 'success');
      setSuccess('Password berhasil diubah! Silakan login kembali.');
      setTimeout(() => {
        setActiveTab('login');
        setPassword('');
        setConfirmPassword('');
        setCaptchaToken('');
        recaptchaRef.current?.reset();
      }, 2000);
    } catch (err: any) {
      const errMsg = err.message || 'Gagal menyetel ulang password';
      setError(errMsg);
      addToast(errMsg, 'error');
      setCaptchaToken('');
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-dark-800 via-primary-900 to-dark-800 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background radial lines simulation */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      </div>
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-700/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative w-full max-w-md">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>

        {/* Auth Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative h-10 w-44">
              <Image
                src="/logo.png"
                alt="SOOBIN Services Logo"
                fill
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
          </div>

          {/* Form Title & Subtitle */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-white tracking-tight">
              {activeTab === 'login' && 'Selamat Datang Kembali'}
              {activeTab === 'register' && 'Buat Akun Member'}
              {activeTab === 'forgot' && 'Reset Password'}
            </h1>
            <p className="text-gray-400 text-xs mt-1">
              {activeTab === 'login' && 'Masuk untuk mendapatkan diskon member khusus Jasa Skripsi'}
              {activeTab === 'register' && 'Daftar sekarang dan dapatkan potongan harga 5% Jasa Skripsi'}
              {activeTab === 'forgot' && 'Masukkan password baru Anda untuk melanjutkan'}
            </p>
          </div>

          {/* Tab Selector */}
          {activeTab !== 'forgot' && (
            <div className="flex bg-white/5 p-1 rounded-xl mb-6 border border-white/5">
              <button
                className={`flex-1 text-center py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === 'login'
                    ? 'bg-primary-800 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => handleTabChange('login')}
              >
                Masuk
              </button>
              <button
                className={`flex-1 text-center py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === 'register'
                    ? 'bg-primary-800 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => handleTabChange('register')}
              >
                Daftar
              </button>
            </div>
          )}

          {/* Feedback Alerts */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                className="flex items-center gap-2 bg-red-500/25 border border-red-500/50 rounded-xl p-3 text-red-200 text-xs sm:text-sm mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                className="flex items-center gap-2 bg-green-500/25 border border-green-500/50 rounded-xl p-3 text-green-200 text-xs sm:text-sm mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-semibold">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-gray-300 text-xs font-semibold">Password</label>
                  <button
                    type="button"
                    onClick={() => handleTabChange('forgot')}
                    className="text-primary-400 hover:text-primary-350 text-[10px] sm:text-xs transition-colors"
                  >
                    Lupa Password?
                  </button>
                </div>
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

              {/* Google reCAPTCHA v2 */}
              <div className="flex justify-center my-3 overflow-hidden rounded-xl bg-black/25 p-2 border border-white/10">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  theme="dark"
                  onChange={(token) => setCaptchaToken(token || '')}
                  onExpired={() => setCaptchaToken('')}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-800 hover:bg-primary-750 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-primary-950/20 disabled:opacity-50 mt-2"
              >
                {loading ? 'Memproses...' : 'Masuk ke Akun'}
              </button>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-gray-300 text-xs font-semibold">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Lengkap Anda"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 text-xs font-semibold flex items-center justify-between">
                  <span>Universitas / Kampus</span>
                  <span className="text-[10px] text-primary-400 font-normal">Pilih / Ketik Custom</span>
                </label>
                <UniversityCombobox
                  value={university}
                  onChange={(val) => setUniversity(val)}
                  placeholder="Ketik atau cari nama universitas..."
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 text-xs font-semibold">Program Studi</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="text"
                    value={prodi}
                    onChange={(e) => setProdi(e.target.value)}
                    placeholder="Teknik Informatika, Akuntansi, dll"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 text-xs font-semibold">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 text-xs font-semibold">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Google reCAPTCHA v2 */}
              <div className="flex justify-center my-3 overflow-hidden rounded-xl bg-black/25 p-2 border border-white/10">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  theme="dark"
                  onChange={(token) => setCaptchaToken(token || '')}
                  onExpired={() => setCaptchaToken('')}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-800 hover:bg-primary-750 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-primary-950/20 disabled:opacity-50 mt-3"
              >
                {loading ? 'Mendaftarkan...' : 'Buat Akun Member'}
              </button>
            </form>
          )}

          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-semibold">Email Terdaftar</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-semibold">Password Baru</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-semibold">Konfirmasi Password Baru</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang password baru"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Google reCAPTCHA v2 */}
              <div className="flex justify-center my-3 overflow-hidden rounded-xl bg-black/25 p-2 border border-white/10">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  theme="dark"
                  onChange={(token) => setCaptchaToken(token || '')}
                  onExpired={() => setCaptchaToken('')}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="flex-1 border border-white/10 hover:bg-white/5 text-gray-300 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary-800 hover:bg-primary-750 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-primary-950/20 disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Password'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
