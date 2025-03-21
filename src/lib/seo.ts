import { Metadata } from 'next';

// Base site details
const siteName = 'STTS - Special Effects Studio';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stts-fx.replit.app';
const siteDescription = 'Professional special effects studio based in Winnipeg, Canada, specializing in practical effects for film and television.';
const siteImage = `${siteUrl}/og-image.png`;

// Default metadata
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'special effects',
    'practical effects',
    'film production',
    'television production',
    'visual effects',
    'SFX studio',
    'Winnipeg',
    'Canada',
    'movie effects',
    'Marc Reichel',
  ],
  authors: [{ name: 'Marc Reichel' }],
  creator: 'Marc Reichel',
  publisher: 'STTS Special Effects',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: siteImage,
        width: 1200,
        height: 630,
        alt: 'STTS - Special Effects Studio',
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
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
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
  const metaDescription = description || defaultMetadata.description;
  
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
        authors: authorName ? [authorName] : ['Marc Reichel'],
      },
    }
  );
} 