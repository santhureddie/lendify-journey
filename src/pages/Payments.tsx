
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';
import PaymentForm from '@/components/payment/PaymentForm';
import PaymentsTable from '@/components/payment/PaymentsTable';

const Payments = () => {
  const [refreshCounter, setRefreshCounter] = useState(0);

  const handlePaymentAdded = () => {
    setRefreshCounter(prev => prev + 1);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <PageContainer 
          title="Payments" 
          subtitle="Log and view payment history"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <PaymentForm onPaymentAdded={handlePaymentAdded} />
            </div>
            <div className="md:col-span-2 mt-8">
              <h2 className="text-2xl font-bold mb-4">Payment History</h2>
              <PaymentsTable refreshTrigger={refreshCounter} />
            </div>
          </div>
        </PageContainer>
      </div>
    </>
  );
};

export default Payments;
