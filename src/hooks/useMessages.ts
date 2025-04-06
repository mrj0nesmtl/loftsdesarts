'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from '@/types/messaging';
import { fetchMessages, sendMessage, markMessageAsRead, deleteMessage } from '@/services/messageService';
import { ConnectionStatus } from '@/types/messaging';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export const useMessages = (conversationId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  
  // Fetch initial messages when conversation changes
  useEffect(() => {
    if (!conversationId || !user?.id) {
      setMessages([]);
      setLoading(false);
      return;
    }
    
    const loadMessages = async () => {
      try {
        setLoading(true);
        const data = await fetchMessages(conversationId);
        setMessages(data);
        
        // Mark the last message as read if available
        if (data.length > 0) {
          await markMessageAsRead(data[data.length - 1].id, user.id);
        }
      } catch (err) {
        console.error('Error loading messages:', err);
        setError(err instanceof Error ? err : new Error('Failed to load messages'));
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
  }, [conversationId, user?.id]);
  
  // Subscribe to new messages using Supabase Realtime
  useEffect(() => {
    if (!conversationId || !user?.id) return;
    
    // Create a channel subscription for new messages
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        // Fetch the complete message to get all relations
        const fetchNewMessage = async () => {
          try {
            const newMessage = await fetchMessages(conversationId, 1, 0);
            
            // Only add if it's not a duplicate
            setMessages(prev => {
              if (prev.some(msg => msg.id === newMessage[0].id)) {
                return prev;
              }
              return [...prev, newMessage[0]];
            });
            
            // Mark as read if it's not from the current user
            if (newMessage[0].user_id !== user.id) {
              await markMessageAsRead(newMessage[0].id, user.id);
            }
          } catch (err) {
            console.error('Error fetching new message:', err);
          }
        };
        
        fetchNewMessage();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setConnectionStatus('disconnected');
        } else {
          setConnectionStatus('connecting');
        }
      });
    
    // Cleanup subscription on unmount or conversation change
    return () => {
      channel.unsubscribe();
    };
  }, [conversationId, user?.id]);
  
  // Send a new message
  const sendMessageToConversation = async (content: string, attachments: File[] = []) => {
    if (!conversationId || !user?.id) {
      throw new Error('Cannot send message: Missing conversation ID or user ID');
    }
    
    if (!content.trim() && attachments.length === 0) {
      throw new Error('Cannot send empty message');
    }
    
    try {
      const newMessage = await sendMessage(
        conversationId,
        user.id,
        content,
        attachments
      );
      
      // We don't need to update the state here since the real-time subscription will handle it
      return newMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
      throw err;
    }
  };
  
  // Delete a message
  const handleDeleteMessage = async (messageId: string) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    
    try {
      await deleteMessage(messageId, user.id);
      
      // Update local state by removing the deleted message
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Message deleted');
    } catch (err) {
      console.error('Error deleting message:', err);
      toast.error('Failed to delete message');
      throw err;
    }
  };
  
  return {
    messages,
    loading,
    error,
    connectionStatus,
    sendMessage: sendMessageToConversation,
    deleteMessage: handleDeleteMessage,
  };
}; 