"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UploadIcon, 
  FolderIcon, 
  FileIcon, 
  ImageIcon, 
  FileTextIcon, 
  DownloadIcon, 
  TrashIcon, 
  Share2Icon, 
  EyeIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from "next/image";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";

// Types
type DropboxFile = {
  id: string;
  name: string;
  size: number;
  created_at: string;
  mime_type: string;
  user_id: string;
  is_public: boolean;
  storage_path: string;
  thumbnail_path?: string;
};

// Helper function to format file size
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Get appropriate icon for file type
function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) {
    return <ImageIcon className="h-12 w-12 text-blue-500" />;
  } else if (mimeType.startsWith('text/')) {
    return <FileTextIcon className="h-12 w-12 text-amber-500" />;
  } else if (mimeType.startsWith('application/pdf')) {
    return <FileTextIcon className="h-12 w-12 text-red-500" />;
  } else if (mimeType.includes('document') || mimeType.includes('sheet') || mimeType.includes('presentation')) {
    return <FileTextIcon className="h-12 w-12 text-green-500" />;
  } else {
    return <FileIcon className="h-12 w-12 text-muted-foreground" />;
  }
}

export default function DropboxPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<DropboxFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [currentUserFiles, setCurrentUserFiles] = useState<DropboxFile[]>([]);
  const [sharedFiles, setSharedFiles] = useState<DropboxFile[]>([]);
  const [previewItem, setPreviewItem] = useState<DropboxFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch files on component mount
  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);
  
  // Filter files when search query changes
  useEffect(() => {
    if (files.length > 0) {
      filterFiles();
    }
  }, [searchQuery, files]);
  
  // Fetch files from storage
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dropbox_files')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setFiles(data || []);
      filterFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les fichiers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filter files based on search query
  const filterFiles = (data = files) => {
    const query = searchQuery.toLowerCase();
    const userFiles = data.filter(file => 
      file.user_id === user?.id && 
      (query === "" || file.name.toLowerCase().includes(query))
    );
    
    const shared = data.filter(file => 
      file.user_id !== user?.id && 
      file.is_public &&
      (query === "" || file.name.toLowerCase().includes(query))
    );
    
    setCurrentUserFiles(userFiles);
    setSharedFiles(shared);
  };
  
  // Handle file selection for upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Set the default file name to the original file name
      setFileName(file.name);
    }
  };
  
  // Upload file to storage
  const uploadFile = async () => {
    if (!selectedFile || !fileName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier et donner un nom",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    try {
      // Generate a unique identifier
      const fileId = crypto.randomUUID();
      const fileExt = selectedFile.name.split('.').pop();
      const storagePath = `${isPublic ? 'public' : 'private'}/${fileId}.${fileExt}`;
      
      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('dropbox')
        .upload(storagePath, selectedFile);
      
      if (uploadError) throw uploadError;
      
      // For images, generate a thumbnail
      let thumbnailPath: string | undefined = undefined;
      if (selectedFile.type.startsWith('image/')) {
        const thumbnailId = crypto.randomUUID();
        thumbnailPath = `thumbnails/${thumbnailId}.jpg`;
        
        // We're not implementing actual thumbnail generation here
        // This would typically use a server function or external service
      }
      
      // Create database record
      const { error: dbError } = await supabase
        .from('dropbox_files')
        .insert({
          id: fileId,
          name: fileName,
          size: selectedFile.size,
          mime_type: selectedFile.type,
          user_id: user?.id,
          is_public: isPublic,
          storage_path: storagePath,
          thumbnail_path: thumbnailPath
        });
      
      if (dbError) throw dbError;
      
      toast({
        title: "Fichier téléversé",
        description: "Le fichier a été téléversé avec succès",
      });
      
      // Reset form and refresh file list
      setSelectedFile(null);
      setFileName("");
      setIsPublic(true);
      fetchFiles();
      
      // Reset file input by clearing the value
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erreur",
        description: "Impossible de téléverser le fichier",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  // Download a file
  const downloadFile = async (file: DropboxFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('dropbox')
        .download(file.storage_path);
      
      if (error) throw error;
      
      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement",
        description: `Téléchargement de ${file.name} en cours`,
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier",
        variant: "destructive",
      });
    }
  };
  
  // Delete a file
  const deleteFile = async (file: DropboxFile) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('dropbox')
        .remove([file.storage_path]);
      
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('dropbox_files')
        .delete()
        .eq('id', file.id);
      
      if (dbError) throw dbError;
      
      toast({
        title: "Fichier supprimé",
        description: "Le fichier a été supprimé avec succès",
      });
      
      // Remove from state
      setFiles(files.filter(f => f.id !== file.id));
      filterFiles(files.filter(f => f.id !== file.id));
      
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le fichier",
        variant: "destructive",
      });
    }
  };
  
  // Preview a file
  const previewFile = async (file: DropboxFile) => {
    // Only preview images and PDFs
    if (!file.mime_type.startsWith('image/') && file.mime_type !== 'application/pdf') {
      toast({
        title: "Aperçu non disponible",
        description: "Ce type de fichier ne peut pas être prévisualisé",
      });
      return;
    }
    
    try {
      const { data: publicUrlData } = supabase.storage
        .from('dropbox')
        .getPublicUrl(file.storage_path);
      
      setPreviewItem(file);
      setPreviewUrl(publicUrlData.publicUrl);
    } catch (error) {
      console.error('Error generating preview URL:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer l'aperçu",
        variant: "destructive",
      });
    }
  };
  
  // Share a file (copy URL to clipboard)
  const shareFile = async (file: DropboxFile) => {
    if (!file.is_public) {
      toast({
        title: "Fichier privé",
        description: "Ce fichier est privé et ne peut pas être partagé",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: publicUrlData } = supabase.storage
        .from('dropbox')
        .getPublicUrl(file.storage_path);
      
      await navigator.clipboard.writeText(publicUrlData.publicUrl);
      
      toast({
        title: "Lien copié",
        description: "Le lien du fichier a été copié dans le presse-papier",
      });
    } catch (error) {
      console.error('Error sharing file:', error);
      toast({
        title: "Erreur",
        description: "Impossible de partager le fichier",
        variant: "destructive",
      });
    }
  };
  
  // Render file item
  const renderFileItem = (file: DropboxFile, canManage: boolean = false) => (
    <Card key={file.id} className="overflow-hidden flex flex-col">
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center justify-center mb-3">
          {file.mime_type.startsWith('image/') ? (
            <div 
              className="h-24 w-full bg-muted-foreground/10 flex items-center justify-center rounded overflow-hidden cursor-pointer"
              onClick={() => previewFile(file)}
            >
              <div className="relative h-full w-full">
                <Image 
                  src={`/api/thumbnail?path=${file.storage_path}`} 
                  alt={file.name}
                  className="object-contain"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
            </div>
          ) : (
            <div className="h-24 w-full bg-muted-foreground/10 flex items-center justify-center rounded">
              {getFileIcon(file.mime_type)}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-sm truncate" title={file.name}>
              {file.name}
            </h3>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Menu</span>
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                
                {(file.mime_type.startsWith('image/') || file.mime_type === 'application/pdf') && (
                  <DropdownMenuItem onClick={() => previewFile(file)}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    <span>Prévisualiser</span>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem onClick={() => downloadFile(file)}>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  <span>Télécharger</span>
                </DropdownMenuItem>
                
                {file.is_public && (
                  <DropdownMenuItem onClick={() => shareFile(file)}>
                    <Share2Icon className="mr-2 h-4 w-4" />
                    <span>Copier le lien</span>
                  </DropdownMenuItem>
                )}
                
                {canManage && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => deleteFile(file)}
                      className="text-destructive focus:text-destructive"
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
            <span>{formatBytes(file.size)}</span>
            <span>{formatRelative(new Date(file.created_at), new Date(), { locale: fr })}</span>
          </div>
          
          {file.is_public ? (
            <div className="flex items-center text-xs text-green-500 mt-1">
              <Share2Icon className="h-3 w-3 mr-1" />
              <span>Public</span>
            </div>
          ) : (
            <div className="flex items-center text-xs text-amber-500 mt-1">
              <span>Privé</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Drop Box</h1>
        
        <div className="flex items-center gap-2">
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-[250px]"
          />
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UploadIcon className="mr-2 h-4 w-4" />
                <span>Téléverser</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Téléverser un fichier</DialogTitle>
                <DialogDescription>
                  Les fichiers publics seront visibles par tous les utilisateurs.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Fichier</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="file-upload" 
                      type="file" 
                      onChange={handleFileChange}
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(selectedFile.size)} • {selectedFile.type}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file-name">Nom du fichier</Label>
                  <Input 
                    id="file-name" 
                    value={fileName} 
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Nom du fichier"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is-public"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="rounded border-primary h-4 w-4"
                  />
                  <Label htmlFor="is-public" className="cursor-pointer">Fichier public</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedFile(null);
                    setFileName("");
                    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={uploadFile} 
                  disabled={uploading || !selectedFile || !fileName}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Téléversement...
                    </>
                  ) : (
                    'Téléverser'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="myfiles">
        <TabsList className="mb-6">
          <TabsTrigger value="myfiles">Mes fichiers</TabsTrigger>
          <TabsTrigger value="shared">Fichiers partagés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="myfiles">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-4">
                    <Skeleton className="h-24 w-full rounded mb-3" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : currentUserFiles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <FolderIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun fichier</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous n'avez pas encore téléversé de fichiers
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <UploadIcon className="mr-2 h-4 w-4" />
                        <span>Téléverser un fichier</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      {/* Upload dialog content - same as above */}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentUserFiles.map(file => renderFileItem(file, true))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="shared">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-4">
                    <Skeleton className="h-24 w-full rounded mb-3" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sharedFiles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <FolderIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun fichier partagé</h3>
                  <p className="text-muted-foreground">
                    Aucun fichier n'a été partagé par d'autres utilisateurs
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sharedFiles.map(file => renderFileItem(file))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* File Preview Dialog */}
      {previewItem && (
        <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
          <DialogContent className="sm:max-w-[800px] md:max-w-[1000px]">
            <DialogHeader>
              <DialogTitle>{previewItem.name}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-4 h-[500px] overflow-hidden flex items-center justify-center bg-black/5 rounded">
              {previewItem.mime_type.startsWith('image/') ? (
                <div className="relative h-full w-full">
                  <Image 
                    src={previewUrl || ''} 
                    alt={previewItem.name}
                    className="object-contain"
                    fill
                    sizes="(max-width: 1200px) 100vw, 1000px"
                  />
                </div>
              ) : previewItem.mime_type === 'application/pdf' ? (
                <iframe
                  src={`${previewUrl}#toolbar=0`}
                  className="w-full h-full"
                  title={previewItem.name}
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  {getFileIcon(previewItem.mime_type)}
                  <p className="mt-4">Aperçu non disponible</p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => downloadFile(previewItem)}
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
              
              {previewItem.is_public && (
                <Button onClick={() => shareFile(previewItem)}>
                  <Share2Icon className="mr-2 h-4 w-4" />
                  Partager
                </Button>
              )}
              
              {previewUrl && (
                <a 
                  href={previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                >
                  <ExternalLinkIcon className="mr-2 h-4 w-4" />
                  Ouvrir
                </a>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 