import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

// Define a type for background images
export type BackgroundImage = {
  name: string;
  url: string;
  path: string;
  updatedAt: string;
};

export type SiteSetting = {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'image' | 'boolean' | 'color' | 'number';
  label: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type DesignProposal = {
  id: string;
  title: string;
  description: string;
  settings: Partial<Record<string, string>>;
  created_by: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  expires_at: string;
  approved_at?: string;
  thumbnail_url?: string;
};

export type DesignProposalVote = {
  id: string;
  proposal_id: string;
  user_id: string;
  vote: 'yes' | 'no' | 'abstain';
  created_at: string;
  updated_at: string;
};

// Get public settings that are visible to all users
export async function getPublicSettings(): Promise<SiteSetting[]> {
  try {
    // First try to get settings marked as public
    const { data: publicSettings, error: publicError } = await supabase
      .from('site_settings')
      .select('*')
      .eq('is_public', true);
      
    if (publicError) {
      console.error('Error fetching public settings:', publicError);
      return [];
    }
    
    // If no public settings found, or if certain essential settings are missing,
    // get specific settings that should be visible on the frontend
    if (!publicSettings || publicSettings.length === 0) {
      const essentialKeys = [
        'hero.title', 
        'hero.subtitle', 
        'hero.image',
        'banner.enabled',
        'banner.text',
        'banner.color',
        'contact.email',
        'contact.phone'
      ];
      
      const { data: essentialSettings, error: essentialError } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', essentialKeys);
        
      if (essentialError) {
        console.error('Error fetching essential settings:', essentialError);
        return [];
      }
      
      console.log('Using essential settings for public view');
      return essentialSettings as SiteSetting[];
    }
    
    console.log('Using public settings');
    return publicSettings as SiteSetting[];
  } catch (error) {
    console.error('Unexpected error fetching public settings:', error);
    return [];
  }
}

// Get all settings - admin only
export async function getAllSettings(): Promise<SiteSetting[]> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('key');
      
    if (error) {
      console.error('Error fetching all settings:', error);
      return [];
    }
    
    return data as SiteSetting[];
  } catch (error) {
    console.error('Unexpected error fetching all settings:', error);
    return [];
  }
}

// Update a setting - admin only
export async function updateSetting(id: string, value: string): Promise<SiteSetting | null> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating setting:', error);
      return null;
    }
    
    return data as SiteSetting;
  } catch (error) {
    console.error('Unexpected error updating setting:', error);
    return null;
  }
}

// Create a design proposal - admin only
export async function createDesignProposal(
  proposal: {
    title: string;
    description: string;
    settings?: Partial<Record<string, string>>;
    created_by: string;
    expires_at?: string;
  }
): Promise<DesignProposal | null> {
  try {
    const { data, error } = await supabase
      .from('design_proposals')
      .insert({
        title: proposal.title,
        description: proposal.description,
        settings: proposal.settings || {},
        created_by: proposal.created_by,
        status: 'pending',
        created_at: new Date().toISOString(),
        expires_at: proposal.expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating design proposal:', error);
      return null;
    }
    
    return data as DesignProposal;
  } catch (error) {
    console.error('Unexpected error creating design proposal:', error);
    return null;
  }
}

// Get all design proposals
export async function getDesignProposals(userId?: string): Promise<DesignProposal[]> {
  try {
    const { data, error } = await supabase
      .from('design_proposals')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching design proposals:', error);
      return [];
    }
    
    return data as DesignProposal[];
  } catch (error) {
    console.error('Unexpected error fetching design proposals:', error);
    return [];
  }
}

// Get a specific design proposal
export async function getDesignProposal(id: string): Promise<DesignProposal | null> {
  try {
    const { data, error } = await supabase
      .from('design_proposals')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching design proposal ${id}:`, error);
      return null;
    }
    
    return data as DesignProposal;
  } catch (error) {
    console.error(`Unexpected error fetching design proposal ${id}:`, error);
    return null;
  }
}

// Vote on a design proposal
export async function voteOnProposal(
  proposalId: string, 
  userId: string,
  vote: 'yes' | 'no' | 'abstain' = 'yes'
): Promise<boolean> {
  try {
    // Check if user has already voted
    const { data: existingVote, error: checkError } = await supabase
      .from('design_proposal_votes')
      .select('*')
      .eq('proposal_id', proposalId)
      .eq('user_id', userId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error checking existing vote:', checkError);
      return false;
    }
    
    if (existingVote) {
      // Update existing vote
      const { error: updateError } = await supabase
        .from('design_proposal_votes')
        .update({
          vote,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingVote.id);
        
      if (updateError) {
        console.error('Error updating vote:', updateError);
        return false;
      }
    } else {
      // Create new vote
      const { error: insertError } = await supabase
        .from('design_proposal_votes')
        .insert({
          proposal_id: proposalId,
          user_id: userId,
          vote,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error('Error creating vote:', insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error voting on proposal:', error);
    return false;
  }
}

// Get eligible voters count (for board members, admins, etc.)
export async function getEligibleVotersCount(): Promise<number> {
  try {
    // Directly query the user_roles table instead of profiles
    const { count, error } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .or('role_name.eq.ADMIN,role_name.eq.BOARD_MEMBER,role_name.eq.SUPER_ADMIN');
      
    if (error) {
      console.error('Error counting eligible voters:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Unexpected error counting eligible voters:', error);
    return 0;
  }
}

// Get votes for a design proposal
export async function getVotesForProposal(proposalId: string): Promise<DesignProposalVote[]> {
  try {
    const { data, error } = await supabase
      .from('design_proposal_votes')
      .select('*')
      .eq('proposal_id', proposalId);
      
    if (error) {
      console.error(`Error fetching votes for proposal ${proposalId}:`, error);
      return [];
    }
    
    return data as DesignProposalVote[];
  } catch (error) {
    console.error(`Unexpected error fetching votes for proposal ${proposalId}:`, error);
    return [];
  }
}

// Upload a hero image to the storage bucket
export async function uploadHeroImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `hero-${Date.now()}.${fileExt}`;
    const filePath = `website/${fileName}`;
    
    const { error } = await supabase.storage
      .from('public')
      .upload(filePath, file);
      
    if (error) {
      console.error('Error uploading hero image:', error);
      return null;
    }
    
    const { data } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Unexpected error uploading hero image:', error);
    return null;
  }
}

// Helper function to get setting value with type
export function getSettingValue<T>(settings: SiteSetting[], key: string, defaultValue?: T): T {
  const setting = settings.find(s => s.key === key);
  if (!setting) return defaultValue as T;
  
  try {
    // Convert value based on type
    switch (typeof defaultValue) {
      case 'boolean':
        return (setting.value === 'true') as unknown as T;
      case 'number':
        return Number(setting.value) as unknown as T;
      default:
        return setting.value as unknown as T;
    }
  } catch (e) {
    console.error(`Error parsing setting ${key}:`, e);
    return defaultValue as T;
  }
}

// Get all available background images from the storage bucket
export async function getBackgroundImages(): Promise<BackgroundImage[]> {
  try {
    console.log('Fetching background images');
    
    // Direct list of images from the public directory
    const imageNames = [
      'votreCA.jpeg', 'view2.jpeg', 'view1.jpeg', 'theview4.jpeg', 
      'theview13.jpeg', 'theview1.jpeg', 'therules.jpeg', 'sunsest.jpeg',
      'spectacles2.jpeg', 'spectacles.jpeg', 'saintlaurentview1.jpeg', 
      'saintlaurentview.jpeg', 'render2.jpeg', 'render1.jpeg',
      'place des arts.jpeg', 'place des art 2.jpeg', 'pikolo-1.jpeg',
      'picoine nouveau.jpeg', 'history-b.jpeg', 'front_desk.jpeg',
      'beginnings.jpeg', 'bbq.jpeg', 'Pool.jpeg', 'picine2.jpeg', 'Lounge.jpeg'
    ];
    
    // Map the image names to local URLs - using the correct path to public/secure
    const images: BackgroundImage[] = imageNames.map(name => {
      // Force refresh images by adding a timestamp query parameter
      const timestamp = Date.now(); 
      return {
        name: name,
        url: `/secure/${name}?t=${timestamp}`,
        path: `secure/${name}`,
        updatedAt: new Date().toISOString(),
      };
    });
    
    console.log('Found local images:', images.length);
    return images;
  } catch (error) {
    console.error('Unexpected error getting background images:', error);
    return [];
  }
}

// Set a background image from existing images in storage
export async function setBackgroundImage(imagePath: string): Promise<boolean> {
  try {
    // Get the local URL of the selected image
    const imageUrl = `/${imagePath}`;
    console.log('Setting background image with path:', imagePath);
    console.log('Using image URL:', imageUrl);
    
    // Find the hero.image setting
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'hero.image');
      
    if (settingsError) {
      console.error('Error finding hero.image setting:', settingsError);
      return false;
    }
    
    if (!settings || settings.length === 0) {
      console.log('Hero.image setting not found, creating it now');
      
      // Create the hero.image setting since it doesn't exist
      const { data: newSetting, error: insertError } = await supabase
        .from('site_settings')
        .insert({
          key: 'hero.image',
          value: imageUrl,
          type: 'image',
          label: 'Hero Background Image',
          description: 'Background image for the homepage hero section',
          is_public: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
        
      if (insertError) {
        console.error('Error creating hero.image setting:', insertError);
        return false;
      }
      
      console.log('Successfully created hero.image setting with value:', imageUrl);
      return true;
    }
    
    // Update the hero.image setting in the database
    const { data, error } = await supabase
      .from('site_settings')
      .update({ 
        value: imageUrl,
        updated_at: new Date().toISOString() 
      })
      .eq('key', 'hero.image')
      .select();
      
    if (error) {
      console.error('Error updating hero image setting:', error);
      return false;
    }
    
    console.log('Successfully updated hero image to:', imageUrl);
    return true;
  } catch (error) {
    console.error('Unexpected error setting background image:', error);
    return false;
  }
}

// Dummy function that just returns success since we're using local files
export async function migrateBackgroundImages(): Promise<{ success: boolean, count: number }> {
  try {
    console.log('Using local images instead of migration');
    
    // Directly use local files instead of trying to upload to Supabase
    const imageNames = [
      'votreCA.jpeg', 'view2.jpeg', 'view1.jpeg', 'theview4.jpeg', 
      'theview13.jpeg', 'theview1.jpeg', 'therules.jpeg', 'sunsest.jpeg',
      'spectacles2.jpeg', 'spectacles.jpeg', 'saintlaurentview1.jpeg', 
      'saintlaurentview.jpeg', 'render2.jpeg', 'render1.jpeg',
      'place des arts.jpeg', 'place des art 2.jpeg', 'pikolo-1.jpeg',
      'picoine nouveau.jpeg', 'history-b.jpeg', 'front_desk.jpeg',
      'beginnings.jpeg', 'bbq.jpeg', 'Pool.jpeg', 'picine2.jpeg', 'Lounge.jpeg'
    ];
    
    return { success: true, count: imageNames.length };
  } catch (error) {
    console.error('Unexpected error during image handling:', error);
    return { success: false, count: 0 };
  }
}