'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertCircle,
  Download,
  ExternalLink,
  FileTextIcon,
  FileIcon,
  ImageIcon,
  SheetIcon,
  ArchiveIcon,
  PresentationIcon,
  FileTypeIcon,
  Loader2
} from 'lucide-react';
import { formatBytes, formatDate, getFileExtension, isImageFile, isPdfFile } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define document type
type DocumentType = {
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

interface DocumentViewerProps {
  document: DocumentType | null;
  isOpen: boolean;
  onClose: () => void;
}

// Map missing icons to available ones
const FileSpreadsheetIcon = SheetIcon;
const FileArchiveIcon = ArchiveIcon;
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

export default function DocumentViewer({ document, isOpen, onClose }: DocumentViewerProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('preview');
  
  useEffect(() => {
    const getFileUrl = async () => {
      if (!document) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Get file URL
        const { data, error } = await supabase.storage
          .from('documents')
          .createSignedUrl(document.storage_path, 3600); // 1 hour expiry
          
        if (error) throw error;
        
        setFileUrl(data.signedUrl);
      } catch (err) {
        console.error('Error getting file URL:', err);
        setError('Impossible de charger le document. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen && document) {
      getFileUrl();
    } else {
      setFileUrl(null);
    }
  }, [document, isOpen]);
  
  const handleDownload = async () => {
    if (!document) return;
    
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.storage_path);
        
      if (error) throw error;
      
      // Create download link
      const url = URL.createObjectURL(data);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
      setError('Impossible de télécharger le document. Veuillez réessayer plus tard.');
    }
  };
  
  const renderPreview = () => {
    if (!document || !fileUrl) return null;
    
    // Handle image preview
    if (isImageFile(document.file_type)) {
      return (
        <div className="flex items-center justify-center h-full">
          <img 
            src={fileUrl} 
            alt={document.name} 
            className="max-h-[70vh] max-w-full object-contain" 
          />
        </div>
      );
    }
    
    // Handle PDF preview
    if (isPdfFile(document.file_type)) {
      return (
        <div className="h-[70vh] w-full">
          <iframe 
            src={`${fileUrl}#toolbar=0`}
            className="h-full w-full border-0"
            title={document.name}
          />
        </div>
      );
    }
    
    // For other file types, show download prompt
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
        <div className="h-24 w-24">
          {getFileIcon(document.file_type)}
        </div>
        <div>
          <h3 className="text-lg font-medium">{document.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {formatBytes(document.file_size)}
          </p>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Prévisualisation non disponible</AlertTitle>
          <AlertDescription>
            Ce type de fichier ne peut pas être prévisualisé dans le navigateur.
          </AlertDescription>
        </Alert>
        <div className="flex gap-4">
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
          <Button variant="outline" asChild>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Ouvrir dans un nouvel onglet
            </a>
          </Button>
        </div>
      </div>
    );
  };
  
  const renderDetails = () => {
    if (!document) return null;
    
    return (
      <div className="space-y-4 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Nom</h4>
            <p className="text-md">{document.name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
            <p className="text-md">{document.file_type}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Taille</h4>
            <p className="text-md">{formatBytes(document.file_size)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Date de création</h4>
            <p className="text-md">{formatDate(document.created_at)}</p>
          </div>
          {document.requires_dual_approval && (
            <div className="col-span-2">
              <h4 className="text-sm font-medium text-muted-foreground">Validation</h4>
              <p className="text-md">Ce document nécessite une double approbation</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{document?.name || 'Prévisualisation du document'}</DialogTitle>
          <DialogDescription>
            {document ? `Type: ${document.file_type} • Taille: ${formatBytes(document.file_size)}` : ''}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="preview" className="flex-1 overflow-hidden flex flex-col" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="ml-auto">
            <TabsTrigger value="preview">Prévisualisation</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="flex-1 overflow-auto mt-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Chargement du document...</p>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="mx-auto max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              renderPreview()
            )}
          </TabsContent>
          
          <TabsContent value="details" className="flex-1 overflow-auto mt-4">
            {renderDetails()}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          {!loading && !error && fileUrl && (
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 