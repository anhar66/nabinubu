-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date DATE NOT NULL,
    asset_type TEXT NOT NULL,
    asset_name TEXT,
    rental_type TEXT,
    route TEXT,
    price NUMERIC NOT NULL,
    fuel_cost NUMERIC DEFAULT 0,
    driver_cost NUMERIC DEFAULT 0,
    trips INTEGER DEFAULT 1,
    days INTEGER DEFAULT 1,
    daily_cash NUMERIC NOT NULL,
    user_id UUID REFERENCES auth.users(id)
);

-- Add RLS policies
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to select their own transactions
CREATE POLICY "Users can view their own transactions" 
    ON public.transactions FOR SELECT 
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow authenticated users to insert their own transactions
CREATE POLICY "Users can insert their own transactions" 
    ON public.transactions FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow authenticated users to update their own transactions
CREATE POLICY "Users can update their own transactions" 
    ON public.transactions FOR UPDATE 
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow authenticated users to delete their own transactions
CREATE POLICY "Users can delete their own transactions" 
    ON public.transactions FOR DELETE 
    USING (auth.uid() = user_id OR user_id IS NULL);
