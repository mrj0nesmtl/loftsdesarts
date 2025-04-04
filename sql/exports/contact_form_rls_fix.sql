-- Fix for contact form submission RLS policy
-- This script allows public (unauthenticated) users to insert records into the contact_inquiries table

-- Enable RLS on the table if not already enabled
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Drop the policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Public users can insert inquiries" ON contact_inquiries;

-- Create policy to allow public (unauthenticated) users to submit contact forms
CREATE POLICY "Public users can insert inquiries" 
ON contact_inquiries 
FOR INSERT 
TO public
WITH CHECK (true);

-- Verify the policy exists
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual
FROM pg_policies 
WHERE tablename = 'contact_inquiries'; 