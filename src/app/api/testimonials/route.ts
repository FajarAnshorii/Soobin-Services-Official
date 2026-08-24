import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export interface TestimonialItem {
  id: string;
  name: string;
  email?: string;
  university?: string;
  prodi?: string;
  serviceName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isApproved?: boolean;
}

const STORE_ID = 'testi_store_official';

const DEFAULT_INITIAL_TESTIMONIALS: TestimonialItem[] = [
  { id: 't-1', name: 'Farhan Rizki', email: 'farhan@student.its.ac.id', university: 'ITS Surabaya', prodi: 'S1 Teknik Elektro', serviceName: 'Jasa Pembuatan Website & Aplikasi', rating: 5, comment: 'Kode Python untuk machine learning saya dibuatkan dengan penjelasan lengkap. Nilai akhirnya A!', createdAt: '2026-07-30T14:20:00.000Z', isApproved: true },
  { id: 't-2', name: 'Dewi Lestari', email: 'dewi.lestari@ipb.ac.id', university: 'IPB University', prodi: 'S1 Agronomi', serviceName: 'Pengolahan Data SPSS / SmartPLS / AMOS', rating: 5, comment: 'Data SPSS saya diolah dengan sempurna. Hasilnya rapi dan mudah dipahami. Makasih banyak!', createdAt: '2026-07-29T11:45:00.000Z', isApproved: true },
  { id: 't-3', name: 'Budi Santoso', email: 'budi.s@unpad.ac.id', university: 'Universitas Padjadjaran', prodi: 'S1 Kedokteran', serviceName: 'Formatting Jurnal & Fast Track Sinta', rating: 5, comment: 'Berhasil unlock semua jurnal yang saya butuhkan untuk skripsi. Proses cepat cuma 30 menit!', createdAt: '2026-07-28T09:15:00.000Z', isApproved: true },
  { id: 't-4', name: 'Siti Nurhaliza', email: 'siti.nur@ugm.ac.id', university: 'Universitas Gadjah Mada', prodi: 'S1 Farmasi', serviceName: 'Konsultasi Skripsi & Tugas Akhir', rating: 5, comment: 'Makalahnya berkualitas tinggi dan sesuai deadline. Revisi gratis sampai puas. Admin ramah banget!', createdAt: '2026-07-27T15:30:00.000Z', isApproved: true },
  { id: 't-5', name: 'Ahmad Pratama', email: 'ahmad.p@itb.ac.id', university: 'Institut Teknologi Bandung', prodi: 'S1 Teknik Informatika', serviceName: 'Jasa Parafrase & Turnitin 0%', rating: 5, comment: 'Pelayanannya cepat dan hasilnya akurat. Harga paling terjangkau dibanding tempat lain. Highly recommended!', createdAt: '2026-07-26T12:00:00.000Z', isApproved: true },
  { id: 't-6', name: 'Rina Wulandari', email: 'rina.w@ui.ac.id', university: 'Universitas Indonesia', prodi: 'S1 Hukum', serviceName: 'Jasa Parafrase & Cek Turnitin 0%', rating: 5, comment: 'Skripsi saya selesai tepat waktu dengan hasil yang memuaskan. Similarity Turnitin hanya 8%. Terima kasih Soobin!', createdAt: '2026-07-25T10:00:00.000Z', isApproved: true },
];

async function getStoredTestimonials(): Promise<TestimonialItem[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('chats')
      .select('messages')
      .eq('id', STORE_ID)
      .single();

    if (!error && data && Array.isArray(data.messages) && data.messages.length > 0) {
      return data.messages as TestimonialItem[];
    }
  } catch (e) {
    console.error('Error fetching testimonials from Supabase:', e);
  }
  return DEFAULT_INITIAL_TESTIMONIALS;
}

async function saveStoredTestimonials(list: TestimonialItem[]): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from('chats').upsert({
      id: STORE_ID,
      name: 'SOOBIN Testimonials Database',
      email: 'admin@soobin.com',
      university: 'Official System',
      prodi: 'Database',
      unread_count: list.length,
      messages: list,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch (e) {
    console.error('Error saving testimonials to Supabase:', e);
    return false;
  }
}

export async function GET() {
  try {
    const testimonials = await getStoredTestimonials();
    // Sort by createdAt descending (newest first)
    testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(testimonials);
  } catch (e: any) {
    console.error('API GET testimonials error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, university, prodi, serviceName, rating, comment } = body;

    if (!name || !rating || !comment || !serviceName) {
      return NextResponse.json({ error: 'Data testimoni tidak lengkap' }, { status: 400 });
    }

    const newTestimonial: TestimonialItem = {
      id: `testi-${Date.now()}`,
      name: name.trim(),
      email: email || '',
      university: university || 'Member SOOBIN',
      prodi: prodi || '',
      serviceName: serviceName.trim(),
      rating: Number(rating) || 5,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      isApproved: true,
    };

    const currentList = await getStoredTestimonials();
    const updatedList = [newTestimonial, ...currentList.filter((t) => t.id !== newTestimonial.id)];

    await saveStoredTestimonials(updatedList);

    return NextResponse.json({ success: true, testimonial: newTestimonial });
  } catch (e: any) {
    console.error('API POST testimonials error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID testimoni tidak valid' }, { status: 400 });
    }

    const currentList = await getStoredTestimonials();
    const updatedList = currentList.filter((t) => t.id !== id);

    await saveStoredTestimonials(updatedList);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('API DELETE testimonials error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
