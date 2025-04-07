-- First, ensure the profiles table has the correct primary key
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_pkey CASCADE;

ALTER TABLE profiles
ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

-- Drop existing foreign key constraints if they exist
ALTER TABLE conversation_participants
DROP CONSTRAINT IF EXISTS conversation_participants_conversation_id_fkey,
DROP CONSTRAINT IF EXISTS conversation_participants_user_id_fkey;

-- Drop existing primary key if it exists
ALTER TABLE conversation_participants
DROP CONSTRAINT IF EXISTS conversation_participants_pkey CASCADE;

-- Add primary key to conversation_participants
ALTER TABLE conversation_participants
ADD CONSTRAINT conversation_participants_pkey PRIMARY KEY (id);

-- Add foreign key constraints
ALTER TABLE conversation_participants
ADD CONSTRAINT conversation_participants_conversation_id_fkey
FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

ALTER TABLE conversation_participants
ADD CONSTRAINT conversation_participants_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add unique constraint to prevent duplicate participants
ALTER TABLE conversation_participants
DROP CONSTRAINT IF EXISTS unique_conversation_participant;

ALTER TABLE conversation_participants
ADD CONSTRAINT unique_conversation_participant 
UNIQUE (conversation_id, user_id);

-- Create an index to improve query performance
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id
ON conversation_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id
ON conversation_participants(conversation_id);

-- Update the RLS policies to use the correct relationships
DROP POLICY IF EXISTS "Allow users to view their conversations" ON conversations;
DROP POLICY IF EXISTS "Allow users to view conversation participants" ON conversation_participants;

CREATE POLICY "Allow users to view their conversations"
ON conversations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Allow users to view conversation participants"
ON conversation_participants FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_id
    AND cp.user_id = auth.uid()
  )
); 