
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  FileQuestion, 
  RefreshCw, 
  Search, 
  ArrowUpDown, 
  FilterX 
} from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Textarea } from '@/components/ui/textarea';
import { 
  getAllLoanApplications, 
  updateApplicationStatus, 
  searchLoanApplications 
} from '@/utils/supabaseUtils';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

// Define application interface
interface LoanApplication {
  id: string;
  application_id: string;
  customer_name: string;
  loan_amount: number;
  loan_type?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Evidence Required';
  created_at: string;
  rejection_reason?: string;
  evidence_request?: string;
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  
  switch (status) {
    case 'Approved':
      variant = 'default';
      break;
    case 'Pending':
      variant = 'secondary';
      break;
    case 'Rejected':
      variant = 'destructive';
      break;
    case 'Evidence Required':
      variant = 'outline';
      break;
  }
  
  return <Badge variant={variant}>{status}</Badge>;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAuth();
  
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<'created_at' | 'loan_amount'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [evidenceRequest, setEvidenceRequest] = useState('');
  
  // Check if user is admin, otherwise redirect
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast.error("Access denied. Administrator privileges required.");
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);
  
  // Fetch applications
  const fetchApplications = async () => {
    if (!isAdmin) return;
    
    setIsLoadingData(true);
    try {
      if (searchTerm) {
        const results = await searchLoanApplications(searchTerm);
        setApplications(results);
        setTotalCount(results.length);
        setTotalPages(1);
      } else {
        const result = await getAllLoanApplications(
          currentPage, 
          pageSize, 
          statusFilter, 
          sortBy, 
          sortOrder
        );
        setApplications(result.data);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoadingData(false);
    }
  };
  
  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchApplications();
  };
  
  // Clear filters
  const clearFilters = () => {
    setStatusFilter(undefined);
    setSortBy('created_at');
    setSortOrder('desc');
    setSearchTerm('');
    setCurrentPage(1);
  };
  
  // Handle status update
  const handleApprove = async (application: LoanApplication) => {
    try {
      const success = await updateApplicationStatus(application.application_id, 'Approved');
      if (success) {
        toast.success(`Application ${application.application_id} approved`);
        fetchApplications();
      }
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Failed to approve application');
    }
  };
  
  const handleOpenRejectDialog = (application: LoanApplication) => {
    setSelectedApplication(application);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };
  
  const handleReject = async () => {
    if (!selectedApplication || !rejectionReason.trim()) return;
    
    try {
      const success = await updateApplicationStatus(
        selectedApplication.application_id, 
        'Rejected', 
        rejectionReason
      );
      
      if (success) {
        toast.success(`Application ${selectedApplication.application_id} rejected`);
        setRejectDialogOpen(false);
        fetchApplications();
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    }
  };
  
  const handleOpenEvidenceDialog = (application: LoanApplication) => {
    setSelectedApplication(application);
    setEvidenceRequest('');
    setEvidenceDialogOpen(true);
  };
  
  const handleRequestEvidence = async () => {
    if (!selectedApplication || !evidenceRequest.trim()) return;
    
    try {
      const success = await updateApplicationStatus(
        selectedApplication.application_id, 
        'Evidence Required', 
        undefined, 
        evidenceRequest
      );
      
      if (success) {
        toast.success(`Evidence requested for application ${selectedApplication.application_id}`);
        setEvidenceDialogOpen(false);
        fetchApplications();
      }
    } catch (error) {
      console.error('Error requesting evidence:', error);
      toast.error('Failed to request evidence');
    }
  };
  
  // Fetch applications on initial load and when filters change
  useEffect(() => {
    if (isAdmin) {
      fetchApplications();
    }
  }, [isAdmin, currentPage, pageSize, statusFilter, sortBy, sortOrder]);
  
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="animate-spin h-8 w-8 text-primary" />
        </div>
      </PageContainer>
    );
  }
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Loan Application Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and review loan applications. Approve, reject, or request additional evidence.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name or application ID"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-[180px]">
                <Select value={statusFilter || ''} onValueChange={(value) => setStatusFilter(value || undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Evidence Required">Evidence Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-[180px]">
                <Select 
                  value={`${sortBy}-${sortOrder}`} 
                  onValueChange={(value) => {
                    const [field, order] = value.split('-') as ['created_at' | 'loan_amount', 'asc' | 'desc'];
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at-desc">Newest First</SelectItem>
                    <SelectItem value="created_at-asc">Oldest First</SelectItem>
                    <SelectItem value="loan_amount-desc">Amount (High to Low)</SelectItem>
                    <SelectItem value="loan_amount-asc">Amount (Low to High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSearch} disabled={isLoadingData}>
                  Search
                </Button>
                <Button variant="outline" onClick={clearFilters} disabled={isLoadingData}>
                  <FilterX className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-0">
            <div className="relative min-h-[300px]">
              {isLoadingData ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw className="animate-spin h-8 w-8 text-primary" />
                </div>
              ) : applications.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Loan Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.application_id}>
                          <TableCell className="font-medium">{app.application_id}</TableCell>
                          <TableCell>{app.customer_name}</TableCell>
                          <TableCell>{formatCurrency(app.loan_amount)}</TableCell>
                          <TableCell>
                            <StatusBadge status={app.status} />
                          </TableCell>
                          <TableCell>{formatDateTime(app.created_at)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="default" 
                                onClick={() => handleApprove(app)}
                                disabled={app.status === 'Approved'}
                                title="Approve Application"
                                className="h-8 w-8"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleOpenRejectDialog(app)}
                                disabled={app.status === 'Rejected'}
                                title="Reject Application"
                                className="h-8 w-8"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleOpenEvidenceDialog(app)}
                                disabled={app.status === 'Evidence Required'}
                                title="Request Additional Evidence"
                                className="h-8 w-8"
                              >
                                <FileQuestion className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-lg font-medium text-muted-foreground">No applications found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchTerm 
                      ? `No results match "${searchTerm}". Try a different search.` 
                      : 'Try clearing filters or adding new applications.'}
                  </p>
                </div>
              )}
            </div>
            
            {totalPages > 1 && (
              <div className="py-4 border-t">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        aria-disabled={currentPage === 1}
                        tabIndex={currentPage === 1 ? -1 : 0}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        const isFirstPage = page === 1;
                        const isLastPage = page === totalPages;
                        const isCurrentPageAdjacent = Math.abs(page - currentPage) <= 1;
                        return isFirstPage || isLastPage || isCurrentPageAdjacent;
                      })
                      .map((page, i, array) => {
                        // Show ellipsis if pages are skipped
                        if (i > 0 && page > array[i - 1] + 1) {
                          return (
                            <PaginationItem key={`ellipsis-${page}`}>
                              <div className="flex h-9 w-9 items-center justify-center">...</div>
                            </PaginationItem>
                          );
                        }
                        
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={currentPage === page}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        aria-disabled={currentPage === totalPages}
                        tabIndex={currentPage === totalPages ? -1 : 0}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="text-sm text-muted-foreground">
          {totalCount > 0 && (
            <p>Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} applications</p>
          )}
        </div>
      </div>
      
      {/* Reject Application Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting application {selectedApplication?.application_id}.
              This reason will be shared with the applicant.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject} 
              disabled={!rejectionReason.trim()}
            >
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Request Evidence Dialog */}
      <Dialog open={evidenceDialogOpen} onOpenChange={setEvidenceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Additional Evidence</DialogTitle>
            <DialogDescription>
              Specify what additional documents or information is needed for application {selectedApplication?.application_id}.
              This request will be shared with the applicant.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Please describe the evidence required..."
              value={evidenceRequest}
              onChange={(e) => setEvidenceRequest(e.target.value)}
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEvidenceDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRequestEvidence} 
              disabled={!evidenceRequest.trim()}
            >
              Request Evidence
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Dashboard;
