"use client";

import Link from "next/link";
import Image from "next/image";
import { RootLayout } from "@/components/layout/RootLayout";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export default function Home() {
  return (
    <RootLayout>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Static Background Image instead of Video */}
        <Image
          src="/lda_bg.png"
          alt="Lofts des Arts"
          fill
          className="absolute inset-0 object-cover z-0"
          priority
        />
        
        {/* Video Background - Commented out for future use
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/STTS_2.mp4" type="video/mp4" />
        </video>
        */}
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-3xl md:text-5xl text-zinc-100 font-medium">
              Condominiums de Luxe
            </p>
            <p className="text-3xl md:text-5xl text-zinc-100 font-medium mt-2">
              au Cœur de Montréal
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

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* About Section */}
      <section className="py-16 bg-black">
        <div className="container px-4 mx-auto md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Découvrez un Mode de Vie Luxueux</h2>
            
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
          <h2 className="text-3xl font-bold mb-8 text-center">Notre Emplacement</h2>
          
          <div className="aspect-video w-full max-w-4xl mx-auto overflow-hidden rounded-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.9652738541904!2d-73.56930872372341!3d45.51077767107482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91a4c1b389f6d%3A0x1d0b7483b40ddc56!2sLofts%20des%20Arts!5e0!3m2!1sen!2sca!4v1743707624170!5m2!1sen!2sca" 
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
    </RootLayout>
  );
}
