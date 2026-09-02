import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'edge';

const EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function parseIsoDate(val: any): string {
  if (val && typeof val === 'string' && val.includes('T')) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

/**
 * Otomatis membersihkan payload media foto yang sudah melewati batas 24 jam
 * agar kapasitas database tetap sangat hemat dan loading cepat.
 */
function pruneExpiredMedia(messages: any[]): { messages: any[]; hasPruned: boolean } {
  if (!Array.isArray(messages)) return { messages: [], hasPruned: false };
  const now = Date.now();
  let hasPruned = false;

  const cleaned = messages.map((m) => {
    if (!m) return m;
    const msgTime = new Date(m.timestamp || 0).getTime();
    if (msgTime > 0 && now - msgTime > EXPIRATION_MS) {
      if (m.mediaUrl || m.fileUrl || m.fileName) {
        hasPruned = true;
        return {
          ...m,
          mediaUrl: null,
          fileUrl: null,
          fileName: null,
          mediaPruned: true,
          text: m.text ? `${m.text} (Lampiran kedaluwarsa)` : 'Lampiran media telah kedaluwarsa (24 jam)',
        };
      }
    }
    return m;
  });

  return { messages: cleaned, hasPruned };
}

// GET all active chat sessions or a single session from Cloudflare D1
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      const { results } = await queryD1('SELECT * FROM chats WHERE id = ? LIMIT 1;', [sessionId]);
      let data = results && results.length > 0 ? results[0] : null;

      if (!data) {
        // Fallback to Supabase
        try {
          const { data: supaChat } = await supabaseAdmin.from('chats').select('*').eq('id', sessionId).single();
          if (supaChat) data = supaChat;
        } catch (e) {}
      }

      if (!data) {
        return NextResponse.json(null);
      }

      let parsedMessages: any[] = [];
      try {
        parsedMessages = typeof data.messages === 'string' ? JSON.parse(data.messages) : data.messages || [];
      } catch (e) {}

      const { messages: cleanedMessages, hasPruned } = pruneExpiredMedia(parsedMessages);

      if (hasPruned) {
        queryD1('UPDATE chats SET messages = ? WHERE id = ?;', [JSON.stringify(cleanedMessages), sessionId]).catch(() => {});
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
        messages: cleanedMessages,
      });
    }

    // Fetch all chats requires admin authentication
    const auth = await verifyAdminRequest(request);
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error || 'Akses ditolak' }, { status: 401 });
    }

    const { results, success } = await queryD1('SELECT * FROM chats ORDER BY updated_at DESC;');
    let chatRows = results;

    // Fallback to Supabase if Cloudflare D1 is rate-limited or empty
    if (!success || !Array.isArray(results) || results.length === 0) {
      try {
        const { data: supaChats, error: supaErr } = await supabaseAdmin
          .from('chats')
          .select('*')
          .order('updated_at', { ascending: false });
        if (!supaErr && Array.isArray(supaChats) && supaChats.length > 0) {
          chatRows = supaChats;
        }
      } catch (supaEx) {
        console.error('Supabase chats fallback error:', supaEx);
      }
    }

    // Return as map { [id]: session }
    const chatsMap: Record<string, any> = {};
    if (chatRows && Array.isArray(chatRows)) {
      chatRows.forEach((row: any) => {
        let parsedMessages: any[] = [];
        try {
          parsedMessages = typeof row.messages === 'string' ? JSON.parse(row.messages) : row.messages || [];
        } catch (e) {}

        const { messages: cleanedMessages } = pruneExpiredMedia(parsedMessages);
        chatsMap[row.id] = {
          id: row.id,
          name: row.name,
          email: row.email,
          university: row.university,
          prodi: row.prodi,
          unreadCount: row.unread_count || 0,
          userUnreadCount: 0,
          lastUpdated: row.updated_at,
          messages: cleanedMessages,
        };
      });
    }

    return NextResponse.json(chatsMap);
  } catch (e: any) {
    console.error('API GET chats error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST / Upsert chat session or messages map to Cloudflare D1
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Single session upsert from user
    if (body && body.id && body.name) {
      const { messages: cleanedMessages } = pruneExpiredMedia(body.messages || []);
      const messagesStr = JSON.stringify(cleanedMessages);
      const updatedAt = parseIsoDate(body.lastUpdated);

      try {
        await queryD1(
          `INSERT INTO chats (id, name, email, university, prodi, unread_count, messages, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             name=excluded.name,
             email=excluded.email,
             university=excluded.university,
             prodi=excluded.prodi,
             unread_count=excluded.unread_count,
             messages=excluded.messages,
             updated_at=excluded.updated_at;`,
          [
            body.id,
            body.name,
            body.email || '',
            body.university || '',
            body.prodi || '',
            body.unreadCount || 0,
            messagesStr,
            updatedAt,
          ]
        );
      } catch (d1Err) {
        console.error('Cloudflare D1 chat save error:', d1Err);
      }

      // Dual-sync to Supabase
      try {
        await supabaseAdmin.from('chats').upsert({
          id: body.id,
          name: body.name,
          email: body.email || '',
          university: body.university || '',
          prodi: body.prodi || '',
          unread_count: body.unreadCount || 0,
          messages: cleanedMessages,
          updated_at: updatedAt,
        }, { onConflict: 'id' });
      } catch (supaErr) {
        console.error('Supabase chat save error:', supaErr);
      }

      return NextResponse.json({ success: true });
    }

    // Map of sessions upsert (Admin bulk response)
    if (body && typeof body === 'object' && !Array.isArray(body)) {
      const auth = await verifyAdminRequest(request);
      if (!auth.isAdmin) {
        return NextResponse.json({ error: auth.error || 'Akses ditolak' }, { status: 401 });
      }

      for (const session of Object.values(body) as any[]) {
        if (session && session.id && session.name) {
          const { messages: cleanedMessages } = pruneExpiredMedia(session.messages || []);
          const messagesStr = JSON.stringify(cleanedMessages);
          const updatedAt = parseIsoDate(session.lastUpdated);

          try {
            await queryD1(
              `INSERT INTO chats (id, name, email, university, prodi, unread_count, messages, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET
                 name=excluded.name,
                 email=excluded.email,
                 university=excluded.university,
                 prodi=excluded.prodi,
                 unread_count=excluded.unread_count,
                 messages=excluded.messages,
                 updated_at=excluded.updated_at;`,
              [
                session.id,
                session.name || 'Member',
                session.email || '',
                session.university || '',
                session.prodi || '',
                session.unreadCount || 0,
                messagesStr,
                updatedAt,
              ]
            );
          } catch (d1Err) {
            console.error('Cloudflare D1 bulk chat save error:', d1Err);
          }

          // Dual-sync to Supabase
          try {
            await supabaseAdmin.from('chats').upsert({
              id: session.id,
              name: session.name || 'Member',
              email: session.email || '',
              university: session.university || '',
              prodi: session.prodi || '',
              unread_count: session.unreadCount || 0,
              messages: cleanedMessages,
              updated_at: updatedAt,
            }, { onConflict: 'id' });
          } catch (supaErr) {
            console.error('Supabase bulk chat save error:', supaErr);
          }
        }
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
export async function DELETE(request: Request) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error || 'Akses ditolak' }, { status: 401 });
    }

    await queryD1('DELETE FROM chats;');
    return NextResponse.json({ success: true, message: 'All chats reset successfully' });
  } catch (e: any) {
    console.error('API DELETE chats error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

