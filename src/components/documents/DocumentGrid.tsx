'use client';

import { useState } from 'react';
import { formatBytes, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MoreHorizontalIcon, 
  FileIcon, 
  ImageIcon, 
  FileTextIcon, 
  FileSpreadsheetIcon as FileSpreadsheetIconFallback,
  FileArchiveIcon as FileArchiveIconFallback,
  PresentationIcon,
  FileTypeIcon,
  DownloadIcon,
  EyeIcon,
  TrashIcon,
  CopyIcon,
  ShareIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Document = {
  id: string;
  name: string;
  folder_id: string | null;
  file_type: string;
  file_size: number;
  storage_path: string;
  thumbnail_url: string | null;
  created_by: string;
  created_at: string;
  requires_dual_approval: boolean;
};

interface DocumentGridProps {
  documents: Document[];
  isLoading: boolean;
  onDocumentClick: (document: Document) => void;
  onDocumentDownload?: (document: Document) => void;
  onDocumentDelete?: (document: Document) => void;
  onDocumentDuplicate?: (document: Document) => void;
  onDocumentShare?: (document: Document) => void;
}

// Create components for missing icons
const FileSpreadsheetIcon = FileSpreadsheetIconFallback || ((props: any) => <FileIcon {...props} />);
const FileArchiveIcon = FileArchiveIconFallback || ((props: any) => <FileIcon {...props} />);
const FilePresentationIcon = PresentationIcon;
const FileType2Icon = FileTypeIcon || ((props: any) => <FileIcon {...props} />);

// Get appropriate icon based on file type
const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) {
    return <ImageIcon className="h-full w-full text-blue-500" />;
  } else if (fileType === 'application/pdf') {
    return <FileTextIcon className="h-full w-full text-red-500" />;
  } else if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) {
    return <FileSpreadsheetIcon className="h-full w-full text-green-500" />;
  } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
    return <FilePresentationIcon className="h-full w-full text-orange-500" />;
  } else if (fileType.includes('zip') || fileType.includes('compressed') || fileType.includes('archive')) {
    return <FileArchiveIcon className="h-full w-full text-purple-500" />;
  } else if (fileType.includes('word') || fileType.includes('document')) {
    return <FileType2Icon className="h-full w-full text-blue-700" />;
  } else {
    return <FileIcon className="h-full w-full text-gray-500" />;
  }
};

export default function DocumentGrid({ 
  documents, 
  isLoading, 
  onDocumentClick,
  onDocumentDownload,
  onDocumentDelete,
  onDocumentDuplicate,
  onDocumentShare
}: DocumentGridProps) {
  // Function to get a readable file type name
  const getFileTypeName = (fileType: string) => {
    if (fileType.startsWith('image/')) return 'Image';
    if (fileType === 'application/pdf') return 'PDF';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'Tableur';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'Présentation';
    if (fileType.includes('word') || fileType.includes('document')) return 'Document';
    if (fileType.includes('zip') || fileType.includes('compressed')) return 'Archive';
    
    // If none of the above, return the extension
    const parts = fileType.split('/');
    return parts[parts.length - 1].toUpperCase();
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <div className="aspect-square bg-muted flex items-center justify-center">
              <Skeleton className="h-16 w-16 rounded" />
            </div>
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {documents.map(document => (
        <div key={document.id} className="group border rounded-lg overflow-hidden hover:border-primary/50 hover:shadow-sm transition-all">
          <div 
            className="aspect-square bg-muted flex items-center justify-center p-6 cursor-pointer"
            onClick={() => onDocumentClick(document)}
          >
            {document.thumbnail_url ? (
              <img 
                src={document.thumbnail_url} 
                alt={document.name} 
                className="h-full w-full object-contain" 
              />
            ) : (
              <div className="h-20 w-20">
                {getFileIcon(document.file_type)}
              </div>
            )}
          </div>
          
          <div className="p-3 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3 
                className="font-medium text-sm truncate cursor-pointer hover:text-primary"
                onClick={() => onDocumentClick(document)}
                title={document.name}
              >
                {document.name}
              </h3>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontalIcon className="h-4 w-4" />
                    <span className="sr-only">Options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onDocumentClick(document)}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    <span>Prévisualiser</span>
                  </DropdownMenuItem>
                  
                  {onDocumentDownload && (
                    <DropdownMenuItem onClick={() => onDocumentDownload(document)}>
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      <span>Télécharger</span>
                    </DropdownMenuItem>
                  )}
                  
                  {onDocumentDuplicate && (
                    <DropdownMenuItem onClick={() => onDocumentDuplicate(document)}>
                      <CopyIcon className="mr-2 h-4 w-4" />
                      <span>Dupliquer</span>
                    </DropdownMenuItem>
                  )}
                  
                  {onDocumentShare && (
                    <DropdownMenuItem onClick={() => onDocumentShare(document)}>
                      <ShareIcon className="mr-2 h-4 w-4" />
                      <span>Partager</span>
                    </DropdownMenuItem>
                  )}
                  
                  {onDocumentDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDocumentDelete(document)}
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        <span>Supprimer</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="px-1 text-[10px] font-normal">
                  {getFileTypeName(document.file_type)}
                </Badge>
                <span>{formatBytes(document.file_size)}</span>
              </div>
              <time dateTime={document.created_at}>{formatDate(document.created_at)}</time>
            </div>
            
            {document.requires_dual_approval && (
              <div className="mt-1">
                <Badge variant="secondary" className="text-[10px]">Double approbation</Badge>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 