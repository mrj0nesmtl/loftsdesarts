-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON conversations;
DROP POLICY IF EXISTS "Enable select for conversation participants" ON conversations;
DROP POLICY IF EXISTS "Enable update for conversation participants" ON conversations;
DROP POLICY IF EXISTS "Enable delete for conversation owner" ON conversations;

-- Create policies for conversations table
CREATE POLICY "Enable insert for authenticated users"
ON conversations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Enable select for conversation participants"
ON conversations FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM conversation_participants
        WHERE conversation_id = id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Enable update for conversation participants"
ON conversations FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM conversation_participants
        WHERE conversation_id = id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Enable delete for conversation owner"
ON conversations FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- Policies for conversation_participants table
DROP POLICY IF EXISTS "Enable insert for conversation creator" ON conversation_participants;
DROP POLICY IF EXISTS "Enable select for conversation participants" ON conversation_participants;

CREATE POLICY "Enable insert for conversation creator"
ON conversation_participants FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM conversations
        WHERE id = conversation_id
        AND created_by = auth.uid()
    )
);

CREATE POLICY "Enable select for conversation participants"
ON conversation_participants FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
    OR
    EXISTS (
        SELECT 1 FROM conversation_participants
        WHERE conversation_id = conversation_participants.conversation_id
        AND user_id = auth.uid()
    )
); 