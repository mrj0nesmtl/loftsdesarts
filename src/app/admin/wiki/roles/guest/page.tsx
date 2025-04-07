"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Globe, Users, KeyRound, Calendar, Compass, Bell, ChevronRight } from "lucide-react";
import Link from 'next/link';

// Wiki system language type
type WikiLanguage = 'en' | 'fr';

export default function GuestWikiPage() {
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
          {language === 'en' ? 'Guest User Guide' : 'Guide Utilisateur - Invité'}
        </h1>
        <Badge variant="outline" className="mt-2 md:mt-0 text-sm md:text-base px-3 py-1 border-primary text-primary">
          {language === 'en' ? 'ROLE: GUEST' : 'RÔLE: INVITÉ'}
        </Badge>
      </div>

      {/* Version info and last updated */}
      <div className="p-4 bg-muted/50 rounded-md mb-8">
        <p className="text-sm text-muted-foreground">
          {language === 'en' 
            ? 'Last Updated: April 20, 2023 | App Version: 0.5.0' 
            : 'Dernière mise à jour: 20 avril 2023 | Version de l\'application: 0.5.0'}
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
              {language === 'en' ? 'Access and Registration' : 'Accès et enregistrement'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Building Navigation' : 'Navigation dans l\'immeuble'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Amenity Access' : 'Accès aux commodités'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'Security Guidelines' : 'Directives de sécurité'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start pl-6">
              {language === 'en' ? 'FAQ' : 'FAQ'}
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
                  ? 'As a Guest at Lofts des Arts, you are visiting one of our residents or utilizing our guest accommodations. The digital platform provides you with temporary access to certain building features and helps ensure a smooth and enjoyable stay. This guide outlines the digital tools available to you and how to navigate the building safely and conveniently.'
                  : 'En tant qu\'Invité aux Lofts des Arts, vous visitez l\'un de nos résidents ou utilisez nos hébergements pour invités. La plateforme numérique vous donne un accès temporaire à certaines fonctionnalités de l\'immeuble et vous aide à assurer un séjour agréable. Ce guide décrit les outils numériques qui vous sont disponibles et comment naviguer dans l\'immeuble en toute sécurité et commodité.'}
              </p>
            </CardContent>
          </Card>

          {/* Access and Registration */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Access and Registration' : 'Accès et enregistrement'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  {language === 'en' 
                    ? 'Upon arrival, all guests must register with the front desk to obtain temporary building access:' 
                    : 'À l\'arrivée, tous les invités doivent s\'enregistrer à la réception pour obtenir un accès temporaire à l\'immeuble :'}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-muted-foreground/20">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-primary" />
                        <CardTitle className="text-base">{language === 'en' ? 'Guest Registration' : 'Enregistrement des invités'}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>
                          {language === 'en' 
                            ? 'Present ID to the doorman or concierge' 
                            : 'Présentez une pièce d\'identité au portier ou au concierge'}
                        </li>
                        <li>
                          {language === 'en' 
                            ? 'Provide the name of your host resident' 
                            : 'Fournissez le nom de votre résident hôte'}
                        </li>
                        <li>
                          {language === 'en' 
                            ? 'Have a photo taken for the visitor log' 
                            : 'Faites-vous prendre en photo pour le registre des visiteurs'}
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border border-muted-foreground/20">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <KeyRound className="h-5 w-5 mr-2 text-primary" />
                        <CardTitle className="text-base">{language === 'en' ? 'Digital Access' : 'Accès numérique'}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>
                          {language === 'en' 
                            ? 'Receive a temporary digital access code via SMS' 
                            : 'Recevez un code d\'accès numérique temporaire par SMS'}
                        </li>
                        <li>
                          {language === 'en' 
                            ? 'Download our mobile app for QR-based access' 
                            : 'Téléchargez notre application mobile pour un accès par QR code'}
                        </li>
                        <li>
                          {language === 'en' 
                            ? 'Access expires automatically at the end of your stay' 
                            : 'L\'accès expire automatiquement à la fin de votre séjour'}
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="p-4 bg-secondary/20 rounded-lg border border-secondary/30">
                  <h3 className="font-medium mb-2">
                    {language === 'en' ? 'Pre-Registration' : 'Pré-enregistrement'}
                  </h3>
                  <p className="text-sm">
                    {language === 'en'
                      ? 'For a smoother arrival, ask your host to pre-register you through their resident portal. You\'ll receive an email with a QR code that can be scanned upon arrival for faster processing.'
                      : 'Pour une arrivée plus fluide, demandez à votre hôte de vous pré-enregistrer via leur portail résident. Vous recevrez un email avec un code QR qui pourra être scanné à votre arrivée pour un traitement plus rapide.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Building Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Building Navigation' : 'Navigation dans l\'immeuble'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p>
                  {language === 'en'
                    ? 'The Lofts des Arts complex is designed with sophisticated security zones. As a guest, your access is limited to specific areas:'
                    : 'Le complexe Lofts des Arts est conçu avec des zones de sécurité sophistiquées. En tant qu\'invité, votre accès est limité à des zones spécifiques :'}
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Compass className="h-4 w-4 text-green-700" />
                      </div>
                      <h3 className="font-medium">
                        {language === 'en' ? 'Common Areas Access' : 'Accès aux espaces communs'}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground pl-12">
                      {language === 'en'
                        ? 'Your digital access key grants entry to the main lobby, elevators (limited to your host\'s floor or your guest suite\'s floor), and designated common areas only during your registered stay period.'
                        : 'Votre clé d\'accès numérique permet l\'entrée au hall principal, aux ascenseurs (limités à l\'étage de votre hôte ou à l\'étage de votre suite d\'invité), et aux espaces communs désignés uniquement pendant la période de votre séjour enregistré.'}
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <Bell className="h-4 w-4 text-red-700" />
                      </div>
                      <h3 className="font-medium">
                        {language === 'en' ? 'Restricted Areas' : 'Zones restreintes'}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground pl-12">
                      {language === 'en'
                        ? 'Guest access does not include resident-only facilities, mechanical rooms, storage areas, or residential floors other than your specific destination. Attempting to access these areas will trigger a security alert.'
                        : 'L\'accès des invités n\'inclut pas les installations réservées aux résidents, les salles mécaniques, les zones de stockage, ou les étages résidentiels autres que votre destination spécifique. Tenter d\'accéder à ces zones déclenchera une alerte de sécurité.'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenity Access */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Amenity Access' : 'Accès aux commodités'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                {language === 'en'
                  ? 'As a guest, you may have access to certain building amenities during your stay:'
                  : 'En tant qu\'invité, vous pouvez avoir accès à certaines commodités de l\'immeuble pendant votre séjour :'}
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border border-muted-foreground/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{language === 'en' ? 'Guest Access' : 'Accès invité'}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>{language === 'en' ? 'Lobby Lounge' : 'Salon du hall'}</li>
                        <li>{language === 'en' ? 'Guest WiFi' : 'WiFi invité'}</li>
                        <li>{language === 'en' ? 'Outdoor Terraces' : 'Terrasses extérieures'}</li>
                        <li>{language === 'en' ? 'Visitor Parking' : 'Stationnement visiteur'}</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-muted-foreground/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{language === 'en' ? 'Host-Accompanied Access' : 'Accès accompagné par l\'hôte'}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>{language === 'en' ? 'Fitness Center' : 'Centre de fitness'}</li>
                        <li>{language === 'en' ? 'Swimming Pool' : 'Piscine'}</li>
                        <li>{language === 'en' ? 'Rooftop Garden' : 'Jardin sur le toit'}</li>
                        <li>{language === 'en' ? 'Dining Lounge' : 'Salon de repas'}</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-muted-foreground/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{language === 'en' ? 'Bookable Amenities' : 'Commodités réservables'}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>{language === 'en' ? 'Conference Room' : 'Salle de conférence'}</li>
                        <li>{language === 'en' ? 'Private Dining' : 'Salle à manger privée'}</li>
                        <li>{language === 'en' ? 'Media Room' : 'Salle multimédia'}</li>
                        <li>{language === 'en' ? 'Event Space' : 'Espace événementiel'}</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="p-4 border rounded-md border-primary/30">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    {language === 'en' ? 'Booking Process' : 'Processus de réservation'}
                  </h3>
                  <p className="text-sm">
                    {language === 'en'
                      ? 'Bookable amenities must be reserved through your resident host. They can add you as a guest to their booking through the resident portal. Alternatively, if you are staying in a guest suite, you can make bookings directly through the concierge.'
                      : 'Les commodités réservables doivent être réservées par l\'intermédiaire de votre hôte résident. Ils peuvent vous ajouter en tant qu\'invité à leur réservation via le portail résident. Alternativement, si vous séjournez dans une suite d\'invités, vous pouvez effectuer des réservations directement auprès du concierge.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'FAQ' : 'FAQ'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">
                    {language === 'en' 
                      ? 'How do I extend my stay?'
                      : 'Comment prolonger mon séjour ?'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'If you need to extend your stay, your resident host must update your guest registration through their portal. For guest suite extensions, please contact the front desk at least 24 hours before your scheduled departure.'
                      : 'Si vous devez prolonger votre séjour, votre hôte résident doit mettre à jour votre enregistrement d\'invité via leur portail. Pour les extensions de suite d\'invités, veuillez contacter la réception au moins 24 heures avant votre départ prévu.'}
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">
                    {language === 'en'
                      ? 'What if my digital access isn\'t working?'
                      : 'Que faire si mon accès numérique ne fonctionne pas ?'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'If you encounter any issues with your digital access, please visit the front desk for assistance. The concierge can reset your access credentials or provide an alternative form of entry if needed.'
                      : 'Si vous rencontrez des problèmes avec votre accès numérique, veuillez vous rendre à la réception pour obtenir de l\'aide. Le concierge peut réinitialiser vos identifiants d\'accès ou fournir une forme d\'entrée alternative si nécessaire.'}
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">
                    {language === 'en'
                      ? 'Can I invite my own guests?'
                      : 'Puis-je inviter mes propres invités ?'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'As a guest, you cannot register additional visitors to the building. Any additional visitors must be registered by the resident who is hosting you. This is for security purposes and to maintain accurate building occupancy records.'
                      : 'En tant qu\'invité, vous ne pouvez pas enregistrer des visiteurs supplémentaires dans l\'immeuble. Tout visiteur supplémentaire doit être enregistré par le résident qui vous héberge. Ceci est à des fins de sécurité et pour maintenir des registres précis d\'occupation de l\'immeuble.'}
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