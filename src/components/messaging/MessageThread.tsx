'use client';

import { useEffect, useRef } from 'react';
import { Message as MessageType } from '@/types/messaging';
import Message from './Message';
import MessageComposer from './MessageComposer';
import DateSeparator from './DateSeparator';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/lib/auth';
import { groupMessagesByDate } from '@/utils/messagingUtils';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MessageThreadProps {
  conversationId: string;
  title: string;
}

export default function MessageThread({ 
  conversationId,
  title
}: MessageThreadProps) {
  const { user } = useAuth();
  const { 
    messages, 
    loading, 
    error, 
    connectionStatus,
    sendMessage,
    deleteMessage
  } = useMessages(conversationId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Group messages by date
  const messageGroups = groupMessagesByDate(messages);
  
  const handleSendMessage = async (text: string, attachments: File[] = []) => {
    try {
      await sendMessage(text, attachments);
    } catch (error) {
      console.error('Error in send message handler:', error);
    }
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error('Error in delete message handler:', error);
    }
  };
  
  // Render connection status indicator
  const renderConnectionStatus = () => {
    if (connectionStatus === 'connected') {
      return (
        <div className="flex items-center text-xs px-2 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded">
          <Wifi className="h-3 w-3 mr-1" />
          Connected
        </div>
      );
    }
    
    if (connectionStatus === 'connecting') {
      return (
        <div className="flex items-center text-xs px-2 py-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Connecting...
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-xs px-2 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded">
        <WifiOff className="h-3 w-3 mr-1" />
        Disconnected
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">Error loading messages: {error.message}</p>
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Thread header */}
      <div className="border-b p-3 flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        {renderConnectionStatus()}
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messageGroups.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
            <p className="mb-2">No messages yet</p>
            <p className="text-sm">Start the conversation by sending a message below</p>
          </div>
        ) : (
          messageGroups.map(([date, dateMessages]) => (
            <div key={date} className="mb-6">
              <DateSeparator date={date} />
              <div className="space-y-1 mt-2">
                {dateMessages.map(message => (
                  <Message
                    key={message.id}
                    message={message}
                    isOwnMessage={message.user_id === user?.id}
                    onDelete={() => handleDeleteMessage(message.id)}
                    onReply={() => toast.info('Reply feature coming soon')}
                  />
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message composer */}
      <div className="border-t p-3">
        <MessageComposer 
          onSendMessage={handleSendMessage} 
          isDisabled={connectionStatus === 'disconnected'}
          placeholder={
            connectionStatus === 'disconnected' 
              ? 'Reconnecting to server...' 
              : 'Type a message...'
          }
        />
      </div>
    </div>
  );
} 