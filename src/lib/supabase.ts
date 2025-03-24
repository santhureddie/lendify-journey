
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Get Supabase URL and anon key from the auto-generated client
const supabaseUrl = "https://uvuseuifznpcfhqrybdp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dXNldWlmem5wY2ZocXJ5YmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NzE0NDAsImV4cCI6MjA1ODE0NzQ0MH0.5y65R21chX_S5geMy0T7eYqqngQyvPpUxpbP7rplOFQ";

// Create a single supabase client for the entire app
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage,
    }
  }
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
