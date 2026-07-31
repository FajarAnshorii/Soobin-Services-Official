import { NextResponse } from 'next/server';

const MEMBERS_BIN_URL = 'https://jsonbin-zeta.vercel.app/api/bins/SoobinMembersList';

const DEFAULT_MEMBERS = [
  {
    id: 'MBR-1001',
    name: 'Filda Felissa',
    email: 'fildafelissa01@gmail.com',
    university: 'Universitas Negeri Surabaya',
    prodi: 'Manajemen S1',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const res = await fetch(MEMBERS_BIN_URL, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json(DEFAULT_MEMBERS);
    }
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return NextResponse.json(data);
    }
    return NextResponse.json(DEFAULT_MEMBERS);
  } catch (error) {
    return NextResponse.json(DEFAULT_MEMBERS);
  }
}

export async function POST(request: Request) {
  try {
    const newMember = await request.json();

    // Fetch existing members
    let currentMembers: any[] = [];
    try {
      const getRes = await fetch(MEMBERS_BIN_URL, { cache: 'no-store' });
      if (getRes.ok) {
        const existing = await getRes.json();
        if (Array.isArray(existing)) currentMembers = existing;
      }
    } catch (e) {
      currentMembers = DEFAULT_MEMBERS;
    }

    if (currentMembers.length === 0) {
      currentMembers = DEFAULT_MEMBERS;
    }

    // Merge uniquely by email
    const memberMap = new Map<string, any>();
    currentMembers.forEach((m) => {
      if (m && m.email) memberMap.set(m.email.toLowerCase(), m);
    });

    if (newMember && newMember.email) {
      memberMap.set(newMember.email.toLowerCase(), {
        id: newMember.id || `MBR-${Date.now().toString().slice(-4)}`,
        name: newMember.name,
        email: newMember.email.toLowerCase(),
        university: newMember.university || 'Universitas Indonesia',
        prodi: newMember.prodi || 'Program Studi S1',
        createdAt: newMember.createdAt || new Date().toISOString(),
      });
    }

    const updatedList = Array.from(memberMap.values());

    await fetch(MEMBERS_BIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedList),
    });

    return NextResponse.json(updatedList);
  } catch (error) {
    return NextResponse.json({ error: 'Failed saving member' }, { status: 500 });
  }
}
