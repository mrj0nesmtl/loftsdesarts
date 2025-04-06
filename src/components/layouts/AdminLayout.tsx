import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, MessageSquare, FileQuestion, Package, FileText, FolderOpen, Settings, BarChart3, Globe } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  
  // Navigation items for the sidebar
  const navItems = [
    { name: 'Tableau de bord', path: '/admin', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Résidents', path: '/admin/residents', icon: <Users className="w-4 h-4 mr-2" /> },
    { name: 'Messagerie', path: '/admin/messaging', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
    { name: 'Demandes', path: '/admin/inquiries', icon: <FileQuestion className="w-4 h-4 mr-2" /> },
    { name: 'Colis', path: '/admin/packages', icon: <Package className="w-4 h-4 mr-2" /> },
    { name: 'Documents', path: '/admin/documents', icon: <FileText className="w-4 h-4 mr-2" /> },
    { name: 'Drop Box', path: '/admin/dropbox', icon: <FolderOpen className="w-4 h-4 mr-2" /> },
    { name: 'Paramètres', path: '/admin/settings', icon: <Settings className="w-4 h-4 mr-2" /> },
    { name: 'Analytique', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
    { name: 'Modifications', path: '/admin/website', icon: <Globe className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white py-6 flex-shrink-0 hidden md:block">
        <div className="px-6 pb-6 mb-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Lofts des Arts</h1>
          <p className="text-sm text-gray-400">Administration</p>
        </div>
        
        <nav className="px-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`px-2 py-2 rounded flex items-center transition-colors ${
                    pathname === item.path
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 