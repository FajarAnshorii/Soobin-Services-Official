import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch from Supabase Orders Table (100% Realtime Cloud Database)
    const { data: supaOrders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('API GET Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const now = Date.now();
    const TWO_DAYS_MS = 48 * 60 * 60 * 1000;

    const formatted = (supaOrders || []).map((o: any) => {
      const orderTime = new Date(o.created_at || 0).getTime() || parseInt(String(o.id).replace(/\D/g, '') || '0', 10);
      const isExpired = orderTime > 0 && (now - orderTime) > TWO_DAYS_MS;

      return {
        id: o.id,
        customerName: o.customer_name || o.customerName || '',
        customerEmail: o.customer_email || o.customerEmail || '',
        serviceName: o.service_name || o.serviceName || '',
        price: o.price || 'Rp 0',
        paymentMethod: o.payment_method || o.paymentMethod || 'QRIS',
        paymentStatus: o.payment_status || o.paymentStatus || 'Menunggu Verifikasi Admin',
        customFields: o.custom_fields || o.customFields || {},
        proofImage: o.proof_image || o.proofImage || null,
        uploadedFileData: o.uploaded_file_data || o.uploadedFileData || null,
        uploadedFileName: o.uploaded_file_name || o.uploadedFileName || null,
        createdAt: o.created_at || o.createdAt,
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

    // Save directly to Supabase Cloud Database Table
    const { data, error } = await supabaseAdmin.from('orders').upsert({
      id: newOrder.id,
      customer_name: newOrder.customerName,
      customer_email: newOrder.customerEmail,
      service_name: newOrder.serviceName,
      price: newOrder.price,
      payment_method: newOrder.paymentMethod,
      payment_status: newOrder.paymentStatus || 'Menunggu Verifikasi Admin',
      custom_fields: newOrder.customFields || {},
      proof_image: newOrder.proofImage,
      uploaded_file_data: newOrder.uploadedFileData,
      uploaded_file_name: newOrder.uploadedFileName,
      created_at: newOrder.createdAt || new Date().toISOString(),
    }, { onConflict: 'id' }).select();

    if (error) {
      console.error('Supabase order POST error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: newOrder });
  } catch (e: any) {
    console.error('API POST orders error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
    }

    // Update status in Supabase Cloud Database Table immediately
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ payment_status: status })
      .eq('id', orderId)
      .select();

    if (error) {
      console.error('Supabase order status update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    console.error('API PUT orders error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
