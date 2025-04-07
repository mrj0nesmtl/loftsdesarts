-- Fix RLS policies for building_units table

-- First, check if RLS is enabled for the table
SELECT obj_description('building_units'::regclass, 'pg_class');

-- Enable RLS for building_units table
ALTER TABLE building_units ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "building_units_select_policy" ON building_units;
DROP POLICY IF EXISTS "building_units_insert_policy" ON building_units;
DROP POLICY IF EXISTS "building_units_update_policy" ON building_units;
DROP POLICY IF EXISTS "building_units_delete_policy" ON building_units;

-- Create function to get user role safely
CREATE OR REPLACE FUNCTION get_user_role(uid UUID)
RETURNS TEXT
LANGUAGE SQL SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = uid
$$;

-- Create policies for the building_units table
-- 1. Admin can do everything
CREATE POLICY "building_units_admin_all" ON building_units
  USING (get_user_role(auth.uid()) = 'ADMIN')
  WITH CHECK (get_user_role(auth.uid()) = 'ADMIN');

-- 2. Doormen can view all units
CREATE POLICY "building_units_doorman_select" ON building_units
  FOR SELECT
  USING (get_user_role(auth.uid()) = 'DOORMAN');

-- 3. Regular users can only view units in their building
CREATE POLICY "building_units_user_select" ON building_units
  FOR SELECT
  USING (
    building_id IN (
      SELECT building_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

-- 4. Building managers can manage units in their buildings
CREATE POLICY "building_units_manager_all" ON building_units
  USING (
    get_user_role(auth.uid()) = 'BUILDING_MANAGER' AND
    building_id IN (
      SELECT building_id FROM profiles 
      WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    get_user_role(auth.uid()) = 'BUILDING_MANAGER' AND
    building_id IN (
      SELECT building_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

-- Done 