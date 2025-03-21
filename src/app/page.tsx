"use client";

import Link from "next/link";
import { RootLayout } from "@/components/layout/RootLayout";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export default function Home() {
  return (
    <RootLayout>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-zinc-900 overflow-hidden">
        {/* TODO: Replace with actual video */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            We&apos;ll Burn That Bridge When We Get There
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-8">
            Special Effects by Marc Reichel
          </p>
          <Link 
            href="/portfolio" 
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-md transition-colors"
          >
            View Portfolio
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Latest Work Section */}
      <section className="py-16 bg-black">
        <div className="container px-4 mx-auto md:px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Latest Work</h2>
          
          {/* Grid placeholder - replace with actual portfolio items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-zinc-900 rounded-lg overflow-hidden">
                <div className="aspect-video bg-zinc-800" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">Project Title</h3>
                  <p className="text-zinc-400 text-sm">Film • 2023</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link
              href="/portfolio"
              className="inline-block border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
