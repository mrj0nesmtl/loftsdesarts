import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Connexion | Syndicate Lofts des Arts",
  description: "Connexion au portail d'administration pour Syndicate Lofts des Arts"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

 