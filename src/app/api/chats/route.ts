import { NextResponse } from 'next/server';

const BIN_URL = 'https://jsonbin-zeta.vercel.app/api/bins/ca2wvC1r_M';

export async function GET() {
  try {
    const res = await fetch(BIN_URL, {
      cache: 'no-store',
    });
    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({});
      }
      throw new Error(`Cloud returned status ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    console.error('API GET chats error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const res = await fetch(BIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Cloud returned status ${res.status}`);
    }

    const result = await res.json();
    return NextResponse.json({ success: true, data: result.data });
  } catch (e: any) {
    console.error('API POST chats error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
