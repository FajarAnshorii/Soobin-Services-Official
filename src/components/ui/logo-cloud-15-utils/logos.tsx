'use client';

import React from 'react';

// 1. Numerade Logo
export const LogoNumerade = () => (
  <div className="flex items-center gap-2.5 px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200/80 transition-all">
    <svg className="w-7 h-7 text-indigo-600 shrink-0" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 10 C27.6 10 9.5 28.1 9.5 50.5 C9.5 72.9 27.6 91 50 91 C62.3 91 73.2 85.5 80.5 76.8 L68.2 68.3 C63.7 73.6 57.3 77 50 77 C35.4 77 23.5 65.1 23.5 50.5 C23.5 35.9 35.4 24 50 24 C57.3 24 63.7 27.4 68.2 32.7 L80.5 24.2 C73.2 15.5 62.3 10 50 10 Z" fill="url(#num-grad)" />
      <defs>
        <linearGradient id="num-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
      </defs>
    </svg>
    <span className="text-xl font-extrabold tracking-tight text-[#1E1B4B]">Numerade</span>
  </div>
);

// 2. Scribd Logo
export const LogoScribd = () => (
  <div className="flex items-center gap-2.5 px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200/80 transition-all">
    <svg className="w-6 h-6 text-[#00798C] shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.89 15.2c-2.31 0-4.04-1.28-4.04-3.14 0-3.37 5.09-2.61 5.09-4.24 0-.63-.58-1.02-1.42-1.02-1.27 0-2.67.62-3.64 1.34l-.84-1.63c1.23-.97 3.02-1.63 4.75-1.63 2.37 0 3.86 1.25 3.86 3.12 0 3.4-5.09 2.65-5.09 4.3 0 .61.64.99 1.5.99 1.34 0 2.87-.71 3.93-1.52l.83 1.62c-1.33 1.1-3.26 1.81-4.93 1.81z" />
    </svg>
    <span className="text-lg font-black tracking-wider text-[#004E5A]">SCRIBD</span>
  </div>
);

// 3. StuDocu Logo
export const LogoStuDocu = () => (
  <div className="flex items-center gap-1.5 px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200/80 transition-all">
    <span className="text-xl font-black text-[#2D3748]">Stu</span>
    <span className="text-xl font-black text-[#3182CE]">Docu</span>
  </div>
);

// 4. Sage Logo
export const LogoSage = () => (
  <div className="flex items-center px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200/80 transition-all">
    <span className="text-2xl font-black tracking-tighter text-[#00E600] lowercase">sage</span>
  </div>
);

// 5. SlideShare Logo
export const LogoSlideShare = () => (
  <div className="flex items-center gap-2 px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200/80 transition-all">
    <div className="relative w-6 h-6 shrink-0 flex items-center justify-center">
      <div className="w-5 h-5 rounded border-2 border-[#00A8A8] flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-[#FF8C00] -mr-0.5" />
        <div className="w-2 h-2 rounded-full bg-[#0080FF] -ml-0.5" />
      </div>
    </div>
    <span className="text-xl font-bold tracking-tight text-[#00A8A8] lowercase">slideshare</span>
  </div>
);

// 6. Quizlet Logo
export const LogoQuizlet = () => (
  <div className="flex items-center px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200/80 transition-all">
    <span className="text-2xl font-black tracking-tight text-[#4257FF]">Quizlet</span>
  </div>
);

// 7. Course Hero Logo
export const LogoCourseHero = () => (
  <div className="flex items-center gap-2 px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200/80 transition-all">
    <div className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white font-bold flex items-center justify-center text-xs">
      CH
    </div>
    <span className="text-lg font-extrabold text-[#1E3A8A] tracking-tight">Course Hero</span>
  </div>
);

// 8. Chegg Logo
export const LogoChegg = () => (
  <div className="flex items-center gap-2 px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200/80 transition-all">
    <div className="w-3 h-3 rounded-full bg-[#F97316]" />
    <span className="text-xl font-black text-[#EA580C]">Chegg</span>
  </div>
);

// 9. Academia Logo
export const LogoAcademia = () => (
  <div className="flex items-center gap-2 px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200/80 transition-all">
    <span className="text-lg font-bold text-[#0284C7] font-serif italic">A</span>
    <span className="text-lg font-extrabold text-[#0F172A] tracking-tight">Academia.edu</span>
  </div>
);

// 10. Bartleby Logo
export const LogoBartleby = () => (
  <div className="flex items-center gap-2 px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200/80 transition-all">
    <span className="text-lg font-black text-[#0D9488]">bartleby</span>
  </div>
);

// 11. IEEE Logo
export const LogoIEEE = () => (
  <div className="flex items-center gap-2.5 px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200/80 transition-all">
    <div className="w-6 h-6 rotate-45 bg-[#00629B] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
      <span className="-rotate-45">◆</span>
    </div>
    <span className="text-xl font-black tracking-wider text-[#00629B]">IEEE</span>
  </div>
);

// 12. Cambridge Logo
export const LogoCambridge = () => (
  <div className="flex items-center gap-2 px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200/80 transition-all">
    <div className="w-6 h-6 bg-[#A6192E] rounded flex items-center justify-center text-white font-bold text-[10px] shrink-0 border border-amber-400">
      C
    </div>
    <span className="text-base font-extrabold tracking-widest text-[#000000] font-serif uppercase">CAMBRIDGE</span>
  </div>
);

// 13. ResearchGate Logo
export const LogoResearchGate = () => (
  <div className="flex items-center px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200/80 transition-all">
    <span className="text-xl font-extrabold tracking-tight text-[#00CC99] font-serif">ResearchGate</span>
  </div>
);

// 14. Wiley Logo
export const LogoWiley = () => (
  <div className="flex items-center px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200/80 transition-all">
    <span className="text-xl font-black tracking-widest text-[#1A1A1A] font-serif uppercase">WILEY</span>
  </div>
);

// 15. Emerald Logo
export const LogoEmerald = () => (
  <div className="flex items-center gap-2 px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200/80 transition-all">
    <div className="w-4 h-4 rotate-45 bg-[#006847] shrink-0" />
    <span className="text-lg font-extrabold tracking-tight text-[#006847]">Emerald</span>
  </div>
);

// Compatibility exports
export const Logo01 = LogoNumerade;
export const Logo02 = LogoScribd;
export const Logo03 = LogoStuDocu;
export const Logo04 = LogoSage;
export const Logo05 = LogoSlideShare;
export const Logo06 = LogoQuizlet;
export const Logo07 = LogoCourseHero;
export const Logo08 = LogoChegg;
