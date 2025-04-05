'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PackageIcon, Package, AlertCircle, CheckCircle2, Clock, Send } from 'lucide-react';
import PackageRegistrationForm from '@/components/packages/PackageRegistrationForm';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define package type
export type Package = {
  id: string;
  tracking_number: string;
  carrier: string;
  resident_id: string;
  description: string | null;
  special_instructions: string | null;
  arrival_date: string;
  delivery_date: string | null;
  status: 'waiting' | 'delivered' | 'notified' | 'returned';
  internal_tracking_id: string;
  resident?: {
    first_name: string;
    last_name: string;
    unit?: {
      unit_number: string;
    };
  };
};

// Package status options with labels and colors
const packageStatuses = {
  'waiting': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  'delivered': { label: 'Livré', color: 'bg-green-100 text-green-800' },
  'notified': { label: 'Notifié', color: 'bg-purple-100 text-purple-800' },
  'returned': { label: 'Retourné', color: 'bg-red-100 text-red-800' }
};

export default function PackagesPage() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [activeTab, setActiveTab] = useState('list');
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  
  // Counters for stats
  const totalPackages = packages.length;
  const waitingPackages = packages.filter(pkg => pkg.status === 'waiting').length;
  const deliveredPackages = packages.filter(pkg => pkg.status === 'delivered').length;
  const notifiedPackages = packages.filter(pkg => pkg.status === 'notified').length;
  
  // Fetch packages data
  const fetchPackages = async () => {
    setIsLoading(true);
    
    try {
      // Check if the packages table exists and has data
      const { count, error: countError } = await supabase
        .from('packages')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
        console.log('Packages table may not exist yet:', countError);
        setPackages([]);
        setIsLoading(false);
        return;
      }
      
      // Only try to fetch data if the count is greater than 0
      if (count && count > 0) {
        const { data, error } = await supabase
          .from('packages')
          .select(`
            *,
            resident:resident_id (
              first_name,
              last_name,
              unit:unit_id (
                unit_number
              )
            )
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setPackages(data || []);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les colis. Veuillez réessayer.',
        variant: 'destructive',
      });
      // Set empty array to prevent further errors
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPackages();
  }, [toast]);
  
  // Handle package registration completion
  const handleRegistrationComplete = () => {
    fetchPackages();
    setShowRegisterDialog(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des colis</h1>
          <p className="text-muted-foreground mt-2">
            Suivez et gérez les colis des résidents
          </p>
        </div>
        
        <Button onClick={() => setShowRegisterDialog(true)} className="flex items-center">
          <Package className="mr-2 h-4 w-4" />
          Enregistrer un nouveau colis
        </Button>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Total</p>
            <p className="text-2xl font-bold">{totalPackages}</p>
          </div>
          <PackageIcon className="h-8 w-8 text-gray-400" />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">En attente</p>
            <p className="text-2xl font-bold">{waitingPackages}</p>
          </div>
          <Clock className="h-8 w-8 text-amber-400" />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Notifiés</p>
            <p className="text-2xl font-bold">{notifiedPackages}</p>
          </div>
          <Send className="h-8 w-8 text-blue-400" />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Livrés</p>
            <p className="text-2xl font-bold">{deliveredPackages}</p>
          </div>
          <CheckCircle2 className="h-8 w-8 text-green-400" />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="list">Liste des colis</TabsTrigger>
          <TabsTrigger value="register">Enregistrement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          {/* Package list will go here */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-8 text-center">
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : packages.length === 0 ? (
              <div className="flex flex-col items-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Aucun colis trouvé.</h3>
                <p className="text-muted-foreground mt-2">
                  Il n'y a actuellement aucun colis enregistré dans le système.
                </p>
                <Button 
                  onClick={() => setActiveTab('register')} 
                  className="mt-4"
                  variant="outline"
                >
                  Enregistrer un colis
                </Button>
              </div>
            ) : (
              <div>
                <p>Liste des colis affichée ici.</p>
                <p className="text-muted-foreground">
                  {packages.length} colis trouvés
                </p>
                {/* We will implement the complete package list in a future update */}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="register" className="mt-6">
          <PackageRegistrationForm />
        </TabsContent>
      </Tabs>
      
      {/* Package registration dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Enregistrer un nouveau colis</DialogTitle>
          </DialogHeader>
          
          <PackageRegistrationForm />
        </DialogContent>
      </Dialog>
    </div>
  );
} 