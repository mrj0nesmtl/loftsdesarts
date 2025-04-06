/**
 * Message Service
 * Functions for interacting with messages in the messaging system
 */

import { supabase } from '@/lib/supabase';
import { Message, Attachment, ReadReceipt } from '@/types/messaging';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetch messages for a conversation
 * @param conversationId The conversation ID
 * @param limit Maximum number of messages to fetch
 * @param offset Offset for pagination
 * @returns Array of messages
 */
export const fetchMessages = async (
  conversationId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> => {
  try {
    // Base query with just essential fields
    let query = `
      id, 
      conversation_id,
      user_id,
      content, 
      created_at, 
      updated_at,
      is_system,
      metadata
    `;
    
    // Check if related tables exist
    const { data: tableList } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    const tables = tableList?.map(t => t.tablename) || [];
    
    // Add related tables to query if they exist
    if (tables.includes('message_attachments')) {
      query += `,
        message_attachments (
          id, 
          file_name, 
          file_type, 
          file_size, 
          file_url, 
          file_path, 
          created_at
        )`;
    }
    
    if (tables.includes('message_reactions')) {
      query += `,
        message_reactions (
          id, 
          user_id, 
          reaction_type, 
          created_at
        )`;
    }
    
    if (tables.includes('message_read_receipts')) {
      query += `,
        message_read_receipts (
          id,
          user_id,
          read_at
        )`;
    }
    
    const { data, error } = await supabase
      .from('messages')
      .select(query)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    // Transform data to match our types
    const transformedMessages = (data || []).map(message => ({
      ...message,
      is_system: message.is_system || false,
      metadata: message.metadata || {},
      // Map property names to match our types
      attachments: message.message_attachments,
      message_reactions: message.message_reactions,
      read_receipts: message.message_read_receipts,
    }));
    
    return transformedMessages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return []; // Return empty array instead of throwing to prevent UI breaking
  }
};

/**
 * Send a new message
 * @param conversationId The conversation ID
 * @param userId The sender's user ID
 * @param content The message content
 * @param attachments Optional file attachments
 * @returns The created message
 */
export const sendMessage = async (
  conversationId: string,
  userId: string,
  content: string,
  attachments: File[] = []
): Promise<Message> => {
  try {
    // Insert the message
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        content: content.trim(),
        is_system: false
      })
      .select()
      .single();
    
    if (messageError) throw messageError;
    
    // Upload attachments if any
    if (attachments.length > 0 && messageData) {
      const messageId = messageData.id;
      const attachmentPromises = attachments.map(file => uploadAttachment(file, messageId));
      await Promise.all(attachmentPromises);
    }
    
    // Mark the message as read by the sender
    await markMessageAsRead(messageData.id, userId);
    
    return messageData;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Upload a file attachment for a message
 * @param file The file to upload
 * @param messageId The message ID
 * @returns The created attachment record
 */
export const uploadAttachment = async (
  file: File,
  messageId: string
): Promise<Attachment> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `message-attachments/${messageId}/${fileName}`;
    
    // Upload the file to storage
    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath);
    
    // Create the attachment record
    const { data, error } = await supabase
      .from('message_attachments') // Use correct table name
      .insert({
        message_id: messageId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: urlData.publicUrl,
        file_path: filePath
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error;
  }
};

/**
 * Mark a message as read by a user
 * @param messageId The message ID
 * @param userId The user ID
 * @returns The created or updated read receipt
 */
export const markMessageAsRead = async (
  messageId: string,
  userId: string
): Promise<ReadReceipt> => {
  try {
    // Check if message_read_receipts table exists
    const { data: tableList } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .eq('tablename', 'message_read_receipts');
    
    if (!tableList || tableList.length === 0) {
      // Table doesn't exist, create a fake read receipt
      return {
        id: uuidv4(),
        message_id: messageId,
        user_id: userId,
        read_at: new Date().toISOString()
      };
    }
    
    // Upsert the read receipt
    const { data, error } = await supabase
      .from('message_read_receipts') // Use correct table name
      .upsert({
        message_id: messageId,
        user_id: userId,
        read_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error marking message as read:', error);
    // Return a fake read receipt to prevent UI breaking
    return {
      id: uuidv4(),
      message_id: messageId,
      user_id: userId,
      read_at: new Date().toISOString()
    };
  }
};

/**
 * Delete a message
 * @param messageId The message ID
 * @param userId The user ID (for authorization check)
 * @returns Success status
 */
export const deleteMessage = async (
  messageId: string,
  userId: string
): Promise<boolean> => {
  try {
    // First verify the user owns the message
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('user_id')
      .eq('id', messageId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Check if the user is authorized to delete this message
    if (message.user_id !== userId) {
      throw new Error('Unauthorized: You cannot delete messages sent by other users');
    }
    
    // Delete the message
    const { error: deleteError } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);
    
    if (deleteError) throw deleteError;
    
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}; 