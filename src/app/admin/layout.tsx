import { Metadata, Viewport } from "next";
import { AuthProvider } from "@/lib/auth";
import ClientAdminLayout from "../../components/admin/ClientAdminLayout";

export const metadata: Metadata = {
  title: "Administration | Syndicate Lofts des Arts",
  description: "Portail d'administration pour Syndicate Lofts des Arts"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ClientAdminLayout>
        {children}
      </ClientAdminLayout>
    </AuthProvider>
  );
} 