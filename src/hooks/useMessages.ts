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
    
    // Check if realtime is enabled before setting up subscription
    const checkRealtimeEnabled = async () => {
      // Check if the required publication exists
      const { data, error } = await supabase
        .rpc('is_realtime_enabled')
        .select();
      
      if (error || !data) {
        console.warn('Realtime not enabled or could not check status:', error);
        setConnectionStatus('disconnected');
        return false;
      }
      
      return true;
    };
    
    // Create a channel subscription for new messages
    const setupSubscription = async () => {
      if (!(await checkRealtimeEnabled())) return;
      
      const channel = supabase
        .channel(`conversation-${conversationId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        }, (payload) => {
          // Handle the new message
          const handleNewMessage = async () => {
            try {
              // Get the new message's ID from the payload
              const messageId = payload.new.id;
              
              // Fetch the complete message with all relationships
              const newMessages = await fetchMessages(conversationId, 1, 0);
              if (newMessages.length === 0) return;
              
              const newMessage = newMessages[0];
              
              // Only add if it's not a duplicate
              setMessages(prev => {
                if (prev.some(msg => msg.id === newMessage.id)) {
                  return prev;
                }
                return [...prev, newMessage];
              });
              
              // Mark as read if it's not from the current user
              if (newMessage.user_id !== user.id) {
                await markMessageAsRead(newMessage.id, user.id);
              }
            } catch (err) {
              console.error('Error handling new message:', err);
            }
          };
          
          handleNewMessage();
        })
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
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
    };
    
    setupSubscription();
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
      
      // Add optimistic update since Realtime might not be working
      setMessages(prev => {
        if (prev.some(msg => msg.id === newMessage.id)) {
          return prev;
        }
        return [...prev, newMessage];
      });
      
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