import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const TESTIMONIALS_BIN_URL = 'https://jsonbin-zeta.vercel.app/api/bins/ETvGNQoZFy';

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

export async function GET() {
  try {
    // 1. Fetch from High-Availability Cloud Storage
    const res = await fetch(TESTIMONIALS_BIN_URL, { cache: 'no-store' });
    let testimonials: TestimonialItem[] = [];

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        testimonials = data;
      }
    }

    // 2. Try fetching from Supabase Table if available
    try {
      const { data: supaData, error } = await supabaseAdmin
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(supaData) && supaData.length > 0) {
        const supaFormatted: TestimonialItem[] = supaData.map((t: any) => ({
          id: t.id,
          name: t.name,
          email: t.email,
          university: t.university,
          prodi: t.prodi,
          serviceName: t.service_name || t.serviceName,
          rating: t.rating,
          comment: t.comment,
          createdAt: t.created_at || t.createdAt,
          isApproved: t.is_approved ?? true,
        }));

        // Merge without duplicates
        const map = new Map<string, TestimonialItem>();
        supaFormatted.forEach((item) => map.set(item.id, item));
        testimonials.forEach((item) => {
          if (!map.has(item.id)) map.set(item.id, item);
        });

        testimonials = Array.from(map.values());
      }
    } catch (e) {
      // Supabase table might not exist yet; fall back seamlessly to Cloud Storage
    }

    // Sort by createdAt descending
    testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(testimonials);
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

    const newTestimonial: TestimonialItem = {
      id: `testi-${Date.now()}`,
      name,
      email: email || '',
      university: university || 'Member SOOBIN',
      prodi: prodi || '',
      serviceName,
      rating: Number(rating) || 5,
      comment,
      createdAt: new Date().toISOString(),
      isApproved: true,
    };

    // 1. Fetch current testimonials from Cloud Storage
    let testimonials: TestimonialItem[] = [];
    const getRes = await fetch(TESTIMONIALS_BIN_URL, { cache: 'no-store' });
    if (getRes.ok) {
      const data = await getRes.json();
      if (Array.isArray(data)) {
        testimonials = data;
      }
    }

    // Unshift new testimonial
    testimonials = [newTestimonial, ...testimonials];

    // Save to Cloud Storage
    await fetch(TESTIMONIALS_BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonials),
    });

    // 2. Try saving to Supabase Table as well
    try {
      await supabaseAdmin.from('testimonials').upsert({
        id: newTestimonial.id,
        name: newTestimonial.name,
        email: newTestimonial.email,
        university: newTestimonial.university,
        prodi: newTestimonial.prodi,
        service_name: newTestimonial.serviceName,
        rating: newTestimonial.rating,
        comment: newTestimonial.comment,
        is_approved: true,
        created_at: newTestimonial.createdAt,
      });
    } catch (e) {
      // Ignore if Supabase table is not provisioned
    }

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

    // Fetch current testimonials from Cloud Storage
    const getRes = await fetch(TESTIMONIALS_BIN_URL, { cache: 'no-store' });
    if (getRes.ok) {
      const data = await getRes.json();
      if (Array.isArray(data)) {
        const updated = data.filter((t: TestimonialItem) => t.id !== id);
        await fetch(TESTIMONIALS_BIN_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
      }
    }

    // Try deleting from Supabase Table
    try {
      await supabaseAdmin.from('testimonials').delete().eq('id', id);
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('API DELETE testimonials error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
