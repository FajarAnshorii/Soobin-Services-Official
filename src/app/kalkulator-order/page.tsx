'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  RefreshCw,
  FileCheck,
  Presentation,
  FileText,
  PenTool,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Send,
  Plus,
  Minus,
  Info,
  Layers,
  GraduationCap,
  Trash2,
  ShoppingCart,
  PlusCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Unlock,
  FileSpreadsheet,
  DownloadCloud,
  FileCode,
  FileSearch,
  BookMarked,
  Sparkles
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  icon: any;
  unit: string;
  unitLabel: string;
  basePrice: number;
  minQty: number;
  maxQty: number;
  defaultQty: number;
  step: number;
  description: string;
  isTurnitinOrAi?: boolean;
}

interface CartItem {
  cartId: string;
  serviceId: string;
  name: string;
  category: string;
  unitPrice: number;
  unitLabel: string;
  quantity: number;
  subtotal: number;
  isTurnitinOrAi?: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'Semua Layanan' },
  { id: 'turnitin', label: 'Turnitin & AI' },
  { id: 'parafrase', label: 'Parafrase' },
  { id: 'ppt', label: 'Desain PPT' },
  { id: 'formatting', label: 'Formatting & Sitasi' },
  { id: 'pengetikan', label: 'Pengetikan & PDF' },
  { id: 'unlock', label: 'Unlock Dokumen' },
  { id: 'olah_data', label: 'Olah Data' },
  { id: 'tugas', label: 'Tugas Kuliah' },
];

const ALL_ACADEMIC_SERVICES: ServiceItem[] = [
  // --- 1. TURNITIN & AI (Diskon Member 5% Aktif) ---
  {
    id: 'turnitin_1x',
    name: 'Cek Turnitin (1x Pemeriksaan)',
    category: 'turnitin',
    categoryLabel: 'Turnitin & AI',
    icon: FileCheck,
    unit: 'dokumen',
    unitLabel: 'Dokumen',
    basePrice: 8000,
    minQty: 1,
    maxQty: 20,
    defaultQty: 1,
    step: 1,
    description: 'Pemeriksaan similarity index Turnitin resmi akun No-Repository (tidak tersimpan di database global/kampus).',
    isTurnitinOrAi: true,
  },
  {
    id: 'turnitin_3x',
    name: 'Cek Turnitin (Paket 3x Pemeriksaan)',
    category: 'turnitin',
    categoryLabel: 'Turnitin & AI',
    icon: FileCheck,
    unit: 'paket',
    unitLabel: 'Paket (3x Cek)',
    basePrice: 24000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Paket hemat 3 kali pengecekan similarity Turnitin No-Repository untuk memantau progress revisi naskah.',
    isTurnitinOrAi: true,
  },
  {
    id: 'turnitin_5x',
    name: 'Cek Turnitin (Paket 5x Pemeriksaan)',
    category: 'turnitin',
    categoryLabel: 'Turnitin & AI',
    icon: FileCheck,
    unit: 'paket',
    unitLabel: 'Paket (5x Cek)',
    basePrice: 35000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Paket hemat 5 kali pengecekan similarity Turnitin No-Repository untuk bimbingan skripsi berkala.',
    isTurnitinOrAi: true,
  },
  {
    id: 'turnitin_10x',
    name: 'Cek Turnitin (Paket 10x Pemeriksaan)',
    category: 'turnitin',
    categoryLabel: 'Turnitin & AI',
    icon: FileCheck,
    unit: 'paket',
    unitLabel: 'Paket (10x Cek)',
    basePrice: 60000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Paket 10 kali pengecekan Turnitin No-Repository cocok untuk pengerjaan kelompok atau bimbingan intensif.',
    isTurnitinOrAi: true,
  },
  {
    id: 'cek_ai',
    name: 'Cek AI Detector (ZeroGPT)',
    category: 'turnitin',
    categoryLabel: 'Turnitin & AI',
    icon: Layers,
    unit: 'dokumen',
    unitLabel: 'Dokumen',
    basePrice: 5000,
    minQty: 1,
    maxQty: 20,
    defaultQty: 1,
    step: 1,
    description: 'Pengecekan indikasi skor persentase Artificial Intelligence (AI) pada naskah artikel atau tugas kuliah.',
    isTurnitinOrAi: true,
  },
  {
    id: 'turnitin_combo',
    name: 'Paket Combo: Turnitin + Cek AI',
    category: 'turnitin',
    categoryLabel: 'Turnitin & AI',
    icon: Sparkles,
    unit: 'dokumen',
    unitLabel: 'Dokumen',
    basePrice: 12000,
    minQty: 1,
    maxQty: 20,
    defaultQty: 1,
    step: 1,
    description: 'Pemeriksaan lengkap 1x Turnitin No-Repository sekaligus verifikasi skor AI Detector dalam 1 kali order.',
    isTurnitinOrAi: true,
  },

  // --- 2. PARAFRASE DOKUMEN ---
  {
    id: 'parafrase_standar',
    name: 'Parafrase Dokumen Standar',
    category: 'parafrase',
    categoryLabel: 'Parafrase',
    icon: RefreshCw,
    unit: 'halaman',
    unitLabel: 'Halaman',
    basePrice: 2000,
    minQty: 1,
    maxQty: 500,
    defaultQty: 10,
    step: 1,
    description: 'Parafrase manual per halaman untuk menurunkan similarity Turnitin dengan tetap menjaga substansi materi.',
  },
  {
    id: 'parafrase_jurnal',
    name: 'Parafrase Jurnal / Artikel Ilmiah',
    category: 'parafrase',
    categoryLabel: 'Parafrase',
    icon: BookOpen,
    unit: 'halaman',
    unitLabel: 'Halaman',
    basePrice: 3000,
    minQty: 1,
    maxQty: 200,
    defaultQty: 8,
    step: 1,
    description: 'Parafrase khusus artikel ilmiah dengan pemilihan kosakata akademik baku sesuai standar publikasi jurnal.',
  },
  {
    id: 'parafrase_skripsi',
    name: 'Parafrase Naskah Skripsi / Tesis',
    category: 'parafrase',
    categoryLabel: 'Parafrase',
    icon: GraduationCap,
    unit: 'halaman',
    unitLabel: 'Halaman',
    basePrice: 2500,
    minQty: 1,
    maxQty: 500,
    defaultQty: 20,
    step: 1,
    description: 'Parafrase komprehensif Bab 1, 2, 3, 4, dan 5 skripsi untuk memastikan bebas plagiasi dan lolos uji similarity.',
  },
  {
    id: 'parafrase_low_turnitin',
    name: 'Parafrase Target Similarity Rendah (< 15%)',
    category: 'parafrase',
    categoryLabel: 'Parafrase',
    icon: ShieldCheck,
    unit: 'halaman',
    unitLabel: 'Halaman',
    basePrice: 3500,
    minQty: 1,
    maxQty: 500,
    defaultQty: 15,
    step: 1,
    description: 'Parafrase ekstra mendalam dengan restrukturisasi kalimat total untuk mencapai target similarity di bawah 15%.',
  },

  // --- 3. DESAIN PRESENTASI & VISUAL (PPT) ---
  {
    id: 'ppt_standar',
    name: 'Jasa Desain PPT Standar',
    category: 'ppt',
    categoryLabel: 'Desain PPT',
    icon: Presentation,
    unit: 'slide',
    unitLabel: 'Slide',
    basePrice: 3000,
    minQty: 1,
    maxQty: 200,
    defaultQty: 10,
    step: 1,
    description: 'Penyusunan slide presentasi rapi dan clean untuk tugas kuliah, seminar proposal, maupun sidang skripsi.',
  },
  {
    id: 'ppt_animasi',
    name: 'Jasa Desain PPT Animasi & Infografis',
    category: 'ppt',
    categoryLabel: 'Desain PPT',
    icon: Presentation,
    unit: 'slide',
    unitLabel: 'Slide',
    basePrice: 5000,
    minQty: 1,
    maxQty: 150,
    defaultQty: 12,
    step: 1,
    description: 'Desain presentasi tingkat lanjut dengan transisi morph, diagram visual, dan infografis modern yang memukau penguji.',
  },
  {
    id: 'ppt_redesign',
    name: 'Redesain / Merapikan Slide PPT Mahasiswa',
    category: 'ppt',
    categoryLabel: 'Desain PPT',
    icon: Presentation,
    unit: 'slide',
    unitLabel: 'Slide',
    basePrice: 2000,
    minQty: 1,
    maxQty: 200,
    defaultQty: 15,
    step: 1,
    description: 'Merapikan materi slide yang sudah ada menjadi lebih proporsional, estetis, dan mudah dibaca audiens.',
  },
  {
    id: 'poster_ilmiah',
    name: 'Desain Poster Ilmiah / Banner Sidang',
    category: 'ppt',
    categoryLabel: 'Desain PPT',
    icon: FileSpreadsheet,
    unit: 'poster',
    unitLabel: 'Desain Poster',
    basePrice: 35000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Pembuatan poster ilmiah resolusi tinggi siap cetak untuk pameran riset, konferensi, atau luaran publikasi skripsi.',
  },

  // --- 4. FORMATTING DOKUMEN & SITASI ---
  {
    id: 'formatting_standar',
    name: 'Formatting Layout & Margin Standar',
    category: 'formatting',
    categoryLabel: 'Formatting & Sitasi',
    icon: FileText,
    unit: 'halaman',
    unitLabel: 'Halaman',
    basePrice: 1500,
    minQty: 1,
    maxQty: 500,
    defaultQty: 25,
    step: 1,
    description: 'Penataan margin 4-4-3-3, spasi paragraf, indentasi, dan penomoran romawi/angka sesuai pedoman penulisan kampus.',
  },
  {
    id: 'formatting_full',
    name: 'Paket Full Formatting Skripsi/Tesis Siap Cetak',
    category: 'formatting',
    categoryLabel: 'Formatting & Sitasi',
    icon: GraduationCap,
    unit: 'dokumen',
    unitLabel: 'Naskah Lengkap',
    basePrice: 35000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Formatting lengkap seluruh naskah dari Cover, Lembar Pengesahan, Bab 1 hingga Lampiran sampai siap cetak & ACC.',
  },
  {
    id: 'mendeley_sitasi',
    name: 'Perapian Daftar Pustaka (Mendeley / Zotero)',
    category: 'formatting',
    categoryLabel: 'Formatting & Sitasi',
    icon: BookMarked,
    unit: 'sumber',
    unitLabel: 'Sumber Rujukan',
    basePrice: 1000,
    minQty: 1,
    maxQty: 300,
    defaultQty: 20,
    step: 1,
    description: 'Integrasi dan sinkronisasi rujukan sitasi otomatis menggunakan Mendeley/Zotero dengan format APA, IEEE, atau Harvard.',
  },
  {
    id: 'daftar_isi_otomatis',
    name: 'Pembuatan Daftar Isi, Gambar & Tabel Otomatis',
    category: 'formatting',
    categoryLabel: 'Formatting & Sitasi',
    icon: FileCode,
    unit: 'dokumen',
    unitLabel: 'Dokumen',
    basePrice: 10000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Pembuatan heading otomatis Microsoft Word untuk Daftar Isi, Daftar Tabel, dan Daftar Gambar sekali klik.',
  },

  // --- 5. PENGETIKAN & KONVERSI FILE ---
  {
    id: 'pengetikan_standar',
    name: 'Jasa Pengetikan Tulisan Tangan / Foto ke Word',
    category: 'pengetikan',
    categoryLabel: 'Pengetikan & PDF',
    icon: PenTool,
    unit: 'halaman',
    unitLabel: 'Halaman',
    basePrice: 1000,
    minQty: 1,
    maxQty: 500,
    defaultQty: 10,
    step: 1,
    description: 'Pengetikan ulang materi dari catatan tulisan tangan, kertas foto, atau buku fisik ke format Microsoft Word rapi.',
  },
  {
    id: 'konversi_pdf_word',
    name: 'Konversi PDF Scan ke Word Rapih',
    category: 'pengetikan',
    categoryLabel: 'Pengetikan & PDF',
    icon: FileText,
    unit: 'halaman',
    unitLabel: 'Halaman',
    basePrice: 1000,
    minQty: 1,
    maxQty: 500,
    defaultQty: 15,
    step: 1,
    description: 'Mengonversi file PDF hasil scan menjadi dokumen Word yang dapat diedit tanpa teks miring atau tata letak berantakan.',
  },
  {
    id: 'pengetikan_rumus',
    name: 'Pengetikan Rumus Matematika / LaTeX / Kimia',
    category: 'pengetikan',
    categoryLabel: 'Pengetikan & PDF',
    icon: FileCode,
    unit: 'halaman',
    unitLabel: 'Halaman',
    basePrice: 2500,
    minQty: 1,
    maxQty: 200,
    defaultQty: 10,
    step: 1,
    description: 'Pengetikan persamaan matematika rumit (Equation/LaTeX), struktur kimia, dan tabel matriks perhitungan ilmiah.',
  },

  // --- 6. UNLOCK DOKUMEN AKADEMIK ---
  {
    id: 'unlock_scribd',
    name: 'Unlock Dokumen Scribd',
    category: 'unlock',
    categoryLabel: 'Unlock Dokumen',
    icon: Unlock,
    unit: 'file',
    unitLabel: 'File Dokumen',
    basePrice: 2000,
    minQty: 1,
    maxQty: 50,
    defaultQty: 1,
    step: 1,
    description: 'Download dokumen referensi lengkap dari Scribd tanpa watermark dan siap diunduh dalam format PDF/Word.',
  },
  {
    id: 'unlock_studocu',
    name: 'Unlock Dokumen Studocu',
    category: 'unlock',
    categoryLabel: 'Unlock Dokumen',
    icon: Unlock,
    unit: 'file',
    unitLabel: 'File Dokumen',
    basePrice: 2500,
    minQty: 1,
    maxQty: 50,
    defaultQty: 1,
    step: 1,
    description: 'Membuka kunci akses dokumen rangkuman kuliah, tugas, dan materi premium Studocu secara instan.',
  },
  {
    id: 'unlock_coursehero',
    name: 'Unlock Dokumen CourseHero',
    category: 'unlock',
    categoryLabel: 'Unlock Dokumen',
    icon: Unlock,
    unit: 'file',
    unitLabel: 'File Dokumen',
    basePrice: 3000,
    minQty: 1,
    maxQty: 30,
    defaultQty: 1,
    step: 1,
    description: 'Unlock dokumen pembelajaran dan latihan soal terkunci di platform CourseHero dengan proses cepat.',
  },
  {
    id: 'download_jurnal',
    name: 'Download Jurnal Internasional Berbayar',
    category: 'unlock',
    categoryLabel: 'Unlock Dokumen',
    icon: DownloadCloud,
    unit: 'artikel',
    unitLabel: 'Artikel Jurnal',
    basePrice: 5000,
    minQty: 1,
    maxQty: 30,
    defaultQty: 1,
    step: 1,
    description: 'Unduh full-text artikel jurnal ilmiah internasional berbayar dari ScienceDirect, IEEE Xplore, Springer, atau Wiley.',
  },

  // --- 7. OLAH DATA & STATISTIK ---
  {
    id: 'olah_data_spss',
    name: 'Olah Data SPSS (Validitas, Reliabilitas, Regresi)',
    category: 'olah_data',
    categoryLabel: 'Olah Data',
    icon: BarChart3,
    unit: 'paket',
    unitLabel: 'Paket Uji',
    basePrice: 100000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Pengolahan data statistik kuesioner/kuantitatif meliputi uji instrumen, asumsi klasik, regresi, dan interpretasi output Bab 4.',
  },
  {
    id: 'olah_data_pls',
    name: 'Olah Data SEM-PLS (SmartPLS / AMOS)',
    category: 'olah_data',
    categoryLabel: 'Olah Data',
    icon: BarChart3,
    unit: 'model',
    unitLabel: 'Model Jalur',
    basePrice: 15000,
    minQty: 1,
    maxQty: 5,
    defaultQty: 1,
    step: 1,
    description: 'Analisis pemodelan jalur persamaan struktural (outer model, inner model, bootstrapping, dan mediasi/moderasi).',
  },
  {
    id: 'olah_data_eviews',
    name: 'Olah Data EViews / STATA (Panel & Time Series)',
    category: 'olah_data',
    categoryLabel: 'Olah Data',
    icon: BarChart3,
    unit: 'uji',
    unitLabel: 'Paket Analisis',
    basePrice: 120000,
    minQty: 1,
    maxQty: 5,
    defaultQty: 1,
    step: 1,
    description: 'Analisis regresi data panel (Common/Fixed/Random Effect), uji stasioneritas, kointegrasi, dan uji diagnostik model.',
  },

  // --- 8. TUGAS KULIAH & PENULISAN ILMIAH ---
  {
    id: 'review_jurnal_ilmiah',
    name: 'Review Jurnal Ilmiah (SINTA / Scopus)',
    category: 'tugas',
    categoryLabel: 'Tugas Kuliah',
    icon: BookOpen,
    unit: 'jurnal',
    unitLabel: 'Artikel Jurnal',
    basePrice: 25000,
    minQty: 1,
    maxQty: 20,
    defaultQty: 1,
    step: 1,
    description: 'Penyusunan matriks telaah kritis artikel jurnal ilmiah mencakup latar belakang, metode, hasil temuan, dan kritik riset.',
  },
  {
    id: 'makalah_essay',
    name: 'Penyusunan Naskah Makalah / Essay Ilmiah',
    category: 'tugas',
    categoryLabel: 'Tugas Kuliah',
    icon: FileSearch,
    unit: 'naskah',
    unitLabel: 'Naskah Tugas',
    basePrice: 40000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Penyusunan naskah makalah kuliah terstruktur dengan referensi ilmiah primer dan format sitasi standar.',
  },
  {
    id: 'abstrak_bilingual',
    name: 'Pembuatan Abstrak Bilingual (Indo + English)',
    category: 'tugas',
    categoryLabel: 'Tugas Kuliah',
    icon: FileText,
    unit: 'abstrak',
    unitLabel: 'Naskah Abstrak',
    basePrice: 15000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    step: 1,
    description: 'Penyusunan dan penerjemahan abstrak skripsi/jurnal ke bahasa Inggris akademik (IMRaD) yang natural dan tepat kaidah.',
  },
  {
    id: 'resume_buku',
    name: 'Pembuatan Resume / Rangkuman Bab Buku',
    category: 'tugas',
    categoryLabel: 'Tugas Kuliah',
    icon: BookOpen,
    unit: 'bab',
    unitLabel: 'Bab / Materi',
    basePrice: 15000,
    minQty: 1,
    maxQty: 20,
    defaultQty: 1,
    step: 1,
    description: 'Merangkum intisari poin penting dari bab buku teks perkuliahan atau artikel modul ajar secara padat dan jelas.',
  },
];

const ITEMS_PER_PAGE = 6; // 2 cols x 3 rows = max 3 rows

export default function KalkulatorOrderPage() {
  const { user } = useAuth();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('parafrase_standar');
  const [inputQuantity, setInputQuantity] = useState<number | string>(10);
  const [orderCart, setOrderCart] = useState<CartItem[]>([]);
  const [justAddedNotice, setJustAddedNotice] = useState<string | null>(null);

  // Search and Category states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter services by category and search query
  const filteredServices = useMemo(() => {
    return ALL_ACADEMIC_SERVICES.filter((service) => {
      const matchCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE) || 1;
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  // Active selected service object
  const activeService = useMemo(() => {
    const found = ALL_ACADEMIC_SERVICES.find((s) => s.id === selectedServiceId);
    return found || ALL_ACADEMIC_SERVICES[0];
  }, [selectedServiceId]);

  // Reset page when category or search changes
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  // Handle service selection
  const handleSelectService = (service: ServiceItem) => {
    setSelectedServiceId(service.id);
    setInputQuantity(service.defaultQty);
  };

  // Safe parsed quantity for current active selection
  const currentNumericQty = useMemo(() => {
    const n = typeof inputQuantity === 'string' ? parseInt(inputQuantity, 10) : inputQuantity;
    return isNaN(n) || n <= 0 ? 1 : n;
  }, [inputQuantity]);

  // Current single item calculation
  const currentSubtotal = useMemo(() => {
    return activeService.basePrice * currentNumericQty;
  }, [activeService, currentNumericQty]);

  // Add current configured service to order cart
  const handleAddToCart = () => {
    const existingIndex = orderCart.findIndex((item) => item.serviceId === activeService.id);
    let updatedCart: CartItem[];

    if (existingIndex > -1) {
      // Update existing item quantity
      const existing = orderCart[existingIndex];
      const newQty = existing.quantity + currentNumericQty;
      const updatedItem: CartItem = {
        ...existing,
        quantity: newQty,
        subtotal: existing.unitPrice * newQty,
      };
      updatedCart = [...orderCart];
      updatedCart[existingIndex] = updatedItem;
    } else {
      // Add new item
      const newItem: CartItem = {
        cartId: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        serviceId: activeService.id,
        name: activeService.name,
        category: activeService.category,
        unitPrice: activeService.basePrice,
        unitLabel: activeService.unitLabel,
        quantity: currentNumericQty,
        subtotal: currentSubtotal,
        isTurnitinOrAi: activeService.isTurnitinOrAi,
      };
      updatedCart = [...orderCart, newItem];
    }

    setOrderCart(updatedCart);
    setJustAddedNotice(`Berhasil menambahkan: ${activeService.name} (${currentNumericQty} ${activeService.unitLabel})`);
    setTimeout(() => setJustAddedNotice(null), 3000);
  };

  // Remove item from cart
  const handleRemoveFromCart = (cartId: string) => {
    setOrderCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // Clear all cart
  const handleClearCart = () => {
    if (orderCart.length === 0) return;
    if (confirm('Kosongkan semua daftar pesanan?')) {
      setOrderCart([]);
    }
  };

  const isCartEmpty = orderCart.length === 0;

  const totalRawSubtotal = useMemo(() => {
    if (isCartEmpty) {
      return currentSubtotal;
    }
    return orderCart.reduce((sum, item) => sum + item.subtotal, 0);
  }, [isCartEmpty, currentSubtotal, orderCart]);

  // Member discount (5% ONLY for Turnitin & Cek AI services)
  const isMember = Boolean(user);
  const memberDiscountAmount = useMemo(() => {
    if (!isMember) return 0;
    if (isCartEmpty) {
      return activeService.isTurnitinOrAi ? Math.round(currentSubtotal * 0.05) : 0;
    }
    return orderCart.reduce((sum, item) => {
      if (item.isTurnitinOrAi) {
        return sum + Math.round(item.subtotal * 0.05);
      }
      return sum;
    }, 0);
  }, [isMember, isCartEmpty, activeService.isTurnitinOrAi, currentSubtotal, orderCart]);

  const finalGrandTotal = totalRawSubtotal - memberDiscountAmount;

  // Currency formatter
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // WhatsApp order link
  const whatsappUrl = useMemo(() => {
    const memberStatus = isMember ? `Member (${user?.name || 'Aktif'})` : 'Reguler';
    const discountText = memberDiscountAmount > 0 ? `\nPotongan Diskon Member Turnitin & AI (5%): -${formatRupiah(memberDiscountAmount)}` : '';

    let itemsBreakdown = '';
    if (isCartEmpty) {
      itemsBreakdown = `1. ${activeService.name} (${currentNumericQty} ${activeService.unitLabel}) - ${formatRupiah(currentSubtotal)}`;
    } else {
      itemsBreakdown = orderCart
        .map((item, idx) => `${idx + 1}. ${item.name} (${item.quantity} ${item.unitLabel}) - ${formatRupiah(item.subtotal)}`)
        .join('\n');
    }

    const text = `Halo Admin SOOBIN Services! 👋
Saya ingin melakukan pemesanan via Kalkulator Order Website:

📋 DAFTAR PESANAN SAYA:
${itemsBreakdown}

💵 Subtotal: ${formatRupiah(totalRawSubtotal)}${discountText}
✨ ESTIMASI TOTAL ORDER: ${formatRupiah(finalGrandTotal)}
👤 Status Klien: ${memberStatus}

Mohon bantuannya untuk konfirmasi dan proses pesanan ini ya Kak. Terima kasih! 🙏`;

    return `https://wa.me/6287815797525?text=${encodeURIComponent(text)}`;
  }, [isCartEmpty, activeService, currentNumericQty, currentSubtotal, orderCart, totalRawSubtotal, isMember, memberDiscountAmount, finalGrandTotal, user]);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero / Header Section */}
      <section className="pt-28 sm:pt-36 pb-8 sm:pb-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5 text-slate-700" />
            <span>Kalkulator Order Tugas & Dokumen Akademik</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Kalkulator & Total Order
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Cari layanan tugas kuliah Anda, input jumlah halaman atau unit secara manual, dan gabungkan beberapa layanan ke dalam satu total pesanan resmi.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-8 sm:py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Service Selection, Search, Categories, & Manual Input (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Select Service with Search & Category Tabs */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                    Pilih Jenis Layanan Tugas
                  </h2>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Menampilkan {filteredServices.length} dari {ALL_ACADEMIC_SERVICES.length} Layanan
                  </span>
                </div>

                {/* Search Bar Input */}
                <div className="relative mb-3.5">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Cari layanan... (misal: SPSS, Mendeley, Scribd, Turnitin, PPT)"
                    className="w-full h-10 pl-10 pr-4 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs font-medium text-slate-900 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold px-1.5 py-0.5 rounded cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3.5 scrollbar-none no-scrollbar">
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Services Grid (Strictly 2 Columns x Max 3 Rows = 6 Cards) */}
                {paginatedServices.length === 0 ? (
                  <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                    <Search className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                    <p className="text-xs font-semibold text-slate-700">Layanan tidak ditemukan</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Coba kata kunci lain atau pilih tab Semua Layanan</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 min-h-[220px]">
                    {paginatedServices.map((srv) => {
                      const Icon = srv.icon;
                      const isSelected = selectedServiceId === srv.id;

                      return (
                        <button
                          key={srv.id}
                          type="button"
                          onClick={() => handleSelectService(srv)}
                          className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 h-[68px] ${
                            isSelected
                              ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-900 hover:border-slate-400 hover:bg-slate-50/80'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`} title={srv.name}>
                              {srv.name}
                            </h3>
                            <p className={`text-[11px] font-semibold mt-0.5 ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                              {formatRupiah(srv.basePrice)} <span className="text-[10px] opacity-80">/{srv.unit}</span>
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Pagination Controls (Max 3 Rows Height Guard) */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-3.5 mt-3 border-t border-slate-200">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Step 2: Manual Number Input & Add to Order */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                    Input Manual Jumlah {activeService.unitLabel}
                  </h2>
                  <span className="text-xs text-slate-500 font-semibold">
                    Tarif: {formatRupiah(activeService.basePrice)} / {activeService.unitLabel}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-5 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <b>{activeService.name}</b> — {activeService.description}
                  </p>
                </div>

                {/* Direct Manual Number Input Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Masukkan Jumlah {activeService.unitLabel} yang Diinginkan:
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setInputQuantity((prev) => Math.max(1, (typeof prev === 'number' ? prev : parseInt(prev, 10) || 1) - activeService.step))}
                        className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-800 transition-colors cursor-pointer shrink-0"
                        title="Kurangi"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="1"
                          max={activeService.maxQty}
                          value={inputQuantity}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              setInputQuantity('');
                            } else {
                              const parsed = parseInt(val, 10);
                              setInputQuantity(isNaN(parsed) ? 1 : Math.max(1, parsed));
                            }
                          }}
                          placeholder={`Contoh: 15`}
                          className="w-full h-12 bg-white border-2 border-slate-300 focus:border-slate-900 rounded-xl px-4 text-base font-bold text-slate-900 text-center outline-none transition-all shadow-2xs"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold pointer-events-none">
                          {activeService.unitLabel}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setInputQuantity((prev) => (typeof prev === 'number' ? prev : parseInt(prev, 10) || 1) + activeService.step)}
                        className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-800 transition-colors cursor-pointer shrink-0"
                        title="Tambah"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal Preview for this selected item */}
                  <div className="p-3.5 bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">
                      Subtotal ({currentNumericQty} {activeService.unitLabel} × {formatRupiah(activeService.basePrice)}):
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatRupiah(currentSubtotal)}
                    </span>
                  </div>

                  {/* Button: Add to Order Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-99"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Tambahkan Layanan Ini ke Daftar Order</span>
                  </button>

                  {/* Notice feedback */}
                  <AnimatePresence>
                    {justAddedNotice && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{justAddedNotice}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Column: Multi-Item Order Cart & Grand Total (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Daftar Pesanan Anda</h3>
                      <p className="text-[11px] text-slate-500">
                        {orderCart.length === 0 ? '1 Layanan Aktif' : `${orderCart.length} Layanan Ditambahkan`}
                      </p>
                    </div>
                  </div>

                  {isMember ? (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                      Member Aktif
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-medium">
                      Klien Reguler
                    </span>
                  )}
                </div>

                {/* Items List */}
                <div className="py-4 space-y-3 text-xs border-b border-slate-200 max-h-[300px] overflow-y-auto pr-1">
                  {orderCart.length === 0 ? (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">{activeService.name}</span>
                        <span className="font-bold text-slate-900">{formatRupiah(currentSubtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{currentNumericQty} {activeService.unitLabel} × {formatRupiah(activeService.basePrice)}</span>
                        <span className="text-[10px] text-slate-400">(Item aktif)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                        💡 Klik <b>&quot;+ Tambahkan Layanan Ini&quot;</b> untuk mengombinasikan dengan layanan lain.
                      </p>
                    </div>
                  ) : (
                    orderCart.map((item, index) => (
                      <div
                        key={item.cartId}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold shrink-0">
                              {index + 1}
                            </span>
                            <h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
                          </div>
                          <p className="text-[11px] text-slate-600 pl-5.5">
                            {item.quantity} {item.unitLabel} × {formatRupiah(item.unitPrice)} = <span className="font-bold text-slate-900">{formatRupiah(item.subtotal)}</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(item.cartId)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                          title="Hapus Layanan Ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Subtotal & Member Discount Breakdown */}
                <div className="py-4 space-y-2.5 text-xs border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Subtotal Semua Pesanan:</span>
                    <span className="font-bold text-slate-900">{formatRupiah(totalRawSubtotal)}</span>
                  </div>

                  {isMember ? (
                    memberDiscountAmount > 0 ? (
                      <div className="flex items-center justify-between text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 font-semibold">
                        <span>Diskon Member Turnitin & AI (5%):</span>
                        <span>-{formatRupiah(memberDiscountAmount)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-[11px]">
                        <span>Diskon Member (5%):</span>
                        <span className="font-medium text-slate-700">Khusus Layanan Turnitin & Cek AI</span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-between text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-[11px]">
                      <span>Benefit Akun Member:</span>
                      <span className="font-semibold text-slate-800">Diskon 5% Turnitin & Cek AI</span>
                    </div>
                  )}
                </div>

                {/* Grand Total Display */}
                <div className="py-4 text-center bg-slate-50 rounded-xl border border-slate-200 my-4">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Estimasi Grand Total
                  </span>
                  <div className="text-3xl font-extrabold text-slate-900">
                    {formatRupiah(finalGrandTotal)}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {orderCart.length > 0 ? `Total untuk ${orderCart.length} jenis layanan` : 'Total 1 layanan terpilih'}
                  </span>
                </div>

                {/* Total Order WhatsApp CTA */}
                <div className="space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Total Order via WhatsApp</span>
                  </a>

                  {orderCart.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="w-full py-2 text-center text-xs text-slate-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
                    >
                      Kosongkan Daftar Pesanan
                    </button>
                  )}

                  {/* Standard Academic Guarantees */}
                  <div className="pt-2 space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Garansi pengerjaan sesuai pedoman & instruksi kampus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                      <span>Kerahasiaan data dan naskah dokumen terjamin 100%</span>
                    </div>
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
