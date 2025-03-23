
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserLoanApplications, updateApplicationStatus } from '@/utils/supabaseUtils';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDateTime, getStatusColorClass } from '@/utils/formatters';
import { toast } from 'sonner';
import { LockIcon, UnlockIcon } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [adminMode, setAdminMode] = useState(false);
  
  const { 
    data: applications = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['userApplications', user?.id],
    queryFn: getUserLoanApplications,
    enabled: !!user,
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load your applications');
      console.error('Error fetching applications:', error);
    }
  }, [error]);

  const handleStatusChange = async (applicationId: string, newStatus: 'Pending' | 'Approved' | 'Rejected') => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      toast.success(`Application status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      toast.error('Failed to update application status');
      console.error('Error updating status:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <PageContainer 
          title="My Applications" 
          subtitle="View and track all your loan applications"
          action={
            <Button 
              variant="outline" 
              onClick={() => setAdminMode(!adminMode)}
              className="flex items-center gap-2"
              size="icon"
            >
              {adminMode ? <LockIcon size={16} /> : <UnlockIcon size={16} />}
            </Button>
          }
        >
          {isLoading ? (
            <Card className="p-6 text-center">
              <p>Loading your applications...</p>
            </Card>
          ) : applications.length > 0 ? (
            <div className="rounded-lg shadow overflow-hidden animate-fadeIn">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    {adminMode && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.application_id}>
                      <TableCell className="font-medium">{app.application_id}</TableCell>
                      <TableCell>{formatCurrency(app.loan_amount)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColorClass(app.status)}`}>
                          {app.status}
                        </span>
                      </TableCell>
                      <TableCell>{formatDateTime(app.created_at)}</TableCell>
                      {adminMode && (
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant={app.status === 'Approved' ? 'default' : 'outline'} 
                              className="text-xs h-8"
                              onClick={() => handleStatusChange(app.application_id, 'Approved')}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant={app.status === 'Rejected' ? 'destructive' : 'outline'} 
                              className="text-xs h-8"
                              onClick={() => handleStatusChange(app.application_id, 'Rejected')}
                            >
                              Reject
                            </Button>
                            <Button 
                              size="sm" 
                              variant={app.status === 'Pending' ? 'secondary' : 'outline'} 
                              className="text-xs h-8"
                              onClick={() => handleStatusChange(app.application_id, 'Pending')}
                            >
                              Pending
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card className="py-12 px-6 text-center shadow-soft">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No applications found</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                You haven't submitted any loan applications yet.
              </p>
              <Button className="mt-4" onClick={() => window.location.href = '/apply'}>
                Apply for a Loan
              </Button>
            </Card>
          )}
        </PageContainer>
      </div>
    </>
  );
};

export default Profile;
