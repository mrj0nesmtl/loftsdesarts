"use client";

import Link from "next/link";
import Image from "next/image";

const socialLinks = [
  { 
    name: "Facebook", 
    url: "https://www.facebook.com/LoftDesArts", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    )
  },
  { 
    name: "Instagram", 
    url: "https://www.instagram.com/explore/tags/loftsdesarts/", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  },
  { 
    name: "Google Maps", 
    url: "https://maps.app.goo.gl/tz5g4Zq5yGPz949N7",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    )
  },
];

// Add error handling wrapper for links that might be blocked by ad blockers
const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
  try {
    // Attempt to open in new tab
    window.open(url, "_blank", "noopener,noreferrer");
    e.preventDefault();
  } catch (error) {
    // Fallback to default link behavior
    console.info("Link may be blocked by an ad blocker, using default behavior");
  }
};

export function Footer() {
  return (
    <footer className="w-full bg-black border-t border-zinc-800 py-8">
      <div className="container px-4 mx-auto md:px-6">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <Image
              src="/lda_logo.png"
              alt="Lofts des Arts"
              width={140}
              height={40}
              className="h-10 w-auto object-contain"
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
          </div>
          
          {/* Address and copyright */}
          <div className="text-center">
            <p className="text-sm text-zinc-400 mb-2">
              1625 rue Clark, Montréal, Québec, Canada H2X 2R5
            </p>
            <div className="text-sm text-zinc-500">
              &copy; {new Date().getFullYear()} Annonymous Contractor. Tous droits réservés.
            </div>
          </div>
          
          {/* Social links */}
          <div className="flex items-center gap-6 mt-2">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-300 transition-colors"
                title={link.name}
                onClick={(e) => handleLinkClick(e, link.url)}
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
} 