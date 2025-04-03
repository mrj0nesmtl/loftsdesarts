import { Inter } from "next/font/google";
import { defaultMetadata, defaultViewport } from "@/lib/seo";
import { ThemeProvider } from "@/lib/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = defaultMetadata;
export const viewport = defaultViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} bg-background text-foreground dark:bg-black dark:text-white`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
