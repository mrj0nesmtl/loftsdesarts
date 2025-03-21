import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { generateProjectMetadata } from '@/lib/seo';

// Mock portfolio items - in a real app, these would come from a database or CMS
const portfolioItems = {
  'helicopter-crash': {
    title: 'Helicopter Crash Scene',
    description: 'A dramatic helicopter crash scene with practical effects, miniatures, and controlled pyrotechnics for a major film production.',
    image: '/images/portfolio/helicopter-crash.jpg',
    client: 'Major Film Studio',
    year: '2023',
    category: 'Film Production',
    details: `
      This project required extensive planning and coordination to create a realistic helicopter crash 
      sequence using a combination of practical effects and miniatures. Our team constructed a 1:4 scale
      model helicopter with detailed interiors and functional rotor systems.
      
      The crash sequence involved controlled pyrotechnics, debris management, and careful choreography
      to ensure both realism and safety. Post-crash fire effects were achieved using a combination of
      propane flame bars and practical smoke elements.
    `
  },
  // Add more portfolio items as needed
};

// Generate metadata for this page dynamically based on the slug
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = portfolioItems[params.slug];
  
  // If item doesn't exist, Next.js will show 404 page
  if (!item) {
    return {};
  }
  
  return generateProjectMetadata(
    item.title,
    item.description,
    item.image
  );
}

export default function PortfolioItem({ params }: { params: { slug: string } }) {
  const item = portfolioItems[params.slug];
  
  // If item doesn't exist, show 404 page
  if (!item) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
        
        <div className="mb-8 aspect-video relative overflow-hidden rounded-lg">
          {/* Replace with actual image path when available */}
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <p className="text-zinc-400">Portfolio Image Placeholder</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-3">
            <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
            <p className="text-zinc-300 mb-6">{item.description}</p>
            
            <h3 className="text-xl font-semibold mb-3">Details</h3>
            <div className="text-zinc-300 whitespace-pre-line">
              {item.details}
            </div>
          </div>
          
          <div className="col-span-1 bg-zinc-800 p-6 rounded-lg h-fit">
            <h3 className="text-xl font-semibold mb-4 border-b border-zinc-700 pb-2">Project Info</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-zinc-400 text-sm">Client</p>
                <p className="font-medium">{item.client}</p>
              </div>
              
              <div>
                <p className="text-zinc-400 text-sm">Year</p>
                <p className="font-medium">{item.year}</p>
              </div>
              
              <div>
                <p className="text-zinc-400 text-sm">Category</p>
                <p className="font-medium">{item.category}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <a 
            href="/portfolio" 
            className="inline-flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all known slugs
export function generateStaticParams() {
  return Object.keys(portfolioItems).map((slug) => ({
    slug,
  }));
} 