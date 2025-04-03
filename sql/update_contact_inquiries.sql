-- Create contact inquiries table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  viewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Check if the phone column exists, if not, add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'contact_inquiries'
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE contact_inquiries ADD COLUMN phone TEXT;
    END IF;
END $$;

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
DROP POLICY IF EXISTS "Public users can insert inquiries" ON contact_inquiries;

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

-- Allow public users to insert new contact inquiries
CREATE POLICY "Public users can insert inquiries" 
ON contact_inquiries 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Additional check to make sure the existing authenticated policies exist
-- Create if they don't exist to maintain a complete set of policies

-- Check and create view policy if needed
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE tablename = 'contact_inquiries' 
    AND policyname = 'Authenticated users can view inquiries'
  ) THEN
    CREATE POLICY "Authenticated users can view inquiries" 
    ON contact_inquiries 
    FOR SELECT 
    TO authenticated 
    USING (true);
  END IF;
END $$;

-- Check and create update policy if needed
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE tablename = 'contact_inquiries' 
    AND policyname = 'Authenticated users can update inquiries'
  ) THEN
    CREATE POLICY "Authenticated users can update inquiries" 
    ON contact_inquiries 
    FOR UPDATE
    TO authenticated 
    USING (true);
  END IF;
END $$; 