import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET all active chat sessions from Supabase
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      const { data, error } = await supabaseAdmin
        .from('chats')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return NextResponse.json(data || null);
    }

    // Fetch all chats for admin dashboard
    const { data, error } = await supabaseAdmin
      .from('chats')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Return as map { [id]: session } or array
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
          userUnreadCount: row.user_unread_count || 0,
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

// POST / Upsert chat session or message
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // If body contains whole chats map or single session
    if (body.id && body.name) {
      // Single session upsert
      const { error } = await supabaseAdmin.from('chats').upsert({
        id: body.id,
        name: body.name,
        email: body.email || '',
        university: body.university || '',
        prodi: body.prodi || '',
        unread_count: body.unreadCount || 0,
        user_unread_count: body.userUnreadCount || 0,
        messages: body.messages || [],
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // If body is a map of sessions
    if (typeof body === 'object' && !Array.isArray(body)) {
      const rows = Object.values(body).map((session: any) => ({
        id: session.id,
        name: session.name || 'Member',
        email: session.email || '',
        university: session.university || '',
        prodi: session.prodi || '',
        unread_count: session.unreadCount || 0,
        user_unread_count: session.userUnreadCount || 0,
        messages: session.messages || [],
        updated_at: session.lastUpdated || new Date().toISOString(),
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
