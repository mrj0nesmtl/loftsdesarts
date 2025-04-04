-- Add SYNDIC role to the profile_role_enum type

DO $$
DECLARE
  r RECORD;
BEGIN
  -- First, drop all existing RLS policies that might depend on the role column
  FOR r IN (
    SELECT 
      n.nspname AS schema_name,
      c.relname AS table_name,
      p.polname AS policy_name
    FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I;', 
                   r.policy_name, r.schema_name, r.table_name);
  END LOOP;

  -- Drop the default on the role column
  ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;
  
  -- Convert enum to text
  ALTER TABLE profiles ALTER COLUMN role TYPE text;
  
  -- Drop the enum type
  DROP TYPE profile_role_enum;
  
  -- Create the enum type with SYNDIC added
  CREATE TYPE profile_role_enum AS ENUM ('ADMIN', 'DOORMAN', 'USER', 'SYNDIC');
  
  -- Convert text back to enum
  ALTER TABLE profiles 
  ALTER COLUMN role TYPE profile_role_enum 
  USING role::profile_role_enum;
  
  -- Re-add the default
  ALTER TABLE profiles 
  ALTER COLUMN role SET DEFAULT 'USER'::profile_role_enum;
  
  -- Now recreate all the policies
  
  -- Policy for profiles
  CREATE POLICY "Users can view their own profile" 
  ON profiles 
  FOR SELECT 
  USING (auth.uid() = id);
  
  CREATE POLICY "Users can update their own profile" 
  ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);
  
  CREATE POLICY "Admin can view all profiles" 
  ON profiles 
  FOR SELECT 
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN');
  
  CREATE POLICY "Admin can update all profiles" 
  ON profiles 
  FOR UPDATE 
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN');
  
  -- Recreate other policies for packages
  CREATE POLICY "Doormen can view package tables" 
  ON packages FOR SELECT 
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('ADMIN', 'DOORMAN'));
  
  CREATE POLICY "Doormen can insert packages" 
  ON packages FOR INSERT 
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('ADMIN', 'DOORMAN'));
  
  CREATE POLICY "Doormen can update packages" 
  ON packages FOR UPDATE 
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('ADMIN', 'DOORMAN'));
  
  -- Add policies for Syndic role
  CREATE POLICY "Syndic can view all profiles" 
  ON profiles 
  FOR SELECT 
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'SYNDIC');
  
END$$; 