import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ApplicationsTable from '@/components/loan/ApplicationsTable';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Define the LoanStatus type to match the expected status values
type LoanStatus = 'Pending' | 'Approved' | 'Rejected' | 'Evidence Required';

// Define the LoanApplication type
type LoanApplication = {
  id: string;
  created_at: string;
  application_id: string;
  customer_id: string;
  customer_name: string;
  loan_amount: number;
  status: LoanStatus;
  loan_type?: string;
  rejection_reason?: string;
  evidence_required?: string;
};

const Dashboard = () => {
  const [pendingApplications, setPendingApplications] = useState<LoanApplication[]>([]);
  const [allApplications, setAllApplications] = useState<LoanApplication[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [createManagerLoading, setCreateManagerLoading] = useState(false);
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    try {
      console.log("Fetching dashboard data");
      await Promise.all([
        fetchApplications(),
        fetchStatistics()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard data.',
        variant: 'destructive',
      });
    }
  };

  const fetchApplications = async () => {
    setApplicationsLoading(true);
    
    try {
      // Pending applications
      console.log("Fetching pending applications");
      const { data: pendingData, error: pendingError } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('status', 'Pending')
        .order('created_at', { ascending: false });
      
      if (pendingError) {
        throw pendingError;
      }
      
      // All applications
      console.log("Fetching all applications");
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }

      if (pendingData) {
        // Explicitly cast the status field to ensure TypeScript knows it matches LoanStatus type
        const typedPendingData = pendingData.map(app => ({
          ...app,
          status: app.status as LoanStatus
        }));
        setPendingApplications(typedPendingData);
      }

      if (data) {
        // Explicitly cast the status field to ensure TypeScript knows it matches LoanStatus type
        const typedData = data.map(app => ({
          ...app,
          status: app.status as LoanStatus
        }));
        setAllApplications(typedData);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch applications.',
        variant: 'destructive',
      });
    } finally {
      setApplicationsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    setStatisticsLoading(true);
    
    try {
      console.log("Fetching statistics");
      // Get statistics
      const { data, error } = await supabase
        .from('loan_applications')
        .select('status, loan_amount');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        let approved = 0;
        let rejected = 0;
        let pending = 0;
        let totalLoanAmount = 0;
        
        data.forEach(app => {
          if (app.status === 'Approved') approved++;
          if (app.status === 'Rejected') rejected++;
          if (app.status === 'Pending') pending++;
          
          totalLoanAmount += Number(app.loan_amount);
        });
        
        setTotalApproved(approved);
        setTotalRejected(rejected);
        setTotalPending(pending);
        setTotalAmount(totalLoanAmount);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch statistics.',
        variant: 'destructive',
      });
    } finally {
      setStatisticsLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: LoanStatus, reason?: string) => {
    try {
      const updateData: any = { status };
      
      if (reason) {
        if (status === 'Rejected') {
          updateData.rejection_reason = reason;
        } else if (status === 'Evidence Required') {
          updateData.evidence_required = reason;
        }
      }
      
      const { error } = await supabase
        .from('loan_applications')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `Application ${status.toLowerCase()} successfully.`,
      });
      
      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: 'Error',
        description: 'Failed to update application status.',
        variant: 'destructive',
      });
    }
  };

  const createManagerAccount = async () => {
    setCreateManagerLoading(true);
    
    try {
      // Create admin account with predefined credentials
      const email = 'santhureddie@gmail.com';
      const password = 'Santhosh';
      const fullName = 'Admin User';
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Set this user as admin in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', data.user.id);
        
        if (profileError) throw profileError;
        
        toast({
          title: 'Manager Account Created',
          description: 'Manager account has been created successfully. Please sign in.',
        });
        
        // Redirect to login
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error creating manager account:', error);
      toast({
        title: 'Error',
        description: 'Failed to create manager account. It might already exist.',
        variant: 'destructive',
      });
    } finally {
      setCreateManagerLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <PageContainer title="Access Restricted">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Manager Login Required</h1>
            <p className="mb-6">You need manager privileges to access the dashboard.</p>
            
            <Button 
              onClick={createManagerAccount} 
              disabled={createManagerLoading}
              className="w-full"
            >
              {createManagerLoading ? "Creating..." : "Create Manager Account"}
            </Button>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>This will create a manager account with:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Email: santhureddie@gmail.com</li>
                <li>Password: Santhosh</li>
              </ul>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => window.location.href = '/login'} className="w-full">
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Dashboard" subtitle="Manage loan applications and user accounts">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allApplications.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Approved Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApproved}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rejected Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRejected}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Total Loan Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="pending" className="mt-8" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending Applications</TabsTrigger>
          <TabsTrigger value="all">All Applications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <ApplicationsTable
            applications={pendingApplications}
            loading={applicationsLoading}
            updateApplicationStatus={updateApplicationStatus}
          />
        </TabsContent>
        
        <TabsContent value="all">
          <ApplicationsTable
            applications={allApplications}
            loading={applicationsLoading}
            updateApplicationStatus={updateApplicationStatus}
          />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default Dashboard;
