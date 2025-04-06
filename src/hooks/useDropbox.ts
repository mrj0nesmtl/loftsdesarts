import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import * as dropboxService from '@/services/dropboxService';
import type { DropboxFile, DropboxStatistics, FileUploadResult } from '@/services/dropboxService';
import { useToast } from '@/components/ui/use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/**
 * Custom hook for interacting with the DropBox feature
 */
export function useDropbox() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<DropboxFile[]>([]);
  const [userFiles, setUserFiles] = useState<DropboxFile[]>([]);
  const [sharedFiles, setSharedFiles] = useState<DropboxFile[]>([]);
  const [statistics, setStatistics] = useState<DropboxStatistics | null>(null);
  const [searchResults, setSearchResults] = useState<DropboxFile[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Set up realtime subscription for dropbox updates
  useEffect(() => {
    if (!user) return;
    
    let channel: RealtimeChannel;
    
    const setupRealtimeSubscription = async () => {
      // Check if Realtime is enabled
      try {
        const realtimeEnabled = await checkRealtimeEnabled();
        
        if (realtimeEnabled) {
          channel = supabase
            .channel('dropbox-changes')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'dropbox_files',
              },
              (payload) => {
                handleRealtimeChange(payload);
              }
            )
            .subscribe();
        }
      } catch (err) {
        console.error('Error setting up realtime subscription:', err);
      }
    };
    
    setupRealtimeSubscription();
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);
  
  // Check if Realtime is enabled
  const checkRealtimeEnabled = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_realtime_enabled');
      
      if (error) {
        console.error('Error checking if Realtime is enabled:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking Realtime status:', error);
      return false;
    }
  };
  
  // Handle realtime changes
  const handleRealtimeChange = (payload: any) => {
    if (!payload) return;
    
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    if (eventType === 'INSERT') {
      setFiles((prevFiles) => {
        // Avoid duplicate entries
        if (prevFiles.some(file => file.id === newRecord.id)) {
          return prevFiles;
        }
        return [newRecord, ...prevFiles];
      });
    } else if (eventType === 'UPDATE') {
      setFiles((prevFiles) => 
        prevFiles.map(file => 
          file.id === newRecord.id ? { ...file, ...newRecord } : file
        )
      );
    } else if (eventType === 'DELETE') {
      setFiles((prevFiles) => 
        prevFiles.filter(file => file.id !== oldRecord.id)
      );
    }
    
    // Update filtered lists
    updateFilteredLists();
  };
  
  // Fetch all files visible to the user
  const fetchFiles = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const files = await dropboxService.fetchFiles();
      setFiles(files);
      updateFilteredLists(files);
      
      // Also fetch statistics
      const stats = await dropboxService.getDropboxStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Error fetching dropbox files:', err);
      setError('Failed to load files');
      toast({
        title: 'Error',
        description: 'Failed to load files',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);
  
  // Update the filtered lists based on current files
  const updateFilteredLists = useCallback((currentFiles = files) => {
    if (!user) return;
    
    const userFilesList = currentFiles.filter(file => file.user_id === user.id);
    const sharedFilesList = currentFiles.filter(
      file => file.user_id !== user.id && file.is_public
    );
    
    setUserFiles(userFilesList);
    setSharedFiles(sharedFilesList);
  }, [files, user]);
  
  // Upload a file
  const uploadFile = useCallback(async (
    file: File,
    fileName: string,
    isPublic: boolean,
    description?: string,
    tags?: string[]
  ): Promise<FileUploadResult> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }
    
    setUploading(true);
    setError(null);
    
    try {
      const result = await dropboxService.uploadFile(
        file,
        fileName,
        isPublic,
        description,
        tags,
        user
      );
      
      if (result.success && result.file) {
        // Add the new file to the state
        setFiles(prevFiles => [result.file!, ...prevFiles]);
        updateFilteredLists();
        
        // Update statistics
        fetchStatistics();
        
        toast({
          title: 'Success',
          description: 'File uploaded successfully',
        });
      } else {
        setError(result.error || 'Failed to upload file');
        toast({
          title: 'Error',
          description: result.error || 'Failed to upload file',
          variant: 'destructive',
        });
      }
      
      return result;
    } catch (err) {
      const errorMessage = 'Failed to upload file';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  }, [user, toast, updateFilteredLists]);
  
  // Delete a file
  const deleteFile = useCallback(async (fileId: string): Promise<boolean> => {
    setError(null);
    
    try {
      const success = await dropboxService.deleteFile(fileId);
      
      if (success) {
        // Remove the file from state
        setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
        updateFilteredLists();
        
        // Update statistics
        fetchStatistics();
        
        toast({
          title: 'Success',
          description: 'File deleted successfully',
        });
      } else {
        setError('Failed to delete file');
        toast({
          title: 'Error',
          description: 'Failed to delete file',
          variant: 'destructive',
        });
      }
      
      return success;
    } catch (err) {
      const errorMessage = 'Failed to delete file';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, updateFilteredLists]);
  
  // Update file metadata
  const updateFileMetadata = useCallback(async (
    fileId: string,
    updates: {
      name?: string;
      description?: string;
      tags?: string[];
      is_public?: boolean;
    }
  ): Promise<DropboxFile | null> => {
    setError(null);
    
    try {
      const updatedFile = await dropboxService.updateFileMetadata(fileId, updates);
      
      if (updatedFile) {
        // Update file in state
        setFiles(prevFiles => 
          prevFiles.map(file => 
            file.id === fileId ? { ...file, ...updatedFile } : file
          )
        );
        updateFilteredLists();
        
        toast({
          title: 'Success',
          description: 'File updated successfully',
        });
      } else {
        setError('Failed to update file');
        toast({
          title: 'Error',
          description: 'Failed to update file',
          variant: 'destructive',
        });
      }
      
      return updatedFile;
    } catch (err) {
      const errorMessage = 'Failed to update file';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    }
  }, [toast, updateFilteredLists]);
  
  // Search for files
  const searchFiles = useCallback(async (query: string): Promise<DropboxFile[]> => {
    if (!query.trim()) {
      setSearchResults(null);
      return [];
    }
    
    setError(null);
    
    try {
      const results = await dropboxService.searchFiles(query);
      setSearchResults(results);
      return results;
    } catch (err) {
      const errorMessage = 'Search failed';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return [];
    }
  }, [toast]);
  
  // Fetch statistics
  const fetchStatistics = useCallback(async (): Promise<DropboxStatistics | null> => {
    if (!user) return null;
    
    try {
      const stats = await dropboxService.getDropboxStatistics();
      setStatistics(stats);
      return stats;
    } catch (err) {
      console.error('Error fetching statistics:', err);
      return null;
    }
  }, [user]);
  
  // Get a download URL for a file
  const getFileDownloadUrl = useCallback(async (file: DropboxFile): Promise<string | null> => {
    return dropboxService.getFileDownloadUrl(file);
  }, []);
  
  // Get a public URL for a file
  const getFilePublicUrl = useCallback((file: DropboxFile): string | null => {
    return dropboxService.getFilePublicUrl(file);
  }, []);
  
  // Initial load
  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user, fetchFiles]);
  
  return {
    loading,
    uploading,
    files,
    userFiles,
    sharedFiles,
    statistics,
    searchResults,
    error,
    fetchFiles,
    uploadFile,
    deleteFile,
    updateFileMetadata,
    searchFiles,
    fetchStatistics,
    getFileDownloadUrl,
    getFilePublicUrl,
  };
} 