"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

interface AdminNavProps {
  isExpanded: boolean;
  onToggle: () => void;
  signOut?: () => Promise<void>;
}

export default function AdminNav({ isExpanded, onToggle, signOut }: AdminNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Get the signOut function from props or from auth context as fallback
  const handleSignOut = signOut || useAuth().signOut;

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

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
          
          <NavLink 
            href="/admin/inquiries"
            isActive={isActive("/admin/inquiries")}
            isExpanded={isExpanded}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            }
          >
            Demandes
          </NavLink>
          
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
        </div>
        
        {isExpanded && (
          <div className="pt-6 border-t border-border">
            <div className="mb-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Compte
            </div>
            
            {user && (
              <div className="px-4 py-2 mb-3 bg-muted/50 rounded-md">
                <div className="text-sm font-medium text-card-foreground">{user.email}</div>
                <div className="text-xs text-muted-foreground mt-1">Administrateur</div>
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
};

function NavLink({ href, isActive, isExpanded, icon, children }: NavLinkProps) {
  return (
    <Link 
      href={href}
      className={`flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'} px-4 py-3 rounded-md transition-colors ${
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
      title={isExpanded ? undefined : String(children)}
    >
      {icon}
      {isExpanded && <span className="font-medium">{children}</span>}
    </Link>
  );
} 