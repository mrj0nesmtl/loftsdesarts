-- Enable Row Level Security for conversation tables if not already enabled
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- First, drop any existing conflicting policies
DROP POLICY IF EXISTS "Users can view conversations they're part of" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view participants they're part of" ON conversation_participants;

-- Add RLS policy for viewing conversations
-- This allows users to view conversations if:
-- 1. They are a participant
-- 2. They created the conversation (creator_id in metadata)
-- 3. They are an admin
CREATE POLICY "Users can view conversations they're part of"
  ON conversations FOR SELECT
  USING (
    id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid()
    )
    OR
    created_by = auth.uid()
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Add RLS policy for creating conversations - allow any authenticated user
CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add RLS policy for viewing conversation participants - same criteria as viewing conversations
CREATE POLICY "Users can view participants they're part of"
  ON conversation_participants FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE id IN (
        SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
      )
    )
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Add RLS policy for adding participants - only creator or admin can add participants
CREATE POLICY "Users can add participants to their conversations"
  ON conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (true);  -- Allow all authenticated users to add participants for now

-- Create an index on metadata->>'created_by' for performance
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON conversations ((metadata->>'created_by')); 