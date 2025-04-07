-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view own conversation_participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can add conversation_participants" ON conversation_participants;

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- EXTREMELY PERMISSIVE RLS policy for conversations
-- This will allow all authenticated users to see all conversations
CREATE POLICY "Users can view own conversations" 
ON conversations FOR SELECT 
TO authenticated
USING (true);

-- Allow any authenticated user to create conversations
CREATE POLICY "Users can create conversations" 
ON conversations FOR INSERT 
TO authenticated
WITH CHECK (true);

-- EXTREMELY PERMISSIVE RLS policy for conversation participants
-- This will allow all authenticated users to see all conversation participants
CREATE POLICY "Users can view own conversation_participants" 
ON conversation_participants FOR SELECT 
TO authenticated
USING (true);

-- Allow any authenticated user to add participants to any conversation
CREATE POLICY "Users can add conversation_participants" 
ON conversation_participants FOR INSERT 
TO authenticated
WITH CHECK (true); 