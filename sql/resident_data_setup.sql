-- Sample Resident Data Setup for Lofts des Arts
-- This script adds sample residents to the building units

-- Get the building ID for Lofts des Arts
DO $$
DECLARE
  building_id UUID;
BEGIN
  SELECT id INTO building_id FROM buildings WHERE name = 'Lofts des Arts' AND address = '1625 Clark';
  
  -- Ensure the residents table has the necessary columns
  BEGIN
    ALTER TABLE residents ADD COLUMN IF NOT EXISTS building_id UUID REFERENCES buildings(id);
    ALTER TABLE residents ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(10) DEFAULT 'fr';
    ALTER TABLE residents ADD COLUMN IF NOT EXISTS preferred_notification_method VARCHAR(20) DEFAULT 'email';
  EXCEPTION
    WHEN duplicate_column THEN
      -- Do nothing, column already exists
  END;
  
  -- Sample resident data - Francophone names common in Montreal
  -- First floor residents
  INSERT INTO residents (
    building_id,
    unit_id,
    first_name,
    last_name,
    email,
    phone,
    is_owner,
    is_primary_resident,
    move_in_date,
    preferred_language,
    preferred_notification_method,
    notes
  )
  SELECT
    building_id,
    bu.id,
    first_name,
    last_name,
    email,
    phone,
    is_owner,
    is_primary_resident,
    move_in_date,
    language,
    notification,
    notes
  FROM building_units bu
  CROSS JOIN (
    VALUES
      -- Unit 101
      ('Sophie', 'Tremblay', 'sophie.tremblay@example.com', '514-555-1001', TRUE, TRUE, '2020-06-15', 'fr', 'email', 'Board member'),
      -- Unit 102
      ('Marc', 'Gagnon', 'marc.gagnon@example.com', '514-555-1002', TRUE, TRUE, '2019-08-10', 'fr', 'email', 'Musician, prefers deliveries after 2pm'),
      -- Unit 103
      ('Isabelle', 'Roy', 'isabelle.roy@example.com', '514-555-1003', TRUE, TRUE, '2021-01-22', 'fr', 'sms', 'Works from home'),
      -- Unit 104
      ('Antoine', 'Côté', 'antoine.cote@example.com', '514-555-1004', FALSE, TRUE, '2022-07-05', 'fr', 'email', 'Tenant - 2 year lease'),
      -- Unit 201
      ('Clara', 'Bouchard', 'clara.bouchard@example.com', '514-555-2001', TRUE, TRUE, '2018-12-03', 'en', 'email', 'Board treasurer'),
      -- Unit 202
      ('Thomas', 'Lavoie', 'thomas.lavoie@example.com', '514-555-2002', TRUE, TRUE, '2020-04-18', 'fr', 'sms', 'Has a dog (approved)'),
      -- Unit 203
      ('Émilie', 'Fortin', 'emilie.fortin@example.com', '514-555-2003', FALSE, TRUE, '2022-02-14', 'fr', 'email', 'Tenant - 1 year lease'),
      -- Unit 301
      ('David', 'Bergeron', 'david.bergeron@example.com', '514-555-3001', TRUE, TRUE, '2019-05-20', 'fr', 'email', 'Building committee member'),
      -- Unit 302
      ('Charlotte', 'Girard', 'charlotte.girard@example.com', '514-555-3002', FALSE, TRUE, '2021-11-30', 'fr', 'sms', 'Tenant - 6 month lease'),
      -- Unit 401
      ('Samuel', 'Morin', 'samuel.morin@example.com', '514-555-4001', TRUE, TRUE, '2018-03-15', 'fr', 'email', 'Needs parking access'),
      -- Unit 501
      ('Léa', 'Leclerc', 'lea.leclerc@example.com', '514-555-5001', TRUE, TRUE, '2020-09-01', 'fr', 'email', 'Artist - works from home'),
      -- Unit 601
      ('Mathieu', 'Gauthier', 'mathieu.gauthier@example.com', '514-555-6001', TRUE, TRUE, '2022-01-05', 'fr', 'sms', 'Travel frequently'),
      -- Unit 701
      ('Juliette', 'Lefebvre', 'juliette.lefebvre@example.com', '514-555-7001', TRUE, TRUE, '2019-12-10', 'fr', 'email', ''),
      -- Unit 801
      ('Olivier', 'Pelletier', 'olivier.pelletier@example.com', '514-555-8001', FALSE, TRUE, '2021-07-22', 'fr', 'email', 'Tenant - 3 year lease'),
      -- Unit 901
      ('Camille', 'Paré', 'camille.pare@example.com', '514-555-9001', TRUE, TRUE, '2020-05-17', 'fr', 'sms', 'Board secretary'),
      -- Penthouses
      -- PH1
      ('Vincent', 'Lapierre', 'vincent.lapierre@example.com', '514-555-0001', TRUE, TRUE, '2018-08-01', 'fr', 'email', 'Board president'),
      -- PH2
      ('Catherine', 'Mercier', 'catherine.mercier@example.com', '514-555-0002', TRUE, TRUE, '2019-04-12', 'fr', 'email', 'Designer - works from home'),
      -- PH3
      ('Alexandre', 'Poirier', 'alexandre.poirier@example.com', '514-555-0003', TRUE, TRUE, '2020-11-08', 'en', 'sms', 'Executive - travels frequently'),
      -- PH4
      ('Elizabeth', 'Simard', 'elizabeth.simard@example.com', '514-555-0004', TRUE, TRUE, '2018-06-30', 'fr', 'email', 'Professor at McGill')
  ) AS resident_data(first_name, last_name, email, phone, is_owner, is_primary_resident, move_in_date, language, notification, notes)
  WHERE bu.unit_number IN ('101', '102', '103', '104', '201', '202', '203', '301', '302', '401', '501', '601', '701', '801', '901', 'PH1', 'PH2', 'PH3', 'PH4')
    AND bu.building_id = building_id
  ON CONFLICT (id) DO NOTHING;

  -- Add some additional residents (spouses/roommates) for some units
  INSERT INTO residents (
    building_id,
    unit_id,
    first_name,
    last_name,
    email,
    phone,
    is_owner,
    is_primary_resident,
    move_in_date,
    preferred_language,
    preferred_notification_method,
    notes
  )
  SELECT
    building_id,
    bu.id,
    first_name,
    last_name,
    email,
    phone,
    is_owner,
    is_primary_resident,
    move_in_date,
    language,
    notification,
    notes
  FROM building_units bu
  CROSS JOIN (
    VALUES
      -- Unit 101 (spouse)
      ('Daniel', 'Tremblay', 'daniel.tremblay@example.com', '514-555-1001-2', TRUE, FALSE, '2020-06-15', 'fr', 'email', ''),
      -- Unit 201 (spouse)
      ('Jean', 'Bouchard', 'jean.bouchard@example.com', '514-555-2001-2', TRUE, FALSE, '2018-12-03', 'fr', 'sms', ''),
      -- Unit 401 (roommate)
      ('Marie', 'Dumont', 'marie.dumont@example.com', '514-555-4001-2', FALSE, FALSE, '2019-01-10', 'fr', 'email', 'Student at UQAM'),
      -- PH1 (spouse)
      ('Céline', 'Lapierre', 'celine.lapierre@example.com', '514-555-0001-2', TRUE, FALSE, '2018-08-01', 'fr', 'email', '')
  ) AS resident_data(first_name, last_name, email, phone, is_owner, is_primary_resident, move_in_date, language, notification, notes)
  WHERE bu.unit_number IN ('101', '201', '401', 'PH1')
    AND bu.building_id = building_id
  ON CONFLICT (id) DO NOTHING;

END $$; 