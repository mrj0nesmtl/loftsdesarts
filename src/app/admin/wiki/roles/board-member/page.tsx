"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, ArrowLeft, Building, FileText, BarChart, Calendar, Users, VoteIcon, ChevronRight } from "lucide-react";
import Link from 'next/link';

// Wiki system language type
type WikiLanguage = 'en' | 'fr';

export default function BoardMemberWikiPage() {
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
          {language === 'en' ? 'Board Member User Guide' : 'Guide Utilisateur - Membre du Conseil'}
        </h1>
        <Badge variant="outline" className="mt-2 md:mt-0 text-sm md:text-base px-3 py-1 border-primary text-primary">
          {language === 'en' ? 'ROLE: BOARD MEMBER' : 'RÔLE: MEMBRE DU CONSEIL'}
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
              {language === 'en' ? 'Current Board Members 2024' : 'Membres actuels du Conseil 2024'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Governance Tools' : 'Outils de gouvernance'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Financial Oversight' : 'Supervision financière'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Decision Making' : 'Prise de décision'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Meeting Management' : 'Gestion des réunions'}
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
                  ? 'As a Board Member at Lofts des Arts, you have a fiduciary responsibility to act in the best interest of the condominium corporation and its owners. You are part of the decision-making body that governs the building, sets policies, manages finances, and oversees property management. This guide outlines how to use the platform tools specifically designed for board governance and decision making.'
                  : 'En tant que Membre du Conseil aux Lofts des Arts, vous avez une responsabilité fiduciaire d\'agir dans le meilleur intérêt de la corporation de copropriété et de ses propriétaires. Vous faites partie de l\'organe décisionnel qui gouverne l\'immeuble, établit les politiques, gère les finances et supervise la gestion immobilière. Ce guide explique comment utiliser les outils de la plateforme spécifiquement conçus pour la gouvernance du conseil et la prise de décision.'}
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
                    ? 'Participating in board meetings and decision-making processes' 
                    : 'Participer aux réunions du conseil et aux processus de prise de décision'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Reviewing and approving building policies and bylaws' 
                    : 'Examiner et approuver les politiques et règlements de l\'immeuble'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Overseeing financial management and budget planning' 
                    : 'Superviser la gestion financière et la planification budgétaire'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Approving major contracts and service agreements' 
                    : 'Approuver les contrats majeurs et les accords de service'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Reviewing and deciding on special requests from owners' 
                    : 'Examiner et décider des demandes spéciales des propriétaires'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Planning for building maintenance and capital improvements' 
                    : 'Planifier l\'entretien de l\'immeuble et les améliorations capitales'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Addressing owner concerns and disputes' 
                    : 'Traiter les préoccupations et les litiges des propriétaires'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Ensuring legal compliance of building operations' 
                    : 'Assurer la conformité légale des opérations de l\'immeuble'}
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
                  ? 'Your board member dashboard provides specialized tools for governance and oversight:' 
                  : 'Votre tableau de bord de membre du conseil fournit des outils spécialisés pour la gouvernance et la supervision :'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Board Meetings' : 'Réunions du conseil'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Schedule, prepare for, and document board meetings' 
                        : 'Planifier, préparer et documenter les réunions du conseil'}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Financial Reports' : 'Rapports financiers'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Review financial statements, budgets, and reserve funds' 
                        : 'Examiner les états financiers, les budgets et les fonds de réserve'}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Document Center' : 'Centre de documents'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Access governing documents, meeting minutes, and contracts' 
                        : 'Accéder aux documents de gouvernance, procès-verbaux et contrats'}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <VoteIcon className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Decision Management' : 'Gestion des décisions'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Vote on matters, track decisions, and document resolutions' 
                        : 'Voter sur les questions, suivre les décisions et documenter les résolutions'}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Current Board Members 2024 */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Current Board Members 2024' : 'Membres actuels du Conseil 2024'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  {language === 'en' 
                    ? 'The current board consists of the following resident owners:' 
                    : 'Le conseil actuel est composé des propriétaires résidents suivants :'}
                </p>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'en' ? 'Name' : 'Nom'}</TableHead>
                        <TableHead>{language === 'en' ? 'Unit' : 'Unité'}</TableHead>
                        <TableHead>{language === 'en' ? 'Floor' : 'Étage'}</TableHead>
                        <TableHead>{language === 'en' ? 'Contact' : 'Contact'}</TableHead>
                        <TableHead>{language === 'en' ? 'Role' : 'Rôle'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Viviane Sokoluk</TableCell>
                        <TableCell>502</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>
                          viviane.sokoluk@loftsdesarts.com
                          <br />
                          514-616-7496
                        </TableCell>
                        <TableCell>{language === 'en' ? 'President' : 'Présidente'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Joel Yaffe</TableCell>
                        <TableCell>506</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>
                          joel.yaffe@gmail.com
                          <br />
                          514-503-3805
                        </TableCell>
                        <TableCell>{language === 'en' ? 'Treasurer' : 'Trésorier'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Jacques Germain</TableCell>
                        <TableCell>701</TableCell>
                        <TableCell>7</TableCell>
                        <TableCell>jacques.germain@loftsdesarts.com</TableCell>
                        <TableCell>{language === 'en' ? 'Secretary' : 'Secrétaire'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">David Morissette</TableCell>
                        <TableCell>402</TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>
                          david.morissette@loftsdesarts.com
                          <br />
                          438-788-7555
                        </TableCell>
                        <TableCell>{language === 'en' ? 'Member' : 'Membre'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="p-4 bg-secondary/20 rounded-lg border border-secondary/30 mt-4">
                  <h3 className="font-medium mb-2">
                    {language === 'en' ? 'Board Term' : 'Mandat du Conseil'}
                  </h3>
                  <p className="text-sm">
                    {language === 'en'
                      ? 'The current board was elected for a one-year term starting January 2024. Board elections are held annually during the December general assembly.'
                      : 'Le conseil actuel a été élu pour un mandat d\'un an à partir de janvier 2024. Les élections du conseil ont lieu chaque année lors de l\'assemblée générale de décembre.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Governance Tools */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Governance Tools' : 'Outils de gouvernance'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center mb-2">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-lg font-medium">{language === 'en' ? 'Document Repository' : 'Répertoire de documents'}</h3>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  {language === 'en'
                    ? 'Access and manage all essential governing documents in one secure location:'
                    : 'Accédez et gérez tous les documents de gouvernance essentiels en un seul endroit sécurisé :'}
                </p>
                <ul className="list-disc list-inside pl-6 space-y-1">
                  <li>{language === 'en' ? 'Declaration and bylaws' : 'Déclaration et règlements'}</li>
                  <li>{language === 'en' ? 'Rules and regulations' : 'Règles et règlements'}</li>
                  <li>{language === 'en' ? 'Policy documents' : 'Documents de politique'}</li>
                  <li>{language === 'en' ? 'Historical meeting minutes' : 'Procès-verbaux historiques des réunions'}</li>
                  <li>{language === 'en' ? 'Service contracts and agreements' : 'Contrats de service et accords'}</li>
                </ul>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <VoteIcon className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-lg font-medium">{language === 'en' ? 'Electronic Voting' : 'Vote électronique'}</h3>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  {language === 'en'
                    ? 'Streamline the decision-making process with secure online voting:'
                    : 'Simplifiez le processus de prise de décision avec un vote en ligne sécurisé :'}
                </p>
                <ul className="list-disc list-inside pl-6 space-y-1">
                  <li>{language === 'en' ? 'Create and distribute voting items' : 'Créer et distribuer des éléments de vote'}</li>
                  <li>{language === 'en' ? 'Track member participation and results' : 'Suivre la participation des membres et les résultats'}</li>
                  <li>{language === 'en' ? 'Document decisions and resolutions' : 'Documenter les décisions et les résolutions'}</li>
                  <li>{language === 'en' ? 'Archive voting history for future reference' : 'Archiver l\'historique des votes pour référence future'}</li>
                </ul>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-lg font-medium">{language === 'en' ? 'Owner Communications' : 'Communications avec les propriétaires'}</h3>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  {language === 'en'
                    ? 'Maintain transparent communication with building owners:'
                    : 'Maintenez une communication transparente avec les propriétaires de l\'immeuble :'}
                </p>
                <ul className="list-disc list-inside pl-6 space-y-1">
                  <li>{language === 'en' ? 'Send announcements and updates' : 'Envoyer des annonces et des mises à jour'}</li>
                  <li>{language === 'en' ? 'Share meeting notices and agendas' : 'Partager des avis de réunion et des ordres du jour'}</li>
                  <li>{language === 'en' ? 'Distribute annual reports and financial statements' : 'Distribuer des rapports annuels et des états financiers'}</li>
                  <li>{language === 'en' ? 'Receive and respond to owner inquiries' : 'Recevoir et répondre aux demandes des propriétaires'}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Financial Oversight */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Financial Oversight' : 'Supervision financière'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="mb-2">
                  {language === 'en'
                    ? 'The board has a fiduciary responsibility to oversee the financial health of the building. The platform provides specialized tools for financial management:'
                    : 'Le conseil a une responsabilité fiduciaire de superviser la santé financière de l\'immeuble. La plateforme fournit des outils spécialisés pour la gestion financière :'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">
                      {language === 'en' ? 'Budget Planning' : 'Planification budgétaire'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'Develop and review annual operating budgets, capital improvement plans, and reserve fund allocations with visualizations and historical comparisons.'
                        : 'Développez et examinez les budgets d\'exploitation annuels, les plans d\'amélioration des immobilisations et les allocations des fonds de réserve avec des visualisations et des comparaisons historiques.'}
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">
                      {language === 'en' ? 'Financial Reporting' : 'Rapports financiers'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'Access monthly income statements, balance sheets, cash flow reports, and variance analyses to track financial performance against budget.'
                        : 'Accédez aux comptes de résultat mensuels, aux bilans, aux rapports de flux de trésorerie et aux analyses d\'écarts pour suivre les performances financières par rapport au budget.'}
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">
                      {language === 'en' ? 'Expense Approval' : 'Approbation des dépenses'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'Review and approve significant expenditures through a digital approval workflow with audit trails and supporting documentation.'
                        : 'Examinez et approuvez les dépenses importantes grâce à un flux de travail d\'approbation numérique avec des pistes d\'audit et des documents justificatifs.'}
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">
                      {language === 'en' ? 'Reserve Fund Monitoring' : 'Surveillance du fonds de réserve'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? 'Track reserve fund balances, contributions, and expenditures with projections for future capital needs based on reserve studies.'
                        : 'Suivez les soldes, les contributions et les dépenses du fonds de réserve avec des projections pour les futurs besoins en capital basées sur des études de réserve.'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meeting Management */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Meeting Management' : 'Gestion des réunions'}</CardTitle>
            </CardHeader>
            <CardContent>
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
                      {language === 'en' ? 'Meeting Scheduling' : 'Planification des réunions'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Dashboard → Board Meetings → Schedule' : 'Tableau de bord → Réunions du conseil → Planifier'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Set meeting dates, create calendar invites, and send notifications to board members' 
                        : 'Définir les dates des réunions, créer des invitations au calendrier et envoyer des notifications aux membres du conseil'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Agenda Builder' : 'Créateur d\'ordre du jour'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Dashboard → Board Meetings → Agendas' : 'Tableau de bord → Réunions du conseil → Ordres du jour'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Create and distribute meeting agendas with supporting documents and time allocations' 
                        : 'Créer et distribuer des ordres du jour avec des documents justificatifs et des allocations de temps'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Minutes Documentation' : 'Documentation des procès-verbaux'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Dashboard → Board Meetings → Minutes' : 'Tableau de bord → Réunions du conseil → Procès-verbaux'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Record, approve, and archive meeting minutes with action items and decision tracking' 
                        : 'Enregistrer, approuver et archiver les procès-verbaux des réunions avec des éléments d\'action et le suivi des décisions'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Action Item Tracking' : 'Suivi des éléments d\'action'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Dashboard → Board Meetings → Action Items' : 'Tableau de bord → Réunions du conseil → Éléments d\'action'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Assign, track, and follow up on action items from board meetings with due dates and status updates' 
                        : 'Assigner, suivre et faire le suivi des éléments d\'action des réunions du conseil avec des dates d\'échéance et des mises à jour de statut'}
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
                      ? 'I cannot access board documents'
                      : 'Je ne peux pas accéder aux documents du conseil'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Verify your board member status is correctly set in your profile. If you were recently appointed, contact the board president or administrator to ensure your permissions are updated. For sensitive documents, additional approval may be required.'
                      : 'Vérifiez que votre statut de membre du conseil est correctement défini dans votre profil. Si vous avez été récemment nommé, contactez le président du conseil ou l\'administrateur pour vous assurer que vos autorisations sont mises à jour. Pour les documents sensibles, une approbation supplémentaire peut être nécessaire.'}
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">
                    {language === 'en'
                      ? 'I did not receive meeting notifications'
                      : 'Je n\'ai pas reçu les notifications de réunion'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Check your notification settings in Profile → Notifications to ensure board meeting alerts are enabled. Verify your email and phone number are correct. Also check with the meeting organizer to confirm you were included in the invitation list.'
                      : 'Vérifiez vos paramètres de notification dans Profil → Notifications pour vous assurer que les alertes de réunion du conseil sont activées. Vérifiez que votre email et votre numéro de téléphone sont corrects. Vérifiez également auprès de l\'organisateur de la réunion que vous avez été inclus dans la liste d\'invitation.'}
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">
                    {language === 'en'
                      ? 'I cannot create or participate in a vote'
                      : 'Je ne peux pas créer ou participer à un vote'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Only designated board officers can create votes. If you need to create a vote, contact the board president or secretary. If you cannot participate in an active vote, ensure you are logged in with your board member account and the vote is still open for submissions.'
                      : 'Seuls les dirigeants du conseil désignés peuvent créer des votes. Si vous devez créer un vote, contactez le président ou le secrétaire du conseil. Si vous ne pouvez pas participer à un vote actif, assurez-vous d\'être connecté avec votre compte de membre du conseil et que le vote est toujours ouvert aux soumissions.'}
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