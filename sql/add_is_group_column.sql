-- Add is_group column to conversations table
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS is_group BOOLEAN DEFAULT FALSE;

-- Update existing rows to have is_group = false
UPDATE conversations 
SET is_group = FALSE 
WHERE is_group IS NULL;

-- Make the column non-nullable after setting defaults
ALTER TABLE conversations 
ALTER COLUMN is_group SET NOT NULL; 