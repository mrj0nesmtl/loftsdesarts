import { AuthProvider } from '@/lib/auth';
import { Inter } from "next/font/google";
import { defaultMetadata, defaultViewport } from "@/lib/seo";
import { ThemeProvider } from "@/lib/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Lofts des Arts - Administration',
  description: 'Tableau de bord d\'administration du Syndicat Lofts des Arts',
};

export const viewport = defaultViewport;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground dark:bg-black dark:text-white`}>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
