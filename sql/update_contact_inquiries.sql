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