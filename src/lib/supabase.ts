import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fapnzpcwhxgdpqhwhpbl.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcG56cGN3aHhnZHBxaHdocGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0ODkzMjEsImV4cCI6MjEwMTA2NTMyMX0.jN39Qqc26Mpd3QpdLQPI6DUBQamthNs93gIzXpRWMQw';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcG56cGN3aHhnZHBxaHdocGJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTQ4OTMyMSwiZXhwIjoyMTAxMDY1MzIxfQ.af6HDyvRCMl9yTSf1ys-sSm34nwhxm9H3GHGL8B7ICc';

// Public Client for browser & client-side operations
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Service Role Client for admin-level server-side bypass RLS
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
