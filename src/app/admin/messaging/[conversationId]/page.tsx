'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchConversation } from '@/services/conversationService';
import MessageThread from '@/components/messaging/MessageThread';
import { useAuth } from '@/lib/auth';
import { Conversation } from '@/types/messaging';
import { getConversationDisplayName } from '@/utils/messagingUtils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ConversationPage() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId || !user?.id) return;
      
      try {
        setLoading(true);
        const data = await fetchConversation(conversationId as string);
        
        if (!data) {
          throw new Error('Conversation not found');
        }
        
        setConversation(data);
      } catch (err) {
        console.error('Error loading conversation:', err);
        setError(err instanceof Error ? err : new Error('Failed to load conversation'));
        toast.error('Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };
    
    loadConversation();
  }, [conversationId, user?.id]);
  
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
        <p className="text-red-500 mb-4">Error: {error.message}</p>
        <p className="text-sm text-muted-foreground mb-4">
          The conversation may not exist or you might not have access to it.
        </p>
        <a 
          href="/admin/messaging" 
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Back to Messages
        </a>
      </div>
    );
  }
  
  if (!conversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <p className="text-lg mb-4">Conversation not found</p>
        <a 
          href="/admin/messaging" 
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Back to Messages
        </a>
      </div>
    );
  }
  
  // Get the display name for the conversation
  const displayName = getConversationDisplayName(conversation, user?.id || '');
  
  return (
    <MessageThread 
      conversationId={conversation.id} 
      title={displayName}
    />
  );
} 