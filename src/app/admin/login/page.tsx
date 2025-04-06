"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/admin/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-500"></div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/lda_bg.png"
          alt="Lofts des Arts Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-4">
        <Link 
          href="/" 
          className="self-start mb-6 px-4 py-2 bg-zinc-800/70 hover:bg-zinc-700 text-zinc-200 rounded-md transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour au Site
        </Link>
        
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white font-title">Syndicate Lofts des Arts</h1>
          <p className="text-zinc-400 mt-2">Portail d'Administration</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
} 