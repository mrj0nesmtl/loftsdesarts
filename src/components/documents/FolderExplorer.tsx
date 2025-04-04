'use client';

import { useState, useEffect } from 'react';
import { 
  FolderIcon, 
  ChevronRightIcon, 
  FolderOpenIcon, 
  PlusIcon,
  Trash2Icon,
  CopyIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

type Folder = {
  id: string;
  name: string;
  parent_id: string | null;
  created_by: string;
  is_syndicate: boolean;
  created_at: string;
};

interface FolderExplorerProps {
  folders: Folder[];
  currentFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
  canCreateFolder?: boolean;
  onFolderDeleted?: () => void;
  onFolderCreated?: (folder: Folder) => void;
}

export default function FolderExplorer({ 
  folders, 
  currentFolder, 
  onFolderSelect,
  canCreateFolder = false,
  onFolderDeleted,
  onFolderCreated
}: FolderExplorerProps) {
  // Organize folders into a tree structure
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Get root folders
  const rootFolders = folders.filter(folder => !folder.parent_id);
  
  // Auto-expand folders in the path to the current folder
  useEffect(() => {
    if (currentFolder) {
      const newExpandedFolders = new Set(expandedFolders);
      let currentParentId: string | null = folders.find(f => f.id === currentFolder)?.parent_id || null;
      
      // Add all parent folders to expanded set
      while (currentParentId) {
        newExpandedFolders.add(currentParentId);
        currentParentId = folders.find(f => f.id === currentParentId)?.parent_id || null;
      }
      
      setExpandedFolders(newExpandedFolders);
    }
  }, [currentFolder, folders]);
  
  // Toggle folder expand state
  const toggleFolder = (folderId: string) => {
    const newExpandedFolders = new Set(expandedFolders);
    if (expandedFolders.has(folderId)) {
      newExpandedFolders.delete(folderId);
    } else {
      newExpandedFolders.add(folderId);
    }
    setExpandedFolders(newExpandedFolders);
  };

  // Delete folder function
  const deleteFolder = async (folder: Folder, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isDeleting) return;
    
    // Check if the folder has child folders
    const hasChildren = folders.some(f => f.parent_id === folder.id);
    
    if (hasChildren) {
      toast({
        title: "Suppression impossible",
        description: "Veuillez d'abord supprimer les dossiers enfants.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if folder has files (we would need another API call for this)
    try {
      setIsDeleting(true);
      
      // First check if there are any files in this folder
      const { data: files, error: filesError } = await supabase
        .from('files')
        .select('id')
        .eq('folder_id', folder.id)
        .limit(1);
      
      if (filesError) throw filesError;
      
      if (files && files.length > 0) {
        toast({
          title: "Suppression impossible",
          description: "Ce dossier contient des fichiers. Veuillez d'abord les supprimer.",
          variant: "destructive"
        });
        setIsDeleting(false);
        return;
      }
      
      // Delete the folder
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folder.id);
      
      if (error) throw error;
      
      toast({
        title: "Dossier supprimé",
        description: `Le dossier "${folder.name}" a été supprimé avec succès.`
      });
      
      // If we're currently viewing this folder, go back to parent
      if (currentFolder === folder.id) {
        onFolderSelect(folder.parent_id);
      }
      
      // Call callback to refresh folders list
      if (onFolderDeleted) {
        onFolderDeleted();
      }
      
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le dossier. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Add duplicateFolder function
  const duplicateFolder = async (folder: Folder, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Create a new folder with similar properties but a different name
      const { data, error } = await supabase
        .from('folders')
        .insert({
          name: `${folder.name} (copie)`,
          parent_id: folder.parent_id,
          created_by: folder.created_by,
          is_syndicate: folder.is_syndicate
        })
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        toast({
          title: "Dossier dupliqué",
          description: `Le dossier "${folder.name}" a été dupliqué avec succès.`
        });
        
        // Call callback to refresh folders list or update locally
        if (onFolderCreated) {
          onFolderCreated(data[0]);
        } else if (onFolderDeleted) {
          // Use the folder deleted callback as a fallback to refresh the list
          onFolderDeleted();
        }
      }
    } catch (error) {
      console.error('Error duplicating folder:', error);
      toast({
        title: "Erreur",
        description: "Impossible de dupliquer le dossier. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
  // Render a folder and its children recursively
  const renderFolder = (folder: Folder, depth = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = currentFolder === folder.id;
    const hasChildren = folders.some(f => f.parent_id === folder.id);
    
    // Always show the selected folder even if parent isn't expanded
    const isInSelectedPath = (() => {
      if (!currentFolder) return false;
      let parentId = folders.find(f => f.id === currentFolder)?.parent_id;
      while (parentId) {
        if (parentId === folder.id) return true;
        parentId = folders.find(f => f.id === parentId)?.parent_id;
      }
      return false;
    })();
    
    // Handle folder click with better logging
    const handleFolderClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Folder clicked:', folder.id, folder.name);
      
      try {
        // Ensure folder exists before navigating
        const folderExists = folders.some(f => f.id === folder.id);
        if (!folderExists) {
          console.error(`Attempted to navigate to a non-existent folder: ${folder.id}`);
          toast({
            title: "Erreur",
            description: "Ce dossier n'existe pas ou a été supprimé.",
            variant: "destructive"
          });
          return;
        }
        
        // Add folder to expanded set to ensure it stays expanded
        if (hasChildren) {
          const newExpandedFolders = new Set(expandedFolders);
          newExpandedFolders.add(folder.id);
          setExpandedFolders(newExpandedFolders);
        }
        
        onFolderSelect(folder.id);
      } catch (error) {
        console.error('Error navigating to folder:', error);
        toast({
          title: "Erreur de navigation",
          description: "Impossible d'accéder à ce dossier.",
          variant: "destructive"
        });
      }
    };
    
    return (
      <div key={folder.id} className="select-none group">
        <div 
          className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted ${
            isSelected ? 'bg-muted font-medium text-primary' : ''
          }`}
          style={{ paddingLeft: `${(depth * 16) + 8}px` }}
          onClick={handleFolderClick}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {hasChildren && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder.id);
                }}
                className="flex-shrink-0 mr-0.5 w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <ChevronRightIcon className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            )}
            {!hasChildren && <span className="w-4 h-4 flex-shrink-0" />}
            
            {isSelected ? (
              <FolderOpenIcon className="h-4 w-4 text-primary flex-shrink-0" />
            ) : (
              <FolderIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
            <span className="truncate">{folder.name}</span>
          </div>
          
          {!folder.is_syndicate && (
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
              <button 
                type="button"
                onClick={(e) => duplicateFolder(folder, e)}
                className="ml-auto text-muted-foreground hover:text-primary"
                aria-label={`Dupliquer le dossier ${folder.name}`}
              >
                <CopyIcon className="h-3.5 w-3.5" />
              </button>
              <button 
                type="button"
                onClick={(e) => deleteFolder(folder, e)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Supprimer le dossier ${folder.name}`}
              >
                <Trash2Icon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
        
        {(isExpanded || isInSelectedPath) && (
          <div className="pl-4 ml-3 mt-0.5 mb-0.5 relative">
            {/* Vertical line indicating hierarchy */}
            <div className="absolute top-0 bottom-0 left-0 w-px bg-muted-foreground/20" />
            
            <div className="space-y-0.5">
              {folders
                .filter(f => f.parent_id === folder.id)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(childFolder => renderFolder(childFolder, depth + 1))
              }
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Mes dossiers</h3>
        {canCreateFolder && (
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">Nouveau dossier</span>
          </Button>
        )}
      </div>
      
      <div className="overflow-auto max-h-[50vh]">
        {/* Root level navigation - Now hidden and handled via breadcrumbs in the parent component */}
        <div 
          className={`flex items-center py-1 px-2 rounded-md cursor-pointer hover:bg-muted mb-2 ${
            currentFolder === null ? 'bg-muted font-medium' : ''
          } opacity-0 h-0 pointer-events-none`}
          onClick={() => onFolderSelect(null)}
        >
          <FolderIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Racine</span>
        </div>
        
        {rootFolders.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2 px-2">
            Aucun dossier trouvé
          </p>
        ) : (
          <div className="space-y-1">
            {rootFolders
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(folder => renderFolder(folder))}
          </div>
        )}
      </div>
    </div>
  );
} 