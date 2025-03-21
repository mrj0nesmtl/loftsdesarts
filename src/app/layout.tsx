import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "STTS - Special Effects Studio",
  description: "Showcase and lead generation website for Marc Reichel's special effects studio",
};

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
