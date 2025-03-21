"use client";

import { useState } from "react";
import { submitContactForm, ContactFormData } from "@/lib/actions/contact";

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    project_type: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null;
    message: string | null;
  }>({ type: null, message: null });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, message: null });

    try {
      const result = await submitContactForm(formData);
      
      if (result.success) {
        setFormStatus({
          type: "success",
          message: "Your message has been sent successfully. We'll be in touch soon!"
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          project_type: "",
          message: ""
        });
      } else {
        setFormStatus({
          type: "error",
          message: result.error || "Failed to send message. Please try again."
        });
      }
    } catch (error) {
      setFormStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
      {formStatus.type && (
        <div 
          className={`mb-6 p-4 rounded-md ${
            formStatus.type === "success" ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"
          }`}
        >
          {formStatus.message}
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
            required
          />
        </div>
        
        <div>
          <label htmlFor="project_type" className="block text-sm font-medium text-zinc-400 mb-1">
            Project Type
          </label>
          <select
            id="project_type"
            value={formData.project_type}
            onChange={handleChange}
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
          <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
            required
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
} 