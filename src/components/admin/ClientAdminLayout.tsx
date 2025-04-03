"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import UserAvatar from "@/components/admin/UserAvatar";
import NotificationCenter from "@/components/admin/NotificationCenter";
import { useAuth } from "@/lib/auth";

export default function ClientAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  
  useEffect(() => {
    // Protect admin routes - redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isLoading, router]);
  
  // Loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  
  // Special case for login page - no layout needed
  if (typeof window !== 'undefined' && window.location.pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // If not authenticated and not on login page, show nothing until redirect happens
  if (!user) {
    return null;
  }
  
  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // For all other admin pages, render the full admin layout with sidebar
  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 text-white">
      <header className="bg-zinc-800 border-b border-zinc-700 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Syndicate Lofts des Arts - Admin</h1>
          <span className="text-zinc-400">|</span>
          <span className="text-zinc-400 hidden sm:inline">{user?.email}</span>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationCenter />
          <UserAvatar />
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <aside className={`${isSidebarExpanded ? 'w-64' : 'w-16'} bg-zinc-800 overflow-y-auto transition-all duration-300 ease-in-out`}>
          <AdminNav 
            isExpanded={isSidebarExpanded} 
            onToggle={toggleSidebar} 
            signOut={signOut}
          />
        </aside>
        
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 