const https = require('https');

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '69ab6d528c0c20bc8810d3edd33a11fa';
const dbId = process.env.CLOUDFLARE_D1_DATABASE_ID || 'a14c0f58-46b4-4164-b067-87bd18ac7612';
const token = process.env.CLOUDFLARE_D1_API_TOKEN || '';

async function queryD1(sql, params = []) {
  const data = JSON.stringify({ sql, params });
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.cloudflare.com',
        path: `/client/v4/accounts/${accountId}/d1/database/${dbId}/query`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (d) => (body += d));
        res.on('end', () => resolve(JSON.parse(body)));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

const firstNames = [
  'Muhammad', 'Ahmad', 'Dimas', 'Bagus', 'Rizky', 'Fajar', 'Deni', 'Bayu', 'Aldi', 'Ilham',
  'Aditya', 'Rafi', 'Fikri', 'Reza', 'Farhan', 'Bagas', 'Dwi', 'Eko', 'Gilang', 'Hafiz',
  'Irfan', 'Kevin', 'Lutfi', 'Maulana', 'Naufal', 'Pratama', 'Raditya', 'Satria', 'Taufiq', 'Wahyu',
  'Yusuf', 'Zaki', 'Putri', 'Dinda', 'Siti', 'Nurul', 'Anisa', 'Rina', 'Dewi', 'Fitri',
  'Indah', 'Lestari', 'Mega', 'Nadia', 'Rani', 'Sari', 'Tiara', 'Wulan', 'Yulia', 'Zahra',
  'Amanda', 'Bella', 'Citra', 'Dara', 'Eka', 'Febri', 'Gita', 'Hana', 'Intan', 'Jihan'
];

const lastNames = [
  'Pratama', 'Saputra', 'Wibowo', 'Kusuma', 'Hidayat', 'Santoso', 'Wijaya', 'Setiawan', 'Utomo', 'Permana',
  'Nugroho', 'Gunawan', 'Rahman', 'Firmansyah', 'Ramadhan', 'Kurniawan', 'Suryono', 'Handoko', 'Purnomo', 'Susanto',
  'Wahyudi', 'Hermawan', 'Irawan', 'Suhendra', 'Anggoro', 'Budiman', 'Cahyono', 'Darmo', 'Effendi', 'Fauzi',
  'Hakim', 'Iskandar', 'Junaedi', 'Kartiko', 'Laksana', 'Mulyadi', 'Nasution', 'Oktavian', 'Pangestu', 'Rasyid'
];

const universities = [
  'Universitas Indonesia', 'Institut Teknologi Bandung', 'Universitas Gadjah Mada', 'Institut Teknologi Sepuluh Nopember',
  'Universitas Airlangga', 'Universitas Diponegoro', 'Universitas Brawijaya', 'Universitas Padjadjaran',
  'Universitas Sebelas Maret', 'IPB University', 'Universitas Trunojoyo Madura', 'Universitas Negeri Surabaya',
  'Universitas Udayana', 'Universitas Hasanuddin', 'Universitas Sumatera Utara', 'Universitas Andalas',
  'Universitas Telkom', 'Universitas Bina Nusantara', 'Universitas Muhammadiyah Malang', 'Universitas Narotama'
];

const prodis = [
  'S1 Teknik Informatika', 'S1 Sistem Informasi', 'S1 Ilmu Komputer', 'S1 Manajemen', 'S1 Akuntansi',
  'S1 Ekonomi Pembangunan', 'S1 Ilmu Komunikasi', 'S1 Psikologi', 'S1 Hukum', 'S1 Kedokteran',
  'S1 Farmasi', 'S1 Teknik Sipil', 'S1 Teknik Elektro', 'S1 Statistika', 'S1 Hubungan Internasional'
];

const services = [
  'Cek Turnitin 1x No Repo', 'Cek Turnitin Fast Track', 'Jasa Parafrase & Turnitin Lolos Sinta',
  'Formatting Dokumen Skripsi / Tesis', 'Review Jurnal & Proofreading', 'Olah Data SPSS / SmartPLS / AMOS',
  'Jasa Pembuatan PPT Ujian Skripsi / Sidang', 'Jasa Joki Makalah & Artikel Ilmiah', 'Unlock Jurnal IEEE / Springer / ScienceDirect'
];

const comments = [
  'Pelayanannya luar biasa cepat, hasil Turnitin keluar dalam 5 menit dan no repository aman!',
  'Skripsi saya lolos uji similarity Turnitin dari 38% turun jadi 9% berkat jasa parafrase Soobin. Makasih banyak min!',
  'Data SPSS diolah rapi banget, output dan pembahasannya detail jadi gampang waktu ditanya dosen penguji.',
  'Unlock jurnal Wiley dan ScienceDirect prosesnya instan. Sangat ngebantu buat nyari referensi bab 2 skripsi.',
  'Desain PPT skripsinya aesthetic dan profesional banget. Dosen penguji sampai muji pas sidang tadi pagi!',
  'Adminnya ramah dan responsif, pengerjaan cepat sesuai deadline, revisi dilayani dengan sabar. Recommended!',
  'Sangat puas sama hasil formatting dokumennya. Margin, heading, daftar isi, dan tabel otomatis rapi semua.',
  'Langganan dari semester 5 sampai sekarang mau wisuda. Gak pernah ngecewain sama sekali!',
  'Parafrasenya humanis banget gak kaku kayak translate mesin. Nilai tugas makalah dapet A.',
  'Harga mahasiswa tapi kualitas beneran bintang lima. Hasil no repo bikin tenang gak khawatir kena plagiasi.'
];

async function generate() {
  console.log('Creating testimonials table...');
  await queryD1(`CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    university TEXT,
    prodi TEXT,
    service_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at TEXT NOT NULL,
    is_approved INTEGER DEFAULT 1
  );`);

  const total = 3000;
  const batchSize = 50;
  const now = Date.now();

  for (let b = 0; b < total; b += batchSize) {
    const count = Math.min(batchSize, total - b);
    const valuesSql = [];
    for (let i = 0; i < count; i++) {
      const idx = b + i;
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${fn} ${ln}`;
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${Math.floor(Math.random() * 999)}@gmail.com`;
      const univ = universities[Math.floor(Math.random() * universities.length)];
      const prodi = prodis[Math.floor(Math.random() * prodis.length)];
      const service = services[Math.floor(Math.random() * services.length)];
      const rating = Math.random() < 0.92 ? 5 : 4;
      const comment = comments[Math.floor(Math.random() * comments.length)].replace(/'/g, "''");
      const dateOffset = Math.floor(Math.random() * (180 * 24 * 3600 * 1000));
      const createdAt = new Date(now - dateOffset).toISOString();
      const id = `testi-${3000 - idx}`;

      valuesSql.push(`('${id}', '${name}', '${email}', '${univ}', '${prodi}', '${service}', ${rating}, '${comment}', '${createdAt}', 1)`);
    }

    const sql = `INSERT OR REPLACE INTO testimonials (id, name, email, university, prodi, service_name, rating, comment, created_at, is_approved) VALUES ${valuesSql.join(', ')};`;
    await queryD1(sql);
    if ((b + count) % 500 === 0 || b + count === total) {
      console.log(`Inserted ${b + count} / ${total} testimonials...`);
    }
  }

  const countRes = await queryD1('SELECT COUNT(*) as total FROM testimonials;');
  console.log('FINAL TESTIMONIALS COUNT IN CLOUDFLARE D1:', countRes.result[0].results[0]);
}

generate();
