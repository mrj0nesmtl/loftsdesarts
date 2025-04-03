"use client";

import { WelcomeMessage } from '@/components/admin/WelcomeMessage';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalInquiries: number;
  newInquiries: number;
  latestInquiry: any | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInquiries: 0,
    newInquiries: 0,
    latestInquiry: null
  });

  useEffect(() => {
    async function loadStats() {
      // Get stats
      const { data: inquiries, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && inquiries) {
        const now = new Date();
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        
        setStats({
          totalInquiries: inquiries.length,
          newInquiries: inquiries.filter(i => new Date(i.created_at) >= sevenDaysAgo).length,
          latestInquiry: inquiries[0] || null
        });
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <WelcomeMessage />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total des demandes */}
        <div className="rounded-lg bg-zinc-800 border border-zinc-700 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-zinc-200">Total des demandes</h3>
          </div>
          <div className="flex items-center pt-2">
            <div className="text-2xl font-bold text-white">{stats.totalInquiries}</div>
          </div>
        </div>

        {/* Nouvelles demandes */}
        <div className="rounded-lg bg-zinc-800 border border-zinc-700 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-zinc-200">Nouvelles demandes (7 jours)</h3>
          </div>
          <div className="flex items-center pt-2">
            <div className="text-2xl font-bold text-white">{stats.newInquiries}</div>
          </div>
        </div>

        {/* Dernière activité */}
        <div className="rounded-lg bg-zinc-800 border border-zinc-700 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-zinc-200">Dernière activité</h3>
          </div>
          <div className="pt-2">
            {stats.latestInquiry ? (
              <div className="text-sm">
                <p className="text-zinc-300">
                  Nouvelle demande de {stats.latestInquiry.name}
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  {new Date(stats.latestInquiry.created_at).toLocaleDateString('fr-CA')}
                </p>
              </div>
            ) : (
              <p className="text-sm text-zinc-300">Aucune demande</p>
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="rounded-lg bg-zinc-800 border border-zinc-700 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-zinc-200">Actions rapides</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a 
              href="/admin/inquiries" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-black text-white px-3 py-2 text-sm font-medium hover:bg-zinc-900 border border-zinc-700 transition-colors"
            >
              Voir les demandes
            </a>
            <a 
              href="/" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-zinc-700 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-600 transition-colors"
            >
              Visiter le site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 