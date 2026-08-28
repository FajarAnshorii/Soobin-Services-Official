import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';
import { verifyAdminRequest } from '@/lib/adminAuth';

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

    if (!success) {
      console.error('API GET Cloudflare D1 error:', error);
      return NextResponse.json([]);
    }

    const now = Date.now();
    const TWO_DAYS_MS = 48 * 60 * 60 * 1000;

    const formatted = (results || []).map((o: any) => {
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

    // Save directly to Cloudflare D1 Database Table
    const { success, error } = await queryD1(
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

    if (!success) {
      console.error('Cloudflare D1 order POST error:', error);
      return NextResponse.json({ error }, { status: 500 });
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

    // Update status in Cloudflare D1 SQL Table
    const { success, error } = await queryD1(
      'UPDATE orders SET payment_status = ? WHERE id = ?;',
      [status, orderId]
    );

    if (!success) {
      console.error('Cloudflare D1 order status update error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId, status });
  } catch (e: any) {
    console.error('API PUT orders error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

