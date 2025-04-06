"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, FileUp, ExternalLink, X, Upload } from "lucide-react";
import Link from "next/link";
import { Switch } from '@/components/ui/switch';
import { 
  SiteSetting, 
  DesignProposal,
  BackgroundImage,
  getAllSettings,
  updateSetting,
  createDesignProposal,
  getDesignProposals,
  voteOnProposal,
  getEligibleVotersCount,
  uploadHeroImage,
  getSettingValue,
  getBackgroundImages,
  setBackgroundImage,
  migrateBackgroundImages
} from '@/services/websiteService';

function WebsiteManagementPageContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [bannerText, setBannerText] = useState("");
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState<string>("");
  const [proposals, setProposals] = useState<DesignProposal[]>([]);
  const [eligibleVotersCount, setEligibleVotersCount] = useState(0);
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    settings: {} as Record<string, string>
  });
  const [backgroundImages, setBackgroundImages] = useState<BackgroundImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch settings
        const settingsData = await getAllSettings();
        setSettings(settingsData);
        
        // Set form values from settings
        const heroTitleSetting = settingsData.find((s: SiteSetting) => s.key === "hero.title");
        const heroSubtitleSetting = settingsData.find((s: SiteSetting) => s.key === "hero.subtitle");
        const bannerTextSetting = settingsData.find((s: SiteSetting) => s.key === "banner.text");
        const heroImageSetting = settingsData.find((s: SiteSetting) => s.key === "hero.image");
        
        if (heroTitleSetting) setHeroTitle(heroTitleSetting.value);
        if (heroSubtitleSetting) setHeroSubtitle(heroSubtitleSetting.value);
        if (bannerTextSetting) setBannerText(bannerTextSetting.value);
        if (heroImageSetting) setHeroImageUrl(heroImageSetting.value);
        
        // Fetch design proposals
        const proposalsData = await getDesignProposals();
        setProposals(proposalsData);
        
        // Fetch eligible voters count
        const count = await getEligibleVotersCount();
        setEligibleVotersCount(count);
        
        // Load background images
        await refreshBackgroundImages();
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load settings data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast, user?.id]);
  
  // Handle file change for hero image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroFile(file);
      // Create temporary URL for preview
      const objectUrl = URL.createObjectURL(file);
      setHeroPreview(objectUrl);
      
      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };
  
  // Save settings directly (admin only)
  const saveSettings = async () => {
    setSaving(true);
    try {
      // Get the IDs of the settings
      const heroTitleSetting = settings.find((s) => s.key === "hero.title");
      const heroSubtitleSetting = settings.find((s) => s.key === "hero.subtitle");
      const bannerTextSetting = settings.find((s) => s.key === "banner.text");
      const heroImageSetting = settings.find((s) => s.key === "hero.image");
      
      // Track errors
      const errors = [];
      
      // Update title
      if (heroTitleSetting) {
        console.log('Saving hero title:', heroTitle);
        const result = await updateSetting(heroTitleSetting.id, heroTitle);
        if (!result) errors.push("Failed to save hero title");
      }
      
      // Update subtitle
      if (heroSubtitleSetting) {
        console.log('Saving hero subtitle:', heroSubtitle);
        const result = await updateSetting(heroSubtitleSetting.id, heroSubtitle);
        if (!result) errors.push("Failed to save hero subtitle");
      }
      
      // Update banner text
      if (bannerTextSetting) {
        console.log('Saving banner text:', bannerText);
        const result = await updateSetting(bannerTextSetting.id, bannerText);
        if (!result) errors.push("Failed to save banner text");
      }
      
      // If the hero image was selected from the gallery, make sure it's saved to the database
      if (selectedImage && heroImageSetting) {
        const imageUrl = `/${selectedImage}`;
        console.log('Ensuring hero image is saved:', imageUrl);
        const result = await updateSetting(heroImageSetting.id, imageUrl);
        if (!result) errors.push("Failed to save hero image");
      }
      
      // Upload hero image if selected via file upload
      if (heroFile) {
        console.log('Uploading new hero image');
        const imageUrl = await uploadHeroImage(heroFile);
        if (imageUrl && heroImageSetting) {
          const result = await updateSetting(heroImageSetting.id, imageUrl);
          if (!result) errors.push("Failed to save uploaded hero image");
        } else {
          errors.push("Failed to upload hero image");
        }
      }
      
      if (errors.length > 0) {
        // Some errors occurred
        toast({
          title: "Partial Save",
          description: `Some changes could not be saved: ${errors.join(", ")}`,
          variant: "destructive",
        });
      } else {
        // All changes saved successfully
        toast({
          title: "Settings Saved",
          description: "All website settings have been saved successfully. Your changes are now live!",
          variant: "default",
        });
      }
      
      // Refresh settings to ensure we have the latest data
      const updatedSettings = await getAllSettings();
      setSettings(updatedSettings);
      
      // Update the form values with the latest settings
      const updatedHeroTitle = updatedSettings.find((s) => s.key === "hero.title");
      const updatedHeroSubtitle = updatedSettings.find((s) => s.key === "hero.subtitle");
      const updatedBannerText = updatedSettings.find((s) => s.key === "banner.text");
      const updatedHeroImage = updatedSettings.find((s) => s.key === "hero.image");
      
      if (updatedHeroTitle) setHeroTitle(updatedHeroTitle.value);
      if (updatedHeroSubtitle) setHeroSubtitle(updatedHeroSubtitle.value);
      if (updatedBannerText) setBannerText(updatedBannerText.value);
      if (updatedHeroImage) setHeroImageUrl(updatedHeroImage.value);
      
      // Clear file inputs
      setHeroFile(null);
      setHeroPreview(null);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Create a new design proposal
  const handleCreateProposal = async () => {
    if (!newProposal.title || !newProposal.description) {
      toast({
        title: 'Error',
        description: 'Title and description are required',
        variant: 'destructive'
      });
      return;
    }
    
    if (!user?.email) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a proposal',
        variant: 'destructive'
      });
      return;
    }
    
    setSaving(true);
    try {
      // Create a proposal with current settings as changes
      const proposedSettings: Record<string, string> = {};
      settings.forEach(s => {
        // If the setting was changed in the form, use the new value
        if (newProposal.settings[s.key]) {
          proposedSettings[s.key] = newProposal.settings[s.key];
        } else {
          proposedSettings[s.key] = s.value;
        }
      });
      
      const created = await createDesignProposal({
        title: newProposal.title,
        description: newProposal.description,
        settings: proposedSettings,
        created_by: user.email || '',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
      
      if (created) {
        // Reset form and refresh proposals
        setNewProposal({
          title: '',
          description: '',
          settings: {}
        });
        
        const updatedProposals = await getDesignProposals();
        setProposals(updatedProposals);
        
        toast({
          title: 'Success',
          description: 'Design proposal created successfully',
          variant: 'default'
        });
      } else {
        throw new Error('Failed to create design proposal');
      }
    } catch (error) {
      console.error('Error creating design proposal:', error);
      toast({
        title: 'Error',
        description: 'Failed to create design proposal',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Vote on a proposal
  const handleVote = async (proposalId: string, vote: "yes" | "no") => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "You must be logged in to vote",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await voteOnProposal(proposalId, user.email, vote === "yes" ? "yes" : "no");
      
      toast({
        title: "Vote Recorded",
        description: `Your ${vote === "yes" ? "approval" : "rejection"} has been recorded.`,
      });
      
      // Refresh proposals
      const updatedProposals = await getDesignProposals();
      setProposals(updatedProposals);
    } catch (error) {
      console.error("Error voting on proposal:", error);
      toast({
        title: "Error",
        description: "Failed to record your vote.",
        variant: "destructive"
      });
    }
  };
  
  // Helper to get current value from settings
  const getCurrentValue = (key: string, defaultValue: string = ''): string => {
    const setting = settings.find((s: SiteSetting) => s.key === key);
    return setting ? setting.value : defaultValue;
  };
  
  // Render hero preview
  const renderHeroPreview = () => {
    const heroImageUrl = heroPreview || getCurrentValue('hero.image');
    const heroTitle = getCurrentValue('hero.title', 'Les Lofts des Arts');
    const heroSubtitle = getCurrentValue('hero.subtitle', 'Bienvenue dans votre résidence');
    
    return (
      <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
        {heroImageUrl ? (
          <Image 
            src={heroImageUrl} 
            alt="Hero Preview" 
            layout="fill" 
            objectFit="cover" 
            className="brightness-75"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900" />
        )}
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
          <h1 className="text-3xl font-bold mb-2 font-title">{heroTitle}</h1>
          <p className="text-lg font-title">{heroSubtitle}</p>
        </div>
      </div>
    );
  };
  
  // Handle hero image upload
  const handleHeroUpload = async () => {
    if (!heroFile) return;
    
    setSaving(true);
    try {
      const imageUrl = await uploadHeroImage(heroFile);
      if (imageUrl) {
        // Find the hero image setting
        const heroSetting = settings.find(s => s.key === 'hero.image');
        if (heroSetting) {
          await updateSetting(heroSetting.id, imageUrl);
        }
        
        setHeroFile(null);
        toast({
          title: 'Success',
          description: 'Hero image uploaded successfully',
          variant: 'default'
        });
      } else {
        throw new Error('Failed to upload hero image');
      }
    } catch (error) {
      console.error('Error uploading hero image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload hero image',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Updated handlers for settings
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeroTitle(e.target.value);
    const titleSetting = settings.find(s => s.key === 'hero.title');
    if (titleSetting) {
      updateSetting(titleSetting.id, e.target.value);
    }
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeroSubtitle(e.target.value);
    const subtitleSetting = settings.find(s => s.key === 'hero.subtitle');
    if (subtitleSetting) {
      updateSetting(subtitleSetting.id, e.target.value);
    }
  };

  const handleBannerToggle = (checked: boolean) => {
    const setting = settings.find(s => s.key === 'banner.enabled');
    if (setting) {
      updateSetting(setting.id, checked ? 'true' : 'false');
    }
  };

  const handleBannerTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const setting = settings.find(s => s.key === 'banner.text');
    if (setting) {
      updateSetting(setting.id, e.target.value);
    }
  };

  const handleBannerColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const setting = settings.find(s => s.key === 'banner.color');
    if (setting) {
      updateSetting(setting.id, e.target.value);
    }
  };

  const handleContactEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const setting = settings.find(s => s.key === 'contact.email');
    if (setting) {
      updateSetting(setting.id, e.target.value);
    }
  };

  const handleContactPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const setting = settings.find(s => s.key === 'contact.phone');
    if (setting) {
      updateSetting(setting.id, e.target.value);
    }
  };
  
  // Submit a proposal (previous version - keep for reference but don't use)
  const submitProposal = async () => {
    if (!proposalTitle.trim() || !proposalDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and description for your proposal.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user?.email) {
      toast({
        title: "Error",
        description: "You must be logged in to create a proposal",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    try {
      // Compile changes
      const changes: Record<string, any> = {
        "hero.title": heroTitle,
        "hero.subtitle": heroSubtitle,
        "banner.text": bannerText
      };
      
      // Upload image if provided and add to changes
      if (heroImage) {
        const imageUrl = await uploadHeroImage(heroImage);
        if (imageUrl) {
          changes["hero.image"] = imageUrl;
        }
      }
      
      // NOTE: This function is using the old API and should not be called
      console.warn("submitProposal is deprecated, use handleCreateProposal instead");
      
      toast({
        title: "Proposal Created",
        description: "Your design proposal has been submitted for voting.",
      });
      
      // Reset form
      setProposalTitle("");
      setProposalDescription("");
      
    } catch (error) {
      console.error("Error creating proposal:", error);
      toast({
        title: "Error",
        description: "Failed to create design proposal.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Select and apply background image
  const handleSelectBackgroundImage = async (imagePath: string) => {
    try {
      setSelectedImage(imagePath);
      setSaving(true);
      
      // First update the UI immediately for better user experience
      // Find the image object that was selected
      const selectedImageObj = backgroundImages.find(img => img.path === imagePath);
      if (selectedImageObj) {
        setHeroImageUrl(selectedImageObj.url);
      }
      
      // Update the setting in the database
      console.log(`Applying background image: ${imagePath}`);
      const success = await setBackgroundImage(imagePath);
      
      if (success) {
        // Refresh settings to get the updated image URL
        const updatedSettings = await getAllSettings();
        setSettings(updatedSettings);
        
        // Update the hero image URL from settings
        const heroImageSetting = updatedSettings.find((s: SiteSetting) => s.key === "hero.image");
        if (heroImageSetting) setHeroImageUrl(heroImageSetting.value);
        
        toast({
          title: "Background Updated",
          description: "The homepage background has been updated successfully.",
        });
      } else {
        throw new Error("Failed to update background image");
      }
    } catch (error) {
      console.error("Error setting background image:", error);
      toast({
        title: "Error",
        description: "Failed to update the background image. Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setIsGalleryOpen(false);
    }
  };
  
  // Handle migrate images button click
  const handleMigrateImages = async () => {
    try {
      setSaving(true);
      
      const { success, count } = await migrateBackgroundImages();
      
      if (success) {
        toast({
          title: "Migration Complete",
          description: `Found ${count} images in directory.`,
        });
        
        // Refresh the image list
        await refreshBackgroundImages();
        
        // If we have images now, select the first one
        if (backgroundImages.length > 0) {
          handleSelectBackgroundImage(backgroundImages[0].path);
        }
      } else {
        throw new Error("Migration failed");
      }
    } catch (error) {
      console.error("Error migrating images:", error);
      toast({
        title: "Migration Failed",
        description: "Failed to load images from directory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Add a function to refresh background images
  const refreshBackgroundImages = async () => {
    try {
      setLoadingImages(true);
      const imagesData = await getBackgroundImages();
      
      if (imagesData && imagesData.length > 0) {
        setBackgroundImages(imagesData);
        console.log("Refreshed images:", imagesData.length);
        
        toast({
          title: "Images Refreshed",
          description: `Found ${imagesData.length} images in the directory.`,
        });
        
        // If there's a currently selected image, update its URL to the refreshed version
        if (selectedImage) {
          const refreshedImage = imagesData.find(img => img.path === selectedImage);
          if (refreshedImage) {
            setHeroImageUrl(refreshedImage.url);
          }
        }
      } else {
        toast({
          title: "No Images Found",
          description: "No images were found in the directory. Please check the secure folder.",
          variant: "destructive",
        });
      }
      
      return imagesData;
    } catch (error) {
      console.error("Error refreshing background images:", error);
      toast({
        title: "Error",
        description: "Failed to refresh background images.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoadingImages(false);
    }
  };
  
  // Component for background image gallery
  const BackgroundImageGallery = () => {
    if (!isGalleryOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black/70 z-50 overflow-y-auto p-4">
        <div className="max-w-5xl mx-auto bg-zinc-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Select Background Image</h3>
            <Button variant="ghost" onClick={() => setIsGalleryOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {loadingImages ? (
            <div className="flex justify-center items-center py-10">
              <Skeleton className="h-40 w-40 rounded-lg" />
              <Skeleton className="h-40 w-40 rounded-lg ml-4" />
              <Skeleton className="h-40 w-40 rounded-lg ml-4" />
            </div>
          ) : backgroundImages.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No background images found.</p>
              <Button onClick={handleMigrateImages} disabled={saving} className="mr-4">
                {saving ? "Loading..." : "Pull Images from Directory"}
              </Button>
              <Button onClick={refreshBackgroundImages} disabled={loadingImages}>
                {loadingImages ? "Refreshing..." : "Refresh Images"}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>Found {backgroundImages.length} images</div>
                <Button 
                  onClick={refreshBackgroundImages} 
                  variant="outline" 
                  size="sm"
                  disabled={loadingImages}
                >
                  {loadingImages ? "Refreshing..." : "Refresh Images"}
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {backgroundImages.map((image) => (
                  <div 
                    key={image.path}
                    className={`
                      relative aspect-video rounded-lg overflow-hidden cursor-pointer
                      transition-all border-2
                      ${selectedImage === image.path ? 
                        "border-blue-500 ring-2 ring-blue-500" : 
                        "border-transparent hover:border-zinc-500"}
                    `}
                    onClick={() => handleSelectBackgroundImage(image.path)}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Failed to load image: ${image.url}`);
                        // Set a fallback or placeholder
                        e.currentTarget.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="text-white text-sm font-medium text-center p-2 bg-black/60 rounded w-full">
                        {image.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsGalleryOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => selectedImage && handleSelectBackgroundImage(selectedImage)}
              disabled={!selectedImage || saving}
            >
              {saving ? "Applying..." : "Apply Selected Image"}
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  // Add a function to handle hero image upload and apply it immediately
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }
    
    setSaving(true);
    
    try {
      const imageUrl = await uploadHeroImage(file);
      if (imageUrl) {
        // Find the hero image setting
        const heroSetting = settings.find(s => s.key === 'hero.image');
        if (heroSetting) {
          await updateSetting(heroSetting.id, imageUrl);
          
          // Update the local state
          setHeroImageUrl(imageUrl);
          
          toast({
            title: "Success",
            description: "Hero image updated successfully.",
          });
          
          // Refresh settings
          const updatedSettings = await getAllSettings();
          setSettings(updatedSettings);
        }
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Add missing useEffect to refresh background images when the component mounts
  useEffect(() => {
    const loadBackgroundImages = async () => {
      setLoadingImages(true);
      try {
        // Try to load images
        const images = await getBackgroundImages();
        setBackgroundImages(images);
        
        // If no images, try to migrate them
        if (images.length === 0) {
          try {
            const { success, count } = await migrateBackgroundImages();
            if (success && count > 0) {
              const refreshedImages = await getBackgroundImages();
              setBackgroundImages(refreshedImages);
              
              toast({
                title: "Images Migrated",
                description: `Successfully migrated ${count} background images.`,
              });
            }
          } catch (migrationError) {
            console.error("Error during automatic migration:", migrationError);
          }
        }
      } catch (error) {
        console.error("Error loading background images:", error);
      } finally {
        setLoadingImages(false);
      }
    };
    
    loadBackgroundImages();
  }, [toast]);
  
  if (loading) {
    return <div className="p-6">Loading website settings...</div>;
  }

  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 font-title">Website Management</h1>
        
        <Tabs defaultValue="site-settings">
          <TabsList className="mb-6">
            <TabsTrigger value="site-settings">Site Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="proposals">Design Proposals</TabsTrigger>
            <TabsTrigger value="create-proposal">Create Proposal</TabsTrigger>
          </TabsList>
          
          {/* Site Settings Tab - Simplified for Board Members */}
          <TabsContent value="site-settings">
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 font-title">Homepage Hero Section</h2>
                
                {/* Hero Preview */}
                <div className="relative w-full h-64 bg-zinc-800 rounded-lg overflow-hidden mb-6">
                  {heroImageUrl ? (
                    <img 
                      src={heroImageUrl} 
                      alt="Hero Background" 
                      className="absolute inset-0 w-full h-full object-cover brightness-75"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-700 to-zinc-900" />
                  )}
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                    <h1 className="text-3xl font-bold mb-2 font-title">{heroTitle}</h1>
                    <p className="text-lg font-title">{heroSubtitle}</p>
                  </div>
                </div>
                
                {/* Image Selection - Directly show thumbnails */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 font-title">Background Image</h3>
                  
                  {loadingImages ? (
                    <div className="flex space-x-4 overflow-x-auto pb-4">
                      <Skeleton className="h-24 w-32 rounded-lg flex-shrink-0" />
                      <Skeleton className="h-24 w-32 rounded-lg flex-shrink-0" />
                      <Skeleton className="h-24 w-32 rounded-lg flex-shrink-0" />
                    </div>
                  ) : backgroundImages.length === 0 ? (
                    <div className="text-center py-4 bg-zinc-800 rounded-lg">
                      <p className="text-zinc-400 mb-2">No background images found</p>
                      <Button onClick={handleMigrateImages} disabled={saving} className="mr-2">
                        {saving ? "Loading..." : "Pull Images from Directory"}
                      </Button>
                      <Button onClick={refreshBackgroundImages} disabled={loadingImages} variant="outline">
                        {loadingImages ? "Refreshing..." : "Refresh Images"}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex space-x-4 overflow-x-auto pb-4">
                        {backgroundImages.map((image) => (
                          <div 
                            key={image.path}
                            className={`
                              relative h-24 w-32 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer
                              transition-all border-2
                              ${selectedImage === image.path ? 
                                "border-blue-500 ring-2 ring-blue-500" : 
                                "border-transparent hover:border-zinc-500"}
                            `}
                            onClick={() => handleSelectBackgroundImage(image.path)}
                            title={image.name}
                          >
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error(`Failed to load thumbnail: ${image.url}`);
                                e.currentTarget.src = "/placeholder-image.jpg";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-sm text-zinc-400">
                        Click an image to apply it as the hero background
                      </div>
                      <div className="mt-2">
                        <Button 
                          onClick={refreshBackgroundImages} 
                          variant="outline" 
                          size="sm"
                          disabled={loadingImages}
                          className="mr-2"
                        >
                          {loadingImages ? "Refreshing..." : "Refresh Images"}
                        </Button>
                        <span className="text-xs text-zinc-400">
                          {backgroundImages.length} images available
                        </span>
                      </div>
                    </>
                  )}
                  
                  <div className="mt-4">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsGalleryOpen(true)}
                        className="flex items-center gap-2"
                      >
                        <span>View All Images</span>
                      </Button>
                      
                      <div className="relative">
                        <Button 
                          variant="default"
                          className="flex items-center gap-2"
                          onClick={() => document.getElementById('hero-image-upload')?.click()}
                          disabled={saving}
                        >
                          <Upload className="h-4 w-4" />
                          <span>Upload New Image</span>
                        </Button>
                        <input
                          id="hero-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleHeroImageUpload}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Text Settings */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hero-title">Hero Title</Label>
                    <Input
                      id="hero-title"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      placeholder="Enter headline text"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                    <Input
                      id="hero-subtitle"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      placeholder="Enter supporting text"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={saveSettings} 
                      disabled={saving}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {saving ? "Saving..." : "Save All Changes"}
                    </Button>
                    <p className="text-xs text-zinc-400 mt-2 text-center">
                      You must save changes for them to appear on the homepage
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 font-title">Banner</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="banner-enabled">Enable Banner</Label>
                      <Switch 
                        id="banner-enabled"
                        checked={getCurrentValue('banner.enabled') === 'true'}
                        onCheckedChange={handleBannerToggle}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="banner-text">Banner Text</Label>
                    <Textarea 
                      id="banner-text"
                      value={getCurrentValue('banner.text', '')}
                      onChange={handleBannerTextChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="banner-color">Banner Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input 
                        id="banner-color"
                        type="color"
                        value={getCurrentValue('banner.color', '#1e40af')}
                        onChange={handleBannerColorChange}
                        className="w-20 h-10"
                      />
                      <span>{getCurrentValue('banner.color', '#1e40af')}</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 font-title">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input 
                      id="contact-email" 
                      type="email"
                      value={getCurrentValue('contact.email', '')}
                      onChange={handleContactEmailChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-phone">Contact Phone</Label>
                    <Input 
                      id="contact-phone"
                      value={getCurrentValue('contact.phone', '')}
                      onChange={handleContactPhoneChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          {/* Preview Tab */}
          <TabsContent value="preview">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold font-title">Live Preview</h2>
                <Link href="/" target="_blank">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Live Website</span>
                  </Button>
                </Link>
              </div>
              
              <p className="mb-4">This is how your site currently looks:</p>
              
              {/* Hero Section Preview */}
              {renderHeroPreview()}
              
              {/* Banner Preview */}
              {getCurrentValue('banner.enabled') === 'true' && (
                <div 
                  className="p-4 rounded-md mb-6 text-white text-center" 
                  style={{ backgroundColor: getCurrentValue('banner.color', '#1e40af') }}
                >
                  {getCurrentValue('banner.text', 'Welcome to Les Lofts des Arts')}
                </div>
              )}
            </Card>
          </TabsContent>
          
          {/* Proposals Tab */}
          <TabsContent value="proposals">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 font-title">Design Proposals</h2>
              <p className="mb-4">There are {proposals.length} active proposals requiring approval from eligible voters ({eligibleVotersCount} total).</p>
              
              {proposals.length === 0 ? (
                <p className="text-gray-500">No proposals have been created yet.</p>
              ) : (
                <div className="space-y-6">
                  {proposals.map(proposal => (
                    <Card key={proposal.id} className="p-4 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium font-title">{proposal.title}</h3>
                          <p className="text-sm text-gray-500">
                            Proposed on {new Date(proposal.created_at).toLocaleDateString()}
                          </p>
                          <p className="mt-2">{proposal.description}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded text-sm ${
                            proposal.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            proposal.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVote(proposal.id, 'yes')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVote(proposal.id, 'no')}
                        >
                          Reject
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
          
          {/* Create Proposal Tab */}
          <TabsContent value="create-proposal">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 font-title">Create New Design Proposal</h2>
              <p className="mb-4">
                Create a proposal for changes to the website design. All eligible voters
                will need to approve before changes are applied.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="proposal-title">Proposal Title</Label>
                  <Input 
                    id="proposal-title"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({
                      ...newProposal,
                      title: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="proposal-description">Description</Label>
                  <Textarea 
                    id="proposal-description"
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({
                      ...newProposal,
                      description: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>
                
                <Button 
                  onClick={handleCreateProposal}
                  disabled={saving || !newProposal.title || !newProposal.description}
                >
                  {saving ? 'Creating...' : 'Create Proposal'}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Background Image Gallery - Keep the fullscreen version for "View All" */}
      <BackgroundImageGallery />
    </>
  );
}

export default function WebsiteManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-title">Edit Website</h1>
      </div>
      <WebsiteManagementPageContent />
    </div>
  );
} 