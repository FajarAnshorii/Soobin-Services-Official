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

async function updateSchemaAndData() {
  console.log('--- Updating D1 Schema & Data for Followers/Following ---');

  // Alter table if column missing (safe add)
  await queryD1(`ALTER TABLE public_promotions ADD COLUMN followers TEXT;`).catch(() => {});
  await queryD1(`ALTER TABLE public_promotions ADD COLUMN following TEXT;`).catch(() => {});
  await queryD1(`ALTER TABLE influencer_promotions ADD COLUMN following TEXT;`).catch(() => {});

  const updateSql = `
    INSERT OR REPLACE INTO public_promotions (
      id, name, handle, platform, platform_url, avatar_url, university_or_role,
      followers, following, promotion_title, caption, proof_media_url, proof_media_type,
      promoted_date, highlight_badge, is_approved, created_at
    ) VALUES (
      'pub-fajaransh',
      '파자르 (Fajar)',
      '@fajaransh_',
      'instagram',
      'https://www.instagram.com/fajaransh_/',
      '/images/proof/fajaransh_avatar.jpg',
      'Fullstack & Web Dev (Head of SOOBIN Services)',
      '1.830',
      '1.033',
      'Instagram Story Promosi: Jasa Service Trusted 2023 - SOOBIN Services',
      '“Solusi kebutuhan akademikmu” • @soobinservices.id • https://soobinservices.com/',
      '/images/proof/fajaransh_story_proof.jpg',
      'image',
      '31 Agu 2026',
      'Official Story Proof',
      1,
      '2026-08-31T23:05:00.000Z'
    );
  `;

  const res = await queryD1(updateSql);
  console.log('Update Result:', JSON.stringify(res));

  const check = await queryD1('SELECT * FROM public_promotions WHERE id = ?;', ['pub-fajaransh']);
  console.log('Current DB Record:', JSON.stringify(check, null, 2));
}

updateSchemaAndData();
