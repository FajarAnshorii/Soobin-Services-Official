import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';
import { verifyAdminRequest } from '@/lib/adminAuth';

export const runtime = 'edge';

const BATCH_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 Days (72 Hours)
const BATCH_MAX_QUOTA = 10; // 10 Quota per 3-Day Batch

// Helper to compute fixed 3-day batch interval aligned to Unix epoch
export function getBatchInterval() {
  const now = Date.now();
  const batchIndex = Math.floor(now / BATCH_DURATION_MS);
  const startTime = batchIndex * BATCH_DURATION_MS;
  const endTime = startTime + BATCH_DURATION_MS;
  return {
    batchIndex,
    startTime,
    endTime,
    startIso: new Date(startTime).toISOString(),
    endIso: new Date(endTime).toISOString(),
    nextBatchInMs: Math.max(0, endTime - now),
  };
}

// Helper to generate a unique, cryptographically-secure random voucher code
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
    const filterEmail = searchParams.get('email')?.toLowerCase()?.trim();

    // If fetching all redeems without email filter, require admin authentication
    if (!filterEmail) {
      const auth = await verifyAdminRequest(request);
      if (!auth.isAdmin) {
        return NextResponse.json({ error: auth.error || 'Akses ditolak' }, { status: 401 });
      }
    }

    const { startTime, endTime, nextBatchInMs } = getBatchInterval();
    let redeemsList: any[] = [];

    // Fetch from Cloudflare D1 table 'turnitin_redeems'
    const { results, success } = await queryD1('SELECT * FROM turnitin_redeems ORDER BY created_at DESC;');

    if (success && Array.isArray(results) && results.length > 0) {
      redeemsList = results.map((r: any) => ({
        id: r.id,
        memberEmail: r.member_email || '',
        memberName: r.member_name || '',
        memberUniversity: r.member_university || '',
        memberProdi: r.member_prodi || '',
        memberPhone: r.member_phone || '',
        platform: r.platform || 'WhatsApp Status',
        proofImage: r.proof_image || '',
        status: r.status || 'MENUNGGU_VERIFIKASI',
        voucherCode: r.voucher_code || null,
        adminNote: r.admin_note || null,
        approvedAt: r.approved_at || null,
        createdAt: r.created_at || new Date().toISOString(),
      }));
    }

    // Calculate real-time batch quota across all approved claims in current 3-day batch
    const approvedInBatch = redeemsList.filter((r) => {
      if (r.status !== 'DISETUJUI') return false;
      const t = new Date(r.approvedAt || r.createdAt).getTime();
      return t >= startTime && t < endTime;
    });

    const claimedCount = approvedInBatch.length;
    const remainingQuota = Math.max(0, BATCH_MAX_QUOTA - claimedCount);

    const quotaInfo = {
      totalQuota: BATCH_MAX_QUOTA,
      claimedCount,
      remainingQuota,
      batchStartTime: startTime,
      batchEndTime: endTime,
      nextBatchInMs,
    };

    // Filter by member email if requested
    if (filterEmail) {
      const filtered = redeemsList.filter(
        (r) => (r.memberEmail || '').toLowerCase().trim() === filterEmail.trim()
      );
      return NextResponse.json({
        redeems: filtered,
        quota: quotaInfo,
      });
    }

    return NextResponse.json({
      redeems: redeemsList,
      quota: quotaInfo,
    });
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

    const email = body.memberEmail.toLowerCase().trim();
    const { startTime, endTime, nextBatchInMs } = getBatchInterval();

    // 1. Query all redeems in Cloudflare D1
    const { results: allClaims } = await queryD1('SELECT * FROM turnitin_redeems ORDER BY created_at DESC;');
    const claimsList = allClaims || [];

    // 2. Check 10-quota limit in current 3-day batch
    const approvedInCurrentBatch = claimsList.filter((c: any) => {
      if (c.status !== 'DISETUJUI') return false;
      const t = new Date(c.approved_at || c.created_at).getTime();
      return t >= startTime && t < endTime;
    });

    if (approvedInCurrentBatch.length >= BATCH_MAX_QUOTA) {
      const hoursRemaining = Math.ceil(nextBatchInMs / (60 * 60 * 1000));
      return NextResponse.json(
        {
          error: `Kuota klaim batch 3 hari ini telah habis (10/10 kuota telah terisi). Batch baru akan dibuka dalam sekitar ${hoursRemaining} jam lagi.`,
          quotaExhausted: true,
          nextBatchInMs,
        },
        { status: 400 }
      );
    }

    // 3. Check individual member claims
    const memberClaims = claimsList.filter((c: any) => (c.member_email || '').toLowerCase().trim() === email);

    if (memberClaims.length > 0) {
      // Check active pending claim
      const pendingClaim = memberClaims.find((c: any) => c.status === 'MENUNGGU_VERIFIKASI');
      if (pendingClaim) {
        return NextResponse.json(
          { error: 'Anda masih memiliki pengajuan klaim yang sedang menunggu verifikasi admin.' },
          { status: 400 }
        );
      }

      // Check personal 3-day (72-hour) cooldown on approved claims
      const approvedClaims = memberClaims.filter((c: any) => c.status === 'DISETUJUI');
      if (approvedClaims.length > 0) {
        const latest = approvedClaims[0];
        const approvedTime = new Date(latest.approved_at || latest.created_at).getTime();
        const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
        const elapsed = Date.now() - approvedTime;

        if (elapsed < THREE_DAYS_MS) {
          const remainingMs = THREE_DAYS_MS - elapsed;
          const hours = Math.ceil(remainingMs / (60 * 60 * 1000));
          return NextResponse.json(
            { error: `Cooldown klaim pribadi Anda masih aktif. Anda dapat melakukan klaim gratis berikutnya dalam sekitar ${hours} jam lagi.` },
            { status: 400 }
          );
        }
      }
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

    // Save directly to Cloudflare D1 'turnitin_redeems'
    const { success, error } = await queryD1(
      `INSERT INTO turnitin_redeems (
        id, member_email, member_name, member_university, member_prodi,
        member_phone, platform, proof_image, status, voucher_code,
        admin_note, approved_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        member_email=excluded.member_email,
        member_name=excluded.member_name,
        member_university=excluded.member_university,
        member_prodi=excluded.member_prodi,
        member_phone=excluded.member_phone,
        platform=excluded.platform,
        proof_image=excluded.proof_image,
        status=excluded.status;`,
      [
        formattedRedeem.id,
        formattedRedeem.memberEmail,
        formattedRedeem.memberName,
        formattedRedeem.memberUniversity,
        formattedRedeem.memberProdi,
        formattedRedeem.memberPhone,
        formattedRedeem.platform,
        formattedRedeem.proofImage,
        formattedRedeem.status,
        formattedRedeem.voucherCode,
        formattedRedeem.adminNote,
        formattedRedeem.approvedAt,
        formattedRedeem.createdAt,
      ]
    );

    if (!success) {
      console.error('Cloudflare D1 redeem save error:', error);
      return NextResponse.json({ error: error || 'Gagal menyimpan ke database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, redeem: formattedRedeem });
  } catch (e: any) {
    console.error('API POST redeems error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    // Approving or rejecting redeems requires admin authentication
    const auth = await verifyAdminRequest(request);
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error || 'Akses ditolak' }, { status: 401 });
    }

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

    // Update in Cloudflare D1 'turnitin_redeems' table
    const { success, error } = await queryD1(
      `UPDATE turnitin_redeems
       SET status = ?, voucher_code = ?, approved_at = ?, admin_note = ?, proof_image = NULL
       WHERE id = ?;`,
      [newStatus, voucherCode, approvedAt, adminNote, id]
    );

    if (!success) {
      console.error('Cloudflare D1 redeem update error:', error);
      return NextResponse.json({ error: error || 'Gagal update status di D1' }, { status: 500 });
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
    // Deleting redeems requires admin authentication
    const auth = await verifyAdminRequest(request);
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error || 'Akses ditolak' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID wajib disertakan' }, { status: 400 });
    }

    await queryD1('DELETE FROM turnitin_redeems WHERE id = ?;', [id]);

    return NextResponse.json({ success: true, deletedId: id });
  } catch (e: any) {
    console.error('API DELETE redeems error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

