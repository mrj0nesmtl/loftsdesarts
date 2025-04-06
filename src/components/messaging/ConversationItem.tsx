'use client';

import { useRouter } from 'next/navigation';
import { Conversation } from '@/types/messaging';
import { formatConversationTimestamp } from '@/utils/messagingUtils';
import { getConversationDisplayName } from '@/utils/messagingUtils';
import { getMessagePreview } from '@/utils/messagingUtils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from '@/lib/auth';

interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
}

export default function ConversationItem({ 
  conversation, 
  isActive = false 
}: ConversationItemProps) {
  const router = useRouter();
  const { user } = useAuth();
  const currentUserId = user?.id || '';
  
  const displayName = getConversationDisplayName(conversation, currentUserId);
  const timestamp = conversation.last_message?.created_at 
    ? formatConversationTimestamp(conversation.last_message.created_at)
    : formatConversationTimestamp(conversation.created_at);
    
  const preview = conversation.last_message?.content
    ? getMessagePreview(conversation.last_message.content)
    : 'No messages yet';
    
  const hasUnread = (conversation.unreadCount || 0) > 0;
  
  // Get the first letter of the display name for avatar fallback
  const avatarFallback = displayName.charAt(0).toUpperCase();
  
  const handleClick = () => {
    router.push(`/admin/messaging/${conversation.id}`);
  };
  
  return (
    <div 
      className={cn(
        "flex items-start p-3 gap-3 cursor-pointer hover:bg-muted/50 transition-colors",
        isActive ? "bg-muted" : "",
        hasUnread ? "font-medium" : ""
      )}
      onClick={handleClick}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src="" alt={displayName} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium truncate">{displayName}</div>
          <div className="text-xs text-muted-foreground">{timestamp}</div>
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <div 
            className={cn(
              "text-xs text-muted-foreground truncate",
              hasUnread ? "text-foreground" : ""
            )}
          >
            {preview}
          </div>
          
          {hasUnread && (
            <Badge 
              variant="default" 
              className="h-5 w-5 rounded-full ml-2 text-xs flex items-center justify-center"
            >
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
} 