import { NextResponse } from 'next/server';

const BUCKET_URL = 'https://kvdb.io/sb_chats_fajar_official_2026/chats';

export async function GET() {
  try {
    const res = await fetch(BUCKET_URL, {
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
    
    const res = await fetch(BUCKET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // Use plain text to avoid any KVdb preflight issues
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Cloud returned status ${res.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('API POST chats error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
