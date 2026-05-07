'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { motion, useInView } from 'framer-motion';
import {
  FileCheck, RefreshCw, Pen, Unlock, GraduationCap, Code,
  Calculator, Languages, BookOpen, Presentation, Database,
  FileSpreadsheet, Globe, Star, Filter, Search,
  Target, BookMarked, FlaskConical, Route, ChevronLeft, ChevronRight,
  ClipboardList, BarChart, School, Share2, Image, Monitor, MonitorCheck,
  ArrowUp
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'Semua', icon: Filter },
  { id: 'turnitin', label: 'Cek Turnitin & AI', icon: FileCheck },
  { id: 'parafrase', label: 'Parafrase', icon: RefreshCw },
  { id: 'joki-tugas', label: 'Joki Tugas', icon: Pen },
  { id: 'joki-skripsi', label: 'Joki Skripsi', icon: GraduationCap },
  { id: 'uji-data', label: 'Uji Data', icon: BarChart },
  { id: 'tugas-sekolah', label: 'Tugas Sekolah', icon: School },
  { id: 'unlock', label: 'Unlock', icon: Unlock },
  { id: 'umum', label: 'Umum', icon: Globe },
  { id: 'medsos', label: 'Media Sosial', icon: Share2 },
  { id: 'desain', label: 'Desain Grafis', icon: Image },
  { id: 'digital', label: 'Digital & Online', icon: Monitor },
  { id: 'uiux', label: 'UI/UX Design', icon: MonitorCheck },
];

const services = [
  // Turnitin & AI
  { id: 1, category: 'turnitin', name: 'Cek Turnitin 1x', price: 'Rp 4.000', icon: FileCheck, badge: null },
  { id: 2, category: 'turnitin', name: 'Cek Turnitin 3x', price: 'Rp 12.000', icon: FileCheck, badge: 'Hemat!' },
  { id: 3, category: 'turnitin', name: 'Cek Turnitin 6x', price: 'Rp 24.000', icon: FileCheck, badge: 'Best Deal!' },
  { id: 4, category: 'turnitin', name: 'Cek AI 1x', price: 'Rp 5.000', icon: FileCheck, badge: null },
  { id: 5, category: 'turnitin', name: 'Cek AI 2x', price: 'Rp 10.000', icon: FileCheck, badge: null },

  // Parafrase
  { id: 6, category: 'parafrase', name: 'Parafrase Dokumen', price: 'Rp 2.000/Hal', icon: RefreshCw, badge: null },

  // Joki Tugas - Pendukung
  { id: 7, category: 'joki-tugas', name: 'Translate Grammar', price: 'Rp 2.000/Hal', icon: Languages, badge: null },
  { id: 8, category: 'joki-tugas', name: 'Daftar Pustaka', price: 'Rp 1.000/Sumber', icon: BookOpen, badge: null },
  { id: 9, category: 'joki-tugas', name: 'Pembuatan PPT', price: 'Rp 3.000/Hal', icon: Presentation, badge: null },
  { id: 10, category: 'joki-tugas', name: 'Daftar Isi Otomatis', price: 'Rp 10.000', icon: Calculator, badge: null },
  { id: 11, category: 'joki-tugas', name: 'Pengetikan File', price: 'Rp 1.000/Hal', icon: Pen, badge: null },
  { id: 12, category: 'joki-tugas', name: 'Olah Data SPSS', price: 'Chat Admin', icon: Database, badge: null },
  { id: 13, category: 'joki-tugas', name: 'Olah Data Eviews', price: 'Chat Admin', icon: FileSpreadsheet, badge: null },
  { id: 14, category: 'joki-tugas', name: 'Olah Data Python', price: 'Chat Admin', icon: Code, badge: null },
  { id: 15, category: 'joki-tugas', name: 'Review Jurnal', price: 'Rp 25.000/Review', icon: BookOpen, badge: null },

  // Joki Tugas - Utama
  { id: 16, category: 'joki-tugas', name: 'Joki Makalah', price: 'Start Rp 40.000', icon: Pen, badge: null },
  { id: 17, category: 'joki-tugas', name: 'Joki Mendeley', price: 'Rp 1.000/Sumber', icon: BookOpen, badge: null },
  { id: 18, category: 'joki-tugas', name: 'Joki Artikel', price: 'Start Rp 50.000', icon: Pen, badge: null },
  { id: 19, category: 'joki-tugas', name: 'Joki Jurnal', price: 'Start Rp 70.000', icon: BookOpen, badge: null },
  { id: 20, category: 'joki-tugas', name: 'Joki Essay', price: 'Start Rp 40.000', icon: Pen, badge: null },
  { id: 21, category: 'joki-tugas', name: 'Joki Tugas Informatika', price: 'Chat Admin', icon: Code, badge: null },
  { id: 22, category: 'joki-tugas', name: 'Joki Tugas Coding', price: 'Chat Admin', icon: Code, badge: null },
  { id: 23, category: 'joki-tugas', name: 'Joki Pantun Dongeng', price: 'Chat Admin', icon: Pen, badge: null },
  { id: 24, category: 'joki-tugas', name: 'Joki Laporan Praktikum', price: 'Chat Admin', icon: BookOpen, badge: null },
  { id: 25, category: 'joki-tugas', name: 'Tugas Fisika/Kimia/Biologi', price: 'Chat Admin', icon: Calculator, badge: null },
  { id: 26, category: 'joki-tugas', name: 'Tugas MTK/Spatial/Aritmatika', price: 'Chat Admin', icon: Calculator, badge: null },
  { id: 27, category: 'joki-tugas', name: 'Tugas Hukum/Sosio/Psikologi', price: 'Chat Admin', icon: BookOpen, badge: null },
  { id: 28, category: 'joki-tugas', name: 'Tugas Pendidikan/IPS', price: 'Chat Admin', icon: BookOpen, badge: null },
  { id: 29, category: 'joki-tugas', name: 'Joki Google Colab', price: 'Chat Admin', icon: Code, badge: null },
  { id: 30, category: 'joki-tugas', name: 'Joki Resume / Rangkuman', price: 'Chat Admin', icon: FileSpreadsheet, badge: null },
  { id: 31, category: 'joki-tugas', name: 'Tugas SMP,SMA,SMK', price: 'Chat Admin', icon: Calculator, badge: null },
  { id: 32, category: 'joki-tugas', name: 'Buat Lamaran Kerja', price: 'Chat Admin', icon: Pen, badge: null },
  { id: 33, category: 'joki-tugas', name: 'Nomor Halaman', price: 'Chat Admin', icon: BookOpen, badge: null },

  // Laporan & Dokumen Akademik
  { id: 111, category: 'joki-tugas', name: 'Proposal Penelitian', price: '150k–500k', icon: Pen, badge: null },
  { id: 112, category: 'joki-tugas', name: 'Proposal Kegiatan Kampus', price: '75k–250k', icon: Pen, badge: null },
  { id: 113, category: 'joki-tugas', name: 'Proposal PKM', price: '150k–500k', icon: Pen, badge: null },
  { id: 114, category: 'joki-tugas', name: 'Proposal Magang', price: '75k–250k', icon: Pen, badge: null },
  { id: 115, category: 'joki-tugas', name: 'Proposal KKN', price: '75k–250k', icon: Pen, badge: null },
  { id: 116, category: 'joki-tugas', name: 'Proposal Bisnis Mahasiswa', price: '150k–500k', icon: Pen, badge: null },
  { id: 117, category: 'joki-tugas', name: 'Laporan Magang', price: '150k–500k', icon: BookOpen, badge: null },
  { id: 118, category: 'joki-tugas', name: 'Laporan KKN', price: '150k–500k', icon: BookOpen, badge: null },
  { id: 119, category: 'joki-tugas', name: 'Laporan PKL Kuliah', price: '150k–500k', icon: BookOpen, badge: null },
  { id: 120, category: 'joki-tugas', name: 'Laporan Observasi', price: '75k–250k', icon: BookOpen, badge: null },
  { id: 121, category: 'joki-tugas', name: 'Laporan Studi Kasus', price: '100k–350k', icon: BookOpen, badge: null },
  { id: 122, category: 'joki-tugas', name: 'Laporan Field Trip', price: '75k–250k', icon: BookOpen, badge: null },
  { id: 123, category: 'joki-tugas', name: 'Laporan Kunjungan Industri', price: '75k–250k', icon: BookOpen, badge: null },
  { id: 124, category: 'joki-tugas', name: 'Laporan Mini Riset', price: '100k–350k', icon: BookOpen, badge: null },
  { id: 125, category: 'joki-tugas', name: 'Laporan Hasil Wawancara', price: '75k–250k', icon: BookOpen, badge: null },
  { id: 126, category: 'joki-tugas', name: 'Laporan Pengabdian Masyarakat', price: '150k–500k', icon: BookOpen, badge: null },
  { id: 127, category: 'joki-tugas', name: 'Laporan Kegiatan Organisasi', price: '75k–250k', icon: BookOpen, badge: null },
  { id: 128, category: 'joki-tugas', name: 'Logbook Magang', price: '50k–200k', icon: BookOpen, badge: null },
  { id: 129, category: 'joki-tugas', name: 'Logbook KKN', price: '50k–200k', icon: BookOpen, badge: null },
  { id: 130, category: 'joki-tugas', name: 'Portofolio Kuliah', price: '75k–300k', icon: BookOpen, badge: null },
  { id: 131, category: 'joki-tugas', name: 'Tugas Case Study', price: '75k–300k', icon: Pen, badge: null },
  { id: 132, category: 'joki-tugas', name: 'Tugas Critical Thinking', price: '50k–200k', icon: Pen, badge: null },
  { id: 133, category: 'joki-tugas', name: 'Tugas Analisis Film', price: '50k–200k', icon: Pen, badge: null },
  { id: 134, category: 'joki-tugas', name: 'Tugas Analisis Buku', price: '50k–200k', icon: Pen, badge: null },
  { id: 135, category: 'joki-tugas', name: 'Tugas Analisis Berita', price: '50k–200k', icon: Pen, badge: null },
  { id: 136, category: 'joki-tugas', name: 'Tugas Analisis Kebijakan', price: '100k–350k', icon: Pen, badge: null },
  { id: 137, category: 'joki-tugas', name: 'Tugas Studi Literatur', price: '100k–350k', icon: Pen, badge: null },
  { id: 138, category: 'joki-tugas', name: 'Tugas Annotated Bibliography', price: '75k–250k', icon: Pen, badge: null },
  { id: 139, category: 'joki-tugas', name: 'Tugas Opini Akademik', price: '40k–150k', icon: Pen, badge: null },
  { id: 140, category: 'joki-tugas', name: 'Tugas Refleksi Perkuliahan', price: '40k–150k', icon: Pen, badge: null },

  // Bidang Kuliah Spesifik
  { id: 141, category: 'joki-tugas', name: 'Tugas Akuntansi', price: '50k–250k', icon: Calculator, badge: null },
  { id: 142, category: 'joki-tugas', name: 'Tugas Manajemen', price: '50k–250k', icon: Calculator, badge: null },
  { id: 143, category: 'joki-tugas', name: 'Tugas Pemasaran', price: '50k–250k', icon: Calculator, badge: null },
  { id: 144, category: 'joki-tugas', name: 'Tugas Keuangan', price: '75k–300k', icon: Calculator, badge: null },
  { id: 145, category: 'joki-tugas', name: 'Tugas Perpajakan', price: '75k–300k', icon: Calculator, badge: null },
  { id: 146, category: 'joki-tugas', name: 'Tugas Audit', price: '100k–350k', icon: Calculator, badge: null },
  { id: 147, category: 'joki-tugas', name: 'Tugas Ekonomi Mikro', price: '50k–250k', icon: Calculator, badge: null },
  { id: 148, category: 'joki-tugas', name: 'Tugas Ekonomi Makro', price: '50k–250k', icon: Calculator, badge: null },
  { id: 149, category: 'joki-tugas', name: 'Tugas Administrasi Publik', price: '50k–250k', icon: BookOpen, badge: null },
  { id: 150, category: 'joki-tugas', name: 'Tugas Ilmu Komunikasi', price: '50k–250k', icon: BookOpen, badge: null },
  { id: 151, category: 'joki-tugas', name: 'Tugas Public Relations', price: '50k–250k', icon: BookOpen, badge: null },
  { id: 152, category: 'joki-tugas', name: 'Tugas Broadcasting', price: '75k–300k', icon: BookOpen, badge: null },
  { id: 153, category: 'joki-tugas', name: 'Tugas Pariwisata', price: '50k–250k', icon: Globe, badge: null },
  { id: 154, category: 'joki-tugas', name: 'Tugas Perhotelan', price: '50k–250k', icon: Globe, badge: null },
  { id: 155, category: 'joki-tugas', name: 'Tugas Teknik Sipil', price: '100k–500k', icon: Calculator, badge: null },
  { id: 156, category: 'joki-tugas', name: 'Tugas Teknik Industri', price: '100k–500k', icon: Calculator, badge: null },
  { id: 157, category: 'joki-tugas', name: 'Tugas Teknik Mesin', price: '100k–500k', icon: Calculator, badge: null },
  { id: 158, category: 'joki-tugas', name: 'Tugas Teknik Elektro', price: '100k–500k', icon: Code, badge: null },
  { id: 159, category: 'joki-tugas', name: 'Tugas Arsitektur', price: '150k–750k', icon: Calculator, badge: null },
  { id: 160, category: 'joki-tugas', name: 'Tugas Desain Interior', price: '150k–750k', icon: Calculator, badge: null },
  { id: 161, category: 'joki-tugas', name: 'Tugas DKV', price: '100k–500k', icon: Calculator, badge: null },
  { id: 162, category: 'joki-tugas', name: 'Tugas Keperawatan', price: '75k–300k', icon: Calculator, badge: null },
  { id: 163, category: 'joki-tugas', name: 'Tugas Kebidanan', price: '75k–300k', icon: Calculator, badge: null },
  { id: 164, category: 'joki-tugas', name: 'Tugas Farmasi', price: '100k–500k', icon: Calculator, badge: null },
  { id: 165, category: 'joki-tugas', name: 'Tugas Gizi', price: '75k–300k', icon: Calculator, badge: null },
  { id: 166, category: 'joki-tugas', name: 'Tugas Kesehatan Masyarakat', price: '75k–300k', icon: Calculator, badge: null },
  { id: 167, category: 'joki-tugas', name: 'Tugas Agribisnis', price: '50k–250k', icon: Globe, badge: null },
  { id: 168, category: 'joki-tugas', name: 'Tugas Peternakan', price: '50k–250k', icon: Globe, badge: null },
  { id: 169, category: 'joki-tugas', name: 'Tugas Perikanan', price: '50k–250k', icon: Globe, badge: null },
  { id: 170, category: 'joki-tugas', name: 'Tugas Kehutanan', price: '50k–250k', icon: Globe, badge: null },

  // Joki Skripsi
  { id: 34, category: 'joki-skripsi', name: 'Paket Sempro', price: 'Chat Admin', icon: GraduationCap, badge: null },
  { id: 35, category: 'joki-skripsi', name: 'Bab 1 / 2 / 3', price: 'Chat Admin', icon: BookOpen, badge: 'Best Seller' },
  { id: 36, category: 'joki-skripsi', name: 'Cari Referensi', price: 'Chat Admin', icon: Star, badge: null },
  { id: 37, category: 'joki-skripsi', name: 'Paket Lengkap Skripsi', price: 'Chat Admin', icon: GraduationCap, badge: 'Termurah' },

  // Persiapan Skripsi
  { id: 38, category: 'joki-skripsi', name: 'Konsultasi Judul Penelitian', price: '15k–35k', icon: Target, badge: null },
  { id: 39, category: 'joki-skripsi', name: 'Rekomendasi Judul Penelitian', price: '25k–75k', icon: BookMarked, badge: null },
  { id: 40, category: 'joki-skripsi', name: 'Bantu Susun Rumusan Masalah', price: '20k–50k', icon: Target, badge: null },
  { id: 41, category: 'joki-skripsi', name: 'Bantu Susun Tujuan Penelitian', price: '20k–50k', icon: Target, badge: null },
  { id: 42, category: 'joki-skripsi', name: 'Bantu Susun Manfaat Penelitian', price: '20k–50k', icon: BookMarked, badge: null },
  { id: 43, category: 'joki-skripsi', name: 'Bantu Susun Kerangka Berpikir', price: '40k–100k', icon: FlaskConical, badge: null },
  { id: 44, category: 'joki-skripsi', name: 'Bantu Susun Kerangka Konsep', price: '40k–100k', icon: FlaskConical, badge: null },
  { id: 45, category: 'joki-skripsi', name: 'Bantu Susun Hipotesis', price: '25k–75k', icon: FlaskConical, badge: null },
  { id: 46, category: 'joki-skripsi', name: 'Bantu Tentukan Variabel Penelitian', price: '25k–75k', icon: FlaskConical, badge: null },
  { id: 47, category: 'joki-skripsi', name: 'Bantu Cari Gap Penelitian', price: '50k–150k', icon: Route, badge: null },
  { id: 48, category: 'joki-skripsi', name: 'Bantu Tentukan Metode Penelitian', price: '50k–150k', icon: FlaskConical, badge: null },
  { id: 49, category: 'joki-skripsi', name: 'Bantu Tentukan Populasi & Sampel', price: '40k–100k', icon: FlaskConical, badge: null },
  { id: 50, category: 'joki-skripsi', name: 'Bantu Teknik Sampling', price: '35k–100k', icon: Route, badge: null },
  { id: 51, category: 'joki-skripsi', name: 'Bantu Susun Alur Penelitian', price: '50k–150k', icon: Route, badge: null },
  { id: 52, category: 'joki-skripsi', name: 'Bantu Susun Roadmap Penelitian', price: '75k–200k', icon: Route, badge: null },
  { id: 53, category: 'joki-skripsi', name: 'Bantu novelty Penelitian', price: '75k–250k', icon: Star, badge: null },

  // Instrumen Penelitian
  { id: 78, category: 'joki-skripsi', name: 'Bantu Buat Kuesioner', price: '50k–150k', icon: ClipboardList, badge: null },
  { id: 79, category: 'joki-skripsi', name: 'Bantu Buat Kisi-Kisi Instrumen', price: '40k–120k', icon: ClipboardList, badge: null },
  { id: 80, category: 'joki-skripsi', name: 'Bantu Buat Pedoman Wawancara', price: '40k–120k', icon: ClipboardList, badge: null },
  { id: 81, category: 'joki-skripsi', name: 'Bantu Buat Pedoman Observasi', price: '40k–120k', icon: ClipboardList, badge: null },
  { id: 82, category: 'joki-skripsi', name: 'Bantu Buat Form Validasi Ahli', price: '40k–100k', icon: ClipboardList, badge: null },
  { id: 83, category: 'joki-skripsi', name: 'Bantu Buat Tabel Operasional Variabel', price: '50k–150k', icon: ClipboardList, badge: null },
  { id: 84, category: 'joki-skripsi', name: 'Bantu Buat Skala Likert', price: '30k–75k', icon: ClipboardList, badge: null },
  { id: 85, category: 'joki-skripsi', name: 'Bantu Rapikan Instrumen Penelitian', price: '25k–75k', icon: ClipboardList, badge: null },
  { id: 86, category: 'joki-skripsi', name: 'Input Kuesioner ke Google Form', price: '25k–75k', icon: ClipboardList, badge: null },
  { id: 87, category: 'joki-skripsi', name: 'Rekap Jawaban Responden', price: '25k–100k', icon: ClipboardList, badge: null },

  // Uji & Analisis Statistik
  { id: 88, category: 'uji-data', name: 'Uji Validitas', price: '75k–200k', icon: BarChart, badge: null },
  { id: 89, category: 'uji-data', name: 'Uji Reliabilitas', price: '75k–200k', icon: BarChart, badge: null },
  { id: 90, category: 'uji-data', name: 'Uji Normalitas', price: '75k–200k', icon: BarChart, badge: null },
  { id: 91, category: 'uji-data', name: 'Uji Homogenitas', price: '75k–200k', icon: BarChart, badge: null },
  { id: 92, category: 'uji-data', name: 'Uji Linearitas', price: '75k–200k', icon: BarChart, badge: null },
  { id: 93, category: 'uji-data', name: 'Uji Multikolinearitas', price: '100k–250k', icon: BarChart, badge: null },
  { id: 94, category: 'uji-data', name: 'Uji Heteroskedastisitas', price: '100k–250k', icon: BarChart, badge: null },
  { id: 95, category: 'uji-data', name: 'Uji Autokorelasi', price: '100k–250k', icon: BarChart, badge: null },
  { id: 96, category: 'uji-data', name: 'Uji Korelasi', price: '100k–250k', icon: BarChart, badge: null },
  { id: 97, category: 'uji-data', name: 'Uji Regresi Sederhana', price: '150k–300k', icon: BarChart, badge: null },
  { id: 98, category: 'uji-data', name: 'Uji Regresi Berganda', price: '200k–400k', icon: BarChart, badge: null },
  { id: 99, category: 'uji-data', name: 'Uji T', price: '100k–250k', icon: BarChart, badge: null },
  { id: 100, category: 'uji-data', name: 'Uji F', price: '100k–250k', icon: BarChart, badge: null },
  { id: 101, category: 'uji-data', name: 'Uji Chi Square', price: '150k–350k', icon: BarChart, badge: null },
  { id: 102, category: 'uji-data', name: 'Uji ANOVA', price: '200k–450k', icon: BarChart, badge: null },
  { id: 103, category: 'uji-data', name: 'Uji Mann Whitney', price: '150k–350k', icon: BarChart, badge: null },
  { id: 104, category: 'uji-data', name: 'Uji Wilcoxon', price: '150k–350k', icon: BarChart, badge: null },
  { id: 105, category: 'uji-data', name: 'Uji Kruskal Wallis', price: '200k–450k', icon: BarChart, badge: null },
  { id: 106, category: 'uji-data', name: 'Uji Path Analysis', price: '300k–700k', icon: BarChart, badge: null },
  { id: 107, category: 'uji-data', name: 'Uji SEM', price: '500k–1.500k', icon: BarChart, badge: null },
  { id: 108, category: 'uji-data', name: 'Interpretasi Hasil Statistik', price: '100k–300k', icon: BarChart, badge: null },
  { id: 109, category: 'uji-data', name: 'Tabulasi Data Kuesioner', price: '30k–150k', icon: BarChart, badge: null },
  { id: 110, category: 'uji-data', name: 'Cleaning Data Penelitian', price: '50k–200k', icon: BarChart, badge: null },

  // Tugas Harian Sekolah
  { id: 171, category: 'tugas-sekolah', name: 'Latihan Soal Harian', price: '10k–50k', icon: School, badge: null },
  { id: 172, category: 'tugas-sekolah', name: 'Pembahasan Soal', price: '15k–75k', icon: School, badge: null },
  { id: 173, category: 'tugas-sekolah', name: 'Bank Soal Mandiri', price: '25k–100k', icon: School, badge: null },
  { id: 174, category: 'tugas-sekolah', name: 'Mind Map Materi', price: '15k–75k', icon: School, badge: null },
  { id: 175, category: 'tugas-sekolah', name: 'Catatan Estetik', price: '15k–75k', icon: BookOpen, badge: null },
  { id: 176, category: 'tugas-sekolah', name: 'Kartu Hafalan', price: '15k–50k', icon: BookOpen, badge: null },
  { id: 177, category: 'tugas-sekolah', name: 'Ringkasan Per Bab Versi Poin', price: '15k–75k', icon: BookOpen, badge: null },
  { id: 178, category: 'tugas-sekolah', name: 'Tugas Kliping', price: '20k–100k', icon: BookOpen, badge: null },
  { id: 179, category: 'tugas-sekolah', name: 'Tugas Poster Edukasi', price: '25k–100k', icon: BookOpen, badge: null },
  { id: 180, category: 'tugas-sekolah', name: 'Tugas Infografis Sekolah', price: '30k–150k', icon: BookOpen, badge: null },
  { id: 181, category: 'tugas-sekolah', name: 'Tugas Mading', price: '50k–200k', icon: BookOpen, badge: null },
  { id: 182, category: 'tugas-sekolah', name: 'Tugas Biografi Tokoh', price: '25k–100k', icon: Pen, badge: null },
  { id: 183, category: 'tugas-sekolah', name: 'Tugas Autobiografi', price: '25k–100k', icon: Pen, badge: null },
  { id: 184, category: 'tugas-sekolah', name: 'Tugas Teks Pidato', price: '25k–100k', icon: Pen, badge: null },
  { id: 185, category: 'tugas-sekolah', name: 'Tugas Teks MC', price: '25k–100k', icon: Pen, badge: null },
  { id: 186, category: 'tugas-sekolah', name: 'Tugas Teks Drama', price: '40k–150k', icon: Pen, badge: null },
  { id: 187, category: 'tugas-sekolah', name: 'Tugas Teks Negosiasi', price: '20k–75k', icon: Pen, badge: null },
  { id: 188, category: 'tugas-sekolah', name: 'Tugas Teks Eksposisi', price: '20k–75k', icon: Pen, badge: null },
  { id: 189, category: 'tugas-sekolah', name: 'Tugas Teks Eksplanasi', price: '20k–75k', icon: Pen, badge: null },
  { id: 190, category: 'tugas-sekolah', name: 'Tugas Teks Prosedur', price: '20k–75k', icon: Pen, badge: null },
  { id: 191, category: 'tugas-sekolah', name: 'Tugas Teks Anekdot', price: '20k–75k', icon: Pen, badge: null },
  { id: 192, category: 'tugas-sekolah', name: 'Tugas Teks Deskripsi', price: '20k–75k', icon: Pen, badge: null },
  { id: 193, category: 'tugas-sekolah', name: 'Tugas Teks Argumentasi', price: '20k–75k', icon: Pen, badge: null },
  { id: 194, category: 'tugas-sekolah', name: 'Tugas Surat Pribadi', price: '15k–50k', icon: Pen, badge: null },
  { id: 195, category: 'tugas-sekolah', name: 'Tugas Surat Dinas', price: '20k–75k', icon: Pen, badge: null },
  { id: 196, category: 'tugas-sekolah', name: 'Tugas Cerita Inspiratif', price: '25k–100k', icon: Pen, badge: null },
  { id: 197, category: 'tugas-sekolah', name: 'Tugas Resensi Buku', price: '30k–150k', icon: BookOpen, badge: null },
  { id: 198, category: 'tugas-sekolah', name: 'Tugas Sinopsis Film', price: '25k–100k', icon: BookOpen, badge: null },
  { id: 199, category: 'tugas-sekolah', name: 'Tugas Analisis Cerpen', price: '30k–150k', icon: BookOpen, badge: null },
  { id: 200, category: 'tugas-sekolah', name: 'Tugas Analisis Novel', price: '40k–200k', icon: BookOpen, badge: null },

  // Tugas Proyek Sekolah
  { id: 201, category: 'tugas-sekolah', name: 'Laporan Study Tour', price: '50k–200k', icon: BookOpen, badge: null },
  { id: 202, category: 'tugas-sekolah', name: 'Laporan Kunjungan Museum', price: '40k–150k', icon: BookOpen, badge: null },
  { id: 203, category: 'tugas-sekolah', name: 'Laporan Observasi Lingkungan', price: '40k–150k', icon: BookOpen, badge: null },
  { id: 204, category: 'tugas-sekolah', name: 'Laporan Wawancara Tokoh', price: '40k–150k', icon: BookOpen, badge: null },
  { id: 205, category: 'tugas-sekolah', name: 'Laporan Kegiatan Sekolah', price: '50k–200k', icon: BookOpen, badge: null },
  { id: 206, category: 'tugas-sekolah', name: 'Proposal Kegiatan Kelas', price: '40k–150k', icon: Pen, badge: null },
  { id: 207, category: 'tugas-sekolah', name: 'Proposal Kegiatan OSIS', price: '50k–200k', icon: Pen, badge: null },
  { id: 208, category: 'tugas-sekolah', name: 'Proposal Kegiatan Pramuka', price: '50k–200k', icon: Pen, badge: null },
  { id: 209, category: 'tugas-sekolah', name: 'Proposal Kegiatan Ekskul', price: '50k–200k', icon: Pen, badge: null },
  { id: 210, category: 'tugas-sekolah', name: 'Program Kerja OSIS', price: '50k–200k', icon: Pen, badge: null },
  { id: 211, category: 'tugas-sekolah', name: 'Program Kerja Ekskul', price: '50k–200k', icon: Pen, badge: null },
  { id: 212, category: 'tugas-sekolah', name: 'Struktur Kepanitiaan', price: '25k–100k', icon: Pen, badge: null },
  { id: 213, category: 'tugas-sekolah', name: 'Rundown Acara Sekolah', price: '25k–100k', icon: Pen, badge: null },
  { id: 214, category: 'tugas-sekolah', name: 'Teks Sambutan Acara', price: '25k–100k', icon: Pen, badge: null },
  { id: 215, category: 'tugas-sekolah', name: 'Teks Moderator', price: '25k–100k', icon: Pen, badge: null },
  { id: 216, category: 'tugas-sekolah', name: 'Teks Debat', price: '30k–150k', icon: Pen, badge: null },
  { id: 217, category: 'tugas-sekolah', name: 'Naskah Drama Sekolah', price: '50k–250k', icon: Pen, badge: null },
  { id: 218, category: 'tugas-sekolah', name: 'Naskah Video Edukasi', price: '50k–250k', icon: Pen, badge: null },
  { id: 219, category: 'tugas-sekolah', name: 'Script Presentasi Video', price: '40k–150k', icon: Pen, badge: null },
  { id: 220, category: 'tugas-sekolah', name: 'Konsep Project P5', price: '50k–200k', icon: Pen, badge: null },
  { id: 221, category: 'tugas-sekolah', name: 'Laporan Project P5', price: '75k–300k', icon: BookOpen, badge: null },
  { id: 222, category: 'tugas-sekolah', name: 'Jurnal Kegiatan P5', price: '40k–150k', icon: BookOpen, badge: null },
  { id: 223, category: 'tugas-sekolah', name: 'Ide Produk Kewirausahaan Sekolah', price: '25k–100k', icon: Pen, badge: null },
  { id: 224, category: 'tugas-sekolah', name: 'Laporan Kewirausahaan Sekolah', price: '75k–300k', icon: BookOpen, badge: null },

  // Mata Pelajaran Tambahan
  { id: 225, category: 'tugas-sekolah', name: 'Tugas Bahasa Indonesia', price: '15k–100k', icon: BookOpen, badge: null },
  { id: 226, category: 'tugas-sekolah', name: 'Tugas Bahasa Inggris', price: '20k–150k', icon: BookOpen, badge: null },
  { id: 227, category: 'tugas-sekolah', name: 'Tugas Bahasa Daerah', price: '20k–100k', icon: BookOpen, badge: null },
  { id: 228, category: 'tugas-sekolah', name: 'Tugas Bahasa Jepang', price: '30k–150k', icon: BookOpen, badge: null },
  { id: 229, category: 'tugas-sekolah', name: 'Tugas Bahasa Mandarin', price: '30k–150k', icon: BookOpen, badge: null },
  { id: 230, category: 'tugas-sekolah', name: 'Tugas Bahasa Arab', price: '30k–150k', icon: BookOpen, badge: null },
  { id: 231, category: 'tugas-sekolah', name: 'Tugas Sejarah', price: '20k–150k', icon: BookOpen, badge: null },
  { id: 232, category: 'tugas-sekolah', name: 'Tugas Geografi', price: '20k–150k', icon: Globe, badge: null },
  { id: 233, category: 'tugas-sekolah', name: 'Tugas Ekonomi', price: '25k–200k', icon: Calculator, badge: null },
  { id: 234, category: 'tugas-sekolah', name: 'Tugas Akuntansi Dasar', price: '30k–200k', icon: Calculator, badge: null },
  { id: 235, category: 'tugas-sekolah', name: 'Tugas PKN', price: '20k–100k', icon: BookOpen, badge: null },
  { id: 236, category: 'tugas-sekolah', name: 'Tugas Agama', price: '20k–100k', icon: BookOpen, badge: null },
  { id: 237, category: 'tugas-sekolah', name: 'Tugas Seni Budaya', price: '25k–150k', icon: BookOpen, badge: null },
  { id: 238, category: 'tugas-sekolah', name: 'Tugas Prakarya', price: '25k–150k', icon: BookOpen, badge: null },
  { id: 239, category: 'tugas-sekolah', name: 'Tugas PJOK', price: '20k–100k', icon: BookOpen, badge: null },
  { id: 240, category: 'tugas-sekolah', name: 'Tugas Kewirausahaan', price: '30k–200k', icon: Calculator, badge: null },
  { id: 241, category: 'tugas-sekolah', name: 'Tugas Administrasi Perkantoran', price: '30k–200k', icon: Calculator, badge: null },
  { id: 242, category: 'tugas-sekolah', name: 'Tugas Multimedia', price: '50k–300k', icon: Code, badge: null },
  { id: 243, category: 'tugas-sekolah', name: 'Tugas Desain Grafis', price: '50k–300k', icon: Code, badge: null },
  { id: 244, category: 'tugas-sekolah', name: 'Tugas TKJ', price: '50k–300k', icon: Code, badge: null },
  { id: 245, category: 'tugas-sekolah', name: 'Tugas RPL Non-Coding', price: '40k–250k', icon: Code, badge: null },
  { id: 246, category: 'tugas-sekolah', name: 'Tugas Perhotelan SMK', price: '30k–200k', icon: Globe, badge: null },
  { id: 247, category: 'tugas-sekolah', name: 'Tugas Tata Boga', price: '30k–200k', icon: Globe, badge: null },
  { id: 248, category: 'tugas-sekolah', name: 'Tugas Tata Busana', price: '30k–200k', icon: Globe, badge: null },
  { id: 249, category: 'tugas-sekolah', name: 'Tugas Otomotif', price: '50k–300k', icon: Calculator, badge: null },
  { id: 250, category: 'tugas-sekolah', name: 'Tugas Akuntansi SMK', price: '30k–200k', icon: Calculator, badge: null },
  { id: 251, category: 'tugas-sekolah', name: 'Tugas Pemasaran SMK', price: '30k–200k', icon: Calculator, badge: null },

  // Desain Sekolah
  { id: 252, category: 'tugas-sekolah', name: 'Desain Poster Sekolah', price: '25k–100k', icon: Code, badge: null },
  { id: 253, category: 'tugas-sekolah', name: 'Desain Jadwal Piket', price: '15k–50k', icon: Code, badge: null },
  { id: 254, category: 'tugas-sekolah', name: 'Desain Struktur Kelas', price: '15k–50k', icon: Code, badge: null },
  { id: 255, category: 'tugas-sekolah', name: 'Desain Sertifikat Kelas', price: '15k–50k', icon: Code, badge: null },
  { id: 256, category: 'tugas-sekolah', name: 'Desain ID Card Panitia', price: '20k–75k', icon: Code, badge: null },
  { id: 257, category: 'tugas-sekolah', name: 'Desain Brosur Sekolah', price: '30k–150k', icon: Code, badge: null },
  { id: 258, category: 'tugas-sekolah', name: 'Desain Pamflet Acara', price: '30k–150k', icon: Code, badge: null },
  { id: 259, category: 'tugas-sekolah', name: 'Desain Twibbon', price: '25k–100k', icon: Code, badge: null },
  { id: 260, category: 'tugas-sekolah', name: 'Desain Feed OSIS', price: '25k–100k', icon: Code, badge: null },
  { id: 261, category: 'tugas-sekolah', name: 'Desain Story Instagram Sekolah', price: '20k–75k', icon: Code, badge: null },
  { id: 262, category: 'tugas-sekolah', name: 'Desain Cover Tugas', price: '10k–50k', icon: Code, badge: null },
  { id: 263, category: 'tugas-sekolah', name: 'Desain Sampul Kliping', price: '10k–50k', icon: Code, badge: null },
  { id: 264, category: 'tugas-sekolah', name: 'Desain Modul Belajar', price: '75k–300k', icon: Code, badge: null },
  { id: 265, category: 'tugas-sekolah', name: 'Desain Lembar Kerja Siswa', price: '50k–250k', icon: Code, badge: null },
  { id: 266, category: 'tugas-sekolah', name: 'Desain Kartu Ucapan Guru', price: '15k–75k', icon: Code, badge: null },
  { id: 267, category: 'tugas-sekolah', name: 'Desain Undangan Acara Sekolah', price: '25k–100k', icon: Code, badge: null },

  // Unlock Dokumen - Platform Umum
  { id: 54, category: 'unlock', name: 'Unlock Bartleby', price: 'Rp 2.000', icon: Globe, badge: null },
  { id: 55, category: 'unlock', name: 'Unlock Academia', price: 'Rp 2.000', icon: Globe, badge: null },
  { id: 56, category: 'unlock', name: 'Unlock Numerade', price: 'Rp 3.000', icon: Globe, badge: null },
  { id: 57, category: 'unlock', name: 'Unlock Quizlet', price: 'Rp 2.000', icon: Globe, badge: null },
  { id: 58, category: 'unlock', name: 'Unlock Scribd', price: 'Rp 2.000', icon: Globe, badge: null },
  { id: 59, category: 'unlock', name: 'Unlock Chegg', price: 'Rp 2.000', icon: Globe, badge: null },
  { id: 60, category: 'unlock', name: 'Unlock Studocu', price: 'Rp 3.000', icon: Globe, badge: null },
  { id: 61, category: 'unlock', name: 'Unlock Slideshare', price: 'Rp 3.000', icon: Globe, badge: null },
  { id: 62, category: 'unlock', name: 'Unlock Coursehero', price: 'Rp 3.000', icon: Globe, badge: null },
  { id: 63, category: 'unlock', name: 'Unlock Scribd Book', price: 'Rp 3.000', icon: Globe, badge: null },
  { id: 64, category: 'unlock', name: 'Unlock Sage', price: 'Rp 3.000', icon: Globe, badge: null },
  { id: 65, category: 'unlock', name: 'Unlock Wiley', price: 'Rp 3.000', icon: Globe, badge: null },

  // Unlock Dokumen - Platform Akademik
  { id: 66, category: 'unlock', name: 'Unlock ResearchGate', price: 'Rp 3.000', icon: Star, badge: null },
  { id: 67, category: 'unlock', name: 'Unlock ISTOR', price: 'Rp 3.000', icon: Star, badge: null },
  { id: 68, category: 'unlock', name: 'Unlock IEEE', price: 'Rp 3.000', icon: Star, badge: null },
  { id: 69, category: 'unlock', name: 'Unlock Springer', price: 'Rp 3.000', icon: Star, badge: null },
  { id: 70, category: 'unlock', name: 'Unlock ACS', price: 'Rp 4.500', icon: Star, badge: null },
  { id: 71, category: 'unlock', name: 'Unlock Elsevier', price: 'Rp 4.500', icon: Star, badge: null },
  { id: 72, category: 'unlock', name: 'Unlock Emerald', price: 'Rp 4.500', icon: Star, badge: null },
  { id: 73, category: 'unlock', name: 'Unlock Oxford', price: 'Rp 4.500', icon: Star, badge: null },
  { id: 74, category: 'unlock', name: 'Unlock Cambridge', price: 'Rp 4.500', icon: Star, badge: null },
  { id: 75, category: 'unlock', name: 'Unlock Nature', price: 'Rp 4.500', icon: Star, badge: null },
  { id: 76, category: 'unlock', name: 'Unlock APA Psycnet', price: 'Rp 4.500', icon: Star, badge: null },
  { id: 77, category: 'unlock', name: 'Unlock Scientific', price: 'Rp 4.500', icon: Star, badge: null },

  // Administrasi Kantor
  { id: 268, category: 'umum', name: 'Entry Data', price: '25k–150k', icon: Database, badge: null },
  { id: 269, category: 'umum', name: 'Rekap Data Excel', price: '25k–200k', icon: Database, badge: null },
  { id: 270, category: 'umum', name: 'Input Database', price: '50k–300k', icon: Database, badge: null },
  { id: 271, category: 'umum', name: 'Rapikan Database', price: '50k–300k', icon: Database, badge: null },
  { id: 272, category: 'umum', name: 'Template Absensi', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 273, category: 'umum', name: 'Template Invoice', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 274, category: 'umum', name: 'Template Kwitansi', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 275, category: 'umum', name: 'Template Surat Jalan', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 276, category: 'umum', name: 'Template Laporan Harian', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 277, category: 'umum', name: 'Template Laporan Mingguan', price: '30k–150k', icon: FileSpreadsheet, badge: null },
  { id: 278, category: 'umum', name: 'Template Laporan Bulanan', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 279, category: 'umum', name: 'Formulir Digital', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 280, category: 'umum', name: 'Google Form', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 281, category: 'umum', name: 'Survey Online', price: '50k–200k', icon: Globe, badge: null },
  { id: 282, category: 'umum', name: 'Notulen Meeting', price: '50k–200k', icon: BookOpen, badge: null },
  { id: 283, category: 'umum', name: 'Minutes of Meeting', price: '75k–250k', icon: BookOpen, badge: null },
  { id: 284, category: 'umum', name: 'Agenda Meeting', price: '25k–100k', icon: BookOpen, badge: null },
  { id: 285, category: 'umum', name: 'Rundown Acara Kantor', price: '50k–200k', icon: BookOpen, badge: null },
  { id: 286, category: 'umum', name: 'SOP Kerja', price: '150k–750k', icon: FileSpreadsheet, badge: null },
  { id: 287, category: 'umum', name: 'Job Description', price: '75k–300k', icon: FileSpreadsheet, badge: null },
  { id: 288, category: 'umum', name: 'KPI Karyawan', price: '150k–750k', icon: Target, badge: null },
  { id: 289, category: 'umum', name: 'Struktur Organisasi', price: '50k–200k', icon: Route, badge: null },
  { id: 290, category: 'umum', name: 'Timeline Project', price: '50k–250k', icon: Route, badge: null },
  { id: 291, category: 'umum', name: 'Checklist Kerja', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 292, category: 'umum', name: 'Template Monitoring Project', price: '75k–300k', icon: FileSpreadsheet, badge: null },

  // Bisnis & UMKM
  { id: 293, category: 'umum', name: 'Proposal Bisnis', price: '150k–750k', icon: Calculator, badge: null },
  { id: 294, category: 'umum', name: 'Company Profile', price: '200k–1.000k', icon: Globe, badge: null },
  { id: 295, category: 'umum', name: 'Pitch Deck Bisnis', price: '250k–1.500k', icon: Presentation, badge: null },
  { id: 296, category: 'umum', name: 'Analisis SWOT', price: '75k–300k', icon: Target, badge: null },
  { id: 297, category: 'umum', name: 'Analisis Kompetitor', price: '100k–500k', icon: Globe, badge: null },
  { id: 298, category: 'umum', name: 'Analisis Target Pasar', price: '100k–500k', icon: Globe, badge: null },
  { id: 299, category: 'umum', name: 'Riset Pasar', price: '150k–1.000k', icon: Globe, badge: null },
  { id: 300, category: 'umum', name: 'Riset Produk', price: '75k–500k', icon: Globe, badge: null },
  { id: 301, category: 'umum', name: 'Riset Harga Kompetitor', price: '75k–300k', icon: Globe, badge: null },
  { id: 302, category: 'umum', name: 'Business Model Canvas', price: '75k–300k', icon: Route, badge: null },
  { id: 303, category: 'umum', name: 'Perhitungan HPP', price: '75k–300k', icon: Calculator, badge: null },
  { id: 304, category: 'umum', name: 'Perhitungan BEP', price: '75k–300k', icon: Calculator, badge: null },
  { id: 305, category: 'umum', name: 'Perhitungan Margin Profit', price: '75k–300k', icon: Calculator, badge: null },
  { id: 306, category: 'umum', name: 'Laporan Penjualan', price: '75k–300k', icon: FileSpreadsheet, badge: null },
  { id: 307, category: 'umum', name: 'Laporan Stok Barang', price: '50k–250k', icon: FileSpreadsheet, badge: null },
  { id: 308, category: 'umum', name: 'Laporan Keuangan Sederhana', price: '100k–500k', icon: FileSpreadsheet, badge: null },
  { id: 309, category: 'umum', name: 'Pembukuan UMKM', price: '150k–750k', icon: Calculator, badge: null },
  { id: 310, category: 'umum', name: 'Catatan Kas Masuk Keluar', price: '50k–250k', icon: FileSpreadsheet, badge: null },
  { id: 311, category: 'umum', name: 'Template Inventory', price: '75k–300k', icon: FileSpreadsheet, badge: null },
  { id: 312, category: 'umum', name: 'Template Orderan', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 313, category: 'umum', name: 'Template Customer Database', price: '50k–200k', icon: Database, badge: null },
  { id: 314, category: 'umum', name: 'Deskripsi Produk Marketplace', price: '5k–25k/produk', icon: Globe, badge: null },
  { id: 315, category: 'umum', name: 'Optimasi Judul Produk', price: '5k–20k/produk', icon: Globe, badge: null },
  { id: 316, category: 'umum', name: 'Ide Nama Brand', price: '50k–250k', icon: Star, badge: null },
  { id: 317, category: 'umum', name: 'Slogan Brand', price: '50k–250k', icon: Star, badge: null },
  { id: 318, category: 'umum', name: 'Konsep Branding UMKM', price: '150k–750k', icon: Star, badge: null },

  // Karier & Profesional
  { id: 319, category: 'umum', name: 'Optimasi Profil LinkedIn', price: '75k–300k', icon: Globe, badge: null },
  { id: 320, category: 'umum', name: 'Bio Profesional', price: '25k–100k', icon: Pen, badge: null },
  { id: 321, category: 'umum', name: 'Portofolio Kerja', price: '100k–500k', icon: BookOpen, badge: null },
  { id: 322, category: 'umum', name: 'Personal Branding', price: '150k–750k', icon: Star, badge: null },
  { id: 323, category: 'umum', name: 'Surat Resign', price: '25k–100k', icon: Pen, badge: null },
  { id: 324, category: 'umum', name: 'Surat Rekomendasi', price: '30k–150k', icon: Pen, badge: null },
  { id: 325, category: 'umum', name: 'Surat Pernyataan', price: '25k–100k', icon: Pen, badge: null },
  { id: 326, category: 'umum', name: 'Surat Kuasa', price: '30k–150k', icon: Pen, badge: null },
  { id: 327, category: 'umum', name: 'Surat Kerja Sama', price: '75k–300k', icon: Pen, badge: null },
  { id: 328, category: 'umum', name: 'Surat Penawaran', price: '50k–250k', icon: Pen, badge: null },
  { id: 329, category: 'umum', name: 'Surat Permohonan', price: '25k–100k', icon: Pen, badge: null },
  { id: 330, category: 'umum', name: 'Surat Undangan Resmi', price: '25k–100k', icon: Pen, badge: null },
  { id: 331, category: 'umum', name: 'Surat Komplain', price: '25k–100k', icon: Pen, badge: null },
  { id: 332, category: 'umum', name: 'Surat Balasan Kerja Sama', price: '50k–200k', icon: Pen, badge: null },
  { id: 333, category: 'umum', name: 'Email Profesional', price: '25k–100k', icon: Pen, badge: null },
  { id: 334, category: 'umum', name: 'Email Follow Up', price: '25k–100k', icon: Pen, badge: null },
  { id: 335, category: 'umum', name: 'Email Penawaran Bisnis', price: '50k–200k', icon: Pen, badge: null },
  { id: 336, category: 'umum', name: 'Email Customer Service', price: '25k–100k', icon: Pen, badge: null },
  { id: 337, category: 'umum', name: 'Script Interview Kerja', price: '50k–200k', icon: BookOpen, badge: null },
  { id: 338, category: 'umum', name: 'Simulasi Jawaban Interview', price: '75k–300k', icon: BookOpen, badge: null },
  { id: 339, category: 'umum', name: 'Profil Singkat Freelancer', price: '25k–100k', icon: Globe, badge: null },
  { id: 340, category: 'umum', name: 'Bio Marketplace Freelancer', price: '25k–100k', icon: Globe, badge: null },

  // Tools Dokumen
  { id: 341, category: 'umum', name: 'Edit PDF Ringan', price: '10k–50k', icon: FileSpreadsheet, badge: null },
  { id: 342, category: 'umum', name: 'Gabung File PDF', price: '5k–25k', icon: FileSpreadsheet, badge: null },
  { id: 343, category: 'umum', name: 'Pisah File PDF', price: '5k–25k', icon: FileSpreadsheet, badge: null },
  { id: 344, category: 'umum', name: 'Kompres PDF', price: '5k–20k', icon: FileSpreadsheet, badge: null },
  { id: 345, category: 'umum', name: 'Watermark Dokumen', price: '10k–50k', icon: FileSpreadsheet, badge: null },
  { id: 346, category: 'umum', name: 'Hapus Watermark Milik Sendiri', price: '10k–50k', icon: FileSpreadsheet, badge: null },
  { id: 347, category: 'umum', name: 'Convert Gambar ke PDF', price: '5k–25k', icon: FileSpreadsheet, badge: null },
  { id: 348, category: 'umum', name: 'Convert Word ke PDF', price: '5k–20k', icon: FileSpreadsheet, badge: null },
  { id: 349, category: 'umum', name: 'Convert Excel ke PDF', price: '5k–20k', icon: FileSpreadsheet, badge: null },
  { id: 350, category: 'umum', name: 'Rapikan Layout Dokumen', price: '10k–75k', icon: FileSpreadsheet, badge: null },
  { id: 351, category: 'umum', name: 'Buat Template Dokumen', price: '25k–150k', icon: FileSpreadsheet, badge: null },
  { id: 352, category: 'umum', name: 'Buat Kop Surat', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 353, category: 'umum', name: 'Buat Form Isian', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 354, category: 'umum', name: 'Buat E-Certificate', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 355, category: 'umum', name: 'Buat Barcode / QR Code', price: '10k–50k', icon: FileSpreadsheet, badge: null },
  { id: 356, category: 'umum', name: 'Buat Label Nama', price: '10k–50k', icon: FileSpreadsheet, badge: null },
  { id: 357, category: 'umum', name: 'Buat Nomor Antrian', price: '10k–50k', icon: FileSpreadsheet, badge: null },
  { id: 358, category: 'umum', name: 'Buat KartuPanitia', price: '20k–100k', icon: FileSpreadsheet, badge: null },
  { id: 359, category: 'umum', name: 'Buat Kartu Member', price: '20k–100k', icon: FileSpreadsheet, badge: null },

  // Media Sosial
  { id: 341, category: 'medsos', name: 'Caption Instagram', price: '5k–25k/caption', icon: Pen, badge: null },
  { id: 342, category: 'medsos', name: 'Caption TikTok', price: '5k–25k/caption', icon: Pen, badge: null },
  { id: 343, category: 'medsos', name: 'Caption Marketplace', price: '5k–25k/produk', icon: Pen, badge: null },
  { id: 344, category: 'medsos', name: 'Copywriting Produk', price: '15k–75k/produk', icon: Pen, badge: null },
  { id: 345, category: 'medsos', name: 'Copywriting Iklan', price: '50k–250k', icon: Pen, badge: null },
  { id: 346, category: 'medsos', name: 'Script TikTok', price: '25k–150k', icon: Pen, badge: null },
  { id: 347, category: 'medsos', name: 'Script Reels', price: '25k–150k', icon: Pen, badge: null },
  { id: 348, category: 'medsos', name: 'Script YouTube Shorts', price: '25k–150k', icon: Pen, badge: null },
  { id: 349, category: 'medsos', name: 'Script Voice Over', price: '50k–250k', icon: Pen, badge: null },
  { id: 350, category: 'medsos', name: 'Ide Konten Harian', price: '25k–100k', icon: Star, badge: null },
  { id: 351, category: 'medsos', name: 'Kalender Konten', price: '150k–750k', icon: BookOpen, badge: null },
  { id: 352, category: 'medsos', name: 'Content Plan Mingguan', price: '100k–500k', icon: BookOpen, badge: null },
  { id: 353, category: 'medsos', name: 'Content Plan Bulanan', price: '250k–1.500k', icon: BookOpen, badge: null },
  { id: 354, category: 'medsos', name: 'Artikel Blog', price: '50k–250k/artikel', icon: BookOpen, badge: null },
  { id: 355, category: 'medsos', name: 'Artikel SEO', price: '75k–400k/artikel', icon: Globe, badge: null },
  { id: 356, category: 'medsos', name: 'Deskripsi Video YouTube', price: '25k–100k', icon: Pen, badge: null },
  { id: 357, category: 'medsos', name: 'Judul Konten Viral', price: '25k–100k', icon: Star, badge: null },
  { id: 358, category: 'medsos', name: 'Riset Hashtag', price: '25k–100k', icon: Globe, badge: null },
  { id: 359, category: 'medsos', name: 'Bio Instagram Bisnis', price: '25k–100k', icon: Globe, badge: null },
  { id: 360, category: 'medsos', name: 'Balasan Chat Customer', price: '25k–100k', icon: Pen, badge: null },
  { id: 361, category: 'medsos', name: 'Template Chat Admin', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 362, category: 'medsos', name: 'Template Broadcast WhatsApp', price: '25k–150k', icon: FileSpreadsheet, badge: null },
  { id: 363, category: 'medsos', name: 'Template Promo Produk', price: '25k–150k', icon: FileSpreadsheet, badge: null },
  { id: 364, category: 'medsos', name: 'Template Testimoni', price: '15k–75k', icon: FileSpreadsheet, badge: null },

  // Desain Grafis
  { id: 365, category: 'desain', name: 'Desain Logo', price: '75k–500k', icon: Image, badge: null },
  { id: 366, category: 'desain', name: 'Desain Banner', price: '50k–300k', icon: Image, badge: null },
  { id: 367, category: 'desain', name: 'Desain Brosur', price: '50k–300k', icon: Image, badge: null },
  { id: 368, category: 'desain', name: 'Desain Flyer', price: '50k–250k', icon: Image, badge: null },
  { id: 369, category: 'desain', name: 'Desain Menu Makanan', price: '50k–300k', icon: Image, badge: null },
  { id: 370, category: 'desain', name: 'Desain Katalog Produk', price: '150k–750k', icon: Image, badge: null },
  { id: 371, category: 'desain', name: 'Desain Price List', price: '30k–150k', icon: Image, badge: null },
  { id: 372, category: 'desain', name: 'Desain Sertifikat', price: '25k–100k', icon: Image, badge: null },
  { id: 373, category: 'desain', name: 'Desain Undangan Digital', price: '50k–250k', icon: Image, badge: null },
  { id: 374, category: 'desain', name: 'Desain Kartu Nama', price: '50k–200k', icon: Image, badge: null },
  { id: 375, category: 'desain', name: 'Desain Stiker Produk', price: '25k–150k', icon: Image, badge: null },
  { id: 376, category: 'desain', name: 'Desain Label Kemasan', price: '50k–300k', icon: Image, badge: null },
  { id: 377, category: 'desain', name: 'Desain Packaging', price: '150k–1.000k', icon: Image, badge: null },
  { id: 378, category: 'desain', name: 'Desain Feed Instagram', price: '25k–150k/post', icon: Image, badge: null },
  { id: 379, category: 'desain', name: 'Desain Story Instagram', price: '20k–100k/story', icon: Image, badge: null },
  { id: 380, category: 'desain', name: 'Desain Thumbnail YouTube', price: '30k–150k', icon: Image, badge: null },
  { id: 381, category: 'desain', name: 'Desain Cover Ebook', price: '75k–300k', icon: Image, badge: null },
  { id: 382, category: 'desain', name: 'Desain Poster Event', price: '50k–300k', icon: Image, badge: null },
  { id: 383, category: 'desain', name: 'Desain Spanduk', price: '75k–400k', icon: Image, badge: null },
  { id: 384, category: 'desain', name: 'Desain X-Banner', price: '75k–400k', icon: Image, badge: null },

  // Desain Cover & Layout
  { id: 385, category: 'desain', name: 'Desain Cover Makalah', price: 'Start 15k', icon: FileSpreadsheet, badge: null },
  { id: 386, category: 'desain', name: 'Desain Cover Laporan', price: 'Start 15k', icon: FileSpreadsheet, badge: null },
  { id: 387, category: 'desain', name: 'Desain Cover Proposal', price: 'Start 25k', icon: FileSpreadsheet, badge: null },
  { id: 388, category: 'desain', name: 'Desain Cover Skripsi / Tugas Akhir', price: 'Start 25k', icon: FileSpreadsheet, badge: null },
  { id: 389, category: 'desain', name: 'Desain Layout Makalah', price: 'Start 25k', icon: FileSpreadsheet, badge: null },
  { id: 390, category: 'desain', name: 'Desain Layout Proposal', price: 'Start 50k', icon: FileSpreadsheet, badge: null },
  { id: 391, category: 'desain', name: 'Desain Layout Laporan Praktik', price: 'Start 50k', icon: FileSpreadsheet, badge: null },
  { id: 392, category: 'desain', name: 'Desain Modul Pembelajaran', price: 'Start 75k', icon: FileSpreadsheet, badge: null },
  { id: 393, category: 'desain', name: 'Desain Lembar Kerja Siswa', price: 'Start 50k', icon: FileSpreadsheet, badge: null },
  { id: 394, category: 'desain', name: 'Desain E-Modul Sekolah', price: 'Start 100k', icon: FileSpreadsheet, badge: null },
  { id: 395, category: 'desain', name: 'Desain Infografis Materi', price: 'Start 30k', icon: FileSpreadsheet, badge: null },
  { id: 396, category: 'desain', name: 'Desain Mind Map Digital', price: 'Start 20k', icon: FileSpreadsheet, badge: null },
  { id: 397, category: 'desain', name: 'Desain Timeline Sejarah', price: 'Start 25k', icon: FileSpreadsheet, badge: null },
  { id: 398, category: 'desain', name: 'Desain Struktur Organisasi Kelas', price: 'Start 15k', icon: FileSpreadsheet, badge: null },
  { id: 399, category: 'desain', name: 'Desain Jadwal Piket', price: 'Start 10k', icon: FileSpreadsheet, badge: null },
  { id: 400, category: 'desain', name: 'Desain Jadwal Pelajaran', price: 'Start 10k', icon: FileSpreadsheet, badge: null },
  { id: 401, category: 'desain', name: 'Desain Kartu Hafalan', price: 'Start 15k', icon: FileSpreadsheet, badge: null },
  { id: 402, category: 'desain', name: 'Desain Flashcard Edukasi', price: 'Start 25k', icon: FileSpreadsheet, badge: null },
  { id: 403, category: 'desain', name: 'Desain Lembar Catatan Estetik', price: 'Start 15k', icon: FileSpreadsheet, badge: null },
  { id: 404, category: 'desain', name: 'Desain Template Catatan Sekolah', price: 'Start 20k', icon: FileSpreadsheet, badge: null },

  // Desain Branding & Bisnis
  { id: 405, category: 'desain', name: 'Desain Brand Guideline Sederhana', price: 'Start 150k', icon: Image, badge: null },
  { id: 406, category: 'desain', name: 'Desain Brand Board', price: 'Start 100k', icon: Image, badge: null },
  { id: 407, category: 'desain', name: 'Desain Moodboard Brand', price: 'Start 75k', icon: Image, badge: null },
  { id: 408, category: 'desain', name: 'Desain Palet Warna Brand', price: 'Start 50k', icon: Image, badge: null },
  { id: 409, category: 'desain', name: 'Desain Tipografi Brand', price: 'Start 50k', icon: Image, badge: null },
  { id: 410, category: 'desain', name: 'Desain Stationery Kit', price: 'Start 150k', icon: Image, badge: null },
  { id: 411, category: 'desain', name: 'Desain Kop Surat', price: 'Start 25k', icon: Image, badge: null },
  { id: 412, category: 'desain', name: 'Desain Invoice Brand', price: 'Start 25k', icon: Image, badge: null },
  { id: 413, category: 'desain', name: 'Desain Kwitansi Brand', price: 'Start 25k', icon: Image, badge: null },
  { id: 414, category: 'desain', name: 'Desain Form Order', price: 'Start 25k', icon: Image, badge: null },
  { id: 415, category: 'desain', name: 'Desain Template Surat Bisnis', price: 'Start 50k', icon: Image, badge: null },
  { id: 416, category: 'desain', name: 'Desain Proposal Bisnis Visual', price: 'Start 150k', icon: Image, badge: null },
  { id: 417, category: 'desain', name: 'Desain Company Profile Visual', price: 'Start 200k', icon: Image, badge: null },
  { id: 418, category: 'desain', name: 'Desain Pitch Deck Startup', price: 'Start 250k', icon: Image, badge: null },
  { id: 419, category: 'desain', name: 'Desain Media Kit', price: 'Start 150k', icon: Image, badge: null },
  { id: 420, category: 'desain', name: 'Desain Rate Card Influencer', price: 'Start 50k', icon: Image, badge: null },
  { id: 421, category: 'desain', name: 'Desain Rate Card Jasa', price: 'Start 50k', icon: Image, badge: null },
  { id: 422, category: 'desain', name: 'Desain Portofolio Bisnis', price: 'Start 100k', icon: Image, badge: null },
  { id: 423, category: 'desain', name: 'Desain Profil UMKM', price: 'Start 100k', icon: Image, badge: null },
  { id: 424, category: 'desain', name: 'Desain Template Branding Produk', price: 'Start 100k', icon: Image, badge: null },

  // Desain Marketplace
  { id: 425, category: 'desain', name: 'Desain Cover Toko Shopee', price: 'Start 50k', icon: Globe, badge: null },
  { id: 426, category: 'desain', name: 'Desain Cover Toko Tokopedia', price: 'Start 50k', icon: Globe, badge: null },
  { id: 427, category: 'desain', name: 'Desain Cover Toko TikTok Shop', price: 'Start 50k', icon: Globe, badge: null },
  { id: 428, category: 'desain', name: 'Desain Dekorasi Toko Marketplace', price: 'Start 100k', icon: Globe, badge: null },
  { id: 429, category: 'desain', name: 'Desain Etalase Produk', price: 'Start 50k', icon: Globe, badge: null },
  { id: 430, category: 'desain', name: 'Desain Foto Produk Marketplace', price: 'Start 25k/foto', icon: Image, badge: null },
  { id: 431, category: 'desain', name: 'Desain Frame Foto Produk', price: 'Start 25k', icon: Image, badge: null },
  { id: 432, category: 'desain', name: 'Desain Template Promo Marketplace', price: 'Start 30k', icon: Globe, badge: null },
  { id: 433, category: 'desain', name: 'Desain Voucher Marketplace', price: 'Start 25k', icon: Globe, badge: null },
  { id: 434, category: 'desain', name: 'Desain Flash Sale Marketplace', price: 'Start 30k', icon: Globe, badge: null },
  { id: 435, category: 'desain', name: 'Desain Produk Best Seller Badge', price: 'Start 20k', icon: Image, badge: null },
  { id: 436, category: 'desain', name: 'Desain Produk New Arrival Badge', price: 'Start 20k', icon: Image, badge: null },
  { id: 437, category: 'desain', name: 'Desain Template Review Produk', price: 'Start 20k', icon: Image, badge: null },
  { id: 438, category: 'desain', name: 'Desain Panduan Ukuran Produk', price: 'Start 30k', icon: Image, badge: null },
  { id: 439, category: 'desain', name: 'Desain Cara Order Produk', price: 'Start 30k', icon: Image, badge: null },
  { id: 440, category: 'desain', name: 'Desain Alur Pemesanan', price: 'Start 30k', icon: Image, badge: null },
  { id: 441, category: 'desain', name: 'Desain Kartu Terima Kasih', price: 'Start 25k', icon: Image, badge: null },
  { id: 442, category: 'desain', name: 'Desain Kartu Garansi Produk', price: 'Start 25k', icon: Image, badge: null },
  { id: 443, category: 'desain', name: 'Desain Kartu Perawatan Produk', price: 'Start 25k', icon: Image, badge: null },
  { id: 444, category: 'desain', name: 'Desain Insert Card Paket', price: 'Start 25k', icon: Image, badge: null },

  // Desain Event & Seminar
  { id: 445, category: 'desain', name: 'Desain Rundown Acara', price: 'Start 30k', icon: BookOpen, badge: null },
  { id: 446, category: 'desain', name: 'Desain Background Zoom', price: 'Start 30k', icon: Image, badge: null },
  { id: 447, category: 'desain', name: 'Desain Virtual Background Seminar', price: 'Start 30k', icon: Image, badge: null },
  { id: 448, category: 'desain', name: 'Desain Name TagPanitia', price: 'Start 20k', icon: Image, badge: null },
  { id: 449, category: 'desain', name: 'Desain ID Card Event', price: 'Start 25k', icon: Image, badge: null },
  { id: 450, category: 'desain', name: 'Desain Kartu Peserta', price: 'Start 20k', icon: Image, badge: null },
  { id: 451, category: 'desain', name: 'Desain Tiket Acara', price: 'Start 30k', icon: Image, badge: null },
  { id: 452, category: 'desain', name: 'Desain Kupon Acara', price: 'Start 20k', icon: Image, badge: null },
  { id: 453, category: 'desain', name: 'Desain Wristband Event', price: 'Start 30k', icon: Image, badge: null },
  { id: 454, category: 'desain', name: 'Desain Layout Booth', price: 'Start 100k', icon: Image, badge: null },
  { id: 455, category: 'desain', name: 'Desain Denah Acara', price: 'Start 50k', icon: Image, badge: null },
  { id: 456, category: 'desain', name: 'Desain Signage Acara', price: 'Start 50k', icon: Image, badge: null },
  { id: 457, category: 'desain', name: 'Desain Papan Informasi', price: 'Start 50k', icon: Image, badge: null },
  { id: 458, category: 'desain', name: 'Desain Doorprize Card', price: 'Start 20k', icon: Image, badge: null },
  { id: 459, category: 'desain', name: 'Desain Template RundownPanitia', price: 'Start 30k', icon: FileSpreadsheet, badge: null },
  { id: 460, category: 'desain', name: 'Desain Template Absensi Acara', price: 'Start 25k', icon: FileSpreadsheet, badge: null },
  { id: 461, category: 'desain', name: 'Desain Template Evaluasi Acara', price: 'Start 25k', icon: FileSpreadsheet, badge: null },
  { id: 462, category: 'desain', name: 'Desain E-Ticket', price: 'Start 30k', icon: Image, badge: null },
  { id: 463, category: 'desain', name: 'Desain QR Check-In Event', price: 'Start 25k', icon: Image, badge: null },
  { id: 464, category: 'desain', name: 'Desain Thank You Card Event', price: 'Start 25k', icon: Image, badge: null },

  // Desain Karir & Personal
  { id: 465, category: 'desain', name: 'Desain CV Kreatif', price: 'Start 50k', icon: FileSpreadsheet, badge: null },
  { id: 466, category: 'desain', name: 'Desain CV ATS Visual', price: 'Start 50k', icon: FileSpreadsheet, badge: null },
  { id: 467, category: 'desain', name: 'Desain Resume Profesional', price: 'Start 50k', icon: FileSpreadsheet, badge: null },
  { id: 468, category: 'desain', name: 'Desain Portofolio Kerja', price: 'Start 100k', icon: BookOpen, badge: null },
  { id: 469, category: 'desain', name: 'Desain Portofolio Freelancer', price: 'Start 100k', icon: BookOpen, badge: null },
  { id: 470, category: 'desain', name: 'Desain Personal Profile', price: 'Start 50k', icon: Image, badge: null },
  { id: 471, category: 'desain', name: 'Desain Personal Branding Kit', price: 'Start 150k', icon: Star, badge: null },
  { id: 472, category: 'desain', name: 'Desain Cover Letter Visual', price: 'Start 50k', icon: FileSpreadsheet, badge: null },
  { id: 473, category: 'desain', name: 'Desain Profil LinkedIn Banner', price: 'Start 50k', icon: Globe, badge: null },
  { id: 474, category: 'desain', name: 'Desain Media Kit Personal', price: 'Start 150k', icon: Image, badge: null },
  { id: 475, category: 'desain', name: 'Desain Rate Card Freelancer', price: 'Start 50k', icon: Image, badge: null },
  { id: 476, category: 'desain', name: 'Desain Proposal Kerja Sama Personal', price: 'Start 100k', icon: FileSpreadsheet, badge: null },
  { id: 477, category: 'uiux', name: 'Desain One Page Profile', price: 'Start 75k', icon: MonitorCheck, badge: null },
  { id: 478, category: 'desain', name: 'Desain Biodata Profesional', price: 'Start 50k', icon: FileSpreadsheet, badge: null },
  { id: 479, category: 'desain', name: 'Desain Portofolio Magang', price: 'Start 75k', icon: BookOpen, badge: null },

  // Digital & Online
  { id: 385, category: 'digital', name: 'Upload Produk Marketplace', price: '3k–15k/produk', icon: Globe, badge: null },
  { id: 386, category: 'digital', name: 'Update Stok Produk', price: '50k–250k', icon: Database, badge: null },
  { id: 387, category: 'digital', name: 'Riset Keyword Produk', price: '50k–300k', icon: Globe, badge: null },
  { id: 388, category: 'digital', name: 'Riset Kompetitor Marketplace', price: '75k–300k', icon: Globe, badge: null },
  { id: 389, category: 'digital', name: 'Optimasi Deskripsi Produk', price: '10k–50k/produk', icon: Pen, badge: null },
  { id: 390, category: 'digital', name: 'Rekap Orderan Online', price: '50k–250k', icon: FileSpreadsheet, badge: null },
  { id: 391, category: 'digital', name: 'Template Chat CS', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 392, category: 'digital', name: 'Setup Linktree', price: '25k–100k', icon: Globe, badge: null },
  { id: 393, category: 'digital', name: 'Setup Bio Link', price: '25k–100k', icon: Globe, badge: null },
  { id: 394, category: 'digital', name: 'Setup Google Bisnisku', price: '100k–500k', icon: Globe, badge: null },
  { id: 395, category: 'digital', name: 'Setup Katalog WhatsApp Business', price: '50k–250k', icon: Globe, badge: null },
  { id: 396, category: 'digital', name: 'Setup Auto Reply WhatsApp Business', price: '50k–250k', icon: Globe, badge: null },
  { id: 397, category: 'digital', name: 'Setup Form Pemesanan', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 398, category: 'digital', name: 'Setup Spreadsheet Orderan', price: '75k–300k', icon: FileSpreadsheet, badge: null },
  { id: 399, category: 'digital', name: 'Setup Notion Workspace', price: '100k–500k', icon: Monitor, badge: null },
  { id: 400, category: 'digital', name: 'Setup Trello Board', price: '75k–300k', icon: Monitor, badge: null },
  { id: 401, category: 'digital', name: 'Setup Kalender Konten', price: '100k–500k', icon: BookOpen, badge: null },

  // UI/UX Design
  { id: 480, category: 'uiux', name: 'UI Design Landing Page', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 481, category: 'uiux', name: 'UI Design Website Company Profile', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 482, category: 'uiux', name: 'UI Design Website Portfolio', price: 'Start 250k', icon: MonitorCheck, badge: null },
  { id: 483, category: 'uiux', name: 'UI Design Website Personal Branding', price: 'Start 250k', icon: MonitorCheck, badge: null },
  { id: 484, category: 'uiux', name: 'UI Design Website UMKM', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 485, category: 'uiux', name: 'UI Design Website Sekolah / Kampus', price: 'Start 400k', icon: MonitorCheck, badge: null },
  { id: 486, category: 'uiux', name: 'UI Design Website Event', price: 'Start 250k', icon: MonitorCheck, badge: null },
  { id: 487, category: 'uiux', name: 'UI Design Website Blog / News', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 488, category: 'uiux', name: 'UI Design Website Marketplace', price: 'Start 700k', icon: MonitorCheck, badge: null },
  { id: 489, category: 'uiux', name: 'UI Design Website E-Commerce', price: 'Start 700k', icon: MonitorCheck, badge: null },
  { id: 490, category: 'uiux', name: 'UI Design Website SaaS', price: 'Start 800k', icon: MonitorCheck, badge: null },
  { id: 491, category: 'uiux', name: 'UI Design Website Membership', price: 'Start 500k', icon: MonitorCheck, badge: null },

  // UI/UX Mobile App
  { id: 492, category: 'uiux', name: 'UI Design Mobile App Basic', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 493, category: 'uiux', name: 'UI Design Android App', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 494, category: 'uiux', name: 'UI Design iOS App', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 495, category: 'uiux', name: 'UI Design Aplikasi Edukasi', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 496, category: 'uiux', name: 'UI Design Aplikasi Booking', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 497, category: 'uiux', name: 'UI Design Aplikasi Marketplace', price: 'Start 700k', icon: MonitorCheck, badge: null },
  { id: 498, category: 'uiux', name: 'UI Design Aplikasi Finance', price: 'Start 700k', icon: MonitorCheck, badge: null },
  { id: 499, category: 'uiux', name: 'UI Design Aplikasi Kesehatan', price: 'Start 600k', icon: MonitorCheck, badge: null },
  { id: 500, category: 'uiux', name: 'UI Design Aplikasi Food Delivery', price: 'Start 700k', icon: MonitorCheck, badge: null },
  { id: 501, category: 'uiux', name: 'UI Design Aplikasi Chat / Komunitas', price: 'Start 600k', icon: MonitorCheck, badge: null },
  { id: 502, category: 'uiux', name: 'UI Design Aplikasi Absensi', price: 'Start 400k', icon: MonitorCheck, badge: null },
  { id: 503, category: 'uiux', name: 'UI Design Aplikasi Kasir / POS', price: 'Start 700k', icon: MonitorCheck, badge: null },

  // UI/UX Page Components
  { id: 504, category: 'uiux', name: 'Desain Login Page', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 505, category: 'uiux', name: 'Desain Register Page', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 506, category: 'uiux', name: 'Desain Forgot Password Page', price: 'Start 75k', icon: MonitorCheck, badge: null },
  { id: 507, category: 'uiux', name: 'Desain Home Page', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 508, category: 'uiux', name: 'Desain Profile Page', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 509, category: 'uiux', name: 'Desain Setting Page', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 510, category: 'uiux', name: 'Desain Search Page', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 511, category: 'uiux', name: 'Desain Product Detail Page', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 512, category: 'uiux', name: 'Desain Cart Page', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 513, category: 'uiux', name: 'Desain Checkout Page', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 514, category: 'uiux', name: 'Desain Payment Page', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 515, category: 'uiux', name: 'Desain Order Tracking Page', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 516, category: 'uiux', name: 'Desain Notification Page', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 517, category: 'uiux', name: 'Desain Dashboard Page', price: 'Start 200k', icon: MonitorCheck, badge: null },
  { id: 518, category: 'uiux', name: 'Desain Report Page', price: 'Start 200k', icon: MonitorCheck, badge: null },
  { id: 519, category: 'uiux', name: 'Desain Form Page', price: 'Start 100k', icon: MonitorCheck, badge: null },

  // UI/UX Paket
  { id: 520, category: 'uiux', name: 'Paket Landing Page Basic', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 521, category: 'uiux', name: 'Paket Website Company Profile', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 522, category: 'uiux', name: 'Paket Mobile App 5 Page', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 523, category: 'uiux', name: 'Paket Mobile App 10 Page', price: 'Start 900k', icon: MonitorCheck, badge: null },
  { id: 524, category: 'uiux', name: 'Paket Dashboard Admin Basic', price: 'Start 700k', icon: MonitorCheck, badge: null },
  { id: 525, category: 'uiux', name: 'Paket E-Commerce Basic', price: 'Start 1.000k', icon: MonitorCheck, badge: null },
  { id: 526, category: 'uiux', name: 'Paket Prototype Figma', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 527, category: 'uiux', name: 'Paket Redesign Website', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 528, category: 'uiux', name: 'Paket UX Audit + Report', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 529, category: 'uiux', name: 'Paket Design System Basic', price: 'Start 750k', icon: MonitorCheck, badge: null },
];

const ITEMS_PER_PAGE = 16;

// Animated Counter Component
function AnimatedPrice({ price }: { price: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Extract number from price string
  const numericMatch = price.match(/[\d,]+/);
  if (!numericMatch) {
    return <span className="text-primary-800 font-bold text-lg">{price}</span>;
  }

  const targetNumber = parseInt(numericMatch[0].replace(/,/g, ''), 10);
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    if (isInView && targetNumber > 0) {
      const duration = 1000;
      const steps = 30;
      const increment = targetNumber / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
          setDisplayNumber(targetNumber);
          clearInterval(timer);
        } else {
          setDisplayNumber(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, targetNumber]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID');
  };

  // Replace the number in original price
  const formattedPrice = price.replace(/[\d,]+/, formatNumber(displayNumber));

  return (
    <span ref={ref} className="text-primary-800 font-bold text-lg">
      {formattedPrice}
    </span>
  );
}

export default function LayananPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredServices = services.filter((service) => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleServices = filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Back to Top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark-800 via-primary-900 to-dark-800 pt-32 pb-16">
        <div className="container-custom">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Semua Layanan
            </motion.h1>
            <motion.p
              className="text-gray-300 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Temukan berbagai layanan akademik yang tersedia dengan harga termurah di pasaran
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-4 md:py-5 bg-white border-b sticky top-16 md:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search with Focus Glow */}
          <motion.div
            className="relative w-full mb-4 md:mb-5"
            animate={{
              boxShadow: isSearchFocused ? "0 0 0 3px rgba(26, 35, 126, 0.1)" : "0 0 0 0px rgba(26, 35, 126, 0)",
            }}
            transition={{ duration: 0.2 }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari layanan..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-800 transition-all"
            />
          </motion.div>

          {/* Category Filter Row 1 */}
          <div className="flex gap-1.5 md:gap-2 justify-start overflow-x-auto no-scrollbar mb-3 md:mb-4">
            {categories.slice(0, 9).map((cat, index) => (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-primary-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <motion.span
                  animate={activeCategory === cat.id ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <cat.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </motion.span>
                <span className="hidden lg:inline">{cat.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Category Filter Row 2 */}
          <div className="flex gap-1.5 md:gap-2 justify-start overflow-x-auto no-scrollbar">
            {categories.slice(9).map((cat, index) => (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-primary-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.27 + index * 0.03 }}
              >
                <motion.span
                  animate={activeCategory === cat.id ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <cat.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </motion.span>
                <span className="hidden lg:inline">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="container-custom">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {visibleServices.map((service, index) => (
              <motion.div
                key={service.id}
                className={`group relative bg-white rounded-xl p-6 border transition-all duration-500 ${
                  service.badge
                    ? 'border-primary-800 shadow-md'
                    : 'border-gray-200 hover:border-primary-800'
                }`}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px rgba(26, 35, 126, 0.15)",
                  transition: { duration: 0.3 }
                }}
                transition={{ delay: (index % 8) * 0.05, type: "spring", stiffness: 100 }}
              >
                {/* Badge with Pulse Animation */}
                {service.badge && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full"
                    animate={{
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        "0 2px 10px rgba(34, 197, 94, 0.4)",
                        "0 2px 20px rgba(34, 197, 94, 0.6)",
                        "0 2px 10px rgba(34, 197, 94, 0.4)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {service.badge}
                  </motion.span>
                )}
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    className="bg-primary-800/10 w-12 h-12 rounded-xl flex items-center justify-center"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <service.icon className="w-6 h-6 text-primary-800" />
                  </motion.div>
                </div>
                <h3 className="font-semibold text-dark-800 mb-2 group-hover:text-primary-800 transition-colors">{service.name}</h3>
                <div className="mb-4">
                  <AnimatedPrice price={service.price} />
                </div>
                <motion.a
                  href={`https://wa.me/6287815797525?text=Halo%20Kak%20Mau%20${encodeURIComponent(service.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-primary-800 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Pesan
                </motion.a>
              </motion.div>
            ))}
          </motion.div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Layanan tidak ditemukan</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              className="flex items-center justify-center mt-10 gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:border-primary-800 hover:text-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 mr-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers - Max 10 with ellipsis */}
              {(() => {
                const pages: (number | string)[] = [];
                const maxVisible = 10;

                if (totalPages <= maxVisible) {
                  // Show all pages if total is 10 or less
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // Always show first page
                  pages.push(1);

                  if (currentPage <= 5) {
                    // Near the start: 1 2 3 4 5 6 7 8 9 10 ... last
                    for (let i = 2; i <= 10; i++) {
                      pages.push(i);
                    }
                    pages.push('...');
                    pages.push(totalPages);
                  } else if (currentPage >= totalPages - 4) {
                    // Near the end: 1 ... 27 28 29 30 31 32 33 34 35 36
                    pages.push('...');
                    for (let i = totalPages - 9; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Middle: 1 ... 14 15 16 17 18 ... 36
                    pages.push('...');
                    for (let i = currentPage - 3; i <= currentPage + 3; i++) {
                      pages.push(i);
                    }
                    pages.push('...');
                    pages.push(totalPages);
                  }
                }

                return pages.map((page, index) => {
                  if (page === '...') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 font-medium"
                      >
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-primary-800 text-white shadow-md'
                          : 'border border-gray-300 text-gray-500 hover:border-primary-800 hover:text-primary-800'
                      }`}
                    >
                      {page}
                    </button>
                  );
                });
              })()}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:border-primary-800 hover:text-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 ml-2"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Pagination Info */}
          {totalPages > 1 && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Menampilkan {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredServices.length)} dari {filteredServices.length} layanan — Halaman {currentPage} dari {totalPages}
            </p>
          )}
        </div>
      </section>

      {/* Back to Top Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showBackToTop ? 1 : 0, y: showBackToTop ? 0 : 20 }}
        className="fixed bottom-24 right-6 z-50"
      >
        <motion.button
          onClick={scrollToTop}
          className="w-12 h-12 bg-primary-800 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            y: [0, -5, 0],
            boxShadow: [
              "0 4px 14px rgba(26, 35, 126, 0.4)",
              "0 4px 20px rgba(26, 35, 126, 0.6)",
              "0 4px 14px rgba(26, 35, 126, 0.4)",
            ],
          }}
          transition={{
            y: { duration: 2, repeat: Infinity },
            boxShadow: { duration: 1.5, repeat: Infinity },
          }}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
