'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Link from 'next/link';
import {
  FileText,
  Clock,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

export default function WordCounterPage() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        charactersWithSpaces: 0,
        charactersWithoutSpaces: 0,
        paragraphs: 0,
        sentences: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
        estimatedPages: 0,
      };
    }

    const words = trimmed.split(/\s+/).filter(Boolean).length;
    const charactersWithSpaces = text.length;
    const charactersWithoutSpaces = text.replace(/\s/g, '').length;
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    // Average reading speed: 200 words/min. Speaking speed: 130 words/min. Pages: ~300 words/page (double spaced, 12pt).
    const readingTimeMinutes = Math.ceil(words / 200);
    const speakingTimeMinutes = Math.ceil(words / 130);
    const estimatedPages = +(words / 300).toFixed(1);

    return {
      words,
      charactersWithSpaces,
      charactersWithoutSpaces,
      paragraphs,
      sentences,
      readingTimeMinutes,
      speakingTimeMinutes,
      estimatedPages,
    };
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <section className="pt-28 sm:pt-36 pb-8 sm:pb-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <FileText className="w-3.5 h-3.5 text-primary-700" />
            <span>Mini Tool Akademik Gratis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Penghitung Kata & Waktu Baca
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hitung jumlah kata, karakter, paragraf, kalimat, serta estimasi waktu membaca dan jumlah halaman naskah makalah/skripsi Anda.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Kata</span>
              <span className="text-2xl font-extrabold text-slate-900">{stats.words}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Karakter</span>
              <span className="text-2xl font-extrabold text-slate-900">{stats.charactersWithSpaces}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Est. Halaman</span>
              <span className="text-2xl font-extrabold text-slate-900">{stats.estimatedPages}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Waktu Baca</span>
              <span className="text-2xl font-extrabold text-slate-900">{stats.readingTimeMinutes} mnt</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Paragraf</span>
              <span className="text-2xl font-extrabold text-slate-900">{stats.paragraphs}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Kalimat</span>
              <span className="text-2xl font-extrabold text-slate-900">{stats.sentences}</span>
            </div>
          </div>

          {/* Textarea Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Tulis atau Tempelkan Teks Dokumen Anda:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!text}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={!text}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <textarea
              rows={12}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ketik atau paste naskah skripsi, jurnal, essay, atau artikel Anda di sini..."
              className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 outline-none leading-relaxed resize-y font-mono"
            />
          </div>

          {/* Quick link to Daftar Pustaka Generator */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-800 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Perlu Buat Daftar Pustaka Otomatis?</h3>
                <p className="text-[11px] text-slate-500">Gunakan tool Generator Sitasi APA, Harvard, IEEE & MLA secara gratis.</p>
              </div>
            </div>
            <Link
              href="/tools/daftar-pustaka"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <span>Buka Generator Sitasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
