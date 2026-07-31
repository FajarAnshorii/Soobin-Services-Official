import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const BIN_URL = 'https://jsonbin-zeta.vercel.app/api/bins/BwZ7LSeatW';

export async function GET() {
  try {
    // 1. Fetch from Supabase Orders Table
    const { data: supaOrders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(supaOrders) && supaOrders.length > 0) {
      const formatted = supaOrders.map((o: any) => ({
        id: o.id,
        customerName: o.customer_name || o.customerName,
        customerEmail: o.customer_email || o.customerEmail,
        serviceName: o.service_name || o.serviceName,
        price: o.price,
        paymentMethod: o.payment_method || o.paymentMethod,
        paymentStatus: o.payment_status || o.paymentStatus,
        customFields: o.custom_fields || o.customFields || {},
        proofImage: o.proof_image || o.proofImage,
        uploadedFileData: o.uploaded_file_data || o.uploadedFileData,
        uploadedFileName: o.uploaded_file_name || o.uploadedFileName,
        createdAt: o.created_at || o.createdAt,
      }));
      return NextResponse.json(formatted);
    }

    // 2. High-Availability Fallback Bin
    const res = await fetch(BIN_URL, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) return NextResponse.json([]);
      throw new Error(`Cloud returned status ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (e: any) {
    console.error('API GET orders error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newOrder = await request.json();

    // Save to Supabase Cloud Database Table
    try {
      await supabaseAdmin.from('orders').upsert({
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
      }, { onConflict: 'id' });
    } catch (err) {
      console.error('Supabase order POST error:', err);
    }

    // Save to High-Availability Cloud Bin
    const getRes = await fetch(BIN_URL, { cache: 'no-store' });
    let orders = [];
    if (getRes.ok) {
      const data = await getRes.json();
      if (Array.isArray(data)) {
        orders = data;
      }
    }

    orders = [newOrder, ...orders].slice(0, 50);

    await fetch(BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orders),
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (e: any) {
    console.error('API POST orders error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { orderId, status } = await request.json();

    // Update status in Supabase Cloud Database Table
    try {
      await supabaseAdmin
        .from('orders')
        .update({ payment_status: status })
        .eq('id', orderId);
    } catch (err) {
      console.error('Supabase order status update error:', err);
    }

    // Update status in Bin
    const getRes = await fetch(BIN_URL, { cache: 'no-store' });
    if (getRes.ok) {
      const data = await getRes.json();
      if (Array.isArray(data)) {
        const updated = data.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o));
        await fetch(BIN_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
        return NextResponse.json({ success: true, data: updated });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
