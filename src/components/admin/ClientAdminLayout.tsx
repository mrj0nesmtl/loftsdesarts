"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import UserAvatar from "@/components/admin/UserAvatar";
import NotificationCenter from "@/components/admin/NotificationCenter";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Footer } from "@/components/layout/Footer";

// Public Site Banner component that can be used across admin pages - 
// REMOVED FROM LAYOUT, KEEPING FOR REFERENCE
export function PublicSiteBanner() {
  return (
    <div className="rounded-lg border bg-card p-4 flex items-center justify-between mb-6 theme-transition">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span className="text-card-foreground font-medium">Lofts des Arts - Site public</span>
      </div>
      <Link 
        href="/"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-secondary text-secondary-foreground px-3 py-1.5 text-sm font-medium hover:bg-secondary/90 transition-colors"
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
        <Image
          src="/lda_logo.png"
          alt="Lofts des Arts"
          width={140}
          height={40}
          className="h-8 w-auto"
          priority
        />
      </Link>
      
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-white hover:text-gray-300 transition-colors" target="_blank">
            Accueil
          </Link>
          <Link href="/a-propos" className="text-white hover:text-gray-300 transition-colors" target="_blank">
            À Propos
          </Link>
          <Link href="/galerie" className="text-white hover:text-gray-300 transition-colors" target="_blank">
            Galerie
          </Link>
          <Link href="/contact" className="text-white hover:text-gray-300 transition-colors" target="_blank">
            Contact
          </Link>
        </nav>
        
        <ThemeToggle />
        
        <Link
          href="/admin"
          className="text-sm font-medium px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition-colors"
        >
          Connexion
        </Link>
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
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
    <div className="min-h-screen flex flex-col bg-background text-foreground theme-transition">
      {/* Public site header */}
      <PublicSiteHeader />
      
      {/* Admin header */}
      <header className="bg-card border-b border-border p-4 flex justify-between items-center theme-transition">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Syndicate Lofts des Arts - Admin</h1>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground hidden sm:inline">{user?.email}</span>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationCenter />
          <UserAvatar />
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <aside className={`${isSidebarExpanded ? 'w-64' : 'w-16'} bg-card overflow-y-auto transition-all duration-300 ease-in-out theme-transition`}>
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
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 