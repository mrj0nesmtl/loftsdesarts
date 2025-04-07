import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lofts des Arts Admin Wiki",
  description: "Comprehensive guide for the Lofts des Arts building management system"
};

export default function WikiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      {children}
    </main>
  );
} 