'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import {
  Calculator,
  Users,
  HelpCircle,
  Copy,
  Check,
  MessageCircle,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

type SampleFormulaType = 'slovin' | 'lemeshow';

export default function KalkulatorSampelPage() {
  const [activeFormula, setActiveFormula] = useState<SampleFormulaType>('slovin');

  // Slovin State
  const [populationN, setPopulationN] = useState<string>('1000');
  const [marginE, setMarginE] = useState<number>(0.05); // default 5%
  const [customMarginE, setCustomMarginE] = useState<string>('5');
  const [isCustomE, setIsCustomE] = useState<boolean>(false);

  // Lemeshow State
  const [zScoreType, setZScoreType] = useState<'95' | '99' | 'custom'>('95');
  const [zValue, setZValue] = useState<number>(1.96);
  const [customZ, setCustomZ] = useState<string>('1.96');
  const [proportionP, setProportionP] = useState<number>(0.5);
  const [customP, setCustomP] = useState<string>('0.5');
  const [precisionD, setPrecisionD] = useState<number>(0.05);
  const [customD, setCustomD] = useState<string>('5');
  const [isCustomD, setIsCustomD] = useState<boolean>(false);

  // Copy Feedback
  const [copied, setCopied] = useState<boolean>(false);

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

  // Handle Slovin Calculation
  const slovinResult = useMemo(() => {
    const N = parseFloat(populationN);
    const e = isCustomE ? (parseFloat(customMarginE) || 0) / 100 : marginE;

    if (isNaN(N) || N <= 0 || isNaN(e) || e <= 0) {
      return { sampleExact: 0, sampleCeil: 0, isValid: false, N, e };
    }

    // n = N / (1 + N * e^2)
    const denominator = 1 + N * Math.pow(e, 2);
    const sampleExact = N / denominator;
    const sampleCeil = Math.ceil(sampleExact);

    return {
      sampleExact,
      sampleCeil,
      isValid: true,
      N,
      e,
    };
  }, [populationN, marginE, customMarginE, isCustomE]);

  // Handle Lemeshow Calculation
  const lemeshowResult = useMemo(() => {
    let Z = zValue;
    if (zScoreType === 'custom') {
      Z = parseFloat(customZ) || 1.96;
    }

    const P = parseFloat(customP) || 0.5;
    const d = isCustomD ? (parseFloat(customD) || 0) / 100 : precisionD;

    if (isNaN(Z) || Z <= 0 || isNaN(P) || P <= 0 || P >= 1 || isNaN(d) || d <= 0) {
      return { sampleExact: 0, sampleCeil: 0, isValid: false, Z, P, d };
    }

    // n = (Z^2 * P * (1-P)) / d^2
    const numerator = Math.pow(Z, 2) * P * (1 - P);
    const denominator = Math.pow(d, 2);
    const sampleExact = numerator / denominator;
    const sampleCeil = Math.ceil(sampleExact);

    return {
      sampleExact,
      sampleCeil,
      isValid: true,
      Z,
      P,
      d,
    };
  }, [zScoreType, zValue, customZ, customP, precisionD, customD, isCustomD]);

  // Generate Academic Text for Bab 3
  const academicText = useMemo(() => {
    if (activeFormula === 'slovin') {
      if (!slovinResult.isValid) return 'Masukkan data populasi dan margin of error yang valid untuk melihat uraian Bab 3.';
      const percentageE = (slovinResult.e * 100).toFixed(0);
      const eSquared = parseFloat(Math.pow(slovinResult.e, 2).toFixed(6));
      const nTimesESquared = parseFloat((slovinResult.N * eSquared).toFixed(4));
      const denominator = parseFloat((1 + nTimesESquared).toFixed(4));

      return `Penentuan jumlah sampel dalam penelitian ini dihitung menggunakan Rumus Slovin dengan rumus sebagai berikut:

n = N / (1 + N(e)²)

Keterangan:
n = Jumlah sampel minimum
N = Ukuran populasi (${slovinResult.N.toLocaleString('id-ID')})
e = Batas toleransi kesalahan / margin of error (${percentageE}% atau ${slovinResult.e})

Perhitungan:
n = ${slovinResult.N.toLocaleString('id-ID')} / (1 + ${slovinResult.N.toLocaleString('id-ID')}(${slovinResult.e})²)
n = ${slovinResult.N.toLocaleString('id-ID')} / (1 + ${slovinResult.N.toLocaleString('id-ID')}(${eSquared}))
n = ${slovinResult.N.toLocaleString('id-ID')} / (1 + ${nTimesESquared})
n = ${slovinResult.N.toLocaleString('id-ID')} / ${denominator}
n = ${slovinResult.sampleExact.toFixed(4)}

Berdasarkan perhitungan di atas, diperoleh jumlah sampel sebesar ${slovinResult.sampleExact.toFixed(2)}. Untuk menghindari kekurangan data dan menjaga presisi penelitian, maka jumlah sampel dibulatkan ke atas menjadi sebanyak ${slovinResult.sampleCeil} responden.`;
    } else {
      if (!lemeshowResult.isValid) return 'Masukkan parameter tingkat kepercayaan dan presisi yang valid untuk melihat uraian Bab 3.';
      const percentageD = (lemeshowResult.d * 100).toFixed(0);
      const confLevel = zScoreType === '99' ? '99%' : '95%';
      const zSquared = parseFloat(Math.pow(lemeshowResult.Z, 2).toFixed(4));
      const pQ = parseFloat((lemeshowResult.P * (1 - lemeshowResult.P)).toFixed(4));
      const numerator = parseFloat((zSquared * pQ).toFixed(4));
      const dSquared = parseFloat(Math.pow(lemeshowResult.d, 2).toFixed(6));

      return `Karena populasi dalam penelitian ini tidak diketahui jumlah pastinya (populasi tidak terhingga / unknown population), maka penentuan jumlah sampel dihitung menggunakan Rumus Lemeshow:

n = (Z² × P(1 - P)) / d²

Keterangan:
n = Jumlah sampel minimum
Z = Skor standar deviasi pada tingkat kepercayaan ${confLevel} (Z = ${lemeshowResult.Z})
P = Perkiraan proporsi prevalensi kejadian / maksimal variasi (P = ${lemeshowResult.P})
d = Tingkat presisi mutlak / margin of error (${percentageD}% atau ${lemeshowResult.d})

Perhitungan:
n = (${lemeshowResult.Z}² × ${lemeshowResult.P}(1 - ${lemeshowResult.P})) / (${lemeshowResult.d})²
n = (${zSquared} × ${pQ}) / ${dSquared}
n = ${numerator} / ${dSquared}
n = ${lemeshowResult.sampleExact.toFixed(4)}

Berdasarkan perhitungan Rumus Lemeshow di atas, diperoleh jumlah sampel minimal sebesar ${lemeshowResult.sampleExact.toFixed(2)} yang dibulatkan menjadi ${lemeshowResult.sampleCeil} responden.`;
    }
  }, [activeFormula, slovinResult, lemeshowResult, zScoreType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(academicText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Header Section */}
      <section className="pt-28 sm:pt-36 pb-6 sm:pb-8 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Kalkulator Sampel Rumus Slovin & Lemeshow
          </h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hitung jumlah sampel minimal skripsi secara otomatis berdasarkan ukuran populasi dan tingkat margin error, lengkap dengan uraian rumus langkah demi langkah untuk Bab 3.
          </p>

          {/* Formula Selector Tabs */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 p-1.5 bg-slate-100 border border-slate-300/80 rounded-2xl max-w-lg w-full mx-auto gap-1.5">
            <button
              type="button"
              onClick={() => setActiveFormula('slovin')}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeFormula === 'slovin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Slovin (Populasi Diketahui)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFormula('lemeshow')}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeFormula === 'lemeshow'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Lemeshow (Tak Terhingga)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Calculator Workspace */}
      <section className="py-6 sm:py-12 pb-24 sm:pb-12 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Form: Inputs (5 Cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 sm:mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {activeFormula === 'slovin' ? 'Parameter Rumus Slovin' : 'Parameter Rumus Lemeshow'}
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      {activeFormula === 'slovin' ? 'n = N / (1 + N(e)²)' : 'n = (Z² × P(1-P)) / d²'}
                    </p>
                  </div>
                </div>
              </div>

              {activeFormula === 'slovin' ? (
                <div className="space-y-4">
                  {/* Populasi N */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Jumlah Populasi (N) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={populationN}
                        onChange={(e) => setPopulationN(e.target.value)}
                        placeholder="Contoh: 1000"
                        className="w-full h-11 px-3.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-300 focus:border-slate-800 rounded-xl text-xs font-bold text-slate-900 outline-none transition-all"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400">
                        Orang / Unit
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Total subjek penelitian yang tercatat dalam data populasi.
                    </p>
                  </div>

                  {/* Margin of Error e */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Batas Toleransi Kesalahan (Margin of Error, e)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                      {[
                        { label: '1% (0.01)', val: 0.01 },
                        { label: '5% (0.05)', val: 0.05 },
                        { label: '10% (0.10)', val: 0.10 },
                        { label: 'Custom', val: -1 },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            if (item.val === -1) {
                              setIsCustomE(true);
                            } else {
                              setIsCustomE(false);
                              setMarginE(item.val);
                            }
                          }}
                          className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                            (item.val !== -1 && !isCustomE && marginE === item.val) || (item.val === -1 && isCustomE)
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {isCustomE && (
                      <div className="mt-2">
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="50"
                            value={customMarginE}
                            onChange={(e) => setCustomMarginE(e.target.value)}
                            placeholder="Persentase error (contoh: 7.5)"
                            className="w-full h-10 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
                          />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                            %
                          </span>
                        </div>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-500 mt-1">
                      Umumnya penelitian sosial/skripsi menggunakan margin error <b>5% (0.05)</b>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Tingkat Kepercayaan (Z) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Tingkat Kepercayaan (Confidence Level, Z)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setZScoreType('95')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          zScoreType === '95'
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-xs font-bold">95% (Z = 1.96)</span>
                        <span className={`text-[10px] block mt-0.5 ${zScoreType === '95' ? 'text-slate-300' : 'text-slate-500'}`}>
                          Standar Skripsi
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setZScoreType('99');
                          setZValue(2.576);
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          zScoreType === '99'
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-xs font-bold">99% (Z = 2.58)</span>
                        <span className={`text-[10px] block mt-0.5 ${zScoreType === '99' ? 'text-slate-300' : 'text-slate-500'}`}>
                          Tinggi / Medis
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setZScoreType('custom')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                          zScoreType === 'custom'
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-xs font-bold">Custom Z</span>
                        <span className={`text-[10px] block mt-0.5 ${zScoreType === 'custom' ? 'text-slate-300' : 'text-slate-500'}`}>
                          Manual
                        </span>
                      </button>
                    </div>

                    {zScoreType === 'custom' && (
                      <input
                        type="number"
                        step="0.01"
                        value={customZ}
                        onChange={(e) => setCustomZ(e.target.value)}
                        placeholder="Nilai Z (contoh: 1.645 untuk 90%)"
                        className="w-full h-10 px-3.5 mt-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
                      />
                    )}
                  </div>

                  {/* Prevalensi Proporsi P */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Perkiraan Proporsi / Prevalensi (P)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="0.99"
                      value={customP}
                      onChange={(e) => setCustomP(e.target.value)}
                      placeholder="Default 0.5 (varians maksimum)"
                      className="w-full h-10 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Jika tidak ada data prevalensi penelitian sebelumnya, gunakan <b>P = 0.5</b> untuk varians maksimal yang paling aman.
                    </p>
                  </div>

                  {/* Presisi Mutlak d */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Tingkat Presisi Mutlak (d)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomD(false);
                          setPrecisionD(0.05);
                        }}
                        className={`py-2 px-2 text-center rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          !isCustomD && precisionD === 0.05
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        5% (0.05)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomD(false);
                          setPrecisionD(0.10);
                        }}
                        className={`py-2 px-2 text-center rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          !isCustomD && precisionD === 0.10
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        10% (0.10)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCustomD(true)}
                        className={`py-2 px-2 text-center rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          isCustomD
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Custom %
                      </button>
                    </div>

                    {isCustomD && (
                      <div className="relative mt-2">
                        <input
                          type="number"
                          step="0.1"
                          value={customD}
                          onChange={(e) => setCustomD(e.target.value)}
                          placeholder="Presisi d (contoh: 8)"
                          className="w-full h-10 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                          %
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Output: Calculation Results & Step-by-Step Breakdown (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Highlight Card: Jumlah Sampel Minimal */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Hasil Jumlah Sampel Minimal</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {activeFormula === 'slovin' ? 'Slovin Formula' : 'Lemeshow Formula'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Teks Bab 3</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Big Metric Display */}
                <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 text-center relative overflow-hidden">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Rekomendasi Jumlah Sampel Minimal (n)
                  </span>
                  <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 tracking-tight">
                    {activeFormula === 'slovin'
                      ? slovinResult.isValid
                        ? `${slovinResult.sampleCeil} Responden`
                        : 'Data Tidak Valid'
                      : lemeshowResult.isValid
                      ? `${lemeshowResult.sampleCeil} Responden`
                      : 'Data Tidak Valid'}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {activeFormula === 'slovin'
                      ? `Hasil desimal asli: ${slovinResult.sampleExact.toFixed(4)} (Dibulatkan ke atas)`
                      : `Hasil desimal asli: ${lemeshowResult.sampleExact.toFixed(4)} (Dibulatkan ke atas)`}
                  </p>
                </div>

                {/* Copyable Academic Text Preview */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">
                      Uraian Langkah Perhitungan untuk Naskah Skripsi / Bab 3:
                    </span>
                  </div>
                  <pre className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-800 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {academicText}
                  </pre>
                </div>
              </div>

              {/* Bottom Promo Card: SOOBIN Statistics & Olah Data Service */}
              <div className="rounded-2xl bg-[#121824] border border-slate-800 text-white overflow-hidden shadow-sm flex flex-col sm:flex-row items-stretch">
                {/* Left: Logo Container */}
                <div className="sm:w-36 md:w-40 bg-white flex items-center justify-center p-4 shrink-0 relative min-h-30 sm:min-h-auto">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                    <Image
                      src="/soobin-icon.png"
                      alt="SOOBIN Services Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Right: Information */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 block tracking-wide">
                      Jasa Pengolahan Data & Statistik Skripsi
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5">
                      Pusing Olah Data SPSS, PLS, atau AMOS?
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      Tim statistik SOOBIN siap bantu olah data SPSS / SmartPLS / AMOS / EViews lengkap dengan interpretasi Bab 4 & garansi revisi gratis sampai sidang.
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
                      href="https://wa.me/6287815797525?text=Halo%20Admin%20SOOBIN%2C%20mau%20konsultasi%20jasa%20olah%20data%20statistik%20SPSS%20dong"
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

      {/* Educational FAQ Section */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Panduan Pemilihan Rumus Sampel Penelitian
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Kapan harus memakai Rumus Slovin vs Rumus Lemeshow?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kapan Menggunakan Rumus Slovin?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gunakan rumus <b>Slovin</b> jika jumlah populasi penelitian Anda <b>sudah diketahui dengan pasti (Finite Population)</b>, misalnya jumlah seluruh mahasiswa aktif di Fakultas X (1.500 orang) atau total karyawan di Perusahaan Y (300 orang).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kapan Menggunakan Rumus Lemeshow?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gunakan rumus <b>Lemeshow</b> jika ukuran populasi penelitian <b>tidak diketahui secara pasti atau sangat besar / tak terhingga (Infinite Population)</b>, misalnya konsumen pengguna aplikasi Shopee di Jawa Tengah atau penderita diabetes di suatu provinsi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
