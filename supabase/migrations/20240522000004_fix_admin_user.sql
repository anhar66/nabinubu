-- Hapus pengguna admin yang mungkin sudah ada dengan ID yang salah
DELETE FROM auth.users WHERE email = 'admin@bjt.com';
DELETE FROM public.users WHERE username = 'admin';

-- Buat pengguna admin baru dengan email yang benar
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'admin@bjt.com', now(), now(), now(), '{"provider":"email"}', '{"provider":"email"}');

-- Tambahkan ke tabel users
INSERT INTO public.users (id, username)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'admin');
