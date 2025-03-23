
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';
import ApplicationForm from '@/components/loan/ApplicationForm';

const ApplyLoan = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <PageContainer 
          title="Apply for a Loan" 
          subtitle="Fill out the form below to submit your loan application"
        >
          <div className="max-w-xl mx-auto">
            <ApplicationForm />
          </div>
        </PageContainer>
      </div>
    </>
  );
};

export default ApplyLoan;
