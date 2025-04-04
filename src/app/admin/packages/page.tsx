'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define package type
type Package = {
  id: string;
  tracking_number: string | null;
  carrier_id: string | null;
  carrier_name?: string;
  resident_id: string | null;
  resident_email?: string;
  unit_number: string;
  recipient_name: string;
  status: 'PENDING' | 'RECEIVED' | 'NOTIFIED' | 'DELIVERED' | 'RETURNED';
  received_at: string | null;
  delivered_at: string | null;
  created_at: string;
  description: string | null;
};

// Package status options with labels and colors
const packageStatuses = {
  'PENDING': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  'RECEIVED': { label: 'Reçu', color: 'bg-blue-100 text-blue-800' },
  'NOTIFIED': { label: 'Notifié', color: 'bg-purple-100 text-purple-800' },
  'DELIVERED': { label: 'Livré', color: 'bg-green-100 text-green-800' },
  'RETURNED': { label: 'Retourné', color: 'bg-red-100 text-red-800' }
};

export default function PackagesPage() {
  const { userRole } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    PENDING: 0,
    RECEIVED: 0,
    NOTIFIED: 0,
    DELIVERED: 0,
    RETURNED: 0
  });
  
  // Function to fetch packages with carrier and resident details
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          carrier:carriers(name),
          resident:profiles(email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching packages:', error);
        return;
      }

      const formattedPackages = data.map(pkg => ({
        ...pkg,
        carrier_name: pkg.carrier?.name || 'N/A',
        resident_email: pkg.resident?.email || 'N/A'
      }));

      setPackages(formattedPackages);
      
      // Calculate counts by status
      const counts: Record<string, number> = {
        PENDING: 0,
        RECEIVED: 0,
        NOTIFIED: 0,
        DELIVERED: 0,
        RETURNED: 0
      };
      
      formattedPackages.forEach(pkg => {
        if (counts[pkg.status] !== undefined) {
          counts[pkg.status]++;
        }
      });
      
      setStatusCounts(counts);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);
  
  // Filter packages based on active tab
  const filteredPackages = activeTab === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des colis</h1>
          <p className="text-muted-foreground">
            Suivez et gérez les colis des résidents
          </p>
        </div>
        
        {userRole === 'ADMIN' && (
          <Link
            href="/admin/packages/add"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Enregistrer un nouveau colis
          </Link>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{packages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.PENDING}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reçus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.RECEIVED}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Notifiés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.NOTIFIED}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Livrés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.DELIVERED}</div>
          </CardContent>
        </Card>
      </div>

      {/* Packages List with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des colis</CardTitle>
          <CardDescription>
            {loading ? 'Chargement...' : `${filteredPackages.length} colis trouvés`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="PENDING">En attente</TabsTrigger>
              <TabsTrigger value="RECEIVED">Reçus</TabsTrigger>
              <TabsTrigger value="NOTIFIED">Notifiés</TabsTrigger>
              <TabsTrigger value="DELIVERED">Livrés</TabsTrigger>
              <TabsTrigger value="RETURNED">Retournés</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-0">
              {renderPackageList(filteredPackages, loading)}
            </TabsContent>
            <TabsContent value="PENDING" className="space-y-0">
              {renderPackageList(filteredPackages, loading)}
            </TabsContent>
            <TabsContent value="RECEIVED" className="space-y-0">
              {renderPackageList(filteredPackages, loading)}
            </TabsContent>
            <TabsContent value="NOTIFIED" className="space-y-0">
              {renderPackageList(filteredPackages, loading)}
            </TabsContent>
            <TabsContent value="DELIVERED" className="space-y-0">
              {renderPackageList(filteredPackages, loading)}
            </TabsContent>
            <TabsContent value="RETURNED" className="space-y-0">
              {renderPackageList(filteredPackages, loading)}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Les colis sont automatiquement archivés 30 jours après la livraison.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

// Helper function to render package list
function renderPackageList(packages: Package[], loading: boolean) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun colis trouvé.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-2 text-left text-sm font-medium">Unité</th>
            <th className="py-3 px-2 text-left text-sm font-medium">Destinataire</th>
            <th className="py-3 px-2 text-left text-sm font-medium">Transporteur</th>
            <th className="py-3 px-2 text-left text-sm font-medium">Suivi</th>
            <th className="py-3 px-2 text-left text-sm font-medium">Statut</th>
            <th className="py-3 px-2 text-left text-sm font-medium">Date</th>
            <th className="py-3 px-2 text-left text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-2 text-sm">{pkg.unit_number}</td>
              <td className="py-3 px-2 text-sm">{pkg.recipient_name}</td>
              <td className="py-3 px-2 text-sm">{pkg.carrier_name}</td>
              <td className="py-3 px-2 text-sm">
                {pkg.tracking_number ? (
                  <span className="font-mono text-xs">{pkg.tracking_number}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="py-3 px-2 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${packageStatuses[pkg.status].color}`}>
                  {packageStatuses[pkg.status].label}
                </span>
              </td>
              <td className="py-3 px-2 text-sm">
                {new Date(pkg.created_at).toLocaleDateString('fr-CA')}
              </td>
              <td className="py-3 px-2 text-sm">
                <div className="flex space-x-2">
                  <Link 
                    href={`/admin/packages/${pkg.id}`}
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                    title="Voir les détails"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </Link>
                  <Link 
                    href={`/admin/packages/${pkg.id}/edit`}
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                    title="Modifier"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 