"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function AdminNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <nav className="p-4">
      <div className="space-y-6">
        <div className="space-y-1">
          <NavLink 
            href="/admin/dashboard"
            isActive={isActive("/admin/dashboard")}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H3a1 1 0 01-1-1v-4zM8 7a1 1 0 011-1h4a1 1 0 011 1v8a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v11a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            }
          >
            Dashboard
          </NavLink>
          
          <NavLink 
            href="/admin/analytics"
            isActive={isActive("/admin/analytics")}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            }
          >
            Analytics
          </NavLink>
          
          <NavLink 
            href="/admin/inquiries"
            isActive={isActive("/admin/inquiries")}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            }
          >
            Inquiries
          </NavLink>
          
          <NavLink 
            href="/admin/settings"
            isActive={isActive("/admin/settings")}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            }
          >
            Settings
          </NavLink>
        </div>
        
        <div className="pt-4 border-t border-zinc-700">
          <div className="mb-2 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Account
          </div>
          
          {user && (
            <div className="px-4 py-2 mb-2">
              <div className="text-sm font-medium truncate">{user.email}</div>
            </div>
          )}
          
          <button
            onClick={signOut}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm4 9h6v2H7v-2zm4-3h2v2h-2V9zm-4 0h2v2H7V9z" clipRule="evenodd" />
              <path d="M14.293 5.293L9 10.586V12h1.414l5.293-5.293L14.293 5.293z" />
            </svg>
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

type NavLinkProps = {
  href: string;
  isActive: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
};

function NavLink({ href, isActive, icon, children }: NavLinkProps) {
  return (
    <Link 
      href={href}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
        isActive 
          ? "bg-red-600 text-white" 
          : "text-zinc-400 hover:text-white hover:bg-zinc-700"
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
} 