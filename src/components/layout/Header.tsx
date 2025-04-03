"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { name: "Accueil", path: "/" },
  { name: "Galerie", path: "/gallery" },
  { name: "À Propos", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-black border-b border-zinc-800 z-50">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <Link href="/" className="relative z-10">
          <Image 
            src="/lda_logo.png" 
            alt="Lofts des Arts" 
            width={140} 
            height={40} 
            className="h-8 w-auto" 
            priority
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-zinc-300",
                pathname === item.path ? "text-white" : "text-zinc-400"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          <ThemeToggle />
          
          {/* Login Button */}
          <Link
            href="/admin"
            className="text-sm font-medium px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition-colors"
          >
            Connexion
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button 
            className="z-50 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation Menu - Sliding from left */}
        <div 
          className={cn(
            "fixed top-0 left-0 h-full w-64 bg-black border-r border-zinc-800 z-40 md:hidden transition-transform duration-300 ease-in-out transform",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full pt-20 px-6">
            <div className="flex justify-center mb-6">
              <Image 
                src="/lda_logo.png" 
                alt="Lofts des Arts" 
                width={120} 
                height={35} 
                className="h-7 w-auto"
              />
            </div>
            <nav className="flex flex-col gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-zinc-300",
                    pathname === item.path ? "text-white" : "text-zinc-200"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Login Link */}
              <Link
                href="/admin"
                className="text-lg font-medium transition-colors hover:text-zinc-300 text-zinc-200 mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Connexion
              </Link>
            </nav>
            
            <div className="mt-auto mb-8">
              <div className="text-sm text-zinc-500">
                &copy; {new Date().getFullYear()} Lofts des Arts
              </div>
            </div>
          </div>
        </div>
        
        {/* Overlay when mobile menu is open */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/70 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </header>
  );
} 