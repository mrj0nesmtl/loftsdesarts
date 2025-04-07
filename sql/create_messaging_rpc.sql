-- Create database functions for conversation operations
-- These functions use SECURITY DEFINER to bypass RLS policies

-- Function to create a new conversation
CREATE OR REPLACE FUNCTION create_conversation(
  title_param TEXT,
  creator_id_param UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_conversation_id UUID;
  result JSON;
BEGIN
  -- Insert the conversation
  INSERT INTO conversations (
    title,
    created_by,
    created_at,
    updated_at
  ) VALUES (
    title_param,
    creator_id_param,
    NOW(),
    NOW()
  )
  RETURNING id INTO new_conversation_id;
  
  -- Create the result
  SELECT json_build_object(
    'id', new_conversation_id,
    'success', true
  ) INTO result;
  
  RETURN result;
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
SET search_path = public
AS $$
DECLARE
  new_participant_id UUID;
  result JSON;
BEGIN
  -- Insert the participant
  INSERT INTO conversation_participants (
    conversation_id,
    user_id,
    role,
    joined_at
  ) VALUES (
    conversation_id_param,
    user_id_param,
    role_param,
    NOW()
  )
  ON CONFLICT (conversation_id, user_id) DO NOTHING
  RETURNING id INTO new_participant_id;
  
  -- Create the result
  SELECT json_build_object(
    'id', new_participant_id,
    'success', new_participant_id IS NOT NULL
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Function to fetch a conversation by ID (bypassing RLS)
CREATE OR REPLACE FUNCTION fetch_conversation(
  conversation_id_param UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conversation_data JSON;
  participants_data JSON;
BEGIN
  -- Get the conversation
  SELECT 
    json_build_object(
      'id', c.id,
      'title', c.title,
      'created_at', c.created_at,
      'updated_at', c.updated_at,
      'created_by', c.created_by,
      'is_group', COALESCE(c.is_group, false),
      'metadata', COALESCE(c.metadata, '{}'::jsonb)
    )
  INTO conversation_data
  FROM conversations c
  WHERE c.id = conversation_id_param;
  
  IF conversation_data IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Conversation not found'
    );
  END IF;
  
  -- Get the participants
  SELECT 
    json_agg(
      json_build_object(
        'id', cp.id,
        'user_id', cp.user_id,
        'role', cp.role,
        'joined_at', cp.joined_at
      )
    )
  INTO participants_data
  FROM conversation_participants cp
  WHERE cp.conversation_id = conversation_id_param;
  
  -- Combine and return the data
  RETURN json_build_object(
    'success', true,
    'conversation', conversation_data,
    'participants', COALESCE(participants_data, '[]'::json)
  );
END;
$$;

-- SECURITY NOTE:
-- These functions bypass Row Level Security (RLS) due to the SECURITY DEFINER
-- attribute. They should be carefully managed and only used for operations
-- that require elevated privileges, such as creating conversations and adding
-- participants where direct table access might be restricted by RLS policies.

-- GRANT EXECUTE permission appropriately
GRANT EXECUTE ON FUNCTION create_conversation TO authenticated;
GRANT EXECUTE ON FUNCTION add_conversation_participant TO authenticated;
GRANT EXECUTE ON FUNCTION fetch_conversation TO authenticated; 