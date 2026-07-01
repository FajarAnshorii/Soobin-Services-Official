'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useAuth } from '@/context/AuthContext';
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
  { id: 'laporan-akademik', label: 'Laporan Akademik', icon: FileSpreadsheet },
  { id: 'uji-data', label: 'Jasa Analisa Data', icon: BarChart },
  { id: 'tugas-sekolah', label: 'Tugas Sekolah', icon: School },
  { id: 'unlock', label: 'Unlock', icon: Unlock },
  { id: 'umum', label: 'Umum', icon: Globe },
  { id: 'medsos', label: 'Media Sosial', icon: Share2 },
  { id: 'desain', label: 'Desain Grafis', icon: Image },
  { id: 'digital', label: 'Digital & Online', icon: Monitor },
  { id: 'uiux', label: 'UI/UX Design', icon: MonitorCheck },
  { id: 'pembuatan-website', label: 'Pembuatan Website', icon: Code },
];

const services = [
  { id: 1, category: 'turnitin', name: 'Cek Turnitin 1x', price: 'Rp 8.000', icon: FileCheck, badge: null },
  { id: 2, category: 'turnitin', name: 'Cek Turnitin 3x', price: 'Rp 24.000', icon: FileCheck, badge: 'Hemat!' },
  { id: 3, category: 'turnitin', name: 'Cek Turnitin 6x', price: 'Rp 48.000', icon: FileCheck, badge: 'Best Deal!' },
  { id: 4, category: 'turnitin', name: 'Cek AI 1x', price: 'Rp 5.000', icon: FileCheck, badge: 'ZEROGPT' },
  { id: 5, category: 'turnitin', name: 'Cek AI 2x', price: 'Rp 10.000', icon: FileCheck, badge: 'ZEROGPT' },
  { id: 6, category: 'parafrase', name: 'Parafrase Dokumen', price: 'Rp 2.000/Hal', icon: RefreshCw, badge: null },
  { id: 7, category: 'joki-tugas', name: 'Translate Grammar', price: 'Rp 2.000/Hal', icon: Languages, badge: null },
  { id: 8, category: 'joki-tugas', name: 'Daftar Pustaka', price: 'Rp 1.000/Sumber', icon: BookOpen, badge: null },
  { id: 9, category: 'joki-tugas', name: 'Pembuatan PPT', price: 'Rp 3.000/Hal', icon: Presentation, badge: null },
  { id: 10, category: 'joki-tugas', name: 'Daftar Isi Otomatis', price: 'Rp 10.000', icon: Calculator, badge: null },
  { id: 11, category: 'joki-tugas', name: 'Pengetikan File', price: 'Rp 1.000/Hal', icon: Pen, badge: null },
  { id: 15, category: 'joki-tugas', name: 'Review Jurnal', price: 'Rp 25.000/Review', icon: BookOpen, badge: null },
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
  // ─── Konsultasi Penelitian ───
  { id: 34, category: 'joki-tugas', name: 'Konsultasi Pemilihan Judul', price: 'Chat Admin', icon: Target, badge: null },
  { id: 35, category: 'joki-tugas', name: 'Bantu Buat Rumusan Masalah', price: 'Chat Admin', icon: Target, badge: null },
  { id: 36, category: 'joki-tugas', name: 'Bantu Buat Tujuan Penelitian', price: 'Chat Admin', icon: Target, badge: null },
  { id: 37, category: 'joki-tugas', name: 'Bantu Buat Manfaat Penelitian', price: 'Chat Admin', icon: BookMarked, badge: null },
  { id: 38, category: 'joki-tugas', name: 'Bantu Susun Kerangka Berpikir', price: 'Chat Admin', icon: FlaskConical, badge: null },
  { id: 39, category: 'joki-tugas', name: 'Bantu Susun Kerangka Konsep', price: 'Chat Admin', icon: FlaskConical, badge: null },
  { id: 40, category: 'joki-tugas', name: 'Bantu Susun Hipotesis', price: 'Chat Admin', icon: FlaskConical, badge: null },
  { id: 41, category: 'joki-tugas', name: 'Bantu Susun Variabel Penelitian', price: 'Chat Admin', icon: FlaskConical, badge: null },
  { id: 42, category: 'joki-tugas', name: 'Bantu Identifikasi Gap Penelitian', price: 'Chat Admin', icon: Route, badge: null },
  { id: 43, category: 'joki-tugas', name: 'Bantu Menentukan Metode Penelitian', price: 'Chat Admin', icon: FlaskConical, badge: null },
  { id: 44, category: 'joki-tugas', name: 'Bantu Menentukan Populasi & Sampel', price: 'Chat Admin', icon: FlaskConical, badge: null },
  { id: 45, category: 'joki-tugas', name: 'Bantu Menentukan Teknik Sampling', price: 'Chat Admin', icon: Route, badge: null },
  { id: 46, category: 'joki-tugas', name: 'Bantu Buat Instrumen Penelitian', price: 'Chat Admin', icon: ClipboardList, badge: null },
  { id: 47, category: 'joki-tugas', name: 'Bantu Buat Kisi-Kisi Instrumen', price: 'Chat Admin', icon: ClipboardList, badge: null },
  { id: 48, category: 'joki-tugas', name: 'Bantu Buat Kuesioner Penelitian', price: 'Chat Admin', icon: ClipboardList, badge: null },
  { id: 49, category: 'joki-tugas', name: 'Bantu Buat Pedoman Wawancara', price: 'Chat Admin', icon: ClipboardList, badge: null },
  { id: 50, category: 'joki-tugas', name: 'Bantu Buat Pedoman Observasi', price: 'Chat Admin', icon: ClipboardList, badge: null },
  { id: 51, category: 'joki-tugas', name: 'Bantu Buat Alur Penelitian', price: 'Chat Admin', icon: Route, badge: null },
  { id: 52, category: 'joki-tugas', name: 'Bantu Buat Roadmap Penelitian', price: 'Chat Admin', icon: Route, badge: null },
  { id: 53, category: 'joki-tugas', name: 'Bantu Buat Novelty Penelitian', price: 'Chat Admin', icon: Star, badge: null },
  // ─── Tugas Jurusan / Mata Kuliah ───
  { id: 54, category: 'joki-tugas', name: 'Tugas Akuntansi', price: '50k–250k', icon: Calculator, badge: null },
  { id: 55, category: 'joki-tugas', name: 'Tugas Manajemen', price: '50k–250k', icon: Calculator, badge: null },
  { id: 56, category: 'joki-tugas', name: 'Tugas Pemasaran', price: '50k–250k', icon: Calculator, badge: null },
  { id: 57, category: 'joki-tugas', name: 'Tugas Keuangan', price: '75k–300k', icon: Calculator, badge: null },
  { id: 58, category: 'joki-tugas', name: 'Tugas Perpajakan', price: '75k–300k', icon: Calculator, badge: null },
  { id: 59, category: 'joki-tugas', name: 'Tugas Audit', price: '100k–350k', icon: Calculator, badge: null },
  { id: 60, category: 'joki-tugas', name: 'Tugas Ekonomi Mikro', price: '50k–250k', icon: Calculator, badge: null },
  { id: 61, category: 'joki-tugas', name: 'Tugas Ekonomi Makro', price: '50k–250k', icon: Calculator, badge: null },
  { id: 62, category: 'joki-tugas', name: 'Tugas Administrasi Publik', price: '50k–250k', icon: BookOpen, badge: null },
  { id: 63, category: 'joki-tugas', name: 'Tugas Ilmu Komunikasi', price: '50k–250k', icon: BookOpen, badge: null },
  { id: 64, category: 'joki-tugas', name: 'Tugas Public Relations', price: '50k–250k', icon: BookOpen, badge: null },
  { id: 65, category: 'joki-tugas', name: 'Tugas Broadcasting', price: '75k–300k', icon: Globe, badge: null },
  { id: 66, category: 'joki-tugas', name: 'Tugas Pariwisata', price: '50k–250k', icon: Globe, badge: null },
  { id: 67, category: 'joki-tugas', name: 'Tugas Perhotelan', price: '50k–250k', icon: Globe, badge: null },
  { id: 68, category: 'joki-tugas', name: 'Tugas Teknik Sipil', price: '100k–500k', icon: Calculator, badge: null },
  { id: 69, category: 'joki-tugas', name: 'Tugas Teknik Industri', price: '100k–500k', icon: Calculator, badge: null },
  { id: 70, category: 'joki-tugas', name: 'Tugas Teknik Mesin', price: '100k–500k', icon: Calculator, badge: null },
  { id: 71, category: 'joki-tugas', name: 'Tugas Teknik Elektro', price: '100k–500k', icon: Calculator, badge: null },
  { id: 72, category: 'joki-tugas', name: 'Tugas Arsitektur', price: '150k–750k', icon: Calculator, badge: null },
  { id: 73, category: 'joki-tugas', name: 'Tugas Desain Interior', price: '150k–750k', icon: Image, badge: null },
  { id: 74, category: 'joki-tugas', name: 'Tugas DKV', price: '100k–500k', icon: Image, badge: null },
  { id: 75, category: 'joki-tugas', name: 'Tugas Keperawatan', price: '75k–300k', icon: BookOpen, badge: null },
  { id: 76, category: 'joki-tugas', name: 'Tugas Kebidanan', price: '75k–300k', icon: BookOpen, badge: null },
  { id: 77, category: 'joki-tugas', name: 'Tugas Farmasi', price: '100k–500k', icon: BookOpen, badge: null },
  { id: 78, category: 'joki-tugas', name: 'Tugas Gizi', price: '75k–300k', icon: BookOpen, badge: null },
  { id: 79, category: 'joki-tugas', name: 'Tugas Kesehatan Masyarakat', price: '75k–300k', icon: BookOpen, badge: null },
  { id: 80, category: 'joki-tugas', name: 'Tugas Agribisnis', price: '50k–250k', icon: Calculator, badge: null },
  { id: 81, category: 'joki-tugas', name: 'Tugas Peternakan', price: '50k–250k', icon: Calculator, badge: null },
  { id: 82, category: 'joki-tugas', name: 'Tugas Perikanan', price: '50k–250k', icon: Calculator, badge: null },
  { id: 83, category: 'joki-tugas', name: 'Tugas Kehutanan', price: '50k–250k', icon: Calculator, badge: null },
  { id: 84, category: 'joki-skripsi', name: 'Paket Sempro', price: 'Chat Admin', icon: GraduationCap, badge: null },
  { id: 35, category: 'joki-skripsi', name: 'Bab 1 / 2 / 3', price: 'Chat Admin', icon: BookOpen, badge: 'Best Seller' },
  { id: 36, category: 'joki-skripsi', name: 'Cari Referensi', price: 'Chat Admin', icon: Star, badge: null },
  { id: 37, category: 'joki-skripsi', name: 'Paket Lengkap Skripsi', price: 'Chat Admin', icon: GraduationCap, badge: 'Termurah' },
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
  { id: 53, category: 'joki-skripsi', name: 'Bantu Novelty Penelitian', price: '75k–250k', icon: Star, badge: null },
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
  { id: 78, category: 'joki-skripsi', name: 'Bantu Buat Kuesioner', price: '50k–150k', icon: ClipboardList, badge: null },
  { id: 79, category: 'joki-skripsi', name: 'Bantu Buat Kisi-Kisi Instrumen', price: '40k–120k', icon: ClipboardList, badge: null },
  { id: 80, category: 'joki-skripsi', name: 'Bantu Buat Pedoman Wawancara', price: '40k–120k', icon: ClipboardList, badge: null },
  { id: 88, category: 'uji-data', name: 'Input Data Kuesioner', price: 'Rp 25.000–75.000', icon: Database, badge: 'SPSS' },
  { id: 89, category: 'uji-data', name: 'Cleaning Data (Missing/Outlier)', price: 'Rp 30.000–80.000', icon: Database, badge: 'SPSS' },
  { id: 90, category: 'uji-data', name: 'Coding Variabel', price: 'Rp 30.000–70.000', icon: Code, badge: 'SPSS' },
  { id: 91, category: 'uji-data', name: 'Uji Validitas', price: 'Rp 50.000–120.000', icon: BarChart, badge: 'SPSS' },
  { id: 92, category: 'uji-data', name: 'Uji Reliabilitas', price: 'Rp 50.000–120.000', icon: BarChart, badge: 'SPSS' },
  { id: 93, category: 'uji-data', name: 'Statistik Deskriptif', price: 'Rp 30.000–80.000', icon: BarChart, badge: 'SPSS' },
  { id: 94, category: 'uji-data', name: 'Uji Normalitas', price: 'Rp 40.000–100.000', icon: BarChart, badge: 'SPSS' },
  { id: 95, category: 'uji-data', name: 'Korelasi Pearson/Spearman', price: 'Rp 50.000–120.000', icon: BarChart, badge: 'SPSS' },
  { id: 96, category: 'uji-data', name: 'Uji T', price: 'Rp 80.000–150.000', icon: BarChart, badge: 'SPSS' },
  { id: 97, category: 'uji-data', name: 'ANOVA', price: 'Rp 100.000–200.000', icon: BarChart, badge: 'SPSS' },
  { id: 98, category: 'uji-data', name: 'Regresi Sederhana', price: 'Rp 100.000–200.000', icon: BarChart, badge: 'SPSS' },
  { id: 99, category: 'uji-data', name: 'Regresi Berganda', price: 'Rp 150.000–300.000', icon: BarChart, badge: 'SPSS' },
  { id: 100, category: 'uji-data', name: 'Uji Multikolinearitas', price: 'Rp 80.000–150.000', icon: BarChart, badge: 'SPSS' },
  { id: 101, category: 'uji-data', name: 'Uji Heteroskedastisitas', price: 'Rp 80.000–150.000', icon: BarChart, badge: 'SPSS' },
  { id: 102, category: 'uji-data', name: 'Interpretasi Bab 4', price: 'Rp 100.000–300.000', icon: BookOpen, badge: 'SPSS' },
  { id: 103, category: 'uji-data', name: 'Data Cleaning Python', price: 'Rp 50.000–150.000', icon: Database, badge: 'Python' },
  { id: 104, category: 'uji-data', name: 'Analisis Statistik Python', price: 'Rp 80.000–200.000', icon: BarChart, badge: 'Python' },
  { id: 105, category: 'uji-data', name: 'Visualisasi Data (Matplotlib)', price: 'Rp 50.000–150.000', icon: Code, badge: 'Python' },
  { id: 106, category: 'uji-data', name: 'Regression Python (Statsmodels)', price: 'Rp 100.000–250.000', icon: Calculator, badge: 'Python' },
  { id: 107, category: 'uji-data', name: 'Machine Learning Sederhana', price: 'Rp 200.000–500.000', icon: Code, badge: 'Python' },
  { id: 108, category: 'uji-data', name: 'Clustering Data', price: 'Rp 150.000–400.000', icon: Code, badge: 'Python' },
  { id: 109, category: 'uji-data', name: 'Google Colab Setup Project', price: 'Rp 50.000–150.000', icon: Globe, badge: 'Python' },
  { id: 110, category: 'uji-data', name: 'Dataset Preprocessing', price: 'Rp 80.000–200.000', icon: Database, badge: 'Python' },
  { id: 111, category: 'uji-data', name: 'Prediksi Model Sederhana', price: 'Rp 200.000–500.000', icon: Calculator, badge: 'Python' },
  { id: 112, category: 'uji-data', name: 'Notebook Report (Jupyter/Colab)', price: 'Rp 100.000–300.000', icon: Presentation, badge: 'Python' },
  { id: 113, category: 'uji-data', name: 'Model Neural Network Dasar', price: 'Rp 300.000–800.000', icon: Code, badge: 'PyTorch' },
  { id: 114, category: 'uji-data', name: 'Training Model Sederhana', price: 'Rp 300.000–1.000.000', icon: Code, badge: 'PyTorch' },
  { id: 115, category: 'uji-data', name: 'Image Classification Basic', price: 'Rp 500.000–1.500.000', icon: Image, badge: 'PyTorch' },
  { id: 116, category: 'uji-data', name: 'NLP Model Sederhana', price: 'Rp 500.000–1.500.000', icon: Code, badge: 'PyTorch' },
  { id: 117, category: 'uji-data', name: 'Debugging Model', price: 'Rp 200.000–600.000', icon: Code, badge: 'PyTorch' },
  { id: 118, category: 'uji-data', name: 'Data Cleaning Di R', price: 'Rp 50.000–150.000', icon: Database, badge: 'RStudio' },
  { id: 119, category: 'uji-data', name: 'Descriptive Analysis R', price: 'Rp 80.000–200.000', icon: BarChart, badge: 'RStudio' },
  { id: 120, category: 'uji-data', name: 'Regresi Linear Di R', price: 'Rp 100.000–250.000', icon: BarChart, badge: 'RStudio' },
  { id: 121, category: 'uji-data', name: 'ANOVA Di R', price: 'Rp 100.000–250.000', icon: BarChart, badge: 'RStudio' },
  { id: 122, category: 'uji-data', name: 'Visualisasi Ggplot2', price: 'Rp 80.000–200.000', icon: Code, badge: 'RStudio' },
  { id: 123, category: 'uji-data', name: 'Script R Lengkap Skripsi', price: 'Rp 200.000–600.000', icon: Code, badge: 'RStudio' },
  { id: 124, category: 'uji-data', name: 'Time Series Analysis', price: 'Rp 150.000–400.000', icon: BarChart, badge: 'EViews' },
  { id: 125, category: 'uji-data', name: 'Uji Stasioneritas', price: 'Rp 100.000–250.000', icon: BarChart, badge: 'EViews' },
  { id: 126, category: 'uji-data', name: 'Regresi Panel Data', price: 'Rp 200.000–500.000', icon: BarChart, badge: 'EViews' },
  { id: 127, category: 'uji-data', name: 'ARIMA Forecasting', price: 'Rp 200.000–600.000', icon: BarChart, badge: 'EViews' },
  { id: 128, category: 'uji-data', name: 'Interpretasi Output EViews', price: 'Rp 100.000–300.000', icon: BookOpen, badge: 'EViews' },
  { id: 129, category: 'uji-data', name: 'Setup Database', price: 'Rp 50.000–150.000', icon: Database, badge: 'Database' },
  { id: 130, category: 'uji-data', name: 'Create Table + Relasi', price: 'Rp 80.000–200.000', icon: Database, badge: 'Database' },
  { id: 131, category: 'uji-data', name: 'Query SQL Dasar', price: 'Rp 30.000–100.000', icon: Code, badge: 'Database' },
  { id: 132, category: 'uji-data', name: 'JOIN Query Kompleks', price: 'Rp 80.000–200.000', icon: Code, badge: 'Database' },
  { id: 133, category: 'uji-data', name: 'Normalisasi Database', price: 'Rp 150.000–400.000', icon: Database, badge: 'Database' },
  { id: 134, category: 'uji-data', name: 'ERD Database', price: 'Rp 150.000–400.000', icon: Database, badge: 'Database' },
  { id: 135, category: 'uji-data', name: 'Export/Import Data', price: 'Rp 30.000–100.000', icon: Database, badge: 'Database' },
  { id: 136, category: 'uji-data', name: 'Debug SQL Error', price: 'Rp 50.000–150.000', icon: Code, badge: 'Database' },
  { id: 137, category: 'uji-data', name: 'Olah Data Excel + Pivot + Chart', price: 'Rp 30.000–150.000', icon: FileSpreadsheet, badge: 'Excel' },
  { id: 711, category: 'uji-data', name: 'Uji Chi-Square', price: 'Rp 70.000–150.000', icon: BarChart, badge: 'SPSS Lanjutan' },
  { id: 712, category: 'uji-data', name: 'Uji Fisher Exact', price: 'Rp 70.000–150.000', icon: BarChart, badge: 'SPSS Lanjutan' },
  { id: 713, category: 'uji-data', name: 'Uji Mann-Whitney', price: 'Rp 80.000–160.000', icon: BarChart, badge: 'SPSS Lanjutan' },
  { id: 714, category: 'uji-data', name: 'Uji Wilcoxon', price: 'Rp 80.000–160.000', icon: BarChart, badge: 'SPSS Lanjutan' },
  { id: 715, category: 'uji-data', name: 'Uji Kruskal-Wallis', price: 'Rp 100.000–200.000', icon: BarChart, badge: 'SPSS Lanjutan' },
  { id: 716, category: 'uji-data', name: 'Uji Friedman', price: 'Rp 100.000–200.000', icon: BarChart, badge: 'SPSS Lanjutan' },
  { id: 717, category: 'uji-data', name: 'Uji Path Analysis Sederhana', price: 'Rp 150.000–350.000', icon: BarChart, badge: 'SPSS Lanjutan' },
  { id: 718, category: 'uji-data', name: 'Uji Sobel (Mediasi)', price: 'Rp 150.000–300.000', icon: BarChart, badge: 'SPSS Lanjutan' },
  { id: 719, category: 'uji-data', name: 'Moderasi (Interaction Effect)', price: 'Rp 150.000–300.000', icon: BarChart, badge: 'SPSS Lanjutan' },
  { id: 720, category: 'uji-data', name: 'Uji Linearitas SPSS', price: 'Rp 50.000–120.000', icon: BarChart, badge: 'SPSS Lanjutan' },
  { id: 721, category: 'uji-data', name: 'Feature Engineering Dataset', price: 'Rp 100.000–300.000', icon: Database, badge: 'Python Lanjut' },
  { id: 722, category: 'uji-data', name: 'Handling Missing Value Advanced', price: 'Rp 80.000–200.000', icon: Database, badge: 'Python Lanjut' },
  { id: 723, category: 'uji-data', name: 'Encoding Data Kategorikal', price: 'Rp 80.000–200.000', icon: Code, badge: 'Python Lanjut' },
  { id: 724, category: 'uji-data', name: 'Scaling/Normalization Data', price: 'Rp 80.000–200.000', icon: Code, badge: 'Python Lanjut' },
  { id: 725, category: 'uji-data', name: 'Outlier Detection Python', price: 'Rp 100.000–250.000', icon: Database, badge: 'Python Lanjut' },
  { id: 726, category: 'uji-data', name: 'Data Pipeline Sederhana', price: 'Rp 200.000–500.000', icon: Code, badge: 'Python Lanjut' },
  { id: 727, category: 'uji-data', name: 'Cross-Validation Model', price: 'Rp 200.000–500.000', icon: Code, badge: 'Python Lanjut' },
  { id: 728, category: 'uji-data', name: 'Model Evaluation (Accuracy, Precision)', price: 'Rp 150.000–400.000', icon: BarChart, badge: 'Python Lanjut' },
  { id: 729, category: 'uji-data', name: 'Confusion Matrix Analysis', price: 'Rp 100.000–250.000', icon: BarChart, badge: 'Python Lanjut' },
  { id: 730, category: 'uji-data', name: 'Time Series Forecasting Python', price: 'Rp 250.000–600.000', icon: Calculator, badge: 'Python Lanjut' },
  { id: 731, category: 'uji-data', name: 'Logistic Regression Model', price: 'Rp 200.000–500.000', icon: Calculator, badge: 'Machine Learning' },
  { id: 732, category: 'uji-data', name: 'Decision Tree Model', price: 'Rp 200.000–500.000', icon: Code, badge: 'Machine Learning' },
  { id: 733, category: 'uji-data', name: 'Random Forest Basic', price: 'Rp 300.000–700.000', icon: Code, badge: 'Machine Learning' },
  { id: 734, category: 'uji-data', name: 'SVM Classification', price: 'Rp 300.000–700.000', icon: Code, badge: 'Machine Learning' },
  { id: 735, category: 'uji-data', name: 'Neural Network Tuning', price: 'Rp 400.000–1.000.000', icon: Code, badge: 'Machine Learning' },
  { id: 736, category: 'uji-data', name: 'Hyperparameter Tuning', price: 'Rp 300.000–800.000', icon: Code, badge: 'Machine Learning' },
  { id: 737, category: 'uji-data', name: 'Model Comparison Analysis', price: 'Rp 200.000–500.000', icon: BarChart, badge: 'Machine Learning' },
  { id: 738, category: 'uji-data', name: 'Dataset Labeling Support', price: 'Rp 150.000–400.000', icon: Database, badge: 'Machine Learning' },
  { id: 739, category: 'uji-data', name: 'AI Model Optimization', price: 'Rp 500.000–1.500.000', icon: Code, badge: 'Machine Learning' },
  { id: 740, category: 'uji-data', name: 'Training Deep Learning Model', price: 'Rp 500.000–2.000.000', icon: Code, badge: 'Machine Learning' },
  { id: 741, category: 'uji-data', name: 'Data Wrangling Di R (Dplyr)', price: 'Rp 80.000–200.000', icon: Database, badge: 'RStudio Lanjut' },
  { id: 742, category: 'uji-data', name: 'Time Series R (Forecast Package)', price: 'Rp 200.000–500.000', icon: BarChart, badge: 'RStudio Lanjut' },
  { id: 743, category: 'uji-data', name: 'Regression Diagnostics R', price: 'Rp 150.000–300.000', icon: BarChart, badge: 'RStudio Lanjut' },
  { id: 744, category: 'uji-data', name: 'Logistic Regression R', price: 'Rp 150.000–300.000', icon: BarChart, badge: 'RStudio Lanjut' },
  { id: 745, category: 'uji-data', name: 'Survival Analysis R', price: 'Rp 300.000–700.000', icon: BarChart, badge: 'RStudio Lanjut' },
  { id: 746, category: 'uji-data', name: 'Multivariate Analysis R', price: 'Rp 300.000–700.000', icon: BarChart, badge: 'RStudio Lanjut' },
  { id: 747, category: 'uji-data', name: 'Correlation Matrix Heatmap', price: 'Rp 100.000–250.000', icon: BarChart, badge: 'RStudio Lanjut' },
  { id: 748, category: 'uji-data', name: 'Data Reshaping R', price: 'Rp 80.000–200.000', icon: Code, badge: 'RStudio Lanjut' },
  { id: 749, category: 'uji-data', name: 'Advanced Ggplot Dashboard', price: 'Rp 150.000–400.000', icon: Code, badge: 'RStudio Lanjut' },
  { id: 750, category: 'uji-data', name: 'R Markdown Report', price: 'Rp 150.000–300.000', icon: Code, badge: 'RStudio Lanjut' },
  { id: 751, category: 'uji-data', name: 'Vector Autoregression (VAR)', price: 'Rp 300.000–700.000', icon: BarChart, badge: 'EViews Lanjut' },
  { id: 752, category: 'uji-data', name: 'Cointegration Test', price: 'Rp 250.000–600.000', icon: BarChart, badge: 'EViews Lanjut' },
  { id: 753, category: 'uji-data', name: 'Error Correction Model (ECM)', price: 'Rp 250.000–600.000', icon: BarChart, badge: 'EViews Lanjut' },
  { id: 754, category: 'uji-data', name: 'Panel Data Fixed Effect', price: 'Rp 200.000–500.000', icon: BarChart, badge: 'EViews Lanjut' },
  { id: 755, category: 'uji-data', name: 'Random Effect Model', price: 'Rp 200.000–500.000', icon: BarChart, badge: 'EViews Lanjut' },
  { id: 756, category: 'uji-data', name: 'Granger Causality Test', price: 'Rp 200.000–500.000', icon: BarChart, badge: 'EViews Lanjut' },
  { id: 757, category: 'uji-data', name: 'Impulse Response Analysis', price: 'Rp 300.000–700.000', icon: BarChart, badge: 'EViews Lanjut' },
  { id: 758, category: 'uji-data', name: 'Forecast Evaluation EViews', price: 'Rp 200.000–500.000', icon: BarChart, badge: 'EViews Lanjut' },
  { id: 759, category: 'uji-data', name: 'Model Selection Econometrics', price: 'Rp 150.000–400.000', icon: BarChart, badge: 'EViews Lanjut' },
  { id: 760, category: 'uji-data', name: 'Stored Procedure & Function SQL', price: 'Rp 150.000–400.000', icon: Code, badge: 'Database Lanjut' },
  { id: 761, category: 'uji-data', name: 'Trigger Database Automation', price: 'Rp 200.000–500.000', icon: Code, badge: 'Database Lanjut' },
  { id: 762, category: 'uji-data', name: 'View Optimization SQL', price: 'Rp 100.000–300.000', icon: Code, badge: 'Database Lanjut' },
  { id: 763, category: 'uji-data', name: 'Query Optimization Tuning', price: 'Rp 150.000–400.000', icon: Code, badge: 'Database Lanjut' },
  { id: 764, category: 'uji-data', name: 'Database Indexing Setup', price: 'Rp 150.000–350.000', icon: Database, badge: 'Database Lanjut' },
  { id: 765, category: 'uji-data', name: 'Backup Automation SQL', price: 'Rp 100.000–250.000', icon: Database, badge: 'Database Lanjut' },
  { id: 766, category: 'uji-data', name: 'API Database Integration', price: 'Rp 300.000–800.000', icon: Code, badge: 'Database Lanjut' },
  { id: 767, category: 'uji-data', name: 'Data Migration Database', price: 'Rp 200.000–600.000', icon: Database, badge: 'Database Lanjut' },
  { id: 768, category: 'uji-data', name: 'Relational Schema Redesign', price: 'Rp 200.000–500.000', icon: Database, badge: 'Database Lanjut' },
  { id: 769, category: 'uji-data', name: 'Big Dataset SQL Processing', price: 'Rp 300.000–700.000', icon: Code, badge: 'Database Lanjut' },
  { id: 770, category: 'uji-data', name: 'Pivot Table Advanced Analysis', price: 'Rp 50.000–150.000', icon: FileSpreadsheet, badge: 'Excel Lanjut' },
  { id: 771, category: 'uji-data', name: 'Dashboard Excel Interaktif', price: 'Rp 150.000–400.000', icon: FileSpreadsheet, badge: 'Excel Lanjut' },
  { id: 772, category: 'uji-data', name: 'Power Query Cleaning', price: 'Rp 100.000–300.000', icon: FileSpreadsheet, badge: 'Excel Lanjut' },
  { id: 773, category: 'uji-data', name: 'Macro/VBA Automation', price: 'Rp 200.000–600.000', icon: Code, badge: 'Excel Lanjut' },
  { id: 774, category: 'uji-data', name: 'Forecasting Excel Model', price: 'Rp 100.000–300.000', icon: Calculator, badge: 'Excel Lanjut' },
  { id: 171, category: 'tugas-sekolah', name: 'Latihan Soal Harian', price: '10k–50k', icon: School, badge: null },
  { id: 172, category: 'tugas-sekolah', name: 'Pembahasan Soal', price: '15k–75k', icon: School, badge: null },
  { id: 173, category: 'tugas-sekolah', name: 'Bank Soal Mandiri', price: '25k–100k', icon: School, badge: null },
  // ─── Tugas Harian Sekolah ───
  { id: 174, category: 'tugas-sekolah', name: 'Mind Map Materi', price: '15k–75k', icon: School, badge: null },
  { id: 175, category: 'tugas-sekolah', name: 'Catatan Estetik', price: '15k–75k', icon: School, badge: null },
  { id: 176, category: 'tugas-sekolah', name: 'Kartu Hafalan', price: '15k–50k', icon: School, badge: null },
  { id: 177, category: 'tugas-sekolah', name: 'Ringkasan Per Bab Versi Poin', price: '15k–75k', icon: School, badge: null },
  { id: 178, category: 'tugas-sekolah', name: 'Tugas Kliping', price: '20k–100k', icon: ClipboardList, badge: null },
  { id: 179, category: 'tugas-sekolah', name: 'Tugas Poster Edukasi', price: '25k–100k', icon: Image, badge: null },
  { id: 180, category: 'tugas-sekolah', name: 'Tugas Infografis Sekolah', price: '30k–150k', icon: Image, badge: null },
  { id: 181, category: 'tugas-sekolah', name: 'Tugas Mading', price: '50k–200k', icon: Image, badge: null },
  { id: 182, category: 'tugas-sekolah', name: 'Tugas Biografi Tokoh', price: '25k–100k', icon: BookOpen, badge: null },
  { id: 183, category: 'tugas-sekolah', name: 'Tugas Autobiografi', price: '25k–100k', icon: BookOpen, badge: null },
  { id: 184, category: 'tugas-sekolah', name: 'Tugas Teks Pidato', price: '25k–100k', icon: BookOpen, badge: null },
  { id: 185, category: 'tugas-sekolah', name: 'Tugas Teks MC', price: '25k–100k', icon: BookOpen, badge: null },
  { id: 186, category: 'tugas-sekolah', name: 'Tugas Teks Drama', price: '40k–150k', icon: BookOpen, badge: null },
  { id: 187, category: 'tugas-sekolah', name: 'Tugas Teks Negosiasi', price: '20k–75k', icon: BookOpen, badge: null },
  { id: 188, category: 'tugas-sekolah', name: 'Tugas Teks Eksposisi', price: '20k–75k', icon: BookOpen, badge: null },
  { id: 189, category: 'tugas-sekolah', name: 'Tugas Teks Eksplanasi', price: '20k–75k', icon: BookOpen, badge: null },
  { id: 190, category: 'tugas-sekolah', name: 'Tugas Teks Prosedur', price: '20k–75k', icon: BookOpen, badge: null },
  { id: 191, category: 'tugas-sekolah', name: 'Tugas Teks Anekdot', price: '20k–75k', icon: BookOpen, badge: null },
  { id: 192, category: 'tugas-sekolah', name: 'Tugas Teks Deskripsi', price: '20k–75k', icon: BookOpen, badge: null },
  { id: 193, category: 'tugas-sekolah', name: 'Tugas Teks Argumentasi', price: '20k–75k', icon: BookOpen, badge: null },
  { id: 194, category: 'tugas-sekolah', name: 'Tugas Surat Pribadi', price: '15k–50k', icon: BookOpen, badge: null },
  { id: 195, category: 'tugas-sekolah', name: 'Tugas Surat Dinas', price: '20k–75k', icon: BookOpen, badge: null },
  { id: 196, category: 'tugas-sekolah', name: 'Tugas Cerita Inspiratif', price: '25k–100k', icon: Pen, badge: null },
  { id: 197, category: 'tugas-sekolah', name: 'Tugas Resensi Buku', price: '30k–150k', icon: BookOpen, badge: null },
  { id: 198, category: 'tugas-sekolah', name: 'Tugas Sinopsis Film', price: '25k–100k', icon: BookOpen, badge: null },
  { id: 199, category: 'tugas-sekolah', name: 'Tugas Analisis Cerpen', price: '30k–150k', icon: BookOpen, badge: null },
  { id: 200, category: 'tugas-sekolah', name: 'Tugas Analisis Novel', price: '40k–200k', icon: BookOpen, badge: null },
  // ─── Laporan & Proposal Sekolah ───
  { id: 201, category: 'tugas-sekolah', name: 'Laporan Study Tour', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 202, category: 'tugas-sekolah', name: 'Laporan Kunjungan Museum', price: '40k–150k', icon: FileSpreadsheet, badge: null },
  { id: 203, category: 'tugas-sekolah', name: 'Laporan Observasi Lingkungan', price: '40k–150k', icon: FileSpreadsheet, badge: null },
  { id: 204, category: 'tugas-sekolah', name: 'Laporan Wawancara Tokoh', price: '40k–150k', icon: FileSpreadsheet, badge: null },
  { id: 205, category: 'tugas-sekolah', name: 'Laporan Kegiatan Sekolah', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 206, category: 'tugas-sekolah', name: 'Proposal Kegiatan Kelas', price: '40k–150k', icon: FileSpreadsheet, badge: null },
  { id: 207, category: 'tugas-sekolah', name: 'Proposal Kegiatan OSIS', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 208, category: 'tugas-sekolah', name: 'Proposal Kegiatan Pramuka', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 209, category: 'tugas-sekolah', name: 'Proposal Kegiatan Ekskul', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 210, category: 'tugas-sekolah', name: 'Program Kerja OSIS', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 211, category: 'tugas-sekolah', name: 'Program Kerja Ekskul', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 212, category: 'tugas-sekolah', name: 'Struktur Kepanitiaan', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 213, category: 'tugas-sekolah', name: 'Rundown Acara Sekolah', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 214, category: 'tugas-sekolah', name: 'Teks Sambutan Acara', price: '25k–100k', icon: BookOpen, badge: null },
  { id: 215, category: 'tugas-sekolah', name: 'Teks Moderator', price: '25k–100k', icon: BookOpen, badge: null },
  { id: 216, category: 'tugas-sekolah', name: 'Teks Debat', price: '30k–150k', icon: BookOpen, badge: null },
  { id: 217, category: 'tugas-sekolah', name: 'Naskah Drama Sekolah', price: '50k–250k', icon: BookOpen, badge: null },
  { id: 218, category: 'tugas-sekolah', name: 'Naskah Video Edukasi', price: '50k–250k', icon: BookOpen, badge: null },
  { id: 219, category: 'tugas-sekolah', name: 'Script Presentasi Video', price: '40k–150k', icon: Presentation, badge: null },
  { id: 220, category: 'tugas-sekolah', name: 'Konsep Project P5', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 221, category: 'tugas-sekolah', name: 'Laporan Project P5', price: '75k–300k', icon: FileSpreadsheet, badge: null },
  { id: 222, category: 'tugas-sekolah', name: 'Jurnal Kegiatan P5', price: '40k–150k', icon: FileSpreadsheet, badge: null },
  { id: 223, category: 'tugas-sekolah', name: 'Ide Produk Kewirausahaan Sekolah', price: '25k–100k', icon: BookOpen, badge: null },
  { id: 224, category: 'tugas-sekolah', name: 'Laporan Kewirausahaan Sekolah', price: '75k–300k', icon: FileSpreadsheet, badge: null },
  // ─── Tugas Mata Pelajaran Sekolah ───
  { id: 225, category: 'tugas-sekolah', name: 'Tugas Bahasa Indonesia', price: '15k–100k', icon: Languages, badge: null },
  { id: 226, category: 'tugas-sekolah', name: 'Tugas Bahasa Inggris', price: '20k–150k', icon: Languages, badge: null },
  { id: 227, category: 'tugas-sekolah', name: 'Tugas Bahasa Daerah', price: '20k–100k', icon: Languages, badge: null },
  { id: 228, category: 'tugas-sekolah', name: 'Tugas Bahasa Jepang', price: '30k–150k', icon: Globe, badge: null },
  { id: 229, category: 'tugas-sekolah', name: 'Tugas Bahasa Mandarin', price: '30k–150k', icon: Globe, badge: null },
  { id: 230, category: 'tugas-sekolah', name: 'Tugas Bahasa Arab', price: '30k–150k', icon: Globe, badge: null },
  { id: 231, category: 'tugas-sekolah', name: 'Tugas Sejarah', price: '20k–150k', icon: BookOpen, badge: null },
  { id: 232, category: 'tugas-sekolah', name: 'Tugas Geografi', price: '20k–150k', icon: Globe, badge: null },
  { id: 233, category: 'tugas-sekolah', name: 'Tugas Ekonomi', price: '25k–200k', icon: Calculator, badge: null },
  { id: 234, category: 'tugas-sekolah', name: 'Tugas Akuntansi Dasar', price: '30k–200k', icon: Calculator, badge: null },
  { id: 235, category: 'tugas-sekolah', name: 'Tugas PKN', price: '20k–100k', icon: BookOpen, badge: null },
  { id: 236, category: 'tugas-sekolah', name: 'Tugas Agama', price: '20k–100k', icon: BookOpen, badge: null },
  { id: 237, category: 'tugas-sekolah', name: 'Tugas Seni Budaya', price: '25k–150k', icon: Image, badge: null },
  { id: 238, category: 'tugas-sekolah', name: 'Tugas Prakarya', price: '25k–150k', icon: Code, badge: null },
  { id: 239, category: 'tugas-sekolah', name: 'Tugas PJOK', price: '20k–100k', icon: School, badge: null },
  { id: 240, category: 'tugas-sekolah', name: 'Tugas Kewirausahaan', price: '30k–200k', icon: Calculator, badge: null },
  { id: 241, category: 'tugas-sekolah', name: 'Tugas Administrasi Perkantoran', price: '30k–200k', icon: Calculator, badge: null },
  { id: 242, category: 'tugas-sekolah', name: 'Tugas Multimedia', price: '50k–300k', icon: MonitorCheck, badge: null },
  { id: 243, category: 'tugas-sekolah', name: 'Tugas Desain Grafis', price: '50k–300k', icon: Image, badge: null },
  { id: 244, category: 'tugas-sekolah', name: 'Tugas TKJ', price: '50k–300k', icon: Code, badge: null },
  { id: 245, category: 'tugas-sekolah', name: 'Tugas RPL Non-Coding', price: '40k–250k', icon: Code, badge: null },
  { id: 246, category: 'tugas-sekolah', name: 'Tugas Perhotelan SMK', price: '30k–200k', icon: Globe, badge: null },
  { id: 247, category: 'tugas-sekolah', name: 'Tugas Tata Boga', price: '30k–200k', icon: Calculator, badge: null },
  { id: 248, category: 'tugas-sekolah', name: 'Tugas Tata Busana', price: '30k–200k', icon: Image, badge: null },
  { id: 249, category: 'tugas-sekolah', name: 'Tugas Otomotif', price: '50k–300k', icon: Calculator, badge: null },
  { id: 250, category: 'tugas-sekolah', name: 'Tugas Akuntansi SMK', price: '30k–200k', icon: Calculator, badge: null },
  { id: 251, category: 'tugas-sekolah', name: 'Tugas Pemasaran SMK', price: '30k–200k', icon: Calculator, badge: null },
  { id: 268, category: 'umum', name: 'Entry Data', price: '25k–150k', icon: Database, badge: null },
  { id: 269, category: 'umum', name: 'Rekap Data Excel', price: '25k–200k', icon: Database, badge: null },
  { id: 270, category: 'umum', name: 'Input Database', price: '50k–300k', icon: Database, badge: null },
  // ─── Template & Dokumen Kantor ───
  { id: 271, category: 'umum', name: 'Rapikan Database', price: '50k–300k', icon: Database, badge: null },
  { id: 272, category: 'umum', name: 'Template Absensi', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 273, category: 'umum', name: 'Template Invoice', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 274, category: 'umum', name: 'Template Kwitansi', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 275, category: 'umum', name: 'Template Surat Jalan', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 276, category: 'umum', name: 'Template Laporan Harian', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 277, category: 'umum', name: 'Template Laporan Mingguan', price: '30k–150k', icon: FileSpreadsheet, badge: null },
  { id: 278, category: 'umum', name: 'Template Laporan Bulanan', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 279, category: 'umum', name: 'Formulir Digital', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 280, category: 'umum', name: 'Google Form', price: '25k–100k', icon: Globe, badge: null },
  { id: 281, category: 'umum', name: 'Survey Online', price: '50k–200k', icon: Globe, badge: null },
  { id: 282, category: 'umum', name: 'Notulen Meeting', price: '50k–200k', icon: BookOpen, badge: null },
  { id: 283, category: 'umum', name: 'Minutes of Meeting', price: '75k–250k', icon: BookOpen, badge: null },
  { id: 284, category: 'umum', name: 'Agenda Meeting', price: '25k–100k', icon: BookOpen, badge: null },
  { id: 285, category: 'umum', name: 'Rundown Acara Kantor', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 286, category: 'umum', name: 'SOP Kerja', price: '150k–750k', icon: BookOpen, badge: null },
  { id: 287, category: 'umum', name: 'Job Description', price: '75k–300k', icon: BookOpen, badge: null },
  { id: 288, category: 'umum', name: 'KPI Karyawan', price: '150k–750k', icon: BarChart, badge: null },
  { id: 289, category: 'umum', name: 'Struktur Organisasi', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 290, category: 'umum', name: 'Timeline Project', price: '50k–250k', icon: Route, badge: null },
  { id: 291, category: 'umum', name: 'Checklist Kerja', price: '25k–100k', icon: ClipboardList, badge: null },
  { id: 292, category: 'umum', name: 'Template Monitoring Project', price: '75k–300k', icon: FileSpreadsheet, badge: null },
  // ─── Bisnis & Marketing ───
  { id: 293, category: 'umum', name: 'Proposal Bisnis', price: '150k–750k', icon: FileSpreadsheet, badge: null },
  { id: 294, category: 'umum', name: 'Company Profile', price: '200k–1.000k', icon: FileSpreadsheet, badge: null },
  { id: 295, category: 'umum', name: 'Pitch Deck Bisnis', price: '250k–1.500k', icon: Presentation, badge: null },
  { id: 296, category: 'umum', name: 'Analisis SWOT', price: '75k–300k', icon: BarChart, badge: null },
  { id: 297, category: 'umum', name: 'Analisis Kompetitor', price: '100k–500k', icon: BarChart, badge: null },
  { id: 298, category: 'umum', name: 'Analisis Target Pasar', price: '100k–500k', icon: BarChart, badge: null },
  { id: 299, category: 'umum', name: 'Riset Pasar', price: '150k–1.000k', icon: Globe, badge: null },
  { id: 300, category: 'umum', name: 'Riset Produk', price: '75k–500k', icon: Globe, badge: null },
  { id: 301, category: 'umum', name: 'Riset Harga Kompetitor', price: '75k–300k', icon: Globe, badge: null },
  { id: 302, category: 'umum', name: 'Business Model Canvas', price: '75k–300k', icon: FileSpreadsheet, badge: null },
  { id: 303, category: 'umum', name: 'Perhitungan HPP', price: '75k–300k', icon: Calculator, badge: null },
  { id: 304, category: 'umum', name: 'Perhitungan BEP', price: '75k–300k', icon: Calculator, badge: null },
  { id: 305, category: 'umum', name: 'Perhitungan Margin Profit', price: '75k–300k', icon: Calculator, badge: null },
  { id: 306, category: 'umum', name: 'Laporan Penjualan', price: '75k–300k', icon: BarChart, badge: null },
  { id: 307, category: 'umum', name: 'Laporan Stok Barang', price: '50k–250k', icon: Database, badge: null },
  { id: 308, category: 'umum', name: 'Laporan Keuangan Sederhana', price: '100k–500k', icon: Calculator, badge: null },
  { id: 309, category: 'umum', name: 'Pembukuan UMKM', price: '150k–750k', icon: Calculator, badge: null },
  { id: 310, category: 'umum', name: 'Catatan Kas Masuk Keluar', price: '50k–250k', icon: Database, badge: null },
  { id: 311, category: 'umum', name: 'Template Inventory', price: '75k–300k', icon: FileSpreadsheet, badge: null },
  { id: 312, category: 'umum', name: 'Template Orderan', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 313, category: 'umum', name: 'Template Customer Database', price: '50k–200k', icon: Database, badge: null },
  { id: 314, category: 'umum', name: 'Deskripsi Produk Marketplace', price: '5k–25k/produk', icon: Globe, badge: null },
  { id: 315, category: 'umum', name: 'Optimasi Judul Produk', price: '5k–20k/produk', icon: Globe, badge: null },
  { id: 316, category: 'umum', name: 'Ide Nama Brand', price: '50k–250k', icon: Star, badge: null },
  { id: 317, category: 'umum', name: 'Slogan Brand', price: '50k–250k', icon: Star, badge: null },
  { id: 318, category: 'umum', name: 'Konsep Branding UMKM', price: '150k–750k', icon: Star, badge: null },
  // ─── Personal & Karier ───
  { id: 319, category: 'umum', name: 'Optimasi Profil LinkedIn', price: '75k–300k', icon: Globe, badge: null },
  { id: 320, category: 'umum', name: 'Bio Profesional', price: '25k–100k', icon: Pen, badge: null },
  { id: 321, category: 'umum', name: 'Portofolio Kerja', price: '100k–500k', icon: FileSpreadsheet, badge: null },
  { id: 322, category: 'umum', name: 'Personal Branding', price: '150k–750k', icon: Star, badge: null },
  { id: 323, category: 'umum', name: 'Surat Resign', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 324, category: 'umum', name: 'Surat Rekomendasi', price: '30k–150k', icon: FileSpreadsheet, badge: null },
  { id: 325, category: 'umum', name: 'Surat Pernyataan', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 326, category: 'umum', name: 'Surat Kuasa', price: '30k–150k', icon: FileSpreadsheet, badge: null },
  { id: 327, category: 'umum', name: 'Surat Kerja Sama', price: '75k–300k', icon: FileSpreadsheet, badge: null },
  { id: 328, category: 'umum', name: 'Surat Penawaran', price: '50k–250k', icon: FileSpreadsheet, badge: null },
  { id: 329, category: 'umum', name: 'Surat Permohonan', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 330, category: 'umum', name: 'Surat Undangan Resmi', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 331, category: 'umum', name: 'Surat Komplain', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 332, category: 'umum', name: 'Surat Balasan Kerja Sama', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 333, category: 'umum', name: 'Email Profesional', price: '25k–100k', icon: Globe, badge: null },
  { id: 334, category: 'umum', name: 'Email Follow Up', price: '25k–100k', icon: Globe, badge: null },
  { id: 335, category: 'umum', name: 'Email Penawaran Bisnis', price: '50k–200k', icon: Globe, badge: null },
  { id: 336, category: 'umum', name: 'Email Customer Service', price: '25k–100k', icon: Globe, badge: null },
  { id: 337, category: 'umum', name: 'Script Interview Kerja', price: '50k–200k', icon: BookOpen, badge: null },
  { id: 338, category: 'umum', name: 'Simulasi Jawaban Interview', price: '75k–300k', icon: BookOpen, badge: null },
  { id: 339, category: 'umum', name: 'Profil Singkat Freelancer', price: '25k–100k', icon: Globe, badge: null },
  { id: 340, category: 'umum', name: 'Bio Marketplace Freelancer', price: '25k–100k', icon: Globe, badge: null },
  { id: 341, category: 'medsos', name: 'Caption Instagram', price: '5k–25k/caption', icon: Pen, badge: null },
  { id: 342, category: 'medsos', name: 'Caption TikTok', price: '5k–25k/caption', icon: Pen, badge: null },
  { id: 343, category: 'medsos', name: 'Copywriting Produk', price: '15k–75k/produk', icon: Pen, badge: null },
  { id: 344, category: 'medsos', name: 'Copywriting Iklan', price: '50k–250k', icon: Pen, badge: null },
  // ─── Content & Script ───
  { id: 345, category: 'medsos', name: 'Caption Marketplace', price: '5k–25k/produk', icon: Globe, badge: null },
  { id: 346, category: 'medsos', name: 'Script TikTok', price: '25k–150k', icon: Pen, badge: null },
  { id: 347, category: 'medsos', name: 'Script Reels', price: '25k–150k', icon: Pen, badge: null },
  { id: 348, category: 'medsos', name: 'Script YouTube Shorts', price: '25k–150k', icon: Pen, badge: null },
  { id: 349, category: 'medsos', name: 'Script Voice Over', price: '50k–250k', icon: Pen, badge: null },
  { id: 350, category: 'medsos', name: 'Ide Konten Harian', price: '25k–100k', icon: Star, badge: null },
  { id: 351, category: 'medsos', name: 'Kalender Konten', price: '150k–750k', icon: FileSpreadsheet, badge: null },
  { id: 352, category: 'medsos', name: 'Content Plan Mingguan', price: '100k–500k', icon: FileSpreadsheet, badge: null },
  { id: 353, category: 'medsos', name: 'Content Plan Bulanan', price: '250k–1.500k', icon: FileSpreadsheet, badge: null },
  { id: 354, category: 'medsos', name: 'Artikel Blog', price: '50k–250k/artikel', icon: BookOpen, badge: null },
  { id: 355, category: 'medsos', name: 'Artikel SEO', price: '75k–400k/artikel', icon: Globe, badge: null },
  { id: 356, category: 'medsos', name: 'Deskripsi Video YouTube', price: '25k–100k', icon: BookOpen, badge: null },
  { id: 357, category: 'medsos', name: 'Judul Konten Viral', price: '25k–100k', icon: Star, badge: null },
  { id: 358, category: 'medsos', name: 'Riset Hashtag', price: '25k–100k', icon: Globe, badge: null },
  { id: 359, category: 'medsos', name: 'Bio Instagram Bisnis', price: '25k–100k', icon: Globe, badge: null },
  // ─── Template Chat & Admin ───
  { id: 360, category: 'medsos', name: 'Balasan Chat Customer', price: '25k–100k', icon: Globe, badge: null },
  { id: 361, category: 'medsos', name: 'Template Chat Admin', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 362, category: 'medsos', name: 'Template Broadcast WhatsApp', price: '25k–150k', icon: Globe, badge: null },
  { id: 363, category: 'medsos', name: 'Template Promo Produk', price: '25k–150k', icon: FileSpreadsheet, badge: null },
  { id: 364, category: 'medsos', name: 'Template Testimoni', price: '15k–75k', icon: FileSpreadsheet, badge: null },
  { id: 365, category: 'desain', name: 'Desain Logo', price: '75k–500k', icon: Image, badge: null },
  { id: 366, category: 'desain', name: 'Desain Banner', price: '50k–300k', icon: Image, badge: null },
  { id: 367, category: 'desain', name: 'Desain Brosur', price: '50k–300k', icon: Image, badge: null },
  { id: 368, category: 'desain', name: 'Desain Flyer', price: '50k–250k', icon: Image, badge: null },
  { id: 369, category: 'desain', name: 'Desain Menu Makanan', price: '50k–300k', icon: Image, badge: null },
  // ─── Desain Sekolah ───
  { id: 370, category: 'desain', name: 'Desain Poster Sekolah', price: '25k–100k', icon: Image, badge: null },
  { id: 371, category: 'desain', name: 'Desain Jadwal Piket', price: '15k–50k', icon: Image, badge: null },
  { id: 372, category: 'desain', name: 'Desain Struktur Kelas', price: '15k–50k', icon: Image, badge: null },
  { id: 373, category: 'desain', name: 'Desain Sertifikat Kelas', price: '15k–50k', icon: Image, badge: null },
  { id: 374, category: 'desain', name: 'Desain ID Card Panchunta', price: '20k–75k', icon: Image, badge: null },
  { id: 375, category: 'desain', name: 'Desain Brosur Sekolah', price: '30k–150k', icon: Image, badge: null },
  { id: 376, category: 'desain', name: 'Desain Pamflet Acara', price: '30k–150k', icon: Image, badge: null },
  { id: 377, category: 'desain', name: 'Desain Twibbon', price: '25k–100k', icon: Image, badge: null },
  { id: 378, category: 'desain', name: 'Desain Feed OSIS', price: '25k–100k', icon: Image, badge: null },
  { id: 379, category: 'desain', name: 'Desain Story Instagram Sekolah', price: '20k–75k', icon: Image, badge: null },
  { id: 380, category: 'desain', name: 'Desain Cover Tugas', price: '10k–50k', icon: Image, badge: null },
  { id: 381, category: 'desain', name: 'Desain Sampul Kliping', price: '10k–50k', icon: Image, badge: null },
  { id: 382, category: 'desain', name: 'Desain Modul Belajar', price: '75k–300k', icon: FileSpreadsheet, badge: null },
  { id: 383, category: 'desain', name: 'Desain Lembar Kerja Siswa', price: '50k–250k', icon: FileSpreadsheet, badge: null },
  { id: 384, category: 'desain', name: 'Desain Kartu Ucapan Guru', price: '15k–75k', icon: Image, badge: null },
  { id: 385, category: 'desain', name: 'Desain Undangan Acara Sekolah', price: '25k–100k', icon: Image, badge: null },
  { id: 386, category: 'desain', name: 'Desain Cover Makalah', price: 'Start 15k', icon: FileSpreadsheet, badge: null },
  { id: 387, category: 'desain', name: 'Desain Cover Laporan', price: 'Start 15k', icon: FileSpreadsheet, badge: null },
  // ─── Desain Branding & Produk ───
  { id: 388, category: 'desain', name: 'Desain Katalog Produk', price: '150k–750k', icon: Image, badge: null },
  { id: 389, category: 'desain', name: 'Desain Price List', price: '30k–150k', icon: FileSpreadsheet, badge: null },
  { id: 390, category: 'desain', name: 'Desain Sertifikat', price: '25k–100k', icon: Image, badge: null },
  { id: 391, category: 'desain', name: 'Desain Undangan Digital', price: '50k–250k', icon: Image, badge: null },
  { id: 392, category: 'desain', name: 'Desain Kartu Nama', price: '50k–200k', icon: Image, badge: null },
  { id: 393, category: 'desain', name: 'Desain Stiker Produk', price: '25k–150k', icon: Image, badge: null },
  { id: 394, category: 'desain', name: 'Desain Label Kemasan', price: '50k–300k', icon: Image, badge: null },
  { id: 395, category: 'desain', name: 'Desain Packaging', price: '150k–1.000k', icon: Image, badge: null },
  { id: 396, category: 'desain', name: 'Desain Feed Instagram', price: '25k–150k/post', icon: Image, badge: null },
  { id: 397, category: 'desain', name: 'Desain Story Instagram', price: '20k–100k/story', icon: Image, badge: null },
  { id: 398, category: 'desain', name: 'Desain Thumbnail YouTube', price: '30k–150k', icon: Image, badge: null },
  { id: 399, category: 'desain', name: 'Desain Cover Ebook', price: '75k–300k', icon: BookOpen, badge: null },
  { id: 400, category: 'desain', name: 'Desain Poster Event', price: '50k–300k', icon: Image, badge: null },
  { id: 401, category: 'desain', name: 'Desain Spanduk', price: '75k–400k', icon: Image, badge: null },
  { id: 402, category: 'desain', name: 'Desain X-Banner', price: '75k–400k', icon: Image, badge: null },
  // ─── Edit PDF & Dokumen ───
  { id: 403, category: 'desain', name: 'Edit PDF Ringan', price: '10k–50k', icon: FileSpreadsheet, badge: null },
  { id: 404, category: 'desain', name: 'Gabung File PDF', price: '5k–25k', icon: FileSpreadsheet, badge: null },
  { id: 405, category: 'desain', name: 'Pisah File PDF', price: '5k–25k', icon: FileSpreadsheet, badge: null },
  { id: 406, category: 'desain', name: 'Kompres PDF', price: '5k–20k', icon: FileSpreadsheet, badge: null },
  { id: 407, category: 'desain', name: 'Watermark Dokumen', price: '10k–50k', icon: FileSpreadsheet, badge: null },
  { id: 408, category: 'desain', name: 'Hapus Watermark Milik Sendiri', price: '10k–50k', icon: FileSpreadsheet, badge: null },
  { id: 409, category: 'desain', name: 'Convert Gambar ke PDF', price: '5k–25k', icon: FileSpreadsheet, badge: null },
  { id: 410, category: 'desain', name: 'Convert Word ke PDF', price: '5k–20k', icon: FileSpreadsheet, badge: null },
  { id: 411, category: 'desain', name: 'Convert Excel ke PDF', price: '5k–20k', icon: FileSpreadsheet, badge: null },
  { id: 412, category: 'desain', name: 'Rapikan Layout Dokumen', price: '10k–75k', icon: FileSpreadsheet, badge: null },
  { id: 413, category: 'desain', name: 'Buat Template Dokumen', price: '25k–150k', icon: FileSpreadsheet, badge: null },
  { id: 414, category: 'desain', name: 'Buat Kop Surat', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 415, category: 'desain', name: 'Buat Form Isian', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 416, category: 'desain', name: 'Buat E-Certificate', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 417, category: 'desain', name: 'Buat Barcode / QR Code', price: '10k–50k', icon: FileSpreadsheet, badge: null },
  { id: 418, category: 'desain', name: 'Buat Label Nama', price: '10k–50k', icon: FileSpreadsheet, badge: null },
  { id: 419, category: 'desain', name: 'Buat Nomor Antrian', price: '10k–50k', icon: FileSpreadsheet, badge: null },
  { id: 420, category: 'desain', name: 'Buat Kartu Panchunta', price: '20k–100k', icon: FileSpreadsheet, badge: null },
  { id: 421, category: 'desain', name: 'Buat Kartu Member', price: '20k–100k', icon: FileSpreadsheet, badge: null },
  // ─── Event & Kepanitiaan ───
  { id: 422, category: 'desain', name: 'Proposal Event', price: '100k–500k', icon: FileSpreadsheet, badge: null },
  { id: 423, category: 'desain', name: 'Rundown Event', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 424, category: 'desain', name: 'Susunan Acara', price: '30k–150k', icon: FileSpreadsheet, badge: null },
  { id: 425, category: 'desain', name: 'Teks MC Formal', price: '50k–200k', icon: BookOpen, badge: null },
  { id: 426, category: 'desain', name: 'Teks MC Nonformal', price: '40k–150k', icon: BookOpen, badge: null },
  { id: 427, category: 'desain', name: 'Teks Sambutan Ketua Panchunta', price: '40k–150k', icon: BookOpen, badge: null },
  { id: 428, category: 'desain', name: 'Teks Sambutan Pembina', price: '40k–150k', icon: BookOpen, badge: null },
  { id: 429, category: 'desain', name: 'Teks Moderator Seminar', price: '50k–200k', icon: BookOpen, badge: null },
  { id: 430, category: 'desain', name: 'Term of Reference Acara', price: '100k–400k', icon: FileSpreadsheet, badge: null },
  { id: 431, category: 'desain', name: 'Timeline Kepanitiaan', price: '50k–200k', icon: Route, badge: null },
  { id: 432, category: 'desain', name: 'Jobdesk Panchunta', price: '50k–200k', icon: ClipboardList, badge: null },
  { id: 433, category: 'desain', name: 'Form Registrasi Acara', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 434, category: 'desain', name: 'Sertifikat Peserta', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 435, category: 'desain', name: 'Sertifikat Panchunta', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 436, category: 'desain', name: 'Desain Background Zoom', price: '30k–150k', icon: Image, badge: null },
  { id: 437, category: 'desain', name: 'Desain Name Tag', price: '20k–100k', icon: Image, badge: null },
  { id: 438, category: 'desain', name: 'Rekap Kehadiran Peserta', price: '25k–150k', icon: FileSpreadsheet, badge: null },
  { id: 439, category: 'desain', name: 'LPJ Acara', price: '100k–500k', icon: FileSpreadsheet, badge: null },
  // ─── Desain Cover & Layout Dokumen ───
  { id: 440, category: 'desain', name: 'Desain Cover Proposal', price: '25k–100k', icon: BookOpen, badge: null },
  { id: 441, category: 'desain', name: 'Desain Cover Skripsi / Tugas Akhir', price: '25k–100k', icon: GraduationCap, badge: null },
  { id: 442, category: 'desain', name: 'Desain Layout Makalah', price: '25k–150k', icon: FileSpreadsheet, badge: null },
  { id: 443, category: 'desain', name: 'Desain Layout Proposal', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 444, category: 'desain', name: 'Desain Layout Laporan Praktik', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 445, category: 'desain', name: 'Desain E-Modul Sekolah', price: '100k–500k', icon: BookOpen, badge: null },
  { id: 446, category: 'desain', name: 'Desain Infografis Materi', price: '30k–150k', icon: Image, badge: null },
  { id: 447, category: 'desain', name: 'Desain Mind Map Digital', price: '20k–100k', icon: Image, badge: null },
  { id: 448, category: 'desain', name: 'Desain Timeline Sejarah', price: '25k–100k', icon: Image, badge: null },
  { id: 449, category: 'desain', name: 'Desain Jadwal Pelajaran', price: '10k–50k', icon: FileSpreadsheet, badge: null },
  { id: 450, category: 'desain', name: 'Desain Kartu Hafalan', price: '15k–75k', icon: Image, badge: null },
  { id: 451, category: 'desain', name: 'Desain Flashcard Edukasi', price: '25k–150k', icon: Image, badge: null },
  { id: 452, category: 'desain', name: 'Desain Lembar Catatan Estetik', price: '15k–75k', icon: FileSpreadsheet, badge: null },
  { id: 453, category: 'desain', name: 'Desain Template Catatan Sekolah', price: '20k–100k', icon: FileSpreadsheet, badge: null },
  // ─── Desain Media Sosial & Platform ───
  { id: 454, category: 'desain', name: 'Desain Carousel Instagram', price: '50k–250k/paket', icon: Image, badge: null },
  { id: 455, category: 'desain', name: 'Desain Highlight Instagram', price: '25k–100k', icon: Image, badge: null },
  { id: 456, category: 'desain', name: 'Desain Cover Highlight', price: '20k–75k', icon: Image, badge: null },
  { id: 457, category: 'desain', name: 'Desain Template Reels Cover', price: '25k–100k', icon: Image, badge: null },
  { id: 458, category: 'desain', name: 'Desain Template TikTok Cover', price: '25k–100k', icon: Image, badge: null },
  { id: 459, category: 'desain', name: 'Desain Header Facebook', price: '30k–150k', icon: Globe, badge: null },
  { id: 460, category: 'desain', name: 'Desain Sampul Grup Facebook', price: '30k–150k', icon: Globe, badge: null },
  { id: 461, category: 'desain', name: 'Desain Header Twitter / X', price: '30k–150k', icon: Globe, badge: null },
  { id: 462, category: 'desain', name: 'Desain Header LinkedIn', price: '50k–200k', icon: Globe, badge: null },
  { id: 463, category: 'desain', name: 'Desain Profil Marketplace', price: '50k–200k', icon: Globe, badge: null },
  { id: 464, category: 'desain', name: 'Desain Bio Link Page', price: '50k–250k', icon: Globe, badge: null },
  { id: 465, category: 'desain', name: 'Desain Template Promo Harian', price: '25k–100k', icon: Image, badge: null },
  { id: 466, category: 'desain', name: 'Desain Template Testimoni', price: '20k–75k', icon: Image, badge: null },
  { id: 467, category: 'desain', name: 'Desain Template Giveaway', price: '30k–150k', icon: Image, badge: null },
  { id: 468, category: 'desain', name: 'Desain Template Open Order', price: '25k–100k', icon: Image, badge: null },
  { id: 469, category: 'desain', name: 'Desain Template Close Order', price: '20k–75k', icon: Image, badge: null },
  { id: 470, category: 'desain', name: 'Desain Template Flash Sale', price: '30k–150k', icon: Image, badge: null },
  { id: 471, category: 'desain', name: 'Desain Template Pengumuman', price: '20k–100k', icon: Image, badge: null },
  { id: 472, category: 'desain', name: 'Desain Template Quotes', price: '15k–75k', icon: Image, badge: null },
  { id: 473, category: 'desain', name: 'Desain Template Edukasi Konten', price: '25k–100k', icon: Image, badge: null },
  // ─── Desain Branding & Identity ───
  { id: 474, category: 'desain', name: 'Desain Brand Guideline Sederhana', price: '150k–750k', icon: Star, badge: null },
  { id: 475, category: 'desain', name: 'Desain Brand Board', price: '100k–500k', icon: Star, badge: null },
  { id: 476, category: 'desain', name: 'Desain Moodboard Brand', price: '75k–300k', icon: Image, badge: null },
  { id: 477, category: 'desain', name: 'Desain Palet Warna Brand', price: '50k–200k', icon: Image, badge: null },
  { id: 478, category: 'desain', name: 'Desain Tipografi Brand', price: '50k–200k', icon: Star, badge: null },
  { id: 479, category: 'desain', name: 'Desain Stationery Kit', price: '150k–750k', icon: Image, badge: null },
  { id: 480, category: 'desain', name: 'Desain Kop Surat', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 481, category: 'desain', name: 'Desain Invoice Brand', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 482, category: 'desain', name: 'Desain Kwitansi Brand', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 483, category: 'desain', name: 'Desain Form Order', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 484, category: 'desain', name: 'Desain Template Surat Bisnis', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 485, category: 'desain', name: 'Desain Proposal Bisnis Visual', price: '150k–750k', icon: Presentation, badge: null },
  { id: 486, category: 'desain', name: 'Desain Company Profile Visual', price: '200k–1.000k', icon: Presentation, badge: null },
  { id: 487, category: 'desain', name: 'Desain Pitch Deck Startup', price: '250k–1.500k', icon: Presentation, badge: null },
  { id: 488, category: 'desain', name: 'Desain Media Kit', price: '150k–750k', icon: FileSpreadsheet, badge: null },
  { id: 489, category: 'desain', name: 'Desain Rate Card Influencer', price: '50k–250k', icon: FileSpreadsheet, badge: null },
  { id: 490, category: 'desain', name: 'Desain Rate Card Jasa', price: '50k–250k', icon: FileSpreadsheet, badge: null },
  { id: 491, category: 'desain', name: 'Desain Portofolio Bisnis', price: '100k–500k', icon: FileSpreadsheet, badge: null },
  { id: 492, category: 'desain', name: 'Desain Profil UMKM', price: '100k–500k', icon: FileSpreadsheet, badge: null },
  { id: 493, category: 'desain', name: 'Desain Template Branding Produk', price: '100k–500k', icon: Star, badge: null },
  // ─── Desain Marketplace & E-Commerce ───
  { id: 494, category: 'desain', name: 'Desain Cover Toko Shopee', price: '50k–250k', icon: Globe, badge: null },
  { id: 495, category: 'desain', name: 'Desain Cover Toko Tokopedia', price: '50k–250k', icon: Globe, badge: null },
  { id: 496, category: 'desain', name: 'Desain Cover Toko TikTok Shop', price: '50k–250k', icon: Globe, badge: null },
  { id: 497, category: 'desain', name: 'Desain Dekorasi Toko Marketplace', price: '100k–500k', icon: Globe, badge: null },
  { id: 498, category: 'desain', name: 'Desain Etalase Produk', price: '50k–250k', icon: Image, badge: null },
  { id: 499, category: 'desain', name: 'Desain Foto Produk Marketplace', price: '25k–150k/foto', icon: Image, badge: null },
  { id: 500, category: 'desain', name: 'Desain Frame Foto Produk', price: '25k–100k', icon: Image, badge: null },
  { id: 501, category: 'desain', name: 'Desain Template Promo Marketplace', price: '30k–150k', icon: Image, badge: null },
  { id: 502, category: 'desain', name: 'Desain Voucher Marketplace', price: '25k–100k', icon: Image, badge: null },
  { id: 503, category: 'desain', name: 'Desain Flash Sale Marketplace', price: '30k–150k', icon: Image, badge: null },
  { id: 504, category: 'desain', name: 'Desain Produk Best Seller Badge', price: '20k–75k', icon: Star, badge: null },
  { id: 505, category: 'desain', name: 'Desain Produk New Arrival Badge', price: '20k–75k', icon: Star, badge: null },
  { id: 506, category: 'desain', name: 'Desain Template Review Produk', price: '20k–75k', icon: Image, badge: null },
  { id: 507, category: 'desain', name: 'Desain Panduan Ukuran Produk', price: '30k–150k', icon: FileSpreadsheet, badge: null },
  { id: 508, category: 'desain', name: 'Desain Cara Order Produk', price: '30k–150k', icon: Image, badge: null },
  { id: 509, category: 'desain', name: 'Desain Alur Pemesanan', price: '30k–150k', icon: Route, badge: null },
  { id: 510, category: 'desain', name: 'Desain Kartu Terima Kasih', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 511, category: 'desain', name: 'Desain Kartu Garansi Produk', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 512, category: 'desain', name: 'Desain Kartu Perawatan Produk', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 513, category: 'desain', name: 'Desain Insert Card Paket', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  // ─── Desain Event & Kepanitiaan ───
  { id: 514, category: 'desain', name: 'Desain Virtual Background Seminar', price: '30k–150k', icon: Image, badge: null },
  { id: 515, category: 'desain', name: 'Desain ID Card Event', price: '25k–150k', icon: Image, badge: null },
  { id: 516, category: 'desain', name: 'Desain Kartu Peserta', price: '20k–100k', icon: Image, badge: null },
  { id: 517, category: 'desain', name: 'Desain Tiket Acara', price: '30k–150k', icon: FileSpreadsheet, badge: null },
  { id: 518, category: 'desain', name: 'Desain Kupon Acara', price: '20k–75k', icon: FileSpreadsheet, badge: null },
  { id: 519, category: 'desain', name: 'Desain Wristband Event', price: '30k–150k', icon: Image, badge: null },
  { id: 520, category: 'desain', name: 'Desain Layout Booth', price: '100k–500k', icon: Image, badge: null },
  { id: 521, category: 'desain', name: 'Desain Denah Acara', price: '50k–250k', icon: FileSpreadsheet, badge: null },
  { id: 522, category: 'desain', name: 'Desain Signage Acara', price: '50k–250k', icon: Image, badge: null },
  { id: 523, category: 'desain', name: 'Desain Papan Informasi', price: '50k–250k', icon: Image, badge: null },
  { id: 524, category: 'desain', name: 'Desain Doorprize Card', price: '20k–75k', icon: FileSpreadsheet, badge: null },
  { id: 525, category: 'desain', name: 'Desain Template Rundown Panchunta', price: '30k–150k', icon: FileSpreadsheet, badge: null },
  { id: 526, category: 'desain', name: 'Desain Template Absensi Acara', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 527, category: 'desain', name: 'Desain Template Evaluasi Acara', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 528, category: 'desain', name: 'Desain E-Ticket', price: '30k–150k', icon: FileSpreadsheet, badge: null },
  { id: 529, category: 'desain', name: 'Desain QR Check-In Event', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  { id: 530, category: 'desain', name: 'Desain Thank You Card Event', price: '25k–100k', icon: FileSpreadsheet, badge: null },
  // ─── Desain Karier & Personal Branding ───
  { id: 531, category: 'desain', name: 'Desain CV Kreatif', price: '50k–250k', icon: FileSpreadsheet, badge: null },
  { id: 532, category: 'desain', name: 'Desain CV ATS Visual', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 533, category: 'desain', name: 'Desain Resume Profesional', price: '50k–250k', icon: FileSpreadsheet, badge: null },
  { id: 534, category: 'desain', name: 'Desain Portofolio Freelancer', price: '100k–500k', icon: FileSpreadsheet, badge: null },
  { id: 535, category: 'desain', name: 'Desain Personal Profile', price: '50k–250k', icon: Star, badge: null },
  { id: 536, category: 'desain', name: 'Desain Personal Branding Kit', price: '150k–750k', icon: Star, badge: null },
  { id: 537, category: 'desain', name: 'Desain Cover Letter Visual', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 538, category: 'desain', name: 'Desain Profil LinkedIn Banner', price: '50k–200k', icon: Globe, badge: null },
  { id: 539, category: 'desain', name: 'Desain Media Kit Personal', price: '150k–750k', icon: FileSpreadsheet, badge: null },
  { id: 540, category: 'desain', name: 'Desain Rate Card Freelancer', price: '50k–250k', icon: FileSpreadsheet, badge: null },
  { id: 541, category: 'desain', name: 'Desain Proposal Kerja Sama Personal', price: '100k–500k', icon: FileSpreadsheet, badge: null },
  { id: 542, category: 'desain', name: 'Desain One Page Profile', price: '75k–300k', icon: FileSpreadsheet, badge: null },
  { id: 543, category: 'desain', name: 'Desain Biodata Profesional', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 544, category: 'desain', name: 'Desain Portofolio Magang', price: '75k–300k', icon: FileSpreadsheet, badge: null },
  { id: 387, category: 'digital', name: 'Upload Produk Marketplace', price: '3k–15k/produk', icon: Globe, badge: null },
  // ─── Laporan Akademik ───
  { id: 388, category: 'laporan-akademik', name: 'Proposal Penelitian', price: '150k–500k', icon: FileSpreadsheet, badge: null },
  { id: 389, category: 'laporan-akademik', name: 'Proposal Kegiatan Kampus', price: '75k–250k', icon: FileSpreadsheet, badge: null },
  { id: 390, category: 'laporan-akademik', name: 'Proposal PKM', price: '150k–500k', icon: FileSpreadsheet, badge: null },
  { id: 391, category: 'laporan-akademik', name: 'Proposal Magang', price: '75k–250k', icon: FileSpreadsheet, badge: null },
  { id: 392, category: 'laporan-akademik', name: 'Proposal KKN', price: '75k–250k', icon: FileSpreadsheet, badge: null },
  { id: 393, category: 'laporan-akademik', name: 'Proposal Bisnis Mahasiswa', price: '150k–500k', icon: FileSpreadsheet, badge: null },
  { id: 394, category: 'laporan-akademik', name: 'Laporan Magang', price: '150k–500k', icon: FileSpreadsheet, badge: null },
  { id: 395, category: 'laporan-akademik', name: 'Laporan KKN', price: '150k–500k', icon: FileSpreadsheet, badge: null },
  { id: 396, category: 'laporan-akademik', name: 'Laporan PKL Kuliah', price: '150k–500k', icon: FileSpreadsheet, badge: null },
  { id: 397, category: 'laporan-akademik', name: 'Laporan Observasi', price: '75k–250k', icon: FileSpreadsheet, badge: null },
  { id: 398, category: 'laporan-akademik', name: 'Laporan Studi Kasus', price: '100k–350k', icon: FileSpreadsheet, badge: null },
  { id: 399, category: 'laporan-akademik', name: 'Laporan Field Trip', price: '75k–250k', icon: FileSpreadsheet, badge: null },
  { id: 400, category: 'laporan-akademik', name: 'Laporan Kunjungan Industri', price: '75k–250k', icon: FileSpreadsheet, badge: null },
  { id: 401, category: 'laporan-akademik', name: 'Laporan Mini Riset', price: '100k–350k', icon: FileSpreadsheet, badge: null },
  { id: 402, category: 'laporan-akademik', name: 'Laporan Hasil Wawancara', price: '75k–250k', icon: FileSpreadsheet, badge: null },
  { id: 403, category: 'laporan-akademik', name: 'Laporan Pengabdian Masyarakat', price: '150k–500k', icon: FileSpreadsheet, badge: null },
  { id: 404, category: 'laporan-akademik', name: 'Laporan Kegiatan Organisasi', price: '75k–250k', icon: FileSpreadsheet, badge: null },
  { id: 405, category: 'laporan-akademik', name: 'Logbook Magang', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 406, category: 'laporan-akademik', name: 'Logbook KKN', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 407, category: 'laporan-akademik', name: 'Portofolio Kuliah', price: '75k–300k', icon: FileSpreadsheet, badge: null },
  { id: 408, category: 'laporan-akademik', name: 'Tugas Case Study', price: '75k–300k', icon: FileSpreadsheet, badge: null },
  { id: 409, category: 'laporan-akademik', name: 'Tugas Critical Thinking', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 410, category: 'laporan-akademik', name: 'Tugas Analisis Film', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 411, category: 'laporan-akademik', name: 'Tugas Analisis Buku', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 412, category: 'laporan-akademik', name: 'Tugas Analisis Berita', price: '50k–200k', icon: FileSpreadsheet, badge: null },
  { id: 413, category: 'laporan-akademik', name: 'Tugas Analisis Kebijakan', price: '100k–350k', icon: FileSpreadsheet, badge: null },
  { id: 414, category: 'laporan-akademik', name: 'Tugas Studi Literatur', price: '100k–350k', icon: FileSpreadsheet, badge: null },
  { id: 415, category: 'laporan-akademik', name: 'Tugas Annotated Bibliography', price: '75k–250k', icon: FileSpreadsheet, badge: null },
  { id: 416, category: 'laporan-akademik', name: 'Tugas Opini Akademik', price: '40k–150k', icon: FileSpreadsheet, badge: null },
  { id: 417, category: 'laporan-akademik', name: 'Tugas Refleksi Perkuliahan', price: '40k–150k', icon: FileSpreadsheet, badge: null },
  { id: 480, category: 'uiux', name: 'UI Design Landing Page', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 481, category: 'uiux', name: 'UI Design Website Company Profile', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 482, category: 'uiux', name: 'UI Design Website Portfolio', price: 'Start 250k', icon: MonitorCheck, badge: null },
  // ─── UX Research & Analysis ───
  { id: 483, category: 'uiux', name: 'UX Research Basic', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 484, category: 'uiux', name: 'Riset Target User', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 485, category: 'uiux', name: 'Analisis Kompetitor Aplikasi', price: 'Start 200k', icon: MonitorCheck, badge: null },
  { id: 486, category: 'uiux', name: 'Analisis Kompetitor Website', price: 'Start 200k', icon: MonitorCheck, badge: null },
  { id: 487, category: 'uiux', name: 'User Persona', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 488, category: 'uiux', name: 'Customer Journey Map', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 489, category: 'uiux', name: 'User Flow', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 490, category: 'uiux', name: 'Task Flow', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 491, category: 'uiux', name: 'Information Architecture', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 492, category: 'uiux', name: 'Sitemap Website / Aplikasi', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 493, category: 'uiux', name: 'Problem Statement UX', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 494, category: 'uiux', name: 'UX Strategy Sederhana', price: 'Start 250k', icon: MonitorCheck, badge: null },
  // ─── UI Design Website ───
  { id: 495, category: 'uiux', name: 'UI Design Website Personal Branding', price: 'Start 250k', icon: MonitorCheck, badge: null },
  { id: 496, category: 'uiux', name: 'UI Design Website UMKM', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 497, category: 'uiux', name: 'UI Design Website Sekolah / Kampus', price: 'Start 400k', icon: MonitorCheck, badge: null },
  { id: 498, category: 'uiux', name: 'UI Design Website Event', price: 'Start 250k', icon: MonitorCheck, badge: null },
  { id: 499, category: 'uiux', name: 'UI Design Website Blog / News', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 500, category: 'uiux', name: 'UI Design Website Marketplace', price: 'Start 700k', icon: MonitorCheck, badge: null },
  { id: 501, category: 'uiux', name: 'UI Design Website E-Commerce', price: 'Start 700k', icon: MonitorCheck, badge: null },
  { id: 502, category: 'uiux', name: 'UI Design Website SaaS', price: 'Start 800k', icon: MonitorCheck, badge: null },
  { id: 503, category: 'uiux', name: 'UI Design Website Membership', price: 'Start 500k', icon: MonitorCheck, badge: null },
  // ─── UI Design Mobile App ───
  { id: 504, category: 'uiux', name: 'UI Design Mobile App Basic', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 505, category: 'uiux', name: 'UI Design Android App', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 506, category: 'uiux', name: 'UI Design iOS App', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 507, category: 'uiux', name: 'UI Design Aplikasi Edukasi', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 508, category: 'uiux', name: 'UI Design Aplikasi Booking', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 509, category: 'uiux', name: 'UI Design Aplikasi Marketplace', price: 'Start 700k', icon: MonitorCheck, badge: null },
  { id: 510, category: 'uiux', name: 'UI Design Aplikasi Finance', price: 'Start 700k', icon: MonitorCheck, badge: null },
  { id: 511, category: 'uiux', name: 'UI Design Aplikasi Kesehatan', price: 'Start 600k', icon: MonitorCheck, badge: null },
  { id: 512, category: 'uiux', name: 'UI Design Aplikasi Food Delivery', price: 'Start 700k', icon: MonitorCheck, badge: null },
  { id: 513, category: 'uiux', name: 'UI Design Aplikasi Chat / Komunitas', price: 'Start 600k', icon: MonitorCheck, badge: null },
  { id: 514, category: 'uiux', name: 'UI Design Aplikasi Absensi', price: 'Start 400k', icon: MonitorCheck, badge: null },
  { id: 515, category: 'uiux', name: 'UI Design Aplikasi Kasir / POS', price: 'Start 700k', icon: MonitorCheck, badge: null },
  // ─── UI Design Component Page ───
  { id: 516, category: 'uiux', name: 'Desain Login Page', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 517, category: 'uiux', name: 'Desain Register Page', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 518, category: 'uiux', name: 'Desain Forgot Password Page', price: 'Start 75k', icon: MonitorCheck, badge: null },
  { id: 519, category: 'uiux', name: 'Desain Home Page', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 520, category: 'uiux', name: 'Desain Profile Page', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 521, category: 'uiux', name: 'Desain Setting Page', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 522, category: 'uiux', name: 'Desain Search Page', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 523, category: 'uiux', name: 'Desain Product Detail Page', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 524, category: 'uiux', name: 'Desain Cart Page', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 525, category: 'uiux', name: 'Desain Checkout Page', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 526, category: 'uiux', name: 'Desain Payment Page', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 527, category: 'uiux', name: 'Desain Order Tracking Page', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 528, category: 'uiux', name: 'Desain Notification Page', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 529, category: 'uiux', name: 'Desain Dashboard Page', price: 'Start 200k', icon: MonitorCheck, badge: null },
  { id: 530, category: 'uiux', name: 'Desain Report Page', price: 'Start 200k', icon: MonitorCheck, badge: null },
  { id: 531, category: 'uiux', name: 'Desain Form Page', price: 'Start 100k', icon: MonitorCheck, badge: null },
  // ─── UI Redesign ───
  { id: 532, category: 'uiux', name: 'Redesign Landing Page', price: 'Start 200k', icon: MonitorCheck, badge: null },
  { id: 533, category: 'uiux', name: 'Redesign Website Lama', price: 'Start 400k', icon: MonitorCheck, badge: null },
  { id: 534, category: 'uiux', name: 'Redesign Mobile App', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 535, category: 'uiux', name: 'Redesign Dashboard', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 536, category: 'uiux', name: 'Redesign Halaman Login', price: 'Start 100k', icon: MonitorCheck, badge: null },
  { id: 537, category: 'uiux', name: 'Redesign Halaman Checkout', price: 'Start 200k', icon: MonitorCheck, badge: null },
  { id: 538, category: 'uiux', name: 'Redesign Halaman Produk', price: 'Start 200k', icon: MonitorCheck, badge: null },
  { id: 539, category: 'uiux', name: 'Redesign UI agar Lebih Modern', price: 'Start 250k', icon: MonitorCheck, badge: null },
  { id: 540, category: 'uiux', name: 'Redesign UI agar Mobile Friendly', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 541, category: 'uiux', name: 'Redesign UI Figma dari Screenshot', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 542, category: 'uiux', name: 'Redesign UI dari Referensi', price: 'Start 150k', icon: MonitorCheck, badge: null },
  { id: 543, category: 'uiux', name: 'Redesign UI dari Website Kompetitor', price: 'Start 300k', icon: MonitorCheck, badge: null },
  // ─── Paket UI/UX ───
  { id: 544, category: 'uiux', name: 'Paket Landing Page Basic', price: 'Start 300k', icon: MonitorCheck, badge: null },
  { id: 545, category: 'uiux', name: 'Paket Website Company Profile', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 546, category: 'uiux', name: 'Paket Mobile App 5 Page', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 547, category: 'uiux', name: 'Paket Mobile App 10 Page', price: 'Start 900k', icon: MonitorCheck, badge: null },
  { id: 548, category: 'uiux', name: 'Paket Dashboard Admin Basic', price: 'Start 700k', icon: MonitorCheck, badge: null },
  { id: 549, category: 'uiux', name: 'Paket E-Commerce Basic', price: 'Start 1.000k', icon: MonitorCheck, badge: null },
  { id: 550, category: 'uiux', name: 'Paket Prototype Figma', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 551, category: 'uiux', name: 'Paket Redesign Website', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 552, category: 'uiux', name: 'Paket UX Audit + Report', price: 'Start 500k', icon: MonitorCheck, badge: null },
  { id: 553, category: 'uiux', name: 'Paket Design System Basic', price: 'Start 750k', icon: MonitorCheck, badge: null },
  // ─── Pembuatan Website ───
  { id: 601, category: 'pembuatan-website', name: 'Landing Page / Portofolio', price: 'Rp 450.000', icon: Code, badge: 'Popular' },
  { id: 602, category: 'pembuatan-website', name: 'Website Company Profile', price: 'Rp 950.000', icon: Globe, badge: 'Exclusive' },
  { id: 603, category: 'pembuatan-website', name: 'Website E-Commerce / Toko Online', price: 'Rp 1.500.000', icon: Database, badge: 'Premium' },
  { id: 604, category: 'pembuatan-website', name: 'Web Application Custom', price: 'Chat Admin', icon: Monitor, badge: 'Enterprise' },
  { id: 605, category: 'pembuatan-website', name: 'Sistem Informasi Akademik / Kantor', price: 'Chat Admin', icon: FileSpreadsheet, badge: 'Custom' },
];

const getDisplayBadge = (service: any): string | null => {
  let badgeText = '';
  
  if (service.badge) {
    badgeText = service.badge;
  } else {
    const nameLower = service.name.toLowerCase();
    
    if (service.category === 'turnitin') {
      if (nameLower.includes('ai')) {
        badgeText = 'ZEROGPT';
      } else {
        badgeText = 'TURNITIN';
      }
    } else if (service.category === 'parafrase') {
      badgeText = 'PARAFRASE';
    } else if (service.category === 'laporan-akademik') {
      if (nameLower.includes('proposal')) {
        badgeText = 'PROPOSAL';
      } else if (nameLower.includes('logbook')) {
        badgeText = 'LOGBOOK';
      } else if (nameLower.includes('tugas')) {
        badgeText = 'TUGAS KULIAH';
      } else {
        badgeText = 'LAPORAN';
      }
    } else if (service.category === 'joki-skripsi') {
      if (nameLower.includes('sempro')) {
        badgeText = 'SEMPRO';
      } else if (nameLower.includes('bab')) {
        badgeText = 'BAB SKRIPSI';
      } else if (nameLower.includes('referensi')) {
        badgeText = 'REFERENSI';
      } else if (nameLower.includes('kuesioner')) {
        badgeText = 'KUESIONER';
      } else if (nameLower.includes('wawancara')) {
        badgeText = 'WAWANCARA';
      } else if (nameLower.includes('instrumen') || nameLower.includes('kisi-kisi')) {
        badgeText = 'INSTRUMEN';
      } else {
        badgeText = 'SKRIPSI';
      }
    } else if (service.category === 'unlock') {
      badgeText = service.name.replace(/unlock\s+/i, '').trim();
    } else if (service.category === 'tugas-sekolah') {
      if (nameLower.includes('soal') || nameLower.includes('pembahasan')) {
        badgeText = 'SOAL SEKOLAH';
      } else if (nameLower.includes('laporan')) {
        badgeText = 'LAPORAN SEKOLAH';
      } else if (nameLower.includes('proposal')) {
        badgeText = 'PROPOSAL SEKOLAH';
      } else if (nameLower.includes('catatan') || nameLower.includes('materi') || nameLower.includes('ringkasan') || nameLower.includes('mind map')) {
        badgeText = 'CATATAN SEKOLAH';
      } else if (nameLower.includes('teks') || nameLower.includes('pidato') || nameLower.includes('mc') || nameLower.includes('debat') || nameLower.includes('drama') || nameLower.includes('naskah') || nameLower.includes('script')) {
        badgeText = 'TEKS SEKOLAH';
      } else if (nameLower.includes('bahasa')) {
        badgeText = 'BAHASA';
      } else if (nameLower.includes('matematika') || nameLower.includes('mtk') || nameLower.includes('ekonomi') || nameLower.includes('akuntansi')) {
        badgeText = 'MATEMATIKA & EKONOMI';
      } else if (nameLower.includes('fisika') || nameLower.includes('kimia') || nameLower.includes('biologi')) {
        badgeText = 'SAINS';
      } else if (nameLower.includes('sejarah') || nameLower.includes('geografi') || nameLower.includes('pkn') || nameLower.includes('agama')) {
        badgeText = 'SOSIAL & AGAMA';
      } else if (nameLower.includes('multimedia') || nameLower.includes('desain') || nameLower.includes('rpl') || nameLower.includes('tkj')) {
        badgeText = 'TEKNOLOGI & MULTIMEDIA';
      } else if (nameLower.includes('smk')) {
        badgeText = 'KEJURUAN SMK';
      } else {
        badgeText = 'SEKOLAH';
      }
    } else if (service.category === 'joki-tugas') {
      if (nameLower.includes('translate')) {
        badgeText = 'TRANSLATE';
      } else if (nameLower.includes('pustaka') || nameLower.includes('mendeley')) {
        badgeText = 'REFERENSI';
      } else if (nameLower.includes('ppt')) {
        badgeText = 'PRESENTASI';
      } else if (nameLower.includes('isi otomatis') || nameLower.includes('halaman') || nameLower.includes('ketik') || nameLower.includes('resume') || nameLower.includes('rangkuman')) {
        badgeText = 'DOKUMEN';
      } else if (nameLower.includes('makalah')) {
        badgeText = 'MAKALAH';
      } else if (nameLower.includes('artikel')) {
        badgeText = 'ARTIKEL';
      } else if (nameLower.includes('jurnal')) {
        badgeText = 'JURNAL';
      } else if (nameLower.includes('essay') || nameLower.includes('esai')) {
        badgeText = 'ESSAY';
      } else if (nameLower.includes('coding') || nameLower.includes('informatika') || nameLower.includes('colab')) {
        badgeText = 'CODING';
      } else if (nameLower.includes('laporan')) {
        badgeText = 'LAPORAN TUGAS';
      } else if (nameLower.includes('kuesioner') || nameLower.includes('instrumen') || nameLower.includes('wawancara') || nameLower.includes('observasi') || nameLower.includes('sampling') || nameLower.includes('metode') || nameLower.includes('hipotesis') || nameLower.includes('variabel') || nameLower.includes('gap') || nameLower.includes('roadmap') || nameLower.includes('novelty') || nameLower.includes('rumusan') || nameLower.includes('tujuan') || nameLower.includes('manfaat') || nameLower.includes('kerangka')) {
        badgeText = 'METODOLOGI';
      } else if (nameLower.includes('akuntansi') || nameLower.includes('keuangan') || nameLower.includes('audit') || nameLower.includes('pajak')) {
        badgeText = 'AKUNTANSI & KEUANGAN';
      } else if (nameLower.includes('manajemen') || nameLower.includes('pemasaran') || nameLower.includes('ekonomi')) {
        badgeText = 'BISNIS & MANAJEMEN';
      } else if (nameLower.includes('komunikasi') || nameLower.includes('public relations') || nameLower.includes('broadcasting') || nameLower.includes('pariwisata') || nameLower.includes('perhotelan')) {
        badgeText = 'KOMUNIKASI & SOSIAL';
      } else if (nameLower.includes('teknik') || nameLower.includes('arsitektur') || nameLower.includes('dkv') || nameLower.includes('desain')) {
        badgeText = 'TEKNIK & DESAIN';
      } else if (nameLower.includes('keperawatan') || nameLower.includes('kebidanan') || nameLower.includes('farmasi') || nameLower.includes('gizi') || nameLower.includes('kesehatan')) {
        badgeText = 'KESEHATAN & FARMASI';
      } else if (nameLower.includes('agribisnis') || nameLower.includes('peternakan') || nameLower.includes('perikanan') || nameLower.includes('kehutanan')) {
        badgeText = 'PERTANIAN & ALAM';
      } else {
        badgeText = 'JOKI TUGAS';
      }
    } else if (service.category === 'umum') {
      if (nameLower.includes('entry') || nameLower.includes('input') || nameLower.includes('database') || nameLower.includes('rekap') || nameLower.includes('monitoring') || nameLower.includes('inventory')) {
        badgeText = 'DATA ENTRY';
      } else if (nameLower.includes('invoice') || nameLower.includes('kwitansi') || nameLower.includes('surat jalan') || nameLower.includes('kas masuk')) {
        badgeText = 'DOKUMEN KEUANGAN';
      } else if (nameLower.includes('absensi') || nameLower.includes('laporan harian') || nameLower.includes('laporan mingguan') || nameLower.includes('laporan bulanan')) {
        badgeText = 'LAPORAN KANTOR';
      } else if (nameLower.includes('form') || nameLower.includes('survey')) {
        badgeText = 'SURVEY & FORM';
      } else if (nameLower.includes('meeting') || nameLower.includes('notulen') || nameLower.includes('minutes of meeting') || nameLower.includes('rundown')) {
        badgeText = 'MEETING & ACARA';
      } else if (nameLower.includes('sop') || nameLower.includes('job description') || nameLower.includes('kpi') || nameLower.includes('organisasi') || nameLower.includes('checklist')) {
        badgeText = 'SOP & ORGANISASI';
      } else if (nameLower.includes('proposal bisnis') || nameLower.includes('company profile') || nameLower.includes('pitch deck') || nameLower.includes('bmc') || nameLower.includes('business model')) {
        badgeText = 'PROPOSAL BISNIS';
      } else if (nameLower.includes('swot') || nameLower.includes('kompetitor') || nameLower.includes('pasar') || nameLower.includes('riset') || nameLower.includes('produk')) {
        badgeText = 'RISET PASAR';
      } else if (nameLower.includes('hpp') || nameLower.includes('bep') || nameLower.includes('profit') || nameLower.includes('keuangan') || nameLower.includes('pembukuan umkm')) {
        badgeText = 'ANALISIS KEUANGAN';
      } else if (nameLower.includes('brand') || nameLower.includes('slogan') || nameLower.includes('branding')) {
        badgeText = 'BRANDING';
      } else if (nameLower.includes('linkedin') || nameLower.includes('cv') || nameLower.includes('resume') || nameLower.includes('portofolio') || nameLower.includes('personal branding') || nameLower.includes('resign') || nameLower.includes('interview')) {
        badgeText = 'KARIR & PERSONAL';
      } else if (nameLower.includes('surat')) {
        badgeText = 'SURAT MENURAT';
      } else if (nameLower.includes('email')) {
        badgeText = 'EMAIL PROFESIONAL';
      } else {
        badgeText = 'UMUM';
      }
    } else if (service.category === 'medsos') {
      if (nameLower.includes('caption instagram') || nameLower.includes('caption tiktok') || nameLower.includes('caption marketplace') || nameLower.includes('bio instagram')) {
        badgeText = 'SOSMED';
      } else if (nameLower.includes('copywriting')) {
        badgeText = 'COPYWRITING';
      } else if (nameLower.includes('script tiktok') || nameLower.includes('script reels') || nameLower.includes('script youtube') || nameLower.includes('script voice over')) {
        badgeText = 'SCRIPTWRITING';
      } else if (nameLower.includes('ide konten') || nameLower.includes('kalender konten') || nameLower.includes('content plan')) {
        badgeText = 'CONTENT PLANNING';
      } else if (nameLower.includes('artikel blog') || nameLower.includes('artikel seo')) {
        badgeText = 'ARTIKEL';
      } else if (nameLower.includes('youtube') || nameLower.includes('hashtag') || nameLower.includes('viral')) {
        badgeText = 'YOUTUBE & SEO';
      } else if (nameLower.includes('chat') || nameLower.includes('admin') || nameLower.includes('broadcast') || nameLower.includes('promo') || nameLower.includes('testimoni')) {
        badgeText = 'ADMIN & BROADCAST';
      } else {
        badgeText = 'SOSMED';
      }
    } else if (service.category === 'desain') {
      if (nameLower.includes('logo')) {
        badgeText = 'DESAIN LOGO';
      } else if (nameLower.includes('banner') || nameLower.includes('flyer') || nameLower.includes('pamflet') || nameLower.includes('brosur') || nameLower.includes('spanduk') || nameLower.includes('twibbon')) {
        badgeText = 'DESAIN PROMOSI';
      } else if (nameLower.includes('menu')) {
        badgeText = 'DESAIN MENU';
      } else if (nameLower.includes('poster')) {
        badgeText = 'DESAIN POSTER';
      } else if (nameLower.includes('jadwal piket') || nameLower.includes('struktur kelas') || nameLower.includes('sertifikat kelas') || nameLower.includes('brosur sekolah') || nameLower.includes('feed osis') || nameLower.includes('story instagram sekolah') || nameLower.includes('sampul kliping') || nameLower.includes('lembar catatan estetik') || nameLower.includes('template catatan sekolah') || nameLower.includes('undangan acara sekolah')) {
        badgeText = 'DESAIN SEKOLAH';
      } else if (nameLower.includes('sertifikat')) {
        badgeText = 'DESAIN SERTIFIKAT';
      } else if (nameLower.includes('undangan')) {
        badgeText = 'DESAIN UNDANGAN';
      } else if (nameLower.includes('kartu nama')) {
        badgeText = 'DESAIN KARTU NAMA';
      } else if (nameLower.includes('stiker') || nameLower.includes('label') || nameLower.includes('kemasan') || nameLower.includes('packaging')) {
        badgeText = 'DESAIN KEMASAN';
      } else if (nameLower.includes('feed instagram') || nameLower.includes('story instagram') || nameLower.includes('carousel') || nameLower.includes('highlight') || nameLower.includes('cover highlight') || nameLower.includes('reels cover') || nameLower.includes('tiktok cover') || nameLower.includes('header') || nameLower.includes('cover toko shopee') || nameLower.includes('cover toko tokopedia') || nameLower.includes('cover toko tiktok shop') || nameLower.includes('dekorasi toko') || nameLower.includes('etalase') || nameLower.includes('frame foto') || nameLower.includes('voucher') || nameLower.includes('shopee') || nameLower.includes('tokopedia')) {
        badgeText = 'DESAIN SOSMED';
      } else if (nameLower.includes('thumbnail')) {
        badgeText = 'DESAIN THUMBNAIL';
      } else if (nameLower.includes('cover ebook') || nameLower.includes('cover proposal') || nameLower.includes('cover skripsi') || nameLower.includes('cover makalah') || nameLower.includes('cover laporan')) {
        badgeText = 'DESAIN COVER';
      } else if (nameLower.includes('pdf') || nameLower.includes('gabung') || nameLower.includes('pisah') || nameLower.includes('kompres') || nameLower.includes('watermark') || nameLower.includes('convert') || nameLower.includes('layout')) {
        badgeText = 'EDIT DOKUMEN & PDF';
      } else if (nameLower.includes('kop surat') || nameLower.includes('invoice') || nameLower.includes('kwitansi') || nameLower.includes('form') || nameLower.includes('barcode') || nameLower.includes('qr code') || nameLower.includes('label nama') || nameLower.includes('nomor antrian') || nameLower.includes('kartu member') || nameLower.includes('name tag') || nameLower.includes('thank you card') || nameLower.includes('kartu garansi') || nameLower.includes('kartu perawatan') || nameLower.includes('insert card')) {
        badgeText = 'DESAIN STATIONERY';
      } else if (nameLower.includes('event') || nameLower.includes('rundown') || nameLower.includes('acara') || nameLower.includes('mc') || nameLower.includes('sambutan') || nameLower.includes('moderator') || nameLower.includes('tor') || nameLower.includes('timeline') || nameLower.includes('jobdesk') || nameLower.includes('registrasi') || nameLower.includes('zoom') || nameLower.includes('tiket') || nameLower.includes('kupon') || nameLower.includes('wristband') || nameLower.includes('booth') || nameLower.includes('denah') || nameLower.includes('signage') || nameLower.includes('informasi') || nameLower.includes('lpj')) {
        badgeText = 'DESAIN EVENT';
      } else if (nameLower.includes('layout makala') || nameLower.includes('layout proposal') || nameLower.includes('layout laporan') || nameLower.includes('modul sekolah') || nameLower.includes('infografis') || nameLower.includes('mind map') || nameLower.includes('timeline') || nameLower.includes('jadwal') || nameLower.includes('flashcard') || nameLower.includes('catatan')) {
        badgeText = 'DESAIN DOKUMEN';
      } else if (nameLower.includes('brand guideline') || nameLower.includes('brand board') || nameLower.includes('moodboard') || nameLower.includes('palet warna') || nameLower.includes('tipografi') || nameLower.includes('stationery') || nameLower.includes('rate card') || nameLower.includes('portofolio') || nameLower.includes('profil umkm') || nameLower.includes('branding')) {
        badgeText = 'DESAIN BRANDING';
      } else if (nameLower.includes('cv') || nameLower.includes('resume') || nameLower.includes('cover letter') || nameLower.includes('portfolio') || nameLower.includes('personal profile') || nameLower.includes('biodata')) {
        badgeText = 'DESAIN CV & PORTFOLIO';
      } else {
        badgeText = 'DESAIN GRAFIS';
      }
    } else if (service.category === 'digital') {
      if (nameLower.includes('upload')) {
        badgeText = 'MARKETPLACE';
      } else {
        badgeText = 'DIGITAL';
      }
    } else if (service.category === 'uiux') {
      if (nameLower.includes('research') || nameLower.includes('riset') || nameLower.includes('analisis kompetitor') || nameLower.includes('persona') || nameLower.includes('journey map') || nameLower.includes('flow') || nameLower.includes('architecture') || nameLower.includes('sitemap') || nameLower.includes('problem statement') || nameLower.includes('strategy') || nameLower.includes('ux audit')) {
        badgeText = 'UX RESEARCH';
      } else if (nameLower.includes('website landing') || nameLower.includes('ui design website landing') || nameLower.includes('landing page')) {
        badgeText = 'UI LANDING PAGE';
      } else if (nameLower.includes('website') || nameLower.includes('web') || nameLower.includes('saas') || nameLower.includes('membership')) {
        badgeText = 'UI WEB DESIGN';
      } else if (nameLower.includes('mobile') || nameLower.includes('android') || nameLower.includes('ios') || nameLower.includes('aplikasi')) {
        badgeText = 'UI MOBILE DESIGN';
      } else if (nameLower.includes('page') || nameLower.includes('login') || nameLower.includes('register') || nameLower.includes('password') || nameLower.includes('home') || nameLower.includes('profile') || nameLower.includes('setting') || nameLower.includes('search') || nameLower.includes('detail') || nameLower.includes('cart') || nameLower.includes('checkout') || nameLower.includes('payment') || nameLower.includes('tracking') || nameLower.includes('notification') || nameLower.includes('dashboard') || nameLower.includes('report') || nameLower.includes('form')) {
        badgeText = 'UI PAGE DESIGN';
      } else if (nameLower.includes('redesign')) {
        badgeText = 'UI/UX REDESIGN';
      } else if (nameLower.includes('prototype')) {
        badgeText = 'FIGMA PROTOTYPE';
      } else if (nameLower.includes('design system')) {
        badgeText = 'DESIGN SYSTEM';
      } else {
        badgeText = 'UI/UX DESIGN';
      }
    } else {
      badgeText = service.category;
    }
  }

  return badgeText.toUpperCase();
};

const ITEMS_PER_PAGE = 16;

function calculateDiscountedPrice(price: string): string {
  if (price === 'Chat Admin') return 'Chat Admin';
  return price.replace(/(\d+(?:\.\d+)?)(k)?/g, (match, numStr, k) => {
    const hasDot = numStr.includes('.');
    const cleanNumStr = numStr.replace(/\./g, '');
    const num = parseFloat(cleanNumStr);
    const discounted = Math.round(num * 0.95);
    if (hasDot) {
      return discounted.toLocaleString('id-ID') + (k || '');
    }
    return discounted + (k || '');
  });
}

export default function LayananPage() {
  const { user } = useAuth();
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
      <section className="bg-gradient-to-br from-dark-800 via-primary-900 to-dark-800 pt-24 sm:pt-32 pb-10 sm:pb-16 px-4">
        <div className="container-custom">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Semua Layanan
            </motion.h1>
            <motion.p
              className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4"
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
      <section className="pt-3 pb-4 sm:pt-4 sm:pb-5 md:py-5 bg-white border-b sticky top-16 md:top-20 z-40">
        <div className="container-custom px-4">
          <div className="relative w-full mb-3 sm:mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari layanan..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-primary-800 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-x-2 gap-y-2 sm:gap-x-3 sm:gap-y-3 justify-start pb-2">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-primary-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <cat.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-10 pb-8 sm:pt-14 sm:pb-12">
        <div className="container-custom px-4">
          {/* Welcome / Member Banner */}
          <motion.div
            className="mb-8 overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {user ? (
              <div className="bg-linear-to-r from-primary-900 to-primary-800 text-white p-5 sm:p-6 rounded-2xl relative border border-primary-850 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Member Aktif
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-primary-300">Diskon Member 5% Aktif</h4>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold">Selamat Datang, {user.name}!</h3>
                    <p className="text-gray-300 text-xs mt-1">
                      Terdaftar dari <span className="font-semibold text-white">{user.university}</span> ({user.prodi}). Potongan harga 5% khusus untuk seluruh Jasa Skripsi telah diterapkan otomatis.
                    </p>
                  </div>
                  <div className="shrink-0 bg-green-500/10 border border-green-500/20 text-green-300 rounded-xl px-4 py-2.5 text-center">
                    <span className="block text-2xl font-black">5%</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider">Skripsi Disc</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-linear-to-r from-dark-800 to-primary-950 text-white p-5 sm:p-6 rounded-2xl relative border border-white/5 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl"></div>
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">✨ Dapatkan Diskon Member 5% Khusus Jasa Skripsi!</h3>
                    <p className="text-gray-400 text-xs mt-1">
                      Daftarkan diri Anda sekarang untuk menikmati potongan harga langsung di setiap pemesanan Jasa Skripsi.
                    </p>
                  </div>
                  <Link
                    href="/auth"
                    className="shrink-0 bg-primary-800 hover:bg-primary-750 text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-xl transition-colors shadow-lg shadow-primary-950/20 text-center"
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {visibleServices.map((service, index) => {
              const displayBadge = getDisplayBadge(service);
              const isSkripsi = service.category === 'joki-skripsi';
              const hasDiscount = !!user && isSkripsi && service.price !== 'Chat Admin';

              // Pre-fill WhatsApp message text
              const waText = !!user && isSkripsi
                ? `Halo Kak, saya member SOOBIN (Nama: ${user.name}, Kampus: ${user.university}, Prodi: ${user.prodi}). Mau order Jasa ${service.name} dengan Diskon Member 5%.`
                : `Halo Kak Mau ${service.name}`;
              const waLink = `https://wa.me/6287815797525?text=${encodeURIComponent(waText)}`;

              const isWebsite = service.category === 'pembuatan-website';

              return (
                <motion.div
                  key={service.id}
                  className={`group relative rounded-xl p-4 sm:p-5 lg:p-6 border transition-all duration-500 ${
                    isWebsite
                      ? 'sparkle-btn text-white border-purple-400/20'
                      : displayBadge ? 'border-primary-800 shadow-md bg-white' : 'border-gray-200 hover:border-primary-800 bg-white'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={
                    isWebsite
                      ? { y: -4, boxShadow: "0 12px 24px rgba(124, 58, 237, 0.35)" }
                      : { y: -4, boxShadow: "0 12px 24px rgba(26, 35, 126, 0.15)" }
                  }
                >
                  {isWebsite && (
                    <>
                      <span className="sparkle-star top-2 left-3"></span>
                      <span className="sparkle-star bottom-4 right-5"></span>
                      <span className="sparkle-star top-8 right-2"></span>
                    </>
                  )}
                  {displayBadge && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full z-10">
                      {displayBadge}
                    </span>
                  )}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                      isWebsite ? 'bg-white/20' : 'bg-primary-800/10'
                    }`}>
                      <service.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        isWebsite ? 'text-white' : 'text-primary-800'
                      }`} />
                    </div>
                  </div>
                  <h3 className={`font-semibold text-sm sm:text-base mb-2 transition-colors line-clamp-2 ${
                    isWebsite ? 'text-white group-hover:text-purple-200' : 'text-dark-800 group-hover:text-primary-800'
                  }`}>{service.name}</h3>
                  
                  {hasDiscount ? (
                    <div className="mb-3">
                      <p className="text-gray-400 line-through text-xs mb-0.5">{service.price}</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-green-600 font-bold text-sm sm:text-base">
                          {calculateDiscountedPrice(service.price)}
                        </p>
                        <span className="bg-green-100 text-green-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                          DISC 5%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3 flex items-center gap-1.5 flex-wrap">
                      <p className={`font-bold text-sm sm:text-base ${
                        isWebsite ? 'text-purple-100' : 'text-primary-800'
                      }`}>
                        {service.price}
                      </p>
                      {!!user && isSkripsi && service.price === 'Chat Admin' && (
                        <span className="bg-green-100 text-green-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                          DISC 5%
                        </span>
                      )}
                    </div>
                  )}

                  <motion.a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center font-medium py-2 sm:py-2.5 rounded-lg transition-colors duration-300 text-sm ${
                      isWebsite
                        ? 'bg-white text-purple-700 hover:bg-purple-50 hover:text-purple-800 font-bold'
                        : 'bg-primary-800 hover:bg-primary-750 text-white'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    Pesan
                  </motion.a>
                </motion.div>
              );
            })}
          </motion.div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-base sm:text-lg">Layanan tidak ditemukan</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              className="flex items-center justify-center mt-8 sm:mt-10 gap-1 flex-wrap px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:border-primary-800 hover:text-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? 'bg-primary-800 text-white shadow-md'
                      : 'border border-gray-300 text-gray-500 hover:border-primary-800 hover:text-primary-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {totalPages > 5 && <span className="text-gray-400">...</span>}
              {totalPages > 5 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    currentPage === totalPages
                      ? 'bg-primary-800 text-white shadow-md'
                      : 'border border-gray-300 text-gray-500 hover:border-primary-800 hover:text-primary-800'
                  }`}
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:border-primary-800 hover:text-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {totalPages > 1 && (
            <p className="text-center text-xs sm:text-sm text-gray-500 mt-3">
              Halaman {currentPage} dari {totalPages} — {filteredServices.length} layanan
            </p>
          )}
        </div>
      </section>

      {/* Back to Top Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showBackToTop ? 1 : 0, y: showBackToTop ? 0 : 20 }}
        className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50"
      >
        <motion.button
          onClick={scrollToTop}
          className="w-11 h-11 sm:w-12 sm:h-12 bg-primary-800 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
      </motion.div>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
