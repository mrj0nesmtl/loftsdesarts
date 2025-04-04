'use server';

import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Create admin client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Import for URL validation
function isValidUrl(urlString: string): boolean {
  try {
    // URL constructor will throw for invalid URLs
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Une adresse e-mail valide est requise'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Le message doit comporter au moins 10 caractères'),
});

type FormValues = z.infer<typeof formSchema>;

export async function submitContactForm(formData: FormData) {
  try {
    // Convert FormData to an object
    const rawFormData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    };

    // Validate form data
    const result = formSchema.safeParse(rawFormData);

    if (!result.success) {
      // Return validation errors
      const fieldErrors = result.error.flatten().fieldErrors;
      return {
        error: 'Validation échouée',
        fieldErrors,
        success: false,
      };
    }

    // All validation passed, store in Supabase using admin client to bypass RLS
    const { data, error } = await supabaseAdmin.from('contact_inquiries').insert({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      message: result.data.message,
      viewed: false, // Add viewed status field
    }).select();

    if (error) {
      console.error('Supabase error:', error);
      return {
        message: 'Échec de l\'envoi du formulaire. Veuillez réessayer plus tard.',
        success: false,
      };
    }

    console.log('Contact form submitted successfully:', data);
    
    return {
      success: true,
      message: 'Merci pour votre message! Nous vous répondrons bientôt.',
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      error: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.',
      success: false,
    };
  }
} 