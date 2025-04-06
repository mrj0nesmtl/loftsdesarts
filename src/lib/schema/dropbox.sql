-- DropBox Schema for Lofts des Arts
-- This file contains the database schema for the DropBox feature

-- Enable RLS (Row Level Security)
ALTER TABLE IF EXISTS dropbox_files ENABLE ROW LEVEL SECURITY;

-- Create the dropbox_files table if it doesn't exist
CREATE TABLE IF NOT EXISTS dropbox_files (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  description TEXT,
  tags TEXT[]
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS dropbox_files_user_id_idx ON dropbox_files(user_id);
CREATE INDEX IF NOT EXISTS dropbox_files_is_public_idx ON dropbox_files(is_public);
CREATE INDEX IF NOT EXISTS dropbox_files_created_at_idx ON dropbox_files(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_dropbox_files_timestamp ON dropbox_files;
CREATE TRIGGER update_dropbox_files_timestamp
BEFORE UPDATE ON dropbox_files
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Row Level Security Policies

-- Users can select their own files and public files
DROP POLICY IF EXISTS "Users can view their own files and public files" ON dropbox_files;
CREATE POLICY "Users can view their own files and public files" ON dropbox_files
FOR SELECT
USING (auth.uid() = user_id OR is_public = TRUE);

-- Users can only insert their own files
DROP POLICY IF EXISTS "Users can only insert their own files" ON dropbox_files;
CREATE POLICY "Users can only insert their own files" ON dropbox_files
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own files
DROP POLICY IF EXISTS "Users can only update their own files" ON dropbox_files;
CREATE POLICY "Users can only update their own files" ON dropbox_files
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can only delete their own files
DROP POLICY IF EXISTS "Users can only delete their own files" ON dropbox_files;
CREATE POLICY "Users can only delete their own files" ON dropbox_files
FOR DELETE
USING (auth.uid() = user_id);

-- Admins have full access to all files
DO $$
BEGIN
  -- Check if the profiles table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    -- If admins can be identified through profiles
    DROP POLICY IF EXISTS "Admins have full access to all files" ON dropbox_files;
    CREATE POLICY "Admins have full access to all files" ON dropbox_files
    FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('ADMIN', 'BOARD_MEMBER')
      )
    );
  END IF;
END
$$;

-- Create storage buckets for the DropBox feature if they don't exist
-- Note: This needs to be run through the Supabase dashboard or using the Supabase CLI
-- as creating buckets requires admin access. The following is just a reference.

/*
-- Create the dropbox bucket
INSERT INTO storage.buckets (id, name, public)
SELECT 'dropbox', 'dropbox', FALSE
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'dropbox');

-- Set up storage policies for the dropbox bucket

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'dropbox' AND (storage.foldername(name))[1] = 'private' OR (storage.foldername(name))[1] = 'public');

-- Only allow users to select their private files
CREATE POLICY "Users can select their private files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'dropbox' 
  AND (storage.foldername(name))[1] = 'private'
  AND EXISTS (
    SELECT 1 FROM dropbox_files
    WHERE storage_path = name
    AND dropbox_files.user_id = auth.uid()
  )
);

-- Allow users to select public files
CREATE POLICY "Anyone can select public files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'dropbox'
  AND (storage.foldername(name))[1] = 'public'
);

-- Only allow users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'dropbox'
  AND EXISTS (
    SELECT 1 FROM dropbox_files
    WHERE storage_path = name
    AND dropbox_files.user_id = auth.uid()
  )
);

-- Only allow users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'dropbox'
  AND EXISTS (
    SELECT 1 FROM dropbox_files
    WHERE storage_path = name
    AND dropbox_files.user_id = auth.uid()
  )
);

-- Admins have full access to all storage objects
CREATE POLICY "Admins have full access to all storage objects"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'dropbox'
  AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'board_member')
  )
);
*/

-- Function to get file statistics
CREATE OR REPLACE FUNCTION get_dropbox_statistics(user_id_param UUID DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_files', COUNT(*),
    'total_size', COALESCE(SUM(size), 0),
    'public_files', COUNT(*) FILTER (WHERE is_public = TRUE),
    'private_files', COUNT(*) FILTER (WHERE is_public = FALSE),
    'by_type', (
      SELECT json_object_agg(mime_type, file_count)
      FROM (
        SELECT 
          CASE 
            WHEN mime_type LIKE 'image/%' THEN 'image'
            WHEN mime_type LIKE 'video/%' THEN 'video'
            WHEN mime_type LIKE 'audio/%' THEN 'audio'
            WHEN mime_type LIKE 'application/pdf' THEN 'pdf'
            WHEN mime_type LIKE 'application/vnd.openxmlformats-officedocument.%' THEN 'office'
            WHEN mime_type LIKE 'application/vnd.ms-%' THEN 'office'
            WHEN mime_type LIKE 'text/%' THEN 'text'
            ELSE 'other'
          END as mime_type,
          COUNT(*) as file_count
        FROM dropbox_files
        WHERE (user_id_param IS NULL OR user_id = user_id_param)
        GROUP BY 1
      ) t
    )
  ) INTO result
  FROM dropbox_files
  WHERE (user_id_param IS NULL OR user_id = user_id_param);
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search files
CREATE OR REPLACE FUNCTION search_dropbox_files(search_query TEXT)
RETURNS SETOF dropbox_files AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM dropbox_files
  WHERE (
    name ILIKE '%' || search_query || '%'
    OR description ILIKE '%' || search_query || '%'
    OR search_query = ANY(tags)
  )
  AND (
    auth.uid() = user_id OR is_public = TRUE
  )
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add the dropbox table to the Realtime publication
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE dropbox_files;
  END IF;
END
$$; 