-- Simplified fix for infinite recursion in profiles table policies
-- Execute this in the Supabase SQL Editor

-- First, completely disable Row Level Security on profiles temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Syndic can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Re-enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create single simple policy that allows all authenticated users to view all profiles
-- This is a temporary fix to get rid of the recursion errors
CREATE POLICY "Users can view profiles" 
ON profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Create policy allowing users to update their own profile only
CREATE POLICY "Users can update their own profile" 
ON profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- Grant permissions to the anon role for basic access
GRANT SELECT ON profiles TO anon;
GRANT SELECT ON profiles TO authenticated;
GRANT UPDATE (role, email, avatar_url) ON profiles TO authenticated; 