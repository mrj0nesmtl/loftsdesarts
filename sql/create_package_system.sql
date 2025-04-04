-- Create doorman role if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'user_role'
  ) THEN
    CREATE TYPE user_role AS ENUM ('admin', 'resident', 'doorman');
  ELSE
    -- Add doorman to existing user_role type if not already included
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'doorman';
  END IF;
END
$$;

-- Ensure profiles table has role column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'resident';
  END IF;
END
$$;

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES auth.users(id) NOT NULL,
  logged_by UUID REFERENCES auth.users(id) NOT NULL,
  carrier TEXT,
  tracking_number TEXT,
  description TEXT,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'received', -- 'received', 'notified', 'picked_up', 'expired'
  notes TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  picked_up_at TIMESTAMPTZ,
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create package notifications table
CREATE TABLE IF NOT EXISTS package_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) NOT NULL,
  notification_type TEXT NOT NULL, -- 'email', 'sms', 'app'
  status TEXT NOT NULL, -- 'pending', 'sent', 'failed'
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create package history table for tracking status changes
CREATE TABLE IF NOT EXISTS package_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  changed_by UUID REFERENCES auth.users(id) NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create carrier lookup table
CREATE TABLE IF NOT EXISTS carriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  tracking_url_format TEXT, -- URL format with {tracking_number} placeholder
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(name)
);

-- Create resident notification preferences table
CREATE TABLE IF NOT EXISTS resident_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES auth.users(id) NOT NULL,
  email_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  app_enabled BOOLEAN DEFAULT TRUE,
  phone_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(resident_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_packages_resident_id ON packages(resident_id);
CREATE INDEX IF NOT EXISTS idx_packages_logged_by ON packages(logged_by);
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON packages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_package_notifications_package_id ON package_notifications(package_id);
CREATE INDEX IF NOT EXISTS idx_package_notifications_recipient_id ON package_notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_package_history_package_id ON package_history(package_id);
CREATE INDEX IF NOT EXISTS idx_package_history_changed_at ON package_history(changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_resident_notification_preferences_resident_id ON resident_notification_preferences(resident_id);

-- Enable Row Level Security
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE resident_notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for packages
CREATE POLICY "Doormen and admins can view all packages"
  ON packages FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('doorman', 'admin'));

CREATE POLICY "Residents can view their own packages"
  ON packages FOR SELECT
  USING (resident_id = auth.uid());

CREATE POLICY "Doormen and admins can insert packages"
  ON packages FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('doorman', 'admin') AND logged_by = auth.uid());

CREATE POLICY "Doormen and admins can update packages"
  ON packages FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('doorman', 'admin'));

-- RLS Policies for package notifications
CREATE POLICY "Administrators can view all package notifications"
  ON package_notifications FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Doormen can view package notifications they created"
  ON package_notifications FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'doorman'
    AND
    package_id IN (SELECT id FROM packages WHERE logged_by = auth.uid())
  );

CREATE POLICY "Residents can view their own package notifications"
  ON package_notifications FOR SELECT
  USING (recipient_id = auth.uid());

CREATE POLICY "System can insert package notifications"
  ON package_notifications FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('doorman', 'admin'));

-- RLS Policies for package history
CREATE POLICY "Users can view package history they have access to"
  ON package_history FOR SELECT
  USING (
    package_id IN (
      SELECT id FROM packages WHERE 
      resident_id = auth.uid()
      OR
      logged_by = auth.uid()
      OR
      (SELECT role FROM profiles WHERE id = auth.uid()) IN ('doorman', 'admin')
    )
  );

CREATE POLICY "Doormen and admins can insert package history"
  ON package_history FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('doorman', 'admin') AND changed_by = auth.uid());

-- RLS Policies for carriers
CREATE POLICY "All users can view carriers"
  ON carriers FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage carriers"
  ON carriers
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- RLS Policies for resident notification preferences
CREATE POLICY "Residents can view their own notification preferences"
  ON resident_notification_preferences FOR SELECT
  USING (resident_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Residents can update their own notification preferences"
  ON resident_notification_preferences FOR UPDATE
  TO authenticated
  USING (resident_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Residents can insert their own notification preferences"
  ON resident_notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (resident_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Function to update package history on status change
CREATE OR REPLACE FUNCTION update_package_history()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS NULL OR NEW.status != OLD.status THEN
    INSERT INTO package_history (package_id, status, changed_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update package history
CREATE TRIGGER update_package_history
AFTER UPDATE ON packages
FOR EACH ROW
EXECUTE FUNCTION update_package_history();

-- Function to create initial package history on new package
CREATE OR REPLACE FUNCTION create_initial_package_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO package_history (package_id, status, changed_by)
  VALUES (NEW.id, NEW.status, NEW.logged_by);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create initial package history
CREATE TRIGGER create_initial_package_history
AFTER INSERT ON packages
FOR EACH ROW
EXECUTE FUNCTION create_initial_package_history();

-- Initial carrier data
INSERT INTO carriers (name, logo_url, tracking_url_format)
VALUES 
  ('FedEx', '/carriers/fedex-logo.png', 'https://www.fedex.com/apps/fedextrack/?tracknumbers={tracking_number}'),
  ('UPS', '/carriers/ups-logo.png', 'https://www.ups.com/track?tracknum={tracking_number}'),
  ('USPS', '/carriers/usps-logo.png', 'https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1={tracking_number}'),
  ('DHL', '/carriers/dhl-logo.png', 'https://www.dhl.com/en/express/tracking.html?AWB={tracking_number}'),
  ('Amazon', '/carriers/amazon-logo.png', 'https://track.amazon.com/{tracking_number}'),
  ('Purolator', '/carriers/purolator-logo.png', 'https://www.purolator.com/en/shipping/tracker?pin={tracking_number}'),
  ('Canada Post', '/carriers/canada-post-logo.png', 'https://www.canadapost-postescanada.ca/track-reperage/en#/details/{tracking_number}')
ON CONFLICT (name) DO NOTHING; 