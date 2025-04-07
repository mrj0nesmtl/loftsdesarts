"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserCog, 
  Building2, 
  ShieldCheck, 
  Gavel, 
  HardHat, 
  DoorClosed, 
  User, 
  UserCircle, 
  Package, 
  MessageSquare, 
  FileText, 
  Key,
  Globe
} from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Wiki system language type
type WikiLanguage = 'en' | 'fr';

export default function WikiPage() {
  const [language, setLanguage] = useState<WikiLanguage>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // Role cards data
  const roleCards = [
    {
      id: 'admin',
      title: language === 'en' ? 'Administrator' : 'Administrateur',
      description: language === 'en' 
        ? 'System administration and building management' 
        : 'Administration du système et gestion de l\'immeuble',
      icon: <UserCog className="h-8 w-8 text-indigo-500" />,
      link: '/admin/wiki/roles/admin'
    },
    {
      id: 'board-member',
      title: language === 'en' ? 'Board Member' : 'Membre du Conseil',
      description: language === 'en' 
        ? 'Governance and decision making' 
        : 'Gouvernance et prise de décisions',
      icon: <Gavel className="h-8 w-8 text-amber-600" />,
      link: '/admin/wiki/roles/board-member'
    },
    {
      id: 'resident-owner',
      title: language === 'en' ? 'Resident Owner' : 'Propriétaire Résident',
      description: language === 'en' 
        ? 'Property ownership and management' 
        : 'Propriété et gestion immobilière',
      icon: <Building2 className="h-8 w-8 text-emerald-600" />,
      link: '/admin/wiki/roles/resident-owner'
    },
    {
      id: 'resident-tenant',
      title: language === 'en' ? 'Resident Tenant' : 'Locataire Résident',
      description: language === 'en' 
        ? 'Tenant information and services' 
        : 'Information et services pour locataires',
      icon: <User className="h-8 w-8 text-blue-500" />,
      link: '/admin/wiki/roles/resident-tenant'
    },
    {
      id: 'manager',
      title: language === 'en' ? 'Property Manager' : 'Gestionnaire Immobilier',
      description: language === 'en' 
        ? 'Building operation and maintenance' 
        : 'Opération et maintenance de l\'immeuble',
      icon: <UserCircle className="h-8 w-8 text-purple-600" />,
      link: '/admin/wiki/roles/manager'
    },
    {
      id: 'doorman',
      title: language === 'en' ? 'Doorman' : 'Concierge',
      description: language === 'en' 
        ? 'Front desk and package management' 
        : 'Réception et gestion des colis',
      icon: <DoorClosed className="h-8 w-8 text-red-500" />,
      link: '/admin/wiki/roles/doorman'
    },
    {
      id: 'staff',
      title: language === 'en' ? 'Staff Member' : 'Membre du Personnel',
      description: language === 'en' 
        ? 'Daily operations and maintenance' 
        : 'Opérations quotidiennes et maintenance',
      icon: <HardHat className="h-8 w-8 text-yellow-600" />,
      link: '/admin/wiki/roles/staff'
    },
    {
      id: 'contractor',
      title: language === 'en' ? 'Contractor' : 'Entrepreneur',
      description: language === 'en' 
        ? 'Services and project execution' 
        : 'Services et exécution de projets',
      icon: <HardHat className="h-8 w-8 text-orange-500" />,
      link: '/admin/wiki/roles/contractor'
    },
    {
      id: 'guest',
      title: language === 'en' ? 'Guest' : 'Invité',
      description: language === 'en' 
        ? 'Visitor information and access' 
        : 'Information et accès pour visiteurs',
      icon: <Users className="h-8 w-8 text-gray-500" />,
      link: '/admin/wiki/roles/guest'
    },
    {
      id: 'super-admin',
      title: language === 'en' ? 'Super Administrator' : 'Super Administrateur',
      description: language === 'en' 
        ? 'System-wide administration and oversight' 
        : 'Administration et supervision globale du système',
      icon: <ShieldCheck className="h-8 w-8 text-red-600" />,
      link: '/admin/wiki/roles/super-admin'
    }
  ];

  // Feature cards data
  const featureCards = [
    {
      id: 'packages',
      title: language === 'en' ? 'Package Management' : 'Gestion des Colis',
      description: language === 'en' 
        ? 'Track and manage resident packages' 
        : 'Suivre et gérer les colis des résidents',
      icon: <Package className="h-8 w-8 text-blue-500" />,
      link: '/admin/wiki/features/package-management'
    },
    {
      id: 'messaging',
      title: language === 'en' ? 'Messaging System' : 'Système de Messagerie',
      description: language === 'en' 
        ? 'Internal communications platform' 
        : 'Plateforme de communications internes',
      icon: <MessageSquare className="h-8 w-8 text-green-500" />,
      link: '/admin/wiki/features/messaging-system'
    },
    {
      id: 'documents',
      title: language === 'en' ? 'Document Management' : 'Gestion des Documents',
      description: language === 'en' 
        ? 'Store and access building documents' 
        : 'Stocker et accéder aux documents de l\'immeuble',
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      link: '/admin/wiki/features/document-management'
    },
    {
      id: 'rbac',
      title: language === 'en' ? 'Access Control' : 'Contrôle d\'Accès',
      description: language === 'en' 
        ? 'Role-based access management' 
        : 'Gestion des accès basée sur les rôles',
      icon: <Key className="h-8 w-8 text-purple-500" />,
      link: '/admin/wiki/features/rbac'
    }
  ];

  // Filter cards by search query
  const filteredRoleCards = searchQuery 
    ? roleCards.filter(card => 
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        card.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : roleCards;

  const filteredFeatureCards = searchQuery 
    ? featureCards.filter(card => 
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        card.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : featureCards;

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {language === 'en' ? 'Admin Wiki' : 'Wiki d\'Administration'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Comprehensive guide to the Lofts des Arts management system' 
              : 'Guide complet du système de gestion des Lofts des Arts'}
          </p>
        </div>
        
        {/* Language toggle */}
        <div className="flex items-center space-x-2">
          <Button 
            variant={language === 'en' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setLanguage('en')}
            className="w-20"
          >
            English
          </Button>
          <Button 
            variant={language === 'fr' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setLanguage('fr')}
            className="w-20"
          >
            Français
          </Button>
          <Globe className="h-5 w-5 text-muted-foreground ml-1" />
        </div>
      </div>

      {/* Search input */}
      <div className="relative">
        <Input
          type="search"
          placeholder={language === 'en' ? "Search wiki content..." : "Rechercher dans le wiki..."}
          className="max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Badge className="absolute right-2 top-2">
            {filteredRoleCards.length + filteredFeatureCards.length} {language === 'en' ? 'results' : 'résultats'}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">
            {language === 'en' ? 'User Roles' : 'Rôles d\'Utilisateur'}
          </TabsTrigger>
          <TabsTrigger value="features">
            {language === 'en' ? 'System Features' : 'Fonctionnalités du Système'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoleCards.map((card) => (
              <Link href={card.link} key={card.id}>
                <Card className="h-full transition-all hover:bg-accent hover:text-accent-foreground cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl">{card.title}</CardTitle>
                    {card.icon}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {filteredFeatureCards.map((card) => (
              <Link href={card.link} key={card.id}>
                <Card className="h-full transition-all hover:bg-accent hover:text-accent-foreground cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl">{card.title}</CardTitle>
                    {card.icon}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 