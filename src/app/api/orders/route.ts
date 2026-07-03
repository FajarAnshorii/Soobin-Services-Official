import { NextResponse } from 'next/server';

const BIN_URL = 'https://jsonbin-zeta.vercel.app/api/bins/BwZ7LSeatW';

export async function GET() {
  try {
    const res = await fetch(BIN_URL, {
      cache: 'no-store',
    });
    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json([]);
      }
      throw new Error(`Cloud returned status ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (e: any) {
    console.error('API GET orders error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newOrder = await request.json();

    // Fetch current orders from bin
    const getRes = await fetch(BIN_URL, { cache: 'no-store' });
    let orders = [];
    if (getRes.ok) {
      const data = await getRes.json();
      if (Array.isArray(data)) {
        orders = data;
      }
    }

    // Prepend new order and keep the latest 50 entries
    orders = [newOrder, ...orders].slice(0, 50);

    // Save back to bin
    const putRes = await fetch(BIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orders),
    });

    if (!putRes.ok) {
      throw new Error(`Cloud returned status ${putRes.status}`);
    }

    return NextResponse.json({ success: true, data: orders });
  } catch (e: any) {
    console.error('API POST orders error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
