import { NextResponse } from 'next/server';

export const runtime = 'edge';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6LdkeN8sAAAAALVnTKjeAP052GUM9paFLQ25Fnto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token reCAPTCHA tidak ditemukan. Harap centang verifikasi!' },
        { status: 400 }
      );
    }

    // Verify token with Google reCAPTCHA API
    const params = new URLSearchParams();
    params.append('secret', RECAPTCHA_SECRET_KEY);
    params.append('response', token);

    const googleRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await googleRes.json();

    if (data.success) {
      return NextResponse.json({
        success: true,
        hostname: data.hostname,
        challenge_ts: data.challenge_ts,
      });
    } else {
      console.warn('Google reCAPTCHA verification failed:', data['error-codes']);
      return NextResponse.json(
        {
          success: false,
          error: 'Verifikasi keamanan reCAPTCHA gagal atau telah kedaluwarsa. Silakan centang ulang.',
          codes: data['error-codes'],
        },
        { status: 400 }
      );
    }
  } catch (err: any) {
    console.error('reCAPTCHA server error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
