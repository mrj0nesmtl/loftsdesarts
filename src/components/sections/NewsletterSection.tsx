"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Veuillez entrer votre adresse e-mail");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    // Placeholder for API call to add subscriber
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      setEmail("");
    } catch (err) {
      setError("Échec de l'inscription. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-zinc-900">
      <div className="container px-4 mx-auto text-center md:px-6">
        <h2 className="text-3xl font-bold mb-4">Restez Informé</h2>
        <p className="text-zinc-400 max-w-md mx-auto mb-8">
          Abonnez-vous à notre infolettre pour recevoir les dernières annonces concernant l'immeuble, les événements communautaires et les avis importants.
        </p>
        
        {isSuccess ? (
          <div className="bg-zinc-800 text-green-400 p-4 rounded-md inline-block">
            Merci de vous être abonné!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre e-mail"
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-md transition-colors disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "En cours..." : "S'abonner"}
            </button>
          </form>
        )}
        
        {error && <p className="mt-3 text-red-400">{error}</p>}
      </div>
    </section>
  );
} 