"use client";

import { WelcomeMessage } from '@/components/admin/WelcomeMessage';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { useTheme } from '@/context/ThemeProvider';
import Link from 'next/link';

interface DashboardStats {
  totalInquiries: number;
  newInquiries: number;
  latestInquiry: any | null;
}

export default function DashboardPage() {
  const { theme } = useTheme();
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
        <Card className="theme-transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total des demandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalInquiries}</div>
          </CardContent>
        </Card>

        {/* Nouvelles demandes */}
        <Card className="theme-transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Nouvelles demandes</CardTitle>
            <CardDescription>7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.newInquiries}</div>
          </CardContent>
        </Card>

        {/* Dernière activité */}
        <Card className="theme-transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Dernière activité</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.latestInquiry ? (
              <div>
                <p className="font-medium">
                  Nouvelle demande de {stats.latestInquiry.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(stats.latestInquiry.created_at).toLocaleDateString('fr-CA')}
                </p>
              </div>
            ) : (
              <p>Aucune demande</p>
            )}
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card className="theme-transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Voir les demandes
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-secondary text-secondary-foreground px-3 py-2 text-sm font-medium hover:bg-secondary/90 transition-colors"
              target="_blank"
            >
              Visiter le site
            </Link>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Thème actuel: {theme === 'dark' ? 'Foncé' : 'Clair'}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 