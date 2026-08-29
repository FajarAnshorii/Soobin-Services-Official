'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  TrendingUp,
  Share2,
  Calendar,
  CheckCircle2,
  X,
  ExternalLink,
  Eye,
  Image as ImageIcon
} from 'lucide-react';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.72 1.01-.06 1.96-.64 2.48-1.5.3-.47.47-1.02.48-1.58.05-3.38.02-6.76.03-10.14.01-3.68.01-7.36.01-11.04z" />
    </svg>
  );
}

export interface PromotedInfluencer {
  id: string;
  name: string;
  handle: string;
  platform: 'instagram' | 'tiktok' | 'youtube';
  platformUrl?: string;
  avatarUrl?: string;
  followers?: string;
  verified?: boolean;
  category: string;
  promotionTitle: string;
  caption?: string;
  proofMediaUrl: string;
  proofMediaType?: 'image' | 'video';
  promotedDate?: string;
  highlightBadge?: string;
}

// Data daftar influencer yang mempromosikan SOOBIN Services (Dikosongkan sementara)
const PROMOTED_INFLUENCERS: PromotedInfluencer[] = [];

export default function TrustedByPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeProof, setActiveProof] = useState<PromotedInfluencer | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Bukti Promosi' },
    { id: 'instagram', label: 'Instagram Story & Feed' },
    { id: 'tiktok', label: 'TikTok Review' },
    { id: 'public-figure', label: 'Figur Publik & Selebriti' },
  ];

  const filteredList = PROMOTED_INFLUENCERS.filter((item) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'instagram') return item.platform === 'instagram';
    if (selectedCategory === 'tiktok') return item.platform === 'tiktok';
    return item.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      {/* Hero Section Header */}
      <section className="relative bg-[#0B1527] pt-28 sm:pt-36 pb-14 sm:pb-20 px-4 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 sm:w-150 h-72 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-blue-500/15 text-blue-300 border border-blue-400/30 tracking-wide uppercase backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> BUKTI PROMOSI INFLUENCER
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight"
          >
            Dipromosikan & Direkomendasikan Oleh <span className="bg-linear-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">Influencer Ternama</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Kumpulan dokumentasi foto, video, dan tangkapan layar saat para content creator & figur publik membagikan pengalaman dan merekomendasikan SOOBIN Services.
          </motion.p>
        </div>
      </section>

      {/* Stats Highlight Bar */}
      <section className="bg-white border-b border-slate-200 py-5 sm:py-7 shadow-xs">
        <div className="container-custom px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            {[
              { value: '100% Asli', label: 'Dokumentasi Terverifikasi', icon: ShieldCheck, color: 'text-primary-850' },
              { value: 'Top Creator', label: 'Influencer & Figur Publik', icon: Users, color: 'text-indigo-600' },
              { value: 'Multi Platform', label: 'Instagram, TikTok & Media', icon: Share2, color: 'text-primary-850' },
              { value: 'Kualitas Teruji', label: 'Rekomendasi Nyata', icon: TrendingUp, color: 'text-blue-600' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 md:bg-transparent">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    <p className={`text-base sm:text-2xl font-black ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5 font-bold">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content: Showcase Cards */}
      <section className="py-10 sm:py-16 px-4 flex-1">
        <div className="container-custom max-w-6xl mx-auto">
          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold transition-all border whitespace-nowrap cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#0B1527] text-white border-[#0B1527] shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* If List is Empty (Placeholder State) */}
          {filteredList.length === 0 ? (
            <div className="mt-4 bg-white border border-slate-200 rounded-3xl p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-100/50 rounded-full blur-2xl pointer-events-none" />

              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-50 border border-indigo-200 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                <InstagramIcon className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-700" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 mb-3 border border-slate-200">
                Showcase Bukti Promosi
              </span>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
                Dokumentasi Bukti Promosi Influencer Sedang Disiapkan
              </h2>

              <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed mb-6">
                Nantinya setiap kartu influencer di halaman ini dapat Anda klik untuk melihat langsung foto, screenshot story, atau video bukti saat mereka mempromosikan SOOBIN Services.
              </p>

              {/* Interactive Mockup Example Card */}
              <div className="max-w-md mx-auto p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/80 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary-800 p-0.5 shrink-0">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-black text-xs text-primary-900">
                        SB
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">Nama Influencer</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-primary-750 font-semibold">
                        <InstagramIcon className="w-3 h-3" />
                        <span>@akun_instagram</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary-50 text-primary-900 border border-primary-200">
                    Contoh Card
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <span className="font-medium text-slate-700">📌 Klik card untuk buka popup bukti promosi</span>
                  <Eye className="w-4 h-4 text-primary-700 shrink-0" />
                </div>
              </div>
            </div>
          ) : (
            /* Render Dynamic Influencer Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredList.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveProof(item)}
                  className="bg-white border border-slate-200 hover:border-primary-400 rounded-3xl p-5 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Top Badge */}
                  {item.highlightBadge && (
                    <div className="absolute top-0 right-0 bg-[#0B1527] text-white text-[10px] font-black px-3 py-1 rounded-bl-2xl shadow-xs">
                      {item.highlightBadge}
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Influencer Profile Header */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-13 h-13 rounded-full bg-primary-800 p-0.5 shrink-0 shadow-xs">
                        <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center">
                          {item.avatarUrl ? (
                            <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-black text-slate-800">{item.name.charAt(0)}</span>
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 pr-14">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-800 transition-colors truncate">
                            {item.name}
                          </h3>
                          {item.verified && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-primary-750 font-semibold mt-0.5">
                          {item.platform === 'instagram' && <InstagramIcon className="w-3.5 h-3.5 shrink-0" />}
                          {item.platform === 'tiktok' && <TikTokIcon className="w-3.5 h-3.5 shrink-0" />}
                          <span className="truncate">{item.handle}</span>
                          {item.followers && (
                            <span className="text-[10px] text-slate-400 font-normal ml-1">
                              • {item.followers}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Promotion Title & Caption */}
                    <div className="space-y-1.5">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                        {item.promotionTitle}
                      </p>
                      {item.caption && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed italic">
                          &ldquo;{item.caption}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Hint */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="text-[11px] font-bold text-primary-800 flex items-center gap-1 group-hover:underline">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Buka Bukti Media</span>
                    </span>
                    {item.promotedDate && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.promotedDate}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* POPUP MODAL BUKTI MEDIA FOTO / SCREENSHOT */}
      <AnimatePresence>
        {activeProof && (
          <div
            className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setActiveProof(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/20 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-4 sm:px-6 py-4 bg-slate-950/80 border-b border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary-800 p-0.5 shrink-0">
                    <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center">
                      {activeProof.avatarUrl ? (
                        <img src={activeProof.avatarUrl} alt={activeProof.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-black text-slate-900">{activeProof.name.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white truncate">{activeProof.name}</h4>
                      {activeProof.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-blue-400 font-semibold truncate flex items-center gap-1">
                      {activeProof.platform === 'instagram' && <InstagramIcon className="w-3 h-3" />}
                      {activeProof.platform === 'tiktok' && <TikTokIcon className="w-3 h-3" />}
                      <span>{activeProof.handle}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeProof.platformUrl && (
                    <a
                      href={activeProof.platformUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Buka Profil</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => setActiveProof(null)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Tutup Popup"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Media Preview */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-black/40 text-center">
                {activeProof.proofMediaUrl ? (
                  <img
                    src={activeProof.proofMediaUrl}
                    alt={`Bukti Promosi ${activeProof.name}`}
                    className="max-h-[60vh] w-auto max-w-full rounded-2xl shadow-xl object-contain border border-white/10"
                  />
                ) : (
                  <div className="p-12 text-slate-400 space-y-2">
                    <ImageIcon className="w-12 h-12 mx-auto text-slate-500" />
                    <p className="text-sm font-semibold">Media foto bukti promosi belum diunggah</p>
                  </div>
                )}

                {/* Caption / Promotion Details */}
                <div className="mt-4 max-w-lg text-left bg-white/5 border border-white/10 rounded-2xl p-4 w-full">
                  <p className="text-xs font-bold text-blue-300 mb-1">
                    📌 {activeProof.promotionTitle}
                  </p>
                  {activeProof.caption && (
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      &ldquo;{activeProof.caption}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
