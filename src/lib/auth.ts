'use client';

import { User, createClient } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, ReactNode, createElement } from 'react';
import { useRouter } from 'next/navigation';

// Initialize the Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean; // Alias for loading, for compatibility
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

// Create the authentication context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
});

// AuthProvider component to wrap our app with auth functionality
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in function that uses Supabase auth
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        router.push("/admin/dashboard");
        router.refresh();
      }

      return { error: error as Error | null };
    } catch (error) {
      console.error("Error signing in:", error);
      return { error: error as Error };
    }
  };

  // Sign out function with hard refresh to clear state
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Force a hard page refresh to clear any cached state
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Error signing out:', error);
      router.push('/admin/login');
    }
  };

  // Create the context value
  const contextValue = {
    user,
    loading,
    isLoading: loading,
    signIn,
    signOut
  };

  // Use createElement instead of JSX
  return createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
}

// Hook to use auth context in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Server-side auth function to get the session
export async function auth() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Auth error:', error.message);
    return null;
  }
  
  return session;
}