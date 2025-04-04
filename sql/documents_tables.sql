-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Create the folders table
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_syndicate BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the files table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  thumbnail_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  requires_dual_approval BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES auth.users(id),
  approval_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the document_access table for granular permissions
CREATE TABLE document_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  can_view BOOLEAN DEFAULT TRUE,
  can_update BOOLEAN DEFAULT FALSE,
  can_delete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (file_id IS NOT NULL OR folder_id IS NOT NULL) -- At least one must be specified
);

-- Create RLS policies for folders
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Admin has full access
CREATE POLICY folders_admin_policy ON folders 
  FOR ALL 
  TO authenticated 
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN'
  );

-- Syndic can manage syndicate folders
CREATE POLICY folders_syndic_policy ON folders 
  FOR ALL 
  TO authenticated 
  USING (
    ((SELECT role FROM profiles WHERE id = auth.uid()) = 'SYNDIC' AND is_syndicate = true) OR
    created_by = auth.uid()
  );

-- Users can view syndicate folders and their own folders
CREATE POLICY folders_user_policy ON folders 
  FOR SELECT 
  TO authenticated 
  USING (
    is_syndicate = true OR created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM document_access 
      WHERE folder_id = folders.id AND profile_id = auth.uid() AND can_view = true
    )
  );

-- RLS policies for files
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Admin has full access
CREATE POLICY files_admin_policy ON files 
  FOR ALL 
  TO authenticated 
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN'
  );

-- Syndic can manage files in syndicate folders and their own files
CREATE POLICY files_syndic_policy ON files 
  FOR ALL 
  TO authenticated 
  USING (
    ((SELECT role FROM profiles WHERE id = auth.uid()) = 'SYNDIC' AND 
      (folder_id IS NULL OR EXISTS (SELECT 1 FROM folders WHERE id = files.folder_id AND is_syndicate = true))
    ) OR created_by = auth.uid()
  );

-- Users can view syndicate files and their own files
CREATE POLICY files_user_policy ON files 
  FOR SELECT 
  TO authenticated 
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM folders 
      WHERE id = files.folder_id AND is_syndicate = true
    ) OR
    EXISTS (
      SELECT 1 FROM document_access 
      WHERE file_id = files.id AND profile_id = auth.uid() AND can_view = true
    )
  );

-- RLS policies for document_access
ALTER TABLE document_access ENABLE ROW LEVEL SECURITY;

-- Admin has full access
CREATE POLICY document_access_admin_policy ON document_access 
  FOR ALL 
  TO authenticated 
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN'
  );

-- Syndic can manage access for syndicate folders/files
CREATE POLICY document_access_syndic_policy ON document_access 
  FOR ALL 
  TO authenticated 
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'SYNDIC' AND
    (
      (folder_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM folders WHERE id = document_access.folder_id AND is_syndicate = true
      )) OR
      (file_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM files 
        WHERE id = document_access.file_id AND 
        folder_id IN (SELECT id FROM folders WHERE is_syndicate = true)
      ))
    )
  );

-- Users can only view their own access entries
CREATE POLICY document_access_user_policy ON document_access 
  FOR SELECT 
  TO authenticated 
  USING (
    profile_id = auth.uid()
  );

-- Storage bucket policies
CREATE POLICY "Documents are accessible to users with permissions" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents' AND (
      -- Admin access
      (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN' OR
      -- Owner access
      (storage.foldername(name))[1] = auth.uid()::text OR
      -- File shared with user
      EXISTS (
        SELECT 1 FROM files
        WHERE storage_path = name AND (
          -- File in public syndicate folder
          (
            folder_id IN (SELECT id FROM folders WHERE is_syndicate = true)
          ) OR
          -- File specifically shared
          EXISTS (
            SELECT 1 FROM document_access
            WHERE file_id = files.id AND profile_id = auth.uid() AND can_view = true
          )
        )
      )
    )
  );

CREATE POLICY "Users can upload to their own folder" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Add storage bucket link to functions
-- Need to run this in SQL through the Supabase dashboard:
-- SELECT storage.set_admin_bucket_policy('documents', true);