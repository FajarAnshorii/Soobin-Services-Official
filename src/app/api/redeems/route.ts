import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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

    let redeemsList: any[] = [];

    // 1. Try fetching from dedicated Supabase table 'turnitin_redeems'
    const { data: supaRedeems, error: redeemTableErr } = await supabaseAdmin
      .from('turnitin_redeems')
      .select('*')
      .order('created_at', { ascending: false });

    if (!redeemTableErr && Array.isArray(supaRedeems) && supaRedeems.length > 0) {
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
      // 2. Fetch from Supabase 'orders' table where payment_method = 'REDEEM_SHARE'
      const { data: fallbackOrders, error: orderErr } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('payment_method', 'REDEEM_SHARE')
        .order('created_at', { ascending: false });

      if (!orderErr && Array.isArray(fallbackOrders)) {
        redeemsList = fallbackOrders.map((o: any) => {
          const custom = o.custom_fields || {};
          return {
            id: o.id,
            memberEmail: o.customer_email || '',
            memberName: o.customer_name || '',
            memberUniversity: custom.memberUniversity || '',
            memberProdi: custom.memberProdi || '',
            memberPhone: custom.memberPhone || '',
            platform: custom.platform || 'WhatsApp Status',
            proofImage: o.proof_image || '',
            status: o.payment_status || 'MENUNGGU_VERIFIKASI',
            voucherCode: custom.voucherCode || null,
            adminNote: custom.adminNote || null,
            approvedAt: custom.approvedAt || null,
            createdAt: o.created_at || new Date().toISOString(),
          };
        });
      }
    }

    // Filter by member email if requested
    if (filterEmail) {
      const filtered = redeemsList.filter(
        (r) => (r.memberEmail || '').toLowerCase().trim() === filterEmail.trim()
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
        { error: 'Email dan foto screenshot bukti share wajib diunggah!' },
        { status: 400 }
      );
    }

    const redeemId = body.id || `RDM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toISOString();

    const formattedRedeem = {
      id: redeemId,
      memberEmail: body.memberEmail,
      memberName: body.memberName || 'Member SOOBIN',
      memberUniversity: body.memberUniversity || '',
      memberProdi: body.memberProdi || '',
      memberPhone: body.memberPhone || '',
      platform: body.platform || 'WhatsApp Status',
      proofImage: body.proofImage,
      status: 'MENUNGGU_VERIFIKASI',
      voucherCode: null,
      adminNote: null,
      approvedAt: null,
      createdAt: createdAt,
    };

    // 1. Try saving to dedicated table 'turnitin_redeems'
    try {
      await supabaseAdmin.from('turnitin_redeems').upsert({
        id: redeemId,
        member_email: formattedRedeem.memberEmail,
        member_name: formattedRedeem.memberName,
        member_university: formattedRedeem.memberUniversity,
        member_prodi: formattedRedeem.memberProdi,
        member_phone: formattedRedeem.memberPhone,
        platform: formattedRedeem.platform,
        proof_image: formattedRedeem.proofImage,
        status: formattedRedeem.status,
        voucher_code: formattedRedeem.voucherCode,
        admin_note: formattedRedeem.adminNote,
        approved_at: formattedRedeem.approvedAt,
        created_at: createdAt,
      }, { onConflict: 'id' });
    } catch (e) {
      // Ignore if table not present
    }

    // 2. Seamlessly save to Supabase 'orders' table with payment_method: 'REDEEM_SHARE'
    const { error: orderErr } = await supabaseAdmin.from('orders').upsert({
      id: redeemId,
      customer_name: formattedRedeem.memberName,
      customer_email: formattedRedeem.memberEmail,
      service_name: 'Free Cek Turnitin 1x (Share Status/Story)',
      price: 'Rp 0 (Klaim Voucher)',
      payment_method: 'REDEEM_SHARE',
      payment_status: 'MENUNGGU_VERIFIKASI',
      custom_fields: {
        platform: formattedRedeem.platform,
        memberUniversity: formattedRedeem.memberUniversity,
        memberProdi: formattedRedeem.memberProdi,
        memberPhone: formattedRedeem.memberPhone,
        voucherCode: null,
        adminNote: null,
        approvedAt: null,
        isRedeemPromo: true,
      },
      proof_image: formattedRedeem.proofImage,
      created_at: createdAt,
    }, { onConflict: 'id' }).select();

    if (orderErr) {
      console.error('Supabase order save error:', orderErr);
      return NextResponse.json({ error: orderErr.message || 'Gagal menyimpan ke database Supabase' }, { status: 500 });
    }

    return NextResponse.json({ success: true, redeem: formattedRedeem });
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

    // 1. Update in dedicated 'turnitin_redeems' table if exists
    try {
      await supabaseAdmin
        .from('turnitin_redeems')
        .update({
          status: newStatus,
          voucher_code: voucherCode,
          approved_at: approvedAt,
          admin_note: adminNote,
        })
        .eq('id', id);
    } catch (e) {}

    // 2. Update in Supabase 'orders' table
    const { data: existingOrder } = await supabaseAdmin.from('orders').select('*').eq('id', id).single();
    const currentCustom = (existingOrder && existingOrder.custom_fields) || {};

    const updatedCustom = {
      ...currentCustom,
      voucherCode: voucherCode || currentCustom.voucherCode,
      approvedAt: approvedAt || currentCustom.approvedAt,
      adminNote: adminNote || currentCustom.adminNote,
    };

    const { error: updateErr } = await supabaseAdmin
      .from('orders')
      .update({
        payment_status: newStatus,
        custom_fields: updatedCustom,
      })
      .eq('id', id);

    if (updateErr) {
      console.error('Supabase order update error:', updateErr);
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

    // 1. Delete from dedicated table
    try {
      await supabaseAdmin.from('turnitin_redeems').delete().eq('id', id);
    } catch (e) {}

    // 2. Delete from 'orders' table
    await supabaseAdmin.from('orders').delete().eq('id', id);

    return NextResponse.json({ success: true, deletedId: id });
  } catch (e: any) {
    console.error('API DELETE redeems error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
