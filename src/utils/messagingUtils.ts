/**
 * Utility functions for the messaging system
 */

import { format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';
import { Message } from '@/types/messaging';

/**
 * Format a timestamp for display in the conversation list
 * @param timestamp ISO timestamp string
 * @returns Formatted timestamp (Today, Yesterday, day of week, or date)
 */
export const formatConversationTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  
  if (isThisWeek(date)) {
    return format(date, 'EEE'); // Day of week (Mon, Tue, etc.)
  }
  
  if (isThisYear(date)) {
    return format(date, 'MMM d'); // Jan 1, Feb 2, etc.
  }
  
  return format(date, 'MM/dd/yy');
};

/**
 * Format a timestamp for display in the message thread
 * @param timestamp ISO timestamp string
 * @returns Formatted timestamp
 */
export const formatMessageTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return format(date, 'h:mm a');
};

/**
 * Group messages by date for display in the message thread
 * @param messages Array of messages
 * @returns Object with date strings as keys and arrays of messages as values
 */
export const groupMessagesByDate = (messages: Message[]): [string, Message[]][] => {
  const groups: Record<string, Message[]> = {};
  
  messages.forEach(message => {
    const date = new Date(message.created_at);
    let dateKey: string;
    
    if (isToday(date)) {
      dateKey = 'Today';
    } else if (isYesterday(date)) {
      dateKey = 'Yesterday';
    } else {
      dateKey = format(date, 'MMMM d, yyyy');
    }
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(message);
  });
  
  // Convert to array of [date, messages] pairs
  return Object.entries(groups);
};

/**
 * Get the truncated preview text for a message
 * @param content Message content
 * @param maxLength Maximum length of the preview
 * @returns Truncated message preview
 */
export const getMessagePreview = (content: string, maxLength: number = 50): string => {
  if (!content) return '';
  
  if (content.length <= maxLength) {
    return content;
  }
  
  return `${content.substring(0, maxLength).trim()}...`;
};

/**
 * Get the display name for a conversation
 * @param conversation The conversation object
 * @param currentUserId The current user's ID
 * @returns Display name for the conversation
 */
export const getConversationDisplayName = (
  conversation: any,
  currentUserId: string
): string => {
  // If the conversation has a title, use it
  if (conversation.title) {
    return conversation.title;
  }
  
  // If it's not a group chat, use the other participant's name
  if (!conversation.is_group && conversation.participants?.length) {
    const otherParticipants = conversation.participants.filter(
      (p: any) => p.user_id !== currentUserId
    );
    
    if (otherParticipants.length) {
      // Try to get the display name or use a fallback
      const participant = otherParticipants[0];
      if (participant.user?.display_name) {
        return participant.user.display_name;
      }
      
      // Fallback to email or user_id
      return participant.user?.email?.split('@')[0] || `User ${participant.user_id.substring(0, 8)}`;
    }
  }
  
  // For group chats or if we can't determine a name
  return conversation.is_group ? 'Group Conversation' : 'Conversation';
}; 