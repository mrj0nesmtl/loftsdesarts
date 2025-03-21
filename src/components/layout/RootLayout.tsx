import { Header } from "./Header";
import { Footer } from "./Footer";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
} 