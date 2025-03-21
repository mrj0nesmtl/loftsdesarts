import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This route handles sign-out functionality
export async function POST(request: NextRequest) {
  // Sign the user out on the server
  await supabase.auth.signOut();
  
  // Return a success response
  return NextResponse.json({ success: true });
}

// Allow GET requests for simple browser access to sign out
export async function GET(request: NextRequest) {
  // Sign the user out on the server
  await supabase.auth.signOut();
  
  // Redirect to the login page
  const requestUrl = new URL(request.url);
  return NextResponse.redirect(requestUrl.origin + '/admin/login');
} 