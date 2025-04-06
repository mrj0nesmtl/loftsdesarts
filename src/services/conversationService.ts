/**
 * Conversation Service
 * Functions for interacting with conversations in the messaging system
 */

import { createClient } from '@supabase/supabase-js';
import { Conversation, ConversationParticipant } from '@/types/messaging';

// Use the existing supabase client
import { supabase } from '@/lib/supabase';

/**
 * Fetch conversations for a user
 * @param userId The ID of the user
 * @returns Array of conversations
 */
export const fetchConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id, 
        title, 
        created_at, 
        updated_at,
        last_message,
        is_group,
        metadata,
        conversation_participants!inner (
          id,
          user_id,
          last_read_message_id,
          joined_at,
          left_at,
          role
        )
      `)
      .eq('conversation_participants.user_id', userId)
      .is('conversation_participants.left_at', null) // Only active conversations
      .order('updated_at', { ascending: false });
    
    if (error) throw error;

    // Calculate unread messages by comparing last_message with last_read_message_id
    const conversationsWithUnread = data.map((conversation: any) => {
      const participant = conversation.conversation_participants[0];
      let unreadCount = 0;
      
      if (
        conversation.last_message &&
        (!participant.last_read_message_id || 
         participant.last_read_message_id !== conversation.last_message.id)
      ) {
        unreadCount = 1; // Simplified, in reality we would count all unread messages
      }
      
      return {
        ...conversation,
        participants: conversation.conversation_participants,
        unreadCount,
        // Remove the raw participants array to avoid duplication
        conversation_participants: undefined
      };
    });
    
    return conversationsWithUnread;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

/**
 * Fetch a single conversation by ID
 * @param conversationId The ID of the conversation
 * @returns The conversation details or null if not found
 */
export const fetchConversation = async (conversationId: string): Promise<Conversation | null> => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id, 
        title, 
        created_at, 
        updated_at,
        last_message,
        is_group,
        metadata,
        conversation_participants (
          id,
          user_id,
          last_read_message_id,
          joined_at,
          left_at,
          role,
          profiles:user_id (
            id,
            email,
            display_name,
            avatar_url
          )
        )
      `)
      .eq('id', conversationId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    // Transform the data to match our types
    const transformedData = {
      ...data,
      participants: data.conversation_participants.map((participant: any) => ({
        ...participant,
        user: participant.profiles
      })),
      // Remove the raw participants array
      conversation_participants: undefined
    };
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

/**
 * Create a new conversation
 * @param title The conversation title
 * @param participantIds Array of user IDs to include in the conversation
 * @param isGroup Whether this is a group conversation
 * @returns The created conversation
 */
export const createConversation = async (
  title: string,
  participantIds: string[],
  isGroup: boolean = false
): Promise<Conversation> => {
  // Start a transaction
  const { data: conversation, error: conversationError } = await supabase
    .from('conversations')
    .insert({
      title: title || (isGroup ? 'New Group' : 'New Conversation'),
      is_group: isGroup,
      metadata: {}
    })
    .select()
    .single();
  
  if (conversationError) {
    console.error('Error creating conversation:', conversationError);
    throw conversationError;
  }
  
  // Add participants
  const participants = participantIds.map(userId => ({
    conversation_id: conversation.id,
    user_id: userId,
    role: 'member'
  }));
  
  const { error: participantsError } = await supabase
    .from('conversation_participants')
    .insert(participants);
  
  if (participantsError) {
    console.error('Error adding participants:', participantsError);
    throw participantsError;
  }
  
  return {
    ...conversation,
    participants: participants as unknown as ConversationParticipant[]
  };
};

/**
 * Update the last read message for a user in a conversation
 * @param conversationId The conversation ID
 * @param userId The user ID
 * @param messageId The ID of the last read message
 */
export const markConversationAsRead = async (
  conversationId: string,
  userId: string,
  messageId: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('conversation_participants')
      .update({ last_read_message_id: messageId })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    throw error;
  }
}; 