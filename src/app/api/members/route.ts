import { NextResponse } from 'next/server';

const MEMBERS_BIN_URL = 'https://jsonbin-zeta.vercel.app/api/bins/SoobinMembersList';

const DEFAULT_MEMBERS = [
  {
    id: 'MBR-0001',
    name: 'Filda Felissa',
    email: 'fildafelissa01@gmail.com',
    university: 'Universitas Trunojoyo Madura',
    prodi: 'Ekonomi Syariah',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const res = await fetch(MEMBERS_BIN_URL, { cache: 'no-store' });
    let data: any[] = [];
    if (res.ok) {
      const parsed = await res.json();
      if (Array.isArray(parsed) && parsed.length > 0) {
        data = parsed;
      }
    }

    if (data.length === 0) {
      data = DEFAULT_MEMBERS;
    }

    // Ensure member data aligns with official website profile (e.g. Filda Felissa -> Universitas Trunojoyo Madura, Ekonomi Syariah)
    const formatted = data.map((m: any, idx: number) => {
      const isFilda = m.email?.toLowerCase() === 'fildafelissa01@gmail.com';
      return {
        ...m,
        id: `MBR-${String(idx + 1).padStart(4, '0')}`,
        university: isFilda ? 'Universitas Trunojoyo Madura' : m.university || 'Universitas Indonesia',
        prodi: isFilda ? 'Ekonomi Syariah' : m.prodi || 'Program Studi S1',
      };
    });

    // Update cloud store async with corrected data
    fetch(MEMBERS_BIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formatted),
    }).catch(console.error);

    return NextResponse.json(formatted);
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
      if (m && m.email) {
        const isF = m.email.toLowerCase() === 'fildafelissa01@gmail.com';
        memberMap.set(m.email.toLowerCase(), {
          ...m,
          university: isF ? 'Universitas Trunojoyo Madura' : m.university,
          prodi: isF ? 'Ekonomi Syariah' : m.prodi,
        });
      }
    });

    if (newMember && newMember.email) {
      const isFilda = newMember.email.toLowerCase() === 'fildafelissa01@gmail.com';
      const nextIndex = memberMap.size + 1;

      memberMap.set(newMember.email.toLowerCase(), {
        id: `MBR-${String(nextIndex).padStart(4, '0')}`,
        name: newMember.name,
        email: newMember.email.toLowerCase(),
        university: isFilda ? 'Universitas Trunojoyo Madura' : newMember.university || 'Universitas Indonesia',
        prodi: isFilda ? 'Ekonomi Syariah' : newMember.prodi || 'Program Studi S1',
        createdAt: newMember.createdAt || new Date().toISOString(),
      });
    }

    const updatedList = Array.from(memberMap.values()).map((m: any, idx: number) => ({
      ...m,
      id: `MBR-${String(idx + 1).padStart(4, '0')}`,
    }));

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
