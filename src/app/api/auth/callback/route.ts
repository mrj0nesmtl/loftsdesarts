import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This route is used for Supabase Auth callback
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    // Exchange the auth code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + '/admin/dashboard');
} 