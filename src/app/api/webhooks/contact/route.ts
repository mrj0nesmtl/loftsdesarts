import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const notificationEmail = process.env.ADMIN_EMAIL;
const emailPass = process.env.EMAIL_PASSWORD;
const emailUser = process.env.EMAIL_USER;
const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
const emailPort = parseInt(process.env.EMAIL_PORT || '587', 10);

// Create Supabase admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook payload
    const payload = await request.json();
    
    // Check if this is a database change event from Supabase
    if (!payload.type || payload.type !== 'INSERT' || !payload.table || payload.table !== 'contact_inquiries') {
      return NextResponse.json({ message: 'Invalid webhook payload' }, { status: 400 });
    }
    
    const newRecord = payload.record;
    
    if (!newRecord || !newRecord.email || !newRecord.name) {
      return NextResponse.json({ message: 'Invalid inquiry data' }, { status: 400 });
    }
    
    // Get admin users who should receive the notification
    const { data: adminUsers } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('role', 'ADMIN');
    
    // If no notification email is configured, use the admin emails from the database
    const recipientEmails = notificationEmail ? 
      [notificationEmail] : 
      (adminUsers?.map(user => user.email) || []);
    
    if (recipientEmails.length === 0) {
      console.warn('No recipient emails configured for notifications');
      return NextResponse.json({ message: 'No recipients configured' }, { status: 200 });
    }
    
    // Only attempt to send emails if we have SMTP credentials
    if (emailUser && emailPass) {
      // Create a transporter
      const transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: emailPort === 465,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });
      
      // Send email notification
      const mailOptions = {
        from: `"STTS Contact Form" <${emailUser}>`,
        to: recipientEmails.join(', '),
        subject: `New STTS Contact Form Submission from ${newRecord.name}`,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${newRecord.name}</p>
          <p><strong>Email:</strong> ${newRecord.email}</p>
          ${newRecord.phone ? `<p><strong>Phone:</strong> ${newRecord.phone}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${newRecord.message.replace(/\n/g, '<br>')}</p>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/inquiries">View in Admin Dashboard</a></p>
        `,
      };
      
      await transporter.sendMail(mailOptions);
    } else {
      console.warn('Email credentials not configured, skipping email notification');
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Optional: Support OPTIONS requests for the route (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 