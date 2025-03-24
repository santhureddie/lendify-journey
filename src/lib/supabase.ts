
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if required environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  
  // Show an error toast
  if (typeof window !== 'undefined') {
    toast.error('Supabase configuration missing. Please set environment variables.', {
      description: 'The app needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to be set.',
      duration: 10000,
    });
  }
}

// Create a single supabase client for the entire app
// Using placeholder values for development if env vars are not set
// In production, this would throw an error if the values are not set
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

// Database types
export type Profile = {
  id: string;
  created_at: string;
  updated_at?: string;
  email: string;
  full_name: string;
  role?: string;
}

export type LoanApplication = {
  id: string;
  created_at: string;
  customer_id: string;
  customer_name: string;
  loan_amount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Evidence Required';
  application_id: string;
  loan_type?: string;
  rejection_reason?: string;
  evidence_required?: string;
}

export type Payment = {
  id: string;
  created_at: string;
  application_id: string;
  amount: number;
  payment_id: string;
  customer_id: string;
}
