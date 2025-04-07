-- Fix Residents Table Recursive RLS Policies
-- Execute this in the Supabase SQL Editor to fix infinite recursion

-- First, drop ALL existing policies that might be conflicting or causing recursion
DROP POLICY IF EXISTS "Admins can manage all residents" ON residents;
DROP POLICY IF EXISTS "Admins have full access to residents" ON residents;
DROP POLICY IF EXISTS "SUPER_ADMIN have full access to residents" ON residents;
DROP POLICY IF EXISTS "Managers have full access to residents" ON residents;
DROP POLICY IF EXISTS "Doormen can view all residents" ON residents;
DROP POLICY IF EXISTS "Users can only see residents in their own building" ON residents;
DROP POLICY IF EXISTS "Residents can view own data" ON residents;
DROP POLICY IF EXISTS "Syndics have full access to residents" ON residents;

-- Create a secure function to get a user's role without triggering RLS recursion
CREATE OR REPLACE FUNCTION get_user_role(uid UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER -- Run with privileges of the function creator
AS $$
  -- Get the role from the profiles table instead of user_roles
  SELECT role FROM profiles WHERE id = uid LIMIT 1;
$$;

-- Create a secure function to get a user's building without triggering RLS recursion
CREATE OR REPLACE FUNCTION get_user_building(uid UUID)
RETURNS TEXT  -- Changed from UUID to TEXT to match the actual column type
LANGUAGE sql
SECURITY DEFINER -- Run with privileges of the function creator
AS $$
  SELECT building_id FROM residents WHERE user_id = uid LIMIT 1;
$$;

-- Create non-recursive policies using functions

-- 1. Admin access policy
CREATE POLICY "Admin roles can manage all residents"
ON residents
FOR ALL
USING (
  get_user_role(auth.uid()) IN ('ADMIN', 'SUPER_ADMIN', 'MANAGER')
);

-- 2. Doormen view-only access
CREATE POLICY "Doormen can view all residents"
ON residents
FOR SELECT
USING (
  get_user_role(auth.uid()) = 'DOORMAN'
);

-- 3. User own-data access
CREATE POLICY "Users can view their own resident data"
ON residents
FOR SELECT
USING (
  auth.uid() = user_id
);

-- Verify the table has RLS enabled
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;

-- The above changes should resolve the "infinite recursion detected in policy for relation \"residents\"" error
-- by using secure functions that don't trigger recursive RLS checks 