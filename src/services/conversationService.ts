/**
 * Conversation Service
 * Functions for interacting with conversations in the messaging system
 */

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
    // Get conversations where the user is a participant
    const { data, error } = await supabase
      .from('conversation_participants')
      .select(`
        conversation:conversations (
          id,
          title,
          created_at,
          updated_at,
          created_by
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Transform data to expected format
    const conversations = data
      .filter(item => item.conversation) // Filter out nulls
      .map(item => ({
        id: item.conversation.id,
        title: item.conversation.title,
        created_at: item.conversation.created_at,
        updated_at: item.conversation.updated_at,
        is_group: false, // Default value
        metadata: {},    // Default value
        unreadCount: 0   // Default value - can be computed separately
      }));
    
    return conversations;
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
    console.log('Fetching conversation:', conversationId);
    
    // Use the new RPC function that bypasses RLS
    const { data, error } = await supabase.rpc(
      'fetch_conversation',
      { conversation_id_param: conversationId }
    );
    
    if (error) {
      console.error('Error fetching conversation from RPC:', error);
      throw error;
    }
    
    console.log('Conversation RPC response:', data);
    
    if (!data || !data.success) {
      console.warn('Conversation not found or access denied:', data?.message || 'Unknown error');
      return null;
    }
    
    const conversation = data.conversation;
    const participants = data.participants || [];
    
    // For each participant, try to get the user profile
    const participantsWithUser = await Promise.all(
      participants.map(async (participant: any) => {
        try {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('id, email, display_name')
            .eq('id', participant.user_id)
            .single();
          
          if (userError) throw userError;
          
          return {
            ...participant,
            user: userData
          };
        } catch (error) {
          console.warn(`Could not fetch user data for ${participant.user_id}:`, error);
          return {
            ...participant,
            user: {
              id: participant.user_id,
              email: 'unknown@example.com',
              display_name: `User ${participant.user_id.substring(0, 8)}`
            }
          };
        }
      })
    );
    
    const result: Conversation = {
      id: conversation.id,
      title: conversation.title || '',
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
      is_group: participants.length > 2,
      metadata: {},
      participants: participantsWithUser as unknown as ConversationParticipant[]
    };
    
    console.log('Transformed conversation:', result);
    return result;
  } catch (error) {
    console.error('Unexpected error in fetchConversation:', error);
    throw error;
  }
};

/**
 * Create a new conversation
 * @param title The conversation title
 * @param participantIds Array of user IDs to include in the conversation
 * @param isGroup Whether this is a group conversation
 * @param creatorId The ID of the user creating the conversation
 * @returns The created conversation
 */
export const createConversation = async (
  title: string,
  participantIds: string[],
  isGroup: boolean = false,
  creatorId: string
): Promise<Conversation> => {
  try {
    console.log('Creating conversation with params:', {
      title,
      creatorId,
      participantIds,
      isGroup
    });
    
    // Step 1: Create a new conversation
    const { data: conversation, error: conversationError } = await supabase.rpc(
      'create_conversation',
      {
        title_param: title || (isGroup ? 'New Group' : 'New Conversation'),
        creator_id_param: creatorId
      }
    );

    if (conversationError) {
      console.error('Error from create_conversation RPC:', conversationError);
      throw conversationError;
    }
    
    console.log('Created conversation:', conversation);

    if (!conversation?.id) {
      throw new Error('Failed to retrieve conversation ID from RPC function');
    }
    
    // Step 2: Add participants
    // Make sure creator is included in participants if not already there
    const allParticipantIds = [...new Set([creatorId, ...participantIds])];
    
    // Add participants one by one (more reliable than batch insert)
    const addParticipantPromises = allParticipantIds.map(async (userId) => {
      const isCreator = userId === creatorId;
      
      const { data, error } = await supabase.rpc(
        'add_conversation_participant',
        {
          conversation_id_param: conversation.id,
          user_id_param: userId,
          role_param: isCreator ? 'owner' : 'member'
        }
      );
      
      if (error) {
        console.error(`Error adding participant ${userId}:`, error);
      }
      
      return { userId, success: !error, error };
    });
    
    const participantResults = await Promise.all(addParticipantPromises);
    console.log('Participant addition results:', participantResults);
    
    // Create the response object
    const result: Conversation = {
      id: conversation.id,
      title: title || (isGroup ? 'New Group' : 'New Conversation'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_group: isGroup,
      metadata: {},
      participants: allParticipantIds.map(userId => ({
        id: '',  // We don't have these IDs but they're not critical for the UI
        conversation_id: conversation.id,
        user_id: userId,
        role: userId === creatorId ? 'owner' : 'member',
        joined_at: new Date().toISOString()
      })) as unknown as ConversationParticipant[]
    };
    
    return result;
  } catch (error) {
    console.error('Unexpected error in createConversation:', error);
    throw error;
  }
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