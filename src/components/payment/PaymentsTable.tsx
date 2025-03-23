
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { getPayments, getApplicationById } from '@/utils/supabaseUtils';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PaymentsTable = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const { 
    data: payments = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['payments', refreshTrigger],
    queryFn: getPayments
  });

  // Re-fetch when the refresh trigger changes
  useEffect(() => {
    refetch();
  }, [refreshTrigger, refetch]);

  if (isLoading) {
    return (
      <Card className="py-6 px-4 text-center">
        <p>Loading payments...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="py-6 px-4 text-center text-red-500">
        <p>Error loading payments</p>
      </Card>
    );
  }

  if (payments.length === 0) {
    return (
      <Card className="py-12 px-6 text-center shadow-soft">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No payments found</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          No payment records available. Use the form above to log a payment.
        </p>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow animate-fadeIn">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment ID</TableHead>
            <TableHead>Application ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment, index) => (
            <TableRow key={payment.payment_id} className={index % 2 === 0 ? '' : 'bg-muted/50'}>
              <TableCell className="font-medium">{payment.payment_id}</TableCell>
              <TableCell>{payment.application_id}</TableCell>
              <TableCell>{formatCurrency(payment.amount)}</TableCell>
              <TableCell>{formatDateTime(payment.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsTable;
