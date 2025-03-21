"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface UserAvatarProps {
  showNotification?: boolean;
}

export default function UserAvatar({ showNotification = true }: UserAvatarProps) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Get the initial unread count
  useEffect(() => {
    if (!user) return;
    
    async function getUnreadCount() {
      try {
        const { count, error } = await supabase
          .from('contact_inquiries')
          .select('*', { count: 'exact', head: true })
          .eq('viewed', false);
          
        if (error) throw error;
        setUnreadCount(count || 0);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    }
    
    // Get the user's avatar if available
    async function getUserProfile() {
      try {
        if (!user) return;
        
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setAvatarUrl(data?.avatar_url);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    
    getUnreadCount();
    getUserProfile();
    
    // Subscribe to new contact inquiry inserts
    const channel = supabase
      .channel('contact-notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'contact_inquiries' 
        }, 
        (payload) => {
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  // If no user, don't render
  if (!user) return null;

  // Generate initials for fallback avatar
  const getInitials = () => {
    if (!user?.email) return '?';
    return user.email.charAt(0).toUpperCase();
  };
  
  return (
    <Link 
      href="/admin/inquiries" 
      className="relative inline-block"
      title="View inquiries"
    >
      <div className="relative h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center text-white overflow-hidden">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="User Avatar"
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-lg font-medium">{getInitials()}</span>
        )}
      </div>
      
      {showNotification && unreadCount > 0 && (
        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 border border-black flex items-center justify-center text-xs font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
} 