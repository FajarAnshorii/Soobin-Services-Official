import { NextResponse } from 'next/server';

export const runtime = 'edge';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@soobin.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminsoobin123';
const SECRET_KEY = process.env.ADMIN_JWT_SECRET || 'soobin_admin_super_secret_key_2026';

// Helper to sign a token with SHA-256 HMAC using Web Crypto (Edge compatible)
async function createToken(payloadStr: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SECRET_KEY);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payloadStr)
  );
  const sigHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const b64Payload = btoa(payloadStr);
  return `${b64Payload}.${sigHex}`;
}

// Helper to verify a token
async function verifyToken(token: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [b64Payload, sigHex] = parts;
    const payloadStr = atob(b64Payload);
    const expectedSig = (await createToken(payloadStr)).split('.')[1];
    if (sigHex !== expectedSig) return false;

    const data = JSON.parse(payloadStr);
    if (!data.exp || Date.now() > data.exp) return false;
    if (data.role !== 'ADMIN') return false;

    return true;
  } catch {
    return false;
  }
}

// GET: Verify currently active admin session
export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const authHeader = request.headers.get('authorization') || '';
    
    // Check cookie
    let token = '';
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    for (const c of cookies) {
      if (c.startsWith('soobin_admin_token=')) {
        token = c.substring('soobin_admin_token='.length);
        break;
      }
    }

    // Check Bearer fallback
    if (!token && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const isValid = await verifyToken(token);
    if (!isValid) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      email: ADMIN_EMAIL,
      role: 'ADMIN',
    });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 });
  }
}

// POST: Secure Admin Login
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan password wajib diisi!' },
        { status: 400 }
      );
    }

    // Constant-time like comparison against server environment credentials
    const isEmailValid = email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
    const isPasswordValid = password === ADMIN_PASSWORD;

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Email atau password administrator salah!' },
        { status: 401 }
      );
    }

    // Token expires in 7 days
    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const payload = JSON.stringify({
      email: ADMIN_EMAIL,
      role: 'ADMIN',
      exp,
      iat: Date.now(),
    });

    const token = await createToken(payload);

    const res = NextResponse.json({
      success: true,
      email: ADMIN_EMAIL,
      token,
      message: 'Autentikasi admin berhasil!',
    });

    // Set secure HttpOnly cookie
    const isProd = process.env.NODE_ENV === 'production';
    res.headers.set(
      'Set-Cookie',
      `soobin_admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}${isProd ? '; Secure' : ''}`
    );

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE: Logout Admin
export async function DELETE() {
  const res = NextResponse.json({ success: true, message: 'Logout admin berhasil.' });
  res.headers.set(
    'Set-Cookie',
    'soobin_admin_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  );
  return res;
}
