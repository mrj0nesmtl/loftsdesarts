"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, ArrowLeft, Building, Home, Receipt, Shield, MessageCircle, Calendar, ChevronRight } from "lucide-react";
import Link from 'next/link';

// Wiki system language type
type WikiLanguage = 'en' | 'fr';

export default function ResidentOwnerWikiPage() {
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
          {language === 'en' ? 'Resident Owner User Guide' : 'Guide Utilisateur - Propriétaire Résident'}
        </h1>
        <Badge variant="outline" className="mt-2 md:mt-0 text-sm md:text-base px-3 py-1 border-primary text-primary">
          {language === 'en' ? 'ROLE: RESIDENT OWNER' : 'RÔLE: PROPRIÉTAIRE RÉSIDENT'}
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
              {language === 'en' ? 'Common Tasks' : 'Tâches courantes'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Property Management' : 'Gestion immobilière'}
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
                  ? 'As a Resident Owner at Lofts des Arts, you are both a property owner and a resident of the building. You have special privileges related to property management, building decisions, and access to owner-specific features. This guide outlines how to use the system to manage your property, submit maintenance requests, participate in building governance, and access owner services.'
                  : 'En tant que Propriétaire Résident aux Lofts des Arts, vous êtes à la fois propriétaire d\'un bien immobilier et résident de l\'immeuble. Vous bénéficiez de privilèges spéciaux liés à la gestion immobilière, aux décisions concernant l\'immeuble et à l\'accès aux fonctionnalités spécifiques aux propriétaires. Ce guide explique comment utiliser le système pour gérer votre propriété, soumettre des demandes d\'entretien, participer à la gouvernance de l\'immeuble et accéder aux services destinés aux propriétaires.'}
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
                    ? 'Managing your property and keeping information up-to-date' 
                    : 'Gérer votre propriété et maintenir les informations à jour'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Paying condo fees and special assessments on time' 
                    : 'Payer les frais de copropriété et les cotisations spéciales à temps'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Participating in building governance through voting on issues' 
                    : 'Participer à la gouvernance de l\'immeuble en votant sur les questions importantes'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Reporting maintenance issues and building concerns' 
                    : 'Signaler les problèmes d\'entretien et les préoccupations concernant l\'immeuble'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Adhering to building bylaws and regulations' 
                    : 'Respecter les règlements et les statuts de l\'immeuble'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Updating emergency contact information' 
                    : 'Mettre à jour les coordonnées d\'urgence'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Managing building access for guests and service providers' 
                    : 'Gérer l\'accès à l\'immeuble pour les invités et les prestataires de services'}
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
                  ? 'Your dashboard is designed to provide quick access to the tools you need most frequently:' 
                  : 'Votre tableau de bord est conçu pour vous offrir un accès rapide aux outils dont vous avez le plus souvent besoin :'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Home className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Property Overview' : 'Aperçu de la propriété'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'View property details, documents, and history' 
                        : 'Consulter les détails, documents et historique de votre propriété'}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Receipt className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Payment Center' : 'Centre de paiement'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Manage condo fees, view payment history, and make payments' 
                        : 'Gérer les frais de copropriété, consulter l\'historique et effectuer des paiements'}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Building Governance' : 'Gouvernance de l\'immeuble'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'View meeting minutes, vote on issues, and access documents' 
                        : 'Consulter les procès-verbaux, voter sur des questions et accéder aux documents'}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Communications' : 'Communications'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Messages from management, building announcements, and notifications' 
                        : 'Messages de la gestion, annonces de l\'immeuble et notifications'}
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
                  <h3 className="text-lg font-medium">{language === 'en' ? 'Property Management' : 'Gestion immobilière'}</h3>
                </div>
                <ul className="list-disc list-inside pl-6 space-y-1">
                  <li>{language === 'en' ? 'Property details and documentation access' : 'Accès aux détails et à la documentation de la propriété'}</li>
                  <li>{language === 'en' ? 'Maintenance request submission and tracking' : 'Soumission et suivi des demandes d\'entretien'}</li>
                  <li>{language === 'en' ? 'Insurance document management' : 'Gestion des documents d\'assurance'}</li>
                  <li>{language === 'en' ? 'Renovation request submissions' : 'Soumission des demandes de rénovation'}</li>
                </ul>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <Receipt className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-lg font-medium">{language === 'en' ? 'Financial Management' : 'Gestion financière'}</h3>
                </div>
                <ul className="list-disc list-inside pl-6 space-y-1">
                  <li>{language === 'en' ? 'Condo fee payment history and receipts' : 'Historique des paiements des frais de copropriété et reçus'}</li>
                  <li>{language === 'en' ? 'Special assessment payment processing' : 'Traitement des paiements de cotisations spéciales'}</li>
                  <li>{language === 'en' ? 'Financial statement access' : 'Accès aux états financiers'}</li>
                  <li>{language === 'en' ? 'Tax document access' : 'Accès aux documents fiscaux'}</li>
                </ul>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <Building className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-lg font-medium">{language === 'en' ? 'Building Governance' : 'Gouvernance de l\'immeuble'}</h3>
                </div>
                <ul className="list-disc list-inside pl-6 space-y-1">
                  <li>{language === 'en' ? 'Electronic voting on building issues' : 'Vote électronique sur les questions relatives à l\'immeuble'}</li>
                  <li>{language === 'en' ? 'Meeting schedules and calendar' : 'Calendrier et horaires des réunions'}</li>
                  <li>{language === 'en' ? 'Building document repository' : 'Dépôt de documents relatifs à l\'immeuble'}</li>
                  <li>{language === 'en' ? 'Board meeting minutes' : 'Procès-verbaux des réunions du conseil'}</li>
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
                      {language === 'en' ? 'Dashboard → Maintenance' : 'Tableau de bord → Entretien'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Report issues with your unit or common areas that need repair' 
                        : 'Signaler des problèmes avec votre unité ou les espaces communs nécessitant une réparation'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Pay Condo Fees' : 'Payer les frais de copropriété'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Dashboard → Payment Center' : 'Tableau de bord → Centre de paiement'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'View outstanding balances and make monthly payments' 
                        : 'Consulter les soldes impayés et effectuer des paiements mensuels'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Vote on Building Issues' : 'Voter sur les questions relatives à l\'immeuble'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Dashboard → Building Governance → Voting' : 'Tableau de bord → Gouvernance → Vote'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Participate in electronic voting on building matters' 
                        : 'Participer au vote électronique sur les questions relatives à l\'immeuble'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Request Renovations' : 'Demander des rénovations'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Dashboard → Property → Renovation Requests' : 'Tableau de bord → Propriété → Demandes de rénovation'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Submit plans for unit renovations requiring board approval' 
                        : 'Soumettre des plans pour les rénovations d\'unités nécessitant l\'approbation du conseil'}
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
                      ? 'I cannot access my financial statements'
                      : 'Je ne peux pas accéder à mes relevés financiers'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Make sure your account is verified and that your ownership status is confirmed by the administrator. If problems persist, contact the building manager.'
                      : 'Assurez-vous que votre compte est vérifié et que votre statut de propriétaire est confirmé par l\'administrateur. Si les problèmes persistent, contactez le gestionnaire de l\'immeuble.'}
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
                      ? 'Check the status of your request in the maintenance section. If it has been marked as "In Progress" for more than 7 days, use the "Escalate" button or contact the property manager directly.'
                      : 'Vérifiez l\'état de votre demande dans la section entretien. Si elle est marquée comme "En cours" depuis plus de 7 jours, utilisez le bouton "Escalader" ou contactez directement le gestionnaire immobilier.'}
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">
                    {language === 'en'
                      ? 'I need to update my ownership information'
                      : 'Je dois mettre à jour mes informations de propriété'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'To update ownership records, go to Profile → Property Information and submit the requested changes with supporting documentation. Changes will be reviewed by the administrator.'
                      : 'Pour mettre à jour les registres de propriété, allez dans Profil → Informations sur la propriété et soumettez les modifications demandées avec les documents justificatifs. Les modifications seront examinées par l\'administrateur.'}
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
                        ? 'Use the messaging feature to contact building management directly through the app.'
                        : 'Utilisez la fonction de messagerie pour contacter directement la gestion de l\'immeuble via l\'application.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Shield className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium mb-1">
                      {language === 'en' ? 'Building Manager' : 'Gestionnaire d\'immeuble'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'For urgent property matters, contact the building manager at manager@loftsdesarts.com or (514) 555-1234.'
                        : 'Pour les questions urgentes relatives à la propriété, contactez le gestionnaire de l\'immeuble à manager@loftsdesarts.com ou au (514) 555-1234.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium mb-1">
                      {language === 'en' ? 'Board Meetings' : 'Réunions du conseil'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'Attend monthly board meetings to discuss building matters in person. Schedule is available in the Building Governance section.'
                        : 'Assistez aux réunions mensuelles du conseil pour discuter des questions relatives à l\'immeuble en personne. Le calendrier est disponible dans la section Gouvernance de l\'immeuble.'}
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