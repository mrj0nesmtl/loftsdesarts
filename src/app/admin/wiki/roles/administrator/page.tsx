"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, ArrowLeft, Users, Settings, Shield, Database, Bell, BarChart, ChevronRight } from "lucide-react";
import Link from 'next/link';

// Wiki system language type
type WikiLanguage = 'en' | 'fr';

export default function AdministratorWikiPage() {
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
          {language === 'en' ? 'Administrator User Guide' : 'Guide Utilisateur - Administrateur'}
        </h1>
        <Badge variant="outline" className="mt-2 md:mt-0 text-sm md:text-base px-3 py-1 border-primary text-primary">
          {language === 'en' ? 'ROLE: ADMINISTRATOR' : 'RÔLE: ADMINISTRATEUR'}
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
              {language === 'en' ? 'User Management' : 'Gestion des utilisateurs'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'System Settings' : 'Paramètres système'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Analytics & Reporting' : 'Analytique et rapports'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Security Management' : 'Gestion de la sécurité'}
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
                  ? 'As an Administrator at Lofts des Arts, you have comprehensive access to manage the entire system. Your role involves configuring system settings, managing users, overseeing security, and ensuring the platform runs smoothly for all users. This guide outlines how to effectively use administrative tools to maintain the building management system.'
                  : 'En tant qu\'Administrateur aux Lofts des Arts, vous disposez d\'un accès complet pour gérer l\'ensemble du système. Votre rôle consiste à configurer les paramètres du système, gérer les utilisateurs, superviser la sécurité et assurer le bon fonctionnement de la plateforme pour tous les utilisateurs. Ce guide explique comment utiliser efficacement les outils administratifs pour maintenir le système de gestion de l\'immeuble.'}
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
                    ? 'Managing user accounts and assigning appropriate roles and permissions' 
                    : 'Gérer les comptes utilisateurs et attribuer les rôles et autorisations appropriés'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Configuring system settings and maintaining system integrity' 
                    : 'Configurer les paramètres du système et maintenir l\'intégrité du système'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Monitoring system security and addressing security concerns' 
                    : 'Surveiller la sécurité du système et répondre aux préoccupations de sécurité'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Managing building data, including property records and resident information' 
                    : 'Gérer les données de l\'immeuble, y compris les registres de propriété et les informations sur les résidents'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Generating and reviewing system reports and analytics' 
                    : 'Générer et examiner les rapports et analyses du système'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Troubleshooting system issues and coordinating with technical support' 
                    : 'Dépanner les problèmes système et coordonner avec le support technique'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Managing system notifications and alerts' 
                    : 'Gérer les notifications et alertes du système'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Performing system backups and ensuring data integrity' 
                    : 'Effectuer des sauvegardes du système et assurer l\'intégrité des données'}
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
                  ? 'Your administrative dashboard provides a comprehensive overview of the entire system:' 
                  : 'Votre tableau de bord administratif offre une vue d\'ensemble complète de l\'ensemble du système :'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'User Management' : 'Gestion des utilisateurs'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Manage all user accounts, roles, and permissions' 
                        : 'Gérer tous les comptes utilisateurs, rôles et autorisations'}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'System Configuration' : 'Configuration du système'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Manage system settings, notifications, and integrations' 
                        : 'Gérer les paramètres du système, les notifications et les intégrations'}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Security Center' : 'Centre de sécurité'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Monitor login attempts, manage access control, and view security logs' 
                        : 'Surveiller les tentatives de connexion, gérer le contrôle d\'accès et consulter les journaux de sécurité'}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-base">{language === 'en' ? 'Analytics & Reports' : 'Analytique et rapports'}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>
                      {language === 'en' 
                        ? 'Generate system reports, view analytics, and track usage metrics' 
                        : 'Générer des rapports système, consulter les analyses et suivre les métriques d\'utilisation'}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'User Management' : 'Gestion des utilisateurs'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                {language === 'en' 
                  ? 'As an administrator, you have full control over user accounts. Here are the key features of the user management system:' 
                  : 'En tant qu\'administrateur, vous avez un contrôle total sur les comptes utilisateurs. Voici les principales fonctionnalités du système de gestion des utilisateurs :'}
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
                      {language === 'en' ? 'User Creation' : 'Création d\'utilisateur'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Admin Panel → Users → Add User' : 'Panneau d\'administration → Utilisateurs → Ajouter un utilisateur'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Create new user accounts and assign initial roles' 
                        : 'Créer de nouveaux comptes utilisateurs et attribuer des rôles initiaux'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Role Assignment' : 'Attribution de rôle'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Admin Panel → Users → Edit User → Roles' : 'Panneau d\'administration → Utilisateurs → Modifier l\'utilisateur → Rôles'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Assign or modify user roles and associated permissions' 
                        : 'Attribuer ou modifier les rôles des utilisateurs et les autorisations associées'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Account Reset' : 'Réinitialisation de compte'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Admin Panel → Users → Edit User → Reset Password' : 'Panneau d\'administration → Utilisateurs → Modifier l\'utilisateur → Réinitialiser le mot de passe'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Reset user passwords and unlock accounts' 
                        : 'Réinitialiser les mots de passe des utilisateurs et déverrouiller les comptes'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {language === 'en' ? 'Account Suspension' : 'Suspension de compte'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' ? 'Admin Panel → Users → Edit User → Status' : 'Panneau d\'administration → Utilisateurs → Modifier l\'utilisateur → Statut'}
                    </TableCell>
                    <TableCell>
                      {language === 'en' 
                        ? 'Temporarily suspend user accounts when needed' 
                        : 'Suspendre temporairement les comptes utilisateurs si nécessaire'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'System Settings' : 'Paramètres système'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">{language === 'en' ? 'General Settings' : 'Paramètres généraux'}</h3>
                  <ul className="list-disc list-inside pl-6 space-y-1">
                    <li>{language === 'en' ? 'Building Information: Configure building details and contact information' : 'Informations sur l\'immeuble: Configurer les détails et coordonnées de l\'immeuble'}</li>
                    <li>{language === 'en' ? 'System Localization: Set language preferences and regional settings' : 'Localisation du système: Définir les préférences linguistiques et les paramètres régionaux'}</li>
                    <li>{language === 'en' ? 'Branding: Customize logos, colors, and display elements' : 'Image de marque: Personnaliser les logos, couleurs et éléments d\'affichage'}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">{language === 'en' ? 'Notifications & Communications' : 'Notifications et communications'}</h3>
                  <ul className="list-disc list-inside pl-6 space-y-1">
                    <li>{language === 'en' ? 'Email Templates: Configure system email notifications and templates' : 'Modèles d\'e-mail: Configurer les notifications par e-mail et les modèles'}</li>
                    <li>{language === 'en' ? 'SMS Settings: Set up SMS notification preferences' : 'Paramètres SMS: Configurer les préférences de notification par SMS'}</li>
                    <li>{language === 'en' ? 'Push Notifications: Manage mobile app push notification settings' : 'Notifications push: Gérer les paramètres de notification push de l\'application mobile'}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">{language === 'en' ? 'Integrations' : 'Intégrations'}</h3>
                  <ul className="list-disc list-inside pl-6 space-y-1">
                    <li>{language === 'en' ? 'Payment Gateways: Configure payment processing integrations' : 'Passerelles de paiement: Configurer les intégrations de traitement des paiements'}</li>
                    <li>{language === 'en' ? 'Calendar Systems: Set up integrations with external calendar services' : 'Systèmes de calendrier: Configurer les intégrations avec les services de calendrier externes'}</li>
                    <li>{language === 'en' ? 'Document Management: Configure document storage and retention policies' : 'Gestion de documents: Configurer le stockage des documents et les politiques de conservation'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Management */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Security Management' : 'Gestion de la sécurité'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">{language === 'en' ? 'Access Control' : 'Contrôle d\'accès'}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Configure access control policies, including role-based permissions and authentication requirements.'
                      : 'Configurer les politiques de contrôle d\'accès, y compris les autorisations basées sur les rôles et les exigences d\'authentification.'}
                  </p>
                  <div className="p-4 border rounded-md bg-muted/20">
                    <p className="text-sm">
                      <strong>{language === 'en' ? 'Best Practice:' : 'Bonne pratique:'}</strong> {language === 'en' 
                        ? 'Follow the principle of least privilege when assigning permissions. Only grant the minimum access necessary for each role.' 
                        : 'Suivez le principe du moindre privilège lors de l\'attribution des autorisations. N\'accordez que l\'accès minimum nécessaire pour chaque rôle.'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">{language === 'en' ? 'Security Audit Logs' : 'Journaux d\'audit de sécurité'}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Review security logs to monitor system access and detect potential security incidents.'
                      : 'Examiner les journaux de sécurité pour surveiller l\'accès au système et détecter les incidents de sécurité potentiels.'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-1 text-sm">{language === 'en' ? 'User Login Logs' : 'Journaux de connexion utilisateur'}</h4>
                      <p className="text-xs text-muted-foreground">{language === 'en' ? 'Track all login attempts, successful and failed' : 'Suivre toutes les tentatives de connexion, réussies et échouées'}</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-1 text-sm">{language === 'en' ? 'Data Access Logs' : 'Journaux d\'accès aux données'}</h4>
                      <p className="text-xs text-muted-foreground">{language === 'en' ? 'Monitor who accesses sensitive data and when' : 'Surveiller qui accède aux données sensibles et quand'}</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-1 text-sm">{language === 'en' ? 'Configuration Changes' : 'Modifications de configuration'}</h4>
                      <p className="text-xs text-muted-foreground">{language === 'en' ? 'Track all system configuration changes' : 'Suivre toutes les modifications de configuration du système'}</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-1 text-sm">{language === 'en' ? 'User Permission Changes' : 'Modifications des autorisations utilisateur'}</h4>
                      <p className="text-xs text-muted-foreground">{language === 'en' ? 'Monitor role and permission modifications' : 'Surveiller les modifications de rôle et d\'autorisation'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">{language === 'en' ? 'Backup & Recovery' : 'Sauvegarde et récupération'}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Manage system backup schedules and recovery procedures to ensure data integrity.'
                      : 'Gérer les planifications de sauvegarde du système et les procédures de récupération pour assurer l\'intégrité des données.'}
                  </p>
                  <div className="p-4 border rounded-md bg-muted/20">
                    <p className="text-sm">
                      <strong>{language === 'en' ? 'Important:' : 'Important:'}</strong> {language === 'en' 
                        ? 'Regular backups are automatically scheduled, but you can manually initiate a backup at any time from the Security Center.' 
                        : 'Des sauvegardes régulières sont automatiquement programmées, mais vous pouvez lancer manuellement une sauvegarde à tout moment depuis le Centre de sécurité.'}
                    </p>
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
                      ? 'User cannot access their account'
                      : 'L\'utilisateur ne peut pas accéder à son compte'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Check the user\'s account status in the User Management section. Verify if the account is locked, suspended, or if the password has expired. You can reset the password or unlock the account as needed.'
                      : 'Vérifiez l\'état du compte de l\'utilisateur dans la section Gestion des utilisateurs. Vérifiez si le compte est verrouillé, suspendu ou si le mot de passe a expiré. Vous pouvez réinitialiser le mot de passe ou déverrouiller le compte selon les besoins.'}
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">
                    {language === 'en'
                      ? 'System notification emails are not being received'
                      : 'Les e-mails de notification du système ne sont pas reçus'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Verify the email configuration settings in System Settings → Notifications. Check the SMTP server status and test the email configuration using the "Send Test Email" feature.'
                      : 'Vérifiez les paramètres de configuration des e-mails dans Paramètres système → Notifications. Vérifiez l\'état du serveur SMTP et testez la configuration des e-mails à l\'aide de la fonction "Envoyer un e-mail de test".'}
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">
                    {language === 'en'
                      ? 'Dashboard data is not updating'
                      : 'Les données du tableau de bord ne se mettent pas à jour'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Try refreshing the cache in System Settings → Maintenance → Clear System Cache. If the issue persists, check the data source connections in System Settings → Integrations.'
                      : 'Essayez de rafraîchir le cache dans Paramètres système → Maintenance → Effacer le cache du système. Si le problème persiste, vérifiez les connexions aux sources de données dans Paramètres système → Intégrations.'}
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