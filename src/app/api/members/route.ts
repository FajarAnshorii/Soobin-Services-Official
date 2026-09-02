import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'edge';

const DEFAULT_MEMBERS = [
  {
    id: 'MBR-0001',
    name: 'Filda Felissa',
    email: 'fildafelissa01@gmail.com',
    university: 'Universitas Trunojoyo Madura',
    prodi: 'Ekonomi Syariah',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'MBR-0002',
    name: 'Dzikri Amirul Ashari',
    email: 'dzikriamirulash1@gmail.com',
    university: 'Universitas Trunojoyo Madura',
    prodi: 'S1 Sistem Informasi',
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    // Member list contains student PII and requires admin authentication
    const auth = await verifyAdminRequest(request);
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error || 'Akses ditolak' }, { status: 401 });
    }

    // 1. Fetch directly from Cloudflare D1 Serverless SQL Database
    const { results, success } = await queryD1<any>('SELECT * FROM members ORDER BY created_at ASC;');

    if (success && Array.isArray(results) && results.length > 0) {
      const formatted = results.map((m: any, idx: number) => {
        const isFilda = m.email?.toLowerCase() === 'fildafelissa01@gmail.com';
        return {
          id: m.id || `MBR-${String(idx + 1).padStart(4, '0')}`,
          name: m.name,
          email: m.email,
          university: isFilda ? 'Universitas Trunojoyo Madura' : m.university || 'Universitas Trunojoyo Madura',
          prodi: isFilda ? 'Ekonomi Syariah' : m.prodi || 'Program Studi S1',
          createdAt: m.created_at || m.createdAt || new Date().toISOString(),
        };
      });

      return NextResponse.json(formatted);
    }

    // 2. Fallback to Supabase Database (if Cloudflare D1 daily quota is exceeded or unavailable)
    try {
      const { data: supaMembers, error: supaErr } = await supabaseAdmin
        .from('members')
        .select('*')
        .order('created_at', { ascending: true });

      if (!supaErr && Array.isArray(supaMembers) && supaMembers.length > 0) {
        const formatted = supaMembers.map((m: any, idx: number) => {
          const isFilda = m.email?.toLowerCase() === 'fildafelissa01@gmail.com';
          return {
            id: m.id || `MBR-${String(idx + 1).padStart(4, '0')}`,
            name: m.name,
            email: m.email,
            university: isFilda ? 'Universitas Trunojoyo Madura' : m.university || 'Universitas Trunojoyo Madura',
            prodi: isFilda ? 'Ekonomi Syariah' : m.prodi || 'Program Studi S1',
            createdAt: m.created_at || m.createdAt || new Date().toISOString(),
          };
        });

        return NextResponse.json(formatted);
      }
    } catch (supaEx) {
      console.error('Supabase fallback error for members:', supaEx);
    }

    return NextResponse.json(DEFAULT_MEMBERS);
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
    const email = newMember.email.toLowerCase();
    const name = newMember.name || 'Member';
    const university = isFilda ? 'Universitas Trunojoyo Madura' : newMember.university || 'Universitas Trunojoyo Madura';
    const prodi = isFilda ? 'Ekonomi Syariah' : newMember.prodi || 'Program Studi S1';
    const createdAt = newMember.createdAt || new Date().toISOString();
    const passwordHash = newMember.passwordHash || null;
    const memberId = `MBR-${String(Date.now()).slice(-4)}`;

    // 1. Save directly to Cloudflare D1 SQL Table
    try {
      await queryD1(
        `INSERT INTO members (id, name, email, university, prodi, password_hash, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(email) DO UPDATE SET
           name=excluded.name,
           university=excluded.university,
           prodi=excluded.prodi,
           password_hash=COALESCE(excluded.password_hash, members.password_hash);`,
        [memberId, name, email, university, prodi, passwordHash, createdAt]
      );
    } catch (d1Err) {
      console.error('Cloudflare D1 member save error:', d1Err);
    }

    // 2. Dual-sync to Supabase members table
    try {
      await supabaseAdmin.from('members').upsert({
        id: memberId,
        name,
        email,
        university,
        prodi,
        created_at: createdAt,
      }, { onConflict: 'email' });
    } catch (supaErr) {
      console.error('Supabase member sync error:', supaErr);
    }

    const { results } = await queryD1('SELECT * FROM members ORDER BY created_at ASC;');
    if (results && results.length > 0) {
      return NextResponse.json(results);
    }

    const { data: supaList } = await supabaseAdmin.from('members').select('*').order('created_at', { ascending: true });
    return NextResponse.json(supaList || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed saving member' }, { status: 500 });
  }
}

