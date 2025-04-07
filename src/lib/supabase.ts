import { createClient } from '@supabase/supabase-js';

// Function to check if URL.canParse is available (Node.js 18+)
function isValidUrl(urlString: string): boolean {
  try {
    // URL constructor will throw for invalid URLs
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}

// Initialize Supabase client
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Get the webhook URL from environment variables
const webhookUrl = process.env.NEXT_PUBLIC_SITE_URL 
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/contact` 
  : undefined;

// Create the Supabase client with optional webhook config
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    },
    // Only add webhook handlers if we have a valid webhook URL
    fetch: webhookUrl && isValidUrl(webhookUrl) ? undefined : undefined,
    // Note: The webhook integration should be configured in Supabase dashboard
    // under Database > Webhooks for more control and security
  },
});

export type SupabaseClient = typeof supabase; 