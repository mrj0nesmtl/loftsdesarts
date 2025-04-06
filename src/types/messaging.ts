/**
 * Types for the messaging system
 */

// Conversation type
export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  last_message?: LastMessage;
  is_group: boolean;
  metadata?: Record<string, any>;
  unreadCount?: number;
  participants?: ConversationParticipant[];
}

// Last message shown in conversation list
export interface LastMessage {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

// Conversation participant
export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  last_read_message_id?: string;
  joined_at: string;
  left_at?: string;
  role: string;
  user?: {
    id: string;
    email?: string;
    display_name?: string;
    avatar_url?: string;
  };
}

// Message type
export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_system: boolean;
  metadata?: Record<string, any>;
  attachments?: Attachment[];
  message_reactions?: MessageReaction[];
  read_receipts?: ReadReceipt[];
}

// Message attachment
export interface Attachment {
  id: string;
  message_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  file_path: string;
  created_at: string;
}

// Message reaction
export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

// Read receipt
export interface ReadReceipt {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

// Connection status for real-time features
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'; 