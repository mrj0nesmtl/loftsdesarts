"use client";

import Image from "next/image";
import { RootLayout } from "@/components/layout/RootLayout";

// Mock data - replace with actual portfolio data later
const projects = [
  { id: 1, title: "Arrival", year: 2016, type: "Film", image: "/placeholder.jpg" },
  { id: 2, title: "Nobody", year: 2021, type: "Film", image: "/placeholder.jpg" },
  { id: 3, title: "Source Code", year: 2011, type: "Film", image: "/placeholder.jpg" },
  { id: 4, title: "The Flash", year: 2023, type: "TV Series", image: "/placeholder.jpg" },
  { id: 5, title: "Stumptown", year: 2019, type: "TV Series", image: "/placeholder.jpg" },
  { id: 6, title: "Product Launch", year: 2022, type: "Commercial", image: "/placeholder.jpg" },
  { id: 7, title: "Altered Carbon", year: 2018, type: "TV Series", image: "/placeholder.jpg" },
  { id: 8, title: "Deadpool", year: 2016, type: "Film", image: "/placeholder.jpg" },
];

export default function PortfolioPage() {
  return (
    <RootLayout>
      <div className="container mx-auto px-4 py-12 md:px-6">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Explore Marc Reichel&apos;s extensive work in film, television, and commercial special effects.
          </p>
        </div>

        {/* Video Highlight Reel (Using image as placeholder) */}
        <div className="mb-16">
          <div className="aspect-video bg-zinc-800 rounded-lg mb-4 relative overflow-hidden">
            <Image 
              src="/flak_jacket_patch.jpg" 
              alt="Marc Reichel's Special Effects - Flak Jacket Patch"
              fill
              className="object-contain" 
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="bg-black/70 text-white px-6 py-3 rounded-md">
                Highlight Reel Coming Soon
              </div>
            </div>
          </div>
          <p className="text-center text-zinc-400 text-sm">
            Marc Reichel&apos;s Special Effects Highlight Reel
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button className="px-4 py-2 rounded-full bg-red-600 text-white">All</button>
          <button className="px-4 py-2 rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800">Film</button>
          <button className="px-4 py-2 rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800">TV Series</button>
          <button className="px-4 py-2 rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800">Commercial</button>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-zinc-900 rounded-lg overflow-hidden">
              <div className="aspect-video bg-zinc-800" />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                <p className="text-zinc-400 text-sm">{project.type} • {project.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RootLayout>
  );
} 