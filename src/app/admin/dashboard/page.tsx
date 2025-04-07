"use client";

import { WelcomeMessage } from '@/components/admin/WelcomeMessage';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { useTheme } from '@/context/ThemeProvider';
import Link from 'next/link';
import { Phone, Package, Users, Home, User, Shield, FileText, Bell, BarChart2, Cloud, CloudRain, Sun, Moon } from 'lucide-react';

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

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  loaded: boolean;
}

export default function DashboardPage() {
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData>({
    temp: 0,
    condition: '',
    icon: '',
    loaded: false
  });
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

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Fetch weather data
    const fetchWeather = async () => {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Montreal,ca&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo'}`);
        if (response.ok) {
          const data = await response.json();
          setWeather({
            temp: Math.round(data.main.temp),
            condition: data.weather[0].description,
            icon: data.weather[0].icon,
            loaded: true
          });
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
        // Set demo data if API call fails
        setWeather({
          temp: 2,
          condition: "peu nuageux",
          icon: "02d",
          loaded: true
        });
      }
    };

    fetchWeather();
    return () => clearInterval(timer);
  }, []);

  // Weather icon component
  const WeatherIcon = () => {
    if (!weather.loaded) return <Cloud className="w-6 h-6 text-blue-500" />;
    
    // Basic icon mapping
    const iconId = weather.icon;
    if (iconId.includes("01")) return <Sun className="w-6 h-6 text-amber-500" />;
    if (iconId.includes("02") || iconId.includes("03") || iconId.includes("04")) 
      return <Cloud className="w-6 h-6 text-blue-400" />;
    if (iconId.includes("09") || iconId.includes("10")) 
      return <CloudRain className="w-6 h-6 text-blue-500" />;
    if (iconId.includes("13")) 
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
          <path d="M8 16h.01" />
          <path d="M8 20h.01" />
          <path d="M12 18h.01" />
          <path d="M12 22h.01" />
          <path d="M16 16h.01" />
          <path d="M16 20h.01" />
        </svg>
      );
    
    // Default icon
    return <Cloud className="w-6 h-6 text-blue-500" />;
  };

  // Format the date in French
  const formattedDate = currentTime.toLocaleDateString('fr-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Format the time
  const formattedTime = currentTime.toLocaleTimeString('fr-CA', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Calculate occupancy rate
  const occupancyRate = stats.totalUnits > 0 
    ? Math.round((stats.occupiedUnits / stats.totalUnits) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <WelcomeMessage />
      
      {/* Weather and Time Widget */}
      <Card className="theme-transition bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="pt-4 pb-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">{formattedDate}</h3>
              <p className="text-2xl font-bold mt-1">{formattedTime}</p>
            </div>
            <div className="flex items-center bg-card rounded-lg px-4 py-2 shadow-sm">
              <WeatherIcon />
              <div className="ml-3">
                <p className="text-lg font-bold">{weather.temp}°C</p>
                <p className="text-sm capitalize">Montréal, QC</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <Card className="theme-transition bg-red-500/10 border-red-500/30">
          <CardHeader className="pb-1 pt-3">
            <CardTitle className="text-base flex items-center text-red-500">
              <Phone className="w-4 h-4 mr-1" />
              Urgence Gestion
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">514-281-2811</div>
              <a 
                href="tel:5142812811" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-red-500 text-white px-2 py-1 text-xs font-medium hover:bg-red-600 transition-colors"
              >
                <Phone className="h-3 w-3 mr-1" />
                Appeler
              </a>
            </div>
            <p className="text-xs mt-1">
              Urgences immeuble (sécurité, dégât d'eau)
            </p>
          </CardContent>
        </Card>
        
        <Card className="theme-transition bg-blue-500/10 border-blue-500/30">
          <CardHeader className="pb-1 pt-3">
            <CardTitle className="text-base flex items-center text-blue-500">
              <User className="w-4 h-4 mr-1" />
              Gestionnaire
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">Marie Tremblay</div>
                <div className="text-xs">514-555-1234</div>
              </div>
              <a 
                href="tel:5145551234" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-blue-500 text-white px-2 py-1 text-xs font-medium hover:bg-blue-600 transition-colors"
              >
                <Phone className="h-3 w-3 mr-1" />
                Appeler
              </a>
            </div>
            <p className="text-xs mt-1">
              Heures: Lun-Ven 9h-17h
            </p>
          </CardContent>
        </Card>
        
        <Card className="theme-transition bg-green-500/10 border-green-500/30">
          <CardHeader className="pb-1 pt-3">
            <CardTitle className="text-base flex items-center text-green-500">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-4 h-4 mr-1" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <path d="M6 8h.001"></path>
                <path d="M10 8h.001"></path>
                <path d="M14 8h.001"></path>
                <path d="M18 8h.001"></path>
                <path d="M6 12h.001"></path>
                <path d="M10 12h.001"></path>
                <path d="M14 12h.001"></path>
                <path d="M18 12h.001"></path>
                <path d="M6 16h12"></path>
              </svg>
              Tech Urgence
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">AJ Sécurité</div>
                <div className="text-xs">514-679-4873</div>
              </div>
              <a 
                href="tel:5146794873" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-green-500 text-white px-2 py-1 text-xs font-medium hover:bg-green-600 transition-colors"
              >
                <Phone className="h-3 w-3 mr-1" />
                Appeler
              </a>
            </div>
            <p className="text-xs mt-1">
              Fermé ⋅ Ouvre 9h lundi
            </p>
          </CardContent>
        </Card>
        
        <Card className="theme-transition bg-amber-500/10 border-amber-500/30">
          <CardHeader className="pb-1 pt-3">
            <CardTitle className="text-base flex items-center text-amber-500">
              <Shield className="w-4 h-4 mr-1" />
              Services d'urgence
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">9-1-1</div>
              <a 
                href="tel:911" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-amber-500 text-white px-2 py-1 text-xs font-medium hover:bg-amber-600 transition-colors"
              >
                <Phone className="h-3 w-3 mr-1" />
                Appeler
              </a>
            </div>
            <p className="text-xs mt-1">
              Police, Ambulance, Pompiers
            </p>
          </CardContent>
        </Card>
        
        <Card className="theme-transition bg-sky-500/10 border-sky-500/30">
          <CardHeader className="pb-1 pt-3">
            <CardTitle className="text-base flex items-center text-sky-500">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-4 h-4 mr-1" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M2 12h1"></path>
                <path d="M21 12h1"></path>
                <path d="M12 2v1"></path>
                <path d="M12 21v1"></path>
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                <path d="M16 12a4 4 0 0 0-8 0"></path>
                <path d="M18 12a6 6 0 0 0-12 0"></path>
              </svg>
              Urgence Piscine
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">Aqua Services</div>
                <div className="text-xs">514-888-7777</div>
              </div>
              <a 
                href="tel:5148887777" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-sky-500 text-white px-2 py-1 text-xs font-medium hover:bg-sky-600 transition-colors"
              >
                <Phone className="h-3 w-3 mr-1" />
                Appeler
              </a>
            </div>
            <p className="text-xs mt-1">
              Entretien et urgences piscine
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 