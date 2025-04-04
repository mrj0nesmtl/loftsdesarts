'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';
import { PlusIcon, UploadIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

interface DocumentUploaderProps {
  currentFolder: string | null;
  onUploadComplete: () => void;
}

export default function DocumentUploader({ currentFolder, onUploadComplete }: DocumentUploaderProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const files = fileInput.files;
    
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      const file = files[0];
      const fileId = uuidv4();
      const fileExt = file.name.split('.').pop();
      const fileName = file.name;
      const filePath = `${user?.id}/${fileId}.${fileExt}`;
      
      console.log('Uploading file to folder:', currentFolder ? currentFolder : 'Root folder');
      
      // Upload file to Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      const fileSizeInBytes = file.size;
      const fileType = file.type;
      
      // Create database record
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          id: fileId,
          name: fileName,
          folder_id: currentFolder,
          file_type: fileType,
          file_size: fileSizeInBytes,
          storage_path: filePath,
          created_by: user?.id,
          requires_dual_approval: false
        });
      
      if (dbError) throw dbError;
      
      // Reset the file input
      fileInput.value = '';
      
      // Call the callback to refresh the folder view
      console.log('Upload successful, refreshing view');
      onUploadComplete();
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div>
      <input
        id="file-upload"
        type="file"
        className="sr-only"
        onChange={handleFileUpload}
        accept="application/pdf,image/*,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
      />
      <label htmlFor="file-upload">
        <Button 
          variant="default" 
          size="sm" 
          className="gap-1"
          disabled={isUploading}
          asChild
        >
          <span>
            {isUploading ? <UploadIcon size={16} /> : <PlusIcon size={16} />}
            <span className="hidden sm:inline">Téléverser</span>
          </span>
        </Button>
      </label>
      
      {isUploading && (
        <div className="mt-2 w-full">
          <Progress value={uploadProgress} className="h-2 w-full" />
          <p className="text-xs text-muted-foreground mt-1">
            Téléversement {Math.round(uploadProgress)}%
          </p>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
} 