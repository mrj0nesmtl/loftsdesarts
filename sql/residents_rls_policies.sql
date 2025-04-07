-- Residents Table RLS Policies
-- Execute this in the Supabase SQL Editor to fix the row-level security issues

-- First, drop any existing policies that might be conflicting
DROP POLICY IF EXISTS "Admins have full access to residents" ON residents;
DROP POLICY IF EXISTS "Syndics have full access to residents" ON residents;
DROP POLICY IF EXISTS "Users can only see residents in their own building" ON residents;
DROP POLICY IF EXISTS "Doormen can view all residents in their building" ON residents;

-- Allow admins to do everything with residents data
CREATE POLICY "Admins have full access to residents"
ON residents
FOR ALL
USING (
  -- Check if the current user has the ADMIN role
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
  )
);

-- Allow syndics to do everything with residents data
CREATE POLICY "Syndics have full access to residents"
ON residents
FOR ALL
USING (
  -- Check if the current user has the SYNDIC role
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'SYNDIC'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'SYNDIC'
  )
);

-- Allow regular users to only view residents in their building
CREATE POLICY "Users can only see residents in their own building"
ON residents
FOR SELECT
USING (
  -- Get the building_id of the current user
  EXISTS (
    SELECT 1 FROM residents AS user_resident
    WHERE user_resident.user_id = auth.uid()
    AND user_resident.building_id = residents.building_id
  )
);

-- Allow doormen to view all residents (simplified without doormen table)
CREATE POLICY "Doormen can view all residents"
ON residents
FOR SELECT
USING (
  -- Check if the current user has the DOORMAN role
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'DOORMAN'
  )
);

-- Verify the table has RLS enabled
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;

-- The above changes should resolve the "new row violates row-level security policy for table \"residents\"" error
-- by giving admins and syndics proper permissions to insert example data. 