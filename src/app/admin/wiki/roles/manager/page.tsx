"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagerRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/wiki/roles/property-manager');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
        <p className="text-muted-foreground">
          Taking you to the Property Manager wiki page...
        </p>
      </div>
    </div>
  );
} 