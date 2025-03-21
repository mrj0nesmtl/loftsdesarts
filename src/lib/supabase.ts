import { createClient } from '@supabase/supabase-js';

// These environment variables will need to be configured in your hosting environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.warn(
      'Supabase credentials are not properly configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    );
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SupabaseClient = typeof supabase; 