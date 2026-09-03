import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface TestimonialItem {
  id: string;
  name: string;
  email?: string;
  university?: string;
  prodi?: string;
  serviceName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isApproved?: boolean;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isSummary = searchParams.get('summary') === 'true';
    const isFresh = searchParams.get('fresh') === 'true';
    const limit = searchParams.get('limit');

    // 1. FAST AGGREGATE SUMMARY FOR HERO BANNER (Only 1 row read in SQLite!)
    if (isSummary) {
      const { results } = await queryD1<{ totalCount: number; avgRating: number }>(
        'SELECT COUNT(*) as totalCount, ROUND(AVG(rating), 1) as avgRating FROM testimonials;'
      );

      const dbCount = results && results.length > 0 ? (results[0].totalCount || 0) : 0;
      const dbAvg = results && results.length > 0 && results[0].avgRating ? results[0].avgRating : 4.9;

      const totalCount = 3000 + dbCount;
      const avgRating = dbCount > 0 ? Number(((3000 * 4.9 + dbCount * dbAvg) / totalCount).toFixed(1)) : 4.9;

      return NextResponse.json({ totalCount, avgRating, memberReviewsCount: dbCount }, {
        headers: {
          'Cache-Control': isFresh ? 'no-store' : 'public, s-maxage=86400, stale-while-revalidate=3600',
        },
      });
    }

    // 2. STANDARD TESTIMONIALS LIST
    let sql = 'SELECT id, name, email, university, prodi, service_name as serviceName, rating, comment, created_at as createdAt, is_approved as isApproved FROM testimonials ORDER BY created_at DESC;';
    let params: any[] = [];

    if (limit) {
      sql = 'SELECT id, name, email, university, prodi, service_name as serviceName, rating, comment, created_at as createdAt, is_approved as isApproved FROM testimonials ORDER BY created_at DESC LIMIT ?;';
      params = [parseInt(limit, 10)];
    }

    const { results, error } = await queryD1(sql, params);

    if (error) {
      console.error('Cloudflare D1 testimonials GET error:', error);
      return NextResponse.json([], { status: 500 });
    }

    return NextResponse.json(results || [], {
      headers: {
        'Cache-Control': isFresh ? 'no-store' : 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    });
  } catch (e: any) {
    console.error('API GET testimonials error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, university, prodi, serviceName, rating, comment } = body;

    if (!name || !rating || !comment || !serviceName) {
      return NextResponse.json({ error: 'Data testimoni tidak lengkap' }, { status: 400 });
    }

    const id = `testi-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const { error } = await queryD1(
      `INSERT INTO testimonials (id, name, email, university, prodi, service_name, rating, comment, created_at, is_approved)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1);`,
      [id, name.trim(), email || '', university || 'Member SOOBIN', prodi || '', serviceName.trim(), Number(rating) || 5, comment.trim(), createdAt]
    );

    if (error) {
      console.error('Cloudflare D1 insert testimonial error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    const newTestimonial: TestimonialItem = {
      id,
      name: name.trim(),
      email: email || '',
      university: university || 'Member SOOBIN',
      prodi: prodi || '',
      serviceName: serviceName.trim(),
      rating: Number(rating) || 5,
      comment: comment.trim(),
      createdAt,
      isApproved: true,
    };

    return NextResponse.json({ success: true, testimonial: newTestimonial });
  } catch (e: any) {
    console.error('API POST testimonials error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID testimoni tidak valid' }, { status: 400 });
    }

    const { error } = await queryD1('DELETE FROM testimonials WHERE id = ?;', [id]);

    if (error) {
      console.error('Cloudflare D1 delete testimonial error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (e: any) {
    console.error('API DELETE testimonials error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
