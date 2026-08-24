'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SERVICE_OPTIONS = [
  'Jasa Parafrase & Turnitin 0%',
  'Jasa Desain PPT Sidang Skripsi',
  'Pengolahan Data SPSS / SmartPLS / AMOS',
  'Formatting Jurnal & Fast Track Sinta',
  'Jasa Pembuatan Website & Aplikasi',
  'Konsultasi Skripsi & Tugas Akhir',
  'Layanan Akademik Lainnya',
];

export default function TestimonialModal({ isOpen, onClose, onSuccess }: TestimonialModalProps) {
  const { user } = useAuth();
  const { addToast } = useCart();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [serviceName, setServiceName] = useState<string>(SERVICE_OPTIONS[0]);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Silakan login terlebih dahulu untuk memberikan ulasan.');
      return;
    }

    if (!comment.trim() || comment.trim().length < 2) {
      setErrorMsg('Mohon tuliskan pesan ulasan testimoni Anda.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          university: user.university || 'Mahasiswa',
          prodi: user.prodi || '',
          serviceName,
          rating,
          comment: comment.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal mengirim ulasan');
      }

      addToast('Terima kasih! Ulasan & rating Anda telah berhasil dipublikasikan.', 'success');
      setComment('');
      setRating(5);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat mengirim testimoni.');
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5: return '5 - Sangat Puas ⭐⭐⭐⭐⭐';
      case 4: return '4 - Puas ⭐⭐⭐⭐';
      case 3: return '3 - Cukup ⭐⭐⭐';
      case 2: return '2 - Kurang ⭐⭐';
      case 1: return '1 - Sangat Kurang ⭐';
      default: return '';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8"
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-slate-900 px-6 py-5 text-white flex justify-between items-center relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-amber-400 backdrop-blur-md">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg">Tulis Testimoni & Rating</h3>
                <p className="text-xs text-slate-300">Bagikan pengalaman Anda menggunakan jasa SOOBIN</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content / Form */}
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Member Profile Banner */}
            {user && (
              <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-800 text-white flex items-center justify-center font-black text-sm shrink-0 uppercase">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col truncate">
                  <span className="font-bold text-xs text-slate-900 truncate">{user.name}</span>
                  <span className="text-[11px] text-slate-500 truncate">{user.university} • {user.prodi}</span>
                </div>
              </div>
            )}

            {/* Rating Stars Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Berikan Rating Bintang
              </label>
              <div className="flex items-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          active
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-max">
                {getRatingLabel(hoverRating || rating)}
              </span>
            </div>

            {/* Service Dropdown Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pilih Jasa yang Digunakan
              </label>
              <select
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-primary-800"
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Review Comment Textarea */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Ulasan / Pesan Testimoni
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  {comment.length} karakter
                </span>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ceritakan pengalaman Anda saat memesan jasa di SOOBIN Services (kecepatan, kerapian hasil, pelayanan admin, dll)..."
                rows={4}
                className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary-800 placeholder:text-slate-400"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-primary-800 hover:bg-primary-750 text-white transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-t-2 border-b-2 border-white"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Testimoni</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
