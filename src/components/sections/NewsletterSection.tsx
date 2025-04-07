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
      <div className="container px-4 mx-auto md:px-6">
        <div className="max-w-4xl mx-auto bg-zinc-800/50 border border-zinc-700 rounded-lg p-8 md:p-10 shadow-lg">
          <h2 className="text-3xl font-bold mb-4 font-title text-center">Restez Informé</h2>
          <p className="text-zinc-300 max-w-2xl mx-auto mb-8 text-center">
            Abonnez-vous à notre infolettre pour recevoir les dernières annonces concernant l'immeuble, les événements communautaires et les avis importants.
          </p>
          
          {isSuccess ? (
            <div className="bg-zinc-800 text-green-400 p-4 rounded-md max-w-md mx-auto text-center border border-green-700/30">
              <p className="font-medium">Merci de vous être abonné!</p>
              <p className="text-sm mt-1 text-green-300">Vous recevrez bientôt notre newsletter.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre e-mail"
                className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-md transition-colors disabled:opacity-70 shadow-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "En cours..." : "S'abonner"}
              </button>
            </form>
          )}
          
          {error && <p className="mt-3 text-red-400 text-center">{error}</p>}
        </div>
      </div>
    </section>
  );
} 