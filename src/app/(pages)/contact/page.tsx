"use client";

import Image from "next/image";
import { ContactForm } from "@/components/forms/ContactForm";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

// Social media icons
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

// Instagram icon
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-12 font-title">Contact & Informations</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* About Lofts des Arts */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 font-title">À Propos des Lofts des Arts</h2>
          
          <div className="mb-6 relative w-full aspect-video max-w-md mx-auto lg:mx-0 overflow-hidden rounded-lg">
            <Image
              src="/lda_bg.png"
              alt="Condominiums Lofts des Arts"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-zinc-300 mb-4">
              Lofts des Arts est un prestigieux développement de condominiums situé au cœur de Montréal, offrant un cadre de vie luxueux dans l'un des quartiers les plus dynamiques de la ville.
            </p>
            
            <p className="text-zinc-300 mb-4">
              Notre immeuble propose des lofts spacieux avec de hauts plafonds en béton, des planchers en bois franc, des comptoirs en granit et de grandes fenêtres offrant des vues spectaculaires sur la ville.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4 font-title">Installations</h3>
            
            <p className="text-zinc-300 mb-4">
              Les résidents bénéficient d'une terrasse sur le toit avec piscine, installations de gym et cardio, espace barbecue avec tables et gazebos, service de sécurité 24h/7, caméras de surveillance, systèmes d'interphone et accès sécurisé par carte-clé.
            </p>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 font-title">Adresse</h3>
              <p className="text-zinc-300 mb-4">
                1625 rue Clark<br />
                Montréal, Québec<br />
                Canada H2X 2R5
              </p>
              
              {/* Google Maps iframe */}
              <div className="aspect-video w-full max-w-md mb-6 overflow-hidden rounded-lg">
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
              
              <div className="flex space-x-3">
                <a 
                  href="https://www.facebook.com/LoftDesArts" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-300 hover:text-white transition-colors"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <FacebookIcon />
                </a>
                <a 
                  href="https://www.instagram.com/explore/tags/loftsdesarts/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-300 hover:text-white transition-colors"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a 
                  href="https://maps.app.goo.gl/tz5g4Zq5yGPz949N7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-300 hover:text-white transition-colors"
                  onClick={(e) => {
                    // Add error handling for ad blockers
                    try {
                      // Attempt to open the URL in a new tab
                      window.open("https://maps.app.goo.gl/tz5g4Zq5yGPz949N7", "_blank", "noopener,noreferrer");
                      e.preventDefault(); // Prevent default link behavior
                    } catch (error) {
                      // If blocked by ad blocker, fallback to opening in same tab
                      console.info("Maps link may be blocked by an ad blocker, attempting fallback.");
                    }
                  }}
                  aria-label="Google Maps"
                  title="Google Maps"
                >
                  <MapIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <ContactForm />
      </div>
      
      {/* Newsletter Section */}
      <div className="mt-20">
        <NewsletterSection />
      </div>
    </div>
  );
} 