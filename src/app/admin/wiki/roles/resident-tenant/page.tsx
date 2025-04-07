"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, ArrowLeft, Home, Bell, MessageCircle, Calendar, Package, FileText, ChevronRight } from "lucide-react";
import Link from 'next/link';

// Wiki system language type
type WikiLanguage = 'en' | 'fr';

export default function ResidentTenantWikiPage() {
  // State for language selection
  const [language, setLanguage] = useState<WikiLanguage>('en');

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <div className="container mx-auto pb-16">
      {/* Header with back button and language toggle */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/wiki" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-1 h-4 w-4" />
          {language === 'en' ? 'Back to Wiki' : 'Retour au Wiki'}
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          {language === 'en' ? 'Français' : 'English'}
        </Button>
      </div>

      {/* Title and Role badge */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {language === 'en' ? 'Resident Tenant User Guide' : 'Guide Utilisateur - Locataire Résident'}
        </h1>
        <Badge variant="outline" className="mt-2 md:mt-0 text-sm md:text-base px-3 py-1 border-primary text-primary">
          {language === 'en' ? 'ROLE: RESIDENT TENANT' : 'RÔLE: LOCATAIRE RÉSIDENT'}
        </Badge>
      </div>

      {/* Version info and last updated */}
      <div className="p-4 bg-muted/50 rounded-md mb-8">
        <p className="text-sm text-muted-foreground">
          {language === 'en' 
            ? 'Last Updated: April 7, 2023 | App Version: 0.5.0' 
            : 'Dernière mise à jour: 7 avril 2023 | Version de l\'application: 0.5.0'}
        </p>
      </div>

      {/* Content layout - split into sidebar and main content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar navigation */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Navigation' : 'Navigation'}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2 p-0">
            <Button variant="ghost" className="justify-start pl-6 relative">
              <span className="absolute left-0 w-1 h-5 bg-primary rounded-r-full"></span>
              {language === 'en' ? 'Role Overview' : 'Aperçu du rôle'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Responsibilities' : 'Responsabilités'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Dashboard Overview' : 'Aperçu du tableau de bord'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Available Features' : 'Fonctionnalités disponibles'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Building Services' : 'Services de l\'immeuble'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Common Tasks' : 'Tâches courantes'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Troubleshooting' : 'Dépannage'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Support Channels' : 'Canaux de support'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Main content */}
        <div className="md:col-span-3 space-y-8">
          {/* Role Overview */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Role Overview' : 'Aperçu du rôle'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {language === 'en' 
                  ? 'As a Resident Tenant at Lofts des Arts, you live in the building under a rental agreement. This guide will help you navigate the platform features available to you as a tenant, including submitting maintenance requests, receiving notifications, and accessing tenant services. The system is designed to make your living experience more convenient and to facilitate communication with building management.'
                  : 'En tant que Locataire Résident aux Lofts des Arts, vous vivez dans l\'immeuble selon un contrat de location. Ce guide vous aidera à naviguer dans les fonctionnalités de la plateforme qui vous sont accessibles en tant que locataire, notamment la soumission de demandes d\'entretien, la réception de notifications et l\'accès aux services pour locataires. Le système est conçu pour rendre votre expérience de vie plus pratique et pour faciliter la communication avec la gestion de l\'immeuble.'}
              </p>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Responsibilities' : 'Responsabilités'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  {language === 'en' 
                    ? 'Promptly reporting maintenance issues in your unit' 
                    : 'Signaler rapidement les problèmes d\'entretien dans votre unité'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Keeping your contact information up-to-date in the system' 
                    : 'Maintenir vos coordonnées à jour dans le système'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Following building rules and regulations' 
                    : 'Respecter les règles et règlements de l\'immeuble'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Registering guests according to building policy' 
                    : 'Enregistrer les invités conformément à la politique de l\'immeuble'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Responding to important notices from building management' 
                    : 'Répondre aux avis importants de la gestion de l\'immeuble'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Scheduling move-in/move-out through the system when applicable' 
                    : 'Planifier les déménagements/emménagements via le système lorsque applicable'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Retrieving packages in a timely manner when notified' 
                    : 'Récupérer les colis en temps opportun lorsque notifié'}
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Dashboard Overview */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Dashboard Overview' : 'Aperçu du tableau de bord'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                {language === 'en' 
                  ? 'Your dashboard is designed to provide quick access to essential services:' 
                  : 'Votre tableau de bord est conçu pour offrir un accès rapide aux services essentiels :'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Home className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'My Apartment' : 'Mon appartement'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Access information about your rental unit and lease' 
                        : 'Accéder aux informations sur votre unité de location et votre bail'}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Maintenance Requests' : 'Demandes d\'entretien'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Submit and track repair or maintenance requests' 
                        : 'Soumettre et suivre des demandes de réparation ou d\'entretien'}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Building Notifications' : 'Notifications de l\'immeuble'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'View announcements and updates from management' 
                        : 'Consulter les annonces et mises à jour de la gestion'}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Package Tracking' : 'Suivi des colis'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Receive notifications and manage package deliveries' 
                        : 'Recevoir des notifications et gérer les livraisons de colis'}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Available Features */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Available Features' : 'Fonctionnalités disponibles'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center mb-2">
                  <Home className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-lg font-medium">{language === 'en' ? 'Apartment Management' : 'Gestion de l\'appartement'}</h3>
                </div>
                <ul className="list-disc list-inside pl-6 space-y-1">
                  <li>{language === 'en' ? 'Lease information and important dates' : 'Informations sur le bail et dates importantes'}</li>
                  <li>{language === 'en' ? 'Rental payment records and receipts' : 'Relevés de paiement du loyer et reçus'}</li>
                  <li>{language === 'en' ? 'Move-in/move-out scheduling' : 'Planification des déménagements/emménagements'}</li>
                  <li>{language === 'en' ? 'Apartment inspection reports' : 'Rapports d\'inspection de l\'appartement'}</li>
                </ul>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-lg font-medium">{language === 'en' ? 'Service Requests' : 'Demandes de service'}</h3>
                </div>
                <ul className="list-disc list-inside pl-6 space-y-1">
                  <li>{language === 'en' ? 'Maintenance request submission with photo attachments' : 'Soumission de demandes d\'entretien avec pièces jointes photo'}</li>
                  <li>{language === 'en' ? 'Service request status tracking' : 'Suivi de l\'état des demandes de service'}</li>
                  <li>{language === 'en' ? 'Service history for your apartment' : 'Historique des services pour votre appartement'}</li>
                  <li>{language === 'en' ? 'Emergency maintenance reporting' : 'Signalement d\'entretien d\'urgence'}</li>
                </ul>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-lg font-medium">{language === 'en' ? 'Building Amenities' : 'Équipements de l\'immeuble'}</h3>
                </div>
                <ul className="list-disc list-inside pl-6 space-y-1">
                  <li>{language === 'en' ? 'Amenity booking (gym, common rooms, etc.)' : 'Réservation d\'équipements (gym, salles communes, etc.)'}</li>
                  <li>{language === 'en' ? 'Building events calendar' : 'Calendrier des événements de l\'immeuble'}</li>
                  <li>{language === 'en' ? 'Guest registration for facility access' : 'Enregistrement des invités pour l\'accès aux installations'}</li>
                  <li>{language === 'en' ? 'Amenity usage policies and guidelines' : 'Politiques et directives d\'utilisation des équipements'}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Common Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Common Tasks' : 'Tâches courantes'}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'en' ? 'Task' : 'Tâche'}</TableHead>
                    <TableHead>{language === 'en' ? 'Location' : 'Emplacement'}</TableHead>
                    <TableHead>{language === 'en' ? 'Description' : 'Description'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Submit Maintenance Request' : 'Soumettre une demande d\'entretien'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Dashboard → Maintenance Requests → New Request' : 'Tableau de bord → Demandes d\'entretien → Nouvelle demande'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Report issues in your apartment that need repair or attention' 
                        : 'Signaler les problèmes dans votre appartement nécessitant une réparation ou une attention'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Register a Guest' : 'Enregistrer un invité'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Dashboard → Building Access → Guest Registration' : 'Tableau de bord → Accès à l\'immeuble → Enregistrement d\'invité'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Pre-register guests for building access and amenity usage' 
                        : 'Pré-enregistrer les invités pour l\'accès à l\'immeuble et l\'utilisation des équipements'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Book an Amenity' : 'Réserver un équipement'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Dashboard → Building Amenities → Make Reservation' : 'Tableau de bord → Équipements de l\'immeuble → Faire une réservation'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Reserve common areas or facilities for personal use' 
                        : 'Réserver des espaces communs ou des installations pour un usage personnel'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'View Package Notifications' : 'Consulter les notifications de colis'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Dashboard → Package Tracking' : 'Tableau de bord → Suivi des colis'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Check for package deliveries and pickup instructions' 
                        : 'Vérifier les livraisons de colis et les instructions de ramassage'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Troubleshooting' : 'Dépannage'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">
                    {language === 'en' 
                      ? 'I cannot access my account'
                      : 'Je ne peux pas accéder à mon compte'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Use the "Forgot Password" link on the login screen to reset your password. If issues persist, contact the property manager with your full name and apartment number for account verification.'
                      : 'Utilisez le lien "Mot de passe oublié" sur l\'écran de connexion pour réinitialiser votre mot de passe. Si les problèmes persistent, contactez le gestionnaire immobilier avec votre nom complet et votre numéro d\'appartement pour la vérification du compte.'}
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">
                    {language === 'en'
                      ? 'My maintenance request is not being addressed'
                      : 'Ma demande d\'entretien n\'est pas traitée'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Check the status of your request in the Maintenance Requests section. If your request has been open for more than 48 hours without updates, use the "Follow-up" button to request an update from management.'
                      : 'Vérifiez l\'état de votre demande dans la section Demandes d\'entretien. Si votre demande est ouverte depuis plus de 48 heures sans mise à jour, utilisez le bouton "Suivi" pour demander une mise à jour à la gestion.'}
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">
                    {language === 'en'
                      ? 'I\'m not receiving package notifications'
                      : 'Je ne reçois pas les notifications de colis'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Check your notification settings in Profile → Notifications to ensure package alerts are enabled. Verify that your email and phone number are correct. Also check your email spam folder as notifications may be filtered there.'
                      : 'Vérifiez vos paramètres de notification dans Profil → Notifications pour vous assurer que les alertes de colis sont activées. Vérifiez que votre email et votre numéro de téléphone sont corrects. Vérifiez également votre dossier de spam, car les notifications peuvent y être filtrées.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Channels */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Support Channels' : 'Canaux de support'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MessageCircle className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium mb-1">
                      {language === 'en' ? 'In-App Messaging' : 'Messagerie dans l\'application'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'Send messages directly to building management through the app\'s messaging feature.'
                        : 'Envoyez des messages directement à la gestion de l\'immeuble via la fonction de messagerie de l\'application.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FileText className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium mb-1">
                      {language === 'en' ? 'Resident Support Desk' : 'Bureau d\'assistance aux résidents'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'Visit the front desk during operating hours (8AM-8PM daily) for in-person assistance with any issues.'
                        : 'Visitez la réception pendant les heures d\'ouverture (8h-20h tous les jours) pour une assistance en personne concernant tout problème.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Bell className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium mb-1">
                      {language === 'en' ? 'Emergency Contact' : 'Contact d\'urgence'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'For urgent issues outside of business hours, call the 24/7 emergency line at (514) 555-9876.'
                        : 'Pour les problèmes urgents en dehors des heures d\'ouverture, appelez la ligne d\'urgence 24/7 au (514) 555-9876.'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 