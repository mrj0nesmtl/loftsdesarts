import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');
  
  if (!path) {
    return NextResponse.json(
      { error: 'Path parameter is required' },
      { status: 400 }
    );
  }
  
  try {
    // Try to get the thumbnail first if it exists
    const folderPath = path.split('/');
    
    // Check if this is a file in the public or private folder
    if (folderPath[0] === 'public' || folderPath[0] === 'private') {
      // Get the original file
      const { data: fileData, error: fileError } = await supabase.storage
        .from('dropbox')
        .download(path);
      
      if (fileError) {
        console.error('Error fetching file:', fileError);
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
      
      // Since we're just serving the original file for now (without actual thumbnail generation)
      // we'll set appropriate headers and return the file
      const headers = new Headers();
      
      // Detect content type based on file extension
      const fileExtension = path.split('.').pop()?.toLowerCase();
      let contentType = 'application/octet-stream'; // Default content type
      
      // Map common extensions to content types
      if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
        contentType = 'image/jpeg';
      } else if (fileExtension === 'png') {
        contentType = 'image/png';
      } else if (fileExtension === 'pdf') {
        contentType = 'application/pdf';
      } else if (fileExtension === 'doc' || fileExtension === 'docx') {
        contentType = 'application/msword';
      }
      
      headers.set('Content-Type', contentType);
      
      return new NextResponse(fileData, {
        status: 200,
        headers,
      });
    }
    
    // If not a file in public or private folder, return 404
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error processing thumbnail request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Disable body parsing for this route
export const dynamic = 'force-dynamic'; 