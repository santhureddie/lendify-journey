
interface LoanApplication {
  applicationId: string;
  customerName: string;
  loanAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

interface Payment {
  paymentId: string;
  applicationId: string;
  amount: number;
  paymentDate: string;
}

// Generate random ID
export const generateId = (prefix: string): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `${prefix}-${result}`;
};

// Get all loan applications
export const getLoanApplications = (): LoanApplication[] => {
  const applications = localStorage.getItem('loanApplications');
  return applications ? JSON.parse(applications) : [];
};

// Save loan application
export const saveLoanApplication = (application: Omit<LoanApplication, 'applicationId' | 'createdAt' | 'status'>): LoanApplication => {
  const applications = getLoanApplications();
  
  const newApplication: LoanApplication = {
    ...application,
    applicationId: generateId('APP'),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  
  applications.push(newApplication);
  localStorage.setItem('loanApplications', JSON.stringify(applications));
  
  return newApplication;
};

// Get applications by customer name
export const getApplicationsByCustomer = (customerName: string): LoanApplication[] => {
  const applications = getLoanApplications();
  return applications.filter(app => 
    app.customerName.toLowerCase() === customerName.toLowerCase()
  );
};

// Get application by ID
export const getApplicationById = (applicationId: string): LoanApplication | undefined => {
  const applications = getLoanApplications();
  return applications.find(app => app.applicationId === applicationId);
};

// Update application status
export const updateApplicationStatus = (
  applicationId: string, 
  status: 'Pending' | 'Approved' | 'Rejected'
): boolean => {
  const applications = getLoanApplications();
  const index = applications.findIndex(app => app.applicationId === applicationId);
  
  if (index !== -1) {
    applications[index].status = status;
    localStorage.setItem('loanApplications', JSON.stringify(applications));
    return true;
  }
  
  return false;
};

// Get all payments
export const getPayments = (): Payment[] => {
  const payments = localStorage.getItem('payments');
  return payments ? JSON.parse(payments) : [];
};

// Save payment
export const savePayment = (payment: Omit<Payment, 'paymentId' | 'paymentDate'>): Payment => {
  const payments = getPayments();
  
  const newPayment: Payment = {
    ...payment,
    paymentId: generateId('PAY'),
    paymentDate: new Date().toISOString()
  };
  
  payments.push(newPayment);
  localStorage.setItem('payments', JSON.stringify(payments));
  
  return newPayment;
};

// Get payments by application ID
export const getPaymentsByApplication = (applicationId: string): Payment[] => {
  const payments = getPayments();
  return payments.filter(payment => payment.applicationId === applicationId);
};

// Get all application IDs for dropdown
export const getApplicationIds = (): string[] => {
  return getLoanApplications().map(app => app.applicationId);
};

// Clear all data (for testing)
export const clearAllData = (): void => {
  localStorage.removeItem('loanApplications');
  localStorage.removeItem('payments');
};
