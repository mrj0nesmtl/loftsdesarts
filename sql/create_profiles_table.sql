-- Create the profiles table for admin users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'ADMIN',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view their own profile
CREATE POLICY "Users can view their own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Create policy for admins to update their own profile
CREATE POLICY "Users can update their own profile" 
ON profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Insert Marc's profile (Replace the UUID with Marc's actual auth.users ID)
INSERT INTO profiles (id, email, role) 
VALUES ('8f1769d-7eba-4518-8012-8510439f98e1', 'joel.yaffe+stts@gmail.com', 'ADMIN')
ON CONFLICT (id) DO NOTHING;

-- Insert your profile (Replace the UUID with your actual auth.users ID)
INSERT INTO profiles (id, email, role) 
VALUES ('8b689ccb-eb1e-4aa3-a928-4cabe8bbac1d', 'sttsreichel@gmail.com', 'ADMIN')
ON CONFLICT (id) DO NOTHING; 