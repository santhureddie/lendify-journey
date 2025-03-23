
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
import { getUserLoanApplications } from '@/utils/supabaseUtils';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDateTime, getStatusColorClass } from '@/utils/formatters';
import { toast } from 'sonner';
import { LockIcon } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);
  
  const { 
    data: applications = [], 
    isLoading, 
    error
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

  const toggleApplicationDetails = (applicationId: string) => {
    if (expandedApplication === applicationId) {
      setExpandedApplication(null);
    } else {
      setExpandedApplication(applicationId);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <PageContainer 
          title="My Applications" 
          subtitle="View and track all your loan applications"
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <React.Fragment key={app.application_id}>
                      <TableRow onClick={() => toggleApplicationDetails(app.application_id)} className="cursor-pointer hover:bg-gray-50">
                        <TableCell className="font-medium">{app.application_id}</TableCell>
                        <TableCell>{formatCurrency(app.loan_amount)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColorClass(app.status)}`}>
                            {app.status}
                          </span>
                        </TableCell>
                        <TableCell>{formatDateTime(app.created_at)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            toggleApplicationDetails(app.application_id);
                          }}>
                            {expandedApplication === app.application_id ? "Hide Details" : "View Details"}
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      {expandedApplication === app.application_id && (
                        <TableRow className="bg-gray-50/50">
                          <TableCell colSpan={5} className="p-4">
                            <div className="rounded-lg bg-white p-4 shadow-inner border border-gray-100">
                              <h4 className="font-semibold mb-2">Application Details</h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-500">Loan Type</p>
                                  <p>{app.loan_type || "Personal"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Customer Name</p>
                                  <p>{app.customer_name}</p>
                                </div>
                              </div>
                              
                              {app.status === 'Rejected' && app.rejection_reason && (
                                <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-100">
                                  <h5 className="text-sm font-medium text-red-800 mb-1">Reason for Rejection</h5>
                                  <p className="text-sm text-red-700">{app.rejection_reason}</p>
                                </div>
                              )}
                              
                              {app.status === 'Evidence Required' && app.evidence_required && (
                                <div className="mt-4 p-3 bg-yellow-50 rounded-md border border-yellow-100">
                                  <h5 className="text-sm font-medium text-yellow-800 mb-1">Evidence Required</h5>
                                  <p className="text-sm text-yellow-700">{app.evidence_required}</p>
                                  
                                  <div className="mt-3">
                                    <Button size="sm" variant="outline">
                                      Upload Evidence
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              <div className="mt-4 border-t pt-4 flex justify-between items-center">
                                <p className="text-sm text-gray-500">
                                  <span className="inline-flex items-center gap-1">
                                    <LockIcon className="h-3 w-3" />
                                    Only managers can change application status
                                  </span>
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
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
