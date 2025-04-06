'use client';

import { useState } from 'react';
import { Message as MessageType } from '@/types/messaging';
import { formatMessageTimestamp } from '@/utils/messagingUtils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageProps {
  message: MessageType;
  isOwnMessage: boolean;
  onReply?: () => void;
  onDelete?: () => void;
}

export default function Message({ 
  message, 
  isOwnMessage,
  onReply,
  onDelete,
}: MessageProps) {
  const [showOptions, setShowOptions] = useState(false);
  
  // Determine message status (sent, delivered, read)
  // In a real app, this would be based on read receipts
  const messageStatus = 'read'; // Placeholder, would be determined from read_receipts
  
  // Format the timestamp
  const timestamp = formatMessageTimestamp(message.created_at);
  
  // Get avatar information
  const avatarFallback = 'U';
  
  return (
    <div 
      className={cn(
        "group flex items-start gap-2 py-1 px-2 hover:bg-muted/30 rounded-lg transition-colors",
        isOwnMessage ? "flex-row-reverse" : ""
      )}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src="" alt="User" />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[75%]",
        isOwnMessage ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-3 py-2 rounded-lg",
          isOwnMessage
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}>
          <div className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
        
        <div className="flex items-center gap-1 px-1 mt-1">
          <span className="text-xs text-muted-foreground">
            {timestamp}
          </span>
          
          {isOwnMessage && (
            <div className="text-xs text-muted-foreground">
              {messageStatus === 'sent' && <Check className="h-3 w-3" />}
              {messageStatus === 'delivered' && <CheckCheck className="h-3 w-3" />}
              {messageStatus === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
            </div>
          )}
        </div>
      </div>
      
      {showOptions && (
        <div className={cn(
          "h-8 flex items-center",
          isOwnMessage ? "mr-2" : "ml-2"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isOwnMessage ? "end" : "start"}>
              <DropdownMenuItem onClick={onReply}>
                Reply
              </DropdownMenuItem>
              {isOwnMessage && (
                <DropdownMenuItem 
                  onClick={onDelete}
                  className="text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
} 