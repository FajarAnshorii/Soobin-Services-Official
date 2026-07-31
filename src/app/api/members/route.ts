import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    // 1. Try fetching from Supabase Table
    const { data: supaMembers, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && Array.isArray(supaMembers) && supaMembers.length > 0) {
      const formatted = supaMembers.map((m: any, idx: number) => {
        const isFilda = m.email?.toLowerCase() === 'fildafelissa01@gmail.com';
        return {
          id: `MBR-${String(idx + 1).padStart(4, '0')}`,
          name: m.name,
          email: m.email,
          university: isFilda ? 'Universitas Trunojoyo Madura' : m.university || 'Universitas Indonesia',
          prodi: isFilda ? 'Ekonomi Syariah' : m.prodi || 'Program Studi S1',
          createdAt: m.created_at || m.createdAt || new Date().toISOString(),
        };
      });

      return NextResponse.json(formatted);
    }

    // 2. Fallback to High-Availability Cloud Database
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

    const formatted = data.map((m: any, idx: number) => {
      const isFilda = m.email?.toLowerCase() === 'fildafelissa01@gmail.com';
      return {
        ...m,
        id: `MBR-${String(idx + 1).padStart(4, '0')}`,
        university: isFilda ? 'Universitas Trunojoyo Madura' : m.university || 'Universitas Indonesia',
        prodi: isFilda ? 'Ekonomi Syariah' : m.prodi || 'Program Studi S1',
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json(DEFAULT_MEMBERS);
  }
}

export async function POST(request: Request) {
  try {
    const newMember = await request.json();

    if (!newMember || !newMember.email) {
      return NextResponse.json({ error: 'Invalid member data' }, { status: 400 });
    }

    const isFilda = newMember.email.toLowerCase() === 'fildafelissa01@gmail.com';
    const memberPayload = {
      name: newMember.name,
      email: newMember.email.toLowerCase(),
      university: isFilda ? 'Universitas Trunojoyo Madura' : newMember.university || 'Universitas Indonesia',
      prodi: isFilda ? 'Ekonomi Syariah' : newMember.prodi || 'Program Studi S1',
      created_at: newMember.createdAt || new Date().toISOString(),
    };

    // 1. Save to Supabase Cloud Database
    try {
      await supabase.from('members').upsert(memberPayload, { onConflict: 'email' });
    } catch (e) {
      console.error('Supabase save member error', e);
    }

    // 2. Save to High-Availability Cloud Database Sync
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

    memberMap.set(newMember.email.toLowerCase(), memberPayload);

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
