"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import UserAvatar from "@/components/admin/UserAvatar";
import NotificationCenter from "@/components/admin/NotificationCenter";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";

// Public Site Banner component that can be used across admin pages
export function PublicSiteBanner() {
  return (
    <div className="rounded-lg bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700 p-4 flex items-center justify-between mb-6">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span className="text-zinc-300 font-medium">Lofts des Arts - Site public</span>
      </div>
      <Link 
        href="/"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-zinc-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-600 transition-colors"
        target="_blank"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
        Ouvrir dans un nouvel onglet
      </Link>
    </div>
  );
}

// Main public site header that matches the public site
function PublicSiteHeader() {
  return (
    <header className="bg-black text-white w-full py-4 px-6 flex justify-between items-center border-b border-zinc-800">
      <Link href="/" className="flex items-center" target="_blank">
        <div className="relative h-10 w-40">
          <Image
            src="/images/logo-light.png"
            alt="Lofts des Arts"
            fill
            style={{ objectFit: 'contain', objectPosition: 'left' }}
            priority
          />
        </div>
      </Link>
      
      <nav className="hidden md:flex items-center gap-8">
        <Link href="/" className="text-white hover:text-gray-300 transition-colors" target="_blank">
          Accueil
        </Link>
        <Link href="/galerie" className="text-white hover:text-gray-300 transition-colors" target="_blank">
          Galerie
        </Link>
        <Link href="/a-propos" className="text-white hover:text-gray-300 transition-colors" target="_blank">
          À Propos
        </Link>
        <Link href="/contact" className="text-white hover:text-gray-300 transition-colors" target="_blank">
          Contact
        </Link>
      </nav>
      
      <div className="flex items-center gap-4">
        <button 
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Toggle theme"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </button>
      </div>
    </header>
  );
}

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
      {/* Public site header */}
      <PublicSiteHeader />
      
      {/* Admin header */}
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