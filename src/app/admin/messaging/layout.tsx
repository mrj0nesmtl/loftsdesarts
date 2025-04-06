/**
 * Messaging Layout
 * Contains the conversation list sidebar and outlet for the selected conversation
 */

'use client';

import ConversationList from "@/components/messaging/ConversationList";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MessagingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile and set initial sidebar state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative h-[calc(100vh-6rem)] overflow-hidden">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 left-2 z-30 md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      )}
      
      <div className="flex h-full flex-col md:flex-row">
        {/* Sidebar */}
        <div 
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            transform transition-transform duration-200 ease-in-out
            w-full md:w-80 md:flex-shrink-0 md:translate-x-0
            absolute md:relative z-20 bg-background h-full
          `}
        >
          <ConversationList />
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          {/* Overlay for mobile when sidebar is open */}
          {sidebarOpen && isMobile && (
            <div 
              className="absolute inset-0 bg-black/50 z-10 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div className={`relative h-full z-0 ${isMobile && sidebarOpen ? 'blur-sm' : ''}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 