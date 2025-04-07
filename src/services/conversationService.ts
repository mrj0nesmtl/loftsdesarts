/**
 * Conversation Service
 * Functions for interacting with conversations in the messaging system
 */

import { Conversation, ConversationParticipant } from '@/types/messaging';
import { supabase } from '@/lib/supabase';

/**
 * Fetch conversations for a user
 * @param userId The ID of the user
 * @returns Array of conversations
 */
export const fetchConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    // Get conversation IDs where the user is a participant
    const { data: participantData, error: participantError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId);
    
    if (participantError) {
      console.error('Error fetching participant data:', participantError);
      return [];
    }
    
    if (!participantData || participantData.length === 0) {
      return [];
    }
    
    // Extract conversation IDs
    const conversationIds = participantData.map(p => p.conversation_id);
    
    // Get the actual conversations
    const { data: conversationsData, error: conversationsError } = await supabase
      .from('conversations')
      .select('*')
      .in('id', conversationIds);
    
    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
      return [];
    }
    
    // Map to expected format
    const conversations = (conversationsData || []).map(c => ({
      id: c.id,
      title: c.title || '',
      created_at: c.created_at,
      updated_at: c.updated_at,
      is_group: false, // Default value, can be computed later
      metadata: {},    // Default value
      participants: [] // Will be populated later if needed
    }));
    
    return conversations;
  } catch (error) {
    console.error('Error in fetchConversations:', error);
    return [];
  }
};

/**
 * Fetch a single conversation by ID
 * @param conversationId The ID of the conversation
 * @returns The conversation details or null if not found
 */
export const fetchConversation = async (conversationId: string): Promise<Conversation | null> => {
  try {
    // Get the conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();
    
    if (conversationError) {
      console.error('Error fetching conversation:', conversationError);
      return null;
    }
    
    // Get participants
    const { data: participants, error: participantsError } = await supabase
      .from('conversation_participants')
      .select('*')
      .eq('conversation_id', conversationId);
    
    if (participantsError) {
      console.error('Error fetching participants:', participantsError);
      return null;
    }
    
    const userIds = participants.map(p => p.user_id);
    
    // Get user profiles
    const { data: userProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, display_name')
      .in('id', userIds);
    
    if (profilesError) {
      console.error('Error fetching user profiles:', profilesError);
    }
    
    // Create a map for quick lookup
    const profileMap = Object.fromEntries(
      (userProfiles || []).map(profile => [profile.id, profile])
    );
    
    // Add user data to participants
    const participantsWithUser = participants.map(participant => ({
      ...participant,
      user: profileMap[participant.user_id] || {
        id: participant.user_id,
        email: 'unknown@example.com',
        display_name: `User ${participant.user_id.slice(0, 8)}`
      }
    }));
    
    // Build the conversation object
    const result: Conversation = {
      id: conversation.id,
      title: conversation.title || '',
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
      is_group: participants.length > 2,
      metadata: {},
      participants: participantsWithUser as any
    };
    
    return result;
  } catch (error) {
    console.error('Error in fetchConversation:', error);
    return null;
  }
};

/**
 * Create a new conversation - SIMPLE VERSION
 */
export const createConversation = async (
  title: string,
  participantIds: string[],
  isGroup: boolean = false,
  creatorId: string
): Promise<Conversation> => {
  try {
    console.log('Creating conversation with:', { title, participantIds, isGroup, creatorId });
    
    // Step 1: Insert the conversation
    const { data: newConversation, error: conversationError } = await supabase
      .from('conversations')
      .insert([
        { 
          title: title || (isGroup ? 'New Group' : 'New Conversation'),
          created_by: creatorId,
          is_group: isGroup
        }
      ])
      .select()
      .single();
    
    if (conversationError) {
      console.error('Error creating conversation:', conversationError);
      throw new Error('Failed to create conversation');
    }
    
    console.log('Created conversation:', newConversation);
    
    // Step 2: Make sure creator is in the participants list
    const allParticipantIds = Array.from(new Set([...participantIds, creatorId]));
    
    // Step 3: Add participants one by one
    for (const userId of allParticipantIds) {
      const isOwner = userId === creatorId;
      const { error } = await supabase
        .from('conversation_participants')
        .insert([
          {
            conversation_id: newConversation.id,
            user_id: userId,
            role: isOwner ? 'owner' : 'member',
            joined_at: new Date().toISOString()
          }
        ]);
      
      if (error) {
        console.error(`Error adding participant ${userId}:`, error);
        // Continue anyway, don't throw here
      }
    }
    
    // Return the conversation structure
    return {
      id: newConversation.id,
      title: newConversation.title,
      created_at: newConversation.created_at,
      updated_at: newConversation.updated_at,
      is_group: isGroup,
      metadata: {},
      participants: allParticipantIds.map(userId => ({
        id: '', // We don't have this yet
        conversation_id: newConversation.id,
        user_id: userId,
        role: userId === creatorId ? 'owner' : 'member',
        joined_at: new Date().toISOString()
      })) as any
    };
  } catch (error) {
    console.error('Error in createConversation:', error);
    throw error;
  }
};

/**
 * Update the last read message for a user in a conversation
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
    
    if (error) {
      console.error('Error marking conversation as read:', error);
    }
  } catch (error) {
    console.error('Error in markConversationAsRead:', error);
  }
}; 