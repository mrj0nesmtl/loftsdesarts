-- Create folders table to organize the file hierarchy
CREATE TABLE IF NOT EXISTS folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES folders(id),
  path TEXT NOT NULL, -- Full path from root, useful for navigation
  is_syndicate BOOLEAN DEFAULT FALSE, -- Flag for syndicate documents with special permissions
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create files table to store file metadata
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL, -- Path in Supabase storage
  size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  is_syndicate BOOLEAN DEFAULT FALSE, -- Flag for syndicate documents with special permissions
  requires_dual_approval BOOLEAN DEFAULT FALSE, -- Flag for files requiring 2-person approval for changes
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create file versions table to track changes and support version control
CREATE TABLE IF NOT EXISTS file_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  storage_path TEXT NOT NULL, -- Path to this specific version in storage
  size INTEGER NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  change_description TEXT -- Optional description of changes made in this version
);

-- Create approvals table for tracking dual approvals for syndicate documents
CREATE TABLE IF NOT EXISTS file_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  version_id UUID REFERENCES file_versions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  approval_type TEXT NOT NULL, -- 'MODIFY', 'DELETE'
  approved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(file_id, user_id, approval_type) -- Prevent duplicate approvals
);

-- Create file permissions table for access control
CREATE TABLE IF NOT EXISTS file_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id), -- NULL means role-based permission
  role TEXT, -- 'admin', 'resident', 'doorman', NULL means user-specific permission
  permission TEXT NOT NULL, -- 'READ', 'WRITE', 'DELETE', 'MANAGE'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK ((user_id IS NULL AND role IS NOT NULL) OR (user_id IS NOT NULL AND role IS NULL)) -- Either user_id or role must be set, not both
);

-- Create indices for performance
CREATE INDEX idx_folders_parent_id ON folders(parent_id);
CREATE INDEX idx_files_folder_id ON files(folder_id);
CREATE INDEX idx_file_versions_file_id ON file_versions(file_id);
CREATE INDEX idx_file_permissions_file_id ON file_permissions(file_id);
CREATE INDEX idx_file_permissions_folder_id ON file_permissions(folder_id);
CREATE INDEX idx_file_permissions_user_id ON file_permissions(user_id);
CREATE INDEX idx_file_permissions_role ON file_permissions(role);
CREATE INDEX idx_file_approvals_file_id ON file_approvals(file_id);

-- Enable Row Level Security
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for folders
CREATE POLICY "Users can view folders they have access to" 
  ON folders FOR SELECT 
  USING (
    id IN (
      SELECT folder_id FROM file_permissions 
      WHERE (user_id = auth.uid() OR role IN (SELECT role FROM profiles WHERE id = auth.uid()))
    )
    OR 
    created_by = auth.uid()
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can insert folders" 
  ON folders FOR INSERT 
  TO authenticated 
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update folders" 
  ON folders FOR UPDATE 
  TO authenticated 
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete non-syndicate folders" 
  ON folders FOR DELETE 
  TO authenticated 
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    AND is_syndicate = FALSE
  );

-- RLS Policies for files
CREATE POLICY "Users can view files they have access to" 
  ON files FOR SELECT 
  USING (
    id IN (
      SELECT file_id FROM file_permissions 
      WHERE (user_id = auth.uid() OR role IN (SELECT role FROM profiles WHERE id = auth.uid()))
      AND permission IN ('READ', 'WRITE', 'DELETE', 'MANAGE')
    )
    OR 
    created_by = auth.uid()
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can insert files based on folder permissions" 
  ON files FOR INSERT 
  TO authenticated 
  WITH CHECK (
    folder_id IN (
      SELECT folder_id FROM file_permissions 
      WHERE (user_id = auth.uid() OR role IN (SELECT role FROM profiles WHERE id = auth.uid()))
      AND permission IN ('WRITE', 'MANAGE')
    )
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can update files they have write access to" 
  ON files FOR UPDATE 
  TO authenticated 
  USING (
    (
      id IN (
        SELECT file_id FROM file_permissions 
        WHERE (user_id = auth.uid() OR role IN (SELECT role FROM profiles WHERE id = auth.uid()))
        AND permission IN ('WRITE', 'MANAGE')
      )
      AND
      (
        requires_dual_approval = FALSE
        OR
        (
          requires_dual_approval = TRUE
          AND
          (
            SELECT COUNT(*) FROM file_approvals 
            WHERE file_id = files.id 
            AND approval_type = 'MODIFY'
          ) >= 2
        )
      )
    )
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can delete files they have delete access to" 
  ON files FOR DELETE 
  TO authenticated 
  USING (
    (
      id IN (
        SELECT file_id FROM file_permissions 
        WHERE (user_id = auth.uid() OR role IN (SELECT role FROM profiles WHERE id = auth.uid()))
        AND permission IN ('DELETE', 'MANAGE')
      )
      AND
      (
        requires_dual_approval = FALSE
        OR
        (
          requires_dual_approval = TRUE
          AND
          (
            SELECT COUNT(*) FROM file_approvals 
            WHERE file_id = files.id 
            AND approval_type = 'DELETE'
          ) >= 2
        )
      )
    )
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- RLS Policies for file versions
CREATE POLICY "Users can view file versions they have access to" 
  ON file_versions FOR SELECT 
  USING (
    file_id IN (
      SELECT id FROM files WHERE id IN (
        SELECT file_id FROM file_permissions 
        WHERE (user_id = auth.uid() OR role IN (SELECT role FROM profiles WHERE id = auth.uid()))
        AND permission IN ('READ', 'WRITE', 'DELETE', 'MANAGE')
      )
    )
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can insert file versions they have write access to" 
  ON file_versions FOR INSERT 
  TO authenticated 
  WITH CHECK (
    file_id IN (
      SELECT id FROM files WHERE id IN (
        SELECT file_id FROM file_permissions 
        WHERE (user_id = auth.uid() OR role IN (SELECT role FROM profiles WHERE id = auth.uid()))
        AND permission IN ('WRITE', 'MANAGE')
      )
    )
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- RLS Policies for approvals
CREATE POLICY "Users can view file approvals" 
  ON file_approvals FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can insert their own approvals" 
  ON file_approvals FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for file permissions
CREATE POLICY "Admins can manage file permissions" 
  ON file_permissions
  TO authenticated 
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Functions for dual approval
CREATE OR REPLACE FUNCTION request_file_modification(file_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user already has an approval for this file
  IF EXISTS (
    SELECT 1 FROM file_approvals
    WHERE file_id = request_file_modification.file_id
    AND user_id = auth.uid()
    AND approval_type = 'MODIFY'
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Insert approval record
  INSERT INTO file_approvals (file_id, user_id, approval_type)
  VALUES (request_file_modification.file_id, auth.uid(), 'MODIFY');
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION request_file_deletion(file_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user already has an approval for this file
  IF EXISTS (
    SELECT 1 FROM file_approvals
    WHERE file_id = request_file_deletion.file_id
    AND user_id = auth.uid()
    AND approval_type = 'DELETE'
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Insert approval record
  INSERT INTO file_approvals (file_id, user_id, approval_type)
  VALUES (request_file_deletion.file_id, auth.uid(), 'DELETE');
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a file has enough approvals
CREATE OR REPLACE FUNCTION has_sufficient_approvals(file_id UUID, approval_type TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) >= 2 FROM file_approvals
    WHERE file_id = has_sufficient_approvals.file_id
    AND approval_type = has_sufficient_approvals.approval_type
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 