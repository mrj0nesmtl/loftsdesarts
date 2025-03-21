import { RootLayout } from "@/components/layout/RootLayout";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootLayout>
      <div className="pt-16">
        {children}
      </div>
    </RootLayout>
  );
} 