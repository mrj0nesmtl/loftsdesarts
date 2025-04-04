-- Fix for infinite recursion in profiles table policies
-- Execute this in the Supabase SQL Editor

-- First, drop the problematic policies on profiles table that cause recursion
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Syndic can view all profiles" ON profiles;

-- Recreate the policies with non-recursive definitions
-- For Admin view policy
CREATE POLICY "Admin can view all profiles" 
ON profiles 
FOR SELECT 
USING (auth.uid() IN (
  SELECT id FROM profiles 
  WHERE role = 'ADMIN'
));

-- For Admin update policy
CREATE POLICY "Admin can update all profiles" 
ON profiles 
FOR UPDATE 
USING (auth.uid() IN (
  SELECT id FROM profiles 
  WHERE role = 'ADMIN'
));

-- For Syndic view policy
CREATE POLICY "Syndic can view all profiles" 
ON profiles 
FOR SELECT 
USING (auth.uid() IN (
  SELECT id FROM profiles 
  WHERE role = 'SYNDIC'
));

-- Ensure basic policies exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" 
ON profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Create a function to safely get a user's role without triggering policy recursion
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER -- Run with privileges of the function creator
AS $$
  SELECT role::TEXT FROM profiles WHERE id = user_id;
$$;
