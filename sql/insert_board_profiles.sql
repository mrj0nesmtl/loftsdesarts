-- Insert board member profiles with their actual Supabase Auth UUIDs

-- Board Member: Joel Yaffe
INSERT INTO profiles (id, email, role) 
VALUES ('aeaec491-e873-4a44-b573-67dfa853743c', 'joel.yaffe+lda@gmail.com', 'ADMIN')
ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  role = EXCLUDED.role;

-- Board Member: Viviane Sokoluk
INSERT INTO profiles (id, email, role) 
VALUES ('8ad94300-b188-450c-9dc9-e51155347d80', 'viviane.sokoluk@gmail.com', 'ADMIN')
ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  role = EXCLUDED.role;

-- Board Member: Jacques Germain
INSERT INTO profiles (id, email, role) 
VALUES ('11d9acf8-505f-4f53-af2e-ce41cb80e69b', 'info@jacquesgermain.com', 'ADMIN')
ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  role = EXCLUDED.role;

-- Board Member: David Morissette
INSERT INTO profiles (id, email, role) 
VALUES ('e8272b67-3d9d-4550-976b-f4e74663d71f', 'david.morissette@loftsdesarts.ca', 'ADMIN')
ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  role = EXCLUDED.role; 