import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'edge';

function parseIsoDate(val: any): string {
  if (val && typeof val === 'string' && val.includes('T')) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

// GET all active chat sessions or a single session from Supabase
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      const { data, error } = await supabaseAdmin
        .from('chats')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        return NextResponse.json(null);
      }

      return NextResponse.json({
        id: data.id,
        name: data.name,
        email: data.email,
        university: data.university,
        prodi: data.prodi,
        unreadCount: data.unread_count || 0,
        userUnreadCount: 0,
        lastUpdated: data.updated_at,
        messages: data.messages || [],
      });
    }

    // Fetch all chats for admin dashboard
    const { data, error } = await supabaseAdmin
      .from('chats')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Return as map { [id]: session }
    const chatsMap: Record<string, any> = {};
    if (data && Array.isArray(data)) {
      data.forEach((row) => {
        chatsMap[row.id] = {
          id: row.id,
          name: row.name,
          email: row.email,
          university: row.university,
          prodi: row.prodi,
          unreadCount: row.unread_count || 0,
          userUnreadCount: 0,
          lastUpdated: row.updated_at,
          messages: row.messages || [],
        };
      });
    }

    return NextResponse.json(chatsMap);
  } catch (e: any) {
    console.error('API GET chats error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST / Upsert chat session or messages map to Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Single session upsert
    if (body && body.id && body.name) {
      const { error } = await supabaseAdmin.from('chats').upsert({
        id: body.id,
        name: body.name,
        email: body.email || '',
        university: body.university || '',
        prodi: body.prodi || '',
        unread_count: body.unreadCount || 0,
        messages: body.messages || [],
        updated_at: parseIsoDate(body.lastUpdated),
      });

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // Map of sessions upsert (e.g. from Admin dashboard)
    if (body && typeof body === 'object' && !Array.isArray(body)) {
      const rows = Object.values(body)
        .filter((session: any) => session && session.id && session.name)
        .map((session: any) => ({
          id: session.id,
          name: session.name || 'Member',
          email: session.email || '',
          university: session.university || '',
          prodi: session.prodi || '',
          unread_count: session.unreadCount || 0,
          messages: session.messages || [],
          updated_at: parseIsoDate(session.lastUpdated),
        }));

      if (rows.length > 0) {
        const { error } = await supabaseAdmin.from('chats').upsert(rows);
        if (error) throw error;
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('API POST chats error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE reset all chats (Admin action)
export async function DELETE() {
  try {
    const { error } = await supabaseAdmin.from('chats').delete().neq('id', 'non_existent_id');
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'All chats reset successfully' });
  } catch (e: any) {
    console.error('API DELETE chats error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
