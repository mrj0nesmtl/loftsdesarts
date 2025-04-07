"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Globe, ArrowLeft, Package, UserCheck, MessageCircle, Building, ChevronRight } from "lucide-react";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Wiki system language type
type WikiLanguage = 'en' | 'fr';

export default function DoormanWikiPage() {
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
            {language === 'en' ? 'Doorman User Guide' : 'Guide de l\'Utilisateur Concierge'}
          </h1>
          <Badge variant="outline" className="ml-2">
            {language === 'en' ? 'Role: DOORMAN' : 'Rôle: CONCIERGE'}
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
                  {language === 'en' ? 'Role Overview' : 'Aperçu du Rôle'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#responsibilities">
                  {language === 'en' ? 'Responsibilities' : 'Responsabilités'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#dashboard">
                  {language === 'en' ? 'Dashboard Overview' : 'Aperçu du Tableau de Bord'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#features">
                  {language === 'en' ? 'Available Features' : 'Fonctionnalités Disponibles'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#tasks">
                  {language === 'en' ? 'Common Tasks' : 'Tâches Courantes'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#workflows">
                  {language === 'en' ? 'Package Workflows' : 'Flux de Travail des Colis'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#troubleshooting">
                  {language === 'en' ? 'Troubleshooting' : 'Dépannage'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#practices">
                  {language === 'en' ? 'Best Practices' : 'Meilleures Pratiques'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#contacts">
                  {language === 'en' ? 'Important Contacts' : 'Contacts Importants'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#resources">
                  {language === 'en' ? 'Training Resources' : 'Ressources de Formation'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#support">
                  {language === 'en' ? 'Support Channels' : 'Canaux de Support'}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
            </nav>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Role Overview */}
          <Card id="overview">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Role Overview' : 'Aperçu du Rôle'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">
                {language === 'en' 
                  ? 'As a Doorman at Lofts des Arts, you are responsible for managing the reception desk, handling package deliveries, managing visitor access, and serving as the first point of contact for residents and visitors. This guide provides information on using the system features relevant to your role.'
                  : 'En tant que Concierge aux Lofts des Arts, vous êtes responsable de la gestion du bureau d\'accueil, de la gestion des livraisons de colis, de la gestion de l\'accès des visiteurs et vous servez de premier point de contact pour les résidents et les visiteurs. Ce guide fournit des informations sur l\'utilisation des fonctionnalités du système pertinentes pour votre rôle.'
                }
              </p>
            </CardContent>
          </Card>
          
          {/* Responsibilities */}
          <Card id="responsibilities">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Responsibilities' : 'Responsabilités'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-1">
                {language === 'en' ? (
                  <>
                    <li>Receiving and logging packages for residents</li>
                    <li>Notifying residents about package arrivals</li>
                    <li>Managing package pickup and verification</li>
                    <li>Recording visitor information</li>
                    <li>Providing building information to visitors</li>
                    <li>Handling general inquiries</li>
                    <li>Monitoring lobby security</li>
                    <li>Supporting resident requests at the front desk</li>
                  </>
                ) : (
                  <>
                    <li>Réception et enregistrement des colis pour les résidents</li>
                    <li>Notification des résidents concernant l'arrivée des colis</li>
                    <li>Gestion du ramassage et de la vérification des colis</li>
                    <li>Enregistrement des informations sur les visiteurs</li>
                    <li>Fournir des informations sur l'immeuble aux visiteurs</li>
                    <li>Traitement des demandes générales</li>
                    <li>Surveillance de la sécurité du hall d'entrée</li>
                    <li>Soutien aux demandes des résidents à la réception</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
          
          {/* Dashboard Overview */}
          <Card id="dashboard">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Dashboard Overview' : 'Aperçu du Tableau de Bord'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {language === 'en'
                  ? 'Your dashboard is designed to provide quick access to the tools you need most frequently:'
                  : 'Votre tableau de bord est conçu pour fournir un accès rapide aux outils dont vous avez le plus souvent besoin:'
                }
              </p>
              
              <div className="bg-muted p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Package className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">
                        {language === 'en' ? 'Package Management' : 'Gestion des Colis'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en'
                          ? 'Overview of recently arrived packages and pending pickups'
                          : 'Aperçu des colis récemment arrivés et des ramassages en attente'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <UserCheck className="h-8 w-8 text-orange-500" />
                    <div>
                      <h3 className="font-semibold">
                        {language === 'en' ? 'Visitor Log' : 'Journal des Visiteurs'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en'
                          ? 'Current visitors in the building and recent check-ins'
                          : 'Visiteurs actuellement dans l\'immeuble et enregistrements récents'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building className="h-8 w-8 text-green-500" />
                    <div>
                      <h3 className="font-semibold">
                        {language === 'en' ? 'Resident Directory' : 'Répertoire des Résidents'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en'
                          ? 'Quick access to resident contact information'
                          : 'Accès rapide aux coordonnées des résidents'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageCircle className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">
                        {language === 'en' ? 'Announcements' : 'Annonces'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en'
                          ? 'Important building notifications and updates'
                          : 'Notifications et mises à jour importantes concernant l\'immeuble'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Available Features */}
          <Card id="features">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Available Features' : 'Fonctionnalités Disponibles'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Package Management */}
              <div>
                <h3 className="text-lg font-semibold flex items-center">
                  <Package className="h-5 w-5 mr-2 text-primary" />
                  {language === 'en' ? 'Package Management' : 'Gestion des Colis'}
                </h3>
                <Separator className="my-2" />
                <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                  {language === 'en' ? (
                    <>
                      <li><strong>Package Logging</strong>: Record new package arrivals</li>
                      <li><strong>QR Code Generation</strong>: Create unique QR codes for package tracking</li>
                      <li><strong>Resident Notifications</strong>: Send automated alerts when packages arrive</li>
                      <li><strong>Pickup Management</strong>: Process and verify package pickups</li>
                      <li><strong>Package History</strong>: View historical package data and status</li>
                      <li><strong>Package Analytics</strong>: Basic package volume reporting</li>
                    </>
                  ) : (
                    <>
                      <li><strong>Enregistrement des Colis</strong>: Enregistrer les nouvelles arrivées de colis</li>
                      <li><strong>Génération de Code QR</strong>: Créer des codes QR uniques pour le suivi des colis</li>
                      <li><strong>Notifications aux Résidents</strong>: Envoyer des alertes automatisées lors de l'arrivée des colis</li>
                      <li><strong>Gestion des Ramassages</strong>: Traiter et vérifier les ramassages de colis</li>
                      <li><strong>Historique des Colis</strong>: Consulter les données historiques et l'état des colis</li>
                      <li><strong>Analyse des Colis</strong>: Rapports de base sur le volume de colis</li>
                    </>
                  )}
                </ul>
              </div>
              
              {/* Visitor Management */}
              <div>
                <h3 className="text-lg font-semibold flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-orange-500" />
                  {language === 'en' ? 'Visitor Management' : 'Gestion des Visiteurs'}
                </h3>
                <Separator className="my-2" />
                <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                  {language === 'en' ? (
                    <>
                      <li><strong>Visitor Check-In</strong>: Record visitor information and destination</li>
                      <li><strong>Resident Verification</strong>: Confirm visitor authorization with residents</li>
                      <li><strong>Visitor Badges</strong>: Generate temporary visitor badges</li>
                      <li><strong>Expected Visitors</strong>: View list of pre-authorized visitors</li>
                      <li><strong>Visitor History</strong>: Access records of past visitors</li>
                    </>
                  ) : (
                    <>
                      <li><strong>Enregistrement des Visiteurs</strong>: Enregistrer les informations et la destination des visiteurs</li>
                      <li><strong>Vérification des Résidents</strong>: Confirmer l'autorisation des visiteurs auprès des résidents</li>
                      <li><strong>Badges Visiteurs</strong>: Générer des badges temporaires pour les visiteurs</li>
                      <li><strong>Visiteurs Attendus</strong>: Consulter la liste des visiteurs pré-autorisés</li>
                      <li><strong>Historique des Visiteurs</strong>: Accéder aux enregistrements des visiteurs précédents</li>
                    </>
                  )}
                </ul>
              </div>
              
              {/* Add more sections as needed */}
            </CardContent>
          </Card>
          
          {/* Common Tasks */}
          <Card id="tasks">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Common Tasks' : 'Tâches Courantes'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Package Management Tasks */}
              <div>
                <h3 className="text-lg font-semibold">
                  {language === 'en' ? 'Package Management' : 'Gestion des Colis'}
                </h3>
                <Separator className="my-2" />
                
                <div className="mt-4 space-y-4">
                  <div className="bg-accent/50 p-4 rounded-md">
                    <h4 className="font-medium">
                      {language === 'en' ? 'Logging a New Package' : 'Enregistrer un Nouveau Colis'}
                    </h4>
                    <ol className="list-decimal pl-6 mt-2 text-sm space-y-1">
                      {language === 'en' ? (
                        <>
                          <li>Click <strong>Packages &gt; Log New Package</strong></li>
                          <li>Scan or enter the tracking number</li>
                          <li>Select the resident recipient</li>
                          <li>Choose the package size and type</li>
                          <li>Take a photo of the package (optional)</li>
                          <li>Specify storage location</li>
                          <li>Click <strong>Submit</strong> to generate QR code and notification</li>
                        </>
                      ) : (
                        <>
                          <li>Cliquez sur <strong>Colis &gt; Enregistrer un Nouveau Colis</strong></li>
                          <li>Scannez ou saisissez le numéro de suivi</li>
                          <li>Sélectionnez le résident destinataire</li>
                          <li>Choisissez la taille et le type de colis</li>
                          <li>Prenez une photo du colis (facultatif)</li>
                          <li>Spécifiez l'emplacement de stockage</li>
                          <li>Cliquez sur <strong>Soumettre</strong> pour générer le code QR et la notification</li>
                        </>
                      )}
                    </ol>
                  </div>
                  
                  <div className="bg-accent/50 p-4 rounded-md">
                    <h4 className="font-medium">
                      {language === 'en' ? 'Processing a Package Pickup' : 'Traiter un Ramassage de Colis'}
                    </h4>
                    <ol className="list-decimal pl-6 mt-2 text-sm space-y-1">
                      {language === 'en' ? (
                        <>
                          <li>Click <strong>Packages &gt; Process Pickup</strong></li>
                          <li>Scan the package QR code</li>
                          <li>Verify resident identity</li>
                          <li>Capture resident signature</li>
                          <li>Click <strong>Complete Pickup</strong></li>
                          <li>Package status will update automatically</li>
                        </>
                      ) : (
                        <>
                          <li>Cliquez sur <strong>Colis &gt; Traiter un Ramassage</strong></li>
                          <li>Scannez le code QR du colis</li>
                          <li>Vérifiez l'identité du résident</li>
                          <li>Capturez la signature du résident</li>
                          <li>Cliquez sur <strong>Compléter le Ramassage</strong></li>
                          <li>Le statut du colis sera mis à jour automatiquement</li>
                        </>
                      )}
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* More cards for different sections */}
          {/* Package Workflows, Troubleshooting, Best Practices, etc. */}
          
          {/* Troubleshooting */}
          <Card id="troubleshooting">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Troubleshooting' : 'Dépannage'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="text-lg font-semibold">
                {language === 'en' ? 'Common Issues' : 'Problèmes Courants'}
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'en' ? 'Issue' : 'Problème'}</TableHead>
                    <TableHead>{language === 'en' ? 'Resolution' : 'Résolution'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {language === 'en' ? (
                    <>
                      <TableRow>
                        <TableCell className="font-medium">Package scanning failure</TableCell>
                        <TableCell>Clean scanner, manually enter tracking number, restart scanner app</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Resident not found in system</TableCell>
                        <TableCell>Check alternate spellings, search by unit number, contact management</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Unable to send notification</TableCell>
                        <TableCell>Use alternative contact method, check resident profile for updated info</TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell className="font-medium">Échec de numérisation du colis</TableCell>
                        <TableCell>Nettoyez le scanner, saisissez manuellement le numéro de suivi, redémarrez l'application du scanner</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Résident introuvable dans le système</TableCell>
                        <TableCell>Vérifiez les orthographes alternatives, recherchez par numéro d'unité, contactez la gestion</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Impossible d'envoyer une notification</TableCell>
                        <TableCell>Utilisez une méthode de contact alternative, vérifiez le profil du résident pour les informations mises à jour</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Support Channels */}
          <Card id="support">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Support Channels' : 'Canaux de Support'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                {language === 'en'
                  ? 'If you encounter issues not covered in this guide:'
                  : 'Si vous rencontrez des problèmes non couverts dans ce guide:'
                }
              </p>
              <ul className="list-disc pl-6 space-y-2">
                {language === 'en' ? (
                  <>
                    <li><strong>Help Desk</strong>: Ext. 105 or help@loftsdesarts.com</li>
                    <li><strong>Technical Support</strong>: IT Support Portal (available on staff computers)</li>
                    <li><strong>Supervisor Assistance</strong>: Contact the building manager directly</li>
                  </>
                ) : (
                  <>
                    <li><strong>Service d'Assistance</strong>: Poste 105 ou help@loftsdesarts.com</li>
                    <li><strong>Support Technique</strong>: Portail de Support IT (disponible sur les ordinateurs du personnel)</li>
                    <li><strong>Assistance du Superviseur</strong>: Contactez directement le gestionnaire de l'immeuble</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 