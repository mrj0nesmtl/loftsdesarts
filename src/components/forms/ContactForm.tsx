"use client";

import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { submitContactForm } from "@/app/(pages)/contact/actions";

type FormValues = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export function ContactForm() {
  const [formStatus, setFormStatus] = useState<{
    success?: boolean;
    message?: string;
    fieldErrors?: Record<string, string[]>;
  }>({});
  const [isPending, startTransition] = useTransition();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    
    startTransition(async () => {
      try {
        const result = await submitContactForm(formData);
        setFormStatus(result);
        
        if (result.success) {
          reset();
          // Scroll to the top of the form to show success message
          window.scrollTo({
            top: window.scrollY - 200,
            behavior: 'smooth',
          });
        }
      } catch (err) {
        console.error('Error submitting form:', err);
        setFormStatus({
          success: false,
          message: 'Une erreur s\'est produite lors de l\'envoi du formulaire. Veuillez réessayer.'
        });
      }
    });
  };
  
  return (
    <div className="bg-zinc-900 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Contactez le Conseil</h2>
      
      {formStatus.success ? (
        <div className="bg-green-900/50 text-green-300 p-4 rounded-md mb-6">
          {formStatus.message || "Votre message a été envoyé avec succès."}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Votre Nom
            </label>
            <input
              id="name"
              type="text"
              className={`w-full px-4 py-2 bg-zinc-800 border ${
                errors.name ? "border-red-500" : "border-zinc-700"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600`}
              {...register("name", { required: "Le nom est requis" })}
              disabled={isPending}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Adresse E-mail
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-4 py-2 bg-zinc-800 border ${
                errors.email ? "border-red-500" : "border-zinc-700"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600`}
              {...register("email", {
                required: "L'e-mail est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Adresse e-mail invalide",
                },
              })}
              disabled={isPending}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium">
              Numéro de Téléphone <span className="text-zinc-500">(Optionnel)</span>
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600"
              {...register("phone")}
              disabled={isPending}
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block mb-2 text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              className={`w-full px-4 py-2 bg-zinc-800 border ${
                errors.message ? "border-red-500" : "border-zinc-700"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600`}
              {...register("message", {
                required: "Le message est requis",
                minLength: {
                  value: 10,
                  message: "Le message doit comporter au moins 10 caractères",
                },
              })}
              disabled={isPending}
            ></textarea>
            {errors.message && (
              <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>
          
          {formStatus.message && !formStatus.success && (
            <div className="bg-red-900/50 text-red-300 p-4 rounded-md">
              {formStatus.message}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-md transition-colors disabled:opacity-70"
            disabled={isPending}
          >
            {isPending ? "Envoi en cours..." : "Envoyer le Message"}
          </button>
          
          <p className="text-sm text-zinc-500 mt-4">
            Votre demande sera envoyée au Conseil d'Administration des Lofts des Arts.
          </p>
        </form>
      )}
    </div>
  );
} 