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

async function initTables() {
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
  console.log('Result influencer_promotions:', res1);

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
  console.log('Result public_promotions:', res2);

  console.log('✅ Tables initialized successfully!');
}

initTables();
