
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { getApplicationIds, getApplicationById, submitPayment } from '@/utils/supabaseUtils';
import { validatePaymentAmount, validateApplicationId } from '@/utils/validators';
import { formatCurrency } from '@/utils/formatters';
import { useQuery } from '@tanstack/react-query';

const PaymentForm = ({ onPaymentAdded }: { onPaymentAdded: () => void }) => {
  const [applicationId, setApplicationId] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({
    applicationId: '',
    amount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState<{ customer_name: string; loan_amount: number } | null>(null);

  // Get application IDs
  const { data: applicationIds = [] } = useQuery({
    queryKey: ['applicationIds'],
    queryFn: getApplicationIds
  });

  // Fetch application details when ID changes
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      if (applicationId) {
        const app = await getApplicationById(applicationId);
        if (app) {
          setApplicationDetail({
            customer_name: app.customer_name,
            loan_amount: app.loan_amount
          });
        } else {
          setApplicationDetail(null);
        }
      } else {
        setApplicationDetail(null);
      }
    };

    fetchApplicationDetails();
  }, [applicationId]);

  const validateForm = () => {
    const newErrors = {
      applicationId: '',
      amount: ''
    };
    
    let isValid = true;
    
    if (!validateApplicationId(applicationId)) {
      newErrors.applicationId = 'Please select an application';
      isValid = false;
    }
    
    const paymentAmount = parseFloat(amount);
    if (!validatePaymentAmount(paymentAmount)) {
      newErrors.amount = 'Payment amount must be greater than 0';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit payment to Supabase
      const newPayment = await submitPayment(
        applicationId,
        parseFloat(amount)
      );
      
      // Show success message
      toast.success('Payment logged successfully!', {
        description: `Payment ID: ${newPayment.payment_id}`
      });
      
      // Reset form
      setApplicationId('');
      setAmount('');
      setErrors({
        applicationId: '',
        amount: ''
      });
      
      // Trigger refresh of payment list
      onPaymentAdded();
    } catch (error) {
      toast.error('An error occurred while logging your payment');
      console.error('Error saving payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 shadow-soft">
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Log a Payment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="applicationId">Application ID</Label>
          <Select
            value={applicationId}
            onValueChange={setApplicationId}
          >
            <SelectTrigger className={`w-full ${errors.applicationId ? 'border-red-300' : ''}`}>
              <SelectValue placeholder="Select an application" />
            </SelectTrigger>
            <SelectContent>
              {applicationIds.length > 0 ? (
                applicationIds.map((id) => (
                  <SelectItem key={id} value={id}>
                    {id}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No applications available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.applicationId && (
            <p className="text-sm text-red-500">{errors.applicationId}</p>
          )}
          
          {applicationDetail && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
              <p><span className="font-medium">Customer:</span> {applicationDetail.customer_name}</p>
              <p><span className="font-medium">Loan Amount:</span> {formatCurrency(applicationDetail.loan_amount)}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Payment Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter payment amount"
            min="1"
            step="0.01"
            className={errors.amount ? 'border-red-300' : ''}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || applicationIds.length === 0}
        >
          {isSubmitting ? 'Logging Payment...' : 'Log Payment'}
        </Button>
      </form>
    </Card>
  );
};

export default PaymentForm;
