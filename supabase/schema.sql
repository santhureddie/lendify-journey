
-- Create tables
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL,
  full_name TEXT
);

CREATE TABLE loan_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  application_id TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES auth.users NOT NULL,
  customer_name TEXT NOT NULL,
  loan_amount DECIMAL NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected'))
);

CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_id TEXT NOT NULL UNIQUE,
  application_id TEXT NOT NULL REFERENCES loan_applications(application_id),
  customer_id UUID REFERENCES auth.users NOT NULL,
  amount DECIMAL NOT NULL
);

-- Set up RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Loan Applications: Users can create and view their own applications
CREATE POLICY "Users can create loan applications"
  ON loan_applications FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can view their own loan applications"
  ON loan_applications FOR SELECT
  USING (auth.uid() = customer_id);

-- Admins (with specific roles) can see all applications
CREATE POLICY "Admins can view all loan applications"
  ON loan_applications FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update loan applications"
  ON loan_applications FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Payments: Users can create and view their own payments
CREATE POLICY "Users can create payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid() = customer_id);

-- Create function that creates a profile entry when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_loan_applications_customer_id ON loan_applications(customer_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_app_id ON loan_applications(application_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_app_id ON payments(application_id);
