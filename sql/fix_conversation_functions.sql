-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS create_conversation(TEXT, UUID, BOOLEAN);
DROP FUNCTION IF EXISTS add_conversation_participant(UUID, UUID, TEXT);

-- Drop existing policies
DROP POLICY IF EXISTS "Allow users to view their conversations" ON conversations;
DROP POLICY IF EXISTS "Allow users to view conversation participants" ON conversation_participants;

-- Function to create a conversation
CREATE OR REPLACE FUNCTION create_conversation(
  title_param TEXT,
  creator_id_param UUID,
  is_group_param BOOLEAN
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_conversation RECORD;
BEGIN
  -- Insert the conversation
  INSERT INTO conversations (title, created_by, is_group)
  VALUES (title_param, creator_id_param, is_group_param)
  RETURNING * INTO new_conversation;

  -- Return the conversation data
  RETURN row_to_json(new_conversation);
END;
$$;

-- Function to add a participant to a conversation
CREATE OR REPLACE FUNCTION add_conversation_participant(
  conversation_id_param UUID,
  user_id_param UUID,
  role_param conversation_role_enum DEFAULT 'member'::conversation_role_enum
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_participant RECORD;
BEGIN
  -- Insert the participant
  INSERT INTO conversation_participants (conversation_id, user_id, role, joined_at)
  VALUES (conversation_id_param, user_id_param, role_param, NOW())
  RETURNING * INTO new_participant;

  -- Return the participant data
  RETURN row_to_json(new_participant);
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION create_conversation(TEXT, UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION add_conversation_participant(UUID, UUID, conversation_role_enum) TO authenticated;

-- Ensure RLS is enabled
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Create policies for viewing conversations and participants
CREATE POLICY "Allow users to view their conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = conversations.id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to view conversation participants"
  ON conversation_participants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = conversation_participants.conversation_id
      AND cp.user_id = auth.uid()
    )
  ); 