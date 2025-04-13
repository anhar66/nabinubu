-- Buat pengguna admin default
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'admin@bjt.com', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- Tambahkan password untuk pengguna admin
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'admin@bjt.com', now(), now(), now(), '{"provider":"email"}', '{"provider":"email"}')
ON CONFLICT (id) DO NOTHING;

-- Tambahkan ke tabel users
INSERT INTO public.users (id, username)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'admin')
ON CONFLICT (id) DO NOTHING;
