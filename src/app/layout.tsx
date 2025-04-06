import './globals.css'
import { Inter, Poiret_One } from 'next/font/google'
import { ThemeProvider } from '@/context/ThemeProvider'
import { AuthProvider } from '@/lib/auth'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })
const poiretOne = Poiret_One({ 
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-poiret-one',
  display: 'swap'
})

export const metadata = {
  title: 'Lofts des Arts',
  description: 'Portail du Syndicat Lofts des Arts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} ${poiretOne.variable}`}>
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
