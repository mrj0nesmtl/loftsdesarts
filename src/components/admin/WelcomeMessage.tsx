"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useAuth } from '@/lib/auth';

interface WelcomeMessageProps {
  userName?: string;
}

export function WelcomeMessage({ userName }: WelcomeMessageProps) {
  const { user: authUser } = useAuth();
  const [greeting, setGreeting] = useState<string>('');
  const [mounted, setMounted] = useState<boolean>(false);

  // Set up initial state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Set greeting based on user
  useEffect(() => {
    if (!mounted) return;
    
    const hour = new Date().getHours();
    let timeGreeting = 'Bonjour';
    let displayName = userName;
    
    // If no userName provided, try to get it from user metadata
    if (!displayName && authUser?.user_metadata?.full_name) {
      displayName = authUser.user_metadata.full_name.split(' ')[0]; // Only use first name
    }
    
    // Fallback to email mapping if no name found
    if (!displayName && authUser?.email) {
      switch (authUser.email) {
        case 'joel.yaffe+lda@gmail.com':
          displayName = 'Joel';
          break;
        case 'viviane.sokoluk@gmail.com':
          displayName = 'Viviane';
          break;
        case 'info@jacquesgermain.com':
          displayName = 'Jacques';
          break;
        case 'david.morissette@loftsdesarts.ca':
          displayName = 'David';
          break;
        default:
          // Get only the first name from email
          displayName = authUser.email.split('@')[0]
            .split('.')[0] // Only take the first part before dots
            .charAt(0).toUpperCase() + authUser.email.split('@')[0].split('.')[0].slice(1);
      }
    }
    
    if (hour >= 12 && hour < 18) {
      timeGreeting = 'Bon après-midi';
    } else if (hour >= 18) {
      timeGreeting = 'Bonsoir';
    }
    
    setGreeting(`${timeGreeting}, ${displayName || 'User'}!`);
  }, [authUser, userName, mounted]);

  if (!mounted) {
    return <div className="min-h-[60px]" aria-hidden="true" />;
  }

  return (
    <div className="space-y-2 pb-4 md:pb-6">
      <h1 className="text-3xl font-bold tracking-tight">{greeting}</h1>
      <p className="text-zinc-400">
        Bienvenue au tableau de bord d&apos;administration du Syndicat Lofts des Arts
      </p>
    </div>
  );
} 