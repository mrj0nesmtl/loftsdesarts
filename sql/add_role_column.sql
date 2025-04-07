-- First create the enum type if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'conversation_role_enum') THEN
        CREATE TYPE conversation_role_enum AS ENUM ('owner', 'member', 'admin');
    END IF;
END $$;

-- Add role column with the correct type from the start
ALTER TABLE conversation_participants 
ADD COLUMN IF NOT EXISTS role conversation_role_enum DEFAULT 'member'::conversation_role_enum;

-- Make the column non-nullable
ALTER TABLE conversation_participants 
ALTER COLUMN role SET NOT NULL;

-- Add a check constraint to ensure valid roles
ALTER TABLE conversation_participants 
ADD CONSTRAINT valid_role CHECK (role IN ('owner', 'member', 'admin')); 