import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 1. GET - Fetch all services (or filter by category) from Supabase
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = supabaseAdmin
      .from('services')
      .select('*')
      .order('id', { ascending: true });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: supaServices, error } = await query;

    if (error) {
      console.error('Supabase services GET error:', error);
      return NextResponse.json({ error: error.message, services: [] }, { status: 500 });
    }

    return NextResponse.json(
      { services: supaServices || [] },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('API GET services error:', error);
    return NextResponse.json({ error: error.message || 'Failed fetching services', services: [] }, { status: 500 });
  }
}

// 2. POST - Create new service or upsert list of services
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // If payload is a single new service object
    if (body && !Array.isArray(body) && !body.services && body.name) {
      // Find highest existing ID to assign next ID if not provided
      let nextId = body.id;
      if (!nextId) {
        const { data: latest } = await supabaseAdmin
          .from('services')
          .select('id')
          .order('id', { ascending: false })
          .limit(1);

        nextId = (latest && latest[0]?.id ? latest[0].id : 0) + 1;
      }

      const newService = {
        id: nextId,
        category: body.category || 'umum',
        name: body.name,
        price: body.price || 'Chat Admin',
        description: body.description || 'Pengerjaan cepat & garansi kualitas hasil terbaik.',
        badge: body.badge || null,
      };

      const { data, error } = await supabaseAdmin
        .from('services')
        .insert([newService])
        .select();

      if (error) {
        console.error('Supabase create service error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, service: data?.[0] || newService });
    }

    // If payload is an array of services (bulk update / save)
    const serviceList = Array.isArray(body) ? body : (body.services || []);
    if (Array.isArray(serviceList) && serviceList.length > 0) {
      const payload = serviceList.map((s: any, idx: number) => ({
        id: s.id || (idx + 1),
        category: s.category || 'umum',
        name: s.name,
        price: s.price,
        description: s.description || 'Pengerjaan cepat & garansi kualitas hasil terbaik.',
        badge: s.badge || null,
      }));

      const { data, error } = await supabaseAdmin
        .from('services')
        .upsert(payload, { onConflict: 'id' })
        .select();

      if (error) {
        console.error('Supabase services bulk upsert error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, services: data || payload });
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (error: any) {
    console.error('API POST services error:', error);
    return NextResponse.json({ error: error.message || 'Failed saving services' }, { status: 500 });
  }
}

// 3. PUT - Update a specific service by ID
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, category, name, price, description, badge } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing service id' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('services')
      .update({
        ...(category !== undefined && { category }),
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price }),
        ...(description !== undefined && { description }),
        ...(badge !== undefined && { badge }),
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase update service error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, service: data?.[0] });
  } catch (error: any) {
    console.error('API PUT services error:', error);
    return NextResponse.json({ error: error.message || 'Failed updating service' }, { status: 500 });
  }
}

// 4. DELETE - Delete a service by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing service id parameter' }, { status: 400 });
    }

    const serviceId = parseInt(id, 10);
    const { error } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (error) {
      console.error('Supabase delete service error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: serviceId });
  } catch (error: any) {
    console.error('API DELETE services error:', error);
    return NextResponse.json({ error: error.message || 'Failed deleting service' }, { status: 500 });
  }
}
