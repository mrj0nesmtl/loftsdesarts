'use server';

import { supabase } from '@/lib/supabase';
import { z } from 'zod';

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
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
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
        error: 'Validation failed',
        fieldErrors,
        success: false,
      };
    }

    // All validation passed, store in Supabase
    const { error } = await supabase.from('contact_inquiries').insert({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      message: result.data.message,
      viewed: false, // Add viewed status field
    });

    if (error) {
      console.error('Supabase error:', error);
      return {
        error: 'Failed to submit form. Please try again later.',
        success: false,
      };
    }

    return {
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      error: 'An unexpected error occurred. Please try again later.',
      success: false,
    };
  }
} 