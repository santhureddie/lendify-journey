
// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date/time
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

// Format date only
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Get status color class
export const getStatusColorClass = (status: string): string => {
  switch (status) {
    case 'Approved':
      return 'text-green-600 bg-green-100 border-green-200';
    case 'Rejected':
      return 'text-red-600 bg-red-100 border-red-200';
    case 'Pending':
    default:
      return 'text-amber-600 bg-amber-100 border-amber-200';
  }
};
