'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion } from 'framer-motion';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Camera,
  Video,
  Users,
  MessageCircle,
  ExternalLink,
  Star,
  ShieldCheck,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';

interface InfluencerItem {
  id: string;
  name: string;
  handle: string;
  platform: 'instagram' | 'tiktok' | 'youtube';
  avatarUrl?: string;
  followers?: string;
  category: string;
  quote: string;
  servicesUsed: string[];
  mediaThumbnail?: string;
  postUrl?: string;
  verified?: boolean;
}

// Data partner influencer / selebriti (Dikosongkan sementara sesuai permintaan user)
const INFLUENCER_LIST: InfluencerItem[] = [];

export default function TrustedByPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Semua Kreator' },
    { id: 'edukasi', label: 'Edukasi & Kampus' },
    { id: 'lifestyle', label: 'Lifestyle & Tech' },
    { id: 'entertainment', label: 'Entertainment' },
  ];

  const filteredInfluencers = INFLUENCER_LIST.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleContactPartnership = () => {
    const text = encodeURIComponent(
      'Halo Tim Marketing SOOBIN Services, saya tertarik untuk mengajukan kolaborasi promosi / endorse. Boleh minta rate card & brief-nya?'
    );
    window.open(`https://wa.me/6285156550742?text=${text}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-[#0B1527] pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-72 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-amber-400/15 text-amber-300 border border-amber-400/30 tracking-wide uppercase backdrop-blur-md">
              <Award className="w-4 h-4 text-amber-400" /> OFFICIAL ENDORSEMENT & PARTNERSHIP
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight"
          >
            Dipercaya Oleh <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 bg-clip-text text-transparent">Influencer & Figur Publik</span> Indonesia
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Lihat bagaimana para content creator, mahasiswa berprestasi, dan public figure merekomendasikan SOOBIN Services untuk menunjang kelancaran studi akademik & produktivitas digital.
          </motion.p>
        </div>
      </section>

      {/* Stats Highlight Bar */}
      <section className="bg-white border-b border-slate-200 py-6 sm:py-8 shadow-xs">
        <div className="container-custom px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            {[
              { value: '50+', label: 'Kolaborasi Kreator', icon: Users, color: 'text-primary-800' },
              { value: '10M+', label: 'Total Audience Reach', icon: TrendingUp, color: 'text-amber-600' },
              { value: '100%', label: 'Kepuasan & Rekomendasi', icon: ShieldCheck, color: 'text-emerald-600' },
              { value: '24/7', label: 'Dedicated Brand Support', icon: HeartHandshake, color: 'text-blue-600' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 md:bg-transparent">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    <p className={`text-xl sm:text-3xl font-black ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <p className="text-slate-500 text-[11px] sm:text-xs md:text-sm mt-1 font-bold">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filter Tabs & Content Section */}
      <section className="py-12 sm:py-16 px-4 flex-1">
        <div className="container-custom max-w-6xl mx-auto">
          {/* Category Filter Pills */}
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

          {/* Empty / Placeholder State Showcase */}
          {filteredInfluencers.length === 0 ? (
            <div className="mt-4 bg-white border border-slate-200 rounded-3xl p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-100/50 rounded-full blur-2xl pointer-events-none" />

              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-50 border border-amber-200 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 mb-3 border border-slate-200">
                Showcase Sedang Disiapkan
              </span>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
                Koleksi Endorsement & Review Influencer Segera Hadir!
              </h2>

              <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed mb-8">
                Kami sedang merangkum dokumentasi video, story Instagram, dan konten promosi dari deretan influencer serta figur publik ternama yang telah berkolaborasi bersama SOOBIN Services.
              </p>

              {/* Sample Mockup Cards Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left mb-8 opacity-75">
                <div className="p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="h-3.5 w-24 bg-slate-300 rounded mb-1.5" />
                    <div className="h-2.5 w-36 bg-slate-200 rounded" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="h-3.5 w-28 bg-slate-300 rounded mb-1.5" />
                    <div className="h-2.5 w-32 bg-slate-200 rounded" />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleContactPartnership}
                className="inline-flex items-center gap-2 bg-[#0B1527] hover:bg-[#162A4A] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Ajukan Kolaborasi / Endorse</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInfluencers.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-bold overflow-hidden shrink-0">
                        {item.avatarUrl ? (
                          <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          item.name.charAt(0)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-slate-900 truncate">{item.name}</h3>
                          {item.verified && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-500 font-medium truncate">{item.handle}</p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                      &ldquo;{item.quote}&rdquo;
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.servicesUsed.map((svc, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {item.postUrl && (
                    <a
                      href={item.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
                    >
                      <span>Lihat Postingan</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Partnership Banner Callout */}
          <div className="mt-12 sm:mt-16 bg-gradient-to-r from-[#0B1527] via-[#10203D] to-[#0B1527] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden border border-slate-800 shadow-xl">
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <span className="px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-white/10 text-amber-300 border border-white/15 inline-block">
                Open for Collaboration
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Tertarik Menjadi Mitra Promosi SOOBIN Services?
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Kami membuka kesempatan kolaborasi sponsorship, affiliate, dan endorsement eksklusif untuk kreator konten dan influencer di seluruh Indonesia.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleContactPartnership}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>Hubungi Tim Partnership (WhatsApp)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
