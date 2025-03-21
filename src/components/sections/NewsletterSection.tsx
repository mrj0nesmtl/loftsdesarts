"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // TODO: Implement actual newsletter subscription with Supabase
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setMessage({
        type: "success",
        text: "Thank you for subscribing to our newsletter!",
      });
      setEmail("");
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-zinc-900">
      <div className="container px-4 mx-auto md:px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-zinc-400 mb-8">
            Subscribe to our newsletter for the latest projects and industry news.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          
          {message && (
            <div 
              className={`mt-4 p-3 rounded-md ${message.type === "success" ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 