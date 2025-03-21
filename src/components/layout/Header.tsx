"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Contact", path: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  
  return (
    <header className="w-full bg-black border-b border-zinc-800">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <Link href="/" className="text-xl font-bold tracking-wider text-red-500">
          STTS
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-red-500",
                pathname === item.path ? "text-red-500" : "text-zinc-400"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Mobile menu button placeholder - to be implemented */}
        <button className="md:hidden">Menu</button>
      </div>
    </header>
  );
} 