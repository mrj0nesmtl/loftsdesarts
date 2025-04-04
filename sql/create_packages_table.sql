-- Create the tables for the package management system

-- Enum for package status
CREATE TYPE package_status_enum AS ENUM (
  'PENDING', -- Just registered, not yet received
  'RECEIVED', -- Received by building staff
  'NOTIFIED', -- Resident has been notified
  'DELIVERED', -- Delivered to resident
  'RETURNED' -- Returned to sender
);

-- Table to store carriers/couriers
CREATE TABLE IF NOT EXISTS carriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  tracking_url_template TEXT, -- URL template with {tracking_number} placeholder
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table to store package information
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number TEXT,
  carrier_id UUID REFERENCES carriers(id),
  resident_id UUID REFERENCES profiles(id),
  unit_number TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  description TEXT,
  notes TEXT,
  dimensions TEXT, -- e.g. "30cm x 20cm x 10cm"
  weight TEXT, -- e.g. "2.5kg"
  status package_status_enum NOT NULL DEFAULT 'PENDING',
  photo_url TEXT, -- URL to photo of the package (optional)
  received_at TIMESTAMPTZ, -- When the package was received
  notified_at TIMESTAMPTZ, -- When the resident was notified
  delivered_at TIMESTAMPTZ, -- When the package was picked up
  received_by UUID REFERENCES profiles(id), -- Staff who received the package
  delivered_by UUID REFERENCES profiles(id), -- Staff who delivered the package
  signature_url TEXT, -- URL to signature image if required
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table to store package notifications
CREATE TABLE IF NOT EXISTS package_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL, -- 'EMAIL', 'SMS', 'APP'
  recipient TEXT NOT NULL, -- Email address or phone number
  content TEXT NOT NULL, -- Content of the notification
  status TEXT NOT NULL, -- 'SENT', 'DELIVERED', 'FAILED'
  error_message TEXT, -- Error message if failed
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table to store package history/status changes
CREATE TABLE IF NOT EXISTS package_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  status package_status_enum NOT NULL,
  notes TEXT,
  changed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add triggers to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER update_carrier_updated_at
BEFORE UPDATE ON carriers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_package_updated_at
BEFORE UPDATE ON packages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically log package history
CREATE OR REPLACE FUNCTION log_package_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS NULL OR NEW.status <> OLD.status THEN
    INSERT INTO package_history (package_id, status, changed_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_package_status_change_trigger
AFTER UPDATE ON packages
FOR EACH ROW
EXECUTE FUNCTION log_package_status_change();

-- Log initial status when package is created
CREATE TRIGGER log_package_initial_status_trigger
AFTER INSERT ON packages
FOR EACH ROW
EXECUTE FUNCTION log_package_status_change();

-- Enable Row Level Security
ALTER TABLE carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_history ENABLE ROW LEVEL SECURITY;

-- Set up RLS policies

-- Carriers table policies
DROP POLICY IF EXISTS "Anyone can view carriers" ON carriers;
CREATE POLICY "Anyone can view carriers" 
ON carriers FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Only admins can modify carriers" ON carriers;
CREATE POLICY "Only admins can modify carriers" 
ON carriers FOR ALL 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN');

-- Packages table policies
DROP POLICY IF EXISTS "Admins can do anything with packages" ON packages;
CREATE POLICY "Admins can do anything with packages" 
ON packages FOR ALL 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN');

DROP POLICY IF EXISTS "Doormen can view all packages" ON packages;
CREATE POLICY "Doormen can view all packages" 
ON packages FOR SELECT 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'DOORMAN');

DROP POLICY IF EXISTS "Doormen can update package status" ON packages;
CREATE POLICY "Doormen can update package status" 
ON packages FOR UPDATE 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'DOORMAN');

DROP POLICY IF EXISTS "Residents can view their own packages" ON packages;
CREATE POLICY "Residents can view their own packages" 
ON packages FOR SELECT 
USING (resident_id = auth.uid());

-- Package notifications policies
DROP POLICY IF EXISTS "Admins and doormen can view all notifications" ON package_notifications;
CREATE POLICY "Admins and doormen can view all notifications" 
ON package_notifications FOR SELECT 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('ADMIN', 'DOORMAN'));

DROP POLICY IF EXISTS "Residents can view their own notifications" ON package_notifications;
CREATE POLICY "Residents can view their own notifications" 
ON package_notifications FOR SELECT 
USING (
  package_id IN (
    SELECT id FROM packages WHERE resident_id = auth.uid()
  )
);

-- Package history policies
DROP POLICY IF EXISTS "Admins and doormen can view all package history" ON package_history;
CREATE POLICY "Admins and doormen can view all package history" 
ON package_history FOR SELECT 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('ADMIN', 'DOORMAN'));

DROP POLICY IF EXISTS "Residents can view their own package history" ON package_history;
CREATE POLICY "Residents can view their own package history" 
ON package_history FOR SELECT 
USING (
  package_id IN (
    SELECT id FROM packages WHERE resident_id = auth.uid()
  )
);

-- Seed some common carriers
INSERT INTO carriers (name, tracking_url_template)
VALUES 
  ('UPS', 'https://www.ups.com/track?tracknum={tracking_number}'),
  ('FedEx', 'https://www.fedex.com/apps/fedextrack/?tracknumbers={tracking_number}'),
  ('Purolator', 'https://www.purolator.com/en/shipping/tracker?pin={tracking_number}'),
  ('Canada Post', 'https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor={tracking_number}'),
  ('Amazon Logistics', 'https://track.amazon.com/tracking/{tracking_number}'),
  ('DHL', 'https://www.dhl.com/ca-en/home/tracking/tracking-express.html?submit=1&tracking-id={tracking_number}')
ON CONFLICT DO NOTHING; 