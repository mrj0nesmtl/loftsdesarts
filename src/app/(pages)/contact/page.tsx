"use client";

import { RootLayout } from "@/components/layout/RootLayout";

export default function ContactPage() {
  return (
    <RootLayout>
      <div className="container mx-auto px-4 py-12 md:px-6">
        <h1 className="text-4xl font-bold text-center mb-12">Contact & About</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="project-type" className="block text-sm font-medium text-zinc-400 mb-1">Project Type</label>
                <select
                  id="project-type"
                  className="w-full px-4 py-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
                  required
                >
                  <option value="">Select a project type</option>
                  <option value="film">Film</option>
                  <option value="tv">TV</option>
                  <option value="commercial">Commercial</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-1">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
          
          {/* About Marc Reichel */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">About Marc Reichel</h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300 mb-4">
                Marc Reichel is a legendary Canadian special effects coordinator and demolitions expert with over 100 film credits across blockbusters like <em>Arrival</em>, <em>Nobody</em>, <em>Source Code</em>, and more.
              </p>
              
              <p className="text-zinc-300 mb-4">
                With a military background and a family legacy in special effects, Marc has built a reputation for creating spectacular, safe, and innovative practical effects for the entertainment industry.
              </p>
              
              <h3 className="text-xl font-semibold mt-8 mb-4">Studio Information</h3>
              
              <p className="text-zinc-300 mb-4">
                STTS (Special Effects Studio) is based in Montreal, serving productions worldwide with state-of-the-art facilities and equipment for creating cinematic special effects.
              </p>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Connect</h3>
                <div className="flex gap-4">
                  <a 
                    href="https://www.imdb.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-white transition-colors"
                  >
                    IMDb Profile
                  </a>
                  <a 
                    href="https://www.instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-white transition-colors"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
} 