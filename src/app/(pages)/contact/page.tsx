import Image from "next/image";
import { ContactForm } from "@/components/forms/ContactForm";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata(
  'Contactez-Nous',
  'Contactez le conseil d\'administration des condominiums Lofts des Arts. Obtenez des informations sur l\'immeuble, les installations et les services.',
  '/lda_bg.png'
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
              <div className="flex gap-4">
                <a 
                  href="https://www.facebook.com/LoftDesArts" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-white transition-colors"
                >
                  Facebook
                </a>
                <a 
                  href="https://maps.app.goo.gl/tz5g4Zq5yGPz949N7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-white transition-colors"
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
                >
                  Google Maps
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