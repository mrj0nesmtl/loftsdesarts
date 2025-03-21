import { Inter } from "next/font/google";
import { defaultMetadata } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white dark:bg-black dark:text-white`}>
        {children}
      </body>
    </html>
  );
}
