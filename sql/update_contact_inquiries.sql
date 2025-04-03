-- Check if the viewed column exists, if not, add it
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

-- Create contact inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  viewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Set up Row Level Security
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view all inquiries
CREATE POLICY "Authenticated users can view inquiries" 
ON contact_inquiries 
FOR SELECT 
TO authenticated 
USING (true); 