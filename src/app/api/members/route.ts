import { NextResponse } from 'next/server';

const MEMBERS_BIN_URL = 'https://jsonbin-zeta.vercel.app/api/bins/SoobinMembersList';

export async function GET() {
  try {
    const res = await fetch(MEMBERS_BIN_URL, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ members: [] });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ members: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(MEMBERS_BIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed saving members' }, { status: 500 });
  }
}
