-- Verify Building Data SQL Script
-- Run this script to verify the data was properly inserted and relationships are correctly set up

-- Building information
SELECT id, name, address, city, province, postal_code, country
FROM buildings
WHERE name = 'Lofts des Arts';

-- Count of units by type
SELECT unit_type, COUNT(*) 
FROM building_units 
WHERE building_id = (SELECT id FROM buildings WHERE name = 'Lofts des Arts')
GROUP BY unit_type;

-- Count of units by floor
SELECT floor_number, COUNT(*) 
FROM building_units 
WHERE building_id = (SELECT id FROM buildings WHERE name = 'Lofts des Arts')
GROUP BY floor_number
ORDER BY floor_number;

-- Count of occupied vs unoccupied units
SELECT is_occupied, COUNT(*) 
FROM building_units 
WHERE building_id = (SELECT id FROM buildings WHERE name = 'Lofts des Arts')
GROUP BY is_occupied;

-- List commercial units with their occupants
SELECT unit_number, occupant_name, square_footage
FROM building_units 
WHERE building_id = (SELECT id FROM buildings WHERE name = 'Lofts des Arts')
  AND unit_type = 'commercial'
ORDER BY unit_number;

-- Count of residents
SELECT COUNT(*) AS total_residents
FROM residents
WHERE building_id = (SELECT id FROM buildings WHERE name = 'Lofts des Arts');

-- Count of owners vs tenants
SELECT is_owner, COUNT(*) 
FROM residents
WHERE building_id = (SELECT id FROM buildings WHERE name = 'Lofts des Arts')
GROUP BY is_owner;

-- Count of primary vs secondary residents
SELECT is_primary_resident, COUNT(*) 
FROM residents
WHERE building_id = (SELECT id FROM buildings WHERE name = 'Lofts des Arts')
GROUP BY is_primary_resident;

-- Count of residents by preferred language
SELECT preferred_language, COUNT(*) 
FROM residents
WHERE building_id = (SELECT id FROM buildings WHERE name = 'Lofts des Arts')
GROUP BY preferred_language;

-- Count of residents by notification preferences
SELECT preferred_notification_method, COUNT(*) 
FROM residents
WHERE building_id = (SELECT id FROM buildings WHERE name = 'Lofts des Arts')
GROUP BY preferred_notification_method;

-- Sample data for unit residents (joins building_units and residents)
SELECT 
  bu.unit_number,
  bu.floor_number,
  r.first_name,
  r.last_name,
  r.email,
  r.is_owner,
  r.is_primary_resident,
  r.move_in_date,
  r.notes
FROM 
  building_units bu
JOIN 
  residents r ON bu.id = r.unit_id
WHERE 
  bu.building_id = (SELECT id FROM buildings WHERE name = 'Lofts des Arts')
ORDER BY 
  bu.unit_number
LIMIT 20; 