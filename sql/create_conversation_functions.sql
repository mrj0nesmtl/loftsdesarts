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
  new_conversation_id UUID;
  new_conversation RECORD;
BEGIN
  -- Insert the conversation
  INSERT INTO conversations (title, created_by, is_group)
  VALUES (title_param, creator_id_param, is_group_param)
  RETURNING * INTO new_conversation;

  -- Add the creator as a participant
  INSERT INTO conversation_participants (conversation_id, user_id, role, joined_at)
  VALUES (new_conversation.id, creator_id_param, 'owner', NOW());

  -- Return the conversation data
  RETURN row_to_json(new_conversation);
END;
$$;

-- Function to add a participant to a conversation
CREATE OR REPLACE FUNCTION add_conversation_participant(
  conversation_id_param UUID,
  user_id_param UUID,
  role_param TEXT DEFAULT 'member'
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
GRANT EXECUTE ON FUNCTION add_conversation_participant(UUID, UUID, TEXT) TO authenticated; 