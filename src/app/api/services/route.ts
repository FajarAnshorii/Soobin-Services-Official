import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const SERVICES_BIN_URL = 'https://jsonbin-zeta.vercel.app/api/bins/SoobinServicesConfig';

export async function GET() {
  try {
    // 1. Fetch all services from Supabase table
    const { data: supaServices, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .order('id', { ascending: true });

    if (!error && Array.isArray(supaServices) && supaServices.length > 0) {
      return NextResponse.json({ services: supaServices });
    }

    // 2. High-Availability Fallback Bin
    const res = await fetch(SERVICES_BIN_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.services) && data.services.length > 0) {
        return NextResponse.json(data);
      }
    }

    return NextResponse.json({ services: [] });
  } catch (error) {
    return NextResponse.json({ services: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const serviceList = Array.isArray(body) ? body : (body.services || []);

    // 1. Save / Update all services directly in Supabase PostgreSQL Table
    if (Array.isArray(serviceList) && serviceList.length > 0) {
      try {
        const payload = serviceList.map((s: any, idx: number) => ({
          id: s.id || (idx + 1),
          category: s.category || 'umum',
          name: s.name,
          price: s.price,
          description: s.description || 'Pengerjaan cepat & garansi kualitas hasil terbaik.',
          badge: s.badge || null,
        }));
        await supabaseAdmin.from('services').upsert(payload, { onConflict: 'id' });
      } catch (e) {
        console.error('Supabase services POST error:', e);
      }
    }

    // 2. Save to High-Availability Bin
    await fetch(SERVICES_BIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ services: serviceList }),
    });

    return NextResponse.json({ success: true, services: serviceList });
  } catch (error) {
    return NextResponse.json({ error: 'Failed saving services' }, { status: 500 });
  }
}
