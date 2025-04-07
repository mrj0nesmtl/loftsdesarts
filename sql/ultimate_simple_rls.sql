-- Disable RLS temporarily to clean up existing policies
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow users to view their conversations" ON conversations;
DROP POLICY IF EXISTS "Allow users to view conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON conversations;
DROP POLICY IF EXISTS "Enable select for conversation participants" ON conversations;
DROP POLICY IF EXISTS "Enable update for conversation participants" ON conversations;
DROP POLICY IF EXISTS "Enable delete for conversation owner" ON conversations;
DROP POLICY IF EXISTS "Enable insert for conversation creator" ON conversation_participants;
DROP POLICY IF EXISTS "Enable select for conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;

-- Re-enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Create the most permissive policies possible for testing
-- Anyone can do anything with conversations
CREATE POLICY "Full access for authenticated users"
ON conversations
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Anyone can do anything with conversation participants
CREATE POLICY "Full access for authenticated users"
ON conversation_participants
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true); 