import './globals.css'
import { Inter, Poiret_One } from 'next/font/google'
import { ThemeProvider } from '@/context/ThemeProvider'
import { AuthProvider } from '@/lib/auth'
import { Toaster } from '@/components/ui/toaster'

// Configure Inter font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Configure Poiret One font - FORCE LOAD WITH NO FALLBACKS
const poiretOne = Poiret_One({ 
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-poiret-one',
  display: 'block', // Changed from 'swap' to 'block' to ensure it displays only when loaded
  preload: true,
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
    <html lang="fr" suppressHydrationWarning className={`${poiretOne.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poiret+One&display=swap"
          rel="stylesheet"
        />
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
