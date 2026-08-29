'use client';

import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion } from 'framer-motion';
import { Search, Film, Tv, Sparkles, MessageCircle, AlertCircle, CheckCircle2, Info, RefreshCw } from 'lucide-react';
import { useRealtimeServices } from '@/hooks/useRealtimeServices';
import { useAuth } from '@/context/AuthContext';
import { getPriceWithMemberDiscount, formatRupiah } from '@/lib/priceUtils';

// Pricing Calculation Rule (User Profit Margin):
//   < 10k   -> +2.000
//   <= 30k  -> +3.000
//   <= 50k  -> +5.000
//   <= 100k -> +8.000
//   > 100k  -> +15.000
function calculateSellingPrice(supplierPrice: number, customMargin?: number): number {
  if (customMargin !== undefined) {
    return supplierPrice + customMargin;
  }
  if (supplierPrice < 10000) {
    return supplierPrice + 2000;
  } else if (supplierPrice <= 30000) {
    return supplierPrice + 3000;
  } else if (supplierPrice <= 50000) {
    return supplierPrice + 5000;
  } else if (supplierPrice <= 100000) {
    return supplierPrice + 8000;
  } else {
    return supplierPrice + 15000;
  }
}

interface PriceOption {
  duration: string;
  supplierPrice: number;
  customMargin?: number;
  sellingPrice?: number;
}

function getOptionSellingPrice(opt: PriceOption): number {
  if (opt.sellingPrice !== undefined) {
    return opt.sellingPrice;
  }
  return calculateSellingPrice(opt.supplierPrice, opt.customMargin);
}

interface ProductVariant {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  badge?: string;
  logo?: string;
  description: string;
  options: PriceOption[];
}

const getCategoryLogo = (category: string): string | null => {
  switch (category) {
    case 'netflix':
      return '/logos/logo-netflix.png';
    case 'hbo':
      return '/logos/logo-hbomax.png';
    case 'disney':
      return '/logos/logo-disney.png';
    case 'youtube':
      return '/logos/logo-youtube.png';
    case 'viu':
      return '/logos/logo-viu.png';
    case 'vidio':
      return '/logos/logo-vidio.png';
    case 'vision':
      return '/logos/logo-vision.png';
    case 'getcontact':
      return '/logos/logo-getcontact.png';
    case 'spotify':
      return '/logos/logo-spotify.png';
    case 'canva':
      return '/logos/logo-canva.png';
    case 'zoom':
      return '/logos/logo-zoom.png';
    case 'grammarly':
      return '/logos/logo-grammarly.png';
    case 'apple':
      return '/logos/logo-appletv.png';
    case 'robux':
      return '/logos/logo-roblox.png';
    case 'gmail':
      return '/logos/logo-gmail.png';
    case 'chatgpt':
    case 'gpt':
      return '/logos/logo-chatgpt.png';
    case 'gemini':
      return '/logos/logo-gemini.png';
    case 'perplexity':
      return '/logos/logo-perplexity.png';
    case 'quillbot':
      return '/logos/logo-quillbot.png';
    case 'claude':
    case 'claudecode':
      return '/logos/logo-claudecode.png';
    case 'hermes':
    case 'hermesagent':
      return '/logos/logo-hermes.png';
    case 'openclaw':
      return '/logos/logo-openclaw.png';
    case 'claudepro':
      return '/logos/logo-claudepro.png';
    case 'midjourney':
      return '/logos/logo-midjourney.png';
    case 'higgsfield':
      return '/logos/logo-higgsfield.png';
    case 'jenni':
    case 'jenniai':
      return '/logos/logo-jenni.png';
    case 'scispace':
      return '/logos/logo-scispace.png';
    case 'kling':
    case 'klingai':
      return '/logos/logo-kling.png';
    case 'gamma':
    case 'gammaai':
      return '/logos/logo-gamma.png';
    default:
      return null;
  }
};

const allProducts: ProductVariant[] = [
  // --- SUBSCRIBE AI ---
  {
    id: 'claude-code',
    category: 'subscribe-ai',
    categoryLabel: 'Subscribe AI',
    title: 'Claude Code AI',
    badge: 'AI CODING & DEV',
    logo: '/logos/logo-claudecode.png',
    description: 'Akses Claude Code agentic AI coding assistant dengan limit request tinggi & garansi penuh.',
    options: [
      { duration: '14 Hari (250 Req / 5 Jam)', supplierPrice: 43700 },
      { duration: '14 Hari (500 Req / 5 Jam)', supplierPrice: 76000 },
      { duration: '14 Hari (750 Req / 5 Jam)', supplierPrice: 99000 },
      { duration: '30 Hari (250 Req / 5 Jam)', supplierPrice: 76000 },
      { duration: '30 Hari (500 Req / 5 Jam)', supplierPrice: 126000 },
      { duration: '30 Hari (750 Req / 5 Jam)', supplierPrice: 162000 },
    ],
  },
  {
    id: 'claude-pro',
    category: 'subscribe-ai',
    categoryLabel: 'Subscribe AI',
    title: 'Claude Pro AI',
    badge: 'ANTHROPIC AI',
    logo: '/logos/logo-claudepro.png',
    description: 'Akses Claude 3.7 Sonnet & Opus dengan limit request tinggi, Artifacts, & Projects.',
    options: [
      { duration: '1 Bulan', supplierPrice: 410130, customMargin: 50000 },
      { duration: '3 Bulan', supplierPrice: 1220100, customMargin: 50000 },
      { duration: '6 Bulan', supplierPrice: 2429420, customMargin: 50000 },
    ],
  },
  {
    id: 'hermes-agent',
    category: 'subscribe-ai',
    categoryLabel: 'Subscribe AI',
    title: 'Hermes Agent AI',
    badge: 'AI AGENT',
    logo: '/logos/logo-hermes.png',
    description: 'Akses Hermes Agent AI model canggih dengan kuota token fleksibel & garansi penuh.',
    options: [
      { duration: '5M Token', supplierPrice: 37050 },
      { duration: '10M Token', supplierPrice: 65550 },
      { duration: '20M Token', supplierPrice: 121500 },
      { duration: '30M Token', supplierPrice: 179100 },
    ],
  },
  {
    id: 'open-claw',
    category: 'subscribe-ai',
    categoryLabel: 'Subscribe AI',
    title: 'OpenClaw AI',
    badge: 'AI AGENT & SCRAPING',
    logo: '/logos/logo-openclaw.png',
    description: 'Akses OpenClaw AI model canggih dengan kuota token fleksibel & garansi penuh.',
    options: [
      { duration: '5M Token', supplierPrice: 37050 },
      { duration: '10M Token', supplierPrice: 65550 },
      { duration: '20M Token', supplierPrice: 121500 },
      { duration: '30M Token', supplierPrice: 179100 },
    ],
  },
  {
    id: 'midjourney-ai',
    category: 'subscribe-ai',
    categoryLabel: 'Subscribe AI',
    title: 'Midjourney AI',
    badge: 'AI IMAGE GENERATION',
    logo: '/logos/logo-midjourney.png',
    description: 'Generator gambar AI terbaik di dunia dengan kualitas photorealistic & prompt v6.',
    options: [
      { duration: 'Midjourney Basic', supplierPrice: 204232, customMargin: 30000 },
      { duration: 'Midjourney Standard', supplierPrice: 588882, customMargin: 30000 },
      { duration: 'Midjourney Pro', supplierPrice: 1179920, customMargin: 30000 },
    ],
  },
  {
    id: 'higgsfield-ai',
    category: 'subscribe-ai',
    categoryLabel: 'Subscribe AI',
    title: 'Higgsfield AI',
    badge: 'AI VIDEO & ANIMATION',
    logo: '/logos/logo-higgsfield.png',
    description: 'Platform AI video generation & animasi sinematik dengan kontrol kamera presisi.',
    options: [
      { duration: 'Higgsfield Basic (5)', supplierPrice: 112308, customMargin: 30000 },
      { duration: 'Higgsfield Basic (9)', supplierPrice: 189042, customMargin: 30000 },
      { duration: 'Higgsfield Pro', supplierPrice: 583198, customMargin: 30000 },
    ],
  },
  {
    id: 'kling-ai',
    category: 'subscribe-ai',
    categoryLabel: 'Subscribe AI',
    title: 'Kling AI',
    badge: 'AI VIDEO GENERATION',
    logo: '/logos/logo-kling.png',
    description: 'Generator video & animasi AI dengan motion camera control & generasi sinematik 1080p.',
    options: [
      { duration: '660 Kredit', supplierPrice: 120000, customMargin: 30000 },
      { duration: '1.000 Kredit', supplierPrice: 195000, customMargin: 30000 },
      { duration: '5.000 Kredit', supplierPrice: 275000, customMargin: 30000 },
    ],
  },
  {
    id: 'gamma-ai',
    category: 'subscribe-ai',
    categoryLabel: 'Subscribe AI',
    title: 'Gamma AI Plus / Pro',
    badge: 'AI PRESENTATION & DOCS',
    logo: '/logos/logo-gamma.png',
    description: 'Platform AI pembuat slide presentasi, dokumen, & halaman web interaktif serba instan.',
    options: [
      { duration: '1 Bulan', supplierPrice: 25000, customMargin: 10000 },
      { duration: '2 Bulan', supplierPrice: 50000, customMargin: 15000 },
      { duration: '3 Bulan', supplierPrice: 75000, customMargin: 20000 },
      { duration: '4 Bulan', supplierPrice: 100000, customMargin: 30000 },
    ],
  },
  {
    id: 'jenni-ai',
    category: 'subscribe-ai',
    categoryLabel: 'Subscribe AI',
    title: 'Jenni AI Premium',
    badge: 'ACADEMIC WRITING',
    logo: '/logos/logo-jenni.png',
    description: 'Asisten penulis skripsi & karya ilmiah AI dengan sitasi otomatis & autocompletion.',
    options: [
      { duration: '1 Bulan', supplierPrice: 17500, customMargin: 15000 },
      { duration: '3 Bulan+', supplierPrice: 29900, customMargin: 15000 },
      { duration: '6 Bulan+', supplierPrice: 44900, customMargin: 15000 },
      { duration: '12 Bulan+', supplierPrice: 64900, customMargin: 15000 },
    ],
  },
  {
    id: 'scispace-ai',
    category: 'subscribe-ai',
    categoryLabel: 'Subscribe AI',
    title: 'SciSpace Premium',
    badge: 'RESEARCH & LITERATURE',
    logo: '/logos/logo-scispace.png',
    description: 'Platform riset AI untuk analisis PDF jurnal, penjelasan rumus, & literature review.',
    options: [
      { duration: '1 Bulan', supplierPrice: 15000, customMargin: 20000 },
      { duration: '3 Bulan', supplierPrice: 38900, customMargin: 20000 },
      { duration: '6 Bulan', supplierPrice: 68900, customMargin: 20000 },
    ],
  },
  {
    id: 'chatgpt-plus',
    category: 'subscribe-ai',
    categoryLabel: 'Subscribe AI',
    title: 'ChatGPT Plus (GPT-4o & Canvas)',
    badge: 'AI TERPOPULER',
    logo: '/logos/logo-chatgpt.png',
    description: 'Akses GPT-4o, DALL-E 3, Browsing, Advanced Data Analysis, Canvas, & garansi penuh.',
    options: [
      { duration: 'Sharing 8 User - 1 Hari', supplierPrice: 6000 },
      { duration: 'Sharing 8 User - 3 Hari', supplierPrice: 11000 },
      { duration: 'Sharing 8 User - 7 Hari', supplierPrice: 15000 },
      { duration: 'Sharing 8 User - 1 Bulan', supplierPrice: 32000 },
      { duration: 'Sharing 5 User - 1 Hari', supplierPrice: 10000 },
      { duration: 'Sharing 5 User - 3 Hari', supplierPrice: 16000 },
      { duration: 'Sharing 5 User - 7 Hari', supplierPrice: 18000 },
      { duration: 'Sharing 5 User - 1 Bulan', supplierPrice: 38000 },
      { duration: 'Sharing 3 User - 1 Hari', supplierPrice: 14000 },
      { duration: 'Sharing 3 User - 3 Hari', supplierPrice: 24000 },
      { duration: 'Sharing 3 User - 7 Hari', supplierPrice: 32000 },
      { duration: 'Sharing 3 User - 1 Bulan', supplierPrice: 85000 },
      { duration: 'Sharing 2 User - 1 Hari', supplierPrice: 19000 },
      { duration: 'Sharing 2 User - 3 Hari', supplierPrice: 30000 },
      { duration: 'Sharing 2 User - 7 Hari', supplierPrice: 40000 },
      { duration: 'Sharing 2 User - 1 Bulan', supplierPrice: 90000 },
      { duration: 'Private 1 Bulan (Full Garansi)', supplierPrice: 215000 },
      { duration: 'Private 1 Bulan (Garansi Deactive 1x)', supplierPrice: 120000 },
      { duration: 'Private 1 Bulan (Garansi Deactive 2x)', supplierPrice: 150000 },
    ],
  },
  {
    id: 'chatgpt-go',
    category: 'subscribe-ai',
    categoryLabel: 'Subscribe AI',
    title: 'ChatGPT Go',
    badge: 'FAST & STABLE',
    logo: '/logos/logo-chatgpt.png',
    description: 'Akses ChatGPT cepat, hemat, full garansi, & akun dari seller.',
    options: [
      { duration: '1 Bulan Sharing (5 User)', supplierPrice: 15000 },
      { duration: '1 Bulan Private Account', supplierPrice: 50000 },
    ],
  },
  {
    id: 'gemini-advanced',
    category: 'subscribe-ai',
    categoryLabel: 'Subscribe AI',
    title: 'Google Gemini Advanced / Ultra',
    badge: 'GOOGLE AI',
    logo: '/logos/logo-gemini.png',
    description: 'Model AI 1.5 Pro 2M context, Google One 2TB, full garansi.',
    options: [
      { duration: 'Famplan Invite 1 Bulan', supplierPrice: 10000 },
      { duration: 'Famplan Invite 3 Bulan', supplierPrice: 15000 },
      { duration: 'Famplan Invite 4 Bulan', supplierPrice: 23000 },
      { duration: 'Head Account 1 Bulan (Invite 5 Email)', supplierPrice: 20000 },
    ],
  },
  {
    id: 'perplexity-pro',
    category: 'subscribe-ai',
    categoryLabel: 'Subscribe AI',
    title: 'Perplexity Pro AI',
    badge: 'RESEARCH AI',
    logo: '/logos/logo-perplexity.png',
    description: 'Akses Pro Search, Claude 3.5 Sonnet, GPT-4o, legal paid & full garansi.',
    options: [
      { duration: '1 Bulan Sharing Account', supplierPrice: 20000 },
    ],
  },
  {
    id: 'quillbot-pro',
    category: 'subscribe-ai',
    categoryLabel: 'Subscribe AI',
    title: 'QuillBot Premium',
    badge: 'PARAFRASE UNLIMITED',
    logo: '/logos/logo-quillbot.png',
    description: 'Buka mode parafrase unlimited, plagiarism checker, & pengubah nada tulisan.',
    options: [
      { duration: '1 Bulan Sharing Account', supplierPrice: 9500 },
      { duration: '1 Bulan Private Account', supplierPrice: 34000 },
    ],
  },

  // --- NETFLIX ---
  {
    id: 'netflix-1u',
    category: 'netflix',
    categoryLabel: 'Netflix',
    title: 'Netflix 1 Profile 1 User',
    badge: 'BEST SELLER',
    description: '1 Profile khusus untuk 1 pengguna, tidak berbagi layar dengan pengguna lain.',
    options: [
      { duration: '1 Hari', supplierPrice: 2500 },
      { duration: '2 Hari', supplierPrice: 4500 },
      { duration: '3 Hari', supplierPrice: 6000 },
      { duration: '5 Hari', supplierPrice: 7500 },
      { duration: '7 Hari', supplierPrice: 13000 },
      { duration: '1 Bulan', supplierPrice: 33000 },
    ],
  },
  {
    id: 'netflix-2u',
    category: 'netflix',
    categoryLabel: 'Netflix',
    title: 'Netflix 1 Profile 2 User',
    badge: 'HEMAT!',
    description: '1 Profile digunakan bersama 2 pengguna, pilihan paling ekonomis.',
    options: [
      { duration: '1 Hari', supplierPrice: 2000 },
      { duration: '2 Hari', supplierPrice: 4000 },
      { duration: '3 Hari', supplierPrice: 5000 },
      { duration: '5 Hari', supplierPrice: 5500 },
      { duration: '7 Hari', supplierPrice: 11000 },
      { duration: '1 Bulan', supplierPrice: 20000 },
    ],
  },
  {
    id: 'netflix-semi-private',
    category: 'netflix',
    categoryLabel: 'Netflix',
    title: 'Netflix Semi Private',
    badge: 'STABIL',
    description: 'Jumlah user terbatas dan tidak padat untuk pengalaman streaming lancar.',
    options: [
      { duration: '3 Hari', supplierPrice: 9000 },
      { duration: '7 Hari', supplierPrice: 18000 },
      { duration: '1 Bulan', supplierPrice: 37000 },
    ],
  },
  {
    id: 'netflix-single-screen',
    category: 'netflix',
    categoryLabel: 'Netflix',
    title: 'Netflix Single Screen',
    badge: 'SINGLE SCREEN',
    description: 'Layar khusus untuk Anda tanpa terganggu batas screen perangkat lain.',
    options: [
      { duration: '7 Hari', supplierPrice: 19000 },
      { duration: '1 Bulan', supplierPrice: 40000 },
    ],
  },
  {
    id: 'netflix-private',
    category: 'netflix',
    categoryLabel: 'Netflix',
    title: 'Netflix Private Account',
    badge: 'FULL PRIVATE',
    description: 'Akun utuh milik Anda sendiri! Bebas atur semua profile & PIN.',
    options: [
      { duration: '1 Minggu', supplierPrice: 53000 },
      { duration: '1 Bulan', supplierPrice: 145000 },
    ],
  },

  // --- APPLE TV & APPLE MUSIC ---
  {
    id: 'apple-tv',
    category: 'apple',
    categoryLabel: 'Apple Services',
    title: 'Apple TV+ Premium',
    badge: 'APPLE ORIGINAL',
    logo: '/logos/logo-appletv.png',
    description: 'Nikmati film & serial eksklusif Apple Original kualitas 4K HDR.',
    options: [
      { duration: '1 Bulan (Sharing)', supplierPrice: 21000 },
    ],
  },
  {
    id: 'apple-music',
    category: 'apple',
    categoryLabel: 'Apple Services',
    title: 'Apple Music Premium',
    badge: 'LOSSLESS AUDIO',
    logo: '/logos/logo-applemusic.png',
    description: 'Streaming jutaan lagu resolusi Lossless Audio & Spatial Audio tanpa iklan.',
    options: [
      { duration: '1 Bulan (iMessage)', supplierPrice: 7000 },
      { duration: '2 Bulan (No Renew)', supplierPrice: 18000 },
      { duration: '3 Bulan (No Renew)', supplierPrice: 25000 },
      { duration: '4 Bulan (No Renew)', supplierPrice: 30000 },
    ],
  },

  // --- ROBLOX / GAMEPASS & ROBUX VILOG ---
  {
    id: 'robux-vilog-login',
    category: 'robux',
    categoryLabel: 'Roblox & Robux',
    title: 'Robux Vilog (Via Login)',
    badge: 'TOP UP ROBUX',
    description: 'Top up Robux murah via login instan & aman oleh worker terpercaya.',
    options: [
      { duration: '80 Robux', supplierPrice: 15500 },
      { duration: '160 Robux', supplierPrice: 30500 },
      { duration: '240 Robux', supplierPrice: 44500 },
      { duration: '320 Robux', supplierPrice: 59000 },
      { duration: '500 Robux', supplierPrice: 75500 },
      { duration: '1000 Robux', supplierPrice: 150000 },
      { duration: '1500 Robux', supplierPrice: 224000 },
      { duration: '2000 Robux', supplierPrice: 299000 },
      { duration: '2500 Robux', supplierPrice: 373500 },
      { duration: '3000 Robux', supplierPrice: 448000 },
    ],
  },
  {
    id: 'robux-gamepass',
    category: 'robux',
    categoryLabel: 'Roblox & Robux',
    title: 'Robux Gamepass & Gift In Game',
    badge: 'GAMEPASS & GIFT',
    description: 'Settingan Gamepass instan & Gift In Game rate murah Rp 98/Robux.',
    options: [
      { duration: '100 Robux GP', supplierPrice: 14600 },
      { duration: '200 Robux GP', supplierPrice: 28500 },
      { duration: '300 Robux GP', supplierPrice: 41800 },
      { duration: '400 Robux GP', supplierPrice: 54500 },
      { duration: '500 Robux GP', supplierPrice: 69000 },
      { duration: '600 Robux GP', supplierPrice: 82600 },
      { duration: '700 Robux GP', supplierPrice: 96200 },
      { duration: '800 Robux GP', supplierPrice: 109800 },
      { duration: '900 Robux GP', supplierPrice: 123400 },
      { duration: '1000 Robux GP', supplierPrice: 137000 },
      { duration: 'Gift In Game (Per 100 Robux)', supplierPrice: 9800 },
    ],
  },
  {
    id: 'robux-premium-plan',
    category: 'robux',
    categoryLabel: 'Roblox & Robux',
    title: 'Roblox Premium + Robux Bonus',
    badge: 'PREMIUM BENEFIT',
    description: 'Dapat bonus 10% Robux, akses item eksklusif avatar, & booster khusus.',
    options: [
      { duration: '450 Robux + Prem', supplierPrice: 76000 },
      { duration: '1000 Robux + Prem', supplierPrice: 151500 },
      { duration: '2200 Robux + Prem', supplierPrice: 302000 },
    ],
  },

  // --- NOKOS & GMAIL ---
  {
    id: 'nokos-account',
    category: 'nokos',
    categoryLabel: 'Nokos & Account',
    title: 'Nomor Kosong (Nokos) OTP',
    badge: 'VERIFIKASI OTP',
    description: 'Nokos Telegram, WhatsApp, & All App verifikasi OTP instan & aman.',
    options: [
      { duration: 'Nokos Tele (Fresh Surel)', supplierPrice: 6000 },
      { duration: 'Nokos Tele (Non Fresh Surel)', supplierPrice: 5500 },
      { duration: 'Nokos WA (Garansi 1 Bulan)', supplierPrice: 8000 },
      { duration: 'Nokos WA (No Garansi)', supplierPrice: 5000 },
      { duration: 'Nokos All App Verif', supplierPrice: 2000 },
    ],
  },
  {
    id: 'gmail-account',
    category: 'gmail',
    categoryLabel: 'Gmail Account',
    title: 'Akun Gmail Fresh & Custom',
    badge: 'AKUN VERIFIED',
    logo: '/logos/logo-gmail.png',
    description: 'Akun Gmail fresh terpercaya & opsi pembuatan email custom.',
    options: [
      { duration: 'Gmail Fresh Account', supplierPrice: 1500 },
      { duration: 'Gmail Create Email', supplierPrice: 2000 },
    ],
  },

  // --- YOUKU ---
  {
    id: 'youku-vip',
    category: 'asian-drama',
    categoryLabel: 'Asian Drama',
    title: 'Youku VIP Premium',
    badge: 'C-DRAMA EXCLUSIVE',
    logo: '/logos/logo-youku.png',
    description: 'Nonton drama China eksklusif, anime, & variety show Youku subtitle Indonesia.',
    options: [
      { duration: '1 Bulan (Sharing)', supplierPrice: 8000 },
      { duration: '3 Bulan (Sharing)', supplierPrice: 11000 },
      { duration: '1 Tahun (Sharing)', supplierPrice: 15000 },
    ],
  },

  // --- YOUTUBE PREMIUM ---
  {
    id: 'youtube-famplan',
    category: 'youtube',
    categoryLabel: 'YouTube Premium',
    title: 'YouTube Premium Famplan',
    badge: 'NO ADS & MUSIC',
    description: 'Bebas iklan, putar latar belakang, & YouTube Music Premium.',
    options: [
      { duration: '1 Bulan', supplierPrice: 4000 },
      { duration: '2 Bulan', supplierPrice: 8000 },
      { duration: '3 Bulan', supplierPrice: 12000 },
    ],
  },
  {
    id: 'youtube-indplan',
    category: 'youtube',
    categoryLabel: 'YouTube Premium',
    title: 'YouTube Premium Indplan & Mix',
    badge: 'INDIVIDUAL VIP',
    description: 'Plan individual atau mixplan perpanjangan tanpa ganti-ganti akun.',
    options: [
      { duration: '1 Bulan (Indplan)', supplierPrice: 11000 },
      { duration: '2 Bulan (Indplan)', supplierPrice: 22000 },
      { duration: '3 Bulan (Indplan NoGar)', supplierPrice: 20000 },
      { duration: '3 Bulan (Indplan Renew)', supplierPrice: 30000 },
      { duration: '3 Bulan (Indplan No Renew)', supplierPrice: 38000 },
      { duration: '3 Bulan (Mixplan)', supplierPrice: 22000 },
      { duration: '5 Bulan (Mixplan)', supplierPrice: 48000 },
      { duration: '1 Bulan (Head/Owner)', supplierPrice: 8000 },
    ],
  },

  // --- EDITING APPS ---
  {
    id: 'picsart-gold',
    category: 'editing',
    categoryLabel: 'Editing Apps',
    title: 'PicsArt Gold Premium',
    badge: 'FOTO & DESAIN',
    logo: '/logos/logo-picsart.png',
    description: 'Buka semua filter gold, stiker premium, & fitur pengeditan AI.',
    options: [
      { duration: '1 Minggu (Sharing)', supplierPrice: 4500 },
      { duration: '1 Bulan (Sharing)', supplierPrice: 7000 },
      { duration: '1 Bulan (Private)', supplierPrice: 9000 },
    ],
  },
  {
    id: 'remini-pro',
    category: 'editing',
    categoryLabel: 'Editing Apps',
    title: 'Remini Pro AI Enhancer',
    badge: 'HD FOTO AI',
    logo: '/logos/logo-remini.png',
    description: 'Penjernih foto buram otomatis menggunakan AI tingkat tinggi.',
    options: [
      { duration: '1 Bulan (Web Sharing)', supplierPrice: 7000 },
      { duration: '1 Bulan (Web Private)', supplierPrice: 17000 },
      { duration: '1 Tahun (App Android Only)', supplierPrice: 17000 },
    ],
  },
  {
    id: 'camscanner-pro',
    category: 'editing',
    categoryLabel: 'Editing Apps',
    title: 'CamScanner Premium Pro',
    badge: 'SCAN DOKUMEN',
    logo: '/logos/logo-camscanner.png',
    description: 'Scan dokumen HD, hapus watermark, OCR teks, & konversi PDF.',
    options: [
      { duration: '1 Bulan', supplierPrice: 9000 },
      { duration: '1 Tahun', supplierPrice: 14000 },
      { duration: '1 Tahun (Private)', supplierPrice: 20000 },
    ],
  },
  {
    id: 'lightroom-pro',
    category: 'editing',
    categoryLabel: 'Editing Apps',
    title: 'Lightroom Pro Premium',
    badge: 'PRESET PRO',
    logo: '/logos/logo-lightroom.png',
    description: 'Akses preset profesional, fitur masking AI, & pengeditan warna Lightroom.',
    options: [
      { duration: '1 Tahun', supplierPrice: 12000 },
    ],
  },
  {
    id: 'vsco-pro',
    category: 'editing',
    categoryLabel: 'Editing Apps',
    title: 'VSCO Pro Premium',
    badge: 'FILTER RETRO',
    logo: '/logos/logo-vsco.png',
    description: 'Buka 200+ filter eksklusif, alat pengeditan video, & preset estetik.',
    options: [
      { duration: '1 Tahun', supplierPrice: 12000 },
    ],
  },
  {
    id: 'polarr-pro',
    category: 'editing',
    categoryLabel: 'Editing Apps',
    title: 'Polarr Pro Premium',
    badge: 'CUSTOM FILTER',
    logo: '/logos/logo-polarr.png',
    description: 'Buat & gunakan filter kustom dengan alat pengeditan warna presisi.',
    options: [
      { duration: '1 Tahun', supplierPrice: 12000 },
    ],
  },
  {
    id: 'ibis-paint',
    category: 'editing',
    categoryLabel: 'Editing Apps',
    title: 'Ibis Paint X Prime',
    badge: 'DESAIN & KOMIK',
    logo: '/logos/logo-ibispaint.png',
    description: 'Akses kuas prime, bahan gambar, font eksklusif, & fitur ilustrasi pro.',
    options: [
      { duration: '1 Tahun (Android)', supplierPrice: 12000 },
    ],
  },
  {
    id: 'oldroll-camera',
    category: 'editing',
    categoryLabel: 'Editing Apps',
    title: 'OldRoll Vintage Camera',
    badge: 'RETRO CAMERA',
    logo: '/logos/logo-oldroll.png',
    description: 'Efek kamera analog 8mm & film retro klasik tanpa batas.',
    options: [
      { duration: 'Lifetime (Android)', supplierPrice: 10000 },
    ],
  },
  {
    id: 'epik-app',
    category: 'editing',
    categoryLabel: 'Editing Apps',
    title: 'Epik AI Photo Editor',
    badge: 'AI PHOTO EDIT',
    logo: '/logos/logo-epik.png',
    description: 'Pengedit foto AI, buang background, templat pro, & retouch wajah.',
    options: [
      { duration: '1 Tahun (Android)', supplierPrice: 15000 },
    ],
  },
  {
    id: 'wink-vip',
    category: 'editing',
    categoryLabel: 'Editing Apps',
    title: 'Wink VIP Video Enhancer',
    badge: 'HD VIDEO RETOUCH',
    logo: '/logos/logo-wink.png',
    description: 'Penjernih video HD, retouch wajah otomatis, & pengeditan kualitas tinggi.',
    options: [
      { duration: '1 Minggu (Android Private)', supplierPrice: 9000 },
    ],
  },
  {
    id: 'meitu-vip',
    category: 'editing',
    categoryLabel: 'Editing Apps',
    title: 'Meitu VIP Premium',
    badge: 'BEAUTY RETOUCH',
    logo: '/logos/logo-meitu.png',
    description: 'Filter kecantikan eksklusif, poster komik, & pengeditan foto/video.',
    options: [
      { duration: '1 Bulan (Android Sharing)', supplierPrice: 14000 },
      { duration: '1 Bulan (iOS Sharing)', supplierPrice: 17000 },
      { duration: '1 Minggu (Private)', supplierPrice: 9500 },
      { duration: '1 Bulan (iOS & Android Private)', supplierPrice: 40000 },
    ],
  },

  // --- ASIAN DRAMA ---
  {
    id: 'iqiyi-vip',
    category: 'asian-drama',
    categoryLabel: 'Asian Drama',
    title: 'iQIYI VIP Premium',
    badge: 'DRAMA & ANIME',
    logo: '/logos/logo-iqiyi.png',
    description: 'Nonton Drama China, K-Drama, & Anime dengan subtitle Indonesia kualitas 4K.',
    options: [
      { duration: '1 Bulan (Standard Sharing)', supplierPrice: 7000 },
      { duration: '3 Bulan (Standard Sharing)', supplierPrice: 10000 },
      { duration: '1 Tahun (Standard Sharing)', supplierPrice: 14000 },
      { duration: '1 Bulan (Premium Sharing)', supplierPrice: 10000 },
      { duration: '1 Bulan (Premium Anti Limit)', supplierPrice: 17000 },
      { duration: '1 Tahun (Premium Sharing)', supplierPrice: 18000 },
      { duration: '1 Bulan (Standard Private)', supplierPrice: 29000 },
    ],
  },
  {
    id: 'drakor-id',
    category: 'asian-drama',
    categoryLabel: 'Asian Drama',
    title: 'DrakorID VIP Premium',
    badge: 'DRAMA KOREA',
    logo: '/logos/logo-drakorid.png',
    description: 'Nonton drama Korea subtitle Indonesia lengkap & update episode tercepat.',
    options: [
      { duration: '1 Bulan (Sharing)', supplierPrice: 8000 },
      { duration: '3 Bulan (Sharing)', supplierPrice: 14000 },
      { duration: '6 Bulan (Sharing)', supplierPrice: 18000 },
      { duration: '1 Tahun (Sharing)', supplierPrice: 21000 },
    ],
  },
  {
    id: 'dramabox-vip',
    category: 'asian-drama',
    categoryLabel: 'Asian Drama',
    title: 'DramaBox VIP Premium',
    badge: 'SHORT DRAMA',
    logo: '/logos/logo-dramabox.png',
    description: 'Streaming drama pendek populer, miniseri viral, & konten eksklusif.',
    options: [
      { duration: '1 Bulan (Sharing)', supplierPrice: 11000 },
      { duration: '1 Tahun (Sharing Android)', supplierPrice: 30000 },
    ],
  },
  {
    id: 'viki-pass',
    category: 'asian-drama',
    categoryLabel: 'Asian Drama',
    title: 'Rakuten Viki Pass (Standard & Plus)',
    badge: 'KDRAMA & CDRAMA',
    logo: '/logos/logo-viki.png',
    description: 'Streaming drama Korea, China, & Taiwan HD tanpa iklan dengan subtitle resmi.',
    options: [
      { duration: '1 Bulan Standard (Sharing)', supplierPrice: 9000 },
      { duration: '1 Bulan Plus (Sharing)', supplierPrice: 13000 },
      { duration: '1 Bulan Standard (Private)', supplierPrice: 20000 },
      { duration: '1 Bulan Plus (Private)', supplierPrice: 28000 },
    ],
  },
  {
    id: 'mangotv-vip',
    category: 'asian-drama',
    categoryLabel: 'Asian Drama',
    title: 'MangoTV VIP Premium',
    badge: 'CHINA VARIETY',
    logo: '/logos/logo-mangotv.png',
    description: 'Nonton drama China, variety show hits, & acara TV Tiongkok terpopuler.',
    options: [
      { duration: '1 Bulan (Sharing)', supplierPrice: 10000 },
    ],
  },
  {
    id: 'melolo-vip',
    category: 'asian-drama',
    categoryLabel: 'Asian Drama',
    title: 'Melolo VIP Premium',
    badge: 'SHORT MOVIE',
    logo: '/logos/logo-melolo.png',
    description: 'Platform streaming film pendek & drama serial Asia favorit.',
    options: [
      { duration: '1 Bulan (Sharing)', supplierPrice: 9000 },
      { duration: '3 Bulan (Sharing)', supplierPrice: 14000 },
      { duration: '6 Bulan (Sharing)', supplierPrice: 19000 },
      { duration: '1 Tahun (Sharing)', supplierPrice: 25000 },
    ],
  },
  {
    id: 'gagaoolala-vip',
    category: 'asian-drama',
    categoryLabel: 'Asian Drama',
    title: 'GagaOOLala VIP Premium',
    badge: 'ASIAN CINEMA',
    logo: '/logos/logo-gagaoolala.png',
    description: 'Layanan streaming film & serial drama inklusif pertama di Asia.',
    options: [
      { duration: '1 Bulan (Sharing)', supplierPrice: 9000 },
    ],
  },

  // --- VPN PREMIUM ---
  {
    id: 'express-vpn',
    category: 'vpn',
    categoryLabel: 'VPN Premium',
    title: 'ExpressVPN Premium',
    badge: 'KECEPATAN TINGGI',
    logo: '/logos/logo-expressvpn.png',
    description: 'VPN kecepatan tinggi, proteksi privasi penuh, & koneksi super lancar.',
    options: [
      { duration: '1 Bulan (Sharing)', supplierPrice: 8000 },
      { duration: '1 Bulan (Private)', supplierPrice: 15000 },
    ],
  },
  {
    id: 'nord-vpn',
    category: 'vpn',
    categoryLabel: 'VPN Premium',
    title: 'NordVPN Premium',
    badge: 'DOUBLE ENCRYPTION',
    logo: '/logos/logo-nordvpn.png',
    description: 'Keamanan tingkat tinggi dengan proteksi CyberSec & Double VPN.',
    options: [
      { duration: '1 Tahun (Sharing)', supplierPrice: 26000 },
    ],
  },
  {
    id: 'surfshark-vpn',
    category: 'vpn',
    categoryLabel: 'VPN Premium',
    title: 'Surfshark VPN Premium',
    badge: 'UNLIMITED DEVICE',
    logo: '/logos/logo-surfshark.png',
    description: 'Koneksi cepat tanpa batas perangkat & fitur CleanWeb bebas iklan.',
    options: [
      { duration: '1 Bulan (Sharing)', supplierPrice: 8000 },
      { duration: '2 Bulan (Sharing)', supplierPrice: 14000 },
      { duration: '1 Bulan (Private)', supplierPrice: 12000 },
      { duration: '2 Bulan (Private)', supplierPrice: 20000 },
    ],
  },
  {
    id: 'hma-vpn',
    category: 'vpn',
    categoryLabel: 'VPN Premium',
    title: 'HMA VPN Premium',
    badge: 'KONEKSI AMAN',
    logo: '/logos/logo-hma.png',
    description: 'Proteksi IP global, lokasi server terlengkap, & bebas unblock situs.',
    options: [
      { duration: '1 Bulan (Sharing)', supplierPrice: 8000 },
      { duration: '1 Bulan (Private)', supplierPrice: 15000 },
    ],
  },

  // --- VISION+ ---
  {
    id: 'vision-plus',
    category: 'vision',
    categoryLabel: 'Vision+',
    title: 'Vision+ PayTV & BeIN Sports',
    badge: 'LIVE SPORTS',
    description: 'Nonton siaran langsung SPOTV, BeIN Sports 2/4/5, & saluran olahraga.',
    options: [
      { duration: '1 Minggu (Private PayTV)', supplierPrice: 9000 },
      { duration: '1 Bulan (Sharing PayTV)', supplierPrice: 10000 },
      { duration: '1 Bulan (Private PayTV)', supplierPrice: 15000 },
    ],
  },

  // --- GET CONTACT ---
  {
    id: 'get-contact',
    category: 'getcontact',
    categoryLabel: 'Get Contact',
    title: 'Get Contact Premium',
    badge: 'CEK TAG NOMOR',
    description: 'Cek nama tag kontak HP, proteksi spam call, & pencarian nomor.',
    options: [{ duration: '1 Bulan (Sharing)', supplierPrice: 10000 }],
  },

  // --- CANVA PRO ---
  {
    id: 'canva-member',
    category: 'canva',
    categoryLabel: 'Canva Pro',
    title: 'Canva Pro Member Invite',
    badge: 'DESAIN UNLIMITED',
    description: 'Akses semua elemen premium, hapus background, & font eksklusif Canva Pro.',
    options: [
      { duration: '1 Hari', supplierPrice: 300 },
      { duration: '2 Hari', supplierPrice: 500 },
      { duration: '5 Hari', supplierPrice: 800 },
      { duration: '7 Hari', supplierPrice: 1000 },
      { duration: '1 Bulan', supplierPrice: 2000 },
      { duration: '2 Bulan', supplierPrice: 3000 },
      { duration: '3 Bulan', supplierPrice: 4000 },
      { duration: '6 Bulan (Full Garansi)', supplierPrice: 8000 },
      { duration: '1 Tahun (Garansi 6 Bulan)', supplierPrice: 10000 },
      { duration: '1 Tahun (Full Garansi)', supplierPrice: 14000 },
    ],
  },
  {
    id: 'canva-admin-owner',
    category: 'canva',
    categoryLabel: 'Canva Pro',
    title: 'Canva Pro Admin, Owner & Lifetime',
    badge: 'TIM OWNER',
    description: 'Akses tim sendiri, invite anggota tim sesuka hati, atau paket Lifetime.',
    options: [
      { duration: 'Lifetime Edu (Garansi 6 Bulan)', supplierPrice: 11000 },
      { duration: '1 Bulan (Admin)', supplierPrice: 7000 },
      { duration: '1 Bulan (Owner + Include Acc)', supplierPrice: 14000 },
    ],
  },

  // --- SPOTIFY PREMIUM ---
  {
    id: 'spotify-famplan',
    category: 'spotify',
    categoryLabel: 'Spotify',
    title: 'Spotify Famplan (Full Warranty)',
    badge: 'MUSIK TANPA IKLAN',
    description: 'Dengarkan lagu offline tanpa iklan & kualitas suara tertinggi.',
    options: [
      { duration: '7 Hari', supplierPrice: 6500 },
      { duration: '19 Hari', supplierPrice: 10000 },
      { duration: '1 Bulan', supplierPrice: 17000 },
      { duration: '2 Bulan', supplierPrice: 27000 },
      { duration: '3 Bulan', supplierPrice: 38000 },
    ],
  },
  {
    id: 'spotify-indplan',
    category: 'spotify',
    categoryLabel: 'Spotify',
    title: 'Spotify Individual Plan',
    badge: 'INDIVIDUAL VIP',
    description: 'Plan individual resmi tanpa gabung grup keluarga.',
    options: [
      { duration: '1 Bulan (No Warranty)', supplierPrice: 10000 },
      { duration: '2 Bulan (No Warranty)', supplierPrice: 13000 },
      { duration: '3 Bulan (No Warranty)', supplierPrice: 17000 },
      { duration: '4 Bulan (No Warranty)', supplierPrice: 20000 },
      { duration: '1 Bulan (Full Warranty)', supplierPrice: 21000 },
      { duration: '2 Bulan (Full Warranty)', supplierPrice: 35000 },
      { duration: '3 Bulan (Full Warranty)', supplierPrice: 41000 },
    ],
  },

  // --- GRAMMARLY ---
  {
    id: 'grammarly-pro',
    category: 'grammarly',
    categoryLabel: 'Grammarly',
    title: 'Grammarly Premium',
    badge: 'AKADEMIK & SKRIPSI',
    description: 'Cek tata bahasa Inggris, kejelasan kalimat, & peningkatan kosakata profesional.',
    options: [
      { duration: '1 Bulan (Sharing)', supplierPrice: 9000 },
      { duration: '1 Bulan (Private)', supplierPrice: 29000 },
    ],
  },


  // --- MS 365 & WPS PRO ---
  {
    id: 'office-apps',
    category: 'office',
    categoryLabel: 'Office & Document',
    title: 'Microsoft 365 & WPS Office Pro',
    badge: 'PRODUKTIVITAS',
    description: 'Lisensi Word, Excel, PowerPoint, Cloud Storage 1TB, & WPS Office Pro.',
    options: [
      { duration: '1 Bulan - MS365 Standard', supplierPrice: 8000 },
      { duration: '1 Bulan - MS365 Famhead', supplierPrice: 12000 },
      { duration: '1 Bulan - WPS Pro Sharing', supplierPrice: 9000 },
      { duration: '1 Bulan - WPS Pro Private', supplierPrice: 25000 },
    ],
  },

  // --- BRAINLY+ & DUOLINGO ---
  {
    id: 'edu-apps',
    category: 'education',
    categoryLabel: 'Edukasi & Belajar',
    title: 'Brainly+ & Duolingo Super',
    badge: 'EDUKASI',
    description: 'Jawaban verified tanpa iklan di Brainly & belajar bahasa tanpa batas di Duolingo.',
    options: [
      { duration: '1 Bulan - Duolingo Super', supplierPrice: 9000 },
      { duration: '1 Bulan - Duolingo Famhead', supplierPrice: 15000 },
      { duration: '1 Tahun - Brainly+ (Garansi 6 Bulan)', supplierPrice: 17000 },
    ],
  },

  // --- ZOOM PRO ---
  {
    id: 'zoom-pro',
    category: 'zoom',
    categoryLabel: 'Zoom Pro',
    title: 'Zoom Pro (100 Participants)',
    badge: 'MEETING UNLIMITED',
    description: 'Meeting tanpa batas durasi 40 menit & fitur co-host penuh.',
    options: [
      { duration: '1 Jam', supplierPrice: 3000 },
      { duration: '1 Hari', supplierPrice: 7000 },
      { duration: '1 Minggu', supplierPrice: 14000 },
      { duration: '2 Minggu', supplierPrice: 20000 },
      { duration: '1 Bulan', supplierPrice: 25000 },
    ],
  },

  // --- VIU PREMIUM ---
  {
    id: 'viu-premium',
    category: 'viu',
    categoryLabel: 'Viu',
    title: 'Viu Premium (Less Limit & Private Anti Limit)',
    badge: 'DRAMA KOREA',
    description: 'Nonton drakor terbaru & variety show Asia tanpa batas.',
    options: [
      { duration: '1 Bulan (Less Limit)', supplierPrice: 2000 },
      { duration: '3 Bulan (Less Limit)', supplierPrice: 6000 },
      { duration: '6 Bulan (Less Limit)', supplierPrice: 8000 },
      { duration: '1 Tahun (Less Limit)', supplierPrice: 10000 },
      { duration: '1 Bulan (Private Anti Limit)', supplierPrice: 3000 },
      { duration: '3 Bulan (Private Anti Limit)', supplierPrice: 7000 },
      { duration: '6 Bulan (Private Anti Limit)', supplierPrice: 9000 },
      { duration: '1 Tahun (Private Anti Limit)', supplierPrice: 11000 },
      { duration: 'Lifetime (Garansi 6 Bulan)', supplierPrice: 18000 },
    ],
  },

  // --- CAPCUT PRO ---
  {
    id: 'capcut-pro',
    category: 'capcut',
    categoryLabel: 'CapCut Pro',
    title: 'CapCut Pro (PC & Mobile)',
    badge: 'EDIT VIDEO RARE',
    description: 'Buka efek pro, auto caption, & ekspor 4K tanpa watermark.',
    options: [
      { duration: '1 Minggu (Private)', supplierPrice: 14000 },
      { duration: '1 Bulan (Sharing 3U)', supplierPrice: 22000 },
      { duration: '1 Bulan (Private FullGar)', supplierPrice: 55000 },
    ],
  },

  // --- LOKLOK ---
  {
    id: 'loklok-vip',
    category: 'loklok',
    categoryLabel: 'Loklok',
    title: 'Loklok VIP (Sharing & Private)',
    badge: 'ANIME & DRAMA',
    description: 'Streaming film, anime, & serial TV subtitle Indonesia.',
    options: [
      { duration: '1 Bulan (Sharing 3U)', supplierPrice: 17000 },
      { duration: '1 Bulan (Sharing Bisa TV)', supplierPrice: 21000 },
      { duration: '1 Bulan (Private Basic)', supplierPrice: 40000 },
      { duration: '1 Bulan (Private Standard Bisa TV)', supplierPrice: 57000 },
    ],
  },

  // --- VIDIO ---
  {
    id: 'vidio-daily-mobile',
    category: 'vidio',
    categoryLabel: 'Vidio',
    title: 'Vidio Platinum Sharing Daily (Mobile)',
    badge: 'LIGA INGGRIS',
    description: 'Akses tayangan Platinum Vidio khusus perangkat HP / Tablet.',
    options: [
      { duration: '1 Hari', supplierPrice: 4500 },
      { duration: '1 Minggu', supplierPrice: 9500 },
    ],
  },
  {
    id: 'vidio-sharing-month',
    category: 'vidio',
    categoryLabel: 'Vidio',
    title: 'Vidio Platinum Sharing & Private',
    badge: 'BEST DEAL!',
    description: 'Pilihan berlangganan bulanan Vidio Platinum sharing & private.',
    options: [
      { duration: '1 Hari (Daily Pay TV)', supplierPrice: 2000 },
      { duration: '1 Minggu (Daily Pay TV)', supplierPrice: 4500 },
      { duration: '1 Bulan (Pay TV Only Sharing)', supplierPrice: 9000 },
      { duration: '1 Bulan (Mobile Sharing)', supplierPrice: 17000 },
      { duration: '1 Bulan (2U All Device Sharing)', supplierPrice: 25000 },
      { duration: '1 Bulan (Pay TV Private)', supplierPrice: 14000 },
      { duration: '1 Tahun (Pay TV Private)', supplierPrice: 20000 },
      { duration: '1 Bulan (Mobile Private)', supplierPrice: 28000 },
      { duration: '1 Bulan (All Device Private)', supplierPrice: 38000 },
    ],
  },

  // --- DISNEY+ ---
  {
    id: 'disney-6u',
    category: 'disney',
    categoryLabel: 'Disney+ Hotstar',
    title: 'Disney+ Hotstar Sharing 6U',
    badge: 'MARVEL & PIXAR',
    description: 'Nonton film blockbuster Marvel, Disney, Pixar, & Star Wars terlengkap!',
    options: [
      { duration: '1 Hari', supplierPrice: 3500 },
      { duration: '3 Hari', supplierPrice: 7000 },
      { duration: '7 Hari', supplierPrice: 12000 },
      { duration: '1 Bulan', supplierPrice: 22000 },
    ],
  },

  // --- HBO MAX ---
  {
    id: 'hbo-max',
    category: 'hbo',
    categoryLabel: 'HBO Max',
    title: 'HBO Max (Sharing & Private)',
    badge: 'HOLLYWOOD BLOCKBUSTER',
    description: 'Nonton serial eksklusif HBO, House of the Dragon, & film bioskop pilihan.',
    options: [
      { duration: '1 Hari (Sharing)', supplierPrice: 4000 },
      { duration: '1 Minggu (Sharing)', supplierPrice: 10000 },
      { duration: '1 Bulan (Standard Sharing)', supplierPrice: 18000 },
      { duration: '1 Bulan (Ultimate Sharing)', supplierPrice: 25000 },
      { duration: '1 Bulan (Standard Private)', supplierPrice: 61000 },
      { duration: '1 Bulan (Ultimate Private)', supplierPrice: 88000 },
    ],
  },
];

export default function PremiumPage() {
  const { services: realtimeDbServices, isSyncing, refetch } = useRealtimeServices('premium');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const productsList = useMemo(() => {
    if (realtimeDbServices && realtimeDbServices.length > 0) {
      return allProducts.map((p) => {
        const matched = realtimeDbServices.find((db: any) =>
          db.name?.toLowerCase() === p.title.toLowerCase() ||
          db.name?.toLowerCase().includes(p.title.toLowerCase()) ||
          p.title.toLowerCase().includes(db.name?.toLowerCase())
        );
        if (matched) {
          let updatedOptions = p.options;
          if (matched.price) {
            const rawDigits = matched.price.replace(/[^\d]/g, '');
            const parsedBasePrice = rawDigits ? parseInt(rawDigits, 10) : null;
            if (parsedBasePrice && parsedBasePrice > 0) {
              const defaultBase = calculateSellingPrice(p.options[0].supplierPrice, p.options[0].customMargin);
              const ratio = defaultBase > 0 ? (parsedBasePrice / defaultBase) : 1;
              updatedOptions = p.options.map((opt, idx) => {
                if (idx === 0) {
                  return { ...opt, sellingPrice: parsedBasePrice };
                }
                const defaultOptPrice = calculateSellingPrice(opt.supplierPrice, opt.customMargin);
                const scaledPrice = Math.round((defaultOptPrice * ratio) / 100) * 100;
                return { ...opt, sellingPrice: scaledPrice };
              });
            }
          }
          return {
            ...p,
            description: matched.description || p.description,
            badge: (matched.badge !== undefined && matched.badge !== null) ? matched.badge : p.badge,
            options: updatedOptions,
          };
        }
        return p;
      });
    }
    return allProducts;
  }, [realtimeDbServices]);

  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const matchCategory =
        selectedCategory === 'all' ||
        product.category === selectedCategory ||
        (selectedCategory === 'nokos' && (product.category === 'nokos' || product.category === 'gmail'));
      const matchQuery =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [productsList, selectedCategory, searchQuery]);

  const { user } = useAuth();
  const isMember = Boolean(user);

  const handleOrderWhatsApp = (
    productTitle: string,
    duration: string,
    sellingPrice: number
  ) => {
    const rawPriceStr = formatRupiah(sellingPrice);
    const message =
      `Halo Kak, saya ingin pesan Akun Premium:\n\n` +
      `📌 *Produk*: ${productTitle}\n` +
      `⏱️ *Durasi*: ${duration}\n` +
      `💰 *Harga*: ${rawPriceStr}\n\n` +
      `Mohon diproses ya kak, terima kasih!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/6285156550742?text=${encoded}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      {/* Hero Section Header */}
      <section className="bg-[#0B1527] pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 text-center">
        <div className="container-custom max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-black bg-blue-500/15 text-blue-300 border border-blue-400/30 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> PUSAT AKUN PREMIUM INDONESIA
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Langganan Akun Premium Resmi & Bergaransi
          </h1>
          <p className="text-gray-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Akses ribuan hiburan streaming, tools produktivitas, AI, editing, hingga gamepass dengan harga termurah & legal 100%.
          </p>

          {/* Search Box */}
          <div className="pt-4 max-w-xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari akun (misal: Netflix, Spotify, ChatGPT, Canva)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/15 backdrop-blur-md transition-all text-xs sm:text-base shadow-inner"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-30 shadow-xs">
        <div className="container-custom py-2.5 px-3 sm:px-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 min-w-0 py-0.5">
            {[
              { id: 'all', label: 'Semua Kategori' },
              { id: 'nokos', label: 'Nokos / OTP & Gmail' },
              { id: 'ai', label: 'AI Premium' },
              { id: 'netflix', label: 'Netflix' },
              { id: 'youtube', label: 'YouTube' },
              { id: 'editing', label: 'Editing Apps' },
              { id: 'asian-drama', label: 'Asian Drama' },
              { id: 'vpn', label: 'VPN Premium' },
              { id: 'canva', label: 'Canva Pro' },
              { id: 'grammarly', label: 'Grammarly' },
              { id: 'zoom', label: 'Zoom Pro' },
              { id: 'spotify', label: 'Spotify' },
              { id: 'viu', label: 'Viu' },
              { id: 'vidio', label: 'Vidio' },
              { id: 'disney', label: 'Disney+' },
              { id: 'hbo', label: 'HBO Max' },
              { id: 'vision', label: 'Vision+' },
              { id: 'getcontact', label: 'Get Contact' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition-all border whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0F1E36] text-white border-[#0F1E36] shadow-sm'
                    : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Realtime Synchronize Indicator */}
          <button
            onClick={() => refetch()}
            title="Sinkronisasi harga database realtime"
            className="p-2 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-800 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline text-[11px] font-black text-slate-900">
              {isSyncing ? 'Menyinkronkan...' : 'Realtime Sync'}
            </span>
          </button>
        </div>
      </section>

      {/* Main Content Product Grid */}
      <section className="py-8 sm:py-16 px-3 sm:px-4">
        <div className="container-custom">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-200 max-w-md mx-auto space-y-3 shadow-sm">
              <Info className="w-10 h-10 text-gray-400 mx-auto" />
              <p className="text-gray-800 font-bold text-base">Tidak ada akun premium ditemukan</p>
              <p className="text-gray-500 text-xs">Coba kata kunci lain atau pilih kategori Semua.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product, idx) => {
                const logoUrl = product.logo || getCategoryLogo(product.category);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.3 }}
                    className="flex flex-col justify-between rounded-2xl bg-white border border-gray-200 hover:border-primary-800/40 transition-all p-4 sm:p-6 shadow-sm hover:shadow-md relative overflow-hidden group"
                  >
                    {/* Top Badge & Logo */}
                    {(product.badge || logoUrl) && (
                      <div className="absolute top-0 right-0 flex items-center shadow-xs rounded-bl-xl overflow-hidden border-b border-l border-gray-200/80 max-w-[65%] z-10">
                        {logoUrl && (
                          <div className="bg-white px-2 py-1 flex items-center justify-center h-6 sm:h-7 border-r border-gray-100 shrink-0">
                            <img src={logoUrl} alt={product.categoryLabel} className="h-3.5 sm:h-4 w-auto max-w-[40px] sm:max-w-[55px] object-contain" />
                          </div>
                        )}
                        {product.badge && (
                          <span className="bg-[#00C853] text-white text-[8px] sm:text-[10px] font-black px-2 sm:px-3 py-1 uppercase tracking-wider h-6 sm:h-7 flex items-center shrink-0 truncate">
                            {product.badge}
                          </span>
                        )}
                      </div>
                    )}

                  <div>
                    {/* Header Info */}
                    <div className="mb-3 sm:mb-4 pr-24 sm:pr-32">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500 px-2 py-0.5 rounded bg-gray-100 border border-gray-200 inline-block mb-1.5">
                        {product.categoryLabel}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-primary-800 transition-colors leading-snug">
                        {product.title}
                      </h3>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price List Options */}
                    <div className="space-y-2 mb-6">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Pricelist Durasi:
                      </p>
                      {product.options.map((opt) => {
                        const sellingPrice = getOptionSellingPrice(opt);
                        const rawPriceStr = formatRupiah(sellingPrice);

                        return (
                          <div
                            key={opt.duration}
                            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200/80 hover:border-gray-300 transition-all"
                          >
                            <span className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#00C853] shrink-0" />
                              {opt.duration}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-extrabold text-[#0B1527]">
                                {rawPriceStr}
                              </span>
                              <button
                                onClick={() =>
                                  handleOrderWhatsApp(product.title, opt.duration, sellingPrice)
                                }
                                className="px-3 py-1.5 rounded-lg bg-[#0F1E36] hover:bg-[#162A4A] text-white font-bold text-xs shadow hover:scale-105 active:scale-95 transition-all"
                              >
                                Pesan
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Primary WhatsApp Button */}
                  <button
                    onClick={() =>
                      handleOrderWhatsApp(
                        product.title,
                        product.options[0].duration,
                        getOptionSellingPrice(product.options[0])
                      )
                    }
                    className="w-full py-3 px-4 rounded-xl bg-[#0F1E36] hover:bg-[#162A4A] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Order via WhatsApp</span>
                  </button>
                </motion.div>
              );
            })}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
