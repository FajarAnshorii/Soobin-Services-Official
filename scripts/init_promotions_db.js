const https = require('https');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.resolve(__dirname, '../.env.local');
let env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > -1) {
        const k = trimmed.substring(0, idx).trim();
        const v = trimmed.substring(idx + 1).trim();
        env[k] = v;
      }
    }
  });
}

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID || '69ab6d528c0c20bc8810d3edd33a11fa';
const dbId = process.env.CLOUDFLARE_D1_DATABASE_ID || env.CLOUDFLARE_D1_DATABASE_ID || 'a14c0f58-46b4-4164-b067-87bd18ac7612';
const token = process.env.CLOUDFLARE_D1_API_TOKEN || env.CLOUDFLARE_D1_API_TOKEN || '';

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
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve({ error: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function initTablesAndSeed() {
  console.log('--- Initializing Promotions Database Tables in Cloudflare D1 ---');

  // 1. Table for Influencer Promotions
  console.log('Creating table `influencer_promotions`...');
  const createInfluencerTable = `
    CREATE TABLE IF NOT EXISTS influencer_promotions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      handle TEXT NOT NULL,
      platform TEXT NOT NULL,
      platform_url TEXT,
      avatar_url TEXT,
      followers TEXT,
      verified INTEGER DEFAULT 0,
      category TEXT,
      promotion_title TEXT NOT NULL,
      caption TEXT,
      proof_media_url TEXT NOT NULL,
      proof_media_type TEXT DEFAULT 'image',
      promoted_date TEXT,
      highlight_badge TEXT,
      is_approved INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `;
  const res1 = await queryD1(createInfluencerTable);
  console.log('Result influencer_promotions:', JSON.stringify(res1));

  // 2. Table for Public / Member Promotions
  console.log('Creating table `public_promotions`...');
  const createPublicTable = `
    CREATE TABLE IF NOT EXISTS public_promotions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      handle TEXT NOT NULL,
      platform TEXT NOT NULL,
      platform_url TEXT,
      avatar_url TEXT,
      university_or_role TEXT,
      promotion_title TEXT NOT NULL,
      caption TEXT,
      proof_media_url TEXT NOT NULL,
      proof_media_type TEXT DEFAULT 'image',
      promoted_date TEXT,
      highlight_badge TEXT,
      is_approved INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `;
  const res2 = await queryD1(createPublicTable);
  console.log('Result public_promotions:', JSON.stringify(res2));

  // 3. Insert @fajaransh_ into public_promotions
  console.log('Inserting @fajaransh_ into public_promotions...');
  const insertFajarSql = `
    INSERT OR REPLACE INTO public_promotions (
      id, name, handle, platform, platform_url, avatar_url, university_or_role,
      promotion_title, caption, proof_media_url, proof_media_type,
      promoted_date, highlight_badge, is_approved, created_at
    ) VALUES (
      'pub-fajaransh',
      '파자르 (Fajar)',
      '@fajaransh_',
      'instagram',
      'https://www.instagram.com/fajaransh_/',
      '',
      'Fullstack & Web Dev (Head of SOOBIN Services)',
      'Service Tugas @soobinservices.id di Bio Instagram Resmi',
      '📌 Service Tugas @soobinservices.id • soobinservices.com/ dan 4 lainnya',
      '/images/proof/fajaransh_proof.jpg',
      'image',
      '31 Agu 2026',
      'Official Profile',
      1,
      '2026-08-31T23:03:00.000Z'
    );
  `;
  const res3 = await queryD1(insertFajarSql);
  console.log('Result insert @fajaransh_:', JSON.stringify(res3));

  // Check count
  const checkRes = await queryD1('SELECT * FROM public_promotions;');
  console.log('All Public Promotions in Cloudflare D1:', JSON.stringify(checkRes, null, 2));
}

initTablesAndSeed();
