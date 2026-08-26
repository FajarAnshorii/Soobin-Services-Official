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

/**
 * Verifies if the incoming request is authenticated as an Admin.
 * Checks 'soobin_admin_token' cookie or 'Authorization: Bearer <token>' header.
 */
export async function verifyAdminRequest(request: Request): Promise<{ isAdmin: boolean; error?: string }> {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const authHeader = request.headers.get('authorization') || '';

    let token = '';
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    for (const c of cookies) {
      if (c.startsWith('soobin_admin_token=')) {
        token = c.substring('soobin_admin_token='.length);
        break;
      }
    }

    if (!token && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return { isAdmin: false, error: 'Akses ditolak: Autentikasi administrator diperlukan' };
    }

    const isValid = await verifyToken(token);
    if (!isValid) {
      return { isAdmin: false, error: 'Sesi administrator tidak valid atau telah kedaluwarsa' };
    }

    return { isAdmin: true };
  } catch (err: any) {
    return { isAdmin: false, error: err.message || 'Verifikasi autentikasi gagal' };
  }
}
