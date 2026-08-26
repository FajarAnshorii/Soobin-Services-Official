'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookMarked,
  BookOpen,
  Search,
  Copy,
  Check,
  Plus,
  Trash2,
  Download,
  MessageCircle,
  FileText,
  Book,
  Globe,
  GraduationCap,
  Users,
  ExternalLink,
  HelpCircle,
  Info,
  RefreshCw,
  Share2
} from 'lucide-react';
import {
  CitationData,
  CitationStyle,
  Author,
  generateCitation,
  fetchCrossRefMetadata
} from '@/lib/citationUtils';

const styleOptions: { id: CitationStyle; label: string; desc: string }[] = [
  { id: 'apa', label: 'APA 7th', desc: 'Psikologi, Sains Sosial, Bisnis & Kedokteran' },
  { id: 'harvard', label: 'Harvard', desc: 'Ekonomi, Manajemen & Standar Umum Kampus' },
  { id: 'ieee', label: 'IEEE', desc: 'Teknik, Informatika, Komputer & Elektro' },
  { id: 'mla', label: 'MLA 9th', desc: 'Bahasa, Sastra, Seni & Humaniora' },
  { id: 'chicago', label: 'Chicago', desc: 'Sejarah, Seni, Literatur & Bisnis' },
];

const sourceTypes: { id: CitationData['sourceType']; label: string; icon: any }[] = [
  { id: 'journal', label: 'Jurnal Ilmiah', icon: FileText },
  { id: 'book', label: 'Buku / E-Book', icon: Book },
  { id: 'website', label: 'Website / Online', icon: Globe },
  { id: 'thesis', label: 'Skripsi / Tesis', icon: GraduationCap },
  { id: 'conference', label: 'Konferensi / Seminar', icon: Users },
];

export default function DaftarPustakaGeneratorPage() {
  const [activeStyle, setActiveStyle] = useState<CitationStyle>('apa');
  const [sourceType, setSourceType] = useState<CitationData['sourceType']>('journal');

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

  // Auto search by DOI / Title
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Manual Form States
  const [authors, setAuthors] = useState<Author[]>([{ firstName: '', lastName: '' }]);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [journalName, setJournalName] = useState('');
  const [volume, setVolume] = useState('');
  const [issue, setIssue] = useState('');
  const [pages, setPages] = useState('');
  const [doi, setDoi] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publisherCity, setPublisherCity] = useState('');
  const [edition, setEdition] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [url, setUrl] = useState('');
  const [accessDate, setAccessDate] = useState('');
  const [degree, setDegree] = useState('Skripsi S1');
  const [university, setUniversity] = useState('');
  const [conferenceName, setConferenceName] = useState('');

  // Copy Feedback State
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Batch Saved Citations List
  const [savedCitations, setSavedCitations] = useState<{ id: string; raw: CitationData }[]>([]);

  // Add author field
  const handleAddAuthor = () => {
    setAuthors([...authors, { firstName: '', lastName: '' }]);
  };

  // Remove author field
  const handleRemoveAuthor = (index: number) => {
    if (authors.length <= 1) return;
    setAuthors(authors.filter((_, i) => i !== index));
  };

  // Update author field
  const handleUpdateAuthor = (index: number, field: 'firstName' | 'lastName', value: string) => {
    const updated = [...authors];
    updated[index][field] = value;
    setAuthors(updated);
  };

  // Auto CrossRef Search
  const handleAutoSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const data = await fetchCrossRefMetadata(searchQuery);
      if (data) {
        setSourceType('journal');
        if (data.authors && data.authors.length > 0) {
          setAuthors(data.authors);
        }
        if (data.title) setTitle(data.title);
        if (data.year) setYear(data.year);
        if (data.journalName) setJournalName(data.journalName);
        if (data.volume) setVolume(data.volume);
        if (data.issue) setIssue(data.issue);
        if (data.pages) setPages(data.pages);
        if (data.doi) setDoi(data.doi);
        if (data.publisher) setPublisher(data.publisher);
      } else {
        setSearchError('Data artikel tidak ditemukan. Pastikan memasukkan DOI lengkap (contoh: 10.15294/jpii.v15i1.21243) atau judul jurnal, atau isi formulir manual di bawah.');
      }
    } catch (err: any) {
      if (err?.message === 'DOI_INCOMPLETE') {
        setSearchError('Format DOI belum lengkap! Masukkan nomor DOI artikel lengkap beserta suffix-nya (contoh: 10.15294/jpii.v15i1.21243).');
      } else {
        setSearchError('Terjadi kesalahan koneksi saat mencari metadata. Silakan gunakan formulir manual.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Current compiled citation data
  const currentCitationData: CitationData = useMemo(() => {
    return {
      sourceType,
      authors: authors.filter((a) => a.firstName.trim() || a.lastName.trim()),
      year,
      title,
      journalName,
      volume,
      issue,
      pages,
      doi,
      publisher,
      publisherCity,
      edition,
      websiteName,
      url,
      accessDate,
      degree,
      university,
      conferenceName,
    };
  }, [
    sourceType,
    authors,
    year,
    title,
    journalName,
    volume,
    issue,
    pages,
    doi,
    publisher,
    publisherCity,
    edition,
    websiteName,
    url,
    accessDate,
    degree,
    university,
    conferenceName,
  ]);

  // Generated Citation Result
  const generatedResult = useMemo(() => {
    return generateCitation(currentCitationData, activeStyle);
  }, [currentCitationData, activeStyle]);

  // Copy helper
  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Add to saved list
  const handleSaveToBatch = () => {
    if (!title.trim() && authors.every((a) => !a.lastName && !a.firstName)) return;
    const newEntry = {
      id: `cit_${Date.now()}`,
      raw: { ...currentCitationData },
    };
    setSavedCitations((prev) => [...prev, newEntry]);
  };

  // Remove from saved list
  const handleRemoveSaved = (id: string) => {
    setSavedCitations((prev) => prev.filter((c) => c.id !== id));
  };

  // Formatted batch list sorted alphabetically A-Z
  const formattedBatchList = useMemo(() => {
    return savedCitations
      .map((c) => ({
        id: c.id,
        ...generateCitation(c.raw, activeStyle),
        authorSortKey: (c.raw.authors[0]?.lastName || c.raw.authors[0]?.firstName || c.raw.title).toLowerCase(),
      }))
      .sort((a, b) => a.authorSortKey.localeCompare(b.authorSortKey));
  }, [savedCitations, activeStyle]);

  // Copy all batch citations
  const handleCopyAllBatch = () => {
    const fullText = formattedBatchList.map((c) => c.plainText).join('\n\n');
    handleCopyText(fullText, 'batch_all');
  };

  // Download batch as text file
  const handleDownloadTxt = () => {
    const fullText = `DAFTAR PUSTAKA (${activeStyle.toUpperCase()} FORMAT)\nGenerated by SOOBIN Services\n\n` + formattedBatchList.map((c) => c.plainText).join('\n\n');
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const urlBlob = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = urlBlob;
    link.download = `Daftar_Pustaka_${activeStyle.toUpperCase()}.txt`;
    link.click();
    URL.revokeObjectURL(urlBlob);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Header Section */}
      <section className="pt-24 sm:pt-32 pb-6 sm:pb-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3">
            <BookMarked className="w-3.5 h-3.5 text-primary-700" />
            <span>Mini Tool Akademik Gratis</span>
          </div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Generator Sitasi & Daftar Pustaka
          </h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Buat format sitasi dan daftar pustaka otomatis berstandar <b>APA, Harvard, IEEE, MLA & Chicago</b>. Mendukung pencarian otomatis via link DOI dan multi-penulis.
          </p>
        </div>
      </section>

      {/* Main Tool Content Area */}
      <section className="py-6 sm:py-12 pb-28 sm:pb-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Column: Form & Style Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Style Selection Tabs */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                  Pilih Format Gaya Sitasi
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-2">
                  {styleOptions.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setActiveStyle(style.id)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        activeStyle === style.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="block text-xs font-extrabold">{style.label}</span>
                      <span className={`block text-[10px] mt-0.5 truncate ${activeStyle === style.id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {style.desc.split(',')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Auto Search via DOI or Manual Source Type */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                    Cari Otomatis atau Isi Manual
                  </label>
                  <span className="text-[10px] sm:text-[11px] text-primary-700 font-bold bg-primary-50 px-2 py-0.5 rounded-full">
                    Auto CrossRef
                  </span>
                </div>

                {/* Auto DOI / Title Search Bar */}
                <form onSubmit={handleAutoSearch} className="relative">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Nomor DOI (contoh: 10.15294/jpii.v15i1.21243) atau judul jurnal..."
                        className="w-full h-11 pl-10 pr-4 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs font-medium text-slate-900 outline-none transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSearching || !searchQuery.trim()}
                      className="h-11 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer transition-all shadow-xs"
                    >
                      {isSearching ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Mencari...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-3.5 h-3.5" />
                          <span>Auto Fill</span>
                        </>
                      )}
                    </button>
                  </div>
                  {searchError && (
                    <p className="text-[11px] text-red-600 mt-2 font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
                      ⚠️ {searchError}
                    </p>
                  )}
                </form>

                {/* Source Type Selector */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Pilih Jenis Sumber Referensi:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {sourceTypes.map((st) => {
                      const Icon = st.icon;
                      const isSelected = sourceType === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setSourceType(st.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900 font-bold'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 font-medium'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="text-xs font-semibold leading-tight">{st.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Input Fields Form */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  {/* Authors Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">
                        Penulis ({authors.length} Orang)
                      </label>
                      <button
                        type="button"
                        onClick={handleAddAuthor}
                        className="text-[11px] font-bold text-primary-700 hover:text-primary-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Penulis</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {authors.map((author, idx) => (
                        <div
                          key={idx}
                          className="p-2 sm:p-0 bg-slate-50 sm:bg-transparent border border-slate-200 sm:border-0 rounded-xl space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2"
                        >
                          <input
                            type="text"
                            placeholder="Nama Depan / Inisial (opsional)"
                            value={author.firstName}
                            onChange={(e) => handleUpdateAuthor(idx, 'firstName', e.target.value)}
                            className="w-full sm:flex-1 h-10 px-3 bg-white sm:bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                          />
                          <div className="flex items-center gap-2 w-full sm:flex-1">
                            <input
                              type="text"
                              placeholder="Nama Belakang / Fam *"
                              value={author.lastName}
                              onChange={(e) => handleUpdateAuthor(idx, 'lastName', e.target.value)}
                              className="flex-1 h-10 px-3 bg-white sm:bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                            />
                            {authors.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveAuthor(idx)}
                                className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                                title="Hapus Penulis"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Title & Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Judul {sourceType === 'journal' ? 'Artikel Jurnal' : sourceType === 'book' ? 'Buku' : 'Dokumen'} *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Contoh: Penerapan Algoritma Deep Learning"
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tahun Terbit *
                      </label>
                      <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="2026"
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* Conditional: Journal Fields */}
                  {sourceType === 'journal' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nama Jurnal Ilmiah
                        </label>
                        <input
                          type="text"
                          value={journalName}
                          onChange={(e) => setJournalName(e.target.value)}
                          placeholder="Contoh: Jurnal Teknologi Informasi dan Ilmu Komputer"
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div>
                          <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Volume</label>
                          <input
                            type="text"
                            value={volume}
                            onChange={(e) => setVolume(e.target.value)}
                            placeholder="11"
                            className="w-full h-10 px-2.5 sm:px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1 truncate">No / Issue</label>
                          <input
                            type="text"
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                            placeholder="2"
                            className="w-full h-10 px-2.5 sm:px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Halaman</label>
                          <input
                            type="text"
                            value={pages}
                            onChange={(e) => setPages(e.target.value)}
                            placeholder="145-156"
                            className="w-full h-10 px-2.5 sm:px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">DOI / Link URL</label>
                        <input
                          type="text"
                          value={doi}
                          onChange={(e) => setDoi(e.target.value)}
                          placeholder="Contoh: https://doi.org/10.1016/..."
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>
                    </>
                  )}

                  {/* Conditional: Book Fields */}
                  {sourceType === 'book' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Penerbit</label>
                        <input
                          type="text"
                          value={publisher}
                          onChange={(e) => setPublisher(e.target.value)}
                          placeholder="Contoh: Gramedia / Erlangga"
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Kota Terbit</label>
                        <input
                          type="text"
                          value={publisherCity}
                          onChange={(e) => setPublisherCity(e.target.value)}
                          placeholder="Contoh: Jakarta"
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Edisi (Opsional)</label>
                        <input
                          type="text"
                          value={edition}
                          onChange={(e) => setEdition(e.target.value)}
                          placeholder="Contoh: Edisi ke-3"
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Conditional: Website Fields */}
                  {sourceType === 'website' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nama Website / Media</label>
                        <input
                          type="text"
                          value={websiteName}
                          onChange={(e) => setWebsiteName(e.target.value)}
                          placeholder="Contoh: Kompas.com / Detik / WHO"
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Akses</label>
                        <input
                          type="text"
                          value={accessDate}
                          onChange={(e) => setAccessDate(e.target.value)}
                          placeholder="Contoh: 25 Agustus 2024"
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Link URL</label>
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Conditional: Thesis Fields */}
                  {sourceType === 'thesis' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Jenjang Tugas Akhir</label>
                        <select
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                        >
                          <option value="Skripsi S1">Skripsi (S1)</option>
                          <option value="Tesis S2">Tesis (S2)</option>
                          <option value="Disertasi S3">Disertasi (S3)</option>
                          <option value="Laporan Tugas Akhir">Laporan Tugas Akhir (D3/D4)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Perguruan Tinggi / Universitas</label>
                        <input
                          type="text"
                          value={university}
                          onChange={(e) => setUniversity(e.target.value)}
                          placeholder="Contoh: Universitas Indonesia"
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Conditional: Conference Fields */}
                  {sourceType === 'conference' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Konferensi / Seminar Prosiding</label>
                      <input
                        type="text"
                        value={conferenceName}
                        onChange={(e) => setConferenceName(e.target.value)}
                        placeholder="Contoh: Prosiding Seminar Nasional Ilmu Komputer (SNIK 2024)"
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Live Output, In-text Citation & Batch Collection (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Card 1: Live Generated Output */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Hasil Format Daftar Pustaka</h3>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-700">
                        {activeStyle.toUpperCase()} Style
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyText(generatedResult.plainText, 'single')}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                  >
                    {copiedType === 'single' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Sitasi</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Formatted Preview Box */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                  <div
                    className="text-xs leading-relaxed text-slate-800 select-all font-serif"
                    dangerouslySetInnerHTML={{ __html: generatedResult.html }}
                  />
                </div>

                {/* In-Text Citation (Sitasi dalam Teks / Body Paragraf) */}
                <div className="pt-3 border-t border-slate-100 space-y-2 mb-4">
                  <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Format Sitasi Dalam Teks (In-Text):
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase">Parenthetical</span>
                        <span className="text-xs font-semibold text-slate-800">{generatedResult.inTextParenthetical}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(generatedResult.inTextParenthetical, 'intext_parenthetical')}
                        className="p-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Salin"
                      >
                        {copiedType === 'intext_parenthetical' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase">Narrative</span>
                        <span className="text-xs font-semibold text-slate-800">{generatedResult.inTextNarrative}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(generatedResult.inTextNarrative, 'intext_narrative')}
                        className="p-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Salin"
                      >
                        {copiedType === 'intext_narrative' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Batch Collection Button */}
                <button
                  type="button"
                  onClick={handleSaveToBatch}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Simpan ke Daftar Pustaka Saya ({savedCitations.length})</span>
                </button>

                {/* Batch List Drawer (If user saved multiple items) */}
                {savedCitations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold text-slate-800">
                        Koleksi ({savedCitations.length} Referensi A-Z)
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleCopyAllBatch}
                          className="px-2 py-1 bg-slate-900 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedType === 'batch_all' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Salin Semua</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDownloadTxt}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                          title="Download .TXT"
                        >
                          <Download className="w-3 h-3" />
                          <span>.TXT</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {formattedBatchList.map((item, idx) => (
                        <div key={item.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-2 text-[11px]">
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-slate-900 mr-1">{idx + 1}.</span>
                            <span dangerouslySetInnerHTML={{ __html: item.html }} />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSaved(item.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors shrink-0 p-0.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Promo Card: SOOBIN Mendeley & Reference Service (Clean Minimalist Hotel Card Style) */}
                <div className="mt-5 rounded-2xl bg-[#121824] border border-slate-800 text-white overflow-hidden shadow-sm flex flex-col sm:flex-row items-stretch">
                  {/* Left Side: Logo Container */}
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

                  {/* Right Side: Information */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block tracking-wide">
                        Jasa Mendeley & Skripsi
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5">
                        Butuh Rapikan Ratusan Referensi?
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        Admin SOOBIN siap bantu input Mendeley, format Zotero, dan cek Turnitin No Repository mulai <span className="font-semibold text-emerald-400">Rp 1.000/sumber</span>.
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
                        href="https://wa.me/6287815797525?text=Halo%20Admin%20SOOBIN%2C%20mau%20jasa%20rapikan%20daftar%20pustaka%20dan%20mendeley%20dong"
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
        </div>
      </section>

      {/* SEO & Educational Guide Section */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Panduan Format Gaya Penulisan Daftar Pustaka
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
              Kenali perbedaan standar sitasi yang umum digunakan di berbagai fakultas dan jurnal internasional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-700"></span>
                APA 7th Edition (American Psychological Association)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Paling banyak digunakan pada jurusan Psikologi, Pendidikan, Sosiologi, Ekonomi, dan Bisnis. Ciri khasnya mencantumkan tahun di awal setelah nama penulis: <code>Nama, A. (Tahun). Judul artikel. Nama Jurnal, vol(no), hal.</code>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                IEEE (Institute of Electrical and Electronics Engineers)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Standar wajib pada jurusan Teknik Informatika, Ilmu Komputer, Sistem Informasi, dan Teknik Elektro. Menggunakan sistem nomor dalam kurung siku <code>[1]</code> yang diurutkan berdasarkan urutan kemunculan di artikel.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                Harvard Referencing Style
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Sistem Author-Date yang populer di universitas di Inggris, Australia, dan fakultas Ekonomi/Manajemen di Indonesia. Penulisan nama penulis diikuti tahun tanpa tanda kurung: <code>Nama, A., Tahun. Judul artikel...</code>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                MLA 9th Edition (Modern Language Association)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Umum dipakai dalam bidang Sastra, Bahasa, Linguistik, Seni, dan Budaya. Judul artikel menggunakan tanda petik dua dan tahun diletakkan di bagian akhir sitasi.
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
