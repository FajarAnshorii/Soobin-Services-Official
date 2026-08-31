import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface PromotionItem {
  id: string;
  targetGroup: 'influencer' | 'public';
  name: string;
  handle: string;
  platform: 'instagram' | 'tiktok' | 'facebook';
  platformUrl?: string;
  avatarUrl?: string;
  followers?: string;
  following?: string;
  universityOrRole?: string;
  verified?: boolean;
  category?: string;
  promotionTitle: string;
  caption?: string;
  proofMediaUrl: string;
  proofMediaType?: 'image' | 'video';
  promotedDate?: string;
  highlightBadge?: string;
  isApproved?: boolean;
  createdAt: string;
}

// Ensure table exists helper
async function ensureTables() {
  await queryD1(`
    CREATE TABLE IF NOT EXISTS influencer_promotions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      handle TEXT NOT NULL,
      platform TEXT NOT NULL,
      platform_url TEXT,
      avatar_url TEXT,
      followers TEXT,
      following TEXT,
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
  `);

  await queryD1(`
    CREATE TABLE IF NOT EXISTS public_promotions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      handle TEXT NOT NULL,
      platform TEXT NOT NULL,
      platform_url TEXT,
      avatar_url TEXT,
      university_or_role TEXT,
      followers TEXT,
      following TEXT,
      promotion_title TEXT NOT NULL,
      caption TEXT,
      proof_media_url TEXT NOT NULL,
      proof_media_type TEXT DEFAULT 'image',
      promoted_date TEXT,
      highlight_badge TEXT,
      is_approved INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);
}

// GET: Fetch promotions by targetGroup (influencer vs public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'influencer'; // 'influencer' or 'public'
    const limit = searchParams.get('limit');
    const adminMode = searchParams.get('all') === 'true';

    await ensureTables();

    let sql = '';
    const params: any[] = [];

    if (type === 'public') {
      sql = `
        SELECT 
          id,
          'public' as targetGroup,
          name,
          handle,
          platform,
          platform_url as platformUrl,
          avatar_url as avatarUrl,
          university_or_role as universityOrRole,
          followers,
          following,
          promotion_title as promotionTitle,
          caption,
          proof_media_url as proofMediaUrl,
          proof_media_type as proofMediaType,
          promoted_date as promotedDate,
          highlight_badge as highlightBadge,
          is_approved as isApproved,
          created_at as createdAt
        FROM public_promotions
        ${adminMode ? '' : 'WHERE is_approved = 1'}
        ORDER BY created_at DESC
      `;
    } else {
      sql = `
        SELECT 
          id,
          'influencer' as targetGroup,
          name,
          handle,
          platform,
          platform_url as platformUrl,
          avatar_url as avatarUrl,
          followers,
          following,
          verified,
          category,
          promotion_title as promotionTitle,
          caption,
          proof_media_url as proofMediaUrl,
          proof_media_type as proofMediaType,
          promoted_date as promotedDate,
          highlight_badge as highlightBadge,
          is_approved as isApproved,
          created_at as createdAt
        FROM influencer_promotions
        ${adminMode ? '' : 'WHERE is_approved = 1'}
        ORDER BY created_at DESC
      `;
    }

    if (limit) {
      sql += ' LIMIT ?;';
      params.push(parseInt(limit, 10));
    } else {
      sql += ';';
    }

    const { results, error } = await queryD1(sql, params);

    if (error) {
      console.error(`Cloudflare D1 ${type} promotions GET error:`, error);
      return NextResponse.json([], { status: 200 });
    }

    // Format boolean flags
    const formatted = (results || []).map((row: any) => ({
      ...row,
      verified: Boolean(row.verified),
      isApproved: Boolean(row.isApproved),
    }));

    return NextResponse.json(formatted, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    });
  } catch (e: any) {
    console.error('API GET promotions error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add or Update promotion (Influencer or Public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id: existingId,
      targetGroup = 'influencer',
      name,
      handle,
      platform = 'instagram',
      platformUrl,
      avatarUrl,
      followers,
      following,
      universityOrRole,
      verified = false,
      category,
      promotionTitle,
      caption,
      proofMediaUrl,
      proofMediaType = 'image',
      promotedDate,
      highlightBadge,
      isApproved = true,
    } = body;

    if (!name || !handle || !promotionTitle || !proofMediaUrl) {
      return NextResponse.json(
        { error: 'Field nama, handle (@username), judul promosi, dan URL foto/bukti promosi wajib diisi.' },
        { status: 400 }
      );
    }

    await ensureTables();

    const id = existingId || `${targetGroup === 'public' ? 'pub' : 'inf'}-${Date.now()}`;
    const createdAt = new Date().toISOString();

    if (targetGroup === 'public') {
      const { error } = await queryD1(
        `INSERT OR REPLACE INTO public_promotions (
          id, name, handle, platform, platform_url, avatar_url, university_or_role,
          followers, following, promotion_title, caption, proof_media_url, proof_media_type,
          promoted_date, highlight_badge, is_approved, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          id,
          name.trim(),
          handle.trim(),
          platform,
          platformUrl || '',
          avatarUrl || '',
          universityOrRole || '',
          followers || '',
          following || '',
          promotionTitle.trim(),
          caption || '',
          proofMediaUrl.trim(),
          proofMediaType,
          promotedDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          highlightBadge || '',
          isApproved ? 1 : 0,
          createdAt,
        ]
      );

      if (error) {
        console.error('Cloudflare D1 insert public_promotion error:', error);
        return NextResponse.json({ error }, { status: 500 });
      }
    } else {
      const { error } = await queryD1(
        `INSERT OR REPLACE INTO influencer_promotions (
          id, name, handle, platform, platform_url, avatar_url, followers, following, verified, category,
          promotion_title, caption, proof_media_url, proof_media_type,
          promoted_date, highlight_badge, is_approved, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          id,
          name.trim(),
          handle.trim(),
          platform,
          platformUrl || '',
          avatarUrl || '',
          followers || '',
          following || '',
          verified ? 1 : 0,
          category || '',
          promotionTitle.trim(),
          caption || '',
          proofMediaUrl.trim(),
          proofMediaType,
          promotedDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          highlightBadge || '',
          isApproved ? 1 : 0,
          createdAt,
        ]
      );

      if (error) {
        console.error('Cloudflare D1 insert influencer_promotion error:', error);
        return NextResponse.json({ error }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, id, message: 'Bukti promosi berhasil disimpan.' });
  } catch (e: any) {
    console.error('API POST promotions error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Remove promotion by id and targetGroup
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'influencer';

    if (!id) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    await ensureTables();

    const table = type === 'public' ? 'public_promotions' : 'influencer_promotions';
    const { error } = await queryD1(`DELETE FROM ${table} WHERE id = ?;`, [id]);

    if (error) {
      console.error(`Cloudflare D1 delete ${table} error:`, error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (e: any) {
    console.error('API DELETE promotions error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
