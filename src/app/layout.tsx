import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/context/ThemeProvider'
import { AuthProvider } from '@/lib/auth'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

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
