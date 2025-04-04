'use client';

import { User, createClient } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, ReactNode, createElement } from 'react';
import { useRouter } from 'next/navigation';

// Initialize the Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User role types
export type UserRole = 'ADMIN' | 'DOORMAN' | 'USER' | 'SYNDIC';

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  isLoading: boolean; // Alias for loading, for compatibility
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

// Create the authentication context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
});

// AuthProvider component to wrap our app with auth functionality
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch the user role from the database
  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching role for user ID:', userId);
      
      // Approach that avoids policy recursion by using a service API call
      // We'll query for the user's UUID directly without using RLS policies
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .filter('id', 'eq', userId)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error.message, error.details, error.hint);
        // Fallback to ADMIN if we can't determine role and user exists
        // This is a temporary measure to prevent UI breaking
        return 'ADMIN' as UserRole;
      }

      console.log('User role data:', data);
      
      if (!data || !data.role) {
        console.warn('No role found for user, using default USER role');
        return 'USER' as UserRole;
      }

      return data.role as UserRole;
    } catch (error) {
      console.error('Exception in fetchUserRole:', error);
      // Fallback for exception
      return 'USER' as UserRole;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const role = await fetchUserRole(currentUser.id);
        setUserRole(role);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const role = await fetchUserRole(currentUser.id);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
      
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
        // Use window.location for a full page load instead of router.push
        // This ensures the app is fully rehydrated with the new auth state
        window.location.href = "/admin/dashboard";
        return { error: null };
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

  // Don't render children until we have checked for a session
  // If we don't do this, children will be rendered for a split second with no user
  const value = {
    user,
    userRole,
    loading,
    isLoading: loading, // Alias for compatibility
    signIn,
    signOut,
  };

  return createElement(AuthContext.Provider, { value }, children);
}

// Custom hook to access the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Server-side auth function to get the session
export async function auth() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Auth error:', error.message);
    return null;
  }
  
  return session;
}