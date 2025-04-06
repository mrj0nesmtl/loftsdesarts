-- User Roles Table RLS Policies
-- Execute this in the Supabase SQL Editor to enable and configure RLS

-- First, enable RLS on the user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Allow SUPER_ADMIN users to do everything with roles
CREATE POLICY "SUPER_ADMIN full access to user_roles"
ON user_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'SUPER_ADMIN'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'SUPER_ADMIN'
  )
);

-- Allow ADMIN users to do everything with roles
CREATE POLICY "ADMIN full access to user_roles"
ON user_roles
FOR ALL
USING (
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

-- Allow all authenticated users to view their own role
CREATE POLICY "Users can view their own role"
ON user_roles
FOR SELECT
USING (
  auth.uid()::text = user_roles.user_id
);

-- Allow all authenticated users to view roles in general (if needed)
-- Comment this out if you want to restrict role visibility
CREATE POLICY "All users can view roles"
ON user_roles
FOR SELECT
USING (auth.role() = 'authenticated');

-- Note: This setup assumes:
-- 1. user_roles has a column named 'user_id' that matches auth.uid()
-- 2. profiles table has the user role information
-- Adjust as needed based on your exact schema 