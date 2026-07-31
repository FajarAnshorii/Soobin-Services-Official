'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { X, Clock, Upload, CheckCircle, AlertTriangle, QrCode, ShieldCheck, ArrowRight } from 'lucide-react';

interface QrisPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    id: string;
    customerName: string;
    serviceName: string;
    price: string;
    category: string;
    customFields: Record<string, string>;
  };
  onPaymentSuccess: (proofBase64: string) => void;
}

export default function QrisPaymentModal({
  isOpen,
  onClose,
  orderData,
  onPaymentSuccess,
}: QrisPaymentModalProps) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(300);
      setIsExpired(false);
      setProofImage(null);
      setError('');
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran foto maksimal 5MB');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setProofImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitPayment = () => {
    if (isExpired) {
      setError('Waktu pembayaran telah habis. Silakan buat pesanan baru.');
      return;
    }

    if (!proofImage) {
      setError('Harap upload bukti pembayaran terlebih dahulu!');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      onPaymentSuccess(proofImage);
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden my-6 border border-gray-100"
      >
        {/* Header */}
        <div className="bg-primary-800 text-white p-5 flex items-center justify-between relative">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Pembayaran QRIS</h3>
              <p className="text-xs text-primary-200">Scan QRIS Soobin Services</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer Bar */}
        <div
          className={`px-5 py-2.5 flex items-center justify-between text-xs font-bold ${
            isExpired
              ? 'bg-red-500 text-white'
              : timeLeft < 60
              ? 'bg-amber-500 text-white animate-pulse'
              : 'bg-primary-50 text-primary-900 border-b border-primary-100'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{isExpired ? 'Batas Waktu Habis!' : 'Batas Waktu Pembayaran:'}</span>
          </div>
          <span className="font-mono text-sm tracking-wider">{formatTime(timeLeft)}</span>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5">
          {/* Order Summary Card */}
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200/70 text-xs space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Pemesan:</span>
              <span className="font-semibold text-dark-800">{orderData.customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Layanan:</span>
              <span className="font-bold text-primary-800">{orderData.serviceName}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-gray-200">
              <span className="font-bold text-dark-800">Total Tagihan:</span>
              <span className="font-bold text-base text-green-600">{orderData.price}</span>
            </div>
          </div>

          {isExpired ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
              <h4 className="font-bold text-sm text-red-700">Waktu Pembayaran Kedaluwarsa</h4>
              <p className="text-xs text-red-600">
                Waktu 5 menit telah habis. Pesanan ini dibatalkan secara otomatis. Silakan tutup dan buat pesanan baru.
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Tutup Pembayaran
              </button>
            </div>
          ) : (
            <>
              {/* QRIS Image Container */}
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="relative w-64 h-72 rounded-lg overflow-hidden border border-gray-300 shadow-sm bg-white p-2">
                  <Image
                    src="/qris.jpg"
                    alt="Scan QRIS Pembayaran Soobin Services"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-2 text-center font-medium">
                  Scan QRIS menggunakan Mobile Banking atau E-Wallet (GoPay, OVO, ShopeePay, Dana, LinkAja)
                </p>
              </div>

              {/* Instruction Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  <strong>Penting:</strong> Setelah berhasil melakukan pembayaran QRIS, silakan <strong>screenshot bukti transfer/pembayaran</strong> lalu unggah pada form di bawah ini.
                </p>
              </div>

              {/* Upload Proof Card */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-dark-800">
                  Upload Bukti Pembayaran <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 hover:border-primary-800 rounded-xl p-4 text-center transition-all bg-gray-50 hover:bg-white cursor-pointer relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {proofImage ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        <Image
                          src={proofImage}
                          alt="Preview Bukti Pembayaran"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-xs font-bold text-green-700 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Bukti Ter-upload
                        </p>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">Klik untuk mengganti foto</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-gray-500">
                      <Upload className="w-6 h-6 text-primary-800 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-dark-700">Lampirkan Bukti Bayar / Screenshot</span>
                      <span className="text-[10px] text-gray-400">Format JPG, PNG (Maks 5MB)</span>
                    </div>
                  )}
                </div>
                {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
              </div>

              {/* Action Button */}
              <button
                onClick={handleSubmitPayment}
                disabled={submitting || !proofImage}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  proofImage
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/25'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {submitting ? (
                  <span>Memproses Pesanan...</span>
                ) : (
                  <>
                    <span>Sudah Bayar & Kirim Pesanan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
