-- Messaging System SQL Schema for Lofts des Arts
-- Session 3 - April 4, 2025

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Conversation Types Enum
CREATE TYPE conversation_type AS ENUM (
  'direct', -- One-to-one conversation between two users
  'group', -- Group conversation with multiple participants
  'announcement', -- Broadcast messages from admin/board to users
  'system' -- System messages (notifications, alerts)
);

-- Message Status Enum
CREATE TYPE message_status AS ENUM (
  'sent',
  'delivered',
  'read'
);

-- Conversation Participant Role Enum
CREATE TYPE participant_role AS ENUM (
  'owner',
  'admin',
  'member'
);

-- Conversations Table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type conversation_type NOT NULL,
  title TEXT, -- Optional for group/announcement conversations
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ,
  metadata JSONB -- Additional conversation settings
);

-- Create index for faster conversation lookups
CREATE INDEX conversations_created_by_idx ON conversations(created_by);
CREATE INDEX conversations_updated_at_idx ON conversations(updated_at);
CREATE INDEX conversations_last_message_idx ON conversations(last_message_at);

-- Conversation Participants Table
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role participant_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_read_at TIMESTAMPTZ,
  is_muted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(conversation_id, user_id) -- Each user can only be once in a conversation
);

-- Create indexes for faster participant lookups
CREATE INDEX conversation_participants_conversation_id_idx ON conversation_participants(conversation_id);
CREATE INDEX conversation_participants_user_id_idx ON conversation_participants(user_id);
CREATE INDEX conversation_participants_last_read_at_idx ON conversation_participants(last_read_at);

-- Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  status message_status NOT NULL DEFAULT 'sent',
  parent_id UUID REFERENCES messages(id) ON DELETE SET NULL, -- For threaded replies
  is_system_message BOOLEAN NOT NULL DEFAULT false,
  is_edited BOOLEAN NOT NULL DEFAULT false,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB -- Additional message metadata (e.g., formatting)
);

-- Create indexes for faster message lookups
CREATE INDEX messages_conversation_id_idx ON messages(conversation_id);
CREATE INDEX messages_sender_id_idx ON messages(sender_id);
CREATE INDEX messages_parent_id_idx ON messages(parent_id);
CREATE INDEX messages_created_at_idx ON messages(created_at);

-- Message Attachments Table
CREATE TABLE message_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster attachment lookups
CREATE INDEX message_attachments_message_id_idx ON message_attachments(message_id);

-- Message Read Status Table
CREATE TABLE message_reads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id) -- Each user can only read a message once
);

-- Create indexes for faster read status lookups
CREATE INDEX message_reads_message_id_idx ON message_reads(message_id);
CREATE INDEX message_reads_user_id_idx ON message_reads(user_id);

-- Notification Types Enum
CREATE TYPE notification_type AS ENUM (
  'new_message',
  'mention',
  'reply',
  'group_invite',
  'announcement',
  'system'
);

-- Notification Priority Enum
CREATE TYPE notification_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  priority notification_priority NOT NULL DEFAULT 'medium',
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  link TEXT, -- Optional link to navigate to
  source_id UUID, -- Source object ID (e.g., message_id, conversation_id)
  source_type TEXT, -- Source type (e.g., 'message', 'conversation')
  metadata JSONB, -- Additional notification data
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for faster notification lookups
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_is_read_idx ON notifications(is_read);
CREATE INDEX notifications_created_at_idx ON notifications(created_at);
CREATE INDEX notifications_priority_idx ON notifications(priority);
CREATE INDEX notifications_source_id_idx ON notifications(source_id);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Conversations Policies
CREATE POLICY "Users can view conversations they are part of"
  ON conversations FOR SELECT
  USING (
    id IN (
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
    OR 
    (type = 'announcement' AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'BOARD', 'SYNDIC')
    ))
  );

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Conversation owners and admins can update conversations"
  ON conversations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = id 
      AND user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
    OR
    (type = 'announcement' AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'BOARD', 'SYNDIC')
    ))
  );

CREATE POLICY "Conversation owners can delete conversations"
  ON conversations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = id 
      AND user_id = auth.uid() 
      AND role = 'owner'
    )
    OR
    (type = 'announcement' AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'
    ))
  );

-- Conversation Participants Policies
CREATE POLICY "Users can view participants of conversations they are part of"
  ON conversation_participants FOR SELECT
  USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add participants to conversations they own or admin"
  ON conversation_participants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = conversation_participants.conversation_id 
      AND user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
    OR
    (
      -- Allow joining announcement conversations
      EXISTS (
        SELECT 1 FROM conversations 
        WHERE id = conversation_participants.conversation_id 
        AND type = 'announcement'
      )
      AND
      user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own participant status"
  ON conversation_participants FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Owners and admins can update any participant in their conversations"
  ON conversation_participants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = conversation_participants.conversation_id 
      AND user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can leave conversations (delete participant)"
  ON conversation_participants FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "Owners and admins can remove participants from their conversations"
  ON conversation_participants FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = conversation_participants.conversation_id 
      AND user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- Messages Policies
CREATE POLICY "Users can view messages in conversations they are part of"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to conversations they are part of"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() 
    AND
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  USING (sender_id = auth.uid());

CREATE POLICY "Users can delete their own messages"
  ON messages FOR DELETE
  USING (sender_id = auth.uid());

-- Message Attachments Policies
CREATE POLICY "Users can view attachments in conversations they are part of"
  ON message_attachments FOR SELECT
  USING (
    message_id IN (
      SELECT id FROM messages WHERE conversation_id IN (
        SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can add attachments to their own messages"
  ON message_attachments FOR INSERT
  WITH CHECK (
    message_id IN (
      SELECT id FROM messages WHERE sender_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own attachments"
  ON message_attachments FOR UPDATE
  USING (
    message_id IN (
      SELECT id FROM messages WHERE sender_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own attachments"
  ON message_attachments FOR DELETE
  USING (
    message_id IN (
      SELECT id FROM messages WHERE sender_id = auth.uid()
    )
  );

-- Message Reads Policies
CREATE POLICY "Users can view read status in conversations they are part of"
  ON message_reads FOR SELECT
  USING (
    message_id IN (
      SELECT id FROM messages WHERE conversation_id IN (
        SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can mark messages as read for themselves"
  ON message_reads FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System and admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'BOARD', 'SYNDIC')
    )
  );

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());

-- Functions and Triggers

-- Function to update conversation last_message_at when a new message is added
CREATE OR REPLACE FUNCTION update_conversation_last_message() RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message_at = NEW.created_at,
    updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation last_message_at
CREATE TRIGGER update_conversation_last_message_trigger
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();

-- Function to create notification for new messages
CREATE OR REPLACE FUNCTION create_message_notification() RETURNS TRIGGER AS $$
DECLARE
  participant RECORD;
  sender_name TEXT;
  conv_title TEXT;
BEGIN
  -- Get sender name
  SELECT profiles.full_name INTO sender_name FROM profiles WHERE id = NEW.sender_id;
  
  -- Get conversation title
  SELECT 
    COALESCE(conversations.title, 'Message from ' || sender_name) 
  INTO conv_title 
  FROM conversations 
  WHERE id = NEW.conversation_id;
  
  -- Create notification for each participant except sender
  FOR participant IN 
    SELECT user_id FROM conversation_participants 
    WHERE conversation_id = NEW.conversation_id 
    AND user_id != NEW.sender_id
    AND is_muted = false
  LOOP
    INSERT INTO notifications (
      user_id,
      type,
      title,
      content,
      priority,
      source_id,
      source_type,
      link,
      metadata
    ) VALUES (
      participant.user_id,
      CASE 
        WHEN NEW.parent_id IS NOT NULL THEN 'reply'
        WHEN position('@' || participant.user_id::text in NEW.content) > 0 THEN 'mention'
        ELSE 'new_message'
      END,
      conv_title,
      substring(NEW.content from 1 for 100),
      CASE 
        WHEN position('@' || participant.user_id::text in NEW.content) > 0 THEN 'high'
        ELSE 'medium'
      END,
      NEW.id,
      'message',
      '/messages/' || NEW.conversation_id,
      jsonb_build_object(
        'conversation_id', NEW.conversation_id,
        'sender_id', NEW.sender_id,
        'sender_name', sender_name
      )
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create notification for new messages
CREATE TRIGGER create_message_notification_trigger
AFTER INSERT ON messages
FOR EACH ROW
WHEN (NEW.is_system_message = false)
EXECUTE FUNCTION create_message_notification(); 