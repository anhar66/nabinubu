-- Create monthly_expenses table
CREATE TABLE IF NOT EXISTS public.monthly_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date DATE NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    staff_salary NUMERIC DEFAULT 0,
    night_guard_salary NUMERIC DEFAULT 0,
    electricity_bill NUMERIC DEFAULT 0,
    water_bill NUMERIC DEFAULT 0,
    internet_bill NUMERIC DEFAULT 0,
    other_expenses NUMERIC DEFAULT 0,
    total_expense NUMERIC NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    UNIQUE(month, year, user_id)
);

-- Add RLS policies
ALTER TABLE public.monthly_expenses ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to select their own monthly expenses
CREATE POLICY "Users can view their own monthly expenses" 
    ON public.monthly_expenses FOR SELECT 
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow authenticated users to insert their own monthly expenses
CREATE POLICY "Users can insert their own monthly expenses" 
    ON public.monthly_expenses FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow authenticated users to update their own monthly expenses
CREATE POLICY "Users can update their own monthly expenses" 
    ON public.monthly_expenses FOR UPDATE 
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow authenticated users to delete their own monthly expenses
CREATE POLICY "Users can delete their own monthly expenses" 
    ON public.monthly_expenses FOR DELETE 
    USING (auth.uid() = user_id OR user_id IS NULL);
