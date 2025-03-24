
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Check, X, AlertCircle, Search, FileUp } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';

type LoanStatus = "Pending" | "Approved" | "Rejected" | "Evidence Required";

interface LoanApplication {
  id: string;
  application_id: string;
  customer_id: string;
  customer_name: string;
  loan_amount: number;
  status: LoanStatus;
  created_at: string;
  loan_type?: string;
  rejection_reason?: string;
  evidence_required?: string;
}

const Dashboard = () => {
  const { user, isLoading, isAdmin } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const [evidenceRequired, setEvidenceRequired] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isEvidenceDialogOpen, setIsEvidenceDialogOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [createManagerLoading, setCreateManagerLoading] = useState(false);

  const createManagerAccount = async () => {
    try {
      setCreateManagerLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: 'santhureddie@gmail.com',
        password: 'Santhosh',
        options: {
          data: {
            full_name: 'Manager',
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', data.user.id);
          
        if (updateError) throw updateError;
        
        toast({
          title: "Manager account created",
          description: "Login with email: santhureddie@gmail.com and password: Santhosh",
        });
      }
      
      setCreateManagerLoading(false);
    } catch (error) {
      console.error('Error creating manager account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create manager account. It might already exist.",
      });
      setCreateManagerLoading(false);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data, error } = await supabase
          .from('loan_applications')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          // Explicitly cast the status field to ensure TypeScript knows it matches LoanStatus type
          const typedData = data.map(app => ({
            ...app,
            status: app.status as LoanStatus
          }));
          
          setApplications(typedData);
          setFilteredApplications(typedData);
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching loan applications:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load loan applications",
        });
        setIsLoaded(true);
      }
    };

    fetchApplications();
  }, [toast]);

  useEffect(() => {
    let filtered = [...applications];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        app =>
          app.customer_name.toLowerCase().includes(term) ||
          app.application_id.toLowerCase().includes(term)
      );
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  const updateApplicationStatus = async (applicationId: string, status: LoanStatus, additionalData: Record<string, string> = {}) => {
    try {
      const { error } = await supabase
        .from('loan_applications')
        .update({ 
          status, 
          ...additionalData,
          updated_at: new Date().toISOString() 
        })
        .eq('id', applicationId);

      if (error) {
        throw error;
      }

      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.id === applicationId
            ? { ...app, status, ...additionalData }
            : app
        )
      );

      toast({
        title: "Success",
        description: `Application ${status.toLowerCase()}`,
      });
      
      setIsRejectDialogOpen(false);
      setIsEvidenceDialogOpen(false);
      setRejectionReason('');
      setEvidenceRequired('');
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update application status",
      });
    }
  };

  const handleApprove = (application: LoanApplication) => {
    updateApplicationStatus(application.id, "Approved");
  };

  const openRejectDialog = (application: LoanApplication) => {
    setSelectedApplication(application);
    setIsRejectDialogOpen(true);
  };

  const openEvidenceDialog = (application: LoanApplication) => {
    setSelectedApplication(application);
    setIsEvidenceDialogOpen(true);
  };

  const handleReject = () => {
    if (selectedApplication && rejectionReason) {
      updateApplicationStatus(selectedApplication.id, "Rejected", { rejection_reason: rejectionReason });
    }
  };

  const handleRequestEvidence = () => {
    if (selectedApplication && evidenceRequired) {
      updateApplicationStatus(selectedApplication.id, "Evidence Required", { evidence_required: evidenceRequired });
    }
  };

  if (isLoading || !isLoaded) {
    return (
      <PageContainer title="Dashboard">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </PageContainer>
    );
  }

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
    <PageContainer title="Loan Applications Dashboard">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Loan Applications Dashboard</h1>
        
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or application ID..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Evidence Required">Evidence Required</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Table>
          <TableCaption>List of loan applications</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Application ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Loan Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.application_id}</TableCell>
                  <TableCell>{application.customer_name}</TableCell>
                  <TableCell>{formatCurrency(application.loan_amount)}</TableCell>
                  <TableCell>{application.loan_type || "Personal"}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${application.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                      application.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                      application.status === 'Evidence Required' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                      {application.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(application.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {application.status === 'Pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleApprove(application)}
                          >
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0" 
                            onClick={() => openRejectDialog(application)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Reject</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0" 
                            onClick={() => openEvidenceDialog(application)}
                          >
                            <FileUp className="h-4 w-4 text-amber-500" />
                            <span className="sr-only">Request Evidence</span>
                          </Button>
                        </>
                      )}
                      {application.status === 'Evidence Required' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleApprove(application)}
                          >
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0" 
                            onClick={() => openRejectDialog(application)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Loan Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason}>
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEvidenceDialogOpen} onOpenChange={setIsEvidenceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Additional Evidence</DialogTitle>
            <DialogDescription>
              Specify what additional evidence is required from the applicant.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="evidence-required">Required Evidence</Label>
              <Textarea
                id="evidence-required"
                placeholder="Enter the evidence that is required..."
                value={evidenceRequired}
                onChange={(e) => setEvidenceRequired(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEvidenceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestEvidence} disabled={!evidenceRequired}>
              Request Evidence
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Dashboard;
