export interface StaticTestimonial {
  id: string;
  name: string;
  university?: string;
  prodi?: string;
  serviceName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isMemberVerified?: boolean;
}

export const BASELINE_REVIEW_COUNT = 3000;
export const BASELINE_RATING = 4.9;

export const STATIC_TESTIMONIALS: StaticTestimonial[] = [
  {
    id: 't-static-1',
    name: 'Rina Wulandari',
    university: 'Universitas Indonesia',
    prodi: 'S1 Ilmu Hukum',
    serviceName: 'Jasa Parafrase & Cek Turnitin 0%',
    rating: 5,
    comment: 'Skripsi saya selesai tepat waktu dengan hasil yang sangat memuaskan. Similarity Turnitin turun dari 42% menjadi hanya 8% tanpa mengubah makna ilmiah!',
    createdAt: '2026-08-20T10:00:00.000Z',
  },
  {
    id: 't-static-2',
    name: 'Ahmad Pratama',
    university: 'Institut Teknologi Bandung',
    prodi: 'S1 Teknik Informatika',
    serviceName: 'Jasa Pembuatan Website & Aplikasi',
    rating: 5,
    comment: 'Kode machine learning dan arsitektur backend selesai rapi lengkap dengan dokumentasi pengujian. Dosen penguji puas sekali dengan hasilnya!',
    createdAt: '2026-08-19T14:30:00.000Z',
  },
  {
    id: 't-static-3',
    name: 'Siti Nurhaliza',
    university: 'Universitas Gadjah Mada',
    prodi: 'S1 Farmasi',
    serviceName: 'Konsultasi Skripsi & Tugas Akhir',
    rating: 5,
    comment: 'Bimbingan metodologi penelitian sangat detail dan mudah dipahami. Revisi dibantu sampai tuntas, admin ramah dan fast response 24 jam.',
    createdAt: '2026-08-18T09:15:00.000Z',
  },
  {
    id: 't-static-4',
    name: 'Budi Santoso',
    university: 'Universitas Padjadjaran',
    prodi: 'S1 Kedokteran',
    serviceName: 'Formatting Jurnal & Fast Track Sinta',
    rating: 5,
    comment: 'Berhasil submit dan lolos review jurnal Sinta 2 tepat waktu untuk syarat kelulusan. Format template IEEE dan sitasi Mendeley sangat rapi.',
    createdAt: '2026-08-17T16:45:00.000Z',
  },
  {
    id: 't-static-5',
    name: 'Dewi Lestari',
    university: 'IPB University',
    prodi: 'S1 Agronomi',
    serviceName: 'Pengolahan Data SPSS / SmartPLS / AMOS',
    rating: 5,
    comment: 'Analisis regresi berganda dan uji asumsi klasik diolah sempurna dengan interpretasi bab 4 yang jelas. Sangat membantu saat persiapan sidang.',
    createdAt: '2026-08-16T11:20:00.000Z',
  },
  {
    id: 't-static-6',
    name: 'Farhan Rizki',
    university: 'ITS Surabaya',
    prodi: 'S1 Teknik Elektro',
    serviceName: 'Desain PPT Sidang Skripsi Premium',
    rating: 5,
    comment: 'Slide presentasi sidang dibuat sangat profesional dan interaktif. Dosen penguji memuji tampilan visualnya yang modern dan tidak membosankan.',
    createdAt: '2026-08-15T13:10:00.000Z',
  },
  {
    id: 't-static-7',
    name: 'Nadia Safira',
    university: 'Universitas Airlangga',
    prodi: 'S1 Manajemen',
    serviceName: 'Pengolahan Data SPSS / SmartPLS / AMOS',
    rating: 5,
    comment: 'Uji mediasi model SEM SmartPLS selesai dalam 1 hari kerja lengkap dengan tabel output dan pembahasan hasil uji hipotesis. Recommended!',
    createdAt: '2026-08-14T10:05:00.000Z',
  },
  {
    id: 't-static-8',
    name: 'Dimas Aditya',
    university: 'Universitas Brawijaya',
    prodi: 'S1 Ilmu Komunikasi',
    serviceName: 'Jasa Parafrase & Cek Turnitin 0%',
    rating: 5,
    comment: 'Parafrase kalimat sangat natural tanpa kesan kaku seperti bot. Similarity Turnitin lolos di bawah 10% dalam hitungan jam.',
    createdAt: '2026-08-13T17:40:00.000Z',
  },
  {
    id: 't-static-9',
    name: 'Anisa Rahmawati',
    university: 'Universitas Diponegoro',
    prodi: 'S1 Akuntansi',
    serviceName: 'Unlock Dokumen Scribd, Studocu & Turnitin',
    rating: 5,
    comment: 'Proses unlock dokumen referensi skripsi cuma butuh waktu 15 menit. Admin gercep dan file yang dikirim jernih berkualitas tinggi.',
    createdAt: '2026-08-12T08:50:00.000Z',
  },
  {
    id: 't-static-10',
    name: 'Rizky Maulana',
    university: 'Universitas Sebelas Maret',
    prodi: 'S1 Teknik Sipil',
    serviceName: 'Subscribe Akun AI & Software Premium',
    rating: 5,
    comment: 'Langganan ChatGPT Plus dan Turnitin no-repository di Soobin sangat aman, legal, dan murah dibanding beli langsung secara mandiri.',
    createdAt: '2026-08-11T19:30:00.000Z',
  },
  {
    id: 't-static-11',
    name: 'Clara Valencia',
    university: 'Universitas Bina Nusantara',
    prodi: 'S1 Desain Komunikasi Visual',
    serviceName: 'Desain PPT Sidang Skripsi Premium',
    rating: 5,
    comment: 'Animasi dan tata letak infografis PPT sidang skripsi saya dibuat sangat estetik dan eye-catching. Presentasi berjalan lancar tanpa kendala!',
    createdAt: '2026-08-10T15:20:00.000Z',
  },
  {
    id: 't-static-12',
    name: 'Fauzan Hakim',
    university: 'Universitas Hasanuddin',
    prodi: 'S1 Teknik Perkapalan',
    serviceName: 'Formatting Jurnal & Fast Track Sinta',
    rating: 5,
    comment: 'Bantuan formatting naskah publikasi internasional sangat rapi dan presisi sesuai author guidelines. Sangat membantu kelulusan tepat waktu.',
    createdAt: '2026-08-09T11:00:00.000Z',
  },
];
