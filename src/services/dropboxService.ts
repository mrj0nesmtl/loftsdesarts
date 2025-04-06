import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

// Types
export type DropboxFile = {
  id: string;
  name: string;
  size: number;
  created_at: string;
  updated_at: string;
  mime_type: string;
  user_id: string;
  is_public: boolean;
  storage_path: string;
  thumbnail_path?: string;
  description?: string;
  tags?: string[];
};

export type DropboxStatistics = {
  total_files: number;
  total_size: number;
  public_files: number;
  private_files: number;
  by_type: Record<string, number>;
};

export type FileUploadResult = {
  success: boolean;
  file?: DropboxFile;
  error?: string;
};

/**
 * Fetch all files visible to the current user
 * This includes the user's own files and public files from other users
 */
export async function fetchFiles(): Promise<DropboxFile[]> {
  try {
    const { data, error } = await supabase
      .from('dropbox_files')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching dropbox files:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchFiles:', error);
    return [];
  }
}

/**
 * Fetch files owned by a specific user
 */
export async function fetchUserFiles(userId: string): Promise<DropboxFile[]> {
  try {
    const { data, error } = await supabase
      .from('dropbox_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user dropbox files:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchUserFiles:', error);
    return [];
  }
}

/**
 * Search for files based on name, description, or tags
 */
export async function searchFiles(query: string): Promise<DropboxFile[]> {
  try {
    const { data, error } = await supabase
      .rpc('search_dropbox_files', { search_query: query });
    
    if (error) {
      console.error('Error searching dropbox files:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in searchFiles:', error);
    return [];
  }
}

/**
 * Upload a file to the dropbox
 */
export async function uploadFile(
  file: File,
  fileName: string,
  isPublic: boolean,
  description?: string,
  tags?: string[],
  user?: User
): Promise<FileUploadResult> {
  try {
    if (!user) {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' };
      }
      user = currentUser;
    }

    // Generate a unique identifier
    const fileId = crypto.randomUUID();
    const fileExt = file.name.split('.').pop();
    const storagePath = `${isPublic ? 'public' : 'private'}/${fileId}.${fileExt}`;
    
    // Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from('dropbox')
      .upload(storagePath, file);
    
    if (uploadError) {
      console.error('Error uploading file to storage:', uploadError);
      return { success: false, error: uploadError.message };
    }
    
    // Determine if we need to generate a thumbnail
    let thumbnailPath: string | undefined = undefined;
    if (file.type.startsWith('image/')) {
      // For now, we're not implementing actual thumbnail generation
      // This would typically use a server function or external service
      const thumbnailId = crypto.randomUUID();
      thumbnailPath = `thumbnails/${thumbnailId}.jpg`;
    }
    
    // Create database record
    const newFile: Omit<DropboxFile, 'created_at' | 'updated_at'> = {
      id: fileId,
      name: fileName,
      size: file.size,
      mime_type: file.type,
      user_id: user.id,
      is_public: isPublic,
      storage_path: storagePath,
      thumbnail_path: thumbnailPath,
      description,
      tags
    };
    
    const { data: fileData, error: dbError } = await supabase
      .from('dropbox_files')
      .insert(newFile)
      .select()
      .single();
    
    if (dbError) {
      console.error('Error creating database record:', dbError);
      
      // Try to clean up the uploaded file
      await supabase.storage
        .from('dropbox')
        .remove([storagePath]);
      
      return { success: false, error: dbError.message };
    }
    
    return { success: true, file: fileData };
  } catch (error) {
    console.error('Error in uploadFile:', error);
    return { success: false, error: 'Failed to upload file' };
  }
}

/**
 * Update file metadata (name, description, tags, visibility)
 */
export async function updateFileMetadata(
  fileId: string,
  updates: {
    name?: string;
    description?: string;
    tags?: string[];
    is_public?: boolean;
  }
): Promise<DropboxFile | null> {
  try {
    const { data, error } = await supabase
      .from('dropbox_files')
      .update(updates)
      .eq('id', fileId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating file metadata:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateFileMetadata:', error);
    return null;
  }
}

/**
 * Delete a file
 */
export async function deleteFile(fileId: string): Promise<boolean> {
  try {
    // First, get the file to find the storage path
    const { data: file, error: fetchError } = await supabase
      .from('dropbox_files')
      .select('storage_path')
      .eq('id', fileId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching file for deletion:', fetchError);
      throw fetchError;
    }
    
    if (!file) {
      return false;
    }
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('dropbox')
      .remove([file.storage_path]);
    
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      throw storageError;
    }
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('dropbox_files')
      .delete()
      .eq('id', fileId);
    
    if (dbError) {
      console.error('Error deleting file from database:', dbError);
      throw dbError;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteFile:', error);
    return false;
  }
}

/**
 * Get statistics about dropbox files
 */
export async function getDropboxStatistics(userId?: string): Promise<DropboxStatistics | null> {
  try {
    const { data, error } = await supabase
      .rpc('get_dropbox_statistics', { user_id_param: userId || null });
    
    if (error) {
      console.error('Error fetching dropbox statistics:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getDropboxStatistics:', error);
    return null;
  }
}

/**
 * Get a download URL for a file
 */
export async function getFileDownloadUrl(file: DropboxFile): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('dropbox')
      .createSignedUrl(file.storage_path, 60 * 5); // 5 minutes
    
    if (error) {
      console.error('Error creating signed URL:', error);
      throw error;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error in getFileDownloadUrl:', error);
    return null;
  }
}

/**
 * Get a public URL for a file (only works for public files)
 */
export function getFilePublicUrl(file: DropboxFile): string | null {
  if (!file.is_public) {
    return null;
  }
  
  const { data } = supabase.storage
    .from('dropbox')
    .getPublicUrl(file.storage_path);
  
  return data.publicUrl;
}

/**
 * Check if the dropbox bucket exists
 */
export async function checkDropboxBucketExists(): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.getBucket('dropbox');
    
    if (error) {
      console.error('Error checking dropbox bucket:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in checkDropboxBucketExists:', error);
    return false;
  }
} 