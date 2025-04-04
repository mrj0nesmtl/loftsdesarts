-- Fix folders table and policies
-- Execute this in the Supabase SQL Editor

-- Check if the uuid extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop and recreate folders table if there are issues
DROP TABLE IF EXISTS folders CASCADE;

-- Create the folders table 
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES folders(id),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  is_syndicate BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the files table if it doesn't exist
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  folder_id UUID REFERENCES folders(id),
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  thumbnail_url TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  requires_dual_approval BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can create folders" ON folders;
DROP POLICY IF EXISTS "Users can view folders" ON folders;
DROP POLICY IF EXISTS "Users can view files" ON files;
DROP POLICY IF EXISTS "Users can create files" ON files;

-- Create very permissive policies for development
-- For folders
CREATE POLICY "Users can create folders" 
ON folders FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Users can view folders" 
ON folders FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can update folders"
ON folders FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can delete folders"
ON folders FOR DELETE
TO authenticated
USING (true);

-- For files
CREATE POLICY "Users can view files" 
ON files FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can create files" 
ON files FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Users can update files"
ON files FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can delete files"
ON files FOR DELETE
TO authenticated
USING (true);

-- Grant permissions to the authenticated role
GRANT ALL ON folders TO authenticated;
GRANT ALL ON files TO authenticated;

-- Create storage bucket for documents if it doesn't exist
-- Note: This might need to be done through the Supabase dashboard
-- or using service role API calls 