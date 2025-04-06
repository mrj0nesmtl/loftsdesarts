"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { WelcomeMessage } from "@/components/admin/WelcomeMessage";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Camera, Upload, X } from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [isConfirmingSignOut, setIsConfirmingSignOut] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSignOut = async () => {
    if (!isConfirmingSignOut) {
      setIsConfirmingSignOut(true);
      return;
    }
    
    await signOut();
    setIsConfirmingSignOut(false);
  };
  
  // Load the user's avatar when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        if (data?.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    
    fetchProfileData();
  }, [user?.id]);
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.email) return '?';
    return user.email.charAt(0).toUpperCase();
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file is an image and not too large
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image doit être inférieure à 5 Mo.');
      return;
    }
    
    setSelectedImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Cancel image selection
  const cancelSelection = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Upload profile photo
  const uploadProfilePhoto = async () => {
    if (!selectedImage || !user?.id) return;
    
    setUploading(true);
    
    try {
      // Generate a unique file name
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, selectedImage);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      // Update the profile record
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Update state
      setAvatarUrl(data.publicUrl);
      setSelectedImage(null);
      setPreviewUrl(null);
      
      toast.success('Photo de profil mise à jour.');
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast.error('Erreur lors de la mise à jour de la photo de profil.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <WelcomeMessage />
      
      <h1 className="text-3xl font-bold mb-8">Paramètres</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-card rounded-lg shadow-md overflow-hidden theme-transition">
          <div className="p-4 bg-muted/50 border-b border-border">
            <h2 className="text-lg font-medium">Photo de profil</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
              <div className="relative h-24 w-24">
                {previewUrl ? (
                  <div className="relative h-24 w-24 rounded-full overflow-hidden">
                    <Image 
                      src={previewUrl}
                      alt="Aperçu de la photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="text-2xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              
              <div className="flex flex-col space-y-3">
                <p className="text-sm text-muted-foreground">
                  Téléchargez une photo de profil pour personnaliser votre compte.
                  Les formats acceptés sont JPG, PNG et GIF (max 5 Mo).
                </p>
                
                {selectedImage ? (
                  <div className="flex space-x-3">
                    <Button 
                      onClick={uploadProfilePhoto} 
                      disabled={uploading}
                      className="flex items-center space-x-2"
                    >
                      {uploading ? (
                        <span>Téléchargement...</span>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>Télécharger</span>
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={cancelSelection}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Choisir une photo</span>
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-md overflow-hidden theme-transition">
          <div className="p-4 bg-muted/50 border-b border-border">
            <h2 className="text-lg font-medium">Informations du compte</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Courriel</p>
                <p className="text-lg">{user?.email || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Type de compte</p>
                <p className="text-lg">Administrateur</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-md overflow-hidden theme-transition">
          <div className="p-4 bg-muted/50 border-b border-border">
            <h2 className="text-lg font-medium">Notifications</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Les notifications de nouvelles demandes sont automatiquement envoyées à votre adresse courriel.
              </p>
              
              <p>
                Pour modifier les paramètres de notification, veuillez contacter votre administrateur.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-md overflow-hidden theme-transition">
          <div className="p-4 bg-muted/50 border-b border-border">
            <h2 className="text-lg font-medium">Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                {isConfirmingSignOut ? "Confirmer la déconnexion" : "Déconnexion"}
              </button>
              
              {isConfirmingSignOut && (
                <p className="text-sm text-muted-foreground mt-2">
                  Cliquez à nouveau pour confirmer la déconnexion
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 