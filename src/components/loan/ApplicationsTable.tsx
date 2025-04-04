
import { useEffect, useState } from 'react';
import { LockIcon, UnlockIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getApplicationsByCustomer, updateApplicationStatus } from '@/utils/storageUtils';
import { formatCurrency, formatDateTime, getStatusColorClass } from '@/utils/formatters';
import { LoanApplication, LoanStatus } from '@/lib/supabase';

interface ApplicationTableProps {
  applications?: LoanApplication[];
  loading?: boolean;
  updateApplicationStatus?: (id: string, newStatus: LoanStatus, reason?: string) => void;
}

const ApplicationsTable = ({ 
  applications: externalApplications, 
  loading: externalLoading,
  updateApplicationStatus: externalUpdateStatus 
}: ApplicationTableProps = {}) => {
  const [customerName, setCustomerName] = useState('');
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  // Use external applications if provided
  useEffect(() => {
    if (externalApplications) {
      setApplications(externalApplications);
      setSearchPerformed(true);
    }
  }, [externalApplications]);

  const handleSearch = () => {
    if (!customerName.trim()) return;
    
    setIsLoading(true);
    setSearchPerformed(true);
    
    try {
      const results = getApplicationsByCustomer(customerName);
      setApplications(results);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (applicationId: string, newStatus: LoanStatus) => {
    if (externalUpdateStatus) {
      externalUpdateStatus(applicationId, newStatus);
    } else {
      updateApplicationStatus(applicationId, newStatus);
      
      // Update local state without refetching
      setApplications(prevApps => 
        prevApps.map(app => 
          app.applicationId === applicationId ? { ...app, status: newStatus } : app
        )
      );
    }
  };

  // Determine if it's loading from props or local state
  const loading = externalLoading !== undefined ? externalLoading : isLoading;

  return (
    <div className="space-y-6">
      {!externalApplications && (
        <Card className="p-6 shadow-soft">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2 w-full">
              <label htmlFor="customerName" className="text-sm font-medium">
                Customer Name
              </label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name to find your applications"
                className="w-full"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading || !customerName.trim()}>
              {loading ? 'Searching...' : 'Find Applications'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setAdminMode(!adminMode)}
              className="flex items-center gap-2"
              size="icon"
            >
              {adminMode ? <LockIcon size={16} /> : <UnlockIcon size={16} />}
            </Button>
          </div>
        </Card>
      )}

      {searchPerformed && (
        <div className="animate-fadeIn">
          {applications.length > 0 ? (
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Application ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Loan Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created At
                    </th>
                    {(adminMode || externalUpdateStatus) && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {applications.map((app, index) => (
                    <tr key={app.id || app.applicationId} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {app.application_id || app.applicationId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {formatCurrency(app.loan_amount || app.loanAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColorClass(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {formatDateTime(app.created_at || app.createdAt)}
                      </td>
                      {(adminMode || externalUpdateStatus) && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant={app.status === 'Approved' ? 'default' : 'outline'} 
                              className="text-xs h-8"
                              onClick={() => handleStatusChange(app.id || app.applicationId, 'Approved')}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant={app.status === 'Rejected' ? 'destructive' : 'outline'} 
                              className="text-xs h-8"
                              onClick={() => handleStatusChange(app.id || app.applicationId, 'Rejected')}
                            >
                              Reject
                            </Button>
                            <Button 
                              size="sm" 
                              variant={app.status === 'Pending' ? 'secondary' : 'outline'} 
                              className="text-xs h-8"
                              onClick={() => handleStatusChange(app.id || app.applicationId, 'Pending')}
                            >
                              Pending
                            </Button>
                            <Button 
                              size="sm" 
                              variant={app.status === 'Evidence Required' ? 'warning' : 'outline'} 
                              className="text-xs h-8"
                              onClick={() => handleStatusChange(app.id || app.applicationId, 'Evidence Required')}
                            >
                              Evidence
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Card className="py-12 px-6 text-center shadow-soft">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No applications found</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                No loan applications found {!externalApplications && `for "${customerName}"`}.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationsTable;
