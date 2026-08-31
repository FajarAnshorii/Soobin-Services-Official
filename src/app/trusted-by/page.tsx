'use client';

import { useState, useMemo, useEffect } from 'react';
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
  Search,
  Globe,
  Award,
  MessageSquare,
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

function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export interface PromotedShowcase {
  id: string;
  targetGroup: 'influencer' | 'public';
  name: string;
  handle: string;
  platform: 'instagram' | 'tiktok' | 'facebook';
  platformUrl?: string;
  avatarUrl?: string;
  followers?: string;
  universityOrRole?: string;
  verified?: boolean;
  category?: string;
  promotionTitle: string;
  caption?: string;
  proofMediaUrl: string;
  proofMediaType?: 'image' | 'video';
  promotedDate?: string;
  highlightBadge?: string;
  isApproved?: boolean;
  createdAt?: string;
}

export default function TrustedByPage() {
  const [mainGroup, setMainGroup] = useState<'influencer' | 'public'>('influencer');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProof, setActiveProof] = useState<PromotedShowcase | null>(null);
  const [items, setItems] = useState<PromotedShowcase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch live promotion database records
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/promotions?type=${mainGroup}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data)) {
            setItems(data);
          } else {
            setItems([]);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching promotions:', err);
        if (isMounted) {
          setItems([]);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [mainGroup]);

  // Platform filters depending on active main category
  const platformFilters = [
    { id: 'all', label: 'Semua Platform', icon: Globe },
    { id: 'instagram', label: 'Instagram', icon: InstagramIcon },
    { id: 'tiktok', label: 'TikTok', icon: TikTokIcon },
    { id: 'facebook', label: 'Facebook', icon: FacebookIcon },
  ];

  // Filtered List based on Main Group, Platform, and Search Query
  const filteredList = useMemo(() => {
    return items.filter((item) => {
      // 1. Filter by platform
      if (selectedPlatform !== 'all' && item.platform !== selectedPlatform) return false;

      // 2. Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name?.toLowerCase().includes(query);
        const matchHandle = item.handle?.toLowerCase().includes(query);
        const matchTitle = item.promotionTitle?.toLowerCase().includes(query);
        const matchCaption = item.caption ? item.caption.toLowerCase().includes(query) : false;
        if (!matchName && !matchHandle && !matchTitle && !matchCaption) return false;
      }

      return true;
    });
  }, [items, selectedPlatform, searchQuery]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      {/* Stats Highlight Bar */}
      <section className="bg-white border-b border-slate-200 pt-24 sm:pt-28 pb-5 sm:pb-7">
        <div className="container-custom px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            {[
              { value: '100% Asli', label: 'Dokumentasi Terverifikasi', icon: ShieldCheck },
              { value: 'Influencer', label: 'Creator & Figur Publik', icon: Award },
              { value: 'Publik & Member', label: 'Pelanggan & Komunitas', icon: Users },
              { value: 'Multi Platform', label: 'Instagram, TikTok, Facebook', icon: Share2 },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 md:bg-transparent">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-[#0B1527]" />
                    <p className="text-base sm:text-2xl font-black text-[#0B1527]">
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

      {/* Main Content: Dual Category Hub + Search & Platform Filters */}
      <section className="py-8 sm:py-14 px-4 flex-1">
        <div className="container-custom max-w-6xl mx-auto space-y-6">

          {/* DUA KATEGORI UTAMA: INFLUENCER (KIRI) vs PUBLIK (KANAN) */}
          <div className="max-w-xl mx-auto bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                setMainGroup('influencer');
                setSelectedPlatform('all');
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                mainGroup === 'influencer'
                  ? 'bg-[#0B1527] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Influencer & Creator</span>
            </button>

            <button
              onClick={() => {
                setMainGroup('public');
                setSelectedPlatform('all');
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                mainGroup === 'public'
                  ? 'bg-[#0B1527] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Publik & Member</span>
            </button>
          </div>

          {/* SUB-FILTER & SEARCH BAR CONTAINER */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Search Filter Component */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    mainGroup === 'influencer'
                      ? 'Cari nama influencer, @akun Instagram, TikTok...'
                      : 'Cari nama publik, akun medsos, atau ulasan...'
                  }
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B1527] focus:bg-white transition-all font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                    title="Hapus pencarian"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Platform Filter Buttons (Instagram, TikTok, Facebook) */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                {platformFilters.map((p) => {
                  const Icon = p.icon;
                  const isActive = selectedPlatform === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-[#0B1527] text-white border-[#0B1527]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Info bar / Context Note */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700">
                Menampilkan kategori: <strong className="text-[#0B1527]">{mainGroup === 'influencer' ? 'Influencer & Content Creator' : 'Publik & Member / Pelanggan'}</strong>
              </span>
              <span className="text-[11px] text-slate-400">
                {filteredList.length} bukti promosi ditemukan
              </span>
            </div>
          </div>

          {/* If List is Empty (Placeholder State) */}
          {filteredList.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-sm">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 border border-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-5 text-slate-800">
                {mainGroup === 'influencer' ? (
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 text-primary-900" />
                ) : (
                  <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-primary-900" />
                )}
              </div>

              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 mb-3 border border-slate-200">
                {mainGroup === 'influencer' ? 'Showcase Bukti Promosi Influencer' : 'Showcase Bukti Promosi Publik'}
              </span>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
                {mainGroup === 'influencer'
                  ? 'Dokumentasi Promosi Influencer Sedang Disiapkan'
                  : 'Dokumentasi Promosi Publik & Member Sedang Disiapkan'}
              </h2>

              <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed mb-6">
                {mainGroup === 'influencer'
                  ? 'Nantinya setiap kartu influencer (Instagram, TikTok, Facebook) di halaman ini dapat Anda klik untuk melihat langsung foto, screenshot story, atau video bukti promosi resmi.'
                  : 'Publik atau siapapun yang membantu mempromosikan jasa kami di Instagram, TikTok, atau Facebook dapat mengirimkan buktinya ke admin untuk dipajang di kartu showcase ini.'}
              </p>

              {/* Interactive Mockup Example Card */}
              <div className="max-w-md mx-auto p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary-800 p-0.5 shrink-0">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-black text-xs text-primary-900">
                        {mainGroup === 'influencer' ? 'INF' : 'PUB'}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {mainGroup === 'influencer' ? 'Nama Influencer / Creator' : 'Nama Publik / Member'}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-primary-750 font-semibold">
                        <InstagramIcon className="w-3 h-3" />
                        <span>@akun_media_sosial</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary-50 text-primary-900 border border-primary-200">
                    Contoh Card
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <span className="font-medium text-slate-700">📌 Klik card untuk buka popup foto / bukti promosi</span>
                  <Eye className="w-4 h-4 text-primary-700 shrink-0" />
                </div>
              </div>
            </div>
          ) : (
            /* Render Dynamic Cards */
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
                    {/* Profile Header */}
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
                          {item.platform === 'facebook' && <FacebookIcon className="w-3.5 h-3.5 shrink-0" />}
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
              className="bg-[#0B1527] border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-4 sm:px-6 py-4 bg-[#080E1A] border-b border-slate-800 flex items-center justify-between gap-3">
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
                      {activeProof.platform === 'facebook' && <FacebookIcon className="w-3 h-3" />}
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
