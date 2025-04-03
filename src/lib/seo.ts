import { Metadata, Viewport } from 'next';

// Base site details
const siteName = 'Lofts des Arts';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://loftsdesarts.replit.app';
const siteDescription = 'Condominiums de luxe au cœur de Montréal, avec vue sur le Quartier des Spectacles.';
const siteImage = `${siteUrl}/lda_bg.png`;

// Default viewport configuration
export const defaultViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Default metadata
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'condominiums',
    'lofts',
    'montréal',
    'quartier des spectacles',
    'luxe',
    'prestige',
    'piscine',
    'terrasse',
    'sécurité',
    'centre-ville',
  ],
  authors: [{ name: 'Syndicate Lofts des Arts' }],
  creator: 'Syndicate Lofts des Arts',
  publisher: 'Syndicate Lofts des Arts',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: siteImage,
        width: 1200,
        height: 630,
        alt: 'Lofts des Arts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: [siteImage],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    // Add your verification tokens here when available
    // google: 'your-google-verification',
    // bing: 'your-bing-verification',
  },
};

/**
 * Generate metadata for a specific page
 */
export function generateMetadata(
  title: string,
  description?: string,
  image?: string,
  extraMetadata?: Partial<Metadata>
): Metadata {
  // Default to site description if none provided
  const metaDescription = description || defaultMetadata.description || '';
  
  // Default to site image if none provided
  const ogImage = image || (defaultMetadata.openGraph?.images as any)?.[0]?.url;
  
  return {
    title,
    description: metaDescription,
    openGraph: {
      title,
      description: metaDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description: metaDescription,
      images: [ogImage],
    },
    ...extraMetadata,
  };
}

/**
 * Generate portfolio project metadata
 */
export function generateProjectMetadata(
  projectTitle: string,
  projectDescription: string,
  projectImage?: string
): Metadata {
  const title = `${projectTitle} - Portfolio`;
  return generateMetadata(
    title,
    projectDescription,
    projectImage,
    {
      openGraph: {
        type: 'article',
      },
    }
  );
}

/**
 * Generate article/blog metadata
 */
export function generateArticleMetadata(
  articleTitle: string,
  articleDescription: string,
  publishDate: string,
  authorName?: string,
  articleImage?: string
): Metadata {
  const title = `${articleTitle}`;
  
  return generateMetadata(
    title,
    articleDescription,
    articleImage,
    {
      openGraph: {
        type: 'article',
        publishedTime: publishDate,
        authors: authorName ? [authorName] : ['Syndicate Lofts des Arts'],
      },
    }
  );
} 