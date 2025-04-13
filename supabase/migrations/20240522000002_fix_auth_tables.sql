-- Pastikan tabel users sudah ada
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktifkan RLS untuk tabel users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Buat kebijakan akses untuk tabel users
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Tambahkan kebijakan untuk admin melihat semua data
DROP POLICY IF EXISTS "Admin can view all data" ON public.users;
CREATE POLICY "Admin can view all data"
  ON public.users
  FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.users WHERE username = 'admin'));
