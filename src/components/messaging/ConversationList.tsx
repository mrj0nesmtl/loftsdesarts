'use client';

import { useState, useEffect } from 'react';
import { fetchConversations } from '@/services/conversationService';
import ConversationItem from './ConversationItem';
import NewConversationModal from './NewConversationModal';
import { useAuth } from '@/lib/auth';
import { Conversation } from '@/types/messaging';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

type FilterType = 'all' | 'unread' | 'important';

export default function ConversationList() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  
  // Extract the current conversation ID from the URL
  const currentConversationId = pathname.includes('/messaging/') 
    ? pathname.split('/messaging/')[1]?.split('/')[0]
    : null;
  
  useEffect(() => {
    const loadConversations = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const data = await fetchConversations(user.id);
        setConversations(data);
      } catch (err) {
        console.error('Failed to load conversations:', err);
        toast.error('Échec du chargement des conversations');
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user?.id]);

  // Filter and search conversations
  const filteredConversations = conversations
    .filter(conv => {
      if (filter === 'unread') {
        return (conv.unreadCount || 0) > 0;
      } else if (filter === 'important') {
        return conv.metadata?.important === true;
      }
      return true;
    })
    .filter(conv => {
      if (!search) return true;
      
      // Search in conversation title
      const title = conv.title?.toLowerCase() || '';
      if (title.includes(search.toLowerCase())) return true;
      
      // Search in last message
      const lastMessage = conv.last_message?.content?.toLowerCase() || '';
      if (lastMessage.includes(search.toLowerCase())) return true;
      
      // TODO: Search in participant names when participant data is available
      
      return false;
    });

  const handleNewConversation = (newConversation: Conversation) => {
    setConversations(prev => [newConversation, ...prev]);
    setShowNewModal(false);
  };

  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Conversations</h2>
          <Button 
            size="icon"
            variant="ghost"
            onClick={() => setShowNewModal(true)}
            title="Nouvelle Conversation"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des conversations..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Tous
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'unread' ? 'default' : 'outline'}
            onClick={() => setFilter('unread')}
          >
            Non lus
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'important' ? 'default' : 'outline'}
            onClick={() => setFilter('important')}
          >
            Important
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {search || filter !== 'all' 
              ? 'Aucune conversation ne correspond à votre recherche ou filtre' 
              : 'Pas encore de conversations'}
          </div>
        ) : (
          <div>
            {filteredConversations.map(conversation => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === currentConversationId}
              />
            ))}
          </div>
        )}
      </div>
      
      {showNewModal && (
        <NewConversationModal
          onClose={() => setShowNewModal(false)}
          onConversationCreated={handleNewConversation}
        />
      )}
    </div>
  );
} 