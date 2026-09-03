import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 1. GET - Fetch all services (or filter by category) from Cloudflare D1
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let sql = 'SELECT * FROM services ORDER BY id ASC;';
    let params: any[] = [];

    if (category && category !== 'all') {
      sql = 'SELECT * FROM services WHERE category = ? ORDER BY id ASC;';
      params = [category];
    }

    const { results, error } = await queryD1(sql, params);

    if (error) {
      console.error('Cloudflare D1 services GET error:', error);
      return NextResponse.json({ error, services: [] }, { status: 500 });
    }

    const isFresh = searchParams.get('fresh') === 'true';

    return NextResponse.json(
      { services: results || [] },
      {
        headers: {
          'Cache-Control': isFresh ? 'no-store' : 'public, s-maxage=86400, stale-while-revalidate=3600',
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
      let nextId = body.id;
      if (!nextId) {
        const { results: latest } = await queryD1('SELECT id FROM services ORDER BY id DESC LIMIT 1;');
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

      const { error } = await queryD1(
        `INSERT INTO services (id, category, name, price, description, badge)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           category=excluded.category,
           name=excluded.name,
           price=excluded.price,
           description=excluded.description,
           badge=excluded.badge;`,
        [newService.id, newService.category, newService.name, newService.price, newService.description, newService.badge]
      );

      if (error) {
        console.error('Cloudflare D1 create service error:', error);
        return NextResponse.json({ error }, { status: 500 });
      }

      return NextResponse.json({ success: true, service: newService });
    }

    // If payload is an array of services (bulk update / save)
    const serviceList = Array.isArray(body) ? body : (body.services || []);
    if (Array.isArray(serviceList) && serviceList.length > 0) {
      for (const s of serviceList) {
        await queryD1(
          `INSERT INTO services (id, category, name, price, description, badge)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             category=excluded.category,
             name=excluded.name,
             price=excluded.price,
             description=excluded.description,
             badge=excluded.badge;`,
          [
            s.id,
            s.category || 'umum',
            s.name,
            s.price || 'Chat Admin',
            s.description || 'Pengerjaan cepat & garansi kualitas hasil terbaik.',
            s.badge || null,
          ]
        );
      }

      return NextResponse.json({ success: true, count: serviceList.length });
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

    const { error } = await queryD1(
      `UPDATE services SET
         category = COALESCE(?, category),
         name = COALESCE(?, name),
         price = COALESCE(?, price),
         description = COALESCE(?, description),
         badge = COALESCE(?, badge)
       WHERE id = ?;`,
      [category ?? null, name ?? null, price ?? null, description ?? null, badge ?? null, id]
    );

    if (error) {
      console.error('Cloudflare D1 update service error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, service: body });
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
    const { error } = await queryD1('DELETE FROM services WHERE id = ?;', [serviceId]);

    if (error) {
      console.error('Cloudflare D1 delete service error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: serviceId });
  } catch (error: any) {
    console.error('API DELETE services error:', error);
    return NextResponse.json({ error: error.message || 'Failed deleting service' }, { status: 500 });
  }
}
