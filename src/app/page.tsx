"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RootLayout } from "@/components/layout/RootLayout";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { SiteSetting, getPublicSettings, getSettingValue } from "@/services/websiteService";

export default function Home() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getPublicSettings();
        setSettings(data);
        console.log("Loaded public settings:", data);
      } catch (error) {
        console.error("Error loading public settings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
    
    // Add scroll event listener for parallax effect
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Get settings values with defaults
  const heroImage = getSettingValue(settings, 'hero.image', '/lda_bg.png');
  const heroTitle = getSettingValue(settings, 'hero.title', 'Condominiums de Luxe');
  const heroSubtitle = getSettingValue(settings, 'hero.subtitle', 'au Cœur de Montréal');
  const bannerEnabled = getSettingValue(settings, 'banner.enabled', 'false').toLowerCase() === 'true';
  const bannerText = getSettingValue(settings, 'banner.text', '');
  const bannerColor = getSettingValue(settings, 'banner.color', '#1e40af');
  
  return (
    <RootLayout>
      {/* Banner if enabled */}
      {bannerEnabled && bannerText && (
        <div 
          className="py-2 px-4 text-white text-center font-medium"
          style={{ backgroundColor: bannerColor }}
        >
          {bannerText}
        </div>
      )}
      
      {/* Hero Section - Reduced height with parallax */}
      <section className="relative h-[60vh] md:h-[65vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with parallax effect */}
        {loading ? (
          <div className="absolute inset-0 bg-zinc-900" />
        ) : (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${heroImage})`,
              transform: `translateY(${scrollY * 0.3}px)`,
              backgroundSize: 'cover'
            }}
          />
        )}
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-3xl md:text-5xl text-zinc-100 font-medium font-title"
               style={{ fontFamily: "'Poiret One', cursive !important" }}>
              {heroTitle}
            </p>
            <p className="text-3xl md:text-5xl text-zinc-100 font-medium font-title mt-2"
               style={{ fontFamily: "'Poiret One', cursive !important" }}>
              {heroSubtitle}
            </p>
          </div>
          <Link 
            href="/gallery" 
            className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-8 rounded-md transition-colors"
          >
            Voir la Galerie
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-black">
        <div className="container px-4 mx-auto md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center font-title"
                style={{ fontFamily: "'Poiret One', cursive !important" }}>
              Découvrez un Mode de Vie Luxueux
            </h2>
            
            <div className="space-y-6 text-zinc-300">
              <p className="leading-relaxed">
                Le plus beau projet immobilier avec vue sur le Quartier des Spectacles. Des beaux matériaux à l'intérieur d'une bâtisse en béton et acier, comme on n'en fait plus. C'est ça les Lofts des Arts : un bout d'histoire de Montréal.
              </p>
              
              <p className="leading-relaxed">
                Luxe et Prestige : énormes fenêtres sur le cœur de Montréal et son formidable renouvellement, finitions de luxe, plafonds de près de 11 pieds en béton, comptoirs en granit, planchers en bois franc et insonorisés, cuisines semi-professionnelles, salles de bain spacieuses, air climatisé et eau chaude indépendants.
              </p>
              
              <p className="leading-relaxed">
                Sans oublier la terrasse commune avec vue spectaculaire sur le centre-ville et jusqu'à l'horizon, comprenant piscine, Gym-Cardio et un espace barbecue avec tables et gazebos pour vos plus belles journées au soleil, directement chez vous.
              </p>
              
              <p className="leading-relaxed">
                Et en tout temps, votre tranquillité personnelle sera garantie par un Service de Sécurité 24h/7, caméras de surveillance, interphones et carte-clés de sécurité. Lofts des Arts : des condos de prestige dans le quartier du glamour.
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/about"
                className="inline-block border border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-500 hover:text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                En Savoir Plus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-zinc-900">
        <div className="container px-4 mx-auto md:px-6">
          <h2 className="text-3xl font-bold mb-8 text-center font-title"
              style={{ fontFamily: "'Poiret One', cursive !important" }}>
            Notre Emplacement
          </h2>
          
          <div className="aspect-video w-full max-w-4xl mx-auto overflow-hidden rounded-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d356.6934507153928!2d-73.56677393564334!3d45.508200446077666!2m3!1f0!2f39.394737510756755!3f0!3m2!1i1024!2i768!4f35!3m3!1m2!1s0x4cc91a4c1b389f6d%3A0x1d0b7483b40ddc56!2sLofts%20des%20Arts!5e1!3m2!1sen!2sca!4v1743925245718!5m2!1sen!2sca" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="https://maps.app.goo.gl/tz5g4Zq5yGPz949N7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Itinéraire
            </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section - Moved to bottom */}
      <NewsletterSection />
    </RootLayout>
  );
}
