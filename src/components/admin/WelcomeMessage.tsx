"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { generateInitials } from '@/lib/helpers';

interface BoardMember {
  name: string;
  role: string;
  email: string;
}

export function WelcomeMessage() {
  const { user } = useAuth();
  const [boardMember, setBoardMember] = useState<BoardMember | null>(null);
  const [greeting, setGreeting] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Generate greeting based on time of day
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Bonjour';
      if (hour < 18) return 'Bon après-midi';
      return 'Bonsoir';
    };

    setGreeting(getTimeBasedGreeting());

    // Get board member info
    const getBoardMemberInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // Map known emails to names if not in profile
        const memberInfo: BoardMember = {
          email: user.email || '',
          role: data?.role || 'ADMIN',
          name: ''
        };

        // Map emails to names
        switch (user.email) {
          case 'joel.yaffe+lda@gmail.com':
            memberInfo.name = 'Joel Yaffe';
            break;
          case 'viviane.sokoluk@gmail.com':
            memberInfo.name = 'Viviane Sokoluk';
            break;
          case 'info@jacquesgermain.com':
            memberInfo.name = 'Jacques Germain';
            break;
          case 'david.morissette@loftsdesarts.ca':
            memberInfo.name = 'David Morissette';
            break;
          default:
            // Use the email name part as fallback
            memberInfo.name = user.email?.split('@')[0]?.replace(/\./g, ' ') || '';
            // Capitalize each word
            memberInfo.name = memberInfo.name
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
        }

        setBoardMember(memberInfo);
      } catch (error) {
        console.error('Error fetching board member info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getBoardMemberInfo();
  }, [user]);

  if (isLoading || !boardMember) {
    return null;
  }

  return (
    <div className="bg-zinc-800/50 border-l-4 border-red-600 p-4 rounded-lg mb-8">
      <div className="flex items-center">
        <div className="h-12 w-12 rounded-full bg-red-600/20 flex items-center justify-center text-red-500 text-xl font-bold mr-4">
          {generateInitials(boardMember.name)}
        </div>
        <div>
          <h2 className="text-2xl font-medium">
            {greeting}, {boardMember.name}!
          </h2>
          <p className="text-zinc-400">
            Bienvenue au tableau de bord d'administration du Syndicat Lofts des Arts
          </p>
        </div>
      </div>
    </div>
  );
} 