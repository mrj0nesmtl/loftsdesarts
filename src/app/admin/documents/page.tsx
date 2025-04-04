'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import DocumentUploader from '@/components/documents/DocumentUploader';
import FolderExplorer from '@/components/documents/FolderExplorer';
import DocumentGrid from '@/components/documents/DocumentGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { PlusIcon, FolderPlusIcon, SearchIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import DocumentViewer from '@/components/documents/DocumentViewer';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types definition
type Folder = {
  id: string;
  name: string;
  parent_id: string | null;
  created_by: string;
  is_syndicate: boolean;
  created_at: string;
};

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

export default function DocumentsPage() {
  const { user, userRole } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<Folder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  
  const canAddDocument = userRole === 'ADMIN' || (currentFolder && folders.find(f => f.id === currentFolder)?.created_by === user?.id);
  
  // Load folders and documents
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // First check if the tables exist
        const { data: tableList, error: tableError } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public');
        
        const foldersExist = tableList?.some(t => t.tablename === 'folders');
        const filesExist = tableList?.some(t => t.tablename === 'files');
        
        // If tables don't exist yet, just set empty arrays
        if (!foldersExist || !filesExist) {
          setFolders([]);
          setDocuments([]);
          setLoading(false);
          return;
        }
          
        // Always fetch all folders to keep the folder structure intact
        const { data: folderData, error: folderError } = await supabase
          .from('folders')
          .select('*')
          .order('name');
          
        if (folderError) throw folderError;
        
        // Set folders
        setFolders(folderData || []);
        
        // Fetch documents based on current folder
        let query = supabase.from('files').select('*');
        
        if (currentFolder) {
          query = query.eq('folder_id', currentFolder);
        } else if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        } else {
          query = query.is('folder_id', null);
        }
        
        const { data: docData, error: docError } = await query.order('created_at', { ascending: false });
        
        if (docError) throw docError;
        
        // Set documents
        setDocuments(docData || []);
        
        // Build folder path
        if (currentFolder && folderData) {
          buildFolderPath(currentFolder, folderData);
        } else {
          setFolderPath([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données. Veuillez réessayer.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentFolder, searchQuery, user?.id]);
  
  // Build the folder path for breadcrumb navigation
  const buildFolderPath = (folderId: string, allFolders: Folder[]) => {
    const path: Folder[] = [];
    let currentId = folderId;
    
    while (currentId) {
      const folder = allFolders.find(f => f.id === currentId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parent_id || '';
      } else {
        break;
      }
    }
    
    setFolderPath(path);
  };
  
  // Handle folder navigation
  const navigateToFolder = (folderId: string | null) => {
    console.log('Navigating to folder:', folderId);
    
    // Fix: Check if the folder actually exists before navigating to it
    if (folderId !== null && !folders.some(f => f.id === folderId)) {
      console.error('Attempted to navigate to a non-existent folder:', folderId);
      toast({
        title: "Erreur",
        description: "Ce dossier n'existe pas ou a été supprimé.",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentFolder(folderId);
    setSearchQuery('');
    
    // Reset document viewer if open
    if (documentViewerOpen) {
      setDocumentViewerOpen(false);
      setSelectedDocument(null);
    }
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger the search via the useEffect
  };
  
  // Create new folder
  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      console.log('Creating folder with data:', {
        name: newFolderName.trim(),
        parent_id: currentFolder,
        created_by: user?.id,
        is_syndicate: false
      });
      
      const { data, error } = await supabase
        .from('folders')
        .insert({
          name: newFolderName.trim(),
          parent_id: currentFolder,
          created_by: user?.id,
          is_syndicate: false
        })
        .select();
        
      if (error) {
        console.error('Supabase error creating folder:', error.message, error.details, error.hint);
        toast({
          title: "Erreur",
          description: `Impossible de créer le dossier: ${error.message}`,
          variant: "destructive"
        });
        throw error;
      }
      
      if (data) {
        console.log('Folder created successfully:', data);
        // Update the folder list
        setFolders([...folders, data[0]]);
        setNewFolderName('');
        setIsCreatingFolder(false);
        setDialogOpen(false);
        
        toast({
          title: "Dossier créé",
          description: `Le dossier "${data[0].name}" a été créé avec succès.`
        });
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else {
        console.error('Unknown error type:', typeof error);
      }
    }
  };
  
  // Handle folder deleted callback
  const handleFolderDeleted = async () => {
    try {
      setLoading(true);
      // Fetch updated folder list after a folder is deleted
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setFolders(data || []);
    } catch (error) {
      console.error('Error refreshing folders:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Add explicit type for the event handlers
  const handleNewFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFolderName(e.target.value);
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleDocumentDownload = async (document: Document) => {
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
      
      toast({
        title: "Téléchargement réussi",
        description: `Le fichier "${document.name}" a été téléchargé.`
      });
    } catch (err) {
      console.error('Error downloading file:', err);
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger le document. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handleDocumentDelete = async (document: Document) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${document.name}" ?`)) {
      return;
    }
    
    try {
      // First, delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.storage_path]);
        
      if (storageError) throw storageError;
      
      // Then, delete the database record
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', document.id);
        
      if (dbError) throw dbError;
      
      // Update the documents list by removing the deleted document
      setDocuments(documents.filter(doc => doc.id !== document.id));
      
      toast({
        title: "Document supprimé",
        description: `Le document "${document.name}" a été supprimé avec succès.`
      });
    } catch (err) {
      console.error('Error deleting document:', err);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer le document. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
  const handleDocumentDuplicate = async (document: Document) => {
    try {
      // First, get the file from storage
      const { data: fileData, error: fileError } = await supabase.storage
        .from('documents')
        .download(document.storage_path);
        
      if (fileError) throw fileError;
      
      // Generate a new ID and path for the duplicate
      const newId = crypto.randomUUID();
      const fileExt = document.storage_path.split('.').pop() || '';
      const newPath = `${user?.id}/${newId}.${fileExt}`;
      
      // Upload the duplicate file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(newPath, fileData, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) throw uploadError;
      
      // Create duplicate record in database
      const { data: newDocument, error: dbError } = await supabase
        .from('files')
        .insert({
          id: newId,
          name: `${document.name} (copie)`,
          folder_id: document.folder_id,
          file_type: document.file_type,
          file_size: document.file_size,
          storage_path: newPath,
          created_by: user?.id,
          requires_dual_approval: document.requires_dual_approval
        })
        .select();
        
      if (dbError) throw dbError;
      
      // Update the documents list with the new document
      if (newDocument && newDocument.length > 0) {
        setDocuments([newDocument[0], ...documents]);
        
        toast({
          title: "Document dupliqué",
          description: `Le document "${document.name}" a été dupliqué avec succès.`
        });
      }
    } catch (err) {
      console.error('Error duplicating document:', err);
      toast({
        title: "Erreur de duplication",
        description: "Impossible de dupliquer le document. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handleDocumentShare = async (document: Document) => {
    try {
      // Create a signed URL with longer expiration for sharing
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.storage_path, 60 * 60 * 24 * 7); // 7 days
        
      if (error) throw error;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(data.signedUrl);
      
      toast({
        title: "Lien de partage créé",
        description: "Le lien a été copié dans le presse-papier. Il est valide pendant 7 jours."
      });
    } catch (err) {
      console.error('Error sharing document:', err);
      toast({
        title: "Erreur de partage",
        description: "Impossible de créer un lien de partage. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // Add handler for folder created callback
  const handleFolderCreated = (folder: Folder) => {
    // Add the new folder to the list
    setFolders([...folders, folder]);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion Documentaire</h1>
          <p className="text-muted-foreground">
            Gérez et partagez des documents importants
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {canAddDocument && (
            <>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FolderPlusIcon size={16} />
                    <span className="hidden sm:inline">Nouveau dossier</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer un nouveau dossier</DialogTitle>
                    <DialogDescription>
                      Entrez le nom du nouveau dossier à créer.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    placeholder="Nom du dossier"
                    value={newFolderName}
                    onChange={handleNewFolderNameChange}
                  />
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setNewFolderName('');
                        setDialogOpen(false);
                      }}
                    >
                      Annuler
                    </Button>
                    <Button onClick={createFolder}>Créer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <DocumentUploader 
                currentFolder={currentFolder} 
                onUploadComplete={() => {
                  // Refresh document list after upload
                  navigateToFolder(currentFolder);
                }} 
              />
            </>
          )}
        </div>
      </div>
      
      {/* Search and Breadcrumb navigation */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-1 text-sm">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigateToFolder(null)}
            className={`hover:bg-muted ${currentFolder === null ? 'font-medium' : ''}`}
          >
            Tous les documents
          </Button>
          
          {folderPath.map((folder, index) => (
            <div key={folder.id} className="flex items-center">
              <span className="mx-1 text-muted-foreground">/</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToFolder(folder.id)}
                className={`hover:bg-muted ${index === folderPath.length - 1 ? 'font-medium' : ''}`}
              >
                {folder.name}
              </Button>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des documents..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
        </form>
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Folder Explorer */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Dossiers</CardTitle>
          </CardHeader>
          <CardContent>
            <FolderExplorer
              folders={folders}
              currentFolder={currentFolder}
              onFolderSelect={navigateToFolder}
              canCreateFolder={userRole === 'ADMIN'}
              onFolderDeleted={handleFolderDeleted}
              onFolderCreated={handleFolderCreated}
            />
          </CardContent>
        </Card>
        
        {/* Document Grid */}
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>
              {currentFolder 
                ? folderPath.length > 0 
                  ? `Documents - ${folderPath[folderPath.length - 1].name}` 
                  : 'Documents'
                : 'Tous les documents'
              }
            </CardTitle>
            <CardDescription>
              {loading ? 'Chargement...' : `${documents.length} document${documents.length !== 1 ? 's' : ''}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentGrid
              documents={documents}
              isLoading={loading}
              onDocumentClick={(document) => {
                // Open document viewer
                setSelectedDocument(document);
                setDocumentViewerOpen(true);
              }}
              onDocumentDownload={handleDocumentDownload}
              onDocumentDelete={handleDocumentDelete}
              onDocumentDuplicate={handleDocumentDuplicate}
              onDocumentShare={handleDocumentShare}
            />
          </CardContent>
          {documents.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium">
                  {searchQuery 
                    ? 'Aucun document trouvé' 
                    : currentFolder 
                      ? `Aucun document dans ce dossier` 
                      : 'Aucun document à la racine'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery 
                    ? 'Essayez d\'autres termes de recherche' 
                    : `${canAddDocument ? 'Téléversez un document pour commencer' : 'Aucun document disponible'}`}
                </p>
                {currentFolder && (
                  <p className="text-sm mt-3">
                    Dossier actuel: {folderPath.length > 0 ? folderPath[folderPath.length - 1].name : 'Racine'}
                  </p>
                )}
                
                {canAddDocument && !searchQuery && (
                  <div className="mt-4">
                    <DocumentUploader 
                      currentFolder={currentFolder}
                      onUploadComplete={() => {
                        console.log('Upload complete, refreshing folder', currentFolder);
                        // Force a refresh of the current folder
                        const fetchDocuments = async () => {
                          try {
                            setLoading(true);
                            
                            let query = supabase.from('files').select('*');
                            if (currentFolder) {
                              query = query.eq('folder_id', currentFolder);
                            } else {
                              query = query.is('folder_id', null);
                            }
                            
                            const { data, error } = await query.order('created_at', { ascending: false });
                            
                            if (error) throw error;
                            
                            setDocuments(data || []);
                          } catch (err) {
                            console.error('Error fetching documents after upload:', err);
                          } finally {
                            setLoading(false);
                          }
                        };
                        
                        fetchDocuments();
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* Document Viewer */}
      <DocumentViewer 
        document={selectedDocument}
        isOpen={documentViewerOpen}
        onClose={() => setDocumentViewerOpen(false)}
      />
    </div>
  );
} 