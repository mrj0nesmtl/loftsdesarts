-- Site Settings SQL Schema for Lofts des Arts

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Website Settings Table
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Initial settings
INSERT INTO site_settings (key, value, description, is_public) VALUES
('site_name', 'Lofts des Arts', 'Name of the site', true),
('site_description', 'Condominiums de Luxe au Cœur de Montréal', 'Description of the site', true),
('primary_color', '#000000', 'Primary color for the site', true),
('secondary_color', '#ffffff', 'Secondary color for the site', true),
('contact_email', 'contact@loftsdesarts.com', 'Contact email address', true),
('hero_button_text', 'Voir la Galerie', 'Text for the hero section button', true),
('hero_image', '/lda_bg.png', 'Background image for hero section', true);

-- Website Design Proposals Table
CREATE TABLE design_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  proposed_by UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  changes JSONB NOT NULL -- Store the proposed changes
);

-- Design Proposal Votes Table
CREATE TABLE design_proposal_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES design_proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  vote BOOLEAN NOT NULL, -- true = approve, false = reject
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(proposal_id, user_id)
);

-- RLS Policies
-- Enable RLS on site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can modify settings
CREATE POLICY "Admins can update site settings" 
ON site_settings 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role_name IN ('SUPER_ADMIN', 'ADMIN')
  )
);

-- Public settings can be viewed by anyone, private only by admins
CREATE POLICY "Public settings are viewable by all" 
ON site_settings 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Private settings are viewable by admins only" 
ON site_settings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role_name IN ('SUPER_ADMIN', 'ADMIN', 'BOARD_MEMBER')
  )
);

-- Enable RLS on design_proposals
ALTER TABLE design_proposals ENABLE ROW LEVEL SECURITY;

-- Admin and board members can create design proposals
CREATE POLICY "Admins and board members can create design proposals" 
ON design_proposals 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role_name IN ('SUPER_ADMIN', 'ADMIN', 'BOARD_MEMBER')
  )
);

-- Everyone with an account can view design proposals
CREATE POLICY "Everyone can view design proposals" 
ON design_proposals 
FOR SELECT 
TO authenticated;

-- Creator and admins can update design proposals
CREATE POLICY "Creator and admins can update design proposals" 
ON design_proposals 
FOR UPDATE 
USING (
  proposed_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role_name IN ('SUPER_ADMIN', 'ADMIN')
  )
);

-- Enable RLS on design_proposal_votes
ALTER TABLE design_proposal_votes ENABLE ROW LEVEL SECURITY;

-- Users can vote on proposals
CREATE POLICY "Users can vote on proposals" 
ON design_proposal_votes 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role_name IN ('SUPER_ADMIN', 'ADMIN', 'BOARD_MEMBER', 'RESIDENT_OWNER')
  )
);

-- Users can see all votes
CREATE POLICY "Users can see all votes" 
ON design_proposal_votes 
FOR SELECT 
TO authenticated;

-- Users can update their own votes
CREATE POLICY "Users can update their own votes" 
ON design_proposal_votes 
FOR UPDATE 
USING (user_id = auth.uid());

-- Function to check if a proposal has unanimous approval
CREATE OR REPLACE FUNCTION check_proposal_approval()
RETURNS TRIGGER AS $$
DECLARE
  total_eligible_voters INTEGER;
  total_votes INTEGER;
  approval_votes INTEGER;
BEGIN
  -- Count eligible voters (admins, board members, and resident owners)
  SELECT COUNT(DISTINCT ur.user_id) INTO total_eligible_voters
  FROM user_roles ur
  WHERE ur.role_name IN ('SUPER_ADMIN', 'ADMIN', 'BOARD_MEMBER', 'RESIDENT_OWNER');
  
  -- Count total votes for this proposal
  SELECT COUNT(*) INTO total_votes
  FROM design_proposal_votes
  WHERE proposal_id = NEW.proposal_id;
  
  -- Count approval votes
  SELECT COUNT(*) INTO approval_votes
  FROM design_proposal_votes
  WHERE proposal_id = NEW.proposal_id AND vote = true;
  
  -- If all eligible users have voted and all votes are approvals, mark as approved
  IF total_votes = total_eligible_voters AND approval_votes = total_eligible_voters THEN
    UPDATE design_proposals
    SET status = 'approved', approved_at = NOW()
    WHERE id = NEW.proposal_id;
    
    -- Apply changes to site_settings
    WITH proposal_changes AS (
      SELECT jsonb_each_text(dp.changes) AS change
      FROM design_proposals dp
      WHERE dp.id = NEW.proposal_id
    )
    UPDATE site_settings
    SET value = change.value, updated_at = NOW()
    FROM proposal_changes
    WHERE key = change.key;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run after a vote is cast
CREATE TRIGGER check_proposal_approval_trigger
AFTER INSERT OR UPDATE ON design_proposal_votes
FOR EACH ROW
EXECUTE PROCEDURE check_proposal_approval();

-- Secure the dropbox folder
INSERT INTO storage.buckets (id, name) VALUES ('dropbox', 'Dropbox for user file sharing')
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for dropbox bucket
CREATE POLICY "Authenticated users can upload to dropbox"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'dropbox' AND (storage.foldername(name))[1] = 'public');

CREATE POLICY "Authenticated users can view dropbox files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'dropbox');

CREATE POLICY "Owners can update their dropbox files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'dropbox' AND owner = auth.uid());

CREATE POLICY "Owners can delete their dropbox files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'dropbox' AND owner = auth.uid()); 