// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uvuseuifznpcfhqrybdp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dXNldWlmem5wY2ZocXJ5YmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NzE0NDAsImV4cCI6MjA1ODE0NzQ0MH0.5y65R21chX_S5geMy0T7eYqqngQyvPpUxpbP7rplOFQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);