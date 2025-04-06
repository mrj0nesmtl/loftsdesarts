# Session 5 Resources and Technical References

This document provides code snippets, implementation patterns, and technical references for the Session 5 development tasks, focusing on the messaging system implementation, WebSocket integration, and Resident Portal foundations.

## Database Schema Reference

### Messaging System Tables

```sql
-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message JSONB,
  is_group BOOLEAN DEFAULT FALSE,
  metadata JSONB
);

-- Conversation participants
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  last_read_message_id UUID,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  role TEXT DEFAULT 'member',
  UNIQUE(conversation_id, user_id)
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_system BOOLEAN DEFAULT FALSE,
  metadata JSONB
);

-- Message attachments
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message reactions
CREATE TABLE message_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, reaction_type)
);

-- Read receipts
CREATE TABLE read_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- Triggers to update conversation.updated_at and last_message
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    updated_at = NEW.created_at,
    last_message = json_build_object(
      'id', NEW.id,
      'content', NEW.content,
      'user_id', NEW.user_id,
      'created_at', NEW.created_at
    )
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_on_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_on_message();
```

## Supabase Realtime Integration

### Enabling Realtime on Tables

To enable Supabase Realtime on the tables, use the following SQL:

```sql
-- Enable publications for the messaging tables
BEGIN;
  -- Enable replication for the messaging tables
  ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
  ALTER PUBLICATION supabase_realtime ADD TABLE conversation_participants;
  ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  ALTER PUBLICATION supabase_realtime ADD TABLE message_reactions;
  ALTER PUBLICATION supabase_realtime ADD TABLE read_receipts;
COMMIT;
```

### Setting up Realtime Client in Next.js

```typescript
// src/lib/supabase-realtime.ts
import { createClient } from '@supabase/supabase-js';

// Create a custom client with realtime functionality enabled
export const supabaseRealtime = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Helper to create conversation channel subscriptions
export const createConversationChannel = (conversationId: string, callback: (payload: any) => void) => {
  return supabaseRealtime
    .channel(`conversation:${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`,
    }, callback)
    .subscribe();
};
```

### Implementing a Realtime Hook

```typescript
// src/hooks/useMessages.ts
import { useState, useEffect } from 'react';
import { supabase, supabaseRealtime, createConversationChannel } from '@/lib/supabase';
import { Message } from '@/types/messaging';

export const useMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id, 
            content, 
            created_at, 
            user_id,
            attachments (id, file_name, file_type, file_size, file_url),
            message_reactions (reaction_type, user_id)
          `)
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  // Subscribe to new messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = createConversationChannel(conversationId, (payload) => {
      // Update messages with the new message from the subscription
      const newMessage = payload.new as Message;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      // Update read receipt
      markMessageAsRead(newMessage.id);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [conversationId]);

  // Mark message as read
  const markMessageAsRead = async (messageId: string) => {
    const userId = supabase.auth.getUser()?.id;
    if (!userId) return;

    await supabase.from('read_receipts').upsert({
      message_id: messageId,
      user_id: userId,
      read_at: new Date().toISOString()
    });
  };

  // Send message function
  const sendMessage = async (content: string, attachments: File[] = []) => {
    const userId = supabase.auth.getUser()?.id;
    if (!userId || !conversationId) return;

    try {
      // Insert the message
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          content
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // Upload attachments if any
      if (attachments.length > 0 && messageData) {
        const attachmentPromises = attachments.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${messageData.id}-${Date.now()}.${fileExt}`;
          const filePath = `message-attachments/${conversationId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('attachments')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('attachments')
            .getPublicUrl(filePath);

          // Insert attachment record
          return supabase.from('attachments').insert({
            message_id: messageData.id,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_url: urlData.publicUrl,
            file_path: filePath
          });
        });

        await Promise.all(attachmentPromises);
      }

      return messageData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage
  };
};
```

## UI Component Patterns

### Conversation List Component Structure

```tsx
// src/components/messaging/ConversationList.tsx
import { useState, useEffect } from 'react';
import { fetchConversations } from '@/services/conversationService';
import ConversationItem from './ConversationItem';
import { useAuth } from '@/hooks/useAuth';
import { Conversation } from '@/types/messaging';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import NewConversationModal from './NewConversationModal';

export default function ConversationList() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    const loadConversations = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const data = await fetchConversations(user.id);
        setConversations(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load conversations'));
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
        return conv.unreadCount > 0;
      } else if (filter === 'important') {
        return conv.metadata?.important === true;
      }
      return true;
    })
    .filter(conv => {
      if (!search) return true;
      return conv.title.toLowerCase().includes(search.toLowerCase());
    });

  if (loading) return <div className="flex justify-center p-4">Loading conversations...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>;

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold flex-1">Conversations</h2>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setShowNewModal(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex mt-2 space-x-2">
          <Button 
            size="sm" 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'unread' ? 'default' : 'outline'}
            onClick={() => setFilter('unread')}
          >
            Unread
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
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {search || filter !== 'all' 
              ? 'No conversations match your search or filter' 
              : 'No conversations yet'}
          </div>
        ) : (
          filteredConversations.map(conversation => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
            />
          ))
        )}
      </div>
      
      {showNewModal && (
        <NewConversationModal
          onClose={() => setShowNewModal(false)}
          onConversationCreated={(newConv) => {
            setConversations(prev => [newConv, ...prev]);
            setShowNewModal(false);
          }}
        />
      )}
    </div>
  );
}
```

### MessageThread Component Structure

```tsx
// src/components/messaging/MessageThread.tsx
import { useEffect, useRef } from 'react';
import { useMessages } from '@/hooks/useMessages';
import Message from './Message';
import MessageComposer from './MessageComposer';
import { useAuth } from '@/hooks/useAuth';
import { Message as MessageType } from '@/types/messaging';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Info, Phone, Video } from 'lucide-react';
import { groupMessagesByDate } from '@/utils/messaging';
import DateSeparator from './DateSeparator';

interface MessageThreadProps {
  conversationId: string;
  participants: Array<{
    id: string;
    name: string;
    avatar_url?: string;
  }>;
}

export default function MessageThread({ conversationId, participants }: MessageThreadProps) {
  const { messages, loading, error, sendMessage } = useMessages(conversationId);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages by date
  const messageGroups = groupMessagesByDate(messages);

  // Handle send message
  const handleSendMessage = async (text: string, attachments: File[] = []) => {
    if (!text.trim() && attachments.length === 0) return;
    await sendMessage(text, attachments);
  };

  if (loading) return <div className="flex-1 flex justify-center items-center">Loading messages...</div>;
  if (error) return <div className="flex-1 p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="border-b p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8" />
          <div>
            <h3 className="font-medium">
              {participants
                .filter(p => p.id !== user?.id)
                .map(p => p.name)
                .join(', ')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {participants.length > 2 ? `${participants.length} participants` : 'Direct message'}
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messageGroups.map(([date, groupMessages]) => (
          <div key={date}>
            <DateSeparator date={date} />
            <div className="space-y-2 mt-2">
              {groupMessages.map(message => (
                <Message
                  key={message.id}
                  message={message}
                  isOwnMessage={message.user_id === user?.id}
                />
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message composer */}
      <div className="border-t p-3">
        <MessageComposer onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
```

## Package Management Implementation Patterns

### Package Status Management

```tsx
// src/components/packages/PackageStatusUpdate.tsx
import { useState } from 'react';
import { updatePackageStatus } from '@/services/packageService';
import { Package, PackageStatus } from '@/types/packages';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const STATUS_OPTIONS: { value: PackageStatus; label: string }[] = [
  { value: 'waiting', label: 'Waiting for Pickup' },
  { value: 'notified', label: 'Resident Notified' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'returned', label: 'Returned to Sender' },
  { value: 'lost', label: 'Lost/Missing' },
];

interface PackageStatusUpdateProps {
  package: Package;
  onStatusUpdated: (updatedPackage: Package) => void;
}

export default function PackageStatusUpdate({ 
  package: packageData, 
  onStatusUpdated 
}: PackageStatusUpdateProps) {
  const [status, setStatus] = useState<PackageStatus>(packageData.status);
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (status === packageData.status && !notes) return;
    
    try {
      setIsUpdating(true);
      const updatedPackage = await updatePackageStatus(packageData.id, status, notes);
      onStatusUpdated(updatedPackage);
      toast({
        title: 'Status updated',
        description: `Package status changed to ${STATUS_OPTIONS.find(s => s.value === status)?.label}`,
      });
      setNotes('');
    } catch (error) {
      console.error('Error updating package status:', error);
      toast({
        title: 'Update failed',
        description: 'Could not update package status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Update Status</label>
        <Select onValueChange={(value) => setStatus(value as PackageStatus)} defaultValue={status}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select new status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm font-medium mb-1 block">Notes</label>
        <Textarea
          placeholder="Add notes about this status change..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>
      
      <Button 
        onClick={handleStatusUpdate} 
        disabled={isUpdating || (status === packageData.status && !notes)}
        className="w-full"
      >
        {isUpdating ? 'Updating...' : 'Update Status'}
      </Button>
    </div>
  );
}
```

## Resident Portal Planning Patterns

### Authentication Flow for Residents

```tsx
// src/app/resident/auth/signin/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        throw error;
      }
      
      // Check if the user has resident role
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();
        
      if (userError) throw userError;
      
      if (userData.role !== 'RESIDENT') {
        // Sign out if not a resident
        await supabase.auth.signOut();
        throw new Error('You do not have access to the resident portal');
      }
      
      // Redirect to resident dashboard
      router.push('/resident/dashboard');
      
      toast({
        title: 'Sign in successful',
        description: 'Welcome back to Lofts des Arts resident portal',
      });
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: 'Sign in failed',
        description: error instanceof Error ? error.message : 'An error occurred while signing in',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Resident Portal</h1>
        <p className="text-muted-foreground">Sign in to access your account</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link 
                    href="/resident/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link 
            href="/resident/auth/register"
            className="text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
```

## User Journey Mapping Template

Use this template to document user journeys for the resident portal:

```markdown
# User Journey: [Journey Name]

## User Persona
- **Name:** [Persona Name]
- **Role:** Resident (Owner/Tenant)
- **Goals:** [What the user wants to accomplish]
- **Pain Points:** [Current challenges the user faces]

## Journey Map

### 1. Entry Point
- **Where:** [Starting point of the journey]
- **Trigger:** [What initiates this journey]
- **User Needs:** [What the user needs at this stage]
- **Emotions:** [How the user feels]

### 2. Authentication
- **Actions:** [What the user does to authenticate]
- **System Response:** [How the system responds]
- **Potential Issues:** [What might go wrong]
- **UI Components:** [Key components needed]

### 3. Main Task Flow
- **Step 1:** [Description of step]
  - Actions:
  - System Response:
  - UI Components:
- **Step 2:** [Description of step]
  - Actions:
  - System Response:
  - UI Components:
- **Step 3:** [Description of step]
  - Actions:
  - System Response:
  - UI Components:

### 4. Completion
- **Success Criteria:** [How we know the journey is complete]
- **Confirmation:** [What confirms completion to the user]
- **Next Steps:** [Where the user might go next]

## Edge Cases and Error Scenarios
- **Error 1:** [Description]
  - Cause:
  - User Impact:
  - Recovery Path:
- **Error 2:** [Description]
  - Cause:
  - User Impact:
  - Recovery Path:

## Technical Requirements
- **API Endpoints:** [List of required endpoints]
- **Data Requirements:** [Data needed for this journey]
- **Performance Expectations:** [Performance criteria]
- **Accessibility Considerations:** [A11y requirements]

## Success Metrics
- **Key Metrics:** [How we'll measure success]
- **Target Values:** [What good looks like]
```

## Technical Articles and References

### Supabase Realtime Documentation
- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)
- [Supabase Realtime with Next.js](https://supabase.com/docs/guides/realtime/realtime-with-nextjs)

### React State Management for Real-time Apps
- [React Query for Real-time Data](https://tanstack.com/query/latest/docs/react/guides/subscriptions)
- [Zustand for Client State in Real-time Apps](https://github.com/pmndrs/zustand)

### WebSocket Best Practices
- [MDN WebSocket Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [WebSocket Security Considerations](https://devcenter.heroku.com/articles/websocket-security)

### UI Design Patterns for Messaging
- [Chat UI Design Patterns](https://www.uxmatters.com/mt/archives/2018/06/designing-a-better-chat-ui.php)
- [UI Cheat Sheet for Chat and Messaging](https://uxdesign.cc/ui-cheat-sheet-chat-messaging-71ecb41d18d5)

### Optimistic UI Updates
- [Implementing Optimistic UI](https://www.smashingmagazine.com/2016/11/true-lies-of-optimistic-user-interfaces/)
- [TanStack Query Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)

### Accessibility for Chat Interfaces
- [Accessibility in Chat Interfaces](https://www.deque.com/blog/accessible-chat-applications/)
- [Building Accessible Web Chat](https://developer.mozilla.org/en-US/docs/Web/Accessibility/An_overview_of_accessible_web_applications_and_widgets#chat)

### Testing WebSocket Applications
- [Testing WebSocket Connections](https://www.valentinog.com/blog/jest-websocket/)
- [Mock Service Worker for WebSocket Testing](https://mswjs.io/docs/api/setup-worker/start) 