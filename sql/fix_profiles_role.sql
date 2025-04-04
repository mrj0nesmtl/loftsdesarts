-- Check and fix profile role issues

DO $$
DECLARE 
  enum_exists BOOLEAN;
  enum_values TEXT[];
  has_syndic BOOLEAN;
BEGIN
  -- Check if the enum type exists
  SELECT EXISTS (
    SELECT 1 
    FROM pg_type 
    WHERE typname = 'profile_role_enum'
  ) INTO enum_exists;
  
  IF enum_exists THEN
    -- Get the current enum values
    SELECT array_agg(enumlabel::TEXT) 
    FROM pg_enum 
    WHERE enumtypid = 'profile_role_enum'::regtype
    INTO enum_values;
    
    -- Check if 'SYNDIC' is in the enum
    SELECT 'SYNDIC' = ANY(enum_values) INTO has_syndic;
    
    RAISE NOTICE 'Current enum values: %', enum_values;
    RAISE NOTICE 'Has SYNDIC: %', has_syndic;
    
    IF NOT has_syndic THEN
      RAISE NOTICE 'Adding SYNDIC to profile_role_enum...';
      
      -- Temporarily convert the profiles.role column to text
      ALTER TABLE profiles ALTER COLUMN role TYPE TEXT;
      
      -- Drop and recreate the enum with SYNDIC
      DROP TYPE profile_role_enum;
      CREATE TYPE profile_role_enum AS ENUM ('ADMIN', 'DOORMAN', 'USER', 'SYNDIC');
      
      -- Convert back to enum
      ALTER TABLE profiles 
        ALTER COLUMN role TYPE profile_role_enum 
        USING role::profile_role_enum;
        
      RAISE NOTICE 'SYNDIC role added successfully';
    ELSE
      RAISE NOTICE 'SYNDIC role already exists in enum type';
    END IF;
  ELSE
    RAISE NOTICE 'profile_role_enum does not exist, creating it...';
    
    -- Check if profiles table exists
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles') THEN
      -- Create the enum type
      CREATE TYPE profile_role_enum AS ENUM ('ADMIN', 'DOORMAN', 'USER', 'SYNDIC');
      
      -- Update profiles table if role column exists
      IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'role'
      ) THEN
        -- Check the data type of the role column
        IF (
          SELECT data_type 
          FROM information_schema.columns 
          WHERE table_name = 'profiles' AND column_name = 'role'
        ) = 'USER-DEFINED' THEN
          RAISE NOTICE 'Role column is already an enum type, converting...';
        ELSE
          -- Convert text to enum
          ALTER TABLE profiles 
            ALTER COLUMN role TYPE profile_role_enum 
            USING 
              CASE 
                WHEN role = 'ADMIN' THEN 'ADMIN'::profile_role_enum
                WHEN role = 'DOORMAN' THEN 'DOORMAN'::profile_role_enum
                WHEN role = 'SYNDIC' THEN 'SYNDIC'::profile_role_enum
                ELSE 'USER'::profile_role_enum
              END;
              
          RAISE NOTICE 'Converted role column to enum type';
        END IF;
      ELSE
        RAISE NOTICE 'Role column does not exist in profiles table';
      END IF;
    ELSE
      RAISE NOTICE 'Profiles table does not exist';
    END IF;
  END IF;
  
  -- Ensure all users have a valid role
  UPDATE profiles
  SET role = 'USER'::profile_role_enum
  WHERE role IS NULL;
  
  -- Output profile roles for verification
  RAISE NOTICE 'Current user roles:';
  
  FOR r IN 
    SELECT id, role FROM profiles
  LOOP
    RAISE NOTICE 'User %: Role %', r.id, r.role;
  END LOOP;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error fixing profile roles: %', SQLERRM;
END;
$$; 