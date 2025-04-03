-- Create contact inquiries table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  viewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Check if the viewed column exists, if not, add it
-- This is mostly redundant since we're creating the table with the viewed column
-- but kept for safety in case the table already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'contact_inquiries'
        AND column_name = 'viewed'
    ) THEN
        ALTER TABLE contact_inquiries ADD COLUMN viewed BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Create index on viewed column for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_viewed ON contact_inquiries(viewed);

-- Set existing records to viewed=false if they don't have a value yet
UPDATE contact_inquiries SET viewed = FALSE WHERE viewed IS NULL;

-- Set up Row Level Security
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Drop policies if they already exist
DROP POLICY IF EXISTS "Authenticated users can view inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Authenticated users can update inquiries" ON contact_inquiries;

-- Allow authenticated users to view all inquiries
CREATE POLICY "Authenticated users can view inquiries" 
ON contact_inquiries 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to update inquiries (to mark as viewed)
CREATE POLICY "Authenticated users can update inquiries" 
ON contact_inquiries 
FOR UPDATE
TO authenticated 
USING (true); 