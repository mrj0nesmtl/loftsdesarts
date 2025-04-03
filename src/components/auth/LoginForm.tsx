"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message || "Adresse e-mail ou mot de passe invalide");
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite. Veuillez réessayer.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-6">Connexion Admin</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-zinc-700 border border-zinc-600 text-white"
            required
            autoComplete="username"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-zinc-700 border border-zinc-600 text-white"
            required
            autoComplete="current-password"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
} 