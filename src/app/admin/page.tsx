"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default function AdminRootPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Immediately redirect without waiting for auth to finish loading
    // To solve the double-click issue, we'll directly go to login page 
    // and let that page handle redirection to dashboard if user is already logged in
    router.push('/admin/login');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      <div className="flex space-x-4 mt-4">
        <Button onClick={() => router.push('/admin/messaging?to=resident')}>
          Message a Resident
        </Button>
        <Button onClick={() => router.push('/admin/messaging?to=board')}>
          Message a Board Member
        </Button>
      </div>
    </div>
  );
} 