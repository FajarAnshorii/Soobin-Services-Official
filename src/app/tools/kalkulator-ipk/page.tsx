'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import {
  GraduationCap,
  Plus,
  Trash2,
  RotateCcw,
  Sliders,
  Calculator,
  MessageCircle,
  Award,
  Settings2,
  CheckCircle2
} from 'lucide-react';

interface GradeScaleItem {
  letter: string;
  weight: number;
}

interface CourseItem {
  id: string;
  name: string;
  sks: number;
  gradeLetter: string;
}

const DEFAULT_GRADE_SCALES: GradeScaleItem[] = [
  { letter: 'A', weight: 4.0 },
  { letter: 'A-', weight: 3.75 },
  { letter: 'B+', weight: 3.5 },
  { letter: 'B', weight: 3.0 },
  { letter: 'B-', weight: 2.75 },
  { letter: 'C+', weight: 2.5 },
  { letter: 'C', weight: 2.0 },
  { letter: 'D', weight: 1.0 },
  { letter: 'E', weight: 0.0 },
];

export default function KalkulatorIPKPage() {
  // University Max Scale (Manual input by user)
  const [maxScale, setMaxScale] = useState<number>(4.0);
  const [customMaxScale, setCustomMaxScale] = useState<string>('4.00');

  // Grade Scale Settings
  const [gradeScales, setGradeScales] = useState<GradeScaleItem[]>(DEFAULT_GRADE_SCALES);
  const [showGradeSettings, setShowGradeSettings] = useState<boolean>(false);

  // Course Rows
  const [courses, setCourses] = useState<CourseItem[]>([
    { id: '1', name: 'Metodologi Penelitian', sks: 3, gradeLetter: 'A' },
    { id: '2', name: 'Statistika Terapan', sks: 3, gradeLetter: 'A-' },
    { id: '3', name: 'Seminar Proposal', sks: 2, gradeLetter: 'B+' },
    { id: '4', name: 'Mata Kuliah Pilihan I', sks: 3, gradeLetter: 'A' },
    { id: '5', name: 'Praktikum Lapangan', sks: 2, gradeLetter: 'A' },
  ]);

  // Live Testimonials Data from Database
  const [testiStats, setTestiStats] = useState<{ rating: number; count: number }>({ rating: 4.9, count: 6 });

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const total = data.reduce((acc: number, item: { rating?: number }) => acc + (Number(item.rating) || 5), 0);
          const avg = total / data.length;
          setTestiStats({
            rating: Number(avg.toFixed(1)),
            count: data.length,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Update Max Scale from input
  const handleMaxScaleChange = (val: string) => {
    setCustomMaxScale(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      setMaxScale(parsed);
    }
  };

  // Update specific grade weight
  const handleUpdateGradeWeight = (letter: string, newWeight: number) => {
    setGradeScales((prev) =>
      prev.map((item) => (item.letter === letter ? { ...item, weight: newWeight } : item))
    );
  };

  // Reset Grade Scale to default
  const handleResetGradeScales = () => {
    setGradeScales(DEFAULT_GRADE_SCALES);
    setMaxScale(4.0);
    setCustomMaxScale('4.00');
  };

  // Add course row
  const handleAddCourse = () => {
    setCourses((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: `Mata Kuliah ${prev.length + 1}`,
        sks: 3,
        gradeLetter: gradeScales[0]?.letter || 'A',
      },
    ]);
  };

  // Remove course row
  const handleRemoveCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  // Update course row
  const handleUpdateCourse = (id: string, field: keyof CourseItem, value: any) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Reset course list
  const handleResetCourses = () => {
    setCourses([
      { id: '1', name: 'Mata Kuliah 1', sks: 3, gradeLetter: 'A' },
      { id: '2', name: 'Mata Kuliah 2', sks: 3, gradeLetter: 'B+' },
    ]);
  };

  // Calculate Semester GPA
  const calculationResult = useMemo(() => {
    let totalSks = 0;
    let totalScore = 0;

    courses.forEach((c) => {
      const sks = Number(c.sks) || 0;
      const matchedGrade = gradeScales.find((g) => g.letter === c.gradeLetter);
      const weight = matchedGrade ? matchedGrade.weight : 0;

      totalSks += sks;
      totalScore += sks * weight;
    });

    const gpa = totalSks > 0 ? totalScore / totalSks : 0;
    const boundedGpa = Math.min(gpa, maxScale);

    // Predikat Nilai (Standard Dikti normalized to custom max scale)
    const ratio = boundedGpa / maxScale;
    let predicate = 'Memuaskan';

    if (ratio >= 0.875) {
      predicate = 'Dengan Pujian (Cumlaude)';
    } else if (ratio >= 0.75) {
      predicate = 'Sangat Memuaskan';
    } else if (ratio >= 0.5) {
      predicate = 'Memuaskan';
    } else {
      predicate = 'Cukup / Perlu Evaluasi';
    }

    return {
      totalSks,
      totalScore,
      gpa: boundedGpa,
      predicate,
    };
  }, [courses, gradeScales, maxScale]);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Header Section */}
      <section className="pt-28 sm:pt-36 pb-6 sm:pb-8 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-primary-700" />
            <span>Mini Tool Akademik</span>
          </div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Kalkulator IPK
          </h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hitung Indeks Prestasi Semester (IPS) dan IPK kumulatif secara akurat dengan pengaturan batas skala maksimal dan sistem bobot nilai huruf sesuai kampus Anda.
          </p>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="py-6 sm:py-12 pb-24 sm:pb-12 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Settings Bar: Skala IPK Maksimal & Bobot Huruf Custom */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                <Settings2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Pengaturan Sistem Nilai Kampus</h4>
                <p className="text-[11px] text-slate-500">Sesuaikan batas skala maksimal dan bobot huruf agar presisi.</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
              {/* Max Scale Input */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5">
                <span className="text-[11px] font-bold text-slate-600">Skala:</span>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={customMaxScale}
                  onChange={(e) => handleMaxScaleChange(e.target.value)}
                  className="w-12 bg-white border border-slate-300 text-center rounded text-xs font-extrabold text-slate-900 py-0.5 outline-none"
                />
              </div>

              {/* Toggle Grade Scale Modal / Drawer */}
              <button
                type="button"
                onClick={() => setShowGradeSettings(!showGradeSettings)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Atur Bobot Huruf</span>
              </button>
            </div>
          </div>

          {/* Collapsible Grade Scale Configuration */}
          {showGradeSettings && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Daftar Bobot Nilai Huruf Kampus</h4>
                  <p className="text-[10px] text-slate-500">Ubah angka bobot jika kampus Anda memiliki standar berbeda.</p>
                </div>
                <button
                  type="button"
                  onClick={handleResetGradeScales}
                  className="text-[11px] font-bold text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Default</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                {gradeScales.map((item) => (
                  <div key={item.letter} className="p-2 sm:p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-1">
                    <span className="text-xs font-extrabold text-slate-900 w-7">{item.letter}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-semibold text-slate-400">=</span>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        max={maxScale}
                        value={item.weight}
                        onChange={(e) => handleUpdateGradeWeight(item.letter, parseFloat(e.target.value) || 0)}
                        className="w-12 sm:w-14 h-7 px-1 bg-white border border-slate-300 rounded text-center text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CALCULATOR WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Column: Course Table Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 mb-4 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Daftar Mata Kuliah</h3>
                    <p className="text-[10px] text-slate-500">Masukkan nama matkul, SKS, dan nilai huruf.</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 sm:pt-0">
                  <button
                    type="button"
                    onClick={handleResetCourses}
                    className="px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCourse}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Matkul</span>
                  </button>
                </div>
              </div>

              {/* Table Header (Visible on Desktop) */}
              <div className="hidden sm:grid grid-cols-12 gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pb-2 px-2 border-b border-slate-100">
                <div className="col-span-7">Nama Mata Kuliah</div>
                <div className="col-span-2 text-center">SKS</div>
                <div className="col-span-2 text-center">Nilai</div>
                <div className="col-span-1 text-right">Aksi</div>
              </div>

              {/* Course List (Responsive Desktop & Mobile) */}
              <div className="space-y-2.5 sm:space-y-2 mt-2 max-h-[420px] overflow-y-auto pr-1">
                {courses.map((course, idx) => (
                  <div
                    key={course.id}
                    className="p-3 sm:p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:items-center text-xs"
                  >
                    {/* Course Name + Delete (Mobile Row 1 / Desktop Col 7) */}
                    <div className="sm:col-span-7 flex items-center gap-2">
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) => handleUpdateCourse(course.id, 'name', e.target.value)}
                        placeholder={`Mata Kuliah ${idx + 1}`}
                        className="w-full h-10 sm:h-9 px-3 bg-white border border-slate-300 focus:border-slate-800 rounded-lg text-xs font-medium text-slate-900 outline-none"
                      />
                      <button
                        type="button"
                        disabled={courses.length <= 1}
                        onClick={() => handleRemoveCourse(course.id)}
                        className="sm:hidden text-slate-400 hover:text-red-600 disabled:opacity-30 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer shrink-0"
                        title="Hapus Mata Kuliah"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* SKS & Grade Selects (Mobile Row 2 / Desktop Col 2+2) */}
                    <div className="grid grid-cols-2 sm:contents gap-2">
                      <div className="sm:col-span-2">
                        <select
                          value={course.sks}
                          onChange={(e) => handleUpdateCourse(course.id, 'sks', parseInt(e.target.value) || 1)}
                          className="w-full h-10 sm:h-9 px-2 bg-white border border-slate-300 focus:border-slate-800 rounded-lg text-xs font-bold text-center text-slate-900 outline-none"
                        >
                          {[1, 2, 3, 4, 5, 6].map((s) => (
                            <option key={s} value={s}>
                              {s} SKS
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <select
                          value={course.gradeLetter}
                          onChange={(e) => handleUpdateCourse(course.id, 'gradeLetter', e.target.value)}
                          className="w-full h-10 sm:h-9 px-2 bg-white border border-slate-300 focus:border-slate-800 rounded-lg text-xs font-bold text-center text-slate-900 outline-none"
                        >
                          {gradeScales.map((g) => (
                            <option key={g.letter} value={g.letter}>
                              {g.letter} ({g.weight})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Desktop Delete button */}
                    <div className="hidden sm:block sm:col-span-1 text-right">
                      <button
                        type="button"
                        disabled={courses.length <= 1}
                        onClick={() => handleRemoveCourse(course.id)}
                        className="text-slate-400 hover:text-red-600 disabled:opacity-30 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Total {courses.length} Mata Kuliah Terdaftar</span>
                <button
                  type="button"
                  onClick={handleAddCourse}
                  className="text-primary-800 font-bold hover:underline cursor-pointer"
                >
                  + Tambah Baris Baru
                </button>
              </div>
            </div>

            {/* Right Column: Live Output & Predicate (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Score Summary Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Hasil Indeks Prestasi (IP)</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Skala Maksimal {maxScale.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-xl p-5 text-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Indeks Prestasi (IP / IPK)
                  </span>
                  <div className="text-5xl font-extrabold text-emerald-400 tracking-tight">
                    {calculationResult.gpa.toFixed(2)}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-extrabold bg-slate-800/80 border-slate-700 text-emerald-300">
                    <span>Predikat:</span>
                    <span className="text-white">{calculationResult.predicate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Total SKS</span>
                    <span className="text-lg font-extrabold text-slate-900">{calculationResult.totalSks} SKS</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Total Nilai Mutu</span>
                    <span className="text-lg font-extrabold text-slate-900">{calculationResult.totalScore.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Promo Card */}
              <div className="rounded-2xl bg-[#121824] border border-slate-800 text-white overflow-hidden shadow-sm flex flex-col sm:flex-row items-stretch">
                <div className="sm:w-36 bg-white flex items-center justify-center p-4 shrink-0 relative min-h-30 sm:min-h-auto">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                    <Image src="/soobin-icon.png" alt="SOOBIN Services Logo" fill className="object-contain" />
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 block tracking-wide">
                      Jasa Bantuan Tugas Kuliah & Subscribe AI
                    </span>
                    <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">
                      Kejar IPK Impian & Bebas Pusing Tugas?
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      Admin SOOBIN siap bantu tugas kuliah, makalah, serta langganan ChatGPT Plus & Quillbot Premium harga mahasiswa.
                    </p>
                  </div>
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <Link
                      href="/testimoni"
                      title="Buka Halaman Testimoni & Review Mahasiswa"
                      className="text-[10.5px] text-slate-300 hover:text-emerald-400 font-bold flex items-center gap-1 transition-colors cursor-pointer group"
                    >
                      <span className="text-amber-400 text-xs">★</span>
                      <span className="group-hover:underline underline-offset-2">
                        {testiStats.rating} ({testiStats.count} Ulasan Mahasiswa)
                      </span>
                    </Link>
                    <a
                      href="https://wa.me/6287815797525?text=Halo%20Admin%20SOOBIN%2C%20mau%20bantuan%20jasa%20tugas%20kuliah%20dong"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat Admin</span>
                    </a>
                  </div>
                </div>
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
