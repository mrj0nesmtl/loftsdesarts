"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, ArrowLeft, Building, Hammer, Calendar, ClipboardList, Bell, Users, ChevronRight } from "lucide-react";
import Link from 'next/link';

// Wiki system language type
type WikiLanguage = 'en' | 'fr';

export default function PropertyManagerWikiPage() {
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
          {language === 'en' ? 'Property Manager User Guide' : 'Guide Utilisateur - Gestionnaire Immobilier'}
        </h1>
        <Badge variant="outline" className="mt-2 md:mt-0 text-sm md:text-base px-3 py-1 border-primary text-primary">
          {language === 'en' ? 'ROLE: PROPERTY MANAGER' : 'RÔLE: GESTIONNAIRE IMMOBILIER'}
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
              {language === 'en' ? 'Maintenance Management' : 'Gestion de l\'entretien'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Vendor Coordination' : 'Coordination des fournisseurs'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Resident Communications' : 'Communications avec les résidents'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Inspection Tools' : 'Outils d\'inspection'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Troubleshooting' : 'Dépannage'}
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
                  ? 'As a Property Manager at Lofts des Arts, you are responsible for maintaining the physical property, coordinating maintenance and repairs, and ensuring the building operates efficiently. You serve as the primary contact for residents regarding building maintenance issues, vendor coordination, and property inspections. This guide outlines how to use the system tools to effectively manage the property\'s day-to-day operations.'
                  : 'En tant que Gestionnaire Immobilier aux Lofts des Arts, vous êtes responsable de l\'entretien de la propriété, de la coordination des travaux de maintenance et de réparation, et vous assurez que l\'immeuble fonctionne efficacement. Vous servez de contact principal pour les résidents concernant les problèmes d\'entretien de l\'immeuble, la coordination des fournisseurs et les inspections de la propriété. Ce guide explique comment utiliser les outils du système pour gérer efficacement les opérations quotidiennes de la propriété.'}
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
                    ? 'Processing and responding to maintenance requests from residents' 
                    : 'Traiter et répondre aux demandes d\'entretien des résidents'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Coordinating with contractors and service providers for repairs' 
                    : 'Coordonner avec les entrepreneurs et prestataires de services pour les réparations'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Conducting regular property inspections and documenting conditions' 
                    : 'Effectuer des inspections régulières de la propriété et documenter les conditions'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Managing preventive maintenance schedules' 
                    : 'Gérer les calendriers d\'entretien préventif'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Overseeing building system operations (HVAC, plumbing, electrical)' 
                    : 'Superviser les opérations des systèmes du bâtiment (CVC, plomberie, électricité)'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Communicating with residents about maintenance activities' 
                    : 'Communiquer avec les résidents concernant les activités d\'entretien'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Managing building access and security systems' 
                    : 'Gérer l\'accès au bâtiment et les systèmes de sécurité'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Tracking maintenance expenses and budget adherence' 
                    : 'Suivre les dépenses d\'entretien et le respect du budget'}
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
                  ? 'Your property management dashboard provides quick access to essential tools:' 
                  : 'Votre tableau de bord de gestion immobilière offre un accès rapide aux outils essentiels :'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Hammer className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Maintenance Requests' : 'Demandes d\'entretien'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'View, assign, and track all maintenance requests' 
                        : 'Consulter, attribuer et suivre toutes les demandes d\'entretien'}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Scheduled Maintenance' : 'Entretien programmé'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Manage preventive maintenance schedules and recurring tasks' 
                        : 'Gérer les calendriers d\'entretien préventif et les tâches récurrentes'}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <ClipboardList className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Inspection Reports' : 'Rapports d\'inspection'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Create and manage property inspection reports' 
                        : 'Créer et gérer les rapports d\'inspection de la propriété'}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Building Systems' : 'Systèmes du bâtiment'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Monitor and manage building systems and equipment' 
                        : 'Surveiller et gérer les systèmes et équipements du bâtiment'}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Management */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Maintenance Management' : 'Gestion de l\'entretien'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                {language === 'en' 
                  ? 'The maintenance management system allows you to efficiently handle all repair and maintenance activities:' 
                  : 'Le système de gestion de l\'entretien vous permet de gérer efficacement toutes les activités de réparation et d\'entretien :'}
              </p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'en' ? 'Feature' : 'Fonctionnalité'}</TableHead>
                    <TableHead>{language === 'en' ? 'Location' : 'Emplacement'}</TableHead>
                    <TableHead>{language === 'en' ? 'Description' : 'Description'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Request Processing' : 'Traitement des demandes'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Dashboard → Maintenance → Requests' : 'Tableau de bord → Entretien → Demandes'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'View, prioritize, and assign maintenance requests' 
                        : 'Consulter, prioriser et attribuer les demandes d\'entretien'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Work Order Creation' : 'Création d\'ordres de travail'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Dashboard → Maintenance → Work Orders' : 'Tableau de bord → Entretien → Ordres de travail'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Create and manage work orders for contractors' 
                        : 'Créer et gérer les ordres de travail pour les entrepreneurs'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Preventive Maintenance' : 'Entretien préventif'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Dashboard → Maintenance → Preventive' : 'Tableau de bord → Entretien → Préventif'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Schedule and track recurring maintenance tasks' 
                        : 'Planifier et suivre les tâches d\'entretien récurrentes'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Expense Tracking' : 'Suivi des dépenses'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Dashboard → Maintenance → Expenses' : 'Tableau de bord → Entretien → Dépenses'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Record and track maintenance expenses and invoices' 
                        : 'Enregistrer et suivre les dépenses d\'entretien et les factures'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Vendor Coordination */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Vendor Coordination' : 'Coordination des fournisseurs'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  {language === 'en' 
                    ? 'Effectively manage relationships with service providers and contractors using these tools:'
                    : 'Gérez efficacement les relations avec les prestataires de services et les entrepreneurs à l\'aide de ces outils :'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">
                      {language === 'en' ? 'Vendor Directory' : 'Répertoire des fournisseurs'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'Maintain a comprehensive directory of all service providers, contractors, and vendors with contact information and service categories.'
                        : 'Maintenir un répertoire complet de tous les prestataires de services, entrepreneurs et fournisseurs avec les coordonnées et les catégories de services.'}
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">
                      {language === 'en' ? 'Service Agreements' : 'Contrats de service'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'Store and manage service contracts, warranty information, and service level agreements for easy reference.'
                        : 'Stocker et gérer les contrats de service, les informations de garantie et les accords de niveau de service pour une référence facile.'}
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">
                      {language === 'en' ? 'Work Order Tracking' : 'Suivi des ordres de travail'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'Assign work orders to vendors, track progress, and document completion for accountability.'
                        : 'Attribuer des ordres de travail aux fournisseurs, suivre la progression et documenter l\'achèvement pour la responsabilisation.'}
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">
                      {language === 'en' ? 'Vendor Performance' : 'Performance des fournisseurs'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'Rate and review vendor performance to maintain quality service standards and inform future hiring decisions.'
                        : 'Évaluer et examiner les performances des fournisseurs pour maintenir des normes de service de qualité et éclairer les décisions d\'embauche futures.'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resident Communications */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Resident Communications' : 'Communications avec les résidents'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  {language === 'en' 
                    ? 'Keep residents informed about maintenance activities and building operations:'
                    : 'Tenez les résidents informés des activités d\'entretien et des opérations du bâtiment :'}
                </p>

                <div>
                  <h3 className="text-lg font-medium mb-2">{language === 'en' ? 'Maintenance Notifications' : 'Notifications d\'entretien'}</h3>
                  <div className="p-4 border rounded-md bg-muted/20 mb-4">
                    <div className="flex items-start">
                      <Bell className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                      <div>
                        <h4 className="font-medium mb-1 text-sm">{language === 'en' ? 'Scheduled Maintenance Alerts' : 'Alertes d\'entretien programmé'}</h4>
                        <p className="text-xs text-muted-foreground">
                          {language === 'en'
                            ? 'Send automated notifications to residents about upcoming scheduled maintenance that may affect them.'
                            : 'Envoyer des notifications automatisées aux résidents concernant les entretiens programmés à venir qui peuvent les affecter.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md bg-muted/20 mb-4">
                    <div className="flex items-start">
                      <Users className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                      <div>
                        <h4 className="font-medium mb-1 text-sm">{language === 'en' ? 'Request Status Updates' : 'Mises à jour de l\'état des demandes'}</h4>
                        <p className="text-xs text-muted-foreground">
                          {language === 'en'
                            ? 'Provide timely updates to residents on the status of their maintenance requests.'
                            : 'Fournir des mises à jour opportunes aux résidents sur l\'état de leurs demandes d\'entretien.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md bg-muted/20">
                    <div className="flex items-start">
                      <Building className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                      <div>
                        <h4 className="font-medium mb-1 text-sm">{language === 'en' ? 'Building-Wide Announcements' : 'Annonces à l\'échelle du bâtiment'}</h4>
                        <p className="text-xs text-muted-foreground">
                          {language === 'en'
                            ? 'Distribute building-wide notices about system shutdowns, inspections, or major repairs.'
                            : 'Distribuer des avis à l\'échelle du bâtiment concernant les arrêts de système, les inspections ou les réparations majeures.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                      ? 'Work orders are not being assigned to vendors'
                      : 'Les ordres de travail ne sont pas attribués aux fournisseurs'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Verify that the vendor is active in the system and has the correct service categories assigned. Ensure that you have completed all required fields in the work order form.'
                      : 'Vérifiez que le fournisseur est actif dans le système et que les bonnes catégories de service lui sont attribuées. Assurez-vous que vous avez rempli tous les champs obligatoires dans le formulaire d\'ordre de travail.'}
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">
                    {language === 'en'
                      ? 'Preventive maintenance tasks are not appearing on schedule'
                      : 'Les tâches d\'entretien préventif n\'apparaissent pas selon le calendrier'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Check the recurring schedule settings for the task. Make sure the start date is correct and the frequency is properly configured. Verify that the task has not been manually disabled.'
                      : 'Vérifiez les paramètres de planification récurrente pour la tâche. Assurez-vous que la date de début est correcte et que la fréquence est correctement configurée. Vérifiez que la tâche n\'a pas été désactivée manuellement.'}
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">
                    {language === 'en'
                      ? 'Residents are not receiving maintenance notifications'
                      : 'Les résidents ne reçoivent pas les notifications d\'entretien'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Ensure that the notification templates are properly configured in the system. Check that the resident has not disabled notifications in their profile settings. Verify their contact information is correct.'
                      : 'Assurez-vous que les modèles de notification sont correctement configurés dans le système. Vérifiez que le résident n\'a pas désactivé les notifications dans les paramètres de son profil. Vérifiez que ses coordonnées sont correctes.'}
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