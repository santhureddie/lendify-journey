
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("Auth provider initialized");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed", event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check if user has admin role
        if (session?.user) {
          await checkUserIsAdmin(session.user.id);
        } else {
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check if user has admin role
      if (session?.user) {
        checkUserIsAdmin(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if the user has an admin role
  const checkUserIsAdmin = async (userId: string) => {
    try {
      console.log("Checking admin status for user", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }
      
      console.log("User role data:", data);
      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("Attempting sign in for:", email);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error);
        toast.error('Failed to sign in', { 
          description: error.message || 'Please check your credentials and try again.' 
        });
        setIsLoading(false);
        return { data: null, error };
      }
      
      console.log("Sign in successful:", data.user?.id);
      // Check admin status after successful sign in
      if (data.user) {
        await checkUserIsAdmin(data.user.id);
      }
      
      setIsLoading(false);
      return { data, error: null };
    } catch (error) {
      console.error("Unexpected sign in error:", error);
      toast.error('Failed to sign in', { 
        description: error.message || 'Please check your credentials and try again.' 
      });
      setIsLoading(false);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log("Attempting sign up for:", email);
    setIsLoading(true);
    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        console.error("Sign up error:", error);
        toast.error('Failed to sign up', { 
          description: error.message || 'Please try again later.' 
        });
        setIsLoading(false);
        return { data: null, error };
      }

      console.log("Sign up successful:", data);
      // If signup was successful, create a profile record
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          email: email,
          full_name: fullName,
        });
        
        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Don't fail completely if profile creation fails
          toast.warning('Account created but profile setup incomplete', {
            description: 'Your account was created but we had trouble setting up your profile.'
          });
        } else {
          toast.success('Account created successfully!', {
            description: 'Please check your email to verify your account.'
          });
        }
      }

      setIsLoading(false);
      return { data, error: null };
    } catch (error) {
      console.error("Unexpected sign up error:", error);
      toast.error('Failed to sign up', { 
        description: error.message || 'Please try again later.' 
      });
      setIsLoading(false);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    console.log("Signing out");
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error('Failed to sign out', {
        description: 'Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    user,
    session,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
