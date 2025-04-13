-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('car', 'speedboat', 'restaurant')),
  asset_name TEXT NOT NULL,
  rental_type TEXT CHECK (rental_type IN ('drop', 'harian')),
  route TEXT,
  price NUMERIC NOT NULL,
  fuel_cost NUMERIC DEFAULT 0,
  driver_cost NUMERIC DEFAULT 0,
  trips INTEGER DEFAULT 1,
  days INTEGER DEFAULT 1,
  daily_cash NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create monthly_expenses table
CREATE TABLE IF NOT EXISTS monthly_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  month TEXT NOT NULL,
  year TEXT NOT NULL,
  staff_salary NUMERIC DEFAULT 0,
  night_guard_salary NUMERIC DEFAULT 0,
  electricity_bill NUMERIC DEFAULT 0,
  water_bill NUMERIC DEFAULT 0,
  internet_bill NUMERIC DEFAULT 0,
  other_expenses NUMERIC DEFAULT 0,
  total_expense NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table to mirror auth.users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for all tables
alter publication supabase_realtime add table transactions;
alter publication supabase_realtime add table monthly_expenses;
alter publication supabase_realtime add table users;

-- Create RLS policies for transactions
DROP POLICY IF EXISTS "Users can view their own transactions";
CREATE POLICY "Users can view their own transactions"
ON transactions FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own transactions";
CREATE POLICY "Users can insert their own transactions"
ON transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own transactions";
CREATE POLICY "Users can update their own transactions"
ON transactions FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own transactions";
CREATE POLICY "Users can delete their own transactions"
ON transactions FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS policies for monthly_expenses
DROP POLICY IF EXISTS "Users can view their own monthly expenses";
CREATE POLICY "Users can view their own monthly expenses"
ON monthly_expenses FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own monthly expenses";
CREATE POLICY "Users can insert their own monthly expenses"
ON monthly_expenses FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own monthly expenses";
CREATE POLICY "Users can update their own monthly expenses"
ON monthly_expenses FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own monthly expenses";
CREATE POLICY "Users can delete their own monthly expenses"
ON monthly_expenses FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS policies for users
DROP POLICY IF EXISTS "Users can view their own user data";
CREATE POLICY "Users can view their own user data"
ON users FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own user data";
CREATE POLICY "Users can update their own user data"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
