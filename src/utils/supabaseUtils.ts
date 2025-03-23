
import { supabase } from '@/integrations/supabase/client';
import { generateId } from '@/utils/storageUtils';
import { toast } from 'sonner';

// Get all loan applications for the current user
export async function getUserLoanApplications() {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('loan_applications')
      .select('*')
      .eq('customer_id', user.user.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching loan applications:', error);
    toast.error('Failed to load loan applications');
    return [];
  }
}

// Get applications by customer name (for admin use)
export async function getApplicationsByCustomerName(customerName: string) {
  try {
    const { data, error } = await supabase
      .from('loan_applications')
      .select('*')
      .ilike('customer_name', `%${customerName}%`)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching loan applications:', error);
    toast.error('Failed to search loan applications');
    return [];
  }
}

// Submit a new loan application
export async function submitLoanApplication(customerName: string, loanAmount: number) {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');
    
    const applicationId = generateId('APP');
    
    const { data, error } = await supabase
      .from('loan_applications')
      .insert({
        application_id: applicationId,
        customer_id: user.user.id,
        customer_name: customerName,
        loan_amount: loanAmount,
        status: 'Pending'
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting loan application:', error);
    toast.error('Failed to submit loan application');
    throw error;
  }
}

// Get application by ID
export async function getApplicationById(applicationId: string) {
  try {
    const { data, error } = await supabase
      .from('loan_applications')
      .select('*')
      .eq('application_id', applicationId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching application details:', error);
    return null;
  }
}

// Update application status (admin only)
export async function updateApplicationStatus(
  applicationId: string, 
  status: 'Pending' | 'Approved' | 'Rejected'
) {
  try {
    const { error } = await supabase
      .from('loan_applications')
      .update({ status })
      .eq('application_id', applicationId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating application status:', error);
    toast.error('Failed to update application status');
    return false;
  }
}

// Get all application IDs for dropdown (only those belonging to current user)
export async function getApplicationIds() {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('loan_applications')
      .select('application_id')
      .eq('customer_id', user.user.id);
      
    if (error) throw error;
    return data.map(app => app.application_id) || [];
  } catch (error) {
    console.error('Error fetching application IDs:', error);
    return [];
  }
}

// Get all payments
export async function getPayments() {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('customer_id', user.user.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching payments:', error);
    toast.error('Failed to load payments');
    return [];
  }
}

// Submit a new payment
export async function submitPayment(applicationId: string, amount: number) {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');
    
    const paymentId = generateId('PAY');
    
    // Verify that this application belongs to the current user
    const { data: appData, error: appError } = await supabase
      .from('loan_applications')
      .select('customer_id')
      .eq('application_id', applicationId)
      .single();
      
    if (appError) throw appError;
    
    if (appData.customer_id !== user.user.id) {
      throw new Error('You do not have permission to make payments on this application');
    }
    
    const { data, error } = await supabase
      .from('payments')
      .insert({
        payment_id: paymentId,
        application_id: applicationId,
        amount: amount,
        customer_id: user.user.id
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting payment:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to submit payment');
    throw error;
  }
}

// Get user profile information
export async function getUserProfile() {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
