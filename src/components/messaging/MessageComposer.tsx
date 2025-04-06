'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PaperclipIcon, Smile, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageComposerProps {
  onSendMessage: (text: string, attachments?: File[]) => Promise<void>;
  isDisabled?: boolean;
  placeholder?: string;
}

export default function MessageComposer({
  onSendMessage,
  isDisabled = false,
  placeholder = 'Type a message...'
}: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-focus the textarea on component mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  // Auto-resize the textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200 // Maximum height
      )}px`;
    }
  }, [message]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if ((!trimmedMessage && attachments.length === 0) || isSending || isDisabled) {
      return;
    }
    
    try {
      setIsSending(true);
      await onSendMessage(trimmedMessage, attachments);
      setMessage('');
      setAttachments([]);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setAttachments(Array.from(e.target.files));
    }
  };
  
  return (
    <div className="relative">
      {attachments.length > 0 && (
        <div className="flex gap-2 p-2 bg-muted/50 rounded-md mb-2">
          {attachments.map((file, index) => (
            <div key={index} className="text-xs bg-muted p-1 rounded flex items-center">
              <span className="truncate max-w-[100px]">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => {
                  setAttachments(attachments.filter((_, i) => i !== index));
                }}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-end border rounded-md bg-background overflow-hidden">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled || isSending}
          className="flex-1 py-3 px-4 h-12 max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        
        <div className="flex items-center px-3 py-2">
          <div className="flex items-center gap-2 border-r pr-2 mr-2">
            <label 
              htmlFor="file-upload" 
              className={cn(
                "cursor-pointer text-muted-foreground hover:text-foreground transition-colors",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <PaperclipIcon className="h-5 w-5" />
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                disabled={isDisabled || isSending}
                onChange={handleFileChange}
              />
            </label>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              disabled={isDisabled || isSending}
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          
          <Button
            type="button"
            size="icon"
            className="h-8 w-8"
            disabled={
              (message.trim() === '' && attachments.length === 0) ||
              isDisabled ||
              isSending
            }
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
} 