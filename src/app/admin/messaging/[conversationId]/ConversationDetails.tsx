'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchConversation } from '@/services/conversationService';
import MessageThread from '@/components/messaging/MessageThread';
import { useAuth } from '@/lib/auth';
import { Conversation } from '@/types/messaging';
import { getConversationDisplayName } from '@/utils/messagingUtils';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function ConversationDetails({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId || !user?.id) return;
      
      try {
        setLoading(true);
        console.log(`Loading conversation: ${conversationId}`);
        const data = await fetchConversation(conversationId);
        
        if (!data) {
          console.error('Conversation not found:', conversationId);
          throw new Error('Conversation not found');
        }
        
        console.log('Conversation loaded:', data);
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
      <div className="h-full flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mr-2" />
        <span>Loading conversation...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md max-w-md w-full mb-4">
          <h2 className="font-semibold text-lg mb-2">Error</h2>
          <p>{error.message}</p>
          <p className="text-sm mt-2">
            The conversation may not exist or you might not have access to it.
          </p>
        </div>
        <Button 
          onClick={() => router.push('/admin/messaging')}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Messages
        </Button>
      </div>
    );
  }
  
  if (!conversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 p-4 rounded-md max-w-md w-full mb-4">
          <h2 className="font-semibold text-lg mb-2">Conversation not found</h2>
          <p>The conversation you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
        <Button 
          onClick={() => router.push('/admin/messaging')}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Messages
        </Button>
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