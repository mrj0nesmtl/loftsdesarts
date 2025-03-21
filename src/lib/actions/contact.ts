"use server";

import { supabase } from "@/lib/supabase";

export interface ContactFormData {
  name: string;
  email: string;
  project_type: string;
  message: string;
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    // Basic validation
    const { name, email, project_type, message } = formData;
    
    if (!name || !email || !project_type || !message) {
      return { 
        success: false, 
        error: "All fields are required." 
      };
    }
    
    // Email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Please enter a valid email address."
      };
    }

    const { data, error } = await supabase
      .from("contact_inquiries")
      .insert([formData]);

    if (error) {
      console.error("Error submitting contact form:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred. Please try again later." 
    };
  }
} 