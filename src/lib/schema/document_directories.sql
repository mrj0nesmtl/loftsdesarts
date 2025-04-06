-- Create document root directories for Lofts Des Arts Admin, board members, and management
-- This script creates the predefined root-level folders shown in the Sentinel portal

-- Function to create a folder if it doesn't exist
CREATE OR REPLACE FUNCTION create_folder_if_not_exists(
  folder_name TEXT,
  admin_uid UUID
) RETURNS UUID AS $$
DECLARE
  folder_id UUID;
BEGIN
  -- Check if folder already exists
  SELECT id INTO folder_id FROM folders 
  WHERE name = folder_name AND parent_id IS NULL;
  
  -- If not found, create it
  IF folder_id IS NULL THEN
    INSERT INTO folders (
      name, 
      parent_id, 
      created_by, 
      is_syndicate
    ) VALUES (
      folder_name,
      NULL, -- root level folder
      admin_uid,
      TRUE  -- syndicate document, visible to all admins/board members
    )
    RETURNING id INTO folder_id;
  END IF;
  
  RETURN folder_id;
END;
$$ LANGUAGE plpgsql;

-- Create the root directories
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the first admin user to set as creator
  SELECT id INTO admin_user_id FROM profiles WHERE role = 'ADMIN' LIMIT 1;
  
  -- If no admin found, use the first available user
  IF admin_user_id IS NULL THEN
    SELECT id INTO admin_user_id FROM auth.users LIMIT 1;
  END IF;
  
  -- Create all the root directories if they don't exist
  PERFORM create_folder_if_not_exists('Assemblées', admin_user_id);
  PERFORM create_folder_if_not_exists('Assurance', admin_user_id);
  PERFORM create_folder_if_not_exists('Budgets', admin_user_id);
  PERFORM create_folder_if_not_exists('Contrats', admin_user_id);
  PERFORM create_folder_if_not_exists('Déclaration de copropriété', admin_user_id);
  PERFORM create_folder_if_not_exists('États Financiers', admin_user_id);
  PERFORM create_folder_if_not_exists('Étude du fonds de prévoyance', admin_user_id);
  PERFORM create_folder_if_not_exists('Formulaires', admin_user_id);
  PERFORM create_folder_if_not_exists('Loi 25 - Politique de protection des renseignements personnels', admin_user_id);
  PERFORM create_folder_if_not_exists('Points de suivi', admin_user_id);
  PERFORM create_folder_if_not_exists('Rapports', admin_user_id);
  PERFORM create_folder_if_not_exists('Registres et règlements', admin_user_id);
  PERFORM create_folder_if_not_exists('Réunion Conseil', admin_user_id);
  
  -- Log the action
  RAISE NOTICE 'Root document directories created successfully';
END $$;

-- Create roles-based access policy for these folders
DO $$
DECLARE
  available_roles TEXT[];
BEGIN
  -- First, check what roles are available in the enum
  SELECT array_agg(enumlabel::TEXT) INTO available_roles
  FROM pg_enum
  WHERE enumtypid = 'profile_role_enum'::regtype;
  
  RAISE NOTICE 'Available roles: %', available_roles;
  
  -- Check if policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'folders' AND policyname = 'folders_admin_board_access'
  ) THEN
    -- Create policy for Admin and other privileged roles
    -- Using a simpler approach that will work regardless of enum values
    IF array_position(available_roles, 'ADMIN') IS NOT NULL THEN
      CREATE POLICY folders_admin_access ON folders
        FOR ALL
        TO authenticated
        USING (
          is_syndicate = TRUE AND
          (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN'
        );
        
      RAISE NOTICE 'Access policy created for admin users';
    END IF;
    
    -- Attempt to create policy for board members if that role exists
    IF array_position(available_roles, 'BOARDMEMBER') IS NOT NULL THEN
      CREATE POLICY folders_board_access ON folders
        FOR ALL
        TO authenticated
        USING (
          is_syndicate = TRUE AND
          (SELECT role FROM profiles WHERE id = auth.uid()) = 'BOARDMEMBER'
        );
        
      RAISE NOTICE 'Access policy created for board members';
    END IF;
    
    -- Attempt to create policy for syndic/management if that role exists
    IF array_position(available_roles, 'SYNDIC') IS NOT NULL THEN
      CREATE POLICY folders_syndic_access ON folders
        FOR ALL
        TO authenticated
        USING (
          is_syndicate = TRUE AND
          (SELECT role FROM profiles WHERE id = auth.uid()) = 'SYNDIC'
        );
        
      RAISE NOTICE 'Access policy created for syndic/management';
    END IF;
  END IF;
END $$; 