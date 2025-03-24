
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';

const Index = () => {
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const testDatabaseConnection = async () => {
      try {
        // Try to fetch profiles to test database connection
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email')
          .limit(1);

        if (error) {
          console.error('Database connection test failed:', error);
          setDbStatus('offline');
          toast.error('Database connection failed', {
            description: error.message
          });
        } else {
          console.log('Database connection successful');
          setDbStatus('online');
        }
      } catch (error) {
        console.error('Unexpected error testing database:', error);
        setDbStatus('offline');
        toast.error('Unexpected database error');
      }
    };

    testDatabaseConnection();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Welcome</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl mb-2">Database Status</h2>
          {dbStatus === 'checking' && (
            <p className="text-blue-500">Checking database connection...</p>
          )}
          {dbStatus === 'online' && (
            <p className="text-green-500">Database is online and accessible</p>
          )}
          {dbStatus === 'offline' && (
            <p className="text-red-500">Database connection failed</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
