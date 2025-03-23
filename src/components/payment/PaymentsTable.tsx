
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getPayments, getApplicationById } from '@/utils/storageUtils';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

interface Payment {
  paymentId: string;
  applicationId: string;
  amount: number;
  paymentDate: string;
}

const PaymentsTable = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customerNames, setCustomerNames] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch all payments
    const allPayments = getPayments();
    setPayments(allPayments);
    
    // Create a map of application IDs to customer names
    const nameMap: Record<string, string> = {};
    allPayments.forEach(payment => {
      if (!nameMap[payment.applicationId]) {
        const app = getApplicationById(payment.applicationId);
        if (app) {
          nameMap[payment.applicationId] = app.customerName;
        } else {
          nameMap[payment.applicationId] = 'Unknown';
        }
      }
    });
    setCustomerNames(nameMap);
  }, [refreshTrigger]);

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
      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Payment ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Application ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Customer Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Payment Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {payments.map((payment, index) => (
            <tr key={payment.paymentId} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {payment.paymentId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {payment.applicationId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {customerNames[payment.applicationId] || 'Unknown'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {formatCurrency(payment.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {formatDateTime(payment.paymentDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTable;
