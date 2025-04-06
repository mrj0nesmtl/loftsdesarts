'use client';

import { useState, useEffect } from 'react';
import { createConversation } from '@/services/conversationService';
import { useAuth } from '@/lib/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { Conversation } from '@/types/messaging';
import { toast } from 'sonner';

interface NewConversationModalProps {
  onClose: () => void;
  onConversationCreated: (conversation: Conversation) => void;
}

interface User {
  id: string;
  display_name?: string;
  email?: string;
}

export default function NewConversationModal({
  onClose,
  onConversationCreated
}: NewConversationModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch all users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, display_name, email')
          .neq('id', user?.id || ''); // Exclude current user
        
        if (error) throw error;
        setAllUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [user?.id]);
  
  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };
  
  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // If current user is not included, add them
      const participants = [user?.id as string, ...selectedUsers];
      
      const conversation = await createConversation(
        title,
        participants,
        isGroup
      );
      
      toast.success('Conversation created');
      onConversationCreated(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to create conversation');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is-group"
              checked={isGroup}
              onCheckedChange={(checked) => setIsGroup(!!checked)}
            />
            <Label htmlFor="is-group">Group conversation</Label>
          </div>
          
          {isGroup && (
            <div className="space-y-2">
              <Label htmlFor="title">Group Name</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter group name"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Select Recipients</Label>
            
            {isLoading ? (
              <div className="text-sm text-muted-foreground py-2">Loading users...</div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-2">
                {allUsers.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-2">No users found</div>
                ) : (
                  allUsers.map(user => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleUserSelect(user.id)}
                      />
                      <Label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer">
                        {user.display_name || user.email || user.id.substring(0, 8)}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedUsers.length === 0}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 