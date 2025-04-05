-- Building Data Setup for Lofts des Arts
-- Address: 1625 Clark, Montreal H2X 2R4

-- First, ensure we have a buildings table and insert the building record
CREATE TABLE IF NOT EXISTS buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  country VARCHAR(100) DEFAULT 'Canada',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on buildings table
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;

-- Insert the Lofts des Arts building record if it doesn't exist
INSERT INTO buildings (name, address, city, province, postal_code)
VALUES ('Lofts des Arts', '1625 Clark', 'Montreal', 'QC', 'H2X 2R4')
ON CONFLICT (id) DO NOTHING
RETURNING id;

-- Get the building ID for use in subsequent inserts
DO $$
DECLARE
  building_id UUID;
BEGIN
  SELECT id INTO building_id FROM buildings WHERE name = 'Lofts des Arts' AND address = '1625 Clark';

  -- Add metadata to building_units table if needed columns don't exist
  BEGIN
    ALTER TABLE building_units ADD COLUMN IF NOT EXISTS building_id UUID REFERENCES buildings(id);
    ALTER TABLE building_units ADD COLUMN IF NOT EXISTS unit_type VARCHAR(20) DEFAULT 'residential';
    ALTER TABLE building_units ADD COLUMN IF NOT EXISTS occupant_name VARCHAR(255);
  EXCEPTION
    WHEN duplicate_column THEN
      -- Do nothing, column already exists
  END;

  -- First, insert the residential units (floors 1-9, 10 units per floor)
  FOR floor IN 1..9 LOOP
    FOR unit IN 1..10 LOOP
      -- Format unit number as 101, 102, etc. (floor + unit)
      INSERT INTO building_units (
        building_id, 
        unit_number, 
        floor_number, 
        unit_type,
        square_footage,
        bedrooms,
        bathrooms,
        is_occupied
      )
      VALUES (
        building_id,
        CONCAT(floor, LPAD(unit::TEXT, 2, '0')), -- e.g., 101, 102, 201, 202, etc.
        floor,
        'residential',
        -- Square footage between 800-1200 sq ft
        800 + (floor * 25) + (unit * 10), 
        -- Most units have 1-2 bedrooms
        CASE 
          WHEN unit <= 7 THEN 1 + (unit % 2)
          ELSE 2 + (unit % 2)
        END,
        -- Bathrooms (1-2)
        1 + (unit % 2),
        -- Random occupation status (about 80% occupied)
        CASE WHEN RANDOM() < 0.8 THEN TRUE ELSE FALSE END
      )
      ON CONFLICT (id) DO NOTHING;
    END LOOP;
  END LOOP;

  -- Insert the penthouse units (PH1-PH4)
  FOR ph_unit IN 1..4 LOOP
    INSERT INTO building_units (
      building_id, 
      unit_number, 
      floor_number, 
      unit_type,
      square_footage,
      bedrooms,
      bathrooms,
      is_occupied
    )
    VALUES (
      building_id,
      CONCAT('PH', ph_unit), -- PH1, PH2, PH3, PH4
      10, -- Penthouse floor (10th floor)
      'residential',
      -- Penthouses are larger (1500-2000 sq ft)
      1500 + (ph_unit * 125),
      -- Penthouses have 2-3 bedrooms
      2 + (ph_unit % 2),
      -- Penthouses have 2-3 bathrooms
      2 + (ph_unit % 2),
      -- All penthouses are occupied
      TRUE
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;

  -- Insert the commercial units
  -- Goethe Institut
  INSERT INTO building_units (
    building_id, 
    unit_number, 
    floor_number, 
    unit_type,
    square_footage,
    is_occupied,
    occupant_name
  )
  VALUES (
    building_id,
    'C-100', -- Commercial unit 100
    1, -- Ground floor
    'commercial',
    3500, -- Commercial unit size
    TRUE, -- Occupied
    'Goethe Institut'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Pikolo Cafe
  INSERT INTO building_units (
    building_id, 
    unit_number, 
    floor_number, 
    unit_type,
    square_footage,
    is_occupied,
    occupant_name
  )
  VALUES (
    building_id,
    'C-101', -- Commercial unit 101
    1, -- Ground floor
    'commercial',
    1200, -- Commercial unit size
    TRUE, -- Occupied
    'Pikolo Cafe'
  )
  ON CONFLICT (id) DO NOTHING;

END $$; 