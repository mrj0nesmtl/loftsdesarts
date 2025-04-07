import Link from "next/link";
import Image from "next/image";
import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata(
  'Galerie',
  'Explorez notre galerie d\'images présentant les condominiums Lofts des Arts. Découvrez notre immeuble, nos installations et nos espaces de vie.',
  '/lda_bg.png'
);

// Temporary placeholder gallery items
const galleryItems = [
  {
    id: 'building-exterior',
    title: 'Extérieur du Bâtiment',
    category: 'Immeuble',
    imageSrc: '/lda_bg.png',
    description: 'L\'extérieur moderne des condominiums Lofts des Arts à Montréal',
  },
  {
    id: 'lobby',
    title: 'Entrée du Hall',
    category: 'Espaces Communs',
    imageSrc: '/lda_bg.png',
    description: 'L\'élégant hall d\'entrée avec sécurité 24/7',
  },
  {
    id: 'rooftop-terrace',
    title: 'Terrasse sur le Toit',
    category: 'Installations',
    imageSrc: '/lda_bg.png',
    description: 'Terrasse sur le toit avec une vue imprenable sur le centre-ville de Montréal',
  },
  {
    id: 'swimming-pool',
    title: 'Piscine',
    category: 'Installations',
    imageSrc: '/lda_bg.png',
    description: 'Piscine rafraîchissante pour les résidents',
  },
  {
    id: 'gym-facilities',
    title: 'Installations Gym & Cardio',
    category: 'Installations',
    imageSrc: '/lda_bg.png',
    description: 'Espace gym et cardio bien équipé pour les résidents',
  },
  {
    id: 'bbq-area',
    title: 'Espace BBQ',
    category: 'Installations',
    imageSrc: '/lda_bg.png',
    description: 'Espace barbecue avec tables et gazebos',
  },
  {
    id: 'living-space',
    title: 'Espace de Vie',
    category: 'Intérieurs',
    imageSrc: '/lda_bg.png',
    description: 'Espace de vie spacieux avec hauts plafonds et grandes fenêtres',
  },
];

// Unique categories for filtering
const categories = Array.from(new Set(galleryItems.map(item => item.category)));

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-12 font-title">Galerie</h1>
      
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <Link 
          href="/gallery" 
          className="px-4 py-2 bg-zinc-800 text-white rounded-md"
        >
          Tous
        </Link>
        {categories.map(category => (
          <Link 
            key={category}
            href={`/gallery?category=${category}`} 
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors"
          >
            {category}
          </Link>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleryItems.map((item) => (
          <div 
            key={item.id}
            className="bg-zinc-900 rounded-lg overflow-hidden"
          >
            <div className="relative aspect-video">
              <Image
                src={item.imageSrc}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-1 font-title">{item.title}</h3>
              <p className="text-zinc-400 text-sm mb-2">{item.category}</p>
              <p className="text-zinc-300">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Cette galerie présente divers aspects des condominiums Lofts des Arts. Pour plus d'informations ou pour organiser une visite, veuillez nous contacter.
        </p>
      </div>
    </div>
  );
} 