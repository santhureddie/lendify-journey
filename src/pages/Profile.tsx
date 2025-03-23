
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';
import ApplicationsTable from '@/components/loan/ApplicationsTable';

const Profile = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <PageContainer 
          title="My Applications" 
          subtitle="View and track all your loan applications"
        >
          <ApplicationsTable />
        </PageContainer>
      </div>
    </>
  );
};

export default Profile;
