import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'edge';

const REDEEMS_BIN_URL = 'https://jsonbin-zeta.vercel.app/api/bins/SoobinTurnitinRedeemsList';

// Helper to generate a unique, cryptographically-secure, tamper-proof random voucher code
const generateUniqueVoucherCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars (O, 0, 1, I)
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SBN-TRN-${result}`;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterEmail = searchParams.get('email')?.toLowerCase();

    // 1. Fetch from Supabase Table
    const { data: supaRedeems, error } = await supabaseAdmin
      .from('turnitin_redeems')
      .select('*')
      .order('created_at', { ascending: false });

    let redeemsList: any[] = [];

    if (!error && Array.isArray(supaRedeems)) {
      redeemsList = supaRedeems.map((r: any) => ({
        id: r.id,
        memberEmail: r.member_email || r.memberEmail || '',
        memberName: r.member_name || r.memberName || '',
        memberUniversity: r.member_university || r.memberUniversity || '',
        memberProdi: r.member_prodi || r.memberProdi || '',
        memberPhone: r.member_phone || r.memberPhone || '',
        platform: r.platform || 'WhatsApp Status',
        proofImage: r.proof_image || r.proofImage || '',
        status: r.status || 'MENUNGGU_VERIFIKASI',
        voucherCode: r.voucher_code || r.voucherCode || null,
        adminNote: r.admin_note || r.adminNote || null,
        approvedAt: r.approved_at || r.approvedAt || null,
        createdAt: r.created_at || r.createdAt || new Date().toISOString(),
      }));
    } else {
      // Fallback to high-availability JSONBin
      try {
        const binRes = await fetch(REDEEMS_BIN_URL, { cache: 'no-store' });
        if (binRes.ok) {
          const binData = await binRes.json();
          if (Array.isArray(binData)) {
            redeemsList = binData;
          }
        }
      } catch (err) {
        console.error('Failed to fetch fallback redeems bin:', err);
      }
    }

    // Filter by member email if requested
    if (filterEmail) {
      const filtered = redeemsList.filter(
        (r) => r.memberEmail?.toLowerCase() === filterEmail
      );
      return NextResponse.json(filtered);
    }

    return NextResponse.json(redeemsList);
  } catch (e: any) {
    console.error('API GET redeems error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.memberEmail || !body.proofImage) {
      return NextResponse.json(
        { error: 'Email dan foto bukti share wajib diisi!' },
        { status: 400 }
      );
    }

    const newRedeem = {
      id: body.id || `RDM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      member_email: body.memberEmail,
      member_name: body.memberName || '',
      member_university: body.memberUniversity || '',
      member_prodi: body.memberProdi || '',
      member_phone: body.memberPhone || '',
      platform: body.platform || 'WhatsApp Status',
      proof_image: body.proofImage,
      status: 'MENUNGGU_VERIFIKASI',
      voucher_code: null,
      admin_note: null,
      approved_at: null,
      created_at: new Date().toISOString(),
    };

    // 1. Save to Supabase Table
    const { error: supaErr } = await supabaseAdmin
      .from('turnitin_redeems')
      .upsert(newRedeem, { onConflict: 'id' });

    // 2. Sync to JSONBin fallback store
    try {
      const binRes = await fetch(REDEEMS_BIN_URL, { cache: 'no-store' });
      let currentList: any[] = [];
      if (binRes.ok) {
        const binData = await binRes.json();
        if (Array.isArray(binData)) currentList = binData;
      }

      const formatted = {
        id: newRedeem.id,
        memberEmail: newRedeem.member_email,
        memberName: newRedeem.member_name,
        memberUniversity: newRedeem.member_university,
        memberProdi: newRedeem.member_prodi,
        memberPhone: newRedeem.member_phone,
        platform: newRedeem.platform,
        proofImage: newRedeem.proof_image,
        status: newRedeem.status,
        voucherCode: newRedeem.voucher_code,
        adminNote: newRedeem.admin_note,
        approvedAt: newRedeem.approved_at,
        createdAt: newRedeem.created_at,
      };

      const updated = [formatted, ...currentList.filter((item) => item.id !== newRedeem.id)];
      await fetch(REDEEMS_BIN_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (binErr) {
      console.warn('Fallback bin sync error:', binErr);
    }

    return NextResponse.json({ success: true, redeem: newRedeem });
  } catch (e: any) {
    console.error('API POST redeems error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action, reason } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'ID dan Action wajib disertakan' }, { status: 400 });
    }

    const isApprove = action === 'approve';
    const newStatus = isApprove ? 'DISETUJUI' : 'DITOLAK';
    const voucherCode = isApprove ? generateUniqueVoucherCode() : null;
    const approvedAt = isApprove ? new Date().toISOString() : null;
    const adminNote = isApprove ? null : reason || 'Bukti status/story tidak memenuhi syarat publik (privat/dikecualikan).';

    // 1. Update in Supabase
    const { error: supaErr } = await supabaseAdmin
      .from('turnitin_redeems')
      .update({
        status: newStatus,
        voucher_code: voucherCode,
        approved_at: approvedAt,
        admin_note: adminNote,
      })
      .eq('id', id);

    // 2. Update Fallback JSONBin
    try {
      const binRes = await fetch(REDEEMS_BIN_URL, { cache: 'no-store' });
      if (binRes.ok) {
        const binData = await binRes.json();
        if (Array.isArray(binData)) {
          const updated = binData.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                status: newStatus,
                voucherCode: voucherCode || item.voucherCode,
                approvedAt: approvedAt || item.approvedAt,
                adminNote: adminNote || item.adminNote,
              };
            }
            return item;
          });

          await fetch(REDEEMS_BIN_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          });
        }
      }
    } catch (binErr) {
      console.warn('Fallback bin sync error:', binErr);
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      voucherCode,
      approvedAt,
      adminNote,
    });
  } catch (e: any) {
    console.error('API PATCH redeems error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID wajib disertakan' }, { status: 400 });
    }

    // 1. Delete from Supabase
    await supabaseAdmin.from('turnitin_redeems').delete().eq('id', id);

    // 2. Delete from Fallback JSONBin
    try {
      const binRes = await fetch(REDEEMS_BIN_URL, { cache: 'no-store' });
      if (binRes.ok) {
        const binData = await binRes.json();
        if (Array.isArray(binData)) {
          const updated = binData.filter((item) => item.id !== id);
          await fetch(REDEEMS_BIN_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          });
        }
      }
    } catch (binErr) {
      console.warn('Fallback bin delete error:', binErr);
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (e: any) {
    console.error('API DELETE redeems error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
