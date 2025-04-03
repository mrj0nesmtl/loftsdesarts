import Image from "next/image";
import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata(
  'À Propos des Lofts des Arts',
  'Découvrez les luxueux condominiums Lofts des Arts à Montréal. Explorez notre histoire, nos installations et ce qui rend notre immeuble unique.',
  '/lda_bg.png'
);

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-12">À Propos des Lofts des Arts</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="relative aspect-[4/3] h-full w-full overflow-hidden rounded-lg">
          <Image
            src="/lda_bg.png"
            alt="Condominiums Lofts des Arts"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Notre Immeuble</h2>
            <div className="space-y-4">
              <p className="text-zinc-300 leading-relaxed">
                Le plus beau projet immobilier avec vue sur le Quartier des Spectacles. Des beaux matériaux à l'intérieur d'une bâtisse en béton et acier, comme on n'en fait plus. C'est ça les Lofts des Arts : un bout d'histoire de Montréal.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                The most beautiful real estate project with a view of the Quartier des Spectacles. Beautiful materials inside a concrete and steel building, like they don't make anymore. That's what Lofts des Arts is: a piece of Montreal history.
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-semibold mb-4">Luxe et Prestige</h2>
            <div className="space-y-4">
              <p className="text-zinc-300 leading-relaxed">
                Luxe et Prestige : énormes fenêtres sur le cœur de Montréal et son formidable renouvellement, finitions de luxe, plafonds de près de 11 pieds en béton, comptoirs en granit, planchers en bois franc et insonorisés, cuisines semi-professionnelles, salles de bain spacieuses, air climatisé et eau chaude indépendants.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                Luxury and Prestige: enormous windows overlooking the heart of Montreal and its amazing renewal, luxury finishes, nearly 11-foot concrete ceilings, granite countertops, hardwood and soundproofed floors, semi-professional kitchens, spacious bathrooms, independent air conditioning and hot water.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="space-y-6 order-2 lg:order-1">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Installations Spectaculaires</h2>
            <div className="space-y-4">
              <p className="text-zinc-300 leading-relaxed">
                Sans oublier la terrasse commune avec vue spectaculaire sur le centre-ville et jusqu'à l'horizon, comprenant piscine, Gym-Cardio et un espace barbecue avec tables et gazebos pour vos plus belles journées au soleil, directement chez vous.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                Not to mention the common terrace with spectacular views of downtown and to the horizon, including a swimming pool, gym and cardio facilities, and a barbecue area with tables and gazebos for your most beautiful sunny days, right at home.
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-semibold mb-4">Sécurité et Tranquillité d'Esprit</h2>
            <div className="space-y-4">
              <p className="text-zinc-300 leading-relaxed">
                Et en tout temps, votre tranquillité personnelle sera garantie par un Service de Sécurité 24h/7, caméras de surveillance, interphones et carte-clés de sécurité. Lofts des Arts : des condos de prestige dans le quartier du glamour.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                And at all times, your personal tranquility will be guaranteed by a 24/7 Security Service, surveillance cameras, intercoms, and security key cards. Lofts des Arts: prestigious condos in the glamour district.
              </p>
            </div>
          </div>
        </div>
        
        <div className="relative aspect-[4/3] h-full w-full overflow-hidden rounded-lg order-1 lg:order-2">
          <Image
            src="/lda_bg.png"
            alt="Installations des Lofts des Arts"
            fill
            className="object-cover"
          />
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-6">Emplacement</h2>
        <p className="text-zinc-300 mb-8">
          Situé au 1625 rue Clark, Montréal, Québec, Canada H2X 2R5, Lofts des Arts est au cœur du quartier des spectacles, à quelques pas de la Place des Arts, des restaurants, des boutiques et de la scène culturelle vibrante du centre-ville de Montréal.
        </p>
        
        <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
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
      </div>
    </div>
  );
} 