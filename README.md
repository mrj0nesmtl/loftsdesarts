# STTS - Special Effects Studio Website

A cinematic, dark-themed showcase website for legendary Canadian special effects coordinator and demolitions expert Marc Reichel.

## Overview

This website serves as a showcase and lead generation platform for STTS (Special Effects Studio), featuring:
- Career highlights and portfolio
- Interactive highlight reel
- Contact information for booking
- Newsletter subscription
- Social media integration

## Project Vision

> "We'll Burn That Bridge When We Get There"

The site aims to deliver a cinematic experience with a dark, industrial aesthetic inspired by Michael Bay meets Blade Runner. It features high-contrast visuals, gritty textures, and explosive elements that showcase Marc's unique expertise in special effects.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **State Management**: Zustand
- **Backend**: Supabase (Auth, Storage, Database)
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query
- **Deployment**: Replit

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/mrj0nesmtl/stts.git
   cd stts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   
   # Optional: For email notifications
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-specific-password
   ADMIN_EMAIL=notifications-recipient@example.com
   ```

4. Set up Supabase:
   - Create a new project in Supabase
   - Run the following SQL in the Supabase SQL editor to create the contact inquiries table:
   ```sql
   -- Create the contact inquiries table
   CREATE TABLE contact_inquiries (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
     project_type TEXT NOT NULL,
     message TEXT NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );

   -- Create a trigger to automatically update the updated_at column
   CREATE OR REPLACE FUNCTION update_modified_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER update_contact_inquiries_updated_at
   BEFORE UPDATE ON contact_inquiries
   FOR EACH ROW
   EXECUTE FUNCTION update_modified_column();

   -- Set up Row Level Security (RLS)
   ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

   -- Create policy for admins to view all inquiries
   CREATE POLICY "Admins can view all inquiries" 
   ON contact_inquiries 
   FOR SELECT 
   USING (auth.role() = 'authenticated');

   -- Create policy for anonymous users to insert new inquiries
   CREATE POLICY "Anyone can submit an inquiry" 
   ON contact_inquiries 
   FOR INSERT 
   WITH CHECK (true);
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Pages

1. **Landing Page** - Featuring hero video, newsletter, latest work showcase
2. **Portfolio/Repertoire** - Dynamic grid of selected projects with categorized sections
3. **Contact & About** - Split layout with contact form and biographical information

## Development Status

Currently in development. Check the GitHub Issues for current development tasks and progress.

## Team

Developed by [Your Name] in collaboration with Marc Reichel.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Admin Dashboard Features

The admin dashboard provides a secure interface for managing contact form submissions:

- **Authentication**: Secure login for administrators
- **Dashboard**: Overview of recent activity and key metrics
- **Inquiries**: View, manage, and respond to contact form submissions
- **Real-time Updates**: Get notifications when new submissions arrive
- **Email Notifications**: Receive email alerts for new contact form submissions

## Development Guidelines

- Follow the TypeScript strict type checking
- Use Next.js App Router patterns
- Maintain accessibility standards
- Test across different browsers and devices
- Keep dependencies updated

## Contact

For questions about this project, please contact [Your Name] at [your.email@example.com].

## License

This project is proprietary and owned by STTS.
