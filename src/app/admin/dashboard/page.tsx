"use client";

import { WelcomeMessage } from '@/components/admin/WelcomeMessage';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { useTheme } from '@/context/ThemeProvider';
import Link from 'next/link';
import { Phone, Package, Users, Home, User, Shield, FileText, Bell, BarChart2 } from 'lucide-react';

interface DashboardStats {
  totalInquiries: number;
  newInquiries: number;
  latestInquiry: any | null;
  totalResidents: number;
  ownersCount: number;
  rentersCount: number;
  totalPackages: number;
  pendingPackages: number;
  totalUnits: number;
  occupiedUnits: number;
  recentDocuments: any[];
}

export default function DashboardPage() {
  const { theme } = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalInquiries: 0,
    newInquiries: 0,
    latestInquiry: null,
    totalResidents: 0,
    ownersCount: 0,
    rentersCount: 0,
    totalPackages: 0,
    pendingPackages: 0,
    totalUnits: 0,
    occupiedUnits: 0,
    recentDocuments: []
  });

  useEffect(() => {
    async function loadStats() {
      try {
        // Fetch inquiries
        const { data: inquiries, error: inquiriesError } = await supabase
          .from('contact_inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        // Fetch residents
        const { data: residents, error: residentsError } = await supabase
          .from('residents')
          .select('*');

        // Fetch packages
        const { data: packages, error: packagesError } = await supabase
          .from('packages')
          .select('*');
          
        // Fetch building units
        const { data: units, error: unitsError } = await supabase
          .from('building_units')
          .select('*');
          
        // Fetch documents
        const { data: documents, error: documentsError } = await supabase
          .from('documents')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        const now = new Date();
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        
        setStats({
          // Inquiries stats
          totalInquiries: inquiries?.length || 0,
          newInquiries: inquiries?.filter(i => new Date(i.created_at) >= sevenDaysAgo).length || 0,
          latestInquiry: inquiries?.[0] || null,
          
          // Residents stats
          totalResidents: residents?.length || 0,
          ownersCount: residents?.filter(r => r.is_owner === true).length || 0,
          rentersCount: residents?.filter(r => r.is_owner === false).length || 0,
          
          // Packages stats
          totalPackages: packages?.length || 0,
          pendingPackages: packages?.filter(p => p.status === 'pending' || p.status === 'received').length || 0,
          
          // Building stats
          totalUnits: units?.length || 0,
          occupiedUnits: units?.filter(u => u.is_occupied === true).length || 0,
          
          // Documents
          recentDocuments: documents || []
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      }
    }

    loadStats();
  }, []);

  // Calculate occupancy rate
  const occupancyRate = stats.totalUnits > 0 
    ? Math.round((stats.occupiedUnits / stats.totalUnits) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <WelcomeMessage />
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total des demandes */}
        <Card className="theme-transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="w-4 h-4 mr-2 text-blue-500" />
              Total des demandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalInquiries}</div>
          </CardContent>
        </Card>

        {/* Nouvelles demandes */}
        <Card className="theme-transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Bell className="w-4 h-4 mr-2 text-amber-500" />
              Nouvelles demandes
            </CardTitle>
            <CardDescription>7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.newInquiries}</div>
          </CardContent>
        </Card>

        {/* Nombre de résidents */}
        <Card className="theme-transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-4 h-4 mr-2 text-green-500" />
              Résidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalResidents}</div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Propriétaires: {stats.ownersCount}</span>
              <span>Locataires: {stats.rentersCount}</span>
            </div>
          </CardContent>
        </Card>

        {/* Colis */}
        <Card className="theme-transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Package className="w-4 h-4 mr-2 text-purple-500" />
              Colis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingPackages}</div>
            <div className="text-sm text-muted-foreground mt-1">
              En attente de récupération
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Building Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Taux d'occupation */}
        <Card className="theme-transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Home className="w-4 h-4 mr-2 text-indigo-500" />
              Immeubles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold">{occupancyRate}%</div>
                <div className="text-sm text-muted-foreground">Taux d'occupation</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">{stats.occupiedUnits}/{stats.totalUnits}</div>
                <div className="text-sm text-muted-foreground">Unités occupées</div>
              </div>
            </div>
            <div className="w-full bg-muted h-2 rounded-full mt-3">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Dernière activité */}
        <Card className="theme-transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart2 className="w-4 h-4 mr-2 text-blue-500" />
              Dernière activité
            </CardTitle>
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
                <p className="text-sm line-clamp-2 mt-2">
                  {stats.latestInquiry.message}
                </p>
              </div>
            ) : (
              <p>Aucune demande</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Action Buttons */}
        <Card className="theme-transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Shield className="w-4 h-4 mr-2 text-red-500" />
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Voir les demandes
            </Link>
            
            <Link
              href="/admin/packages"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-secondary text-secondary-foreground px-3 py-2 text-sm font-medium hover:bg-secondary/90 transition-colors"
            >
              <Package className="h-4 w-4 mr-2" />
              Gérer les colis
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-muted text-muted-foreground px-3 py-2 text-sm font-medium hover:bg-muted/90 transition-colors"
              target="_blank"
            >
              <Home className="h-4 w-4 mr-2" />
              Visiter le site
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Emergency Contacts */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="theme-transition bg-red-500/10 border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-red-500">
              <Phone className="w-4 h-4 mr-2" />
              Urgence Gestion Sentinel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">514-281-2811</div>
              <a 
                href="tel:5142812811" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-red-500 text-white px-3 py-2 text-sm font-medium hover:bg-red-600 transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </a>
            </div>
            <p className="text-sm mt-2">
              Pour toute urgence dans l'immeuble (sécurité, dégât d'eau, etc.)
            </p>
          </CardContent>
        </Card>
        
        <Card className="theme-transition bg-blue-500/10 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-blue-500">
              <User className="w-4 h-4 mr-2" />
              Gestionnaire d'immeuble
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold">Marie Tremblay</div>
                <div className="text-sm">514-555-1234</div>
              </div>
              <a 
                href="tel:5145551234" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-blue-500 text-white px-3 py-2 text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </a>
            </div>
            <p className="text-sm mt-2">
              Heures: Lun-Ven 9h-17h
            </p>
          </CardContent>
        </Card>
        
        <Card className="theme-transition bg-amber-500/10 border-amber-500/30 lg:col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-amber-500">
              <Shield className="w-4 h-4 mr-2" />
              Services d'urgence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">9-1-1</div>
              <a 
                href="tel:911" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-amber-500 text-white px-3 py-2 text-sm font-medium hover:bg-amber-600 transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </a>
            </div>
            <p className="text-sm mt-2">
              Police, Ambulance, Pompiers
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 