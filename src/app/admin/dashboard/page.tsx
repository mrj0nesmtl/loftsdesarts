"use client";

import { WelcomeMessage } from '@/components/admin/WelcomeMessage';
import { PublicSiteBanner } from '@/components/admin/ClientAdminLayout';
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
      {/* Public Website Banner */}
      <PublicSiteBanner />

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
      
      {/* Theme Demo Section */}
      <Card className="theme-transition">
        <CardHeader>
          <CardTitle>Démonstration du thème</CardTitle>
          <CardDescription>
            Voici comment les différents éléments d'interface s'affichent dans le thème {theme === 'dark' ? 'foncé' : 'clair'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Éléments de texte</h4>
              <div className="space-y-2 rounded-md border p-2">
                <p className="text-lg font-bold">Texte en gras</p>
                <p>Texte normal</p>
                <p className="text-muted-foreground">Texte secondaire</p>
                <p className="text-sm text-muted-foreground">Petit texte secondaire</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Couleurs primaires</h4>
              <div className="space-y-2">
                <div className="h-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
                  Primaire
                </div>
                <div className="h-10 rounded-md bg-secondary text-secondary-foreground flex items-center justify-center">
                  Secondaire
                </div>
                <div className="h-10 rounded-md bg-muted text-muted-foreground flex items-center justify-center">
                  Atténué
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <p className="text-sm text-muted-foreground">
            Utilisez le bouton dans l'en-tête pour changer de thème
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 