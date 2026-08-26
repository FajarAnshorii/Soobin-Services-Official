import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  if (typeof window === 'undefined') {
    console.warn('⚠️ [SECURITY WARNING] Supabase environment variables are missing.');
  }
}

// Public Client for browser & client-side operations
export const supabase = createClient(
  SUPABASE_URL || 'https://fapnzpcwhxgdpqhwhpbl.supabase.co',
  SUPABASE_ANON_KEY || ''
);

// Service Role Client for admin-level server-side operations
export const supabaseAdmin = createClient(
  SUPABASE_URL || 'https://fapnzpcwhxgdpqhwhpbl.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY || '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
