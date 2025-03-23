
// Validate customer name
export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// Validate loan amount
export const validateLoanAmount = (amount: number): boolean => {
  return !isNaN(amount) && amount >= 100 && amount <= 100000;
};

// Validate payment amount
export const validatePaymentAmount = (amount: number): boolean => {
  return !isNaN(amount) && amount > 0;
};

// Validate that application ID exists
export const validateApplicationId = (applicationId: string): boolean => {
  return applicationId !== undefined && applicationId !== '';
};
