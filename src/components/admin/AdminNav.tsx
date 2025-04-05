"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserRole } from "@/lib/auth";

interface AdminNavProps {
  isExpanded: boolean;
  onToggle: () => void;
  signOut?: () => Promise<void>;
}

export default function AdminNav({ isExpanded, onToggle, signOut }: AdminNavProps) {
  const pathname = usePathname();
  const { user, userRole } = useAuth();
  
  // Get the signOut function from props or from auth context as fallback
  const handleSignOut = signOut || useAuth().signOut;

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  // Define navigation sections based on user role
  const canAccessDashboard = userRole === 'ADMIN' || userRole === 'DOORMAN';
  const canAccessAnalytics = userRole === 'ADMIN';
  const canAccessInquiries = userRole === 'ADMIN';
  const canAccessPackages = userRole === 'ADMIN' || userRole === 'DOORMAN';
  const canAccessSettings = userRole === 'ADMIN';
  const canAccessDocuments = userRole === 'ADMIN' || userRole === 'SYNDIC' || userRole === 'USER';
  const canAccessResidents = userRole === 'ADMIN';

  return (
    <nav className="py-4 px-2">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-center p-2 mb-6 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
        aria-label={isExpanded ? "Réduire le panneau latéral" : "Agrandir le panneau latéral"}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {isExpanded ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          )}
        </svg>
        {isExpanded && <span className="ml-2 font-medium">Réduire</span>}
      </button>
      
      <div className="space-y-6">
        <div className="space-y-1">
          {/* Public Site Link - Always visible to all users */}
          <NavLink 
            href="/"
            isActive={false}
            isExpanded={isExpanded}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            }
            external={true}
          >
            LDA Site Public
          </NavLink>

          {canAccessDashboard && (
            <NavLink 
              href="/admin/dashboard"
              isActive={isActive("/admin/dashboard")}
              isExpanded={isExpanded}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              }
            >
              Tableau de bord
            </NavLink>
          )}
          
          {canAccessDocuments && (
            <NavLink 
              href="/admin/documents"
              isActive={isActive("/admin/documents")}
              isExpanded={isExpanded}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              }
            >
              Documents
            </NavLink>
          )}
          
          {canAccessAnalytics && (
            <NavLink 
              href="/admin/analytics"
              isActive={isActive("/admin/analytics")}
              isExpanded={isExpanded}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20V10"></path>
                  <path d="M18 20V4"></path>
                  <path d="M6 20v-4"></path>
                </svg>
              }
            >
              Analytique
            </NavLink>
          )}
          
          {canAccessInquiries && (
            <NavLink 
              href="/admin/inquiries"
              isActive={isActive("/admin/inquiries")}
              isExpanded={isExpanded}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              }
            >
              Demandes
            </NavLink>
          )}

          {canAccessPackages && (
            <NavLink 
              href="/admin/packages"
              isActive={isActive("/admin/packages")}
              isExpanded={isExpanded}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              }
            >
              Colis
            </NavLink>
          )}
          
          {canAccessResidents && (
            <NavLink 
              href="/admin/residents"
              isActive={isActive("/admin/residents")}
              isExpanded={isExpanded}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              }
            >
              Résidents
            </NavLink>
          )}
          
          {canAccessSettings && (
            <NavLink 
              href="/admin/settings"
              isActive={isActive("/admin/settings")}
              isExpanded={isExpanded}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              }
            >
              Paramètres
            </NavLink>
          )}
        </div>
        
        {isExpanded && (
          <div className="pt-6 border-t border-border">
            <div className="mb-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Compte
            </div>
            
            {user && (
              <div className="px-4 py-2 mb-3 bg-muted/50 rounded-md">
                <div className="text-sm font-medium text-card-foreground">{user.email}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {userRole === 'ADMIN' && 'Administrateur'}
                  {userRole === 'DOORMAN' && 'Portier'}
                  {userRole === 'USER' && 'Utilisateur'}
                  {userRole === 'SYNDIC' && 'Syndic'}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className={`${isExpanded ? 'px-4' : ''} mt-4`}>
          <button
            onClick={handleSignOut}
            className={`flex items-center ${isExpanded ? 'w-full' : 'justify-center'} px-4 py-2 text-sm font-medium text-primary-foreground bg-destructive hover:bg-destructive/90 rounded-md transition-colors`}
            title="Déconnexion"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {isExpanded && <span className="ml-2">Déconnexion</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}

type NavLinkProps = {
  href: string;
  isActive: boolean;
  isExpanded: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  external?: boolean;
};

function NavLink({ href, isActive, isExpanded, icon, children, external }: NavLinkProps) {
  return (
    <Link 
      href={href}
      className={`flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'} px-4 py-3 rounded-md transition-colors ${
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
      title={isExpanded ? undefined : String(children)}
      target={external ? "_blank" : undefined}
    >
      {icon}
      {isExpanded && <span className="font-medium">{children}</span>}
    </Link>
  );
} 