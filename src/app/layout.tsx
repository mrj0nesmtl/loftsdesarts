import './globals.css'
import { Inter, Poiret_One } from 'next/font/google'
import { ThemeProvider } from '@/context/ThemeProvider'
import { AuthProvider } from '@/lib/auth'
import { Toaster } from '@/components/ui/toaster'

// Configure Inter font with better fallback and preload settings
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  variable: '--font-inter',
})

// Configure Poiret One font with better fallback and preload settings
const poiretOne = Poiret_One({ 
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-poiret-one',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
})

export const metadata = {
  title: 'Lofts des Arts',
  description: 'Portail du Syndicat Lofts des Arts',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${poiretOne.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
