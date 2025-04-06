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
    // Check if the conversations table has all required columns
    const { data: tableInfo, error: tableError } = await supabase
      .from('conversations')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('Error checking table schema:', tableError);
      return [];
    }
    
    // Build the query based on available columns
    let query = supabase
      .from('conversations')
      .select(`
        id, 
        title, 
        created_at, 
        updated_at,
        ${tableInfo[0]?.last_message !== undefined ? 'last_message,' : ''}
        ${tableInfo[0]?.is_group !== undefined ? 'is_group,' : ''}
        ${tableInfo[0]?.metadata !== undefined ? 'metadata,' : ''}
        conversation_participants!inner (
          id,
          user_id,
          ${tableInfo[0]?.last_read_message_id !== undefined ? 'last_read_message_id,' : ''}
          ${tableInfo[0]?.joined_at !== undefined ? 'joined_at,' : ''}
          ${tableInfo[0]?.left_at !== undefined ? 'left_at,' : ''}
          ${tableInfo[0]?.role !== undefined ? 'role' : 'user_id'}
        )
      `);
    
    // Add filter and ordering
    query = query
      .eq('conversation_participants.user_id', userId)
      .order('updated_at', { ascending: false });
    
    // Add left_at filter if column exists
    if (tableInfo[0]?.left_at !== undefined) {
      query = query.is('conversation_participants.left_at', null);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;

    // Calculate unread messages by comparing last_message with last_read_message_id
    const conversationsWithUnread = data.map((conversation: any) => {
      const participant = conversation.conversation_participants[0];
      let unreadCount = 0;
      
      if (
        conversation.last_message &&
        participant.last_read_message_id &&
        participant.last_read_message_id !== conversation.last_message.id
      ) {
        unreadCount = 1; // Simplified, in reality we would count all unread messages
      }
      
      return {
        ...conversation,
        // Set defaults for possibly missing columns
        is_group: conversation.is_group ?? false,
        metadata: conversation.metadata ?? {},
        participants: conversation.conversation_participants,
        unreadCount,
        // Remove the raw participants array to avoid duplication
        conversation_participants: undefined
      };
    });
    
    return conversationsWithUnread;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return []; // Return empty array instead of throwing to prevent UI breaking
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
      // Set defaults for possibly missing columns
      is_group: data.is_group ?? false,
      metadata: data.metadata ?? {},
      participants: data.conversation_participants.map((participant: any) => ({
        ...participant,
        joined_at: participant.joined_at || new Date().toISOString(),
        role: participant.role || 'member',
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