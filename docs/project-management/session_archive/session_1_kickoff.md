# Lofts des Arts Website - Session 1 Kickoff

## Project Overview
This is the official website for **Lofts des Arts Condominiums** located at 1625 Clark, Montreal, Quebec, Canada H2X 2R5. Built using **Next.js 14**, this site will serve as the digital presence for the condominium, providing information about the building, amenities, and offering direct contact options for current and prospective residents.

## Project Vision
> "Celebrating community living in the heart of Montreal"

The site will deliver an elegant, sophisticated experience with an aesthetic that reflects the industrial-chic character of Lofts des Arts. It will feature high-quality visuals of the building, common areas, and surrounding neighborhood to showcase the unique living experience offered by this condominium.

## Key Objectives
1. Create an informative and visually appealing website for current and prospective residents
2. Provide easy access to condominium information and board contact details
3. Implement a secure admin dashboard for board members
4. Develop a parcel management system for doormen and security staff

## Target Audience
- Current condominium residents
- Prospective buyers and real estate agents
- Visitors and guests
- Board members and property management staff

## Architecture

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Shadcn/ui components
- **State Management**: Zustand
- **Form Handling**: react-hook-form + zod
- **Data Fetching**: TanStack Query v5

### Backend
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Security**: Supabase RLS + Custom RBAC

### Infrastructure
- **Hosting**: Replit
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry
- **Analytics**: Custom + Recharts

## Features & Pages

### Public-Facing
- **Home/Landing Page**: Featuring hero video and key information about the condominium
- **About Page**: Building history, amenities, and surrounding neighborhood
- **Gallery**: Photo gallery showcasing the condominium's architecture, common spaces, and views
- **Contact**: Contact form for inquiries to the board of directors

### Admin Dashboard
- **Authentication**: Secure login for board members and staff
- **Dashboard Overview**: Recent activity and key metrics
- **Inquiries Management**: View and respond to contact form submissions
- **Parcel Management System**: Track deliveries for residents
- **Content Management**: Update website content and gallery

## Timeline
- **Session 1**: Project setup and documentation
- **Sessions 2-3**: Public pages development
- **Sessions 4-5**: Admin dashboard development
- **Sessions 6-7**: Parcel management system
- **Sessions 8-9**: Testing, refinement, and deployment

## Next Steps
1. Set up project repository and initial Next.js 14 structure
2. Review existing components and adapt them for the new purpose
3. Develop placeholder content for main pages
4. Create new visual assets for the condominium website 