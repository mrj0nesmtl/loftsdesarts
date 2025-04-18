'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createConversation } from '@/services/conversationService';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';

type Resident = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  unit_number?: string;
  is_owner: boolean;
  building_units?: any; // Using any type temporarily to bypass TypeScript errors
};

export default function NewConversationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResidents, setSelectedResidents] = useState<string[]>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [creating, setCreating] = useState(false);

  // Fetch residents when component mounts
  useEffect(() => {
    const fetchResidents = async () => {
      setLoading(true);
      try {
        // Query all residents and get their unit numbers
        const { data, error } = await supabase
          .from('residents')
          .select(`
            id, 
            user_id, 
            first_name, 
            last_name, 
            email, 
            is_owner,
            unit_id
          `);
        
        if (error) throw error;
        
        console.log('Fetched residents:', data);
        
        if (data && data.length > 0) {
          // Get unit numbers in a separate query for simplicity
          const unitIds = data.map(r => r.unit_id).filter(Boolean);
          
          const { data: unitsData, error: unitsError } = await supabase
            .from('building_units')
            .select('id, unit_number')
            .in('id', unitIds);
            
          if (unitsError) throw unitsError;
          
          console.log('Units data:', unitsData);
          
          // Create a map for quick lookup
          const unitMap = Object.fromEntries(
            (unitsData || []).map(unit => [unit.id, unit.unit_number])
          );
          
          // Process residents with unit numbers
          const processedResidents = data.map(resident => ({
            ...resident,
            unit_number: unitMap[resident.unit_id] || 'N/A',
            // Ensure user_id exists (use resident.id as fallback)
            user_id: resident.user_id || resident.id,
          }));
          
          setResidents(processedResidents);
          setFilteredResidents(processedResidents);
        } else {
          setResidents([]);
          setFilteredResidents([]);
        }
      } catch (error) {
        console.error('Error fetching residents:', error);
        toast.error('Failed to load residents');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResidents();
  }, []);

  // Filter residents based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResidents(residents);
      return;
    }
    
    const filtered = residents.filter(resident => {
      const fullName = `${resident.first_name} ${resident.last_name}`.toLowerCase();
      const query = searchQuery.toLowerCase();
      
      return (
        fullName.includes(query) || 
        resident.email.toLowerCase().includes(query) ||
        (resident.unit_number && resident.unit_number.toLowerCase().includes(query))
      );
    });
    
    setFilteredResidents(filtered);
  }, [searchQuery, residents]);

  // Toggle resident selection
  const toggleResidentSelection = (userId: string) => {
    setSelectedResidents(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Create new conversation and navigate to it
  const handleCreateConversation = async () => {
    if (selectedResidents.length === 0) {
      toast.error('Please select at least one resident');
      return;
    }
    
    if (isGroup && !groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }
    
    if (!user?.id) {
      toast.error('You must be logged in to create a conversation');
      return;
    }
    
    setCreating(true);
    try {
      // Create the participants list
      const participants = [
        ...selectedResidents.filter(id => id !== user.id)
      ];
      
      console.log('Current user:', user);
      console.log('Creating conversation with:', {
        creator: user.id,
        participants,
        selectedResidents
      });
      
      const title = isGroup 
        ? groupName.trim() 
        : ''; // For direct messages, the UI will show the other person's name
      
      // Explicitly pass the admin's user ID as the creator
      const conversation = await createConversation(
        title,
        participants,
        isGroup,
        user.id // Explicitly pass the creator ID
      );
      
      if (!conversation || !conversation.id) {
        throw new Error('Failed to create conversation - no ID returned');
      }
      
      console.log('Conversation created:', conversation);
      toast.success('Conversation created');
      
      // Add a delay to ensure state is updated before navigation
      setTimeout(() => {
        // Navigate to the new conversation
        const url = `/admin/messaging/${conversation.id}`;
        console.log('Redirecting to:', url);
        router.push(url);
      }, 500);
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error(`Failed to create conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/messaging')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Messages
        </Button>
        
        <h1 className="text-2xl font-bold mb-2">New Conversation</h1>
        <p className="text-muted-foreground">
          Select residents to start a new conversation
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Conversation Type</CardTitle>
          <CardDescription>
            Choose between a direct message or a group conversation
          </CardDescription>
          
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox 
              id="is-group"
              checked={isGroup}
              onCheckedChange={(checked) => setIsGroup(!!checked)}
            />
            <Label htmlFor="is-group">Create a group conversation</Label>
          </div>
          
          {isGroup && (
            <div className="mt-4">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter a name for this group"
                className="mt-2"
              />
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Select Recipients</Label>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, email, or unit..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredResidents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No residents found matching your search' : 'No residents available'}
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <div className="max-h-80 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-2 px-4 text-left font-medium">Select</th>
                        <th className="py-2 px-4 text-left font-medium">Name</th>
                        <th className="py-2 px-4 text-left font-medium">Unit</th>
                        <th className="py-2 px-4 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResidents.map(resident => (
                        <tr 
                          key={resident.id} 
                          className="border-t hover:bg-muted/50 cursor-pointer"
                          onClick={() => toggleResidentSelection(resident.user_id)}
                        >
                          <td className="py-2 px-4">
                            <Checkbox 
                              checked={selectedResidents.includes(resident.user_id)}
                              onCheckedChange={() => toggleResidentSelection(resident.user_id)}
                            />
                          </td>
                          <td className="py-2 px-4">
                            <div>{resident.first_name} {resident.last_name}</div>
                            <div className="text-sm text-muted-foreground">{resident.email}</div>
                          </td>
                          <td className="py-2 px-4">{resident.unit_number}</td>
                          <td className="py-2 px-4">
                            <span className={`text-xs px-2 py-1 rounded ${resident.is_owner ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
                              {resident.is_owner ? 'Owner' : 'Tenant'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {selectedResidents.length > 0 && (
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="font-medium mb-2">Selected Recipients ({selectedResidents.length})</div>
                <div className="flex flex-wrap gap-2">
                  {selectedResidents.map(userId => {
                    const resident = residents.find(r => r.user_id === userId);
                    if (!resident) return null;
                    
                    return (
                      <div key={userId} className="bg-muted px-2 py-1 rounded-md flex items-center text-sm">
                        {resident.first_name} {resident.last_name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 ml-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleResidentSelection(userId);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/messaging')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateConversation}
            disabled={creating || selectedResidents.length === 0 || (isGroup && !groupName.trim())}
          >
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Conversation'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 