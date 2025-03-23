
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { submitLoanApplication } from '@/utils/supabaseUtils';
import { useAuth } from '@/contexts/AuthContext';
import { validateName, validateLoanAmount } from '@/utils/validators';

const ApplicationForm = () => {
  const { user } = useAuth();
  const [customerName, setCustomerName] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [errors, setErrors] = useState({
    customerName: '',
    loanAmount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {
      customerName: '',
      loanAmount: ''
    };
    
    let isValid = true;
    
    if (!validateName(customerName)) {
      newErrors.customerName = 'Customer name must be at least 2 characters';
      isValid = false;
    }
    
    const amount = parseFloat(loanAmount);
    if (!validateLoanAmount(amount)) {
      newErrors.loanAmount = 'Loan amount must be between $100 and $100,000';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to submit a loan application');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit application to Supabase
      const newApplication = await submitLoanApplication(
        customerName,
        parseFloat(loanAmount)
      );
      
      // Show success message
      toast.success('Loan application submitted successfully!', {
        description: `Application ID: ${newApplication.application_id}`
      });
      
      // Reset form
      setCustomerName('');
      setLoanAmount('');
      setErrors({
        customerName: '',
        loanAmount: ''
      });
    } catch (error) {
      toast.error('An error occurred while submitting your application');
      console.error('Error saving application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 shadow-soft">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter your full name"
            className={errors.customerName ? 'border-red-300 focus:border-red-300' : ''}
          />
          {errors.customerName && (
            <p className="text-sm text-red-500">{errors.customerName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="loanAmount">Loan Amount ($)</Label>
          <Input
            id="loanAmount"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter amount between $100 - $100,000"
            min="100"
            max="100000"
            step="100"
            className={errors.loanAmount ? 'border-red-300 focus:border-red-300' : ''}
          />
          {errors.loanAmount && (
            <p className="text-sm text-red-500">{errors.loanAmount}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </Card>
  );
};

export default ApplicationForm;
