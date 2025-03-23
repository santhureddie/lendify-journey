
import { createClient } from '@supabase/supabase-js';

// Replace these with your own Supabase project URL and anon key
// You'll need to add these in your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Profile = {
  id: string;
  created_at: string;
  email: string;
  full_name: string;
}

export type LoanApplication = {
  id: string;
  created_at: string;
  customer_id: string;
  customer_name: string;
  loan_amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  application_id: string;
}

export type Payment = {
  id: string;
  created_at: string;
  application_id: string;
  amount: number;
  payment_id: string;
  customer_id: string;
}
