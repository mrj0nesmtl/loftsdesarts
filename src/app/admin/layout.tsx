"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import NotificationCenter from "@/components/admin/NotificationCenter";
import UserAvatar from "@/components/admin/UserAvatar";

function AdminLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  // Check if this is the login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setIsClient(true);
    
    if (!isLoading && !user && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [user, isLoading, router, isLoginPage]);

  // Show loading state while checking authentication
  if (isLoading || !isClient) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // If user is not logged in and this is not the login page, don't render anything
  // The useEffect above will redirect to login page
  if (!user && !isLoginPage) {
    return null;
  }
  
  // For the login page, just render the children without the admin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For all other admin pages, render the full admin layout with sidebar
  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 text-white">
      <header className="bg-zinc-800 border-b border-zinc-700 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">STTS Admin</h1>
          <span className="text-zinc-400">|</span>
          <span className="text-zinc-400 hidden sm:inline">{user?.email}</span>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationCenter />
          <UserAvatar />
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-zinc-800 overflow-y-auto">
          <AdminNav />
        </aside>
        
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutInner>
        {children}
      </AdminLayoutInner>
    </AuthProvider>
  );
} 