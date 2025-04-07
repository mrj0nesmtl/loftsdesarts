/**
 * Conversation Service
 * Functions for interacting with conversations in the messaging system
 */

import { Conversation, ConversationParticipant } from '@/types/messaging';
import { supabase } from '@/lib/supabase';

interface ConversationWithParticipants {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  is_group: boolean;
  metadata: any;
  conversation_participants: Array<{
    id: string;
    conversation_id: string;
    user_id: string;
    role: string;
    joined_at: string;
    profiles?: {
      id: string;
      email: string;
      display_name: string;
    };
  }>;
}

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
    console.log('Fetching conversation:', conversationId);
    
    // First get the conversation with a simple query
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();
    
    if (conversationError) {
      console.error('Error fetching conversation:', conversationError);
      return null;
    }

    if (!conversation) {
      console.error('Conversation not found:', conversationId);
      return null;
    }
    
    // Now get participants in a separate query
    const { data: participants, error: participantsError } = await supabase
      .from('conversation_participants')
      .select('*')
      .eq('conversation_id', conversationId);
      
    if (participantsError) {
      console.error('Error fetching participants:', participantsError);
      // Continue with empty participants
    }
    
    // Get user IDs for profile lookup
    const userIds = (participants || []).map(p => p.user_id);
    
    // Get profiles for participants
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);
      
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      // Continue with default profiles
    }
    
    // Create a map for quick profile lookup
    const profileMap = (profiles || []).reduce((map, profile) => {
      map[profile.id] = profile;
      return map;
    }, {} as Record<string, any>);
    
    // Build participants with profile info
    const participantsWithProfiles = (participants || []).map(participant => ({
      ...participant,
      user: profileMap[participant.user_id] || {
        id: participant.user_id,
        email: 'unknown@example.com',
        display_name: `User ${participant.user_id.slice(0, 8)}`
      }
    }));
    
    // Return the fully assembled conversation
    return {
      id: conversation.id,
      title: conversation.title || '',
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
      is_group: conversation.is_group,
      metadata: conversation.metadata || {},
      participants: participantsWithProfiles
    };
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
    
    // Use the provided creatorId directly instead of trying to get from auth
    console.log('Using provided creator ID:', creatorId);
    
    // Step 1: Insert the conversation directly
    const { data: newConversation, error: conversationError } = await supabase
      .from('conversations')
      .insert([{ 
        title: title || (isGroup ? 'New Group' : 'New Conversation'),
        created_by: creatorId,
        is_group: isGroup
      }])
      .select()
      .single();
      
    if (conversationError || !newConversation) {
      console.error('Error creating conversation:', conversationError);
      throw new Error(conversationError?.message || 'Failed to create conversation');
    }
    
    console.log('Created conversation:', newConversation);
    
    // Step 2: Add creator as owner
    const { data: creatorParticipant, error: creatorError } = await supabase
      .from('conversation_participants')
      .insert([{
        conversation_id: newConversation.id,
        user_id: creatorId,
        role: 'owner',
        joined_at: new Date().toISOString()
      }])
      .select()
      .single();
      
    if (creatorError) {
      console.error('Error adding creator as participant:', creatorError);
      // Continue anyway - conversation was created
    } else {
      console.log('Added creator as participant:', creatorParticipant);
    }
    
    const addedParticipants: ConversationParticipant[] = [];
    if (creatorParticipant) {
      addedParticipants.push(creatorParticipant as ConversationParticipant);
    }
    
    // Step 3: Add other participants (skip creator if already present)
    for (const userId of participantIds.filter(id => id !== creatorId)) {
      console.log(`Adding participant ${userId} to conversation ${newConversation.id}`);
      
      const { data: participant, error } = await supabase
        .from('conversation_participants')
        .insert([{
          conversation_id: newConversation.id,
          user_id: userId,
          role: 'member',
          joined_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) {
        console.error(`Error adding participant ${userId}:`, error);
        // Continue anyway, don't throw here
      } else {
        console.log(`Successfully added participant ${userId}:`, participant);
        if (participant) {
          addedParticipants.push(participant as ConversationParticipant);
        }
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
      participants: addedParticipants
    };
  } catch (error) {
    console.error('Error in createConversation:', error);
    throw new Error('Failed to create conversation: ' + (error as Error).message);
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