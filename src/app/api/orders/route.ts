import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterEmail = searchParams.get('email')?.toLowerCase()?.trim();

    // If fetching all customer orders without email filter, require admin authentication
    if (!filterEmail) {
      const auth = await verifyAdminRequest(request);
      if (!auth.isAdmin) {
        return NextResponse.json({ error: auth.error || 'Akses ditolak' }, { status: 401 });
      }
    }

    // Build Cloudflare D1 Query
    let sql = 'SELECT * FROM orders';
    const params: any[] = [];

    if (filterEmail) {
      sql += ' WHERE customer_email = ?';
      params.push(filterEmail);
    }

    sql += ' ORDER BY created_at DESC;';

    const { results, success, error } = await queryD1(sql, params);

    let rawOrders = results;

    // Fallback to Supabase if Cloudflare D1 is rate-limited or fails
    if (!success || !Array.isArray(results) || results.length === 0) {
      try {
        let query = supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false });
        if (filterEmail) {
          query = query.eq('customer_email', filterEmail);
        }
        const { data: supaOrders, error: supaErr } = await query;
        if (!supaErr && Array.isArray(supaOrders) && supaOrders.length > 0) {
          rawOrders = supaOrders;
        }
      } catch (supaEx) {
        console.error('Supabase orders fallback error:', supaEx);
      }
    }

    const now = Date.now();
    const TWO_DAYS_MS = 48 * 60 * 60 * 1000;

    const formatted = (rawOrders || []).map((o: any) => {
      const orderTime = new Date(o.created_at || 0).getTime() || parseInt(String(o.id).replace(/\D/g, '') || '0', 10);
      const isExpired = orderTime > 0 && (now - orderTime) > TWO_DAYS_MS;

      let customFields = {};
      try {
        if (typeof o.custom_fields === 'string') {
          customFields = JSON.parse(o.custom_fields);
        } else if (typeof o.custom_fields === 'object' && o.custom_fields !== null) {
          customFields = o.custom_fields;
        }
      } catch (e) {}

      return {
        id: o.id,
        customerName: o.customer_name || '',
        customerEmail: o.customer_email || '',
        serviceName: o.service_name || '',
        price: o.price || 'Rp 0',
        paymentMethod: o.payment_method || 'QRIS',
        paymentStatus: o.payment_status || 'Menunggu Verifikasi Admin',
        customFields,
        proofImage: o.proof_image || null,
        uploadedFileData: o.uploaded_file_data || null,
        uploadedFileName: o.uploaded_file_name || null,
        createdAt: o.created_at,
        isFileExpired: isExpired,
      };
    });

    return NextResponse.json(formatted);
  } catch (e: any) {
    console.error('API GET orders error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newOrder = await request.json();

    if (!newOrder || !newOrder.customerEmail || !newOrder.serviceName) {
      return NextResponse.json({ error: 'Data pesanan tidak lengkap' }, { status: 400 });
    }

    const customFieldsStr = typeof newOrder.customFields === 'object' 
      ? JSON.stringify(newOrder.customFields) 
      : String(newOrder.customFields || '{}');

    // 1. Save to Cloudflare D1 Database Table
    try {
      await queryD1(
        `INSERT INTO orders (
          id, customer_name, customer_email, service_name, price,
          payment_method, payment_status, custom_fields, proof_image,
          uploaded_file_data, uploaded_file_name, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          customer_name=excluded.customer_name,
          customer_email=excluded.customer_email,
          service_name=excluded.service_name,
          price=excluded.price,
          payment_method=excluded.payment_method,
          payment_status=excluded.payment_status,
          custom_fields=excluded.custom_fields,
          proof_image=COALESCE(excluded.proof_image, orders.proof_image),
          uploaded_file_data=COALESCE(excluded.uploaded_file_data, orders.uploaded_file_data),
          uploaded_file_name=COALESCE(excluded.uploaded_file_name, orders.uploaded_file_name);`,
        [
          newOrder.id,
          newOrder.customerName || '',
          newOrder.customerEmail || '',
          newOrder.serviceName || '',
          newOrder.price || '',
          newOrder.paymentMethod || 'QRIS',
          newOrder.paymentStatus || 'Menunggu Verifikasi Admin',
          customFieldsStr,
          newOrder.proofImage || null,
          newOrder.uploadedFileData || null,
          newOrder.uploadedFileName || null,
          newOrder.createdAt || new Date().toISOString(),
        ]
      );
    } catch (d1Err) {
      console.error('Cloudflare D1 order POST error:', d1Err);
    }

    // 2. Dual-sync to Supabase orders table
    try {
      await supabaseAdmin.from('orders').upsert({
        id: newOrder.id,
        customer_name: newOrder.customerName || '',
        customer_email: newOrder.customerEmail || '',
        service_name: newOrder.serviceName || '',
        price: newOrder.price || '',
        payment_method: newOrder.paymentMethod || 'QRIS',
        payment_status: newOrder.paymentStatus || 'Menunggu Verifikasi Admin',
        custom_fields: typeof newOrder.customFields === 'object' ? newOrder.customFields : {},
        proof_image: newOrder.proofImage || null,
        uploaded_file_data: newOrder.uploadedFileData || null,
        uploaded_file_name: newOrder.uploadedFileName || null,
        created_at: newOrder.createdAt || new Date().toISOString(),
      }, { onConflict: 'id' });
    } catch (supaErr) {
      console.error('Supabase order POST error:', supaErr);
    }

    return NextResponse.json({ success: true, data: newOrder });
  } catch (e: any) {
    console.error('API POST orders error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Updating order status requires admin authentication
    const auth = await verifyAdminRequest(request);
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error || 'Akses ditolak' }, { status: 401 });
    }

    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
    }

    // 1. Update status in Cloudflare D1 SQL Table
    try {
      await queryD1(
        'UPDATE orders SET payment_status = ? WHERE id = ?;',
        [status, orderId]
      );
    } catch (d1Err) {
      console.error('Cloudflare D1 order status update error:', d1Err);
    }

    // 2. Dual-sync status to Supabase
    try {
      await supabaseAdmin.from('orders').update({
        payment_status: status
      }).eq('id', orderId);
    } catch (supaErr) {
      console.error('Supabase order status update error:', supaErr);
    }

    return NextResponse.json({ success: true, orderId, status });
  } catch (e: any) {
    console.error('API PUT orders error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

