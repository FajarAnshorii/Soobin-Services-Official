import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pvgnv3ffqknyiukm6bu44w.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_pvGNv3fFqknYIuKm6Bu44w_d6KA5kvv';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
