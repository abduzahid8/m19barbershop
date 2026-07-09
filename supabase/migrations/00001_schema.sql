-- M19 Barbershop Schema

-- Profiles (extends Supabase Auth users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view barber profiles"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Barbers
CREATE TABLE barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
  review_count INTEGER NOT NULL DEFAULT 0,
  bio TEXT NOT NULL,
  image_url TEXT,
  portfolio TEXT[] NOT NULL DEFAULT '{}',
  color_index INTEGER NOT NULL DEFAULT 0,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view barbers"
  ON barbers FOR SELECT USING (true);

CREATE POLICY "Admins can manage barbers"
  ON barbers FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND name = 'admin')
  );

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  types TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services"
  ON services FOR SELECT USING (true);

-- Time Slots
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  time TIME NOT NULL,
  date DATE NOT NULL,
  available BOOLEAN NOT NULL DEFAULT true,
  period TEXT NOT NULL CHECK (period IN ('morning', 'afternoon', 'evening'))
);

ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view time slots"
  ON time_slots FOR SELECT USING (true);

CREATE POLICY "Admins can manage time slots"
  ON time_slots FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND name = 'admin')
  );

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  barber_id UUID NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  barber_name TEXT NOT NULL,
  service_names TEXT[] NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own appointments"
  ON appointments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own appointments"
  ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
  ON appointments FOR UPDATE USING (auth.uid() = user_id);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Loyalty Points
CREATE TABLE loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold')),
  total_visits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own loyalty"
  ON loyalty_points FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can upsert loyalty"
  ON loyalty_points FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own loyalty"
  ON loyalty_points FOR UPDATE USING (auth.uid() = user_id);

-- Functions & Triggers

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO profiles (id, phone, name)
  VALUES (NEW.id, NEW.phone, COALESCE(NEW.raw_user_meta_data ->> 'name', 'Guest'));

  INSERT INTO loyalty_points (user_id, points, tier, total_visits)
  VALUES (NEW.id, 0, 'bronze', 0);

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Award loyalty points when appointment is completed
CREATE OR REPLACE FUNCTION award_loyalty_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO loyalty_points (user_id, points, total_visits, tier)
    VALUES (NEW.user_id, 10, 1, 'bronze')
    ON CONFLICT (user_id) DO UPDATE SET
      points = loyalty_points.points + 10,
      total_visits = loyalty_points.total_visits + 1,
      tier = CASE
        WHEN loyalty_points.total_visits + 1 >= 20 THEN 'gold'
        WHEN loyalty_points.total_visits + 1 >= 10 THEN 'silver'
        ELSE 'bronze'
      END;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_appointment_completed
  AFTER UPDATE OF status ON appointments
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION award_loyalty_points();

-- Insert default services
INSERT INTO services (name, price, duration, icon, description, types) VALUES
  ('Haircut', 80000, 45, 'scissors', 'Precision cut tailored to your style', ARRAY['Classic Fade', 'Textured Crop', 'Pompadour', 'Buzz Cut']),
  ('Beard Trim', 50000, 30, 'minus', 'Shape, trim, and hot towel finish', ARRAY['Full Beard', 'Stubble', 'Goatee', 'Clean Shave']),
  ('Haircut + Beard', 120000, 60, 'check-square', 'Full grooming package', ARRAY['Fade & Beard', 'Crop & Stubble', 'Classic Combo']),
  ('Hair Wash', 30000, 15, 'droplet', 'Refresh with premium products', NULL),
  ('Kids Haircut', 60000, 30, 'smile', 'Patient care for young clients', ARRAY['Toddler Trim', 'School Style', 'Trendy Kid']),
  ('Royal Shave', 70000, 40, 'star', 'Traditional hot towel straight razor shave', ARRAY['Classic Shave', 'Hot Towel Deluxe', 'Face Refresh']);
