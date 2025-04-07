"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Globe, ArrowLeft, Package, ChevronRight, QrCode, Bell, Clock, BarChart } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

// Wiki system language type
type WikiLanguage = 'en' | 'fr';

export default function PackageManagementWikiPage() {
  const [language, setLanguage] = useState<WikiLanguage>('en');

  // Version information
  const version = language === 'en' ? "0.5.0" : "0.5.0";
  const lastUpdated = language === 'en' ? "April 7, 2025" : "7 avril 2025";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/admin/wiki">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Back to Wiki' : 'Retour au Wiki'}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {language === 'en' ? 'Package Management' : 'Gestion des Colis'}
          </h1>
          <Badge variant="outline" className="ml-2">
            {language === 'en' ? 'Feature' : 'Fonctionnalité'}
          </Badge>
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
      
      <Card>
        <CardHeader>
          <CardDescription>
            {language === 'en' 
              ? `Last Updated: ${lastUpdated} | App Version: ${version}`
              : `Dernière mise à jour: ${lastUpdated} | Version de l'application: ${version}`
            }
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Sidebar Navigation */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Navigation' : 'Navigation'}</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#overview">
                  {language === 'en' ? 'Feature Overview' : 'Aperçu de la Fonctionnalité'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#benefits">
                  {language === 'en' ? 'Key Benefits' : 'Avantages Clés'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#features">
                  {language === 'en' ? 'Core Features' : 'Fonctionnalités Principales'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#howto">
                  {language === 'en' ? 'How to Use' : 'Comment Utiliser'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#roles">
                  {language === 'en' ? 'Role-Based Access' : 'Accès Basé sur les Rôles'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#faq">
                  {language === 'en' ? 'FAQ' : 'FAQ'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
            </nav>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Feature Overview */}
          <Card id="overview">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Feature Overview' : 'Aperçu de la Fonctionnalité'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base">
                {language === 'en' 
                  ? 'The Package Management System provides a comprehensive solution for tracking and managing resident packages within the Lofts des Arts property. It simplifies the process of receiving, logging, storing, and distributing packages while keeping residents informed about their deliveries.'
                  : 'Le système de gestion de colis fournit une solution complète pour le suivi et la gestion des colis des résidents au sein de la propriété Lofts des Arts. Il simplifie le processus de réception, d\'enregistrement, de stockage et de distribution des colis tout en tenant les résidents informés de leurs livraisons.'
                }
              </p>
              
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="h-24 w-24 text-muted-foreground/30" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-background/0 p-4">
                  <p className="text-sm text-center font-medium">
                    {language === 'en' 
                      ? 'Package Management System Interface' 
                      : 'Interface du Système de Gestion des Colis'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Key Benefits */}
          <Card id="benefits">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Key Benefits' : 'Avantages Clés'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {language === 'en' ? 'Efficient Management' : 'Gestion Efficace'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'Streamline package logging, tracking, and delivery processes to save time and improve accuracy.'
                        : 'Simplifiez les processus d\'enregistrement, de suivi et de livraison des colis pour gagner du temps et améliorer la précision.'
                      }
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {language === 'en' ? 'Automated Notifications' : 'Notifications Automatisées'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'Keep residents informed automatically when packages arrive, reducing staff workload.'
                        : 'Tenez les résidents informés automatiquement de l\'arrivée des colis, ce qui réduit la charge de travail du personnel.'
                      }
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {language === 'en' ? 'Secure Verification' : 'Vérification Sécurisée'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'Ensure packages are delivered to the right recipients with identity verification and digital signatures.'
                        : 'Assurez-vous que les colis sont livrés aux bons destinataires grâce à la vérification d\'identité et aux signatures numériques.'
                      }
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {language === 'en' ? 'Complete Audit Trail' : 'Piste d\'Audit Complète'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'Maintain detailed records of all package activity from arrival to delivery for accountability.'
                        : 'Conservez des enregistrements détaillés de toutes les activités des colis, de l\'arrivée à la livraison, pour la responsabilisation.'
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          {/* Core Features */}
          <Card id="features">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Core Features' : 'Fonctionnalités Principales'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <QrCode className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">
                      {language === 'en' ? 'QR Code Tracking' : 'Suivi par Code QR'}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-9">
                    {language === 'en'
                      ? 'Generate unique QR codes for each package to enable quick tracking and verification during pickup.'
                      : 'Génération de codes QR uniques pour chaque colis permettant un suivi et une vérification rapides lors du ramassage.'
                    }
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-500/10 p-2 rounded-full">
                      <Bell className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="font-medium">
                      {language === 'en' ? 'Resident Alerts' : 'Alertes aux Résidents'}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-9">
                    {language === 'en'
                      ? 'Send automated notifications to residents via email and SMS when packages arrive.'
                      : 'Envoi de notifications automatisées aux résidents par email et SMS lorsque les colis arrivent.'
                    }
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="bg-amber-500/10 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-amber-500" />
                    </div>
                    <h3 className="font-medium">
                      {language === 'en' ? 'Status Tracking' : 'Suivi de Statut'}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-9">
                    {language === 'en'
                      ? 'Track package status throughout its lifecycle: received, notified, picked up, or returned.'
                      : 'Suivi du statut du colis tout au long de son cycle de vie : reçu, notifié, ramassé ou retourné.'
                    }
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-500/10 p-2 rounded-full">
                      <BarChart className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="font-medium">
                      {language === 'en' ? 'Analytics Dashboard' : 'Tableau de Bord Analytique'}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-9">
                    {language === 'en'
                      ? 'View package volume trends, average pickup times, and carrier statistics.'
                      : 'Visualisation des tendances de volume de colis, des temps moyens de ramassage et des statistiques de transporteurs.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* How to Use */}
          <Card id="howto">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'How to Use' : 'Comment Utiliser'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h3 className="font-medium text-primary">
                    {language === 'en' ? '1. Logging a New Package' : '1. Enregistrer un Nouveau Colis'}
                  </h3>
                  <p className="text-sm">
                    {language === 'en'
                      ? 'Navigate to the Packages section, click "Log New Package", enter package details including tracking number, recipient, carrier, and storage location.'
                      : 'Naviguez vers la section Colis, cliquez sur "Enregistrer un Nouveau Colis", saisissez les détails du colis, y compris le numéro de suivi, le destinataire, le transporteur et l\'emplacement de stockage.'
                    }
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h3 className="font-medium text-primary">
                    {language === 'en' ? '2. Notifying Residents' : '2. Notifier les Résidents'}
                  </h3>
                  <p className="text-sm">
                    {language === 'en'
                      ? 'Notifications are sent automatically when a package is logged. You can also manually resend notifications for packages awaiting pickup.'
                      : 'Les notifications sont envoyées automatiquement lorsqu\'un colis est enregistré. Vous pouvez également renvoyer manuellement des notifications pour les colis en attente de ramassage.'
                    }
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h3 className="font-medium text-primary">
                    {language === 'en' ? '3. Processing Pickups' : '3. Traiter les Ramassages'}
                  </h3>
                  <p className="text-sm">
                    {language === 'en'
                      ? 'When a resident comes to collect a package, scan the QR code or search by resident name, verify identity, capture signature, and mark as delivered.'
                      : 'Lorsqu\'un résident vient chercher un colis, scannez le code QR ou recherchez par nom de résident, vérifiez l\'identité, capturez la signature et marquez comme livré.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* FAQ */}
          <Card id="faq">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Frequently Asked Questions' : 'Foire Aux Questions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">
                    {language === 'en' 
                      ? 'Can multiple staff members use the package system simultaneously?' 
                      : 'Plusieurs membres du personnel peuvent-ils utiliser le système de colis simultanément?'
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'en'
                      ? 'Yes, the system supports multiple concurrent users with real-time updates across all sessions.'
                      : 'Oui, le système prend en charge plusieurs utilisateurs simultanés avec des mises à jour en temps réel dans toutes les sessions.'
                    }
                  </p>
                  <Separator className="my-2" />
                </div>
                
                <div>
                  <h3 className="font-medium">
                    {language === 'en' 
                      ? 'What happens if a package is not picked up?' 
                      : 'Que se passe-t-il si un colis n\'est pas récupéré?'
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'en'
                      ? 'The system automatically sends reminder notifications after 3 days. Packages not claimed after 14 days can be marked for return or special handling.'
                      : 'Le système envoie automatiquement des notifications de rappel après 3 jours. Les colis non réclamés après 14 jours peuvent être marqués pour retour ou traitement spécial.'
                    }
                  </p>
                  <Separator className="my-2" />
                </div>
                
                <div>
                  <h3 className="font-medium">
                    {language === 'en' 
                      ? 'Can residents delegate package pickup to others?' 
                      : 'Les résidents peuvent-ils déléguer le ramassage des colis à d\'autres personnes?'
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'en'
                      ? 'Yes, residents can pre-authorize specific individuals to pick up packages on their behalf through the resident portal.'
                      : 'Oui, les résidents peuvent préautoriser des personnes spécifiques à récupérer des colis en leur nom via le portail des résidents.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 