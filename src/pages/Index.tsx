
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, CreditCard, FileText, User } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';

const Index = () => {
  const features = [
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: 'Easy Application',
      description: 'Apply for a loan in minutes with our streamlined application process.'
    },
    {
      icon: <User className="h-6 w-6 text-primary" />,
      title: 'Application Tracking',
      description: 'Track your loan applications status in real-time.'
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: 'Flexible Payments',
      description: 'Log payments on your schedule and track your payment history.'
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: 'Status Updates',
      description: 'Get real-time status updates on your loan applications.'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-background z-0" />
          <PageContainer title="" className="relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="space-y-4 mb-8 animate-slideDown">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="text-primary">LoanFlex</span> Management System
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400">
                  Simple, transparent, and efficient loan management
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-slideUp">
                <Button asChild size="lg" className="text-base px-8">
                  <Link to="/apply">Apply for a Loan</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8">
                  <Link to="/profile">View My Applications</Link>
                </Button>
              </div>
            </div>
          </PageContainer>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-secondary">
          <PageContainer title="Features" subtitle="Everything you need to manage your loans" className="animate-fadeIn">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="glass-card overflow-hidden transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageContainer>
        </section>
        
        {/* Getting Started Section */}
        <section className="py-16">
          <PageContainer title="How It Works" subtitle="Getting started is easy" className="animate-fadeIn">
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mb-4 relative">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Apply for a Loan</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Fill out our simple application form with your information and desired loan amount.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Track Your Application</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  View the status of your application in your profile dashboard.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Make Payments</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Once approved, log payments through our payments portal.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-12">
              <Button asChild size="lg" className="text-base px-8">
                <Link to="/apply">Get Started</Link>
              </Button>
            </div>
          </PageContainer>
        </section>
      </div>
    </>
  );
};

export default Index;
